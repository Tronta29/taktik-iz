import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import takim from '../veri.json';
import oyuncu from '../oyuncu.json';

const C = {bg: '#071510', panel: '#0f2a1c', kenar: '#1f5a38', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6', sari: '#ffd60a', saha: '#155f34', seritA: '#17703c', seritB: '#1c7a43'};
const GX = 12, GY = 8, W = 600, H = 390;
const stops: [number, number[]][] = [[0.18, [0, 200, 110, 0.59]], [0.45, [57, 240, 138, 0.82]], [0.7, [255, 214, 10, 0.92]], [0.88, [255, 120, 40, 0.96]], [1, [255, 60, 50, 1]]];
const renk = (v: number): string | null => {
  if (v < 0.05) return null;
  if (v <= stops[0][0]) return `rgba(0,200,110,${(stops[0][1][3] * (v / stops[0][0])).toFixed(2)})`;
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      const p = (v - t0) / (t1 - t0);
      const m = c0.map((x, k) => x + (c1[k] - x) * p);
      return `rgba(${Math.round(m[0])},${Math.round(m[1])},${Math.round(m[2])},${m[3].toFixed(2)})`;
    }
  }
  return 'rgba(255,60,50,1)';
};
const Isi: React.FC<{grid: string}> = ({grid}) => {
  const g = grid.split('').map((c) => parseInt(c, 36) / 35);
  const cx = 96, cy = 62, pw = (W - 16) / cx, ph = (H - 16) / cy;
  const at = (i: number, j: number) => g[Math.min(GY - 1, Math.max(0, j)) * GX + Math.min(GX - 1, Math.max(0, i))];
  const out: React.ReactNode[] = [];
  for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    const fi = ((i + 0.5) / cx) * GX - 0.5, fj = ((j + 0.5) / cy) * GY - 0.5;
    const i0 = Math.floor(fi), j0 = Math.floor(fj), ti = fi - i0, tj = fj - j0;
    const v = at(i0, j0) * (1 - ti) * (1 - tj) + at(i0 + 1, j0) * ti * (1 - tj) + at(i0, j0 + 1) * (1 - ti) * tj + at(i0 + 1, j0 + 1) * ti * tj;
    const c = renk(Math.pow(v, 1.15));
    if (c) out.push(<rect key={i + '-' + j} x={8 + i * pw} y={8 + j * ph} width={pw + 0.6} height={ph + 0.6} fill={c} />);
  }
  return <g>{out}</g>;
};
const Saha: React.FC<{scale: number; children?: React.ReactNode}> = ({scale, children}) => {
  const l = {fill: 'none', stroke: '#fff', strokeOpacity: 0.9, strokeWidth: 1.6};
  return (
    <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', background: C.saha, border: '3px solid #1d6b3f', borderRadius: 6}}>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={8 + i * 58.4} y={8} width={58.4} height={H - 16} fill={i % 2 ? C.seritB : C.seritA} />)}
      <rect x={8} y={8} width={W - 16} height={H - 16} {...l} />
      <line x1={300} y1={8} x2={300} y2={H - 8} {...l} />
      <circle cx={300} cy={195} r={50} {...l} />
      <rect x={8} y={84} width={100} height={222} {...l} />
      <rect x={W - 108} y={84} width={100} height={222} {...l} />
      {children}
    </svg>
  );
};

const Oyuncular: React.FC<{k: 'TS' | 'ALA' | 'BJK' | 'GBR'; rakip: string}> = ({k, rakip}) => {
  const liste = (oyuncu as any)[k] as any[];
  const t = (takim as any)[k];
  const S = 0.9;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: "'Montserrat', sans-serif"}} lang="tr">
      <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
      <Img src={staticFile('kose-logo-seffaf.png')} style={{position: 'absolute', left: 50, top: 30, width: 330}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center'}}>
        <div style={{fontSize: 24, fontWeight: 900, color: C.yesil, letterSpacing: 3}}>KİLİT OYUNCULAR · ISI HARİTASI</div>
        <div style={{fontSize: 48, fontWeight: 900, color: C.metin}}>{t.ad.toUpperCase()} <span style={{color: C.ikinci, fontSize: 28}}>(rakip: {rakip})</span></div>
      </div>
      <div style={{position: 'absolute', right: 50, top: 46, fontSize: 22, fontWeight: 900, color: C.ikinci, textAlign: 'right'}}>SON 10 LİG MAÇI<br />hücum yönü →</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 160, display: 'flex', gap: 30, justifyContent: 'space-between'}}>
        {liste.map((p) => (
          <div key={p.ad} style={{width: W * S + 6}}>
            <div style={{fontSize: 32, fontWeight: 900, color: C.metin, marginBottom: 6}}>{p.ad.toUpperCase()}</div>
            <Saha scale={S}>
              <Isi grid={p.grid} />
              <circle cx={8 + p.cx * 5.84} cy={8 + p.cy * 3.74} r={9} fill="none" stroke="#fff" strokeWidth={3} />
              <circle cx={8 + p.cx * 5.84} cy={8 + p.cy * 3.74} r={2.5} fill="#fff" />
            </Saha>
            <div style={{marginTop: 10, background: C.panel, borderTop: `4px solid ${C.sari}`, padding: '10px 14px'}}>
              <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci}}>ÜÇTE BİR: kendi %{p.third[0]} · orta %{p.third[1]} · rakip %{p.third[2]}</div>
              <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci, marginTop: 4}}>ŞERİT: sağ %{p.width[0]} · orta %{p.width[1]} · sol %{p.width[2]}</div>
              <div style={{fontSize: 18, fontWeight: 900, color: C.metin, marginTop: 4}}>ortalama konum: x {String(p.cx).replace('.', ',')} · y {String(p.cy).replace('.', ',')} ({p.m} maç)</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 790, fontSize: 22, fontWeight: 900, color: C.ikinci, lineHeight: 1.4}}>
        Beyaz halka = ortalama konum. Saha üstü = oyuncunun sağ kanadı, saha altı = sol kanadı (takımın hücum yönüne göre).
      </div>
    </AbsoluteFill>
  );
};
export default Oyuncular;
