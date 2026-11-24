import React from 'react';
import takim from '../takim.json';
import {Baslik, C, Cubuklar, DilimGrafik, FONT, FormSerit, Isi, Logo, Oyuncu, Panel, Rozet, Saha, Sayi, Satir, TS, ALA, lin, pop, px, py, seg, virgul} from './Ogeler';

export type P = {ts: number; T: (needle: string, nth?: number, def?: number) => number};
const tk: any = takim;

const Kutu: React.FC<{p: number; renk?: string; w?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({p, renk = C.yesil, w, children, style}) => (
  <Panel renk={renk} p={p} style={{width: w, ...style}}>{children}</Panel>
);
const Y = (s: string, b = 28, r: string = C.metin): React.ReactNode => <div style={{fontSize: b, fontWeight: 900, color: r, lineHeight: 1.2}}>{s}</div>;
const satir = (ad: string, deger: number, max: number, renk: string, at: number, fmt?: (v: number) => string): Satir => ({ad, deger, max, renk, at, fmt});
const f2 = (v: number) => virgul(v, 2);
const f1 = (v: number) => virgul(v, 1);
const f0 = (v: number) => String(Math.round(v));
const pct = (v: number) => '%' + Math.round(v);

// ---- 1 Hook ----
export const S1: React.FC<P> = ({ts, T}) => {
  const a = pop(ts, T('altı', 0, 1.2) - 0.1, T('altı', 0, 1.2) + 0.5);
  const d = pop(ts, T('dakikalarda', 0, 6) - 0.2, T('dakikalarda', 0, 6) + 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: 60, right: 60, top: 150, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        <div style={{textAlign: 'center', opacity: Math.min(1, a * 2), transform: `scale(${0.5 + 0.5 * a})`}}>
          <div style={{fontSize: 340, fontWeight: 900, color: C.kirmizi, lineHeight: 1, textShadow: '0 0 50px rgba(255,77,61,0.5)'}}>6</div>
          <div style={{fontSize: 60, fontWeight: 900, color: C.metin}}>OYUNCU EKSİK</div>
          <div style={{fontSize: 30, fontWeight: 900, color: C.ikinci}}>TRABZONSPOR</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 34, fontWeight: 900, color: C.ikinci, marginBottom: 14, opacity: seg(ts, 0.3, 0.8)}}>SON 5 MAÇ</div>
          <FormSerit sonuc="GGGGG" ts={ts} basla={T('beş', 0, 1) } boyut={110} />
          <div style={{marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: seg(ts, 1.5, 2.2)}}>
            <Rozet t={ALA} ad="ALA" b={120} /><div style={{fontSize: 44, fontWeight: 900, color: C.metin}}>–</div><Rozet t={TS} ad="TS" b={120} />
          </div>
          <div style={{fontSize: 28, fontWeight: 900, color: C.ikinci, marginTop: 10, opacity: seg(ts, 1.5, 2.2)}}>8 KASIM · 18:30</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: Math.min(1, d * 2), transform: `scale(${0.7 + 0.3 * d})`, fontSize: 70, fontWeight: 900, color: C.sari, textShadow: '0 0 24px rgba(255,214,10,0.5)'}}>CEVAP DAKİKALARDA SAKLI</div>
    </>
  );
};

// ---- 2 Vaat ----
export const S2: React.FC<P> = ({ts, T}) => {
  const it = [['1', 'GOL DAKİKALARI', 'dakikalarına', C.yesil], ['2', 'KORNER SİLAHI', 'korner', C.sari], ['3', 'KALEDEKİ ADAM', 'kalesindeki', C.ts]] as const;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 230, display: 'flex', gap: 40, justifyContent: 'space-between'}}>
      {it.map(([n, ad, nd, r], i) => {
        const p = pop(ts, T(nd, 0, 1 + i * 2) - 0.2, T(nd, 0, 1 + i * 2) + 0.5);
        return (
          <div key={n} style={{flex: 1, background: C.panel, borderTop: `8px solid ${r}`, padding: '50px 30px', textAlign: 'center', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 80}px) scale(${0.85 + 0.15 * p})`}}>
            <div style={{fontSize: 170, fontWeight: 900, color: r, lineHeight: 1}}>{n}</div>
            <div style={{fontSize: 46, fontWeight: 900, color: C.metin, marginTop: 18}}>{ad}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---- 3 Bağlam ----
export const S3: React.FC<P> = ({ts, T}) => {
  const t1 = T('üçüncü', 0, 2), t2 = T('sırada', 0, 8), t3 = T('karnesi', 0, 16), t4 = T('Form', 0, 28), t5 = T('piyasası', 0, 40), t6 = T('Teknik', 0, 48);
  return (
    <>
      <Baslik yazi="MAÇ BAĞLAMI · PUAN DURUMU, EV–DEPLASMAN, FORM" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 190, width: 560}}>
        {Y('PUAN DURUMU (10 MAÇ)', 26, C.yesil)}
        <div style={{height: 14}} />
        <Cubuklar w={560} satirlar={[
          {ad: '3. TRABZONSPOR', deger: 22, max: 25, renk: C.ts, at: t1, fmt: (v) => Math.round(v) + ' PUAN', rozet: {t: TS, ad: 'TS'}},
          {ad: '12. ALANYASPOR', deger: 12, max: 25, renk: C.ala, at: t2, fmt: (v) => Math.round(v) + ' PUAN', rozet: {t: ALA, ad: 'ALA'}},
        ]} ts={ts} yazi={26} />
        <div style={{opacity: seg(ts, t1 + 0.8, t1 + 1.3)}}>{Y('GOL: TS 24 – 8 · ALA 9 – 16', 24, C.ikinci)}</div>
        <div style={{height: 24}} />
        <div style={{opacity: seg(ts, t3 - 0.3, t3 + 0.3)}}>{Y('EV – DEPLASMAN PUANI', 26, C.yesil)}</div>
        <div style={{display: 'flex', gap: 16, marginTop: 10}}>
          <Sayi deger="15 · 7" ad="TS ev 5 maç · dep. 5 maç" renk={C.ts} p={pop(ts, t3, t3 + 0.6)} w={272} kucuk />
          <Sayi deger="5 · 7" ad="ALA ev 4 maç · dep. 6 maç" renk={C.ala} p={pop(ts, t3 + 0.5, t3 + 1.1)} w={272} kucuk />
        </div>
      </div>
      <div style={{position: 'absolute', left: 680, top: 190, width: 560}}>
        <div style={{opacity: seg(ts, t4 - 0.3, t4 + 0.3)}}>{Y('SON 5 MAÇ', 26, C.yesil)}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}><Rozet t={TS} ad="TS" b={64} /><FormSerit sonuc="GGGGG" ts={ts} basla={t4} boyut={80} /></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}><Rozet t={ALA} ad="ALA" b={64} /><FormSerit sonuc="GBMMM" ts={ts} basla={t4 + 1.2} boyut={80} /></div>
        <div style={{opacity: seg(ts, t4 + 2, t4 + 2.6), marginTop: 12}}>{Y('Galatasaray 4-0 · Beşiktaş 2-0 · Rizespor 4-3 (TS)  ·  Fenerbahçe 0-3 · Kocaelispor 1-2 · Gençlerbirliği 0-5 (ALA)', 20, C.ikinci)}</div>
      </div>
      <div style={{position: 'absolute', left: 1300, top: 190, width: 560}}>
        <div style={{opacity: seg(ts, t5 - 0.3, t5 + 0.3)}}>{Y('PİYASA (NESİNE, MARJ ÇIKARILMIŞ)', 26, C.yesil)}</div>
        <div style={{display: 'flex', height: 90, border: `3px solid ${C.kenar}`, overflow: 'hidden', marginTop: 14, opacity: seg(ts, t5 - 0.3, t5 + 0.3)}}>
          {[[55, C.ts, 'TS'], [25, C.ikinci, 'B'], [21, C.ala, 'ALA']].map(([d, r, n], i) => (
            <div key={i} style={{width: `${(d as number) * seg(ts, t5, t5 + 1.2)}%`, background: r as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, color: C.bg, overflow: 'hidden', whiteSpace: 'nowrap'}}>%{d}</div>
          ))}
        </div>
        <div style={{opacity: seg(ts, t5 + 0.8, t5 + 1.3), display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 22, fontWeight: 900}}><span style={{color: C.ts}}>TRABZONSPOR</span><span style={{color: C.ikinci}}>BERABERLİK</span><span style={{color: C.ala}}>ALANYASPOR</span></div>
        <div style={{height: 30}} />
        <div style={{opacity: seg(ts, t6 - 0.3, t6 + 0.3)}}>{Y('TEKNİK DİREKTÖRLER', 26, C.yesil)}</div>
        <div style={{display: 'flex', gap: 14, marginTop: 10}}>
          <Kutu p={pop(ts, t6, t6 + 0.6)} renk={C.ts} w={265}>{Y('TRABZONSPOR', 20, C.ikinci)}{Y('THOMAS REIS', 30)}</Kutu>
          <Kutu p={pop(ts, t6 + 0.5, t6 + 1.1)} renk={C.ala} w={265}>{Y('ALANYASPOR', 20, C.ikinci)}{Y('JOÃO PEREIRA', 30)}</Kutu>
        </div>
      </div>
    </>
  );
};

// ---- 4 Eksikler ve muhtemel 11'ler ----
const ALA11: [string, number, number][] = [['Paulo Victor', 5, 50], ['Nuno Lima', 18, 22], ['Bedirhan', 18, 50], ['Fidan Aliti', 18, 78], ['Hadergjonaj', 33, 8], ['Maestro', 33, 92], ['Baran Ali', 34, 30], ['Makouta', 36, 50], ['Ruan', 34, 70], ['İbrahim', 40, 38], ['Cédric', 40, 62]];
const TS11: [string, number, number][] = [['Onana', 96, 50], ['Pina', 88, 15], ['Nwaiwu', 88, 38], ['Savić', 88, 62], ['Cabral', 88, 85], ['Melih', 77, 38], ['Fabinho', 77, 62], ['Salah', 67, 20], ['Muçi', 67, 50], ['Saviolo', 67, 80], ['Onuachu', 58, 50]];
export const S4: React.FC<P> = ({ts, T}) => {
  const tm = T('Aral', 0, 1), tx = T('Muhtemel', 0, 11);
  const eks = [['Aral', 'Şimşir'], ['Okay', 'Yokuşlu'], ['Cihan', 'Çanak'], ['Batagov', ''], ['Djú', ''], ['Malinovskyi', '']];
  return (
    <>
      <Baslik yazi="EKSİKLER VE MUHTEMEL 11'LER (SOFASCORE, ONAYLI DEĞİL)" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 175}}>
        <Saha w={1000}>
          {ALA11.map(([ad, x, y], i) => <Oyuncu key={ad} x={x} y={y} t={ALA} ad={ad} op={seg(ts, tx + i * 0.12, tx + 0.5 + i * 0.12)} />)}
          {TS11.map(([ad, x, y], i) => <Oyuncu key={ad} x={x} y={y} t={TS} ad={ad} op={seg(ts, tx + 0.6 + i * 0.12, tx + 1.1 + i * 0.12)} />)}
        </Saha>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 24, fontWeight: 900}}><span style={{color: C.ala}}>ALANYASPOR 3-5-2 →</span><span style={{color: C.ts}}>← TRABZONSPOR 4-2-3-1</span></div>
      </div>
      <div style={{position: 'absolute', left: 1110, top: 175, width: 750}}>
        {Y('TRABZONSPOR EKSİKLERİ', 28, C.kirmizi)}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12}}>
          {eks.map(([a, b], i) => (
            <Kutu key={a} p={pop(ts, tm + i * 0.35, tm + 0.5 + i * 0.35)} renk={C.kirmizi}>{Y(a.toUpperCase(), 30)}{Y(b ? b : 'eksik', 20, C.ikinci)}</Kutu>
          ))}
        </div>
        <div style={{height: 18}} />
        <Kutu p={pop(ts, tm + 3.0, tm + 3.6)} renk={C.sari}>{Y('ŞÜPHELİ', 22, C.sari)}{Y('Onuralp · Tim Jabol (TS) · Paolo Fernandes (ALA)', 24)}</Kutu>
      </div>
    </>
  );
};

// ---- 5 Yerleşim ----
export const S5: React.FC<P> = ({ts, T}) => {
  const tS = T('Savić', 0, 6), tSa = T('Salah', 0, 22), tH = T('Hadergjonaj', 0, 34), tR = T('Ruan', 0, 40), tSv = T('Savunma', 0, 46);
  const pit = (k: 'TS' | 'ALA', renk: any, x: number, p: number, grid: string) => (
    <div style={{position: 'absolute', left: x, top: 170, opacity: seg(ts, 0, 0.5)}}>
      <div style={{fontSize: 26, fontWeight: 900, color: renk.halka === '#4fc3ff' ? C.ts : C.ala, marginBottom: 6}}>{tk[k].ad.toUpperCase()} · kendi dokunuşları ve ortalama yerleşim</div>
      <Saha w={830}>
        <Isi grid={grid} />
        {tk[k].oyuncular.map((o: any, i: number) => <Oyuncu key={o[0]} x={o[1]} y={o[2]} t={renk} ad={o[0]} op={seg(ts, p + i * 0.1, p + 0.4 + i * 0.1)} />)}
      </Saha>
    </div>
  );
  const chip = (txt: string, at: number, x: number, y: number, r: string) => (
    <div style={{position: 'absolute', left: x, top: y, width: 405, background: C.panel, borderLeft: `7px solid ${r}`, padding: '8px 14px', opacity: Math.min(1, pop(ts, at, at + 0.5) * 2), transform: `scale(${0.7 + 0.3 * pop(ts, at, at + 0.5)})`}}>{Y(txt, 21)}</div>
  );
  return (
    <>
      <Baslik yazi="YERLEŞİM · KİM NEREDE OYNUYOR" ts={ts} />
      {pit('TS', TS, 60, tS, tk.TS.own)}
      {pit('ALA', ALA, 1030, tS + 12, tk.ALA.own)}
      {chip('FABİNHO: orta üçte bir %61, kendi %29', tS + 3, 60, 748, C.ts)}
      {chip('SALAH: sağ şerit %70 · rakip üçte bir %47', tSa, 480, 748, C.ts)}
      {chip('HADERGJONAJ: sağ şerit %90', tH, 1030, 748, C.ala)}
      {chip('RUAN: sol şerit %88', tR, 1450, 748, C.ala)}
      <div style={{position: 'absolute', left: 60, right: 60, top: 805, opacity: seg(ts, tSv, tSv + 0.6), fontSize: 21, fontWeight: 900, color: C.ikinci}}>Rakibin dokunuşları (savunma): TS'ye karşı %25 kendi kalesine yakın · %48 orta · %27 rakip bölge &nbsp;·&nbsp; ALA'ya karşı %24 · %48 · %28</div>
    </>
  );
};

// ---- 6 Gerçekten bu kadar iyi mi ----
export const S6: React.FC<P> = ({ts, T}) => {
  const a = T('üretilen', 0, 4), b = T('Savunmada', 0, 11), c = T('tablosu', 1, 24), d = c + 4.5;
  const blok = (ad: string, g: string, gv: number, xg: string, xv: number, fark: string, at: number, r: string, x: number, y: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: 840, opacity: seg(ts, at - 0.3, at + 0.3)}}>
      {Y(ad, 28, r)}
      <div style={{height: 10}} />
      <Cubuklar w={840} bh={30} satirlar={[satir(g, gv, 26, r, at, f0), satir(xg, xv, 26, C.ikinci, at + 0.4, f1)]} ts={ts} />
      <div style={{fontSize: 38, fontWeight: 900, color: C.sari, opacity: seg(ts, at + 1.4, at + 2.0)}}>{fark}</div>
    </div>
  );
  return (
    <>
      <Baslik yazi="TABLO ÇOK PARLAK AMA... GOL – xG FARKI" ts={ts} />
      {blok('TRABZONSPOR · ATTIĞI', 'GOL', 24, 'xG', 19.1, '≈ +5 gol beklentinin üstünde', a, C.ts, 60, 180)}
      {blok('TRABZONSPOR · YEDİĞİ', 'GOL', 8, 'xGA', 14.6, '−6,6 gol beklentinin altında', b, C.ts, 1000, 180)}
      {blok('ALANYASPOR · ATTIĞI', 'GOL', 9, 'xG', 10.7, '−1,7 gol', c, C.ala, 60, 470)}
      {blok('ALANYASPOR · YEDİĞİ', 'GOL', 16, 'xGA', 16.9, '−0,9 gol: oyunun karşılığı', d, C.ala, 1000, 470)}
    </>
  );
};

// ---- 7 Trabzonspor hücumu ----
export const S7: React.FC<P> = ({ts, T}) => {
  const t0 = T('üretiyor', 0, 1), tSa = T('Hücumun', 0, 14), tM = T('Muçi', 0, 28), tD = T('Sorun', 0, 36), tDp = T('deplasman', 0, 44);
  return (
    <>
      <Baslik yazi="TRABZONSPOR · HÜCUM (MAÇ BAŞI, SON 10 MAÇ)" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 180}}>
        <Cubuklar w={780} satirlar={[
          satir('xG · TRABZONSPOR', 1.91, 2.2, C.ts, t0, f2), satir('xG · ALANYASPOR', 1.07, 2.2, C.ala, t0 + 0.5, f2),
          satir('ŞUT · TRABZONSPOR', 14.3, 16, C.ts, t0 + 1.2, f1), satir('ŞUT · ALANYASPOR', 11.3, 16, C.ala, t0 + 1.7, f1),
          satir('BÜYÜK FIRSAT · TS', 4.5, 5, C.ts, t0 + 2.4, f1), satir('BÜYÜK FIRSAT · ALA', 1.4, 5, C.ala, t0 + 2.9, f1),
        ]} ts={ts} yazi={26} bh={22} />
        <div style={{opacity: seg(ts, tDp - 0.3, tDp + 0.3)}}>{Y('EV – DEPLASMAN xG (TS)', 24, C.yesil)}</div>
        <div style={{display: 'flex', gap: 16, marginTop: 8}}>
          <Sayi deger={virgul(2.34 * seg(ts, tDp, tDp + 1))} ad="EVİNDE" renk={C.yesil} p={pop(ts, tDp, tDp + 0.5)} w={230} kucuk />
          <Sayi deger={virgul(1.48 * seg(ts, tDp + 0.4, tDp + 1.4))} ad="DEPLASMANDA" renk={C.kirmizi} p={pop(ts, tDp + 0.4, tDp + 0.9)} w={230} kucuk />
        </div>
      </div>
      <div style={{position: 'absolute', left: 900, top: 180, width: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        <Kutu p={pop(ts, tSa, tSa + 0.6)} renk={C.ts}>{Y('SALAH', 40)}{Y('8 gol · 4,9 xG', 28, C.ts)}{Y('27 şut, 15 isabetli · 36 kilit pas', 24, C.ikinci)}</Kutu>
        <Kutu p={pop(ts, tM, tM + 0.6)} renk={C.ts}>{Y('MUÇİ', 40)}{Y('3 gol · 6 asist', 28, C.ts)}{Y('27 şut · 9 büyük fırsat yarattı', 24, C.ikinci)}</Kutu>
        <Kutu p={pop(ts, tD, tD + 0.6)} renk={C.kirmizi}>{Y('DJÚ · EKSİK', 36, C.kirmizi)}{Y('4 gol · 2,9 xG (6 maç)', 28)}{Y('takımın 2. silahı', 24, C.ikinci)}</Kutu>
        <Kutu p={pop(ts, tD + 1.5, tD + 2.1)} renk={C.kirmizi}>{Y('ARAL · EKSİK', 36, C.kirmizi)}{Y('7 büyük fırsat yarattı', 28)}{Y('15 kilit pas', 24, C.ikinci)}</Kutu>
      </div>
    </>
  );
};

// ---- 8 Trabzonspor savunması ----
export const S8: React.FC<P> = ({ts, T}) => {
  const t0 = T('savunması', 0, 1), tO = T('Onana', 0, 6), tSt = T('Stoperler', 0, 16), tD = T('deplasman', 1, 26), tP = T('Paulo', 0, 40);
  return (
    <>
      <Baslik yazi="TRABZONSPOR · SAVUNMA VE ONANA" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 180}}>
        <Cubuklar w={800} satirlar={[
          satir('xGA (YENEN xG)', 1.46, 1.8, C.kirmizi, t0, f2), satir('YENEN GOL', 0.8, 1.8, C.ts, t0 + 0.6, f2),
          satir('BÜYÜK FIRSAT YENEN · EVDE', 1.0, 3, C.yesil, tD, f1), satir('BÜYÜK FIRSAT YENEN · DEPL.', 2.6, 3, C.kirmizi, tD + 0.5, f1),
          satir('xGA · EVDE', 1.09, 2, C.yesil, tD + 1.2, f2), satir('xGA · DEPLASMANDA', 1.83, 2, C.kirmizi, tD + 1.7, f2),
        ]} ts={ts} yazi={25} bh={22} />
      </div>
      <div style={{position: 'absolute', left: 920, top: 180, width: 940, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        <Kutu p={pop(ts, tO, tO + 0.6)} renk={C.ts}>{Y('ONANA', 40)}{Y('puan 7,87 (Salah 7,90)', 24, C.ikinci)}{Y('maç başı 0,61 gol kurtarıyor', 28, C.yesil)}</Kutu>
        <Kutu p={pop(ts, tSt, tSt + 0.6)} renk={C.ts}>{Y('NWAİWU · SAVİÇ', 34)}{Y('51 · 43 uzaklaştırma', 28, C.ts)}{Y('555 · 617 isabetli pas', 24, C.ikinci)}</Kutu>
        <Kutu p={pop(ts, tSt + 2.5, tSt + 3.1)} renk={C.ts}>{Y('MUSTAFA', 40)}{Y('15 araya girme', 28, C.ts)}</Kutu>
        <Kutu p={pop(ts, tP, tP + 0.6)} renk={C.ala}>{Y('PAULO VICTOR', 34)}{Y('puan 7,39 (ALA en yüksek)', 24, C.ikinci)}{Y('3,8 kurtarış · 0,2 önlenen gol', 26, C.ala)}</Kutu>
      </div>
    </>
  );
};

// ---- 9 Alanyaspor hücumu ve korner ----
export const S9: React.FC<P> = ({ts, T}) => {
  const t0 = T('kornerden', 0, 5), tH = T('Hava', 0, 14), tHa = T('Hadergjonaj', 0, 20), tR = T('Ruan', 0, 28), tD = T('duran', 0, 34);
  return (
    <>
      <Baslik yazi="ALANYASPOR · GOL KAYNAKLARI VE KORNER SİLAHI" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 180}}>
        {Y('9 GOLÜN KAYNAĞI', 26, C.yesil)}
        <div style={{height: 8}} />
        <Cubuklar w={780} satirlar={[satir('KORNER (19 ŞUT)', 3, 4, C.sari, t0, f0), satir('ASİSTLİ AKIŞ', 3, 4, C.ala, t0 + 0.5, f0), satir('NORMAL', 2, 4, C.ala, t0 + 0.9, f0), satir('HIZLI HÜCUM (11 ŞUT)', 1, 4, C.ala, t0 + 1.3, f0)]} ts={ts} yazi={25} bh={22} />
        <div style={{opacity: seg(ts, tH - 0.3, tH + 0.3)}}>{Y('HAVA TOPU KAZANILAN (MAÇ BAŞI)', 26, C.yesil)}</div>
        <div style={{height: 8}} />
        <Cubuklar w={780} satirlar={[satir('ALANYASPOR', 12.3, 14, C.ala, tH, f1), satir('TRABZONSPOR', 8.7, 14, C.ts, tH + 0.5, f1)]} ts={ts} yazi={25} bh={22} />
      </div>
      <div style={{position: 'absolute', left: 900, top: 180, width: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        <Kutu p={pop(ts, tHa, tHa + 0.6)} renk={C.ala}>{Y('HADERGJONAJ', 34)}{Y('29 kilit pas · 2 asist', 26, C.ala)}{Y('178 top kaybı (takımda en çok)', 22, C.ikinci)}</Kutu>
        <Kutu p={pop(ts, tR, tR + 0.6)} renk={C.ala}>{Y('RUAN', 40)}{Y('19 şut, 6 isabetli', 26, C.ala)}{Y('3 gol+asist · Makouta, Arda 2\'şer gol', 22, C.ikinci)}</Kutu>
        <Kutu p={pop(ts, tD, tD + 0.6)} renk={C.sari} style={{gridColumn: '1 / 3'}}>{Y('TRABZONSPOR\'UN DURAN TOP KARNESİ (YEDİĞİ)', 26, C.sari)}{Y('Korner: 17 şut, 0 gol · Diğer duran top: 7 şut, 2 gol · Penaltı: 3 (2 gol)', 26)}</Kutu>
        <Kutu p={pop(ts, T('Evinde', 0, 8), T('Evinde', 0, 8) + 0.6)} renk={C.ala} style={{gridColumn: '1 / 3'}}>{Y('EVİNDE MAÇ BAŞI 7 KORNER', 34, C.ala)}</Kutu>
      </div>
    </>
  );
};

// ---- 10 Alanyaspor savunması ----
export const S10: React.FC<P> = ({ts, T}) => {
  const t0 = T('dakikası', 0, 8), tD = T('dokuzu', 0, 11), tE = T('ev', 0, 28), tS = T('Son', 0, 33);
  return (
    <>
      <Baslik yazi="ALANYASPOR · YEDİĞİ GOLLERİN DAKİKASI (10 MAÇ, 16 GOL)" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 175}}>
        <DilimGrafik seriler={[{ad: 'ALANYASPOR\'UN YEDİĞİ GOL', renk: C.kirmizi, vals: [1, 2, 3, 1, 5, 4]}]} ts={ts} at={t0} vurgu={[4, 5]} w={1000} h={400} ondalik={0} />
      </div>
      <div style={{position: 'absolute', left: 1120, top: 180, width: 740}}>
        <Sayi deger="9 / 16" ad="GOL 60. DAKİKADAN SONRA" renk={C.kirmizi} p={pop(ts, tD, tD + 0.6)} w={740} />
        <div style={{height: 18}} />
        <div style={{display: 'flex', gap: 16}}>
          <Sayi deger={virgul(1 * seg(ts, tE, tE + 1), 1)} ad="EVDE YENEN GOL" renk={C.yesil} p={pop(ts, tE, tE + 0.5)} w={362} kucuk />
          <Sayi deger={virgul(2 * seg(ts, tE + 0.4, tE + 1.4), 1)} ad="DEPLASMANDA" renk={C.kirmizi} p={pop(ts, tE + 0.4, tE + 0.9)} w={362} kucuk />
        </div>
        <div style={{height: 18}} />
        <Kutu p={pop(ts, tS, tS + 0.6)} renk={C.kirmizi}>{Y('SON 3 MAÇ', 22, C.ikinci)}{Y('üretilen xG 2,26', 32, C.ala)}{Y('yenen xG 7,49', 32, C.kirmizi)}</Kutu>
        <div style={{height: 14}} />
        <Kutu p={pop(ts, T('Stoper', 0, 22), T('Stoper', 0, 22) + 0.6)} renk={C.ala}>{Y('NUNO LIMA · FIDAN ALITI', 24, C.ikinci)}{Y('42 uzaklaştırma · 15 araya girme', 26)}</Kutu>
      </div>
    </>
  );
};

// ---- 11 Sezonun belirleyici maçları ----
export const S11: React.FC<P> = ({ts, T}) => {
  const m = [
    ['TRABZONSPOR 4-0 GALATASARAY', 'Galatasaray', 2.2, 0.96, C.ts, 'TS', 'GS'],
    ['AMEDSPOR 2-1 TRABZONSPOR', 'Amedspor', 2.69, 0.93, C.ts, 'AMED', 'TS'],
    ['ALANYASPOR 1-0 BEŞİKTAŞ', 'Beşiktaş', 0.54, 0.74, C.ala, 'ALA', 'BJK'],
    ['FENERBAHÇE 3-0 ALANYASPOR', 'Fenerbahçe', 3.84, 0.96, C.ala, 'FB', 'ALA'],
  ] as const;
  return (
    <>
      <Baslik yazi="İKİ TAKIMIN SEZONUNU ANLATAN MAÇLAR (xG)" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 180, width: 1800, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>
        {m.map((x, i) => {
          const at = T(i === 1 ? 'Amedspor\'a' : x[1] as string, 0, 3 + i * 7);
          const p = pop(ts, at - 0.2, at + 0.5);
          return (
            <div key={i} style={{opacity: Math.min(1, p * 2), transform: `scale(${0.9 + 0.1 * p})`}}>
              <Panel renk={x[4] as string} p={1}>
                {Y(x[0] as string, 28)}
                <div style={{height: 10}} />
                <Cubuklar w={820} bh={26} yazi={24} satirlar={[satir(x[5] as string + ' xG', x[2] as number, 4, x[4] as string, at, f2), satir(x[6] as string + ' xG', x[3] as number, 4, C.ikinci, at + 0.4, f2)]} ts={ts} />
              </Panel>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---- 12 Oyun kurulumu ----
export const S12: React.FC<P> = ({ts, T}) => {
  const t0 = T('geriden', 0, 1), tA = T('direkt', 0, 22), tG = T('Geçişte', 0, 38), tF = T('Faulde', 0, 50);
  const yol: [number, number][] = [[13.6, 48.6], [34.5, 66.7], [35.7, 31.1], [44.7, 49.2], [62.3, 48.2], [63.4, 30.4], [80, 35]];
  const tl = Math.max(0, ts) % 9;
  const seg1 = Math.min(yol.length - 1, tl / 1.2);
  const i0 = Math.floor(seg1), fr = seg1 - i0;
  const a = yol[Math.min(i0, yol.length - 1)], b = yol[Math.min(i0 + 1, yol.length - 1)];
  const bx = a[0] + (b[0] - a[0]) * Math.min(1, fr * 1.2), by = a[1] + (b[1] - a[1]) * Math.min(1, fr * 1.2);
  return (
    <>
      <Baslik yazi="OYUN KURULUMU · GERİDEN Mİ, UZUN TOP MU, GEÇİŞ Mİ" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 180}}>
        <div style={{fontSize: 24, fontWeight: 900, color: C.ts, marginBottom: 6}}>TRABZONSPOR: kaleciden stoperlere, pivota, öne (ortalama yerleşim) →</div>
        <Saha w={900}>
          {tk.TS.oyuncular.map((o: any) => <Oyuncu key={o[0]} x={o[1]} y={o[2]} t={TS} ad={o[0]} op={0.9} />)}
          {yol.slice(0, -1).map((p, i) => i < seg1 ? <line key={i} x1={px(p[0])} y1={py(p[1])} x2={px(i + 1 < seg1 ? yol[i + 1][0] : bx)} y2={py(i + 1 < seg1 ? yol[i + 1][1] : by)} stroke="#fff" strokeWidth={2.4} opacity={0.9} /> : null)}
          <circle cx={px(bx)} cy={py(by)} r={6.5} fill="#fff" stroke="#000" strokeWidth={1.2} />
        </Saha>
        <div style={{opacity: seg(ts, tG, tG + 0.6), marginTop: 10}}>{Y('Hızlı hücum: TS 13 şut → 4 gol · ALA\'ya karşı 17 şut → 2 gol · ALA kendi 11 şut → 1 gol', 23, C.sari)}</div>
      </div>
      <div style={{position: 'absolute', left: 1010, top: 180, width: 850}}>
        <Cubuklar w={850} satirlar={[
          satir('UZUN TOP ORANI · TS (isabet %51)', 12, 20, C.ts, t0 + 2, pct), satir('UZUN TOP ORANI · ALA (isabet %46)', 15, 20, C.ala, t0 + 2.5, pct),
          satir('TOPLA OYNAMA · TS DEPLASMANDA', 57.6, 70, C.ts, T('Evinde', 0, 16), (v) => '%' + virgul(v, 1)), satir('TOPLA OYNAMA · TS EVİNDE', 48.6, 70, C.ts, T('Evinde', 0, 16) + 0.6, (v) => '%' + virgul(v, 1)),
          satir('TOPLA OYNAMA · ALA EVİNDE', 51.8, 70, C.ala, tA, (v) => '%' + virgul(v, 1)), satir('TOPLA OYNAMA · ALA DEPL.', 40.8, 70, C.ala, tA + 0.6, (v) => '%' + virgul(v, 1)),
          satir('KENDİ ÜÇTE BİRİNDE DOKUNUŞ · ALA', 33, 40, C.ala, tA + 8, pct), satir('KENDİ ÜÇTE BİRİNDE DOKUNUŞ · TS', 29, 40, C.ts, tA + 8.6, pct),
          satir('FAUL · ALANYASPOR', 12.9, 15, C.ala, tF, f1), satir('FAUL · TRABZONSPOR', 10.6, 15, C.ts, tF + 0.5, f1),
        ]} ts={ts} yazi={21} bh={16} />
      </div>
    </>
  );
};

// ---- 13 Ev–deplasman verisi ----
export const S13: React.FC<P> = ({ts, T}) => {
  const tA = T('deplasman', 0, 3), tB = T('Alanyaspor', 1, 14), tK = T('Konyaspor', 0, 30), tAm = T('Amedspor\'da', 0, 38);
  const blok = (bas: string, s1: string, v1: number, s2: string, v2: number, sonuc: number, at: number, r: string, x: number) => (
    <div style={{position: 'absolute', left: x, top: 190, width: 860, opacity: seg(ts, at - 0.3, at + 0.3)}}>
      {Y(bas, 28, r)}
      <div style={{height: 10}} />
      <Cubuklar w={860} satirlar={[satir(s1, v1, 2, r, at, f2), satir(s2, v2, 2, C.ikinci, at + 0.5, f2)]} ts={ts} yazi={26} />
      <Sayi deger={virgul(sonuc * seg(ts, at + 1.2, at + 2.2))} ad="ORTALAMA (BEKLENEN GOL)" renk={C.sari} p={pop(ts, at + 1.2, at + 1.8)} w={860} />
    </div>
  );
  return (
    <>
      <Baslik yazi="EV – DEPLASMAN VERİSİ NE DİYOR" ts={ts} />
      {blok('TRABZONSPOR (DEPLASMAN)', 'TS DEPLASMAN xG', 1.48, 'ALA EVDE YEDİĞİ xG', 1.48, 1.48, tA, C.ts, 60)}
      {blok('ALANYASPOR (EV)', 'ALA EVDE xG', 1.01, 'TS DEPLASMANDA YEDİĞİ xG', 1.83, 1.42, tB, C.ala, 1000)}
      <div style={{position: 'absolute', left: 60, top: 640, width: 1800, display: 'flex', gap: 24}}>
        <Kutu p={pop(ts, tK, tK + 0.6)} renk={C.ts} w={870}>{Y('KONYASPOR 1-0 TRABZONSPOR', 26)}{Y('xG: Konyaspor 1,04 · Trabzonspor 0,92', 28, C.ts)}</Kutu>
        <Kutu p={pop(ts, tAm, tAm + 0.6)} renk={C.ts} w={870}>{Y('AMEDSPOR 2-1 TRABZONSPOR', 26)}{Y('xG: Amedspor 2,69 · Trabzonspor 0,93', 28, C.ts)}</Kutu>
      </div>
    </>
  );
};

// ---- 14 Bütün maçı xG ile okumak ----
export const S14: React.FC<P> = ({ts, T}) => {
  const t0 = T('ilk', 0, 3), tB = T('beklenen', 0, 46);
  return (
    <>
      <Baslik yazi="BÜTÜN MAÇI xG İLE OKUMAK · 15'ER DAKİKA (MAÇ BAŞI)" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 170}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.yesil, marginBottom: 6}}>ÜRETİLEN xG</div>
        <DilimGrafik seriler={[{ad: 'TRABZONSPOR', renk: C.ts, vals: [0.38, 0.20, 0.36, 0.41, 0.24, 0.36]}, {ad: 'ALANYASPOR', renk: C.ala, vals: [0.18, 0.16, 0.08, 0.25, 0.16, 0.24]}]} ts={ts} at={t0} vurgu={[2]} w={860} h={290} />
      </div>
      <div style={{position: 'absolute', left: 1000, top: 170}}>
        <div style={{fontSize: 26, fontWeight: 900, color: C.kirmizi, marginBottom: 6}}>YENEN xG</div>
        <DilimGrafik seriler={[{ad: 'TRABZONSPOR', renk: C.ts, vals: [0.22, 0.24, 0.41, 0.23, 0.13, 0.29]}, {ad: 'ALANYASPOR', renk: C.ala, vals: [0.24, 0.26, 0.37, 0.15, 0.41, 0.27]}]} ts={ts} at={T('Ama', 0, 14)} vurgu={[2, 4]} w={860} h={290} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 720, width: 1800, display: 'flex', gap: 24}}>
        <Kutu p={pop(ts, tB, tB + 0.6)} renk={C.sari} w={880}>{Y('BEKLENEN AKIŞ (dilimleri karşılıklı ortala)', 22, C.ikinci)}{Y('Trabzonspor 1,82 – Alanyaspor 1,30', 36, C.sari)}</Kutu>
        <Kutu p={pop(ts, tB + 1.5, tB + 2.1)} renk={C.sari} w={880}>{Y('EV – DEPLASMAN ORTALAMASI', 22, C.ikinci)}{Y('Trabzonspor 1,48 – Alanyaspor 1,42', 36, C.sari)}</Kutu>
      </div>
    </>
  );
};

// ---- 15 Kilit eşleşmeler ----
export const S15: React.FC<P> = ({ts, T}) => {
  const k = [
    ['1', 'SALAH', 'ALANYASPOR\'UN ÜÇLÜ STOPERİ', 'Nuno Lima · Bedirhan · Fidan Aliti', '8 gol · 27 şut · 36 kilit pas', 'Birincisi', C.ts],
    ['2', 'HADERGJONAJ\'IN ORTALARI', 'SAVİÇ VE NWAİWU', 'hava topu: ALA 12,3 – TS 8,7', '29 kilit pas · 51 + 43 uzaklaştırma', 'İkincisi', C.ala],
    ['3', 'MELİH · FABİNHO', 'RUAN · MAKOUTA · BARAN ALİ', 'orta sahada tempo savaşı', 'Fabinho orta üçte bir %61', 'Üçüncüsü', C.sari],
  ] as const;
  return (
    <>
      <Baslik yazi="KİLİT EŞLEŞMELER" ts={ts} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 190, display: 'flex', gap: 28}}>
        {k.map((x, i) => {
          const at = T(x[5] as string, 0, 1 + i * 8);
          const p = pop(ts, at, at + 0.6);
          return (
            <div key={i} style={{flex: 1, background: C.panel, borderTop: `8px solid ${x[6]}`, padding: '28px 24px', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 60}px)`}}>
              <div style={{fontSize: 120, fontWeight: 900, color: x[6] as string, lineHeight: 1}}>{x[0]}</div>
              {Y(x[1] as string, 36)}
              <div style={{fontSize: 24, fontWeight: 900, color: C.ikinci, margin: '8px 0'}}>KARŞI</div>
              {Y(x[2] as string, 32)}
              <div style={{height: 16}} />
              {Y(x[3] as string, 22, C.ikinci)}
              {Y(x[4] as string, 22, x[6] as string)}
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---- 16 Dönüm noktası ----
export const S16: React.FC<P> = ({ts, T}) => {
  const t0 = T('golleri', 0, 3), tA = T('Alanyaspor\'un', 0, 14), tAr = T('aralıkta', 0, 22);
  return (
    <>
      <Baslik yazi="DÖNÜM NOKTASI · GOLLERİN DAKİKASI (10 MAÇ)" ts={ts} />
      <div style={{position: 'absolute', left: 60, top: 175}}>
        <DilimGrafik seriler={[{ad: 'TRABZONSPOR ATTIĞI', renk: C.ts, vals: [5, 3, 6, 5, 2, 3]}, {ad: 'ALANYASPOR ATTIĞI', renk: C.ala, vals: [1, 1, 0, 1, 5, 1]}, {ad: 'ALANYASPOR YEDİĞİ', renk: C.kirmizi, vals: [1, 2, 3, 1, 5, 4]}]} ts={ts} at={t0} vurgu={[0, 4]} w={1180} h={400} ondalik={0} />
      </div>
      <div style={{position: 'absolute', left: 1320, top: 190, width: 540}}>
        <Sayi deger="14 / 24" ad="TS GOLÜ İLK YARIDA" renk={C.ts} p={pop(ts, t0 + 3, t0 + 3.6)} w={540} kucuk />
        <div style={{height: 16}} />
        <Sayi deger="7 / 9" ad="ALA GOLÜ İKİNCİ YARIDA" renk={C.ala} p={pop(ts, tA, tA + 0.6)} w={540} kucuk />
        <div style={{height: 16}} />
        <Kutu p={pop(ts, tAr, tAr + 0.6)} renk={C.sari}>{Y('61–75 DAKİKA', 24, C.sari)}{Y('ALA 5 gol attı · 5 gol yedi', 28)}{Y('maçın en riskli bölümü', 22, C.ikinci)}</Kutu>
      </div>
    </>
  );
};

// ---- 17 Senaryolar ----
export const S17: React.FC<P> = ({ts, T}) => {
  const k = [
    ['1', 'İLK 30 DAKİKADA GOL', 'TS 24 golün 8\'ini bu aralıkta attı', 'Birincisi', C.ts],
    ['2', '60. DAKİKAYA KADAR GOLSÜZ', 'Alanyaspor\'un en iyi bölümü başlar', 'İkincisi', C.sari],
    ['3', 'ALANYASPOR KORNERDEN ÖNE GEÇER', 'dönüş Salah\'ın kalitesine kalır', 'Üçüncüsü', C.ala],
  ] as const;
  const tp = T('Piyasa', 0, 26), tS = T('Sence', 0, 33);
  const sp = pop(ts, tS - 0.2, tS + 0.5);
  return (
    <>
      <Baslik yazi="ÜÇ SENARYO VE SONUÇ" ts={ts} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 190, display: 'flex', gap: 24}}>
        {k.map((x, i) => {
          const at = T(x[3] as string, 0, 1 + i * 5);
          const p = pop(ts, at, at + 0.6);
          return (
            <div key={i} style={{flex: 1, background: C.panel, borderTop: `8px solid ${x[4]}`, padding: '24px 22px', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 50}px)`}}>
              <div style={{fontSize: 90, fontWeight: 900, color: x[4] as string, lineHeight: 1}}>{x[0]}</div>
              {Y(x[1] as string, 32)}
              <div style={{height: 10}} />
              {Y(x[2] as string, 22, C.ikinci)}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 520, opacity: seg(ts, tp - 0.3, tp + 0.3)}}>
        {Y('PİYASA (NESİNE)', 24, C.yesil)}
        <div style={{display: 'flex', height: 80, border: `3px solid ${C.kenar}`, overflow: 'hidden', marginTop: 8}}>
          {[[55, C.ts, 'TRABZONSPOR'], [25, C.ikinci, 'BERABERLİK'], [21, C.ala, 'ALANYASPOR']].map(([d, r, n], i) => (
            <div key={i} style={{width: `${(d as number) * seg(ts, tp, tp + 1.2)}%`, background: r as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: C.bg, overflow: 'hidden', whiteSpace: 'nowrap'}}>{n} %{d}</div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', opacity: Math.min(1, sp * 2), transform: `scale(${(0.6 + 0.4 * sp) * (1 + 0.02 * Math.sin(ts * 5))})`, fontSize: 80, fontWeight: 900, color: C.yesil, textShadow: '0 0 30px rgba(57,240,138,0.5)'}}>SENCE SKOR NE OLUR? · YORUMA YAZ</div>
    </>
  );
};

// ---- 18 Kapanış ----
export const S18: React.FC<P> = ({ts}) => {
  const p = pop(ts, 0, 0.8);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <div style={{position: 'absolute', left: '50%', top: '40%', width: 700, height: 700, marginLeft: -350, marginTop: -350, borderRadius: '50%', background: `radial-gradient(circle, rgba(57,240,138,${0.28 + 0.1 * Math.sin(ts * 6)}), transparent 65%)`}} />
        <Logo w={620} style={{position: 'relative', transform: `scale(${0.6 + 0.4 * p})`}} />
      </div>
      <div style={{display: 'inline-block', marginTop: 20, marginLeft: 0, padding: '14px 70px', background: C.yesil, borderRadius: 60, fontSize: 56, fontWeight: 900, color: C.bg, transform: `scale(${(0.5 + 0.5 * pop(ts, 0.8, 1.4)) * (1 + 0.05 * Math.sin(ts * 7))})`}}>TAKİP ET</div>
    </div>
  );
};

export const SAHNELER: React.FC<P>[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18];
export {lin};
