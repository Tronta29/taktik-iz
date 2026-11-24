import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const C = {bg: '#071510', yesil: '#39f08a', metin: '#e4fbe9', ikinci: '#b9dcc6', sari: '#ffd60a', kenar: '#1f5a38', panel: '#0f2a1c'};

export const Kapak: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: "'Montserrat', sans-serif", overflow: 'hidden'}} lang="tr">
    <style>{`@font-face{font-family:'Montserrat';src:url('${staticFile('Montserrat_900Black.ttf')}');font-weight:900;}`}</style>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(57,240,138,0.30), rgba(7,21,16,0) 60%)'}} />
    <AbsoluteFill style={{opacity: 0.08, backgroundImage: `linear-gradient(${C.yesil} 2px, transparent 2px), linear-gradient(90deg, ${C.yesil} 2px, transparent 2px)`, backgroundSize: '120px 120px'}} />

    <Img src={staticFile('img/kose-logo-seffaf.png')} style={{position: 'absolute', left: 50, top: 60, width: 440}} />
    <div style={{position: 'absolute', right: 56, top: 90, textAlign: 'right'}}>
      <div style={{fontSize: 34, fontWeight: 900, color: C.yesil, letterSpacing: 2}}>MAÇ ÖNÜ</div>
      <div style={{fontSize: 26, fontWeight: 900, color: C.ikinci}}>7 KASIM · SÜPER LİG</div>
    </div>

    <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center'}}>
      <div style={{fontSize: 270, fontWeight: 900, color: C.yesil, lineHeight: 0.95, whiteSpace: 'nowrap', textShadow: '0 0 60px rgba(57,240,138,0.6)'}}>12 KAT</div>
      <div style={{fontSize: 130, fontWeight: 900, color: C.metin, lineHeight: 1, marginTop: 10}}>FARK VAR</div>
      <div style={{display: 'inline-block', marginTop: 50, padding: '14px 50px', background: C.sari, borderRadius: 18, fontSize: 84, fontWeight: 900, color: C.bg, transform: 'rotate(-3deg)'}}>AMA TEK AÇIK?</div>
    </div>

    <div style={{position: 'absolute', left: 60, right: 60, top: 1180, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{textAlign: 'center'}}>
        <Img src={staticFile('img/gs.png')} style={{width: 270, height: 270, objectFit: 'contain'}} />
        <div style={{fontSize: 40, fontWeight: 900, color: C.yesil}}>381 MİLYON €</div>
      </div>
      <div style={{fontSize: 100, fontWeight: 900, color: C.metin}}>VS</div>
      <div style={{textAlign: 'center'}}>
        <Img src={staticFile('img/amed.png')} style={{width: 270, height: 270, objectFit: 'contain'}} />
        <div style={{fontSize: 40, fontWeight: 900, color: C.sari}}>32 MİLYON €</div>
      </div>
    </div>

    <div style={{position: 'absolute', left: 56, right: 56, bottom: 150, textAlign: 'center', fontSize: 40, fontWeight: 900, color: C.ikinci}}>GALATASARAY – AMEDSPOR</div>
    <div style={{position: 'absolute', left: 56, right: 56, bottom: 120, height: 8, background: C.yesil, boxShadow: `0 0 16px ${C.yesil}`}} />
  </AbsoluteFill>
);
