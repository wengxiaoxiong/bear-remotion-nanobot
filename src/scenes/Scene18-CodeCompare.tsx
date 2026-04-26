import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene18CodeCompare: React.FC = () => {
  const frame = useCurrentFrame();

  const count1 = Math.min(Math.floor(interpolate(frame, [30, 90], [0, 100000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })), 100000);
  const count2 = Math.min(Math.floor(interpolate(frame, [30, 90], [0, 3000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })), 3000);
  const fadeOut = interpolate(frame, [200, 260], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const formulaIn = interpolate(frame, [220, 280], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 80, opacity: fadeOut }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: colors.error }}>{count1.toLocaleString()}+</div>
          <div style={{ fontSize: 32, color: colors.textMuted, marginTop: 14 }}>小龙虾 行数</div>
        </div>
        <div style={{ fontSize: 60, color: colors.textDark }}>vs</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: colors.success }}>~{count2.toLocaleString()}</div>
          <div style={{ fontSize: 32, color: colors.textMuted, marginTop: 14 }}>NanoBot 行数</div>
        </div>
      </div>

      <div style={{ marginTop: 100, textAlign: 'center', opacity: formulaIn, transform: `translateY(${(1 - formulaIn) * 20}px)` }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: colors.text }}>
          <span style={{ color: colors.layerIdentity }}>会推理</span>
          <span style={{ color: colors.textDark, margin: '0 16px' }}>+</span>
          <span style={{ color: colors.layerBootstrap }}>会主动</span>
          <span style={{ color: colors.textDark, margin: '0 16px' }}>+</span>
          <span style={{ color: colors.layerMemory }}>会扩展</span>
          <span style={{ color: colors.textDark, margin: '0 16px' }}>+</span>
          <span style={{ color: colors.layerSkills }}>看得准</span>
        </div>
        <div style={{ fontSize: 32, color: colors.textMuted, marginTop: 20 }}>Agent 的智能 = 四大核心能力</div>
      </div>
    </AbsoluteFill>
  );
};
