import React from 'react';
import {C, TS, ALA, Kabuk, Hook, FormTile, Baglam, FormSahne, SahaSahne, Dilim, Oyuncular, Kapanis, hazirla} from './ortak';
import veri from '../veri.json';

const ctx = hazirla(veri);
const {wr} = ctx;
export const TOPLAM_SN = ctx.TOPLAM_SN;

const S1: React.FC<{ts: number}> = ({ts}) => (
  <Hook ts={ts} badge={{yazi: 'SON 5 MAÇ: 5 GALİBİYET', t: TS}} tBadge={0.15} tBuyuk={wr(0, 'altı') - 0.3} deger={6} d={0}
    etiket="EKSİK OYUNCU" alt="TRABZONSPOR · ALANYA DEPLASMANI" A={{t: TS, ad: 'TS'}} B={{t: ALA, ad: 'ALA'}}
    onSahne={<FormTile sonuc="GGGGG" ts={ts} basla={0.3} />}
    barlar={[{ad: 'SON 5 MAÇTA ATTIĞI GOL', deger: 15, max: 15, renk: C.mavi}, {ad: 'SON 5 MAÇTA YEDİĞİ GOL', deger: 3, max: 15, renk: C.turuncu}]} />
);

const S2: React.FC<{ts: number}> = ({ts}) => (
  <Baglam ts={ts} yazi="BÖLÜM 2 · MAÇ BAĞLAMI" baslik="Farklı yönlere giden iki takım" gruplar={[
    {baslik: 'PUAN DURUMU', renk: C.yesil, y: 400, t: 0, barlar: [
      {ad: '3. TRABZONSPOR', deger: 22, max: 22, renk: C.mavi, tema: TS, kisa: 'TS', t: wr(1, 'yirmi', 0), birim: 'PUAN'},
      {ad: '12. ALANYASPOR', deger: 12, max: 22, renk: C.turuncu, tema: ALA, kisa: 'ALA', t: wr(1, 'Alanyaspor'), birim: 'PUAN'}]},
    {baslik: 'ATTIĞI GOL', renk: C.yesil, y: 760, t: wr(1, 'yirmi', 1), barlar: [
      {ad: 'TRABZONSPOR', deger: 24, max: 25, renk: C.mavi, tema: TS, kisa: 'TS', t: wr(1, 'yirmi', 1), birim: 'GOL'},
      {ad: 'ALANYASPOR', deger: 9, max: 25, renk: C.turuncu, tema: ALA, kisa: 'ALA', t: wr(1, 'dokuz'), birim: 'GOL'}]},
    {baslik: 'YEDİĞİ GOL', renk: C.kirmizi, y: 1040, t: wr(1, 'sekiz'), barlar: [
      {ad: 'TRABZONSPOR', deger: 8, max: 25, renk: C.mavi, tema: TS, kisa: 'TS', t: wr(1, 'sekiz'), birim: 'GOL'},
      {ad: 'ALANYASPOR', deger: 16, max: 25, renk: C.turuncu, tema: ALA, kisa: 'ALA', t: wr(1, 'altı'), birim: 'GOL'}]},
  ]} />
);

const S3: React.FC<{ts: number}> = ({ts}) => {
  const tA = wr(2, 'Alanya');
  return (
    <FormSahne ts={ts} yazi="BÖLÜM 3 · FORM VE EKSİKLER" baslik="Trabzonspor yükselişte, ama eksik çok"
      formlar={[{ad: 'TRABZONSPOR', kisa: 'TS', tema: TS, sonuc: 'GGGGG', t: 0.2}, {ad: 'ALANYASPOR', kisa: 'ALA', tema: ALA, sonuc: 'GBMMM', t: tA - 0.3}]}
      kartlar={[
        {ust: 'TRABZONSPOR', ad: 'THOMAS REIS', alt: '5 MAÇTA 5 GALİBİYET', altRenk: C.yesil, kenar: TS.halka, t: 0.3},
        {ust: 'ALANYASPOR', ad: 'JOÃO PEREIRA', alt: 'SON 3 MAÇ: 3 YENİLGİ', altRenk: C.kirmizi, kenar: ALA.halka, t: tA + 0.3},
      ]}
      tEksik={wr(2, 'Aral')}
      eksikler={[
        {ust: 'TRABZONSPOR · 6 EKSİK', yazi: 'ARAL · OKAY · CİHAN · BATAGOV · DJÚ · MALINOVSKYI', t: wr(2, 'Aral'), fs: 25, flex: 2},
        {ust: 'ALANYASPOR', yazi: 'FERNANDES (ŞÜPHELİ)', t: wr(2, 'Fernandes'), fs: 25, flex: 1},
      ]} />
  );
};

const S4: React.FC<{ts: number}> = ({ts}) => (
  <SahaSahne ts={ts} yazi="BÖLÜM 4 · KORNER SİLAHI" baslik="Alanya'nın duran top gücü" atk={ALA} sav={TS} bolge="KORNER / ORTA BÖLGESİ"
    kutular={[
      {v: 3, d: 0, ad: 'KORNERDEN GOL', renk: C.turuncu, t: wr(3, 'üçünü')},
      {v: 19, d: 0, ad: 'KORNER ŞUTU', renk: C.turuncu, t: wr(3, 'dokuz', 1)},
      {v: 12.3, d: 1, ad: 'HAVA TOPU / MAÇ', renk: C.yesil, t: wr(3, 'iki')},
    ]} />
);

const S5: React.FC<{ts: number}> = ({ts}) => (
  <Dilim ts={ts} yazi="BÖLÜM 5 · DAKİKALAR" baslik="Maçın saati" max={6}
    A={{ad: 'TRABZONSPOR ATTIĞI GOL', renk: C.mavi, v: [5, 3, 6, 5, 2, 3]}} B={{ad: 'ALANYASPOR YEDİĞİ GOL', renk: C.turuncu, v: [1, 2, 3, 1, 5, 4]}}
    vurgular={[{idx: [0, 1], t: wr(4, 'ilk')}, {idx: [4, 5], t: wr(4, 'altmışıncı')}]}
    alt="15 DAKİKALIK DİLİMLER · SEZONUN 10 LİG MAÇI" />
);

const S6: React.FC<{ts: number}> = ({ts}) => (
  <Oyuncular ts={ts} yazi="BÖLÜM 6 · KİLİT İSİMLER" baslik="Dört isim, dört sayı" satirlar={[
    {ad: 'TRABZONSPOR', renk: C.mavi, kartlar: [
      {ad: 'SALAH', kisa: 'SA', tema: TS, sol: 'GOL', solD: 8, sag: 'xG (BEKLENTİ)', sagD: 4.92, renk: C.mavi, t: wr(5, 'Salah')},
      {ad: 'ONANA', kisa: 'ON', tema: TS, sol: 'MAÇ BAŞI ÖNLENEN GOL', solD: 0.61, solOnd: true, solMax: 1, sag: 'SOFASCORE PUANI', sagD: 7.87, renk: C.mavi, t: wr(5, 'Onana*')},
    ]},
    {ad: 'ALANYASPOR', renk: C.turuncu, kartlar: [
      {ad: 'RUAN', kisa: 'RU', tema: ALA, sol: 'ŞUT', solD: 19, solMax: 30, sag: 'İSABETLİ ŞUT', sagD: 6, renk: C.turuncu, t: wr(5, 'Ruan')},
      {ad: 'HADERGJONAJ', fs: 34, kisa: 'HA', tema: ALA, sol: 'KİLİT PAS', solD: 29, solMax: 30, sag: 'TOP KAYBI', sagD: 178, renk: C.turuncu, t: wr(5, 'Hadergjonaj')},
    ]},
  ]} />
);

const S7: React.FC<{ts: number}> = ({ts}) => (
  <Kapanis ts={ts} yazi="BÖLÜM 7 · KAPANIŞ" baslik="Piyasa ne diyor?" bigAd="TRABZONSPOR (PİYASA)"
    oranlar={[{ad: 'TRABZONSPOR', d: 57, r: C.mavi}, {ad: 'BERABERLİK', d: 24, r: C.ikinci}, {ad: 'ALANYASPOR', d: 19, r: C.turuncu}]}
    kaynak="BAHİS ORANLARI (SOFASCORE) · MARJ ÇIKARILMIŞ · 8 KASIM" tYuzde={wr(6, 'elli')} tSence={wr(6, 'Sence')} tTakip={wr(6, 'takip')} />
);

export const Shorts: React.FC = () => <Kabuk ctx={ctx} sahneler={[S1, S2, S3, S4, S5, S6, S7]} />;
