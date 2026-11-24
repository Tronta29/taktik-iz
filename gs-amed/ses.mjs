// ElevenLabs v3 ile senaryoyu tek istekte seslendirir, kelime zamanlarını kaydeder.
// Kullanım: node ses.mjs   (ELEVENLABS_API_KEY ortam değişkeni gerekir)
import {writeFileSync, mkdirSync} from 'node:fs';
import {execSync} from 'node:child_process';

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'IogiFmQVGaEXSHlBDtxT';
let key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  key = execSync("powershell -NoProfile -Command \"[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')\"").toString().trim();
}
if (!key) throw new Error('ELEVENLABS_API_KEY bulunamadı');

// Her eleman bir sahne. Etiketler [..] sesi yönlendirir, altyazıya girmez.
const SAHNELER = [
  "[excited] Galatasaray'ın kadrosu Amedspor'dan on iki kat değerli. [short pause] Ama bu maçı para değil, tek bir açık belirleyecek.",
  "Lider Galatasaray, ikinci Amedspor ile karşılaşıyor. Aradaki fark sadece iki puan. Gol beklentisi, yani x G'de de neredeyse eşitler. [short pause] Galatasaray iki virgül otuz altı, Amedspor iki virgül yirmi üç.",
  "[serious] İkisinin de kilit ismi yok. [short pause] Amedspor'da Ballet, Galatasaray'da Bardakcı cezalı.",
  "[excited] Galatasaray'ın zayıf noktası hızlı hücum, yani top kapıldıktan sonraki ilk saniyeler. Yediği yedi şuttan dördü gol oldu. [short pause] Amedspor'un en büyük silahı da tam olarak bu. Hızlı hücumdan dört virgül yetmiş dört x G.",
  "Ama Amedspor deplasmanda sadece bir virgül otuz sekiz x G üretiyor. [short pause] Galatasaray evinde ise iki virgül elli dört.",
  "Model Galatasaray'a yüzde altmış altı veriyor. Ama arkası açılırsa, Amedspor cezalandırır. [short pause] Sence skor ne olur? Yoruma yaz. Daha fazlası için Taktik İz'i takip et.",
];

const metin = SAHNELER.join(' ');
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify({text: metin, model_id: 'eleven_v3', language_code: 'tr', voice_settings: {stability: 0.5, speed: 1.1}}),
});
if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 500)}`);
const j = await r.json();

mkdirSync('public', {recursive: true});
writeFileSync('public/ses.mp3', Buffer.from(j.audio_base64, 'base64'));

// Karakter zamanlarından kelime zamanları (köşeli parantezli etiketler atılır)
const a = j.alignment;
const ch = a.characters, st = a.character_start_times_seconds, en = a.character_end_times_seconds;
const kelimeler = [];
let cur = '', s0 = 0, e0 = 0, depth = 0, bas = null;
const flush = () => { if (cur) kelimeler.push({k: cur, bas: s0, bit: e0}); cur = ''; };
for (let i = 0; i < ch.length; i++) {
  const c = ch[i];
  if (c === '[') { flush(); depth++; continue; }
  if (c === ']') { depth = Math.max(0, depth - 1); continue; }
  if (depth) continue;
  if (/\s/.test(c)) { flush(); continue; }
  if (!cur) s0 = st[i];
  cur += c; e0 = en[i];
}
flush();

// Sahne sınırları: her sahnenin ilk kelimesi (temizlenmiş metne göre) sırayla bulunur
const sayilar = SAHNELER.map(s => s.replace(/\[[^\]]*\]/g, '').trim().split(/\s+/).length);
let idx = 0;
const sahneler = sayilar.map((n, i) => {
  const bas = kelimeler[idx].bas;
  idx += n;
  return {id: i + 1, bas};
});
const toplam = en[en.length - 1];
sahneler.forEach((s, i) => { s.bit = i + 1 < sahneler.length ? sahneler[i + 1].bas : toplam; });

writeFileSync('veri.json', JSON.stringify({toplam, sahneler, kelimeler, sahneKelimeSayisi: sayilar}, null, 1));
console.log('Toplam süre:', toplam.toFixed(2), 'sn; kelime:', kelimeler.length, '(beklenen', sayilar.reduce((a, b) => a + b), ')');
sahneler.forEach(s => console.log(s.id, s.bas.toFixed(2), '→', s.bit.toFixed(2)));
