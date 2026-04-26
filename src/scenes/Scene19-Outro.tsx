import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene19Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 120 } });
  const op = interpolate(s, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <div style={{ opacity: op, transform: `scale(${0.9 + s * 0.1})`, textAlign: 'center', maxWidth: 1400 }}>
        <div style={{ fontSize: 48, color: colors.text, lineHeight: 1.6, marginBottom: 50 }}>
          理解了这四点，你不只是理解了 小龙虾——<br />
          你理解了一个设计良好的 AI Agent 系统该长什么样。
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: colors.accent, marginBottom: 28 }}>
          我是熊老板，系列结束
        </div>
        <div style={{ fontSize: 36, color: colors.textMuted }}>
          如果有帮助，别忘了三连。我们下个系列见。
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 140, opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <div style={{ width: 160, height: 160, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${colors.primary}40` }}>
          <span style={{ fontSize: 72, color: '#fff', fontWeight: 700 }}>🐻</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
