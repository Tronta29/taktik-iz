import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import veri from '../veri.json';

const C = {bg: '#071510', panel: '#0f2a1c', kenar: '#1f5a38', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6', sari: '#ffd60a', kirmizi: '#ff4d3d', saha: '#155f34', seritA: '#17703c', seritB: '#1c7a43'};
const GX = 12, GY = 8;
const W = 600, H = 390;

const stops: [number, number[]][] = [[0.18, [0, 200, 110, 0.59]], [0.45, [57, 240, 138, 0.82]], [0.7, [255, 214, 10, 0.92]], [0.88, [255, 120, 40, 0.96]], [1, [255, 60, 50, 1]]];
const renk = (v: number): string | null => {
  if (v < 0.05) return null;
  if (v <= stops[0][0]) { const a = stops[0][1][3] * (v / stops[0][0]); return `rgba(0,200,110,${a.toFixed(2)})`; }
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

const parse = (s: string) => s.split('').map((c) => parseInt(c, 36) / 35);

const Isi: React.FC<{grid: string; yonSag?: boolean}> = ({grid}) => {
  const g = parse(grid);
  const cx = 96, cy = 62;
  const pw = (W - 16) / cx, ph = (H - 16) / cy;
  const at = (i: number, j: number) => g[Math.min(GY - 1, Math.max(0, j)) * GX + Math.min(GX - 1, Math.max(0, i))];
  const hucre: React.ReactNode[] = [];
  for (let j = 0; j < cy; j++) {
    for (let i = 0; i < cx; i++) {
      const fi = ((i + 0.5) / cx) * GX - 0.5, fj = ((j + 0.5) / cy) * GY - 0.5;
      const i0 = Math.floor(fi), j0 = Math.floor(fj), ti = fi - i0, tj = fj - j0;
      const v = at(i0, j0) * (1 - ti) * (1 - tj) + at(i0 + 1, j0) * ti * (1 - tj) + at(i0, j0 + 1) * (1 - ti) * tj + at(i0 + 1, j0 + 1) * ti * tj;
      const c = renk(Math.pow(v, 1.15));
      if (c) hucre.push(<rect key={i + '-' + j} x={8 + i * pw} y={8 + j * ph} width={pw + 0.6} height={ph + 0.6} fill={c} />);
    }
  }
  return <g>{hucre}</g>;
};

const Saha: React.FC<{scale: number; children?: React.ReactNode}> = ({scale, children}) => {
  const seritler = Array.from({length: 10}, (_, i) => <rect key={i} x={8 + i * 58.4} y={8} width={58.4} height={H - 16} fill={i % 2 ? C.seritB : C.seritA} />);
  const l = {fill: 'none', stroke: '#fff', strokeOpacity: 0.9, strokeWidth: 1.6};
  return (
    <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', background: C.saha, border: '3px solid #1d6b3f', borderRadius: 6}}>
      {seritler}
      <rect x={8} y={8} width={W - 16} height={H - 16} {...l} />
      <line x1={300} y1={8} x2={300} y2={H - 8} {...l} />
      <circle cx={300} cy={195} r={50} {...l} />
      <circle cx={300} cy={195} r={2.5} fill="#fff" />
      <rect x={8} y={84} width={100} height={222} {...l} />
      <rect x={8} y={144} width={32} height={102} {...l} />
      <rect x={W - 108} y={84} width={100} height={222} {...l} />
      <rect x={W - 40} y={144} width={32} height={102} {...l} />
      <rect x={1} y={171} width={7} height={48} {...l} />
      <rect x={W - 8} y={171} width={7} height={48} {...l} />
      {children}
    </svg>
  );
};

const Takim: React.FC<{k: 'TS' | 'ALA' | 'BJK' | 'GBR'}> = ({k}) => {
  const t = (veri as any)[k];
  const [ic, halka] = t.renk as [string, string];
  const px = (x: number) => 8 + x * 5.84;
  const py = (y: number) => 8 + y * 3.74;
  const S = 1.3;
  const d = t.dokunus, b = t.kurulum, s = t.sut, x = t.xgDilim;
  const bar = (a: number, b2: number, c: number, e: string[]) => (
    <div style={{display: 'flex', height: 54, border: `2px solid ${C.kenar}`, overflow: 'hidden'}}>
      {[a, b2, c].map((v, i) => <div key={i} style={{width: v + '%', background: e[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: C.bg}}>%{v}</div>)}
    </div>
  );
  const dilim = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90'];
  const mx = Math.max(...x.attigi, ...x.yedigi);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: "'Montserrat', sans-serif"}} lang="tr">
      <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
      <Img src={staticFile('kose-logo-seffaf.png')} style={{position: 'absolute', left: 50, top: 30, width: 330}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center'}}>
        <div style={{fontSize: 24, fontWeight: 900, color: C.yesil, letterSpacing: 3}}>ISI HARİTASI · YERLEŞİM · OYUN KURULUMU</div>
        <div style={{fontSize: 50, fontWeight: 900, color: C.metin}}>{t.ad.toUpperCase()}</div>
      </div>
      <div style={{position: 'absolute', right: 50, top: 46, fontSize: 22, fontWeight: 900, color: C.ikinci, textAlign: 'right'}}>8 KASIM MAÇ ÖNÜ<br />SON 10 LİG MAÇI</div>

      <div style={{position: 'absolute', left: 60, top: 150}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, marginBottom: 8}}>HÜCUM / OYUN KURULUMU <span style={{color: C.ikinci, fontSize: 20}}>· kendi dokunuşları ve ortalama yerleşim</span></div>
        <Saha scale={S}>
          <Isi grid={t.own} />
          {t.oyuncular.map((p: [string, number, number], i: number) => (
            <g key={i}>
              <circle cx={px(p[1])} cy={py(p[2])} r={11} fill={ic} stroke={halka} strokeWidth={2.4} />
              <text x={px(p[1])} y={py(p[2]) + 25} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff" stroke="#000" strokeWidth={0.4} fontFamily="Montserrat">{p[0]}</text>
            </g>
          ))}
        </Saha>
      </div>
      <div style={{position: 'absolute', left: 1020, top: 150}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.kirmizi, marginBottom: 8}}>SAVUNMA <span style={{color: C.ikinci, fontSize: 20}}>· rakibin bize karşı dokunuşları</span></div>
        <Saha scale={S}>
          <Isi grid={t.opp} />
        </Saha>
      </div>
      <div style={{position: 'absolute', left: 60, width: 780, top: 725, textAlign: 'center', fontSize: 20, fontWeight: 900, color: C.ikinci}}>hücum yönü → · saha üstü: sağ kanat, altı: sol kanat</div>
      <div style={{position: 'absolute', left: 1020, width: 780, top: 725, textAlign: 'center', fontSize: 20, fontWeight: 900, color: C.ikinci}}>rakibin dokunuşları, bizim hücum yönümüze çevrilmiş · üst: sağ kanat</div>

      <div style={{position: 'absolute', left: 60, right: 60, top: 780, display: 'flex', gap: 24}}>
        <div style={{flex: 1.15, background: C.panel, borderTop: `4px solid ${C.yesil}`, padding: '12px 18px'}}>
          <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci, marginBottom: 6}}>DOKUNUŞ DAĞILIMI (kendi / orta / rakip üçte bir)</div>
          {bar(d.kendi3, d.orta3, d.rakip3, ['#4fc3ff', C.yesil, C.sari])}
          <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci, margin: '10px 0 6px'}}>RAKİBİN BİZE KARŞI DOKUNUŞLARI</div>
          {bar(d.rakipBizeKarsi.kendi3, d.rakipBizeKarsi.orta3, d.rakipBizeKarsi.rakip3, ['#ff9a8f', '#ff6a5c', C.kirmizi])}
          <div style={{fontSize: 17, fontWeight: 900, color: C.ikinci, marginTop: 6}}>soldan sağa: bizim kaleye yakın bölge → rakip kaleye yakın bölge</div>
        </div>
        <div style={{flex: 0.9, background: C.panel, borderTop: `4px solid ${C.sari}`, padding: '12px 18px'}}>
          <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci}}>OYUN KURULUMU (maç başı)</div>
          <div style={{fontSize: 44, fontWeight: 900, color: C.sari, lineHeight: 1.1}}>%{b.uzunTopPct} <span style={{fontSize: 22, color: C.metin}}>uzun top</span></div>
          <div style={{fontSize: 20, fontWeight: 900, color: C.metin}}>{b.pas} pas · {b.uzunTopMac} uzun top (%{b.uzunTopIsabet} isabet)</div>
          <div style={{fontSize: 20, fontWeight: 900, color: C.metin}}>{b.aut} aut · {b.sonUcteGiris} son üçe giriş</div>
          <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci, marginTop: 6}}>xG/şut: {String(s.xgSut).replace('.', ',')} · ceza sahası içi şut %{s.ceza}</div>
        </div>
        <div style={{flex: 1.15, background: C.panel, borderTop: `4px solid ${C.kirmizi}`, padding: '12px 18px'}}>
          <div style={{fontSize: 20, fontWeight: 900, color: C.ikinci, marginBottom: 4}}>xG: 15'ER DAKİKA (maç başı)  <span style={{color: C.yesil}}>■ attığı</span> <span style={{color: C.kirmizi}}>■ yediği</span></div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 150}}>
            {dilim.map((n, i) => (
              <div key={n} style={{flex: 1, textAlign: 'center'}}>
                <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, height: 112}}>
                  <div style={{width: 18, height: (x.attigi[i] / mx) * 108, background: C.yesil}} />
                  <div style={{width: 18, height: (x.yedigi[i] / mx) * 108, background: C.kirmizi}} />
                </div>
                <div style={{fontSize: 16, fontWeight: 900, color: C.ikinci}}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Takim;
