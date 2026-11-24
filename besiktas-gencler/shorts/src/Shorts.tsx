import React from 'react';
import {C, BJK, GBR, Kabuk, Hook, Baglam, FormSahne, SahaSahne, Dilim, Oyuncular, Kapanis, hazirla} from './ortak';
import veri from '../veri.json';

const ctx = hazirla(veri);
const {wr} = ctx;
export const TOPLAM_SN = ctx.TOPLAM_SN;
const BEYAZ = C.metin;

const S1: React.FC<{ts: number}> = ({ts}) => (
  <Hook ts={ts} badge={{yazi: 'EVİNDE 5 MAÇTA 5 GALİBİYET', t: BJK}} tBadge={0.2} tBuyuk={0.15} deger={0.67} d={2}
    etiket="EVİNDE YEDİĞİ xG (MAÇ BAŞI)" alt="BEŞİKTAŞ · 5 EV MAÇI" A={{t: BJK, ad: 'BJK'}} B={{t: GBR, ad: 'GBR'}}
    barlar={[{ad: 'BEŞİKTAŞ EVDE YEDİĞİ xG', deger: 0.67, max: 2.6, renk: C.yesil}, {ad: 'GENÇLERBİRLİĞİ DEPL. YEDİĞİ xG', deger: 2.6, max: 2.6, renk: C.turuncu}]} />
);

const S2: React.FC<{ts: number}> = ({ts}) => (
  <Baglam ts={ts} yazi="BÖLÜM 2 · MAÇ BAĞLAMI" baslik="Üst sıra, alt sıra" gruplar={[
    {baslik: 'PUAN DURUMU', renk: C.yesil, y: 400, t: 0, barlar: [
      {ad: '5. BEŞİKTAŞ', deger: 19, max: 19, renk: BEYAZ, tema: BJK, kisa: 'BJK', t: wr(1, 'dokuz'), birim: 'PUAN'},
      {ad: '14. GENÇLERBİRLİĞİ', deger: 11, max: 19, renk: C.turuncu, tema: GBR, kisa: 'GBR', t: wr(1, 'bir'), birim: 'PUAN', fs: 30}]},
    {baslik: 'ATTIĞI GOL', renk: C.yesil, y: 760, t: wr(1, 'yirmi'), barlar: [
      {ad: 'BEŞİKTAŞ', deger: 20, max: 20, renk: BEYAZ, tema: BJK, kisa: 'BJK', t: wr(1, 'yirmi'), birim: 'GOL'},
      {ad: 'GENÇLERBİRLİĞİ', deger: 12, max: 20, renk: C.turuncu, tema: GBR, kisa: 'GBR', t: wr(1, 'attı'), birim: 'GOL', fs: 30}]},
    {baslik: 'YEDİĞİ GOL', renk: C.kirmizi, y: 1040, t: wr(1, 'iki'), barlar: [
      {ad: 'BEŞİKTAŞ', deger: 12, max: 20, renk: BEYAZ, tema: BJK, kisa: 'BJK', t: wr(1, 'iki'), birim: 'GOL'},
      {ad: 'GENÇLERBİRLİĞİ', deger: 18, max: 20, renk: C.turuncu, tema: GBR, kisa: 'GBR', t: wr(1, 'sekiz'), birim: 'GOL', fs: 30}]},
  ]} />
);

const S3: React.FC<{ts: number}> = ({ts}) => {
  const tG = wr(2, 'Gençlerbirliği');
  return (
    <FormSahne ts={ts} yazi="BÖLÜM 3 · FORM VE EKSİKLER" baslik="Evde güçlü, deplasmanda zayıf"
      formlar={[{ad: 'BEŞİKTAŞ', kisa: 'BJK', tema: BJK, sonuc: 'MGMGB', t: 0.2}, {ad: 'GENÇLERBİRLİĞİ', kisa: 'GBR', tema: GBR, sonuc: 'MBMMG', t: tG - 0.3}]}
      kartlar={[
        {ust: 'BEŞİKTAŞ', ad: 'VINCENZO ITALIANO', fs: 31, alt: 'EVDE 5 MAÇ 5 GALİBİYET', altRenk: C.yesil, kenar: '#ffffff', t: 0.3},
        {ust: 'GENÇLERBİRLİĞİ', ad: 'BERND STORCK', alt: 'DEPL. 4 MAÇ · 1 GOL', altRenk: C.kirmizi, kenar: C.turuncu, t: tG + 0.3},
      ]}
      tEksik={wr(2, 'Miretti')}
      eksikler={[
        {ust: 'BEŞİKTAŞ', yazi: 'MİRETTİ · ÜMİT', t: wr(2, 'Miretti')},
        {ust: 'GENÇLERBİRLİĞİ', yazi: 'GOUTAS (74 UZAKLAŞTIRMA)', t: wr(2, 'Goutas'), fs: 25},
      ]} />
  );
};

const S4: React.FC<{ts: number}> = ({ts}) => (
  <SahaSahne ts={ts} yazi="BÖLÜM 4 · EVDEKİ BASKI" baslik="Beşiktaş topu bırakmıyor" atk={BJK} sav={GBR} bolge="RAKİP CEZA SAHASI"
    kutular={[
      {v: 2.14, d: 2, ad: 'BJK EVDE xG', renk: C.yesil, t: wr(3, 'dört')},
      {v: 0.67, d: 2, ad: 'BJK EVDE YEDİĞİ', renk: C.yesil, t: wr(3, 'yedi')},
      {v: 2.6, d: 2, ad: 'GBR DEPL. YEDİĞİ', renk: C.turuncu, t: wr(3, 'altı', 1)},
    ]} />
);

const S5: React.FC<{ts: number}> = ({ts}) => (
  <Dilim ts={ts} yazi="BÖLÜM 5 · İLK YARIM SAAT" baslik="Gol dakikaları" max={6}
    A={{ad: 'BEŞİKTAŞ ATTIĞI GOL', renk: BEYAZ, v: [1, 5, 3, 3, 3, 5]}} B={{ad: 'GBR YEDİĞİ GOL', renk: C.turuncu, v: [4, 2, 2, 4, 2, 4]}}
    vurgular={[{idx: [0, 1], t: wr(4, 'ilk')}, {idx: [1], t: wr(4, 'altı', 1)}]}
    alt="15 DAKİKALIK DİLİMLER · SEZONUN 10 LİG MAÇI" />
);

const S6: React.FC<{ts: number}> = ({ts}) => (
  <Oyuncular ts={ts} yazi="BÖLÜM 6 · KİLİT İSİMLER" baslik="Golcü, kanat, kaleci" satirlar={[
    {ad: 'BEŞİKTAŞ', renk: BEYAZ, kartlar: [
      {ad: 'VLAHOVIĆ', fs: 40, kisa: 'VL', tema: BJK, sol: 'GOL (8 MAÇ)', solD: 7, sag: 'xG (BEKLENTİ)', sagD: 5.74, renk: BEYAZ, t: wr(5, 'Vlahović')},
      {ad: 'TROSSARD', fs: 40, kisa: 'TR', tema: BJK, sol: 'ŞUT', solD: 29, solMax: 30, sag: 'BAŞARILI ÇALIM', sagD: 15, renk: BEYAZ, t: wr(5, 'Trossard')},
    ]},
    {ad: 'GENÇLERBİRLİĞİ', renk: C.turuncu, kartlar: [
      {ad: 'İRFAN CAN', kisa: 'IC', tema: GBR, sol: 'MAÇ BAŞI KURTARIŞ', solD: 4.9, solOnd: true, solDec: 1, solMax: 6, sag: 'ÖNLENEN GOL', sagD: 0.45, renk: C.turuncu, t: wr(5, 'İrfan')},
      {ad: 'GOUVEIA', kisa: 'TG', tema: GBR, sol: 'ŞUT', solD: 20, solMax: 30, sag: 'BAŞARILI ÇALIM', sagD: 17, renk: C.turuncu, t: wr(5, 'Gouveia')},
    ]},
  ]} />
);

const S7: React.FC<{ts: number}> = ({ts}) => (
  <Kapanis ts={ts} yazi="BÖLÜM 7 · KAPANIŞ" baslik="Piyasa ne diyor?" bigAd="BEŞİKTAŞ (PİYASA)"
    oranlar={[{ad: 'BEŞİKTAŞ', d: 79, r: C.yesil}, {ad: 'BERABERLİK', d: 13, r: C.ikinci}, {ad: 'GENÇLERBİRLİĞİ', d: 8, r: C.turuncu}]}
    kaynak="BAHİS ORANLARI (SOFASCORE) · MARJ ÇIKARILMIŞ · 8 KASIM" tYuzde={wr(6, 'yetmiş')} tSence={wr(6, 'Sence')} tTakip={wr(6, 'takip')} />
);

export const Shorts: React.FC = () => <Kabuk ctx={ctx} sahneler={[S1, S2, S3, S4, S5, S6, S7]} />;
