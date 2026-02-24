/**
 * Scene33-CaseReview: 案例回顾
 * 七轮循环全景回放，高亮红色失败和绿色重试
 * 450帧/15秒
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

const ROUNDS = [
  { round: 1, tool: 'read_file', status: 'success' as const },
  { round: 2, tool: 'web_search', status: 'success' as const },
  { round: 3, tool: 'web_fetch', status: 'error' as const },
  { round: 4, tool: 'web_fetch', status: 'success' as const },
  { round: 5, tool: 'read_file', status: 'success' as const },
  { round: 6, tool: 'exec', status: 'success' as const },
  { round: 7, tool: 'message', status: 'success' as const },
];

export const Scene33CaseReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // 循环进度条
  const progressProgress = interpolate(frame, [60, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 金句
  const quoteOpacity = interpolate(frame, [280, 340], [0, 1], {
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
      {/* 标题 */}
      <div
        style={{
          textAlign: 'center',
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
          marginBottom: 60,
        }}
      >
        <span style={{ fontSize: 22, color: colors.textMuted }}>案例回顾</span>
        <br />
        <span style={{ fontSize: 38, fontWeight: 700, color: colors.text }}>
          七轮循环全景
        </span>
      </div>

      {/* 七轮循环可视化 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 60,
        }}
      >
        {ROUNDS.map((round, i) => {
          const delay = i * 25;
          const itemSpring = spring({
            frame: frame - 30 - delay,
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          const statusColor =
            round.status === 'error' ? colors.error : colors.success;
          const isError = round.status === 'error';
          const isRetry = i === 3;

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  opacity: itemSpring,
                  transform: `scale(${0.8 + itemSpring * 0.2})`,
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: `${statusColor}15`,
                    border: `3px solid ${statusColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    boxShadow: isError
                      ? `0 0 30px ${colors.error}50`
                      : isRetry
                        ? `0 0 30px ${colors.success}50`
                        : 'none',
                    animation: isError
                      ? 'pulse 1s infinite'
                      : undefined,
                  }}
                >
                  {isError ? '✗' : '✓'}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: colors.textMuted,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  R{round.round}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: statusColor,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {round.tool}
                </div>

                {/* 重试标注 */}
                {isRetry && (
                  <div
                    style={{
                      position: 'absolute',
                      marginTop: -120,
                      padding: '6px 12px',
                      backgroundColor: `${colors.success}20`,
                      borderRadius: 4,
                      fontSize: 12,
                      color: colors.success,
                      fontWeight: 700,
                    }}
                  >
                    自动重试
                  </div>
                )}
              </div>

              {/* 连接线 */}
              {i < ROUNDS.length - 1 && (
                <div
                  style={{
                    width: 30,
                    height: 3,
                    backgroundColor: colors.border,
                    opacity: itemSpring,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 进度条 */}
      <div
        style={{
          width: 800,
          height: 8,
          backgroundColor: colors.backgroundCard,
          borderRadius: 4,
          marginBottom: 40,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressProgress * 100}%`,
            background: `linear-gradient(90deg, ${colors.success}, ${colors.accent})`,
            borderRadius: 4,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* 统计信息 */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          marginBottom: 40,
        }}
      >
        <StatItem label="总轮次" value="7" color={colors.text} />
        <StatItem label="成功" value="6" color={colors.success} />
        <StatItem label="失败重试" value="1" color={colors.error} />
        <StatItem label="用户追问" value="0" color={colors.accent} />
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
            fontSize: 36,
            fontWeight: 800,
            color: colors.accent,
            fontStyle: 'italic',
            textShadow: `0 0 40px ${colors.accent}40`,
          }}
        >
          一条消息，七轮循环，零次追问
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 统计项
const StatItem: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 16,
          color: colors.textMuted,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
};
