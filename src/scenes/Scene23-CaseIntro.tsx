/**
 * Scene23-CaseIntro: 案例引入
 * 模拟 Telegram 消息气泡，用户发出指令
 * 540帧/18秒
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

export const Scene23CaseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // 消息气泡入场
  const bubbleSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 底部提问
  const questionOpacity = interpolate(frame, [360, 390], [0, 1], {
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
          marginBottom: 80,
        }}
      >
        <span style={{ fontSize: 22, color: colors.textMuted }}>Part 3</span>
        <br />
        <span style={{ fontSize: 38, fontWeight: 700, color: colors.text }}>
          完整走一遍 —— 从调研到交付
        </span>
      </div>

      {/* Telegram 风格消息区域 */}
      <div
        style={{
          width: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        {/* 用户头像 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            opacity: bubbleSpring,
            transform: `translateY(${(1 - bubbleSpring) * 40}px)`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            👤
          </div>

          {/* 消息气泡 */}
          <div
            style={{
              backgroundColor: colors.primary,
              borderRadius: '20px 20px 20px 4px',
              padding: '20px 24px',
              maxWidth: 600,
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: colors.text,
                lineHeight: 1.6,
              }}
            >
              帮我调研下 AI Agent 最新进展，做个 PPT，发到群里
            </div>
            <div
              style={{
                fontSize: 14,
                color: `${colors.text}80`,
                marginTop: 8,
                textAlign: 'right',
              }}
            >
              刚刚
            </div>
          </div>
        </div>

        {/* Agent 回复 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            alignSelf: 'flex-end',
            opacity: interpolate(frame, [180, 210], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `translateY(${interpolate(
              frame,
              [180, 210],
              [20, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )}px)`,
          }}
        >
          {/* 消息气泡 */}
          <div
            style={{
              backgroundColor: colors.backgroundCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '20px 20px 4px 20px',
              padding: '20px 24px',
              maxWidth: 600,
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: colors.accent,
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            >
              🤖 收到，我来处理...
            </div>
          </div>

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            🤖
          </div>
        </div>
      </div>

      {/* 底部提问 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          textAlign: 'center',
          opacity: questionOpacity,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: colors.textMuted,
            fontStyle: 'italic',
          }}
        >
          几轮循环？用了什么工具？
        </div>
      </div>
    </AbsoluteFill>
  );
};
