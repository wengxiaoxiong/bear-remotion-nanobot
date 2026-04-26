import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const TextReveal: React.FC<{
  text: string;
  start?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, start = 0, duration = 60, style }) => {
  const frame = useCurrentFrame();
  const chars = text.split('');

  return (
    <span style={style}>
      {chars.map((char, i) => {
        const charStart = start + (i / chars.length) * duration;
        const opacity = interpolate(
          frame,
          [charStart, charStart + 5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <span key={i} style={{ opacity, display: 'inline-block' }}>
            {char}
          </span>
        );
      })}
    </span>
  );
};
