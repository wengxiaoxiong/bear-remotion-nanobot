/**
 * 淡入动画包装组件
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const springValue = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  
  const opacity = interpolate(
    springValue,
    [0, 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const getTranslate = () => {
    const d = distance * (1 - springValue);
    switch (direction) {
      case 'up': return `translateY(${d}px)`;
      case 'down': return `translateY(-${d}px)`;
      case 'left': return `translateX(${d}px)`;
      case 'right': return `translateX(-${d}px)`;
      default: return 'none';
    }
  };

  return (
    <div
      style={{
        opacity,
        transform: getTranslate(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
