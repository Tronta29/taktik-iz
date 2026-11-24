import React from 'react';
import {Easing, Img, staticFile} from 'remotion';

export const C = {
  bg: '#071510', panel: '#0f2a1c', kenar: '#1f5a38', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6',
  sari: '#ffd60a', kirmizi: '#ff4d3d', saha: '#155f34', seritA: '#17703c', seritB: '#1c7a43',
  ts: '#4fc3ff', ala: '#ff9a3c',
};
export const FONT = "'Montserrat', sans-serif";
export const TS = {ic: '#8c1538', halka: '#4fc3ff'};
export const ALA = {ic: '#f58220', halka: '#1b9e3e'};

// ---- zaman yardımcıları ----
const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const seg = (t: number, a: number, b: number) => ease(lin(t, a, b));
export const pop = (t: number, a: number, b: number) => Easing.out(Easing.back(2))(lin(t, a, b));
export const virgul = (v: number, d = 2) => v.toFixed(d).replace('.', ',');

// ---- Rozet (takım dairesi) ----
export const Rozet: React.FC<{t: {ic: string; halka: string}; ad: string; b: number}> = ({t, ad, b}) => (
  <div style={{width: b, height: b, borderRadius: '50%', background: t.ic, border: `${Math.max(3, b * 0.05)}px solid ${t.halka}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: b * (ad.length > 2 ? 0.3 : 0.38), fontWeight: 900, color: '#fff', flexShrink: 0}}>{ad}</div>
);

// ---- Panel ----
export const Panel: React.FC<{renk?: string; style?: React.CSSProperties; p?: number; children?: React.ReactNode}> = ({renk = C.yesil, style, p = 1, children}) => (
  <div style={{background: C.panel, borderTop: `5px solid ${renk}`, padding: '16px 22px', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})`, ...style}}>{children}</div>
);

export const Baslik: React.FC<{yazi: string; ts: number}> = ({yazi, ts}) => (
  <div style={{position: 'absolute', left: 60, top: 118, fontSize: 28, fontWeight: 900, color: C.yesil, letterSpacing: 3, opacity: seg(ts, 0, 0.4), transform: `translateX(${(1 - seg(ts, 0, 0.5)) * -120}px)`}}>{yazi}</div>
);

// ---- Yatay çubuklar ----
export type Satir = {ad: string; deger: number; max: number; renk: string; at: number; fmt?: (v: number) => string; rozet?: {t: {ic: string; halka: string}; ad: string}};
export const Cubuklar: React.FC<{satirlar: Satir[]; ts: number; w?: number; bh?: number; yazi?: number}> = ({satirlar, ts, w = 800, bh = 26, yazi = 30}) => (
  <div style={{width: w}}>
    {satirlar.map((s, i) => {
      const p = seg(ts, s.at, s.at + 1.0);
      const goster = s.fmt ? s.fmt(s.deger * p) : String(Math.round(s.deger * p));
      return (
        <div key={i} style={{display: 'flex', alignItems: 'center', marginBottom: 16, opacity: Math.min(1, p * 3), transform: `translateX(${(1 - Math.min(1, p * 1.6)) * -60}px)`}}>
          {s.rozet ? <div style={{marginRight: 14}}><Rozet t={s.rozet.t} ad={s.rozet.ad} b={56} /></div> : null}
          <div style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: yazi, fontWeight: 900}}>
              <span style={{color: C.metin}}>{s.ad}</span><span style={{color: s.renk}}>{goster}</span>
            </div>
            <div style={{height: bh, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 6, overflow: 'hidden', position: 'relative'}}>
              <div style={{height: '100%', width: `${(s.deger / s.max) * 100 * p}%`, background: s.renk}} />
              {p > 0.95 && <div style={{position: 'absolute', top: 0, bottom: 0, width: 80, left: ((ts * 420 + i * 130) % (w + 300)) - 120, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', transform: 'skewX(-20deg)'}} />}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// ---- Büyük sayı kartı ----
export const Sayi: React.FC<{deger: string; ad: string; renk?: string; p: number; w?: number; kucuk?: boolean}> = ({deger, ad, renk = C.yesil, p, w = 260, kucuk}) => (
  <div style={{width: w, background: C.panel, borderTop: `5px solid ${renk}`, padding: '12px 16px 14px', textAlign: 'center', opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * p})`, boxShadow: `0 0 ${30 * Math.max(0, 1 - Math.abs(p - 1) * 3)}px ${renk}`}}>
    <div style={{fontSize: kucuk ? 52 : 70, fontWeight: 900, color: renk, lineHeight: 1.05}}>{deger}</div>
    <div style={{fontSize: 22, fontWeight: 900, color: C.ikinci, marginTop: 2}}>{ad}</div>
  </div>
);

// ---- Form şeridi ----
export const FormSerit: React.FC<{sonuc: string; ts: number; basla: number; boyut?: number}> = ({sonuc, ts, basla, boyut = 78}) => (
  <div style={{display: 'flex', gap: 10}}>
    {sonuc.split('').map((r, i) => {
      const p = pop(ts, basla + i * 0.18, basla + 0.4 + i * 0.18);
      const renk = r === 'G' ? C.yesil : r === 'M' ? C.kirmizi : C.ikinci;
      return <div key={i} style={{width: boyut, height: boyut * 0.78, background: renk, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: boyut * 0.5, fontWeight: 900, color: C.bg, transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>{r}</div>;
    })}
  </div>
);

// ---- Saha (yatay, 600x390) ----
const W = 600, H = 390;
export const px = (x: number) => 8 + (x / 100) * (W - 16);
export const py = (y: number) => 8 + (y / 100) * (H - 16);
export const Saha: React.FC<{w: number; children?: React.ReactNode}> = ({w, children}) => {
  const l = {fill: 'none', stroke: '#fff', strokeOpacity: 0.9, strokeWidth: 1.6};
  const s = w / W;
  return (
    <svg width={W * s} height={H * s} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', background: C.saha, border: '3px solid #1d6b3f', borderRadius: 6}}>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={8 + i * 58.4} y={8} width={58.4} height={H - 16} fill={i % 2 ? C.seritB : C.seritA} />)}
      <rect x={8} y={8} width={W - 16} height={H - 16} {...l} />
      <line x1={300} y1={8} x2={300} y2={H - 8} {...l} />
      <circle cx={300} cy={195} r={50} {...l} />
      <circle cx={300} cy={195} r={2.5} fill="#fff" />
      <rect x={8} y={84} width={100} height={222} {...l} />
      <rect x={8} y={144} width={32} height={102} {...l} />
      <rect x={W - 108} y={84} width={100} height={222} {...l} />
      <rect x={W - 40} y={144} width={32} height={102} {...l} />
      {children}
    </svg>
  );
};
export const Oyuncu: React.FC<{x: number; y: number; t: {ic: string; halka: string}; ad?: string; op?: number; halka?: boolean; r?: number}> = ({x, y, t, ad, op = 1, halka, r = 11}) => (
  <g opacity={op}>
    <ellipse cx={px(x) + 2} cy={py(y) + 10} rx={r} ry={r * 0.4} fill="#000" opacity={0.35} />
    {halka && <circle cx={px(x)} cy={py(y)} r={r + 6} fill="none" stroke="#fff" strokeWidth={1.8} />}
    <circle cx={px(x)} cy={py(y)} r={r} fill={t.ic} stroke={t.halka} strokeWidth={2.4} />
    {ad && <text x={px(x)} y={py(y) + r + 13} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff" stroke="#000" strokeWidth={0.4} fontFamily="Montserrat">{ad}</text>}
  </g>
);

// ---- Isı haritası (canvas'tan bir kez üretilir) ----
const GX = 12, GY = 8;
const stops: [number, number[]][] = [[0.18, [0, 200, 110, 0.59]], [0.45, [57, 240, 138, 0.82]], [0.7, [255, 214, 10, 0.92]], [0.88, [255, 120, 40, 0.96]], [1, [255, 60, 50, 1]]];
const renkIsi = (v: number): number[] | null => {
  if (v < 0.05) return null;
  if (v <= stops[0][0]) return [0, 200, 110, stops[0][1][3] * (v / stops[0][0])];
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      const p = (v - t0) / (t1 - t0);
      return c0.map((x, k) => x + (c1[k] - x) * p);
    }
  }
  return [255, 60, 50, 1];
};
const onbellek = new Map<string, string>();
export const isiUrl = (grid: string): string => {
  const var_ = onbellek.get(grid);
  if (var_) return var_;
  const cw = 360, ch = 234;
  const cv = document.createElement('canvas');
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(cw, ch);
  const g = grid.split('').map((c) => parseInt(c, 36) / 35);
  const at = (i: number, j: number) => g[Math.min(GY - 1, Math.max(0, j)) * GX + Math.min(GX - 1, Math.max(0, i))];
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const fi = ((x + 0.5) / cw) * GX - 0.5, fj = ((y + 0.5) / ch) * GY - 0.5;
    const i0 = Math.floor(fi), j0 = Math.floor(fj), ti = fi - i0, tj = fj - j0;
    const v = at(i0, j0) * (1 - ti) * (1 - tj) + at(i0 + 1, j0) * ti * (1 - tj) + at(i0, j0 + 1) * (1 - ti) * tj + at(i0 + 1, j0 + 1) * ti * tj;
    const c = renkIsi(Math.pow(v, 1.15));
    const k = (y * cw + x) * 4;
    if (c) { img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = Math.round(c[3] * 255); }
  }
  ctx.putImageData(img, 0, 0);
  const u = cv.toDataURL('image/png');
  onbellek.set(grid, u);
  return u;
};
export const Isi: React.FC<{grid: string}> = ({grid}) => <image href={isiUrl(grid)} x={8} y={8} width={W - 16} height={H - 16} preserveAspectRatio="none" />;

// ---- 15'er dakikalık grafik ----
export type Seri = {ad: string; renk: string; vals: number[]};
export const DilimGrafik: React.FC<{seriler: Seri[]; ts: number; at: number; vurgu?: number[]; h?: number; w?: number; birim?: string; ondalik?: number}> = ({seriler, ts, at, vurgu = [], h = 330, w = 900, birim = '', ondalik = 2}) => {
  const dilim = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90'];
  const mx = Math.max(...seriler.flatMap((s) => s.vals)) * 1.12;
  const kw = w / 6;
  const bw = Math.min(54, (kw - 24) / seriler.length);
  return (
    <div style={{width: w}}>
      <div style={{display: 'flex', gap: 24, marginBottom: 8}}>
        {seriler.map((s) => <span key={s.ad} style={{fontSize: 24, fontWeight: 900, color: s.renk}}>■ {s.ad}</span>)}
      </div>
      <div style={{display: 'flex', height: h, alignItems: 'flex-end', borderBottom: `3px solid ${C.kenar}`, position: 'relative'}}>
        {dilim.map((d, i) => {
          const p = seg(ts, at + i * 0.25, at + 0.9 + i * 0.25);
          const v = vurgu.includes(i);
          return (
            <div key={d} style={{width: kw, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, background: v ? 'rgba(255,214,10,0.10)' : 'transparent', boxShadow: v ? `inset 0 0 0 2px rgba(255,214,10,0.6)` : 'none'}}>
              {seriler.map((s) => (
                <div key={s.ad} style={{width: bw, height: (s.vals[i] / mx) * (h - 40) * p, background: s.renk, position: 'relative'}}>
                  <div style={{position: 'absolute', top: -30, left: -10, right: -10, textAlign: 'center', fontSize: 20, fontWeight: 900, color: C.metin, opacity: p > 0.9 ? 1 : 0}}>{ondalik === 0 ? s.vals[i] : virgul(s.vals[i], ondalik)}{birim}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex'}}>{dilim.map((d) => <div key={d} style={{width: kw, textAlign: 'center', fontSize: 24, fontWeight: 900, color: C.ikinci, marginTop: 6}}>{d}</div>)}</div>
    </div>
  );
};

export const Logo: React.FC<{w: number; style?: React.CSSProperties}> = ({w, style}) => <Img src={staticFile('img/taktikiz-logo-seffaf.png')} style={{width: w, ...style}} />;
