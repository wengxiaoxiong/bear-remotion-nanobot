/**
 * 文字逐字显示组件
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface TextRevealProps {
  text: string;
  startFrame?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  startFrame = 0,
  duration = 60,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, text.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const visibleText = text.slice(0, Math.floor(progress));

  return (
    <span style={style}>
      {visibleText}
    </span>
  );
};
