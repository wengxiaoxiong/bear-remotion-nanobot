/**
 * Scene34-ArchitectureSummary: 架构总结
 * 抽象架构图：Context Builder → Planner → Executor → Memory Writer
 * 600帧/20秒
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

const ARCHITECTURE_STEPS = [
  {
    label: 'Context Builder',
    sublabel: '上下文构建器',
    desc: '组装 System Prompt + 历史 + 当前消息',
    color: colors.primary,
    icon: '🧩',
  },
  {
    label: 'Planner',
    sublabel: '规划器',
    desc: 'LLM 决策下一步行动',
    color: colors.accent,
    icon: '🧠',
  },
  {
    label: 'Executor',
    sublabel: '执行器',
    desc: '调用工具，获取结果',
    color: colors.success,
    icon: '⚡',
  },
  {
    label: 'Memory Writer',
    sublabel: '记忆写入器',
    desc: '更新长期记忆',
    color: colors.warning,
    icon: '💾',
  },
];

export const Scene34ArchitectureSummary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // 架构步骤依次入场
  const stepSprings = ARCHITECTURE_STEPS.map((_, i) =>
    spring({
      frame: frame - 60 - i * 40,
      fps,
      config: { damping: 12, stiffness: 150 },
    })
  );

  // 金句
  const quoteOpacity = interpolate(frame, [360, 420], [0, 1], {
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
        paddingTop: 60,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          textAlign: 'center',
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
          marginBottom: 50,
        }}
      >
        <span style={{ fontSize: 22, color: colors.textMuted }}>Part 4</span>
        <br />
        <span style={{ fontSize: 38, fontWeight: 700, color: colors.text }}>
          架构总结
        </span>
      </div>

      {/* 架构流程图 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 60,
        }}
      >
        {ARCHITECTURE_STEPS.map((step, i) => {
          const springVal = stepSprings[i];
          const opacity = Math.max(0, springVal);

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  width: 200,
                  height: 220,
                  backgroundColor: colors.backgroundCard,
                  borderRadius: 16,
                  border: `2px solid ${step.color}`,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  opacity,
                  transform: `translateY(${(1 - opacity) * 40}px) scale(${0.9 + opacity * 0.1})`,
                  boxShadow: `0 0 30px ${step.color}20`,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{step.icon}</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: step.color,
                    fontFamily: "'Fira Code', monospace",
                    marginBottom: 4,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: colors.textMuted,
                    marginBottom: 12,
                  }}
                >
                  {step.sublabel}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: colors.textDark,
                    lineHeight: 1.5,
                  }}
                >
                  {step.desc}
                </div>
              </div>

              {/* 箭头 */}
              {i < ARCHITECTURE_STEPS.length - 1 && (
                <div
                  style={{
                    fontSize: 32,
                    color: colors.textDark,
                    opacity: stepSprings[i + 1],
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 循环箭头 */}
      <div
        style={{
          marginBottom: 50,
          opacity: stepSprings[ARCHITECTURE_STEPS.length - 1],
        }}
      >
        <svg width="600" height="60" viewBox="0 0 600 60">
          <defs>
            <marker
              id="arch-arrow"
              markerWidth="10"
              markerHeight="8"
              refX="9"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 10 4, 0 8" fill={colors.textDark} />
            </marker>
          </defs>
          <path
            d="M 50 50 Q 300 0 550 50"
            fill="none"
            stroke={colors.textDark}
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd="url(#arch-arrow)"
          />
        </svg>
        <div
          style={{
            textAlign: 'center',
            fontSize: 14,
            color: colors.textMuted,
          }}
        >
          循环执行直到任务完成
        </div>
      </div>

      {/* 金句 */}
      <div
        style={{
          textAlign: 'center',
          opacity: quoteOpacity,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: colors.accent,
            fontStyle: 'italic',
            textShadow: `0 0 40px ${colors.accent}40`,
          }}
        >
          Agent 通用母板
        </div>
      </div>
    </AbsoluteFill>
  );
};
