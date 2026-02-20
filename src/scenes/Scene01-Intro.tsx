/**
 * Scene01-Intro: 开场介绍
 * 主讲人头像、系列标题「用1%的代码复刻 Clawdbot」、副标题「2/3」
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const avatarSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      {/* 头像 */}
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: avatarSpring,
          transform: `scale(${0.5 + avatarSpring * 0.5})`,
          boxShadow: `0 0 50px ${colors.primary}40`,
        }}
      >
        <span style={{ fontSize: 72, color: '#fff', fontWeight: 700 }}>熊</span>
      </div>

      {/* 系列标题 */}
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: colors.text,
            margin: 0,
            letterSpacing: 3,
          }}
        >
          用1%的代码复刻{' '}
          <span style={{ color: colors.accent }}>Clawdbot</span>
        </h1>
      </div>

      {/* 副标题 */}
      <div
        style={{
          opacity: subtitleOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            padding: '12px 36px',
            borderRadius: 30,
            background: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}30)`,
            border: `1px solid ${colors.primary}50`,
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: colors.primaryLight,
            }}
          >
            EP2 / 3
          </span>
        </div>
        <span style={{ fontSize: 32, color: colors.textMuted }}>
          Agent Loop 深度拆解
        </span>
      </div>

      {/* 底部提示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          opacity: bottomOpacity,
          fontSize: 28,
          color: colors.textDark,
          letterSpacing: 4,
        }}
      >
        想 → 做 → 看 → 再想
      </div>
    </AbsoluteFill>
  );
};
