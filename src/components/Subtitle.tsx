/**
 * 字幕组件
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../lib/utils';
import { fontFamily } from '../lib/fonts';
import type { SubtitleSegment } from '../lib/subtitleSegments';

interface SubtitleProps {
  text: string;
  style?: React.CSSProperties;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  style,
}) => {
  const frame = useCurrentFrame();

  // 淡入淡出动画
  const opacity = interpolate(
    frame,
    [0, 10, 290, 300],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: 1400,
        padding: '20px 40px',
        backgroundColor: 'rgba(15, 15, 26, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        opacity,
        ...style,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 28,
          lineHeight: 1.6,
          color: colors.text,
          fontFamily,
          textAlign: 'center',
        }}
      >
        {text}
      </p>
    </div>
  );
};

// 简化版字幕组件
export const SimpleSubtitle: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 32px',
        backgroundColor: 'rgba(15, 15, 26, 0.9)',
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 24,
          color: colors.text,
          fontFamily,
          textAlign: 'center',
        }}
      >
        {text}
      </p>
    </div>
  );
};
