/**
 * 带音频的场景包装组件
 */

import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface AudioSceneProps {
  sceneId: string;
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export const AudioScene: React.FC<AudioSceneProps> = ({
  sceneId,
  children,
  fadeIn = true,
  fadeOut = true,
}) => {
  const audioSrc = staticFile(`audio/${sceneId}.mp3`);
  
  return (
    <>
      <Audio src={audioSrc} />
      {children}
    </>
  );
};

// 简化版音频场景
export const SimpleAudioScene: React.FC<{
  sceneId: string;
  children: React.ReactNode;
}> = ({ sceneId, children }) => {
  const audioSrc = staticFile(`audio/${sceneId}.mp3`);
  
  return (
    <>
      <Audio src={audioSrc} />
      {children}
    </>
  );
};

// 带时长的音频场景
export const AudioSceneWithDuration: React.FC<{
  sceneId: string;
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ sceneId, children }) => {
  const audioSrc = staticFile(`audio/${sceneId}.mp3`);
  
  return (
    <>
      <Audio src={audioSrc} />
      {children}
    </>
  );
};
