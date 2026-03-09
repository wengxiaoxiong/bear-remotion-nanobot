/**
 * Scene18-ToolsWhere: 过渡场景
 * 居中大字「这些工具跑在哪？」
 * 300帧/10秒
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene18ToolsWhere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 主标题入场动画
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);

  // 副标题延迟入场
  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
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
      }}
    >
      {/* 主标题 */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: colors.accent,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale}) translateY(${titleY}px)`,
          textShadow: `0 0 60px ${colors.accent}40`,
        }}
      >
        这些工具跑在哪？
      </div>

      {/* 副标题 */}
      <div
        style={{
          fontSize: 28,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: 32,
          opacity: subtitleOpacity,
        }}
      >
        Part 2: 为什么是 OS-level Agent?
      </div>

      {/* 装饰线条 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${colors.accent}60, transparent)`,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
