/**
 * Scene01-Intro: 开场介绍
 * 主讲人头像、系列标题「用1%的代码复刻 Clawdbot」、副标题「2/3」
 */

import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { MOTION_DURATION, MOTION_EASING, MOTION_STAGGER, SPRING_PRESETS } from '../lib/motion';

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const avatarSpring = spring({
    frame: frame - 0,
    fps,
    config: SPRING_PRESETS.emphasis,
  });

  const titleProgress = interpolate(frame, [10, 10 + MOTION_DURATION.enterSlow], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MOTION_EASING.standard,
  });

  const subtitleOpacity = interpolate(
    frame,
    [10 + MOTION_STAGGER.lg, 10 + MOTION_STAGGER.lg + MOTION_DURATION.enterNormal],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );

  const bottomOpacity = interpolate(
    frame,
    [10 + MOTION_STAGGER.lg * 2, 10 + MOTION_STAGGER.lg * 2 + MOTION_DURATION.enterNormal],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );

  const subtitleY = Math.round((1 - subtitleOpacity) * 12);
  const bottomY = Math.round((1 - bottomOpacity) * 10);
  // Delay and soften camera drift to avoid opening jitter.
  const cameraDriftGate = interpolate(frame, [36, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MOTION_EASING.standard,
  });
  const cameraX = Math.sin(frame * 0.018) * 1.2 * cameraDriftGate;
  const cameraY = Math.cos(frame * 0.015) * 0.8 * cameraDriftGate;
  const titleY = Math.round((1 - titleProgress) * 18);
  const avatarScale = interpolate(avatarSpring, [0, 0.85, 1], [0.82, 1.02, 1], {
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
        transform: `translate3d(${cameraX}px, ${cameraY}px, 0)`,
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
          transform: `translate3d(0, 0, 0) scale(${avatarScale})`,
          boxShadow: `0 0 50px ${colors.primary}40`,
        }}
      >
        <span style={{ fontSize: 72, color: '#fff', fontWeight: 700 }}>熊</span>
      </div>

      {/* 系列标题 */}
      <div
        style={{
          opacity: titleProgress,
          transform: `translate3d(0, ${titleY}px, 0)`,
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
          transform: `translate3d(0, ${subtitleY}px, 0)`,
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
          transform: `translate3d(0, ${bottomY}px, 0)`,
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
