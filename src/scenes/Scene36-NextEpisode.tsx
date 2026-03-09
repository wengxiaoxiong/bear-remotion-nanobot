/**
 * Scene36-NextEpisode: 下集预告
 * 预告：「Skill 声明式技能」+「记忆生命周期」
 * 300帧/10秒
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

const NEXT_TOPICS = [
  {
    icon: '📋',
    title: 'Skill',
    subtitle: '声明式技能',
    desc: '如何让 Agent 学会新能力',
    color: colors.primary,
  },
  {
    icon: '🧠',
    title: 'Memory',
    subtitle: '记忆生命周期',
    desc: '什么时候记，什么时候忘',
    color: colors.accent,
  },
];

export const Scene36NextEpisode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // 主题卡片入场
  const cardSprings = NEXT_TOPICS.map((_, i) =>
    spring({
      frame: frame - 60 - i * 40,
      fps,
      config: { damping: 12, stiffness: 150 },
    })
  );

  // 结尾文字
  const endingOpacity = interpolate(frame, [200, 250], [0, 1], {
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
      {/* 下集预告标题 */}
      <div
        style={{
          textAlign: 'center',
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
          marginBottom: 60,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: colors.warning,
            letterSpacing: 4,
            marginBottom: 12,
          }}
        >
          TO BE CONTINUED
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          下集预告
        </div>
      </div>

      {/* 两个主题卡片 */}
      <div
        style={{
          display: 'flex',
          gap: 50,
          marginBottom: 80,
        }}
      >
        {NEXT_TOPICS.map((topic, i) => {
          const springVal = cardSprings[i];
          const opacity = Math.max(0, springVal);

          return (
            <div
              key={i}
              style={{
                width: 320,
                height: 280,
                backgroundColor: colors.backgroundCard,
                borderRadius: 20,
                border: `2px solid ${topic.color}50`,
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity,
                transform: `translateY(${(1 - opacity) * 40}px) rotate(${(1 - opacity) * 5}deg)`,
                boxShadow: `0 0 40px ${topic.color}20`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>{topic.icon}</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: topic.color,
                  marginBottom: 4,
                }}
              >
                {topic.title}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: colors.text,
                  marginBottom: 20,
                }}
              >
                {topic.subtitle}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                {topic.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* 结尾文字 */}
      <div
        style={{
          textAlign: 'center',
          opacity: endingOpacity,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: colors.accent,
            textShadow: `0 0 40px ${colors.accent}50`,
          }}
        >
          我们下集见
        </div>
      </div>
    </AbsoluteFill>
  );
};
