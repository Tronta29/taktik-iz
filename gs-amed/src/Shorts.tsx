import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import veri from '../veri.json';

// ---- Görsel şema renkleri (taktik-iz-gorsel-sema.md) ----
const C = {
  bg: '#071510', panel: '#0f2a1c', kenar: '#1f5a38', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6',
  saha: '#155f34', seritA: '#17703c', seritB: '#1c7a43', sari: '#ffd60a', kirmizi: '#ff4d3d', mavi: '#4fc3ff',
};
const GS = {ic: '#a90432', halka: '#fdb912', no: '#ffffff'};
const AMED = {ic: '#101010', halka: '#e8112d', no: '#ffffff'};
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

// ---- Saha (dikey, kaleler üst ve altta) ----
const W = 390, H = 600, M = 8;
const P = (x: number, y: number): [number, number] => [M + y * 3.74, M + (100 - x) * 5.84];

const Forma: React.FC<{x: number; y: number; k: typeof GS; op?: number; halka?: boolean; r?: number}> = ({x, y, k, op = 1, halka, r = 13}) => {
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
  const acikT = tw('açık');
  const sayac = Math.round(12 * lin(ts, 0, 0.7));
  const slam = ts < 0.7 ? 1 : 1 + 0.035 * Math.sin((ts - 0.7) * 7) * Math.exp(-(ts - 0.7) * 0.6);
  const sal = ts > 0.62 && ts < 1.0 ? Math.sin(ts * 90) * 8 * (1 - (ts - 0.62) / 0.38) : 0;
  const gsDeger = Math.round(381 * seg(ts, 1.2, 2.6));
  const amDeger = Math.round(32 * seg(ts, 1.4, 2.6));
  const hookP = pop(ts, acikT - 0.1, acikT + 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', transform: `translateX(${sal}px)`}}>
        <div style={{fontSize: 270, fontWeight: 900, color: C.yesil, lineHeight: 1, whiteSpace: 'nowrap', transform: `scale(${(ts < 0.7 ? 1 + 1.4 * (1 - pop(ts, 0, 0.7)) : 1) * slam})`, textShadow: `0 0 ${40 + 30 * Math.sin(ts * 5)}px rgba(57,240,138,0.55)`}}>
          {sayac} KAT
        </div>
        <div style={{fontSize: 44, fontWeight: 900, color: C.ikinci, marginTop: 4, opacity: seg(ts, 0.6, 1.1)}}>KADRO DEĞERİ FARKI</div>
      </div>
      {/* 1 Galatasaray = 12 Amedspor */}
      <div style={{position: 'absolute', left: 50, right: 50, top: 650, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', transform: `scale(${pop(ts, 0.9, 1.5)})`}}>
          <Img src={staticFile('img/gs.png')} style={{width: 210, height: 210, objectFit: 'contain'}} />
          <div style={{fontSize: 30, fontWeight: 900, color: C.yesil}}>1 GALATASARAY</div>
        </div>
        <div style={{fontSize: 90, fontWeight: 900, color: C.metin, margin: '0 26px', opacity: seg(ts, 1.1, 1.5), transform: `rotate(${(1 - seg(ts, 1.1, 1.6)) * 90}deg)`}}>=</div>
        <div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 88px)', gap: 8}}>
            {Array.from({length: 12}, (_, i) => (
              <Img key={i} src={staticFile('img/amed.png')} style={{width: 88, height: 88, objectFit: 'contain', transform: `scale(${pop(ts, 1.3 + i * 0.13, 1.6 + i * 0.13)}) rotate(${(1 - pop(ts, 1.3 + i * 0.13, 1.6 + i * 0.13)) * -40}deg)`}} />
            ))}
          </div>
          <div style={{fontSize: 30, fontWeight: 900, color: C.sari, textAlign: 'center', marginTop: 8}}>12 AMEDSPOR</div>
        </div>
      </div>
      {/* Çubuklar */}
      <div style={{position: 'absolute', left: 70, right: 70, top: 1030}}>
        {[{ad: 'GALATASARAY', d: gsDeger, w: 1, renk: C.yesil}, {ad: 'AMEDSPOR', d: amDeger, w: 32 / 381, renk: C.sari}].map((r, i) => (
          <div key={i} style={{marginBottom: 22, opacity: seg(ts, 1.1 + i * 0.2, 1.6 + i * 0.2)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 900}}>
              <span style={{color: C.metin}}>{r.ad}</span>
              <span style={{color: r.renk}}>{r.d} MİLYON €</span>
            </div>
            <div style={{height: 28, background: C.panel, marginTop: 8, border: `2px solid ${C.kenar}`, overflow: 'hidden', position: 'relative'}}>
              <div style={{height: '100%', width: `${Math.max(r.w * 100 * seg(ts, 1.2 + i * 0.2, 2.6), 1.5)}%`, background: r.renk, position: 'relative'}} />
              <div style={{position: 'absolute', top: 0, bottom: 0, width: 90, left: ((ts * 500) % 1200) - 150, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-20deg)'}} />
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 1290, textAlign: 'center', opacity: Math.min(1, hookP), transform: `scale(${0.7 + 0.3 * hookP})`, fontSize: 48, fontWeight: 900, color: C.sari, textShadow: `0 0 ${14 + 10 * Math.sin(ts * 6)}px rgba(255,214,10,0.6)`}}>
        MAÇI BELİRLEYECEK TEK BİR AÇIK
      </div>
    </>
  );
};

// ---- Sahne 2: Bağlam ----
const Bar: React.FC<{ad: string; deger: number; max: number; renk: string; p: number; metin: string; ts: number; logo?: string}> = ({ad, deger, max, renk, p, metin, ts, logo}) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 22, opacity: Math.min(1, p * 3), transform: `translateX(${(1 - Math.min(1, p * 1.5)) * -80}px)`}}>
    {logo ? <Img src={staticFile('img/' + logo)} style={{width: 78, height: 78, objectFit: 'contain', transform: `scale(${1 + 0.05 * Math.sin(ts * 4)})`}} /> : <div style={{width: 78}} />}
    <div style={{flex: 1, marginLeft: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 900}}>
        <span style={{color: C.metin}}>{ad}</span><span style={{color: renk}}>{metin}</span>
      </div>
      <div style={{height: 26, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 8, overflow: 'hidden', position: 'relative'}}>
        <div style={{height: '100%', width: `${(deger / max) * 100 * p}%`, background: renk}} />
        {p > 0.95 && <div style={{position: 'absolute', top: 0, bottom: 0, width: 80, left: ((ts * 420 + deger * 90) % 1300) - 120, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-20deg)'}} />}
      </div>
    </div>
  </div>
);

const S2: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[1].bas;
  const tp = tw('puan', 0) - s0, tx = tw('xG', 0) - s0;
  const tgx = KELIMELER.filter((w) => w.k.startsWith('Galatasaray') && w.bas > s0)[1]?.bas - s0 || tx + 3;
  const p1 = seg(ts, tp - 1, tp + 0.5), p2 = seg(ts, tp - 0.7, tp + 0.8);
  const x1 = seg(ts, tgx - 0.3, tgx + 0.8), x2 = seg(ts, tgx + 0.5, tgx + 1.6), x3 = seg(ts, tgx + 1.5, tgx + 2.4);
  const chip = pop(ts, tgx + 2.4, tgx + 3.0);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 2 · MAÇ BAĞLAMI" baslik="Lider ile ikinci karşılaşıyor" />
      <div style={{position: 'absolute', left: 60, right: 60, top: 400}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, marginBottom: 14, letterSpacing: 2}}>PUAN DURUMU</div>
        <Bar ts={ts} ad="1. GALATASARAY" deger={25} max={25} renk={C.yesil} p={p1} metin={`${Math.round(25 * p1)} PUAN`} logo="gs.png" />
        <Bar ts={ts} ad="2. AMEDSPOR" deger={23} max={25} renk={C.sari} p={p2} metin={`${Math.round(23 * p2)} PUAN`} logo="amed.png" />
        <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci, marginTop: -6, opacity: seg(ts, tp, tp + 0.5)}}>AVERAJ: GS +11 · AMED +14</div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 790, opacity: seg(ts, tx - 0.5, tx + 0.2)}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, marginBottom: 14, letterSpacing: 2}}>xG / MAÇ (GOL BEKLENTİSİ)</div>
        <Bar ts={ts} ad="GALATASARAY" deger={2.36} max={2.6} renk={C.yesil} p={x1} metin={virgul(2.36 * x1)} logo="gs.png" />
        <Bar ts={ts} ad="AMEDSPOR" deger={2.23} max={2.6} renk={C.sari} p={x2} metin={virgul(2.23 * x2)} logo="amed.png" />
        <Bar ts={ts} ad="LİG ORTALAMASI" deger={1.46} max={2.6} renk={C.ikinci} p={x3} metin={virgul(1.46 * x3)} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1170, display: 'flex', justifyContent: 'space-between', opacity: Math.min(1, chip * 2), transform: `scale(${0.5 + 0.5 * chip})`}}>
        <div style={{background: C.panel, borderLeft: `6px solid ${C.yesil}`, padding: '10px 22px', fontSize: 30, fontWeight: 900, color: C.yesil}}>GS: LİG ORT. ÜSTÜ +%62</div>
        <div style={{background: C.panel, borderLeft: `6px solid ${C.sari}`, padding: '10px 22px', fontSize: 30, fontWeight: 900, color: C.sari}}>AMED +%53</div>
      </div>
    </>
  );
};

// ---- Sahne 3: Eksikler ----
const Kart: React.FC<{logo: string; ad: string; takim: string; stat: string; giris: number; vur: number; yon: number; ts: number}> = ({logo, ad, takim, stat, giris, vur, yon, ts}) => (
  <div style={{display: 'flex', alignItems: 'center', background: C.panel, borderLeft: `6px solid ${C.kirmizi}`, padding: '26px 30px', marginBottom: 30, opacity: Math.min(1, giris * 2) * (0.45 + 0.55 * vur), transform: `translateX(${yon * (1 - giris) * 700}px)`, boxShadow: `0 0 ${50 * Math.max(0, 1 - Math.abs(vur - 1) * 4) * vur}px ${C.kirmizi}`}}>
    <Img src={staticFile('img/' + logo)} style={{width: 130, height: 130, objectFit: 'contain'}} />
    <div style={{marginLeft: 30, flex: 1}}>
      <div style={{fontSize: 50, fontWeight: 900, color: C.metin}}>{ad}</div>
      <div style={{fontSize: 28, fontWeight: 900, color: C.ikinci, marginTop: 4}}>{takim}</div>
      <div style={{fontSize: 28, fontWeight: 900, color: C.sari, marginTop: 8}}>{stat}</div>
    </div>
    <div style={{width: 54, height: 78, background: C.kirmizi, borderRadius: 6, transform: `translateY(${(1 - vur) * -260}px) rotate(${8 + (1 - vur) * -50 + Math.sin(ts * 5) * 2}deg) scale(${0.6 + 0.4 * vur})`, opacity: vur}} />
  </div>
);

const S3: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[2].bas;
  const tb = tw('Ballet') - s0, tk = tw('Bardakcı') - s0;
  const g1 = pop(ts, 0.1, 0.8), g2 = pop(ts, 0.3, 1.0);
  const v1 = pop(ts, tb - 0.1, tb + 0.5), v2 = pop(ts, tk - 0.1, tk + 0.5);
  const tdiger = 2.9;
  const o = pop(ts, tdiger, tdiger + 0.7);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 2 · EKSİKLER" baslik="İkisinin de kilit ismi yok" />
      <div style={{position: 'absolute', left: 60, right: 60, top: 400}}>
        <Kart ts={ts} logo="amed.png" ad="SAMUEL BALLET" takim="AMEDSPOR · CEZALI" stat="4 GOL · 5,1 xG" giris={g1} vur={v1} yon={-1} />
        <Kart ts={ts} logo="gs.png" ad="ABDÜLKERİM BARDAKCI" takim="GALATASARAY · CEZALI" stat="PAS İSABETİ %90" giris={g2} vur={v2} yon={1} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1010, opacity: Math.min(1, o * 2), transform: `translateY(${(1 - o) * 60}px)`}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, letterSpacing: 2, marginBottom: 12}}>YİNE DE GOL YOLLARI AÇIK</div>
        {[{ad: 'ORBAN · AMEDSPOR', g: 9, renk: C.sari}, {ad: 'OSIMHEN · GALATASARAY', g: 9, renk: C.yesil}].map((r, i) => (
          <div key={i} style={{marginBottom: 14}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 900}}>
              <span style={{color: C.metin}}>{r.ad}</span><span style={{color: r.renk}}>{Math.round(r.g * seg(ts, tdiger + 0.2 + i * 0.2, tdiger + 1.2))} GOL</span>
            </div>
            <div style={{height: 20, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 6}}>
              <div style={{height: '100%', width: `${100 * seg(ts, tdiger + 0.2 + i * 0.2, tdiger + 1.2)}%`, background: r.renk}} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ---- Sahne 4: Hızlı hücum açığı ----
const ball = (ts: number): [number, number] => {
  if (ts < 2.7) return [kf(ts, [[0.2, 52], [1.4, 75], [2.6, 77]]), kf(ts, [[0.2, 42], [1.4, 52], [2.6, 54]])];
  if (ts < 3.2) return [kf(ts, [[2.6, 77], [3.2, 78]]), kf(ts, [[2.6, 54], [3.2, 58]])];
  if (ts < 4.6) return [kf(ts, [[3.2, 78], [4.6, 45]]), kf(ts, [[3.2, 58], [4.6, 86]])];
  if (ts < 6.4) return [kf(ts, [[4.6, 45], [6.4, 22]]), kf(ts, [[4.6, 86], [6.4, 66]])];
  return [kf(ts, [[6.4, 22], [7.2, 2]]), kf(ts, [[6.4, 66], [7.2, 50]])];
};

const S4: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[3].bas;
  const tDort = tw('dördü') - s0, tYet = tw('yetmiş') - s0;
  const scale = 1.5;
  const cw = W * scale, ch = H * scale;
  const gs: [number, number][] = [[64, 10], [42, 36], [42, 64], [64, 90], [52, 42], [52, 58], [74, 22], [76, 50], [74, 78], [86, 50]];
  const amedSabit: [number, number][] = [[96, 50], [88, 15], [88, 38], [88, 85], [77, 40], [66, 20], [58, 50], [70, 50]];
  const kaybeden = kf(ts, [[0, 52], [1.4, 74], [2.6, 76]]);
  const kosucuX = kf(ts, [[3.2, 66], [4.6, 44], [6.4, 22]]);
  const kosucuY = kf(ts, [[3.2, 80], [4.6, 86], [6.4, 66]]);
  const amedMid: [number, number] = [kf(ts, [[2.7, 77], [3.2, 78]]), kf(ts, [[2.7, 60], [3.2, 58]])];
  const bosAlan = seg(ts, 3.0, 3.8) * (0.55 + 0.45 * Math.abs(Math.sin(ts * 3)));
  const [zx, zy] = P(55, 72);
  const [zx2, zy2] = P(20, 99);
  const pas = P(78, 58), pas2 = P(44, 86), kosuB = P(44, 86), kosuS = P(22, 66), kale = P(1, 50);
  const ci = (a: number, b: number) => seg(ts, a, b);
  const [bx, by] = ball(ts);
  const [bpx, bpy] = P(bx, by);
  const zoom = kf(ts, [[0, 1], [2.4, 1.05], [3.4, 1.14], [5.5, 1.2], [6.6, 1.26], [7.6, 1.14], [9, 1.0]]);
  const sarsin = ts > 7.0 && ts < 7.9 ? Math.sin(ts * 80) * 6 * (1 - (ts - 7.0) / 0.9) : 0;
  const jit = (i: number): [number, number] => [Math.sin(ts * 2.2 + i * 1.3) * 0.9, Math.cos(ts * 1.9 + i) * 1.2];
  const rbX = kf(ts, [[3.2, 64], [5.0, 50]]), rbY = kf(ts, [[3.2, 90], [5.0, 84]]);
  const izler = Array.from({length: 9}, (_, k) => ball(Math.max(0, ts - (k + 1) * 0.07)));
  const dots = Array.from({length: 7}, (_, i) => i);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 5 · GEÇİŞ AÇIĞI" baslik="Bek arkası: 4 gol" />
      <div style={{position: 'absolute', left: (1080 - cw) / 2, top: 320, width: cw, height: ch, overflow: 'hidden', borderRadius: 10, border: '3px solid #1d6b3f', opacity: seg(ts, 0, 0.5), transform: `translate(${sarsin}px, ${(1 - seg(ts, 0, 0.5)) * 60}px)`, boxSizing: 'content-box'}}>
        <div style={{width: cw, height: ch, transform: `scale(${zoom})`, transformOrigin: `${bpx * scale}px ${bpy * scale}px`}}>
          <Saha scale={scale}>
            <rect x={Math.min(zx, zx2)} y={Math.min(zy, zy2)} width={Math.abs(zx2 - zx)} height={Math.abs(zy2 - zy)} fill={C.sari} opacity={0.2 * bosAlan} stroke={C.sari} strokeDasharray="6 5" strokeWidth={1.5} strokeOpacity={bosAlan} />
            <text x={(zx + zx2) / 2} y={(zy + zy2) / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={900} fill={C.sari} opacity={bosAlan} fontFamily={FONT}>BOŞ ALAN</text>
            {gs.map(([x, y], i) => {
              const [jx, jy] = jit(i);
              if (i === 7) return <Forma key={'g' + i} x={kaybeden + jx * 0.3} y={y} k={GS} />;
              if (i === 3) return <Forma key={'g' + i} x={rbX + jx} y={rbY + jy} k={GS} />;
              return <Forma key={'g' + i} x={x + jx} y={y + jy} k={GS} />;
            })}
            <Forma x={5} y={50} k={GS} />
            {amedSabit.map(([x, y], i) => { const [jx, jy] = jit(i + 20); return <Forma key={'a' + i} x={x + jx} y={y + jy} k={AMED} op={0.6} />; })}
            <Forma x={amedMid[0]} y={amedMid[1]} k={AMED} />
            {ts > 3.2 && <Forma x={kosucuX} y={kosucuY} k={AMED} halka />}
            {ts > 2.9 && (() => { const [sx, sy] = P(78, 58); const yr = 14 + 26 * (1 - seg(ts, 2.9, 3.6)); return (<g><circle cx={sx} cy={sy} r={yr} fill="none" stroke={C.yesil} strokeWidth={2} opacity={1 - seg(ts, 2.9, 3.6)} /><rect x={sx - 10} y={sy - 10} width={20} height={20} rx={4} fill={C.yesil} opacity={seg(ts, 2.9, 3.2)} /></g>); })()}
            <line x1={pas[0]} y1={pas[1]} x2={pas[0] + (pas2[0] - pas[0]) * ci(3.2, 4.6)} y2={pas[1] + (pas2[1] - pas[1]) * ci(3.2, 4.6)} stroke="#fff" strokeWidth={2.4} />
            <line x1={kosuB[0]} y1={kosuB[1]} x2={kosuB[0] + (kosuS[0] - kosuB[0]) * ci(4.6, 6.4)} y2={kosuB[1] + (kosuS[1] - kosuB[1]) * ci(4.6, 6.4)} stroke="#fff" strokeWidth={2.2} strokeDasharray="6 4" />
            {ts > 6.4 && (
              <>
                <line x1={kosuS[0]} y1={kosuS[1]} x2={kosuS[0] + (kale[0] - kosuS[0]) * ci(6.4, 7.2)} y2={kosuS[1] + (kale[1] - kosuS[1]) * ci(6.4, 7.2)} stroke={C.yesil} strokeWidth={5} strokeLinecap="round" />
                <circle cx={kosuS[0]} cy={kosuS[1]} r={22 + 4 * Math.sin(ts * 9)} fill={C.kirmizi} opacity={0.25} />
                <circle cx={kosuS[0]} cy={kosuS[1]} r={13} fill={C.kirmizi} stroke="#fff" strokeWidth={2} />
              </>
            )}
            {ts > 7.1 && <circle cx={kale[0]} cy={kale[1]} r={10 + 60 * seg(ts, 7.1, 7.9)} fill="none" stroke={C.kirmizi} strokeWidth={4} opacity={1 - seg(ts, 7.1, 7.9)} />}
            {ts > 0.3 && izler.map(([x, y], k) => { const [tx, ty] = P(x, y); return <circle key={k} cx={tx} cy={ty} r={6 - k * 0.45} fill="#fff" opacity={0.5 - k * 0.05} />; })}
            <circle cx={bpx} cy={bpy} r={6.5} fill="#fff" stroke="#000" strokeWidth={1.2} />
          </Saha>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1255, display: 'flex', justifyContent: 'space-between'}}>
        <div style={{width: 470, background: C.panel, borderTop: `5px solid ${C.kirmizi}`, padding: '12px 14px 14px', textAlign: 'center', opacity: Math.min(1, pop(ts, tDort - 0.4, tDort + 0.2) * 2)}}>
          <div style={{display: 'flex', justifyContent: 'center', gap: 10, height: 56, alignItems: 'center'}}>
            {dots.map((i) => {
              const gol = i < 4;
              const p = pop(ts, tDort - 0.3 + i * 0.12, tDort + 0.1 + i * 0.12);
              return <div key={i} style={{width: 42, height: 42, borderRadius: '50%', background: gol ? C.kirmizi : 'transparent', border: `4px solid ${gol ? C.kirmizi : C.ikinci}`, transform: `scale(${p})`}} />;
            })}
          </div>
          <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci, marginTop: 8}}>7 ŞUT → 4 GOL (HIZLI HÜCUM)</div>
        </div>
        <Kutu deger={`${virgul(4.74 * seg(ts, tYet - 0.3, tYet + 0.5))} xG`} aciklama="AMED HIZLI HÜCUM (GS 2,12)" renk={C.sari} w={470} p={pop(ts, tYet - 0.4, tYet + 0.2)} />
      </div>
    </>
  );
};

// ---- Sahne 5: Ev – deplasman ----
const S5: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[4].bas;
  const td = tw('deplasmanda') - s0, te = tw('evinde') - s0;
  const maxH = 560;
  const pd = pop(ts, td - 0.3, td + 0.9), pe = pop(ts, te - 0.3, te + 0.9);
  const bar = (v: number, renk: string, p: number, ad: string, logo: string, left: number) => (
    <>
      <div style={{position: 'absolute', left, bottom: 0, width: 280, height: (v / 2.8) * maxH * Math.max(0, p), background: `linear-gradient(180deg, ${renk}, ${renk}cc)`, borderRadius: '8px 8px 0 0', boxShadow: `0 0 ${36 * Math.min(1, p)}px ${renk}88`, overflow: 'hidden'}}>
        {p > 0.9 && <div style={{position: 'absolute', left: 0, right: 0, height: 120, top: ((ts * 380 + left) % (maxH + 200)) - 120, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)'}} />}
      </div>
      <div style={{position: 'absolute', left, width: 280, bottom: (v / 2.8) * maxH * Math.max(0, p) + 8, textAlign: 'center', fontSize: 68, fontWeight: 900, color: renk, opacity: Math.min(1, p * 2)}}>{virgul(v * Math.min(1, p))}</div>
      <div style={{position: 'absolute', left: left - 30, width: 340, top: maxH + 16, textAlign: 'center', transform: `scale(${Math.min(1, p) * (1 + 0.04 * Math.sin(ts * 4))})`}}>
        <Img src={staticFile('img/' + logo)} style={{width: 96, height: 96, objectFit: 'contain'}} />
        <div style={{fontSize: 30, fontWeight: 900, color: C.metin}}>{ad}</div>
      </div>
    </>
  );
  const fark = pop(ts, te + 0.9, te + 1.5);
  return (
    <>
      <Etiket ts={ts} yazi="BÖLÜM 5 · EV – DEPLASMAN" baslik="Evde fark büyüyor" />
      <div style={{position: 'absolute', left: 70, width: 940, top: 480, height: maxH}}>
        {[0.5, 1.0, 1.5, 2.0, 2.5].map((v) => (
          <div key={v} style={{position: 'absolute', left: 0, right: 0, bottom: (v / 2.8) * maxH, borderTop: `1px solid ${C.kenar}`, opacity: 0.5}}>
            <span style={{position: 'absolute', left: 0, top: -24, fontSize: 20, fontWeight: 900, color: C.kenar}}>{virgul(v, 1)}</span>
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: C.kenar}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: (1.46 / 2.8) * maxH, borderTop: `3px dashed ${C.sari}`, opacity: seg(ts, 0.3, 0.9)}}>
          <span style={{position: 'absolute', right: 0, top: -36, fontSize: 24, fontWeight: 900, color: C.sari}}>LİG ORT. 1,46</span>
        </div>
        {bar(1.38, C.sari, pd, 'AMED DEPLASMANDA', 'amed.png', 80)}
        {bar(2.54, C.yesil, pe, 'GS EVDE', 'gs.png', 580)}
        <div style={{position: 'absolute', left: 360, width: 220, top: 110, textAlign: 'center', opacity: Math.min(1, fark * 2), transform: `scale(${fark}) rotate(${(1 - fark) * -20}deg)`}}>
          <div style={{fontSize: 88, fontWeight: 900, color: C.metin, lineHeight: 1, textShadow: `0 0 24px ${C.yesil}`}}>×1,8</div>
          <div style={{fontSize: 30, fontWeight: 900, color: C.yesil, marginTop: 6}}>+1,16 xG</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1230, textAlign: 'center', fontSize: 28, fontWeight: 900, color: C.ikinci}}>xG / MAÇ</div>
    </>
  );
};

// ---- Sahne 6: Vuruş + kapanış ----
const S6: React.FC<{ts: number}> = ({ts}) => {
  const s0 = veri.sahneler[5].bas;
  const ty = tw('altmış') - s0, tsn = tw('Sence') - s0, ttk = tw('takip') - s0;
  const oranlar = [{ad: 'GALATASARAY', d: 66, r: C.yesil}, {ad: 'BERABERLİK', d: 20, r: C.ikinci}, {ad: 'AMEDSPOR', d: 14, r: C.sari}];
  const p = seg(ts, 0.3, ty + 0.9);
  const kapanis = seg(ts, ttk - 0.3, ttk + 0.5);
  const sp = pop(ts, tsn - 0.3, tsn + 0.4);
  const skorlar = ['2-1', '3-0', '1-1', '2-0', '3-1', '1-2'];
  const lt = Math.max(0, ts - (tsn + 0.2));
  return (
    <>
      <div style={{opacity: 1 - kapanis}}>
        <Etiket ts={ts} yazi="BÖLÜM 10 · KAPANIŞ" baslik="Model ne diyor?" />
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
          <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci, marginTop: 24, opacity: seg(ts, ty + 0.5, ty + 1.1)}}>PİYASA: GS %67 · MODEL: GS %66 · KADRO FARKI 12 KAT</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', opacity: seg(ts, 0.9, 1.5) * (1 - lin(ts, tsn - 0.4, tsn)), transform: `scale(${(0.6 + 0.4 * pop(ts, 0.9, 1.6)) * (1 + 0.04 * Math.sin(ts * 6))})`}}>
          <div style={{fontSize: 300, fontWeight: 900, color: C.yesil, lineHeight: 1, textShadow: '0 0 40px rgba(57,240,138,0.55)'}}>%{Math.round(66 * p)}</div>
          <div style={{fontSize: 40, fontWeight: 900, color: C.ikinci}}>GS KAZANMA İHTİMALİ (MODEL)</div>
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
