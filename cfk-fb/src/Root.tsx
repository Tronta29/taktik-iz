import React from 'react';
import {Composition} from 'remotion';
import {Shorts, TOPLAM_SN} from './Shorts';
import {Kapak} from './Kapak';

const FPS = 30;
export const Root: React.FC = () => (
  <>
    <Composition id="Shorts" component={Shorts} durationInFrames={Math.ceil(TOPLAM_SN * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Kapak" component={Kapak} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  </>
);
