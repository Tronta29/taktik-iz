// Shorts senaryosunu (sahneler.mjs) ElevenLabs v3 ile tek istekte seslendirir, kelime zamanlarını kaydeder.
// Ekranda doğru yazım, seslendirmede okunuş sözlüğü uygulanır. Kullanım: node ses.mjs [kuru]
import {writeFileSync, mkdirSync, readFileSync, existsSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {SAHNELER} from './sahneler.mjs';

const KURU = process.argv[2] === 'kuru';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'IogiFmQVGaEXSHlBDtxT';
let key = process.env.ELEVENLABS_API_KEY;
if (!key && !KURU) key = execSync("powershell -NoProfile -Command \"[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')\"").toString().trim();
if (!key && !KURU) throw new Error('ELEVENLABS_API_KEY bulunamadı');

// ekran yazımı -> seslendirme yazımı (alt çizgi = boşluk; token sayısı değişmez)
const SOZLUK = [
  ['xGA', 'iks_ci_ey'], ['xG', 'iks_ci'],
  ['Nwaiwu', 'Nuvayvu'], ['Hadergjonaj', 'Hadergyonay'], ['Malinovskyi', 'Malinovski'], ['Batagov', 'Batagof'], ['Djú', 'Cu'],
  ['Fernandes', 'Fernandeş'], ['Trossard', 'Trosar'], ['Gouveia', 'Goveya'], ['Murillo', 'Murilyo'], ['Olaitan', 'Olaytan'],
  ['Agbadou', 'Agbadu'], ['Goutas', 'Gutas'], ['Thalisson', 'Talisson'], ['Italiano', 'İtalyano'], ['Storck', 'Ştork'],
  ['Ndidi', 'Endidi'], ['Traoré', 'Traore'], ['Niasse', 'Niyas'], ['Diabate', 'Diyabate'], ['Brown', 'Braun'],
  ['Asensio', 'Asensiyo'], ['Aké', 'Ake'], ['Greenwood', 'Grinvud'], ['Ramírez', 'Ramires'], ['Kyziridis', 'Kiziridis'],
];
const HARF = {ć: 'ç', č: 'ç', Č: 'Ç', ý: 'i', š: 'ş', ž: 'j', ő: 'ö', ń: 'n'};
const konus = (tok) => {
  let s = tok;
  for (const [a, b] of SOZLUK) s = s.split(a).join(b);
  return s.replace(/[ćčČýšžőń]/g, (c) => HARF[c]);
};

// token + karakter aralıkları
let sent = '';
const kelimeler = []; // {k, span}
const sayilar = [];
for (const sc of SAHNELER) {
  let n = 0;
  for (const tok of sc.match(/\[[^\]]*\]|\S+/g)) {
    if (tok.startsWith('[')) { sent += tok + ' '; continue; }
    const x = konus(tok).replace(/_/g, ' ');
    kelimeler.push({k: tok, span: [sent.length, sent.length + x.length]});
    sent += x + ' ';
    n++;
  }
  sayilar.push(n);
}
sent = sent.trim();
if (KURU) { console.log(sent); process.exit(0); }

mkdirSync('public', {recursive: true});
let al;
if (existsSync('public/ses.mp3') && existsSync('ses_align.json') && JSON.parse(readFileSync('ses_align.json', 'utf8')).sent === sent) {
  al = JSON.parse(readFileSync('ses_align.json', 'utf8'));
  console.log('önbellekten');
} else {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST', headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
    body: JSON.stringify({text: sent, model_id: 'eleven_v3', language_code: 'tr', voice_settings: {stability: 0.5, speed: 1.1}}),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 500)}`);
  const j = await r.json();
  writeFileSync('public/ses.mp3', Buffer.from(j.audio_base64, 'base64'));
  al = {sent, alignment: j.alignment};
  writeFileSync('ses_align.json', JSON.stringify(al));
}
const a = al.alignment;
const st = a.character_start_times_seconds, en = a.character_end_times_seconds, n = st.length;
const kel = kelimeler.map((w) => {
  const i0 = Math.min(n - 1, w.span[0]), i1 = Math.min(n - 1, Math.max(w.span[0], w.span[1] - 1));
  return {k: w.k, bas: st[i0], bit: en[i1]};
});
let idx = 0;
const sahneler = sayilar.map((c, i) => { const bas = kel[idx].bas; idx += c; return {id: i + 1, bas}; });
const toplam = en[n - 1];
sahneler.forEach((s, i) => { s.bit = i + 1 < sahneler.length ? sahneler[i + 1].bas : toplam; });
writeFileSync('veri.json', JSON.stringify({toplam, sahneler, kelimeler: kel, sahneKelimeSayisi: sayilar}, null, 1));
console.log('Toplam süre:', toplam.toFixed(2), 'sn; kelime:', kel.length);
sahneler.forEach((s) => console.log(s.id, s.bas.toFixed(2), '→', s.bit.toFixed(2)));
