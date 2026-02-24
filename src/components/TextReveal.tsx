/**
 * 文字逐字显示组件
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { MOTION_DURATION, MOTION_EASING } from '../lib/motion';

interface TextRevealProps {
  text: string;
  startFrame?: number;
  duration?: number;
  easing?: ((input: number) => number) | undefined;
  stagger?: number;
  style?: React.CSSProperties;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  startFrame = 0,
  duration = MOTION_DURATION.enterSlow + 22,
  easing = MOTION_EASING.standard,
  stagger = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const effectiveStart = startFrame + stagger;

  const progress = interpolate(
    frame,
    [effectiveStart, effectiveStart + duration],
    [0, text.length],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing,
    },
  );

  const visibleText = text.slice(0, Math.floor(progress));

  return (
    <span style={style}>
      {visibleText}
    </span>
  );
};
