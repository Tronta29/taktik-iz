import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// ---- Görsel şema renkleri (taktik-iz-gorsel-sema.md) ----
export const C = {
  bg: '#071510', panel: '#0f2a1c', kenar: '#1f5a38', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6',
  saha: '#155f34', seritA: '#17703c', seritB: '#1c7a43', sari: '#ffd60a', kirmizi: '#ff4d3d', mavi: '#4fc3ff', turuncu: '#ff9a3c',
};
export type Tema = {ic: string; halka: string; no: string};
export const TS: Tema = {ic: '#7a1534', halka: '#4fc3ff', no: '#4fc3ff'};
export const ALA: Tema = {ic: '#0a8f3c', halka: '#ff9a3c', no: '#ffffff'};
export const BJK: Tema = {ic: '#111111', halka: '#ffffff', no: '#ffffff'};
export const GBR: Tema = {ic: '#b3122b', halka: '#1a1a1a', no: '#ffffff'};
export const FONT = "'Montserrat', sans-serif";

// ---- Zaman yardımcıları ----
const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const lin = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const seg = (t: number, a: number, b: number) => ease(lin(t, a, b));
export const pop = (t: number, a: number, b: number) => Easing.out(Easing.back(2.2))(lin(t, a, b));
export const kf = (t: number, pts: [number, number][]) => {
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
export const virgul = (v: number, d = 2) => v.toFixed(d).replace('.', ',');
export const bicim = (v: number, d: number) => (d === 0 ? String(Math.round(v)) : virgul(v, d));

// ---- Kelime zamanları (karaoke + sahne bağlantıları) ----
export type Kelime = {k: string; bas: number; bit: number};
const nrm = (s: string) => s.toLocaleLowerCase('tr').replace(/[^\p{L}\p{N}]/gu, '');

export const hazirla = (veri: any) => {
  const KELIMELER: Kelime[] = [];
  (veri.kelimeler as Kelime[]).forEach((w, i, arr) => {
    if (w.k === 'Taktik' && arr[i + 1]?.k.startsWith('İz')) { KELIMELER.push({k: 'Taktik ' + arr[i + 1].k, bas: w.bas, bit: arr[i + 1].bit}); return; }
    if (i > 0 && arr[i - 1].k === 'Taktik' && w.k.startsWith('İz')) return;
    KELIMELER.push(w);
  });
  const SATIRLAR: Kelime[][] = [];
  let cur: Kelime[] = [];
  KELIMELER.forEach((w) => {
    cur.push(w);
    if (cur.length >= 5 || /[.?!]$/.test(w.k) || (cur.length >= 3 && /,$/.test(w.k))) { SATIRLAR.push(cur); cur = []; }
  });
  if (cur.length) SATIRLAR.push(cur);
  const SAHNE = veri.sahneler.map((s: any, i: number) => ({id: s.id, bas: i === 0 ? 0 : s.bas, bit: s.bit}));
  // i. sahnede (0'dan) nth eşleşen kelimenin sahneye göre zamanı. needle sonunda * varsa önek eşleşmesi.
  const wr = (i: number, needle: string, nth = 0): number => {
    const bas = veri.sahneler[i].bas - 0.001;
    const son = i + 1 < veri.sahneler.length ? veri.sahneler[i + 1].bas - 0.001 : 1e9;
    const pre = needle.endsWith('*');
    const n = nrm(needle.replace('*', ''));
    let c = 0;
    for (const w of KELIMELER) {
      if (w.bas < bas || w.bas >= son) continue;
      const k = nrm(w.k);
      if (pre ? k.startsWith(n) : k === n) { if (c === nth) return w.bas - SAHNE[i].bas; c++; }
    }
    throw new Error(`kelime yok: sahne ${i + 1} "${needle}" #${nth}`);
  };
  return {KELIMELER, SATIRLAR, SAHNE, TOPLAM_SN: veri.toplam + 0.9, wr, toplam: veri.toplam as number};
};
export type Ctx = ReturnType<typeof hazirla>;

// ---- Arka plan ----
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

const Karaoke: React.FC<{t: number; ctx: Ctx}> = ({t, ctx}) => {
  if (t > ctx.toplam + 0.1) return null;
  const satir = ctx.SATIRLAR.find((s) => t < s[s.length - 1].bit + 0.15) ?? ctx.SATIRLAR[ctx.SATIRLAR.length - 1];
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1400, minHeight: 190, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 18px', background: 'rgba(7,21,16,0.82)', border: `3px solid ${C.kenar}`, borderRadius: 22, padding: '22px 34px'}}>
        {satir.map((w, i) => {
          const ac = t >= w.bas;
          const sc = ac ? 1 + 0.2 * (1 - pop(t, w.bas, w.bas + 0.18)) : 1;
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

// ---- Kabuk: ses + sahneler + altyazı ----
export const Kabuk: React.FC<{ctx: Ctx; sahneler: React.FC<{ts: number}>[]}> = ({ctx, sahneler}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ilerleme = Math.min(1, t / ctx.toplam);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}} lang="tr">
      <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
      <Audio src={staticFile('ses.mp3')} />
      <Arka t={t} />
      <Baslik t={t} />
      {sahneler.map((S, i) => {
        const sc = ctx.SAHNE[i];
        const son = i === sahneler.length - 1;
        const bit = son ? ctx.TOPLAM_SN : sc.bit;
        if (t < sc.bas || t > bit + 0.25) return null;
        const gir = i === 0 ? 1 : seg(t, sc.bas, sc.bas + 0.45);
        const cik = son ? 0 : lin(t, bit - 0.05, bit + 0.25);
        return (
          <AbsoluteFill key={i} style={{opacity: Math.min(1, gir * 1.5) * (1 - cik), transform: `translateY(${(1 - gir) * 70 - cik * 50}px) scale(${0.96 + 0.04 * gir})`}}>
            <S ts={t - sc.bas} />
          </AbsoluteFill>
        );
      })}
      <Karaoke t={t} ctx={ctx} />
      <div style={{position: 'absolute', left: 56, right: 56, bottom: 120, height: 10, background: C.panel, borderRadius: 5, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${ilerleme * 100}%`, background: C.yesil, borderRadius: 5, boxShadow: `0 0 14px ${C.yesil}`}} />
      </div>
    </AbsoluteFill>
  );
};

// ---- Parçalar ----
export const Etiket: React.FC<{yazi: string; baslik?: string; ts: number}> = ({yazi, baslik, ts}) => (
  <div style={{position: 'absolute', left: 56, right: 56, top: 196, overflow: 'hidden'}}>
    <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, letterSpacing: 2, transform: `translateX(${(1 - seg(ts, 0, 0.45)) * -120}px)`, opacity: seg(ts, 0, 0.3)}}>{yazi}</div>
    {baslik && <div style={{fontSize: 46, fontWeight: 900, color: C.metin, marginTop: 6, transform: `translateX(${(1 - seg(ts, 0.1, 0.6)) * 160}px)`, opacity: seg(ts, 0.1, 0.45)}}>{baslik}</div>}
  </div>
);

export const Rozet: React.FC<{t: Tema; ad: string; b: number}> = ({t, ad, b}) => (
  <div style={{width: b, height: b, borderRadius: '50%', background: t.ic, border: `${Math.max(3, b * 0.05)}px solid ${t.halka}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: b * (ad.length > 2 ? 0.3 : 0.38), fontWeight: 900, color: t.no, flexShrink: 0}}>{ad}</div>
);

export const Kutu: React.FC<{deger: string; aciklama: string; renk?: string; w?: number; p?: number}> = ({deger, aciklama, renk = C.yesil, w = 460, p = 1}) => (
  <div style={{width: w, background: C.panel, borderTop: `5px solid ${renk}`, padding: '14px 18px 16px', opacity: Math.min(1, p * 2), textAlign: 'center', transform: `scale(${0.6 + 0.4 * p})`, boxShadow: `0 0 ${30 * (1 - Math.abs(p - 1))}px ${renk}`}}>
    <div style={{fontSize: 56, fontWeight: 900, color: renk}}>{deger}</div>
    <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci, marginTop: 2}}>{aciklama}</div>
  </div>
);

const Bar: React.FC<{ad: string; deger: number; max: number; renk: string; p: number; metin: string; ts: number; logo?: Tema; ad2?: string; fs?: number}> = ({ad, deger, max, renk, p, metin, ts, logo, ad2, fs = 32}) => (
  <div style={{display: 'flex', alignItems: 'center', marginBottom: 22, opacity: Math.min(1, p * 3), transform: `translateX(${(1 - Math.min(1, p * 1.5)) * -80}px)`}}>
    {logo ? <Rozet t={logo} ad={ad2 ?? ''} b={78} /> : <div style={{width: 78}} />}
    <div style={{flex: 1, marginLeft: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: fs, fontWeight: 900}}>
        <span style={{color: C.metin}}>{ad}</span><span style={{color: renk}}>{metin}</span>
      </div>
      <div style={{height: 26, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 8, overflow: 'hidden', position: 'relative'}}>
        <div style={{height: '100%', width: `${(deger / max) * 100 * p}%`, background: renk}} />
        {p > 0.95 && <div style={{position: 'absolute', top: 0, bottom: 0, width: 80, left: ((ts * 420 + deger * 9) % 1300) - 120, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-20deg)'}} />}
      </div>
    </div>
  </div>
);

// ---- Sahne: Hook ----
export const Hook: React.FC<{
  ts: number; badge: {yazi: string; t: Tema}; tBadge: number; tBuyuk: number; deger: number; d: number; etiket: string; alt: string;
  A: {t: Tema; ad: string}; B: {t: Tema; ad: string}; barlar: {ad: string; deger: number; max: number; renk: string}[]; onSahne?: React.ReactNode;
}> = ({ts, badge, tBadge, tBuyuk, deger, d, etiket, alt, A, B, barlar, onSahne}) => {
  const u = ts - tBuyuk;
  const sayac = deger * seg(ts, tBuyuk, tBuyuk + 1.1);
  const slam = u < 1.1 ? 1 : 1 + 0.03 * Math.sin((u - 1.1) * 7) * Math.exp(-(u - 1.1) * 0.5);
  const sal = u > 0.05 && u < 0.45 ? Math.sin(u * 90) * 8 * (1 - (u - 0.05) / 0.4) : 0;
  const bel = pop(ts, tBadge - 0.1, tBadge + 0.5);
  const barP = seg(ts, 2.2, 3.4);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 215, textAlign: 'center', opacity: Math.min(1, bel * 2), transform: `scale(${0.6 + 0.4 * bel})`}}>
        <div style={{display: 'inline-block', background: badge.t.ic, border: `4px solid ${badge.t.halka}`, borderRadius: 16, padding: '8px 34px', fontSize: 42, fontWeight: 900, color: badge.t.no}}>{badge.yazi}</div>
      </div>
      {onSahne && <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: 1 - lin(ts, tBuyuk - 0.2, tBuyuk + 0.1)}}>{onSahne}</div>}
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: u < -0.01 ? 0 : 1, transform: `translateX(${sal}px) scale(${(u < 1.1 ? 1 + 0.6 * (1 - pop(ts, tBuyuk, tBuyuk + 0.6)) : 1) * slam})`}}>
        <div style={{fontSize: 330, fontWeight: 900, color: C.yesil, lineHeight: 1, whiteSpace: 'nowrap', textShadow: `0 0 ${40 + 30 * Math.sin(ts * 5)}px rgba(57,240,138,0.55)`}}>{bicim(sayac, d)}</div>
        <div style={{fontSize: 44, fontWeight: 900, color: C.metin, marginTop: 4, opacity: seg(ts, tBuyuk + 0.7, tBuyuk + 1.2)}}>{etiket}</div>
        <div style={{fontSize: 30, fontWeight: 900, color: C.ikinci, marginTop: 4, opacity: seg(ts, tBuyuk + 0.9, tBuyuk + 1.4)}}>{alt}</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 880, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50}}>
        <div style={{transform: `scale(${pop(ts, 1.3, 1.9)})`}}><Rozet t={A.t} ad={A.ad} b={200} /></div>
        <div style={{fontSize: 80, fontWeight: 900, color: C.metin, opacity: seg(ts, 1.5, 2.0)}}>VS</div>
        <div style={{transform: `scale(${pop(ts, 1.5, 2.1)})`}}><Rozet t={B.t} ad={B.ad} b={200} /></div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1140, opacity: seg(ts, 2.1, 2.6)}}>
        {barlar.map((b, i) => (
          <div key={i} style={{marginTop: i ? 14 : 0}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 900}}>
              <span style={{color: b.renk}}>{b.ad}</span><span style={{color: b.renk}}>{bicim(b.deger * barP, Number.isInteger(b.deger) ? 0 : 2)}</span>
            </div>
            <div style={{height: 24, background: C.panel, border: `2px solid ${C.kenar}`, marginTop: 8}}><div style={{height: '100%', width: `${(b.deger / b.max) * 100 * barP}%`, background: b.renk}} /></div>
          </div>
        ))}
      </div>
    </>
  );
};

// ---- Sahne: Bağlam (gruplu çubuklar) ----
export type BarCfg = {ad: string; deger: number; max: number; renk: string; tema: Tema; kisa: string; t: number; birim: string; fs?: number};
export type Grup = {baslik: string; renk: string; y: number; t: number; barlar: BarCfg[]};
export const Baglam: React.FC<{ts: number; yazi: string; baslik: string; gruplar: Grup[]}> = ({ts, yazi, baslik, gruplar}) => (
  <>
    <Etiket ts={ts} yazi={yazi} baslik={baslik} />
    {gruplar.map((g, gi) => (
      <div key={gi} style={{position: 'absolute', left: 60, right: 60, top: g.y, opacity: gi === 0 ? 1 : seg(ts, g.t - 0.5, g.t - 0.05)}}>
        <div style={{fontSize: 26, fontWeight: 900, color: g.renk, marginBottom: 14, letterSpacing: 2}}>{g.baslik}</div>
        {g.barlar.map((b, i) => {
          const p = seg(ts, b.t - 0.3, b.t + 0.9);
          return <Bar key={i} ts={ts} ad={b.ad} deger={b.deger} max={b.max} renk={b.renk} p={p} metin={`${Math.round(b.deger * p)} ${b.birim}`} logo={b.tema} ad2={b.kisa} fs={b.fs} />;
        })}
      </div>
    ))}
  </>
);

// ---- Sahne: Form, hocalar, eksikler ----
const FormSerit: React.FC<{ad: string; kisa: string; t: Tema; sonuc: string; ts: number; basla: number}> = ({ad, kisa, t, sonuc, ts, basla}) => (
  <div style={{marginBottom: 24}}>
    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10, opacity: seg(ts, basla - 0.2, basla + 0.3)}}>
      <Rozet t={t} ad={kisa} b={70} />
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
export const FormTile: React.FC<{sonuc: string; ts: number; basla: number}> = ({sonuc, ts, basla}) => (
  <div style={{display: 'flex', gap: 14, justifyContent: 'center'}}>
    {sonuc.split('').map((r, i) => {
      const p = pop(ts, basla + i * 0.2, basla + 0.4 + i * 0.2);
      return <div key={i} style={{width: 150, height: 150, background: r === 'G' ? C.yesil : r === 'M' ? C.kirmizi : C.ikinci, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 84, fontWeight: 900, color: C.bg, transform: `scale(${p}) rotate(${(1 - p) * 40}deg)`, opacity: Math.min(1, p * 2)}}>{r}</div>;
    })}
  </div>
);

export type FormCfg = {ad: string; kisa: string; tema: Tema; sonuc: string; t: number};
export type KartCfg = {ust: string; ad: string; alt: string; altRenk: string; kenar: string; t: number; fs?: number};
export type EksikCfg = {ust: string; yazi: string; t: number; fs?: number; flex?: number};
export const FormSahne: React.FC<{ts: number; yazi: string; baslik: string; formlar: FormCfg[]; kartlar: KartCfg[]; tEksik: number; eksikler: EksikCfg[]}> = ({ts, yazi, baslik, formlar, kartlar, tEksik, eksikler}) => (
  <>
    <Etiket ts={ts} yazi={yazi} baslik={baslik} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 400}}>
      {formlar.map((f, i) => <FormSerit key={i} ad={f.ad} kisa={f.kisa} t={f.tema} sonuc={f.sonuc} ts={ts} basla={f.t} />)}
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 940, display: 'flex', gap: 24}}>
      {kartlar.map((k, i) => {
        const h = pop(ts, k.t, k.t + 0.7);
        return (
          <div key={i} style={{flex: 1, background: C.panel, borderTop: `5px solid ${k.kenar}`, padding: '16px 20px', opacity: Math.min(1, h * 2), transform: `translateY(${(1 - h) * 50}px)`}}>
            <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>{k.ust}</div>
            <div style={{fontSize: k.fs ?? 38, fontWeight: 900, color: C.metin}}>{k.ad}</div>
            <div style={{fontSize: 24, fontWeight: 900, color: k.altRenk, marginTop: 6}}>{k.alt}</div>
          </div>
        );
      })}
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 1130}}>
      <div style={{fontSize: 26, fontWeight: 900, color: C.kirmizi, letterSpacing: 2, marginBottom: 10, opacity: seg(ts, tEksik - 0.6, tEksik - 0.2)}}>EKSİKLER</div>
      <div style={{display: 'flex', gap: 24}}>
        {eksikler.map((e, i) => {
          const p = pop(ts, e.t - 0.2, e.t + 0.4);
          return (
            <div key={i} style={{flex: e.flex ?? 1, background: C.panel, borderLeft: `6px solid ${C.kirmizi}`, padding: '14px 18px', opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * p})`}}>
              <div style={{fontSize: 22, fontWeight: 900, color: C.ikinci}}>{e.ust}</div>
              <div style={{fontSize: e.fs ?? 30, fontWeight: 900, color: C.metin, lineHeight: 1.15}}>{e.yazi}</div>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

// ---- Saha (dikey) ----
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
  const seritler = Array.from({length: 10}, (_, i) => <rect key={i} x={M} y={M + i * 58.4} width={W - 2 * M} height={58.4} fill={i % 2 ? C.seritB : C.seritA} />);
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

// ---- Sahne: Saha animasyonu (kurulum → kanat → orta → şut) ----
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
export type KutuCfg = {v: number; d: number; ad: string; renk: string; t: number};
export const SahaSahne: React.FC<{ts: number; yazi: string; baslik: string; atk: Tema; sav: Tema; bolge: string; kutular: KutuCfg[]}> = ({ts, yazi, baslik, atk, sav, bolge, kutular}) => {
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
  const forvet: [number, number] = [kf(tl, [[0, 74], [2.8, 74], [3.8, 84]]), kf(tl, [[0, 50], [2.8, 50], [3.8, 52]])];
  const bol = 0.5 + 0.5 * Math.abs(Math.sin(ts * 3));
  const [zx, zy] = P(94, 96), [zx2, zy2] = P(62, 4);
  const sutP = lin(tl, 3.8, 4.5);
  const [ssx, ssy] = P(84, 52), [skx, sky] = P(99, 47);
  return (
    <>
      <Etiket ts={ts} yazi={yazi} baslik={baslik} />
      <div style={{position: 'absolute', left: (1080 - cw) / 2, top: 320, width: cw, height: ch, overflow: 'hidden', borderRadius: 10, border: '3px solid #1d6b3f', opacity: seg(ts, 0, 0.5), transform: `translateY(${(1 - seg(ts, 0, 0.5)) * 60}px)`, boxSizing: 'content-box'}}>
        <div style={{width: cw, height: ch, transform: `scale(${zoom})`, transformOrigin: `${bpx * scale}px ${bpy * scale}px`}}>
          <Saha scale={scale}>
            <rect x={Math.min(zx, zx2)} y={Math.min(zy, zy2)} width={Math.abs(zx2 - zx)} height={Math.abs(zy2 - zy)} rx={10} fill={C.sari} opacity={0.14 * bol} stroke={C.sari} strokeDasharray="6 5" strokeWidth={1.5} strokeOpacity={0.9 * bol} />
            <text x={(zx + zx2) / 2} y={zy + 22} textAnchor="middle" fontSize={16} fontWeight={900} fill={C.sari} fontFamily={FONT}>{bolge}</text>
            {fb.map(([x, y], i) => { const [jx, jy] = jit(i); return <Forma key={'f' + i} x={x + jx} y={y + jy} k={atk} />; })}
            {cor.map(([x, y], i) => { const [jx, jy] = jit(i + 20); const yy = i === 0 ? y : y + (by > 50 ? kay : -kay * 0.5); return <Forma key={'c' + i} x={x + jx} y={Math.min(96, Math.max(4, yy)) + jy} k={sav} op={0.7} />; })}
            <Forma x={forvet[0]} y={forvet[1]} k={atk} halka />
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
        {kutular.map((k, i) => <Kutu key={i} deger={bicim(k.v * seg(ts, k.t, k.t + 0.8), k.d)} aciklama={k.ad} renk={k.renk} w={325} p={pop(ts, k.t - 0.3, k.t + 0.3)} />)}
      </div>
    </>
  );
};

// ---- Sahne: Dilim grafiği (15'er dakika) ----
export type SeriCfg = {ad: string; renk: string; v: number[]};
export const Dilim: React.FC<{ts: number; yazi: string; baslik: string; A: SeriCfg; B: SeriCfg; vurgular: {idx: number[]; t: number}[]; max: number; alt: string}> = ({ts, yazi, baslik, A, B, vurgular, max, alt}) => {
  const lab = ['1-15', '16-30', '31-45', '46-60', '61-75', '76-90'];
  const x0 = 70, gw = 150, yTaban = 1180, yuk = 520;
  return (
    <>
      <Etiket ts={ts} yazi={yazi} baslik={baslik} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 395, display: 'flex', gap: 40, opacity: seg(ts, 0.2, 0.6)}}>
        {[A, B].map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 900, color: C.metin}}>
            <div style={{width: 30, height: 30, background: s.renk, borderRadius: 6}} />{s.ad}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: x0 - 10, right: x0 - 10, top: yTaban - yuk - 40, height: yuk + 50}}>
        {[0, 1, 2, 3].map((g) => <div key={g} style={{position: 'absolute', left: 0, right: 0, top: 40 + (yuk / 4) * g, height: 2, background: C.kenar, opacity: 0.5}} />)}
      </div>
      {vurgular.map((v, vi) => {
        const p = seg(ts, v.t - 0.2, v.t + 0.5);
        const a = Math.min(...v.idx), b = Math.max(...v.idx);
        return (
          <div key={vi} style={{position: 'absolute', left: x0 + a * gw - 6, top: yTaban - yuk - 20, width: (b - a + 1) * gw + 6, height: yuk + 100, border: `4px solid ${C.sari}`, borderRadius: 16, background: 'rgba(255,214,10,0.10)', opacity: p * (0.65 + 0.35 * Math.abs(Math.sin(ts * 4))), transform: `scale(${0.9 + 0.1 * p})`}} />
        );
      })}
      {lab.map((l, gi) => {
        const left = x0 + gi * gw;
        return (
          <React.Fragment key={gi}>
            {[A, B].map((s, si) => {
              const p = seg(ts, 0.5 + gi * 0.14 + si * 0.07, 1.4 + gi * 0.14 + si * 0.07);
              const hh = (s.v[gi] / max) * yuk * p;
              return (
                <div key={si} style={{position: 'absolute', left: left + 12 + si * 62, top: yTaban - hh, width: 56, height: hh, background: s.renk, borderRadius: '8px 8px 0 0'}}>
                  <div style={{position: 'absolute', left: -10, right: -10, top: -44, textAlign: 'center', fontSize: 36, fontWeight: 900, color: s.renk, opacity: p > 0.8 ? 1 : 0}}>{s.v[gi]}</div>
                </div>
              );
            })}
            <div style={{position: 'absolute', left, width: gw, top: yTaban + 12, textAlign: 'center', fontSize: 28, fontWeight: 900, color: C.ikinci}}>{l}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 70, right: 70, top: yTaban + 92, textAlign: 'center', fontSize: 24, fontWeight: 900, color: C.ikinci, opacity: seg(ts, 1.2, 1.8)}}>{alt}</div>
    </>
  );
};

// ---- Sahne: Oyuncu kartları ----
export type OyuncuCfg = {ad: string; fs?: number; kisa: string; tema: Tema; sol: string; solD: number; solOnd?: boolean; solDec?: number; solMax?: number; sag: string; sagD: number; renk: string; t: number};
const OyuncuKart: React.FC<{k: OyuncuCfg; p: number}> = ({k, p}) => (
  <div style={{width: 470, height: 400, background: C.panel, borderTop: `6px solid ${k.renk}`, padding: '20px 22px', opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * p}) rotate(${(1 - p) * -8}deg)`, boxShadow: `0 0 ${40 * Math.max(0, 1 - Math.abs(p - 1) * 3)}px ${k.renk}`}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Rozet t={k.tema} ad={k.kisa} b={86} />
      <div style={{marginLeft: 16, fontSize: k.fs ?? 44, fontWeight: 900, color: C.metin, lineHeight: 1.05}}>{k.ad}</div>
    </div>
    <div style={{marginTop: 22}}>
      <div style={{fontSize: 96, fontWeight: 900, color: k.renk, lineHeight: 1}}>{k.solOnd ? virgul(k.solD * Math.min(1, p), k.solDec ?? 2) : Math.round(k.solD * Math.min(1, p))}</div>
      <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>{k.sol}</div>
      <div style={{height: 14, background: C.bg, marginTop: 8}}><div style={{height: '100%', width: `${Math.min(100, (k.solD / (k.solMax ?? 8)) * 100) * Math.min(1, p)}%`, background: k.renk}} /></div>
    </div>
    <div style={{marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 12}}>
      <div style={{fontSize: 56, fontWeight: 900, color: C.metin}}>{Number.isInteger(k.sagD) ? Math.round(k.sagD * Math.min(1, p)) : virgul(k.sagD * Math.min(1, p))}</div>
      <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>{k.sag}</div>
    </div>
  </div>
);
export const Oyuncular: React.FC<{ts: number; yazi: string; baslik: string; satirlar: {ad: string; renk: string; kartlar: [OyuncuCfg, OyuncuCfg]}[]}> = ({ts, yazi, baslik, satirlar}) => (
  <>
    <Etiket ts={ts} yazi={yazi} baslik={baslik} />
    {satirlar.map((s, si) => {
      const yb = si === 0 ? 380 : 848, yk = si === 0 ? 420 : 885;
      return (
        <React.Fragment key={si}>
          <div style={{position: 'absolute', left: 60, right: 60, top: yb, fontSize: 26, fontWeight: 900, color: s.renk, letterSpacing: 2, opacity: seg(ts, 0.2 + si * 0.2, 0.7 + si * 0.2)}}>{s.ad}</div>
          {[60, 550].map((x) => <div key={x} style={{position: 'absolute', left: x, top: yk, width: 470, height: 400, border: `3px dashed ${C.kenar}`, opacity: 0.6}} />)}
          <div style={{position: 'absolute', left: 60, right: 60, top: yk, display: 'flex', justifyContent: 'space-between'}}>
            {s.kartlar.map((k, i) => <OyuncuKart key={i} k={k} p={pop(ts, k.t - 0.3, k.t + 0.5)} />)}
          </div>
        </React.Fragment>
      );
    })}
  </>
);

// ---- Sahne: Piyasa + kapanış ----
export const Kapanis: React.FC<{
  ts: number; yazi: string; baslik: string; oranlar: {ad: string; d: number; r: string}[]; kaynak: string; bigAd: string; tYuzde: number; tSence: number; tTakip: number;
}> = ({ts, yazi, baslik, oranlar, kaynak, bigAd, tYuzde, tSence, tTakip}) => {
  const p = seg(ts, 0.3, tYuzde + 0.9);
  const kapanis = seg(ts, tTakip - 0.3, tTakip + 0.5);
  const sp = pop(ts, tSence - 0.3, tSence + 0.4);
  const skorlar = ['2-1', '1-1', '3-0', '1-0', '2-2', '0-1'];
  const lt = Math.max(0, ts - (tSence + 0.2));
  return (
    <>
      <div style={{opacity: 1 - kapanis}}>
        <Etiket ts={ts} yazi={yazi} baslik={baslik} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 440}}>
          <div style={{display: 'flex', height: 120, border: `3px solid ${C.kenar}`, overflow: 'hidden'}}>
            {oranlar.map((o, i) => (
              <div key={i} style={{width: `${o.d * p}%`, background: o.r, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, fontWeight: 900, color: C.bg, overflow: 'hidden', whiteSpace: 'nowrap'}}>
                {o.d > 12 ? '%' + Math.round(o.d * p) : ''}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 24, fontWeight: 900, opacity: seg(ts, 0.8, 1.4)}}>
            {oranlar.map((o, i) => <span key={i} style={{color: o.r}}>{o.ad} %{o.d}</span>)}
          </div>
          <div style={{fontSize: 22, fontWeight: 900, color: C.ikinci, marginTop: 24, opacity: seg(ts, 1.2, 1.8)}}>{kaynak}</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', opacity: seg(ts, 0.9, 1.5) * (1 - lin(ts, tSence - 0.4, tSence)), transform: `scale(${(0.6 + 0.4 * pop(ts, 0.9, 1.6)) * (1 + 0.04 * Math.sin(ts * 6))})`}}>
          <div style={{fontSize: 300, fontWeight: 900, color: C.yesil, lineHeight: 1, textShadow: '0 0 40px rgba(57,240,138,0.55)'}}>%{Math.round(oranlar[0].d * p)}</div>
          <div style={{fontSize: 40, fontWeight: 900, color: C.ikinci}}>{bigAd}</div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 790, textAlign: 'center', opacity: Math.min(1, sp * 2), transform: `scale(${(0.5 + 0.5 * sp) * (1 + 0.025 * Math.sin(ts * 5))})`}}>
          <div style={{fontSize: 96, fontWeight: 900, color: C.yesil, lineHeight: 1.05, textShadow: '0 0 28px rgba(57,240,138,0.5)'}}>SENCE SKOR</div>
          <div style={{fontSize: 96, fontWeight: 900, color: C.metin, lineHeight: 1.05}}>NE OLUR?</div>
          <div style={{fontSize: 38, fontWeight: 900, color: C.ikinci, marginTop: 14}}>YORUMA YAZ</div>
        </div>
        {skorlar.map((s, i) => {
          const dt = lt - i * 0.45;
          if (dt < 0) return null;
          const dongu = (dt % 2.8) / 2.8;
          const x = 90 + ((i * 163) % 760);
          return <div key={i} style={{position: 'absolute', left: x, top: 1330 - dongu * 270, opacity: Math.sin(dongu * Math.PI), background: C.panel, border: `3px solid ${i % 2 ? C.sari : C.yesil}`, borderRadius: 24, padding: '4px 22px', fontSize: 40, fontWeight: 900, color: i % 2 ? C.sari : C.yesil}}>{s}</div>;
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, opacity: kapanis, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{position: 'absolute', left: '50%', top: '38%', width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: '50%', background: `radial-gradient(circle, rgba(57,240,138,${0.28 + 0.1 * Math.sin(ts * 6)}), transparent 65%)`, transform: `scale(${1 + 0.1 * Math.sin(ts * 4)})`}} />
          <Img src={staticFile('img/taktikiz-logo-seffaf.png')} style={{width: 760, position: 'relative', transform: `scale(${0.6 + 0.4 * pop(ts, tTakip - 0.3, tTakip + 0.6)}) rotate(${(1 - pop(ts, tTakip - 0.3, tTakip + 0.6)) * -8}deg)`}} />
        </div>
        <div style={{display: 'inline-block', marginTop: 36, padding: '16px 70px', background: C.yesil, borderRadius: 60, fontSize: 60, fontWeight: 900, color: C.bg, transform: `scale(${(0.5 + 0.5 * pop(ts, tTakip + 0.2, tTakip + 0.8)) * (1 + 0.05 * Math.sin(ts * 7))})`}}>TAKİP ET</div>
        <div style={{fontSize: 34, fontWeight: 900, color: C.ikinci, marginTop: 18}}>Maç analizleri kanalda</div>
      </div>
    </>
  );
};
