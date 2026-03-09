/**
 * Scene03-Title: 本集标题
 * 「想→做→看→再想」大字居中
 * 四个关键词依次亮起：「本地文件」「操作系统」「长期记忆」「可学习」
 * 底部：「不是 ChatBot，是 OS-level Agent」
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import {
  LAYOUT_BANDS,
  LAYOUT_GAP,
  LAYOUT_SAFE_MARGIN,
  MOTION_DURATION,
  MOTION_EASING,
  MOTION_STAGGER,
  SPRING_PRESETS,
  TEXT_CONTRAST_PRESETS,
} from '../lib/motion';

const KEYWORDS = [
  { text: '本地文件', color: colors.primary, icon: '📁' },
  { text: '操作系统', color: colors.accent, icon: '💻' },
  { text: '长期记忆', color: colors.warning, icon: '🧠' },
  { text: '可学习', color: colors.success, icon: '📚' },
];

export const Scene03Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: SPRING_PRESETS.soft,
  });
  const titleOpacity = interpolate(frame, [0, MOTION_DURATION.enterNormal], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MOTION_EASING.standard,
  });

  const quoteOpacity = interpolate(frame, [74, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MOTION_EASING.standard,
  });
  const breatheGate = interpolate(frame, [70, 86], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MOTION_EASING.standard,
  });

  // Arrow breathing animation
  const arrowOpacity1 = interpolate(frame % 90, [0, 30, 60, 90], [0.4, 1, 0.4, 0.4], { extrapolateRight: 'loop' });
  const arrowOpacity2 = interpolate((frame + 30) % 90, [0, 30, 60, 90], [0.4, 1, 0.4, 0.4], { extrapolateRight: 'loop' });
  const arrowOpacity3 = interpolate((frame + 60) % 90, [0, 30, 60, 90], [0.4, 1, 0.4, 0.4], { extrapolateRight: 'loop' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: LAYOUT_BANDS.top.top + 10,
        gap: LAYOUT_GAP.xl,
      }}
    >
      {/* 主标题 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translate3d(0, 0, 0) scale(${interpolate(titleSpring, [0, 0.9, 1], [0.9, 1.015, 1])})`,
        }}
      >
        <h1
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: colors.text,
            margin: 0,
            textAlign: 'center',
            letterSpacing: 6,
          }}
        >
          想{' '}
          <span style={{ color: colors.primary, opacity: arrowOpacity1 }}>→</span> 做{' '}
          <span style={{ color: colors.accent, opacity: arrowOpacity2 }}>→</span> 看{' '}
          <span style={{ color: colors.warning, opacity: arrowOpacity3 }}>→</span> 再想
        </h1>
      </div>

      {/* 四个关键词 */}
      <div
        style={{
          display: 'flex',
          gap: LAYOUT_GAP.md,
          justifyContent: 'space-between',
          width: `calc(100% - ${LAYOUT_SAFE_MARGIN.x * 2}px)`,
          maxWidth: 1260,
          padding: `0 ${LAYOUT_GAP.sm}px`,
        }}
      >
        {KEYWORDS.map((kw, i) => {
          const kwOpacity = interpolate(
            frame,
            [20 + i * MOTION_STAGGER.lg, 20 + i * MOTION_STAGGER.lg + MOTION_DURATION.enterNormal],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: MOTION_EASING.standard,
            },
          );
          const kwTranslateY = Math.round(interpolate(
            frame,
            [20 + i * MOTION_STAGGER.lg, 20 + i * MOTION_STAGGER.lg + MOTION_DURATION.enterNormal],
            [40, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.back(1.2)),
            },
          ));
          const kwScale = interpolate(
            frame,
            [20 + i * MOTION_STAGGER.lg, 20 + i * MOTION_STAGGER.lg + MOTION_DURATION.enterNormal],
            [0.9, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.back(1.2)),
            },
          );
          const breatheScale = 1 + Math.sin(frame * 0.035 + i * 0.7) * 0.008 * breatheGate;

          return (
            <div
              key={i}
              style={{
                opacity: kwOpacity,
                transform: `translate3d(0, ${kwTranslateY}px, 0) scale(${(kwScale * breatheScale).toFixed(4)})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: '24px 36px',
                backgroundColor: `${kw.color}12`,
                border: `1px solid ${kw.color}40`,
                borderRadius: 16,
                minWidth: 0,
                width: 260,
              }}
            >
              <span style={{ fontSize: 40 }}>{kw.icon}</span>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: kw.color,
                }}
              >
                {kw.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* 底部金句 */}
      <div
        style={{
          opacity: quoteOpacity,
          textAlign: 'center',
          position: 'absolute',
          bottom: LAYOUT_BANDS.bottom.bottom,
          width: `calc(100% - ${LAYOUT_SAFE_MARGIN.x * 2}px)`,
          maxWidth: 1080,
        }}
      >
        <div
          style={{
            fontSize: 34,
            color: colors.text,
            fontWeight: 600,
            opacity: TEXT_CONTRAST_PRESETS.captionStrong.opacity,
          }}
        >
          不是{' '}
          <span style={{ color: colors.textMuted, textDecoration: 'line-through' }}>ChatBot</span>
          ，是{' '}
          <span style={{ color: colors.accent }}>OS-level Agent</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
