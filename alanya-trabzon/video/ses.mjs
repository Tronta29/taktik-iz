// uzun-metin.md -> sahne sahne ElevenLabs seslendirme + kelime zamanları (veri.json)
// Ekranda doğru yazım, seslendirmede okunuş sözlüğü uygulanır. Kullanım: node ses.mjs [kuru]
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {execSync} from 'node:child_process';

const KURU = process.argv[2] === 'kuru';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'IogiFmQVGaEXSHlBDtxT';
let key = process.env.ELEVENLABS_API_KEY;
if (!key) key = execSync("powershell -NoProfile -Command \"[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')\"").toString().trim();
if (!key && !KURU) throw new Error('ELEVENLABS_API_KEY yok');

// ---- okunuş sözlüğü (ekran yazımı -> seslendirme yazımı; token sayısı değişmez) ----
const SOZLUK = [
  ['xGA', 'iks_ci_ey'], ['xG', 'iks_ci'],
  ['Nwaiwu', 'Nuvayvu'], ['Savić', 'Saviç'], ['Fabinho', 'Fabinyo'], ['Djú', 'Cu'], ['Batagov', 'Batagof'],
  ['Malinovskyi', 'Malinovski'], ['Onuachu', 'Onuaçu'], ['Hadergjonaj', 'Hadergyonay'], ['Makouta', 'Makuta'],
  ['Victor', 'Viktor'], ['Iván', 'İvan'], ['Cédric', 'Sedrik'], ['Fernandes', 'Fernandeş'],
  ['Okay', 'O_kay'], ['Thomas', 'Tomas'], ['Reis', 'Rays'], ['João', 'Juau'], ['Pereira', 'Pereyra'],
];
const KELIME = {1:'bir',2:'iki',3:'üç',4:'dört',5:'beş',6:'altı',7:'yedi',8:'sekiz',9:'dokuz'};
const ONLAR = {1:'on',2:'yirmi',3:'otuz',4:'kırk',5:'elli',6:'altmış',7:'yetmiş',8:'seksen',9:'doksan'};
const sayi = (n) => n < 10 ? KELIME[n] : n < 100 ? ONLAR[Math.floor(n / 10)] + (n % 10 ? '_' + KELIME[n % 10] : '') : String(n);
function konus(tok) {
  let s = tok;
  s = s.replace(/(\d+)\./g, (m, d) => (d === '60' ? 'altmışıncı' : sayi(+d) + '.'));
  s = s.replace(/\d+/g, (d) => sayi(+d));
  for (const [a, b] of SOZLUK) s = s.split(a).join(b);
  return s;
}

// ---- md ayrıştırma ----
const md = readFileSync('../uzun-metin.md', 'utf8');
const bloklar = md.split(/^(?=### Sahne )/m).slice(1);
const sahneler = bloklar.map((b) => {
  const bas = b.match(/^### Sahne (\d+) — (.*?) \[/);
  const ses = b.match(/^SES: ([\s\S]*?)^EKRAN:/m)[1].replace(/\*\*/g, '').trim();
  const tokens = [];
  let pause = false;
  for (const raw of ses.replace(/\s+/g, ' ').split(' ')) {
    if (raw === '[DURAK]') { pause = true; continue; }
    tokens.push({disp: raw, speech: konus(raw), pause});
    pause = false;
  }
  return {id: +bas[1], baslik: bas[2], tokens};
});

mkdirSync('public/ses', {recursive: true});
const sonuc = [];
let global = 0;
const ARA = 0.45;

for (const s of sahneler) {
  // gönderilen metin + token karakter aralıkları
  let sent = '';
  const span = [];
  for (const t of s.tokens) {
    if (t.pause) sent += '[short pause] ';
    const x = t.speech.replace(/_/g, ' ');
    span.push([sent.length, sent.length + x.length]);
    sent += x + ' ';
  }
  sent = sent.trim();
  const dosya = `public/ses/s${String(s.id).padStart(2, '0')}.mp3`;
  const onbellek = dosya.replace('.mp3', '.json');
  let al;
  if (existsSync(dosya) && existsSync(onbellek)) {
    al = JSON.parse(readFileSync(onbellek, 'utf8'));
    console.log('önbellek', s.id);
  } else if (KURU) {
    console.log(`--- Sahne ${s.id} (${sent.length} karakter)\n${sent}\n`);
    continue;
  } else {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST', headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
      body: JSON.stringify({text: sent, model_id: 'eleven_v3', language_code: 'tr', voice_settings: {stability: 0.5, speed: 1.05}}),
    });
    if (!r.ok) throw new Error(`Sahne ${s.id}: ElevenLabs ${r.status} ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    writeFileSync(dosya, Buffer.from(j.audio_base64, 'base64'));
    al = {alignment: j.alignment, sent};
    writeFileSync(onbellek, JSON.stringify(al));
    console.log('üretildi', s.id, sent.length, 'karakter');
  }
  const a = al.alignment;
  const st = a.character_start_times_seconds, en = a.character_end_times_seconds;
  const n = st.length;
  const kelimeler = s.tokens.map((t, i) => {
    const [c0, c1] = span[i];
    const i0 = Math.min(n - 1, c0), i1 = Math.min(n - 1, Math.max(c0, c1 - 1));
    return {k: t.disp, bas: st[i0], bit: en[i1]};
  });
  const sure = en[n - 1] + 0.25;
  sonuc.push({id: s.id, baslik: s.baslik, bas: global, sure, kelimeler: kelimeler.map((w) => ({k: w.k, bas: +(global + w.bas).toFixed(3), bit: +(global + w.bit).toFixed(3)}))});
  global += sure + ARA;
}
if (!KURU) {
  writeFileSync('veri.json', JSON.stringify({toplam: +(global - ARA).toFixed(2), sahneler: sonuc}));
  console.log('Toplam süre:', (global - ARA).toFixed(1), 'sn =', ((global - ARA) / 60).toFixed(2), 'dk');
}
