import React from 'react';
import {Composition} from 'remotion';
import Takim from './Isi';
import Oyuncular from './Oyuncu';

type K = 'TS' | 'ALA' | 'BJK' | 'GBR';
const mk = (k: K) => () => <Takim k={k} />;
const mo = (k: K, r: string) => () => <Oyuncular k={k} rakip={r} />;
export const Root: React.FC = () => (
  <>
    <Composition id="TS" component={mk('TS')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ALA" component={mk('ALA')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="BJK" component={mk('BJK')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="GBR" component={mk('GBR')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="OTS" component={mo('TS', 'Alanyaspor')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="OALA" component={mo('ALA', 'Trabzonspor')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="OBJK" component={mo('BJK', 'Gençlerbirliği')} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="OGBR" component={mo('GBR', 'Beşiktaş')} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);