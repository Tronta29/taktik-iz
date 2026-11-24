import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import veri from '../veri.json';
import {C, FONT, lin, pop, seg} from './Ogeler';
import {SAHNELER} from './Sahneler';

const FPS = 30;
export const TOPLAM_SN = (veri as any).toplam + 1.2;

const norm = (s: string) => s.toLocaleLowerCase('tr').replace(/[^\p{L}\p{N}]/gu, '');
const mkT = (sc: any) => (needle: string, nth = 0, def = 0) => {
  const n = norm(needle);
  let c = 0;
  for (const w of sc.kelimeler) if (norm(w.k).includes(n)) { if (c === nth) return w.bas - sc.bas; c++; }
  return def;
};

// karaoke satırları (sahne başına)
const SATIRLAR: Record<number, any[][]> = {};
for (const sc of (veri as any).sahneler) {
  const l: any[][] = [];
  let cur: any[] = [];
  for (const w of sc.kelimeler) {
    cur.push(w);
    if (cur.length >= 9 || (/[.?!]$/.test(w.k) && cur.length >= 3) || (cur.length >= 6 && /[,:;]$/.test(w.k))) { l.push(cur); cur = []; }
  }
  if (cur.length) l.push(cur);
  SATIRLAR[sc.id] = l;
}

const Arka: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${50 + 25 * Math.sin(t * 0.4)}% ${40 + 10 * Math.cos(t * 0.3)}%, rgba(57,240,138,0.14), rgba(7,21,16,0) 55%)`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: -120, bottom: 0, opacity: 0.06, backgroundImage: `linear-gradient(${C.yesil} 2px, transparent 2px), linear-gradient(90deg, ${C.yesil} 2px, transparent 2px)`, backgroundSize: '120px 120px', transform: `translateY(${(t * 20) % 120}px)`}} />
    {Array.from({length: 26}, (_, i) => {
      const y = 1080 - ((t * (30 + (i % 5) * 12) + i * 211) % 1180) + 40;
      const x = (i * 233) % 1920 + Math.sin(t * 0.7 + i) * 18;
      const s = 5 + (i % 4) * 3;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: C.yesil, opacity: 0.1 + (i % 3) * 0.06}} />;
    })}
  </AbsoluteFill>
);

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const t = frame / FPS;
  const sahneler: any[] = (veri as any).sahneler;
  const idx = (() => { let k = 0; for (let i = 0; i < sahneler.length; i++) if (t >= sahneler[i].bas - 0.2) k = i; return k; })();
  const sc = sahneler[idx];
  const S = SAHNELER[idx];
  const ts = t - sc.bas;
  const bitis = sc.bas + sc.sure;
  const gir = idx === 0 ? 1 : seg(t, sc.bas - 0.2, sc.bas + 0.3);
  const cik = idx === sahneler.length - 1 ? 0 : lin(t, bitis + 0.05, bitis + 0.4);
  const satirlar = SATIRLAR[sc.id];
  const satir = satirlar.find((l) => t < l[l.length - 1].bit + 0.2) ?? satirlar[satirlar.length - 1];
  const ilerleme = Math.min(1, t / (veri as any).toplam);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}} lang="tr">
      <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
      <Arka t={t} />
      {sahneler.map((s) => (
        <Sequence key={s.id} from={Math.round(s.bas * FPS)} durationInFrames={Math.ceil((s.sure + 0.3) * FPS)}>
          <Audio src={staticFile(`ses/s${String(s.id).padStart(2, '0')}.mp3`)} />
        </Sequence>
      ))}
      <Img src={staticFile('kose-logo-seffaf.png')} style={{position: 'absolute', left: 50, top: 22, width: 300}} />
      <div style={{position: 'absolute', right: 60, top: 34, textAlign: 'right'}}>
        <div style={{fontSize: 30, fontWeight: 900, color: C.yesil, letterSpacing: 2}}>ALANYASPOR – TRABZONSPOR · MAÇ ÖNÜ</div>
        <div style={{fontSize: 22, fontWeight: 900, color: C.ikinci}}>SÜPER LİG · 11. HAFTA · 8 KASIM</div>
      </div>
      <div style={{position: 'absolute', left: 56, right: 56, top: 108, height: 3, background: C.kenar}}>
        <div style={{height: '100%', width: 260, background: C.yesil, transform: `translateX(${((t * 380) % 2000) - 260}px)`}} />
      </div>
      <AbsoluteFill style={{opacity: Math.min(1, gir * 1.5) * (1 - cik), transform: `translateY(${(1 - gir) * 40 - cik * 30}px)`}}>
        <S ts={ts} T={mkT(sc)} />
      </AbsoluteFill>
      {t < (veri as any).toplam + 0.1 && (
        <div style={{position: 'absolute', left: 120, right: 120, top: 850, minHeight: 150, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px 16px', background: 'rgba(7,21,16,0.82)', border: `3px solid ${C.kenar}`, borderRadius: 20, padding: '14px 32px'}}>
            {satir.map((w: any, i: number) => {
              const ac = t >= w.bas;
              const sc2 = ac ? 1 + 0.18 * (1 - pop(t, w.bas, w.bas + 0.18)) : 1;
              return <span key={i} style={{display: 'inline-block', fontSize: 50, fontWeight: 900, color: ac ? C.yesil : C.metin, lineHeight: 1.2, transform: `scale(${sc2})`, textShadow: ac && t - w.bas < 0.25 ? `0 0 20px ${C.yesil}` : 'none'}}>{w.k}</span>;
            })}
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 56, right: 56, bottom: 26, height: 9, background: C.panel, borderRadius: 5, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${ilerleme * 100}%`, background: C.yesil, boxShadow: `0 0 12px ${C.yesil}`}} />
      </div>
    </AbsoluteFill>
  );
};
