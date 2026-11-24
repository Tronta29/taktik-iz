import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const C = {bg: '#071510', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6', sari: '#ffd60a', kirmizi: '#ff4d3d'};
const Rozet: React.FC<{ic: string; halka: string; ad: string; b: number}> = ({ic, halka, ad, b}) => (
  <div style={{width: b, height: b, borderRadius: '50%', background: ic, border: `${b * 0.05}px solid ${halka}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: b * (ad.length > 2 ? 0.3 : 0.38), fontWeight: 900, color: halka}}>{ad}</div>
);

export const Kapak: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: "'Montserrat', sans-serif", overflow: 'hidden'}} lang="tr">
    <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(57,240,138,0.30), rgba(7,21,16,0) 60%)'}} />
    <AbsoluteFill style={{opacity: 0.08, backgroundImage: `linear-gradient(${C.yesil} 2px, transparent 2px), linear-gradient(90deg, ${C.yesil} 2px, transparent 2px)`, backgroundSize: '120px 120px'}} />
    <Img src={staticFile('img/kose-logo-seffaf.png')} style={{position: 'absolute', left: 50, top: 60, width: 440}} />
    <div style={{position: 'absolute', right: 56, top: 90, textAlign: 'right'}}>
      <div style={{fontSize: 34, fontWeight: 900, color: C.yesil, letterSpacing: 2}}>MAÇ ÖNÜ</div>
      <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>8 KASIM · SÜPER LİG</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center'}}>
      <div style={{fontSize: 40, fontWeight: 900, color: C.ikinci, letterSpacing: 2}}>FENERBAHÇE xG / MAÇ</div>
      <div style={{fontSize: 300, fontWeight: 900, color: C.yesil, lineHeight: 1, textShadow: '0 0 60px rgba(57,240,138,0.6)'}}>2,69</div>
      <div style={{fontSize: 40, fontWeight: 900, color: C.metin}}>EVDE</div>
      <div style={{fontSize: 110, fontWeight: 900, color: C.kirmizi, lineHeight: 1, margin: '10px 0'}}>▼</div>
      <div style={{fontSize: 300, fontWeight: 900, color: C.kirmizi, lineHeight: 1, textShadow: '0 0 60px rgba(255,77,61,0.55)'}}>1,41</div>
      <div style={{fontSize: 40, fontWeight: 900, color: C.metin}}>DEPLASMANDA</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1290, textAlign: 'center'}}>
      <div style={{display: 'inline-block', padding: '14px 40px', background: C.sari, borderRadius: 18, fontSize: 50, fontWeight: 900, color: C.bg, transform: 'rotate(-3deg)'}}>EMRE DÖNEMİ BAŞLIYOR</div>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 1440, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50}}>
      <Rozet ic="#0b2a6b" halka="#ffe600" ad="FB" b={170} />
      <div style={{fontSize: 70, fontWeight: 900, color: C.metin}}>VS</div>
      <Rozet ic="#c8102e" halka="#ffffff" ad="ÇFK" b={170} />
    </div>
    <div style={{position: 'absolute', left: 56, right: 56, bottom: 120, height: 8, background: C.yesil, boxShadow: `0 0 16px ${C.yesil}`}} />
  </AbsoluteFill>
);
