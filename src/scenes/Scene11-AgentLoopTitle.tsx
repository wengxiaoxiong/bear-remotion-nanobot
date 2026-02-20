/**
 * Scene11-AgentLoopTitle: 过渡标题卡
 * 「Agent Loop 迭代」大字
 * 副标题「整个 Agent 的心脏」
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene11AgentLoopTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const subtitleSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const glowIntensity = Math.sin(frame * 0.08) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      {/* 背景装饰圆环 */}
      <div
        style={{
          position: 'absolute',
          width: 450,
          height: 450,
          borderRadius: '50%',
          border: `2px solid ${colors.accent}20`,
          boxShadow: `0 0 ${80 * glowIntensity}px ${colors.accent}15`,
        }}
      />

      {/* 标题 */}
      <div
        style={{
          opacity: titleSpring,
          transform: `scale(${0.85 + titleSpring * 0.15})`,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: colors.text,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Agent Loop{' '}
          <span style={{ color: colors.accent }}>迭代</span>
        </h1>
      </div>

      {/* 副标题 */}
      <div
        style={{
          opacity: subtitleSpring,
          transform: `translateY(${(1 - subtitleSpring) * 15}px)`,
        }}
      >
        <p
          style={{
            fontSize: 36,
            color: colors.textMuted,
            margin: 0,
          }}
        >
          整个 Agent 的
          <span style={{ color: colors.primary, fontWeight: 700 }}> 心脏</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
