import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const avatarSpring = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const titleSpring = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 120 } });
  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bottomOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 60 }}
    >
      <div style={{ width: 220, height: 220, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: avatarSpring, transform: `scale(${0.5 + avatarSpring * 0.5})`, boxShadow: `0 0 60px ${colors.primary}40` }}>
        <span style={{ fontSize: 100, color: '#fff', fontWeight: 700 }}>🐻</span>
      </div>
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, textAlign: 'center' }}>
        <h1 style={{ fontSize: 96, fontWeight: 800, color: colors.text, margin: 0, letterSpacing: 4 }}>
          用1%的代码复刻<span style={{ color: colors.accent }}>小龙虾</span>
        </h1>
      </div>
      <div style={{ opacity: subtitleOpacity, display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ padding: '16px 48px', borderRadius: 40, background: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}30)`, border: `1px solid ${colors.primary}50` }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: colors.primaryLight }}>EP3 / 3</span>
        </div>
        <span style={{ fontSize: 40, color: colors.textMuted }}>上下文工程：Agent 的"眼睛"</span>
      </div>
      <div style={{ position: 'absolute', bottom: 160, opacity: bottomOpacity, fontSize: 36, color: colors.textDark, letterSpacing: 6 }}>
        分层设计 · 记忆生命周期 · 三平面架构
      </div>
    </AbsoluteFill>
  );
};
