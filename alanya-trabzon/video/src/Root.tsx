import React from 'react';
import {Composition} from 'remotion';
import {Video, TOPLAM_SN} from './Video';

export const Root: React.FC = () => (
  <Composition id="Uzun" component={Video} durationInFrames={Math.ceil(TOPLAM_SN * 30)} fps={30} width={1920} height={1080} />
);
