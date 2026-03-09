/**
 * 工具调用卡片组件
 * 展示 tool call 的名称、参数、执行结果
 */

import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { MOTION_DURATION, MOTION_EASING, SPRING_PRESETS } from '../lib/motion';

interface ToolCallBoxProps {
  toolName: string;
  args: Record<string, string>;
  result?: string;
  showResult?: boolean;
  resultStatus?: 'success' | 'error' | 'pending';
  enterDelay?: number;
  maxWidth?: number;
  minWidth?: number;
  contentPadding?: string;
  style?: React.CSSProperties;
}

export const ToolCallBox: React.FC<ToolCallBoxProps> = ({
  toolName,
  args,
  result,
  showResult = false,
  resultStatus = 'success',
  enterDelay = 0,
  maxWidth = 720,
  minWidth = 520,
  contentPadding = '24px 28px',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - enterDelay,
    fps,
    config: SPRING_PRESETS.soft,
  });

  const resultOpacity = showResult
    ? interpolate(frame, [enterDelay + 20, enterDelay + 20 + MOTION_DURATION.enterFast], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: MOTION_EASING.standard,
      })
    : 0;

  const statusColor =
    resultStatus === 'success'
      ? colors.success
      : resultStatus === 'error'
        ? colors.error
        : colors.warning;

  return (
    <div
      style={{
        backgroundColor: 'rgba(22, 22, 42, 0.95)',
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        padding: contentPadding,
        fontFamily: "'Fira Code', monospace",
        opacity: enterSpring,
        transform: `translate3d(0, ${Math.round((1 - enterSpring) * 14)}px, 0)`,
        willChange: 'opacity, transform',
        width: '100%',
        maxWidth,
        minWidth,
        ...style,
      }}
    >
      {/* 工具名称 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span
          style={{
            fontSize: 16,
            color: colors.textDark,
            fontFamily: fontStack,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}
        >
          Tool Call
        </span>
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: colors.accent,
          }}
        >
          {toolName}
        </span>
      </div>

      {/* 参数 */}
      <div
        style={{
          backgroundColor: 'rgba(15, 15, 26, 0.6)',
          borderRadius: 8,
          padding: '14px 20px',
          fontSize: 22,
          lineHeight: 1.7,
        }}
      >
        <span style={{ color: colors.textDark }}>{'{'}</span>
        {Object.entries(args).map(([key, value], i) => (
          <div key={i} style={{ paddingLeft: 24 }}>
            <span style={{ color: '#c084fc' }}>{key}</span>
            <span style={{ color: colors.textDark }}>: </span>
            <span style={{ color: '#a5d6a7' }}>"{value}"</span>
            {i < Object.entries(args).length - 1 && (
              <span style={{ color: colors.textDark }}>,</span>
            )}
          </div>
        ))}
        <span style={{ color: colors.textDark }}>{'}'}</span>
      </div>

      {/* 结果 */}
      {result && (
        <div
          style={{
            marginTop: 14,
            opacity: resultOpacity,
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 14,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: statusColor,
              fontFamily: fontStack,
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {resultStatus === 'success' ? '✓' : resultStatus === 'error' ? '✗' : '…'}
          </span>
          <span
            style={{
              fontSize: 20,
              color: resultStatus === 'error' ? colors.error : colors.text,
              lineHeight: 1.5,
            }}
          >
            {result}
          </span>
        </div>
      )}
    </div>
  );
};
