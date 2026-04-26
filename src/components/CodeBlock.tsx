import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { codeFontStack } from '../lib/fonts';
import { colors } from '../lib/utils';

export const CodeBlock: React.FC<{
  code: string;
  startFrame?: number;
  revealDuration?: number;
}> = ({ code, startFrame = 0, revealDuration = 60 }) => {
  const frame = useCurrentFrame();
  const lines = code.split('\n');

  return (
    <div
      style={{
        fontFamily: codeFontStack,
        fontSize: 22,
        lineHeight: 1.7,
        color: colors.text,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 12,
        padding: '28px 32px',
        border: `1px solid ${colors.border}`,
        whiteSpace: 'pre',
      }}
    >
      {lines.map((line, i) => {
        const lineStart = startFrame + (i / lines.length) * revealDuration;
        const opacity = interpolate(
          frame,
          [lineStart, lineStart + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div key={i} style={{ opacity }}>
            {line || ' '}
          </div>
        );
      })}
    </div>
  );
};
