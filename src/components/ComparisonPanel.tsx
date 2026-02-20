/**
 * ChatBot vs Agent 左右对比组件
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

interface ComparisonPanelProps {
  enterDelay?: number;
  style?: React.CSSProperties;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  enterDelay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const chatbotTryOpacity = interpolate(
    frame, [enterDelay + 20, enterDelay + 35], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const chatbotFailOpacity = interpolate(
    frame, [enterDelay + 50, enterDelay + 65], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const agentTry1Opacity = interpolate(
    frame, [enterDelay + 30, enterDelay + 45], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const agentFail1Opacity = interpolate(
    frame, [enterDelay + 55, enterDelay + 70], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const agentRetryOpacity = interpolate(
    frame, [enterDelay + 80, enterDelay + 95], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const agentSuccessOpacity = interpolate(
    frame, [enterDelay + 100, enterDelay + 115], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const quoteOpacity = interpolate(
    frame, [enterDelay + 130, enterDelay + 150], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 50,
        opacity: enterSpring,
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 60 }}>
        {/* ChatBot 列 */}
        <div
          style={{
            width: 520,
            padding: 36,
            backgroundColor: 'rgba(22, 22, 42, 0.8)',
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.textMuted, fontFamily: fontStack, marginBottom: 12, textAlign: 'center' }}>
            ChatBot
          </div>
          <div style={{ fontSize: 22, color: colors.textMuted, fontFamily: fontStack, textAlign: 'center', marginBottom: 24 }}>
            闭卷考试，一次定生死
          </div>
          <div style={{ opacity: chatbotTryOpacity }}>
            <StepRow label="尝试回答" status="pending" />
          </div>
          <div style={{ opacity: chatbotFailOpacity, marginTop: 12 }}>
            <StepRow label="结果不理想" status="error" />
            <div style={{ marginTop: 16, fontSize: 22, color: colors.error, fontFamily: fontStack, textAlign: 'center' }}>
              没有重试机会
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div style={{ width: 3, backgroundColor: colors.border, alignSelf: 'stretch' }} />

        {/* Agent 列 */}
        <div
          style={{
            width: 520,
            padding: 36,
            backgroundColor: 'rgba(22, 22, 42, 0.8)',
            borderRadius: 16,
            border: `1px solid ${colors.accent}30`,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.accent, fontFamily: fontStack, marginBottom: 12, textAlign: 'center' }}>
            Agent Loop
          </div>
          <div style={{ fontSize: 22, color: colors.textMuted, fontFamily: fontStack, textAlign: 'center', marginBottom: 24 }}>
            开卷考试，打草稿、查资料
          </div>
          <div style={{ opacity: agentTry1Opacity }}>
            <StepRow label="第1次尝试" status="pending" />
          </div>
          <div style={{ opacity: agentFail1Opacity, marginTop: 10 }}>
            <StepRow label="遇到错误" status="error" />
          </div>
          <div style={{ opacity: agentRetryOpacity, marginTop: 10 }}>
            <StepRow label="自动重试" status="pending" />
          </div>
          <div style={{ opacity: agentSuccessOpacity, marginTop: 10 }}>
            <StepRow label="成功完成" status="success" />
          </div>
        </div>
      </div>

      {/* 金句 */}
      <div
        style={{
          opacity: quoteOpacity,
          fontSize: 36,
          fontWeight: 700,
          color: colors.accent,
          fontFamily: fontStack,
          textAlign: 'center',
        }}
      >
        ChatBot 聊一轮就结束，Agent 是跑 N 轮，直到把事儿办成
      </div>
    </div>
  );
};

const StepRow: React.FC<{
  label: string;
  status: 'pending' | 'success' | 'error';
}> = ({ label, status }) => {
  const statusConfig = {
    pending: { color: colors.textMuted, icon: '○' },
    success: { color: colors.success, icon: '✓' },
    error: { color: colors.error, icon: '✗' },
  };
  const { color, icon } = statusConfig[status];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 18px',
        borderRadius: 8,
        backgroundColor:
          status === 'success'
            ? `${colors.success}10`
            : status === 'error'
              ? `${colors.error}10`
              : 'transparent',
      }}
    >
      <span style={{ color, fontSize: 24, fontWeight: 700 }}>{icon}</span>
      <span
        style={{
          fontSize: 22,
          color: status === 'pending' ? colors.text : color,
          fontFamily: fontStack,
        }}
      >
        {label}
      </span>
    </div>
  );
};
