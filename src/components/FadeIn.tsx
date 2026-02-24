/**
 * 淡入动画包装组件
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { MOTION_DURATION, MOTION_EASING, MOTION_OFFSET } from '../lib/motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  easing?: ((input: number) => number) | undefined;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  blurFrom?: number;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = MOTION_DURATION.enterNormal,
  easing = MOTION_EASING.standard,
  direction = 'up',
  distance = MOTION_OFFSET.yLg,
  blurFrom = 6,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

  const getTransform = () => {
    const d = Math.round(distance * (1 - progress));
    switch (direction) {
      case 'up':
        return `translate3d(0, ${d}px, 0)`;
      case 'down':
        return `translate3d(0, ${-d}px, 0)`;
      case 'left':
        return `translate3d(${d}px, 0, 0)`;
      case 'right':
        return `translate3d(${-d}px, 0, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      style={{
        opacity: progress,
        transform: getTransform(),
        filter: `blur(${((1 - progress) * blurFrom).toFixed(2)}px)`,
        willChange: 'opacity, transform, filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
