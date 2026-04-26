import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import type { SubtitleSegment } from '../lib/subtitleSegments';

interface SingleLineSubtitleProps {
  segments: SubtitleSegment[];
}

export const SingleLineSubtitle: React.FC<SingleLineSubtitleProps> = ({
  segments,
}) => {
  const frame = useCurrentFrame();

  // 找到当前应该显示的字幕段
  const currentSegment = segments.find(
    (seg) => frame >= seg.start && frame < seg.end
  );

  if (!currentSegment) {
    return null;
  }

  // 淡入淡出
  const fadeIn = interpolate(
    frame,
    [currentSegment.start, currentSegment.start + 6],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const fadeOut = interpolate(
    frame,
    [currentSegment.end - 8, currentSegment.end],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = Math.min(fadeIn, fadeOut);
  const translateY = interpolate(
    frame,
    [currentSegment.start, currentSegment.start + 6],
    [10, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <span
      style={{
        fontSize: 42,
        lineHeight: 1.5,
        color: colors.text,
        fontFamily: fontStack,
        textAlign: 'center',
        opacity,
        fontWeight: 700,
        transform: `translateY(${translateY}px)`,
        textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)',
        maxWidth: '88%',
        display: 'inline-block',
        letterSpacing: 1,
      }}
    >
      {currentSegment.text}
    </span>
  );
};
