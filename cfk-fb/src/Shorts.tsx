import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import veri from '../veri.json';

// ---- Görsel şema renkleri (taktik-iz-gorsel-sema.md) ----
const C = {
  bg: '#071510', panel: '#0f2a1c', kenar: '#1f5a38', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6',
  saha: '#155f34', seritA: '#17703c', seritB: '#1c7a43', sari: '#ffd60a', kirmizi: '#ff4d3d', mavi: '#4fc3ff',
};
type Tema = {ic: string; halka: string; no: string};
const FB: Tema = {ic: '#0b2a6b', halka: '#ffe600', no: '#ffffff'};
const COR: Tema = {ic: '#c8102e', halka: '#ffffff', no: '#ffffff'};
const FONT = "'Montserrat', sans-serif";

// ---- Zaman yardımcıları ----
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const seg = (t: number, a: number, b: number) => ease(lin(t, a, b));
const pop = (t: number, a: number, b: number) => Easing.out(Easing.back(2.2))(lin(t, a, b));
const kf = (t: number, pts: [number, number][]) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, v0] = pts[i - 1], [t1, v1] = pts[i];
      const p = Easing.inOut(Easing.quad)((t - t0) / (t1 - t0));
      return v0 + (v1 - v0) * p;
    }
  }
  return pts[pts.length - 1][1];
};
const virgul = (v: number, d = 2) => v.toFixed(d).replace('.', ',');

// ---- Kelimeler (karaoke) ----
type Kelime = {k: string; bas: number; bit: number};
const KELIMELER: Kelime[] = [];
(veri.kelimeler as Kelime[]).forEach((w, i, arr) => {
  if (w.k === 'x' && arr[i + 1]?.k.startsWith('G')) return;
  if (i > 0 && arr[i - 1].k === 'x' && w.k.startsWith('G')) {
    KELIMELER.push({k: 'xG' + w.k.slice(1), bas: arr[i - 1].bas, bit: w.bit});
    return;
  }
  if (w.k === 'Taktik' && arr[i + 1]?.k.startsWith('İz')) {
    KELIMELER.push({k: 'Taktik ' + arr[i + 1].k, bas: w.bas, bit: arr[i + 1].bit});
    return;
  }
  if (i > 0 && arr[i - 1].k === 'Taktik' && w.k.startsWith('İz')) return;
  KELIMELER.push(w);
});
const tw = (needle: string, from = 0) => {
  const w = KELIMELER.find((x, i) => i >= from && x.k.toLowerCase().includes(needle.toLowerCase()));
  if (!w) throw new Error('kelime yok: ' + needle);
  return w.bas;
};
const twAfter = (needle: string, from: number) => {
  const w = KELIMELER.find((x) => x.bas >= from && x.k.toLowerCase().includes(needle.toLowerCase()));
  if (!w) throw new Error('kelime yok: ' + needle);
  return w.bas;
};
const SATIRLAR: Kelime[][] = [];
{
  let cur: Kelime[] = [];
  KELIMELER.forEach((w) => {
    cur.push(w);
    if (cur.length >= 5 || /[.?!]$/.test(w.k) || (cur.length >= 3 && /,$/.test(w.k))) { SATIRLAR.push(cur); cur = []; }
  });
  if (cur.length) SATIRLAR.push(cur);
}

const SAHNE = veri.sahneler.map((s, i) => ({id: s.id, bas: i === 0 ? 0 : s.bas, bit: s.bit}));
export const TOPLAM_SN = veri.toplam + 0.9;

// ---- Arka plan: hareketli ızgara, parıltı, yükselen parçacıklar ----
const Arka: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${50 + 25 * Math.sin(t * 0.5)}% ${38 + 10 * Math.cos(t * 0.4)}%, rgba(57,240,138,0.16), rgba(7,21,16,0) 55%)`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: -120, bottom: 0, opacity: 0.07, backgroundImage: `linear-gradient(${C.yesil} 2px, transparent 2px), linear-gradient(90deg, ${C.yesil} 2px, transparent 2px)`, backgroundSize: '120px 120px', transform: `translateY(${(t * 24) % 120}px)`}} />
    {Array.from({length: 22}, (_, i) => {
      const hiz = 36 + (i % 5) * 16;
      const y = 1920 - ((t * hiz + i * 173) % 2000) + 40;
      const x = (i * 197) % 1080 + Math.sin(t * 0.8 + i) * 18;
      const s = 5 + (i % 4) * 3;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: C.yesil, opacity: 0.12 + (i % 3) * 0.07}} />;
    })}
  </AbsoluteFill>
);

// ---- Ortak parçalar ----
const Karaoke: React.FC<{t: number}> = ({t}) => {
  if (t > veri.toplam + 0.1) return null;
  const satir = SATIRLAR.find((s) => t < s[s.length - 1].bit + 0.15) ?? SATIRLAR[SATIRLAR.length - 1];
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1400, minHeight: 190, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 18px', background: 'rgba(7,21,16,0.82)', border: `3px solid ${C.kenar}`, borderRadius: 22, padding: '22px 34px'}}>
        {satir.map((w, i) => {
          const ac = t >= w.bas;
          const sc = ac ? 1 + 0.2 * (1 - pop(t, w.bas, w.bas + 0.18)) + 0.0 : 1;
          return <span key={i} style={{display: 'inline-block', fontSize: 62, fontWeight: 900, color: ac ? C.yesil : C.metin, lineHeight: 1.15, transform: `scale(${sc})`, textShadow: ac && t - w.bas < 0.25 ? `0 0 24px ${C.yesil}` : 'none'}}>{w.k}</span>;
        })}
      </div>
    </div>
  );
};

const Baslik: React.FC<{t: number}> = ({t}) => (
  <>
    <Img src={staticFile('img/kose-logo-seffaf.png')} style={{position: 'absolute', left: 50, top: 46, width: 400, transform: `scale(${1 + 0.012 * Math.sin(t * 2.4)})`, transformOrigin: 'left center'}} />
    <div style={{position: 'absolute', right: 56, top: 74, textAlign: 'right'}}>
      <div style={{fontSize: 30, fontWeight: 900, color: C.yesil, letterSpacing: 2}}>MAÇ ÖNÜ</div>
      <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci}}>SÜPER LİG · 11. HAFTA</div>
    </div>
    <div style={{position: 'absolute', left: 56, right: 56, top: 170, height: 3, background: C.kenar}}>
      <div style={{height: '100%', width: 220, background: C.yesil, transform: `translateX(${((t * 420) % 1300) - 220}px)`, opacity: 0.9}} />
    </div>
  </>
);

const Etiket: React.FC<{yazi: string; baslik?: string; ts: number}> = ({yazi, baslik, ts}) => (
  <div style={{position: 'absolute', left: 56, right: 56, top: 196, overflow: 'hidden'}}>
    <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, letterSpacing: 2, transform: `translateX(${(1 - seg(ts, 0, 0.45)) * -120}px)`, opacity: seg(ts, 0, 0.3)}}>{yazi}</div>
    {baslik && <div style={{fontSize: 46, fontWeight: 900, color: C.metin, marginTop: 6, transform: `translateX(${(1 - seg(ts, 0.1, 0.6)) * 160}px)`, opacity: seg(ts, 0.1, 0.45)}}>{baslik}</div>}
  </div>
);

const Kutu: React.FC<{deger: string; aciklama: string; renk?: string; w?: number; p?: number}> = ({deger, aciklama, renk = C.yesil, w = 460, p = 1}) => (
  <div style={{width: w, background: C.panel, borderTop: `5px solid ${renk}`, padding: '14px 18px 16px', opacity: Math.min(1, p * 2), textAlign: 'center', transform: `scale(${0.6 + 0.4 * p})`, boxShadow: `0 0 ${30 * (1 - Math.abs(p - 1))}px ${renk}`}}>
    <div style={{fontSize: 56, fontWeight: 900, color: renk}}>{deger}</div>
    <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci, marginTop: 2}}>{aciklama}</div>
  </div>
);

const Rozet: React.FC<{t: Tema; ad: string; b: number}> = ({t, ad, b}) => (
  <div style={{width: b, height: b, borderRadius: '50%', background: t.ic, border: `${Math.max(3, b * 0.05)}px solid ${t.halka}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: b * (ad.length > 2 ? 0.3 : 0.38), fontWeight: 900, color: t.halka === '#ffffff' ? '#fff' : t.halka, flexShrink: 0}}>{ad}</div>
);

const Bar: React.FC<{ad: string; deger: number; max: number; renk: string; p: number; metin: string; ts: number; logo?: Tema; ad2?: string}> = ({ad, deger, max, renk, p, metin, ts, logo, ad2}) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 22, opacity: Math.min(1, p * 3), transform: `translateX(${(1 - Math.min(1, p * 1.5)) * -80}px)`}}>
    {logo ? <Rozet t={logo} ad={ad2 ?? ''} b={78} /> : <div style={{width: 78}} />}
    <div style={{flex: 1, marginLeft: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 900}}>
        <span style={{color: C.metin}}>{ad}</span><span style={{color: renk}}>{metin}</span>
      </div>
      <div style={{height: 26, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 8, overflow: 'hidden', position: 'relative'}}>
        <div style={{height: '100%', width: `${(deger / max) * 100 * p}%`, background: renk}} />
        {p > 0.95 && <div style={{position: 'absolute', top: 0, bottom: 0, width: 80, left: ((ts * 420 + deger * 9) % 1300) - 120, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-20deg)'}} />}
      </div>
    </div>
  </div>
);
// ---- Saha (dikey, kaleler üst ve altta) ----
const W = 390, H = 600, M = 8;
const P = (x: number, y: number): [number, number] => [M + y * 3.74, M + (100 - x) * 5.84];

const Forma: React.FC<{x: number; y: number; k: Tema; op?: number; halka?: boolean; r?: number}> = ({x, y, k, op = 1, halka, r = 13}) => {
  const [px, py] = P(x, y);
  return (
    <g opacity={op}>
      <ellipse cx={px + 2} cy={py + 11} rx={r} ry={r * 0.45} fill="#000" opacity={0.35} />
      {halka && <circle cx={px} cy={py} r={r + 7.5} fill="none" stroke="#fff" strokeWidth={1.8} />}
      <circle cx={px} cy={py} r={r} fill={k.ic} stroke={k.halka} strokeWidth={2.6} />
    </g>
  );
};

const Saha: React.FC<{scale: number; children?: React.ReactNode}> = ({scale, children}) => {
  const seritler = Array.from({length: 10}, (_, i) => (
    <rect key={i} x={M} y={M + i * 58.4} width={W - 2 * M} height={58.4} fill={i % 2 ? C.seritB : C.seritA} />
  ));
  const cizgi = {fill: 'none', stroke: '#fff', strokeOpacity: 0.9, strokeWidth: 1.6};
  return (
    <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', background: C.saha}}>
      {seritler}
      <rect x={M} y={M} width={W - 2 * M} height={H - 2 * M} {...cizgi} />
      <line x1={M} y1={300} x2={W - M} y2={300} {...cizgi} />
      <circle cx={195} cy={300} r={47} {...cizgi} />
      <circle cx={195} cy={300} r={2.5} fill="#fff" />
      <rect x={84} y={M} width={222} height={92} {...cizgi} />
      <rect x={144.5} y={M} width={101} height={31} {...cizgi} />
      <path d="M155.8 100 A 50 50 0 0 0 234.2 100" {...cizgi} />
      <rect x={84} y={500} width={222} height={92} {...cizgi} />
      <rect x={144.5} y={561} width={101} height={31} {...cizgi} />
      <path d="M155.8 500 A 50 50 0 0 1 234.2 500" {...cizgi} />
      <rect x={171} y={1} width={48} height={7} fill="none" stroke="#fff" strokeWidth={1.6} />
      <rect x={171} y={592} width={48} height={7} fill="none" stroke="#fff" strokeWidth={1.6} />
      {children}
    </svg>
  );
};

// ---- Sahne 1: Hook ----
const S1: React.FC<{ts: number}> = ({ts}) => {
  const tBel = tw('Emre');
  const sayac = 0.77 * seg(ts, 0.1, 1.2);
  const slam = ts < 1.2 ? 1 : 1 + 0.03 * Math.sin((ts - 1.2) * 7) * Math.exp(-(ts - 1.2) * 0.5);
  const sal = ts > 0.15 && ts < 0.55 ? Math.sin(ts * 90) * 8 * (1 - (ts - 0.15) / 0.4) : 0;
  const bel = pop(ts, tBel - 0.1, tBel + 0.5);
  const barP = seg(ts, 2.2, 3.4);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 215, textAlign: 'center', opacity: Math.min(1, bel * 2), transform: `scale(${0.6 + 0.4 * bel})`}}>
        <div style={{display: 'inline-block', background: FB.ic, border: `4px solid ${FB.halka}`, borderRadius: 16, padding: '8px 34px', fontSize: 44, fontWeight: 900, color: FB.halka}}>YENİ HOCA: EMRE BELÖZOĞLU</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', transform: `translateX(${sal}px) scale(${(ts < 1.2 ? 1 + 0.6 * (1 - pop(ts, 0, 0.6)) : 1) * slam})`}}>
        <div style={{fontSize: 330, fontWeight: 900, color: C.yesil, lineHeight: 1, whiteSpace: 'nowrap', textShadow: `0 0 ${40 + 30 * Math.sin(ts * 5)}px rgba(57,240,138,0.55)`}}>{virgul(sayac)}</div>
        <div style={{fontSize: 46, fontWeight: 900, color: C.metin, marginTop: 4, opacity: seg(ts, 0.8, 1.3)}}>EVİNDE YEDİĞİ xG (MAÇ BAŞI)</div>
        <div style={{fontSize: 30, fontWeight: 900, color: C.ikinci, marginTop: 4, opacity: seg(ts, 1.0, 1.5)}}>ÇORUM FK · 4 EV MAÇI</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 880, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50}}>
        <div style={{transform: `scale(${pop(ts, 1.3, 1.9)})`}}><Rozet t={FB} ad="FB" b={200} /></div>
        <div style={{fontSize: 80, fontWeight: 900, color: C.metin, opacity: seg(ts, 1.5, 2.0)}}>VS</div>
        <div style={{transform: `scale(${pop(ts, 1.5, 2.1)})`}}><Rozet t={COR} ad="ÇFK" b={200} /></div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1140, opacity: seg(ts, 2.1, 2.6)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 900}}>
          <span style={{color: C.yesil}}>ÇORUM EVDE YEDİĞİ</span><span style={{color: C.yesil}}>{virgul(0.77 * barP)}</span>
        </div>
        <div style={{height: 24, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 8}}><div style={{height: '100%', width: `${(0.77 / 1.6) * 100 * barP}%`, background: C.yesil}} /></div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 900, marginTop: 14}}>
          <span style={{color: C.ikinci}}>LİG ORTALAMASI</span><span style={{color: C.ikinci}}>{virgul(1.46 * barP)}</span>
        </div>
        <div style={{height: 24, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 8}}><div style={{height: '100%', width: `${(1.46 / 1.6) * 100 * barP}%`, background: C.ikinci}} /></div>
      </div>
    </>
  );
};

// ---- Sahne 2: Bağlam ----
const S2: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[1].bas;
  const tp = tw('puanda') - s0, tg = twAfter('yirmi', s0) - s0;
  const yd = KELIMELER.filter((w) => w.k.startsWith('yedi') && w.bas > s0 + tg && w.bas < s0 + 16);
  const t10 = (yd[0]?.bas ?? s0 + tg + 3) - s0 - 0.7, t16 = (yd[1]?.bas ?? s0 + tg + 6) - s0 - 0.7;
  const p1 = seg(ts, 0.3, tp + 0.7), p2 = seg(ts, 0.6, tp + 1.0);
  const g1 = seg(ts, tg - 0.2, tg + 1.0), g2 = seg(ts, tg + 0.2, tg + 1.2);
  const y1 = seg(ts, t10 - 0.2, t10 + 0.9), y2 = seg(ts, t16 - 0.2, t16 + 0.9);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 2 · MAÇ BAĞLAMI" baslik="Aynı puan, farklı denge" />
      <div style={{position: 'absolute', left: 60, right: 60, top: 400}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, marginBottom: 14, letterSpacing: 2}}>PUAN DURUMU</div>
        <Bar ts={ts} ad="8. FENERBAHÇE" deger={16} max={16} renk={C.yesil} p={p1} metin={`${Math.round(16 * p1)} PUAN`} logo={FB} ad2="FB" />
        <Bar ts={ts} ad="9. ÇORUM FK" deger={16} max={16} renk={C.sari} p={p2} metin={`${Math.round(16 * p2)} PUAN`} logo={COR} ad2="ÇFK" />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 760, opacity: seg(ts, 1.4, 1.9)}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, marginBottom: 14, letterSpacing: 2}}>ATTIĞI GOL</div>
        <Bar ts={ts} ad="FENERBAHÇE" deger={24} max={25} renk={C.yesil} p={g1} metin={`${Math.round(24 * g1)} GOL`} logo={FB} ad2="FB" />
        <Bar ts={ts} ad="ÇORUM FK" deger={21} max={25} renk={C.sari} p={g2} metin={`${Math.round(21 * g2)} GOL`} logo={COR} ad2="ÇFK" />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1040, opacity: seg(ts, 2.4, 2.9)}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.kirmizi, marginBottom: 14, letterSpacing: 2}}>YEDİĞİ GOL</div>
        <Bar ts={ts} ad="FENERBAHÇE" deger={10} max={25} renk={C.yesil} p={y1} metin={`${Math.round(10 * y1)} GOL`} logo={FB} ad2="FB" />
        <Bar ts={ts} ad="ÇORUM FK" deger={16} max={25} renk={C.sari} p={y2} metin={`${Math.round(16 * y2)} GOL`} logo={COR} ad2="ÇFK" />
      </div>
    </>
  );
};
// ---- Sahne 3: Form ve hocalar ----
const Form: React.FC<{ad: string; t: Tema; sonuc: string; ts: number; basla: number}> = ({ad, t, sonuc, ts, basla}) => (
  <div style={{marginBottom: 24}}>
    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10, opacity: seg(ts, basla - 0.2, basla + 0.3)}}>
      <Rozet t={t} ad={ad === 'FENERBAHÇE' ? 'FB' : 'ÇFK'} b={70} />
      <div style={{marginLeft: 18, fontSize: 36, fontWeight: 900, color: C.metin}}>{ad} · SON 5 MAÇ</div>
    </div>
    <div style={{display: 'flex', gap: 14}}>
      {sonuc.split('').map((r, i) => {
        const p = pop(ts, basla + i * 0.2, basla + 0.4 + i * 0.2);
        const renk = r === 'G' ? C.yesil : r === 'M' ? C.kirmizi : C.ikinci;
        return <div key={i} style={{width: 150, height: 110, background: renk, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, color: C.bg, transform: `scale(${p}) rotate(${(1 - p) * 40}deg)`, opacity: Math.min(1, p * 2)}}>{r}</div>;
      })}
    </div>
  </div>
);

const S3: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[2].bas;
  const tc = twAfter('Çorum', s0 + 0.5) - s0;
  const h1 = pop(ts, 0.2, 0.9), h2 = pop(ts, tc + 0.3, tc + 1.0);
  const e1 = pop(ts, twAfter('Brown', s0) - s0 - 0.2, twAfter('Brown', s0) - s0 + 0.4), e2 = pop(ts, twAfter('Gökhan', s0) - s0 - 0.2, twAfter('Gökhan', s0) - s0 + 0.4);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 2 · FORM VE HOCALAR" baslik="Fenerbahçe düşüşte, Çorum çıkışta" />
      <div style={{position: 'absolute', left: 60, right: 60, top: 400}}>
        <Form ad="FENERBAHÇE" t={FB} sonuc="GGGMM" ts={ts} basla={0.2} />
        <Form ad="ÇORUM FK" t={COR} sonuc="MGGMG" ts={ts} basla={tc - 0.3} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 940, display: 'flex', gap: 24}}>
        <div style={{flex: 1, background: C.panel, borderTop: `5px solid ${FB.halka}`, padding: '16px 20px', opacity: Math.min(1, h1 * 2), transform: `translateY(${(1 - h1) * 50}px)`}}>
          <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>FENERBAHÇE</div>
          <div style={{fontSize: 38, fontWeight: 900, color: C.metin}}>EMRE BELÖZOĞLU</div>
          <div style={{fontSize: 24, fontWeight: 900, color: C.sari, marginTop: 6}}>3 KASIM'DA ATANDI</div>
        </div>
        <div style={{flex: 1, background: C.panel, borderTop: `5px solid ${COR.ic}`, padding: '16px 20px', opacity: Math.min(1, h2 * 2), transform: `translateY(${(1 - h2) * 50}px)`}}>
          <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>ÇORUM FK</div>
          <div style={{fontSize: 38, fontWeight: 900, color: C.metin}}>BURAK YILMAZ</div>
          <div style={{fontSize: 24, fontWeight: 900, color: C.yesil, marginTop: 6}}>4 MAÇTA 3 GALİBİYET</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1130}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.kirmizi, letterSpacing: 2, marginBottom: 10, opacity: seg(ts, 3.0, 3.4)}}>EKSİKLER</div>
        <div style={{display: 'flex', gap: 24}}>
          <div style={{flex: 1, background: C.panel, borderLeft: `6px solid ${C.kirmizi}`, padding: '14px 18px', opacity: Math.min(1, e1 * 2), transform: `scale(${0.6 + 0.4 * e1})`}}>
            <div style={{fontSize: 22, fontWeight: 900, color: C.ikinci}}>FENERBAHÇE</div>
            <div style={{fontSize: 30, fontWeight: 900, color: C.metin, lineHeight: 1.15}}>BROWN · ASENSIO · AKÉ</div>
          </div>
          <div style={{flex: 1, background: C.panel, borderLeft: `6px solid ${C.kirmizi}`, padding: '14px 18px', opacity: Math.min(1, e2 * 2), transform: `scale(${0.6 + 0.4 * e2})`}}>
            <div style={{fontSize: 22, fontWeight: 900, color: C.ikinci}}>ÇORUM FK</div>
            <div style={{fontSize: 30, fontWeight: 900, color: C.metin, lineHeight: 1.15}}>GÖKHAN · EMİRCAN</div>
          </div>
        </div>
      </div>    </>
  );
};

// ---- Sahne 4: Deplasman sorunu ----
const bez = (a: [number, number], c: [number, number], b: [number, number], p: number): [number, number] => [
  (1 - p) * (1 - p) * a[0] + 2 * (1 - p) * p * c[0] + p * p * b[0],
  (1 - p) * (1 - p) * a[1] + 2 * (1 - p) * p * c[1] + p * p * b[1],
];
const ball = (tl: number): [number, number] => {
  if (tl < 1.0) return [kf(tl, [[0, 52], [1.0, 52]]), kf(tl, [[0, 42], [1.0, 58]])];
  if (tl < 1.8) return [kf(tl, [[1.0, 52], [1.8, 56]]), kf(tl, [[1.0, 58], [1.8, 88]])];
  if (tl < 2.8) return [kf(tl, [[1.8, 56], [2.8, 76]]), kf(tl, [[1.8, 88], [2.8, 92]])];
  if (tl < 3.8) return bez([76, 92], [92, 72], [84, 52], Easing.inOut(Easing.quad)((tl - 2.8) / 1.0));
  if (tl < 4.5) return [kf(tl, [[3.8, 84], [4.5, 98]]), kf(tl, [[3.8, 52], [4.5, 47]])];
  return [98, 47];
};

const S4: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[3].bas;
  const tE = twAfter('evinde', s0) - s0, tD = twAfter('Deplasmanda', s0) - s0, tC = twAfter('yediği', s0) - s0;
  const scale = 1.5;
  const cw = W * scale, ch = H * scale;
  const tl = ts % 6.5;
  const fb: [number, number][] = [[5, 50], [40, 38], [40, 62], [55, 12], [55, 88], [52, 42], [52, 58], [68, 22], [70, 50], [68, 78]];
  const cor: [number, number][] = [[96, 50], [88, 14], [88, 38], [88, 62], [88, 86], [76, 14], [76, 38], [76, 62], [76, 86], [66, 40], [66, 60]];
  const kay = kf(tl, [[0, 0], [1.8, 6], [2.8, 12], [4.5, 12], [6, 0]]);
  const [bx, by] = ball(tl);
  const [bpx, bpy] = P(bx, by);
  const zoom = kf(tl, [[0, 1], [1.8, 1.1], [3.0, 1.2], [4.2, 1.28], [5.5, 1.1], [6.5, 1]]);
  const jit = (i: number): [number, number] => [Math.sin(ts * 2.2 + i * 1.3) * 0.9, Math.cos(ts * 1.9 + i) * 1.2];
  const izler = Array.from({length: 9}, (_, k) => ball(Math.max(0, tl - (k + 1) * 0.07)));
  const muriqi: [number, number] = [kf(tl, [[0, 74], [2.8, 74], [3.8, 84]]), kf(tl, [[0, 50], [2.8, 50], [3.8, 52]])];
  const bolge = 0.5 + 0.5 * Math.abs(Math.sin(ts * 3));
  const [zx, zy] = P(94, 96), [zx2, zy2] = P(62, 4);
  const kutu = (v: number, ad: string, renk: string, a: number, w = 325) => <Kutu deger={virgul(v * seg(ts, a, a + 0.8))} aciklama={ad} renk={renk} w={w} p={pop(ts, a - 0.3, a + 0.3)} />;
  const sutP = lin(tl, 3.8, 4.5);
  const [ssx, ssy] = P(84, 52), [skx, sky] = P(99, 47);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 5 · DEPLASMAN SORUNU" baslik="Kompakt blok, düşen xG" />
      <div style={{position: 'absolute', left: (1080 - cw) / 2, top: 320, width: cw, height: ch, overflow: 'hidden', borderRadius: 10, border: '3px solid #1d6b3f', opacity: seg(ts, 0, 0.5), transform: `translateY(${(1 - seg(ts, 0, 0.5)) * 60}px)`, boxSizing: 'content-box'}}>
        <div style={{width: cw, height: ch, transform: `scale(${zoom})`, transformOrigin: `${bpx * scale}px ${bpy * scale}px`}}>
          <Saha scale={scale}>
            <rect x={Math.min(zx, zx2)} y={Math.min(zy, zy2)} width={Math.abs(zx2 - zx)} height={Math.abs(zy2 - zy)} rx={10} fill={C.sari} opacity={0.14 * bolge} stroke={C.sari} strokeDasharray="6 5" strokeWidth={1.5} strokeOpacity={0.9 * bolge} />
            <text x={(zx + zx2) / 2} y={zy + 22} textAnchor="middle" fontSize={16} fontWeight={900} fill={C.sari} fontFamily={FONT}>KOMPAKT BLOK</text>
            {fb.map(([x, y], i) => { const [jx, jy] = jit(i); return <Forma key={'f' + i} x={x + jx} y={y + jy} k={FB} />; })}
            {cor.map(([x, y], i) => { const [jx, jy] = jit(i + 20); const yy = i === 0 ? y : y + (by > 50 ? kay : -kay * 0.5); return <Forma key={'c' + i} x={x + jx} y={Math.min(96, Math.max(4, yy)) + jy} k={COR} op={0.7} />; })}
            <Forma x={muriqi[0]} y={muriqi[1]} k={FB} halka />
            {tl > 1.0 && tl < 1.9 && (() => { const a = P(52, 58), b = P(56, 88); return <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * lin(tl, 1.0, 1.8)} y2={a[1] + (b[1] - a[1]) * lin(tl, 1.0, 1.8)} stroke="#fff" strokeWidth={2.4} />; })()}
            {tl > 1.8 && (() => { const a = P(56, 88), b = P(76, 92); const p = lin(tl, 1.8, 2.8); return <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke="#fff" strokeWidth={2.2} strokeDasharray="6 4" />; })()}
            {tl > 2.8 && (() => { const a = P(76, 92), c = P(92, 72), b = P(84, 52); return <path d={`M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`} fill="none" stroke="#fff" strokeWidth={2.2} strokeDasharray="7 5" opacity={0.9} />; })()}
            {tl > 3.8 && (
              <>
                <line x1={ssx} y1={ssy} x2={ssx + (skx - ssx) * sutP} y2={ssy + (sky - ssy) * sutP} stroke={C.yesil} strokeWidth={5} strokeLinecap="round" />
                <circle cx={ssx} cy={ssy} r={20 + 4 * Math.sin(ts * 9)} fill={C.kirmizi} opacity={0.25} />
                <circle cx={ssx} cy={ssy} r={12} fill={C.kirmizi} stroke="#fff" strokeWidth={2} />
              </>
            )}
            {izler.map(([x, y], k) => { const [tx, ty] = P(x, y); return <circle key={k} cx={tx} cy={ty} r={6 - k * 0.45} fill="#fff" opacity={0.5 - k * 0.05} />; })}
            <circle cx={bpx} cy={bpy} r={6.5} fill="#fff" stroke="#000" strokeWidth={1.2} />
          </Saha>
        </div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 1255, display: 'flex', justifyContent: 'space-between'}}>
        {kutu(2.69, 'FB EVDE xG', C.yesil, tE)}
        {kutu(1.41, 'FB DEPL. xG', C.kirmizi, tD)}
        {kutu(0.77, 'ÇORUM EVDE YEDİĞİ', C.sari, tC)}
      </div>
    </>
  );
};

// ---- Sahne 5: Oyuncular ----
const Oyuncu: React.FC<{ad: string; t: Tema; kisa: string; sol: string; solD: number; sag: string; sagD: number; p: number; ts: number; renk: string; ondalik?: boolean}> = ({ad, t, kisa, sol, solD, sag, sagD, p, ts, renk, ondalik}) => (
  <div style={{width: 470, height: 400, background: C.panel, borderTop: `6px solid ${renk}`, padding: '20px 22px', opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * p}) rotate(${(1 - p) * -8}deg)`, boxShadow: `0 0 ${40 * Math.max(0, 1 - Math.abs(p - 1) * 3)}px ${renk}`}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Rozet t={t} ad={kisa} b={86} />
      <div style={{marginLeft: 16, fontSize: 44, fontWeight: 900, color: C.metin, lineHeight: 1.05}}>{ad}</div>
    </div>
    <div style={{marginTop: 22}}>
      <div style={{fontSize: 96, fontWeight: 900, color: renk, lineHeight: 1}}>{ondalik ? virgul(solD * Math.min(1, p)) : Math.round(solD * Math.min(1, p))}</div>
      <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>{sol}</div>
      <div style={{height: 14, background: C.bg, marginTop: 8}}><div style={{height: '100%', width: `${Math.min(100, (solD / 8) * 100) * Math.min(1, p)}%`, background: renk}} /></div>
    </div>
    <div style={{marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 12}}>
      <div style={{fontSize: 56, fontWeight: 900, color: C.metin}}>{Number.isInteger(sagD) ? Math.round(sagD * Math.min(1, p)) : virgul(sagD * Math.min(1, p))}</div>
      <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>{sag}</div>
    </div>
  </div>
);

const S5: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[4].bas;
  const w = (n: string) => twAfter(n, s0) - s0;
  const p1 = seg(ts, w('Ramírez') - 0.3, w('Ramírez') + 1.0), p2 = seg(ts, w('Kyziridis') - 0.3, w('Kyziridis') + 1.0);
  const p3 = seg(ts, w('Vedat') - 0.3, w('Vedat') + 1.0), p4 = seg(ts, w('Greenwood') - 0.3, w('Greenwood') + 1.0);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 8 · KİLİT İSİMLER" baslik="Çorum'un silahları, FB'nin cevabı" />
      {[{y: 380, ad: 'ÇORUM FK', r: C.sari}, {y: 848, ad: 'FENERBAHÇE', r: C.yesil}].map((h, i) => (
        <div key={i} style={{position: 'absolute', left: 60, right: 60, top: h.y, fontSize: 26, fontWeight: 900, color: h.r, letterSpacing: 2, opacity: seg(ts, 0.2 + i * 0.2, 0.7 + i * 0.2)}}>{h.ad}</div>
      ))}
      {[420, 885].map((y) => [60, 550].map((x) => <div key={x + '-' + y} style={{position: 'absolute', left: x, top: y, width: 470, height: 400, border: `3px dashed ${C.kenar}`, opacity: 0.6}} />))}
      <div style={{position: 'absolute', left: 60, right: 60, top: 420, display: 'flex', justifyContent: 'space-between'}}>
        <Oyuncu ts={ts} ad="RAMÍREZ" t={COR} kisa="JR" sol="GOL" solD={6} sag="HAVA TOPU KAZANDI" sagD={27} p={pop(ts, w('Ramírez') - 0.3, w('Ramírez') + 0.5) * (p1 > 0 ? 1 : 0)} renk={C.sari} />
        <Oyuncu ts={ts} ad="KYZIRIDIS" t={COR} kisa="AK" sol="GOL" solD={4} sag="ASİST" sagD={4} p={pop(ts, w('Kyziridis') - 0.3, w('Kyziridis') + 0.5)} renk={C.sari} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 885, display: 'flex', justifyContent: 'space-between'}}>
        <Oyuncu ts={ts} ad="VEDAT MURIQI" t={FB} kisa="VM" sol="GOL" solD={7} sag="HAVA TOPU KAZANDI" sagD={16} p={pop(ts, w('Vedat') - 0.3, w('Vedat') + 0.5)} renk={C.yesil} />
        <Oyuncu ts={ts} ad="GREENWOOD" t={FB} kisa="MG" sol="xG" solD={5.19} sag="GOL" sagD={4} p={pop(ts, w('Greenwood') - 0.3, w('Greenwood') + 0.5)} renk={C.yesil} ondalik />
      </div>
    </>
  );
};

// ---- Sahne 6: Vuruş + kapanış ----
const S6: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[5].bas;
  const ty = twAfter('elli', s0) - s0, tsn = tw('Sence') - s0, ttk = tw('takip') - s0;
  const oranlar = [{ad: 'FENERBAHÇE', d: 58, r: C.yesil}, {ad: 'BERABERLİK', d: 22, r: C.ikinci}, {ad: 'ÇORUM FK', d: 20, r: C.sari}];
  const p = seg(ts, 0.3, ty + 0.9);
  const kapanis = seg(ts, ttk - 0.3, ttk + 0.5);
  const sp = pop(ts, tsn - 0.3, tsn + 0.4);
  const skorlar = ['2-1', '1-1', '3-0', '1-0', '2-2', '0-1'];
  const lt = Math.max(0, ts - (tsn + 0.2));
  return (
    <>
      <div style={{opacity: 1 - kapanis}}>
        <Etiket ts={ts} yazi="BÖLÜM 10 · KAPANIŞ" baslik="Piyasa ne diyor?" />
        <div style={{position: 'absolute', left: 60, right: 60, top: 440}}>
          <div style={{display: 'flex', height: 120, border: `3px solid ${C.kenar}`, overflow: 'hidden'}}>
            {oranlar.map((o, i) => (
              <div key={i} style={{width: `${o.d * p}%`, background: o.r, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, fontWeight: 900, color: C.bg, overflow: 'hidden', whiteSpace: 'nowrap'}}>
                {o.d > 18 ? '%' + Math.round(o.d * p) : ''}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 26, fontWeight: 900, opacity: seg(ts, 0.8, 1.4)}}>
            {oranlar.map((o, i) => <span key={i} style={{color: o.r}}>{o.ad} %{o.d}</span>)}
          </div>
          <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci, marginTop: 24, opacity: seg(ts, 1.2, 1.8)}}>BAHİS ORANLARI (SOFASCORE) · MARJ ÇIKARILMIŞ · 8 KASIM</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', opacity: seg(ts, 0.9, 1.5) * (1 - lin(ts, tsn - 0.4, tsn)), transform: `scale(${(0.6 + 0.4 * pop(ts, 0.9, 1.6)) * (1 + 0.04 * Math.sin(ts * 6))})`}}>
          <div style={{fontSize: 300, fontWeight: 900, color: C.yesil, lineHeight: 1, textShadow: '0 0 40px rgba(57,240,138,0.55)'}}>%{Math.round(58 * p)}</div>
          <div style={{fontSize: 40, fontWeight: 900, color: C.ikinci}}>FENERBAHÇE (PİYASA)</div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 790, textAlign: 'center', opacity: Math.min(1, sp * 2), transform: `scale(${(0.5 + 0.5 * sp) * (1 + 0.025 * Math.sin(ts * 5))})`}}>
          <div style={{fontSize: 96, fontWeight: 900, color: C.yesil, lineHeight: 1.05, textShadow: `0 0 28px rgba(57,240,138,0.5)`}}>SENCE SKOR</div>
          <div style={{fontSize: 96, fontWeight: 900, color: C.metin, lineHeight: 1.05}}>NE OLUR?</div>
          <div style={{fontSize: 38, fontWeight: 900, color: C.ikinci, marginTop: 14}}>YORUMA YAZ</div>
        </div>
        {skorlar.map((s, i) => {
          const dt = lt - i * 0.45;
          if (dt < 0) return null;
          const dongu = (dt % 2.8) / 2.8;
          const x = 90 + ((i * 163) % 760);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 1330 - dongu * 270, opacity: Math.sin(dongu * Math.PI), background: C.panel, border: `3px solid ${i % 2 ? C.sari : C.yesil}`, borderRadius: 24, padding: '4px 22px', fontSize: 40, fontWeight: 900, color: i % 2 ? C.sari : C.yesil}}>{s}</div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, opacity: kapanis, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{position: 'absolute', left: '50%', top: '38%', width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: '50%', background: `radial-gradient(circle, rgba(57,240,138,${0.28 + 0.1 * Math.sin(ts * 6)}), transparent 65%)`, transform: `scale(${1 + 0.1 * Math.sin(ts * 4)})`}} />
          <Img src={staticFile('img/taktikiz-logo-seffaf.png')} style={{width: 760, position: 'relative', transform: `scale(${0.6 + 0.4 * pop(ts, ttk - 0.3, ttk + 0.6)}) rotate(${(1 - pop(ts, ttk - 0.3, ttk + 0.6)) * -8}deg)`}} />
        </div>
        <div style={{display: 'inline-block', marginTop: 36, padding: '16px 70px', background: C.yesil, borderRadius: 60, fontSize: 60, fontWeight: 900, color: C.bg, transform: `scale(${(0.5 + 0.5 * pop(ts, ttk + 0.2, ttk + 0.8)) * (1 + 0.05 * Math.sin(ts * 7))})`}}>TAKİP ET</div>
        <div style={{fontSize: 34, fontWeight: 900, color: C.ikinci, marginTop: 18}}>Maç analizleri kanalda</div>
      </div>
    </>
  );
};

const SAHNELER = [S1, S2, S3, S4, S5, S6];

export const Shorts: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ilerleme = Math.min(1, t / veri.toplam);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}} lang="tr">
      <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
      <Audio src={staticFile('ses.mp3')} />
      <Arka t={t} />
      <Baslik t={t} />
      {SAHNELER.map((S, i) => {
        const sc = SAHNE[i];
        const son = i === SAHNELER.length - 1;
        const bit = son ? TOPLAM_SN : sc.bit;
        if (t < sc.bas || t > bit + 0.25) return null;
        const gir = i === 0 ? 1 : seg(t, sc.bas, sc.bas + 0.45);
        const cik = son ? 0 : lin(t, bit - 0.05, bit + 0.25);
        return (
          <AbsoluteFill key={i} style={{opacity: Math.min(1, gir * 1.5) * (1 - cik), transform: `translateY(${(1 - gir) * 70 - cik * 50}px) scale(${0.96 + 0.04 * gir})`}}>
            <S ts={t - sc.bas} />
          </AbsoluteFill>
        );
      })}
      <Karaoke t={t} />
      <div style={{position: 'absolute', left: 56, right: 56, bottom: 120, height: 10, background: C.panel, borderRadius: 5, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${ilerleme * 100}%`, background: C.yesil, borderRadius: 5, boxShadow: `0 0 14px ${C.yesil}`}} />
      </div>
    </AbsoluteFill>
  );
};
