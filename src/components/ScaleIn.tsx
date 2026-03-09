/**
 * 缩放入场动画组件
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { SPRING_PRESETS } from '../lib/motion';

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  from?: number;
  overshoot?: number;
  style?: React.CSSProperties;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  from = 0.9,
  overshoot = 1.015,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springValue = spring({
    frame: frame - delay,
    fps,
    config: SPRING_PRESETS.soft,
  });

  const scale = interpolate(springValue, [0, 0.85, 1], [from, overshoot, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(springValue, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `translate3d(0, 0, 0) scale(${scale})`,
        opacity,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
