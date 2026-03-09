/**
 * 单层上下文卡片组件
 * 用于 System Prompt 四层可视化中的每一层
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

interface ContextLayerProps {
  label: string;
  sublabel: string;
  color: string;
  progress: number;
  details: string[];
  digestText?: string;
  digestProgress?: number;
  icon?: string;
  style?: React.CSSProperties;
}

export const ContextLayer: React.FC<ContextLayerProps> = ({
  label,
  sublabel,
  color,
  progress,
  details,
  digestText,
  digestProgress = 0,
  icon,
  style,
}) => {
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(progress, [0, 0.5], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const detailsOpacity = interpolate(progress, [0.3, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        borderLeft: `4px solid ${color}`,
        backgroundColor: 'rgba(22, 22, 42, 0.9)',
        borderRadius: 8,
        padding: '16px 24px',
        marginBottom: 12,
        ...style,
      }}
    >
      {/* 标题行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon && (
          <span style={{ fontSize: 24 }}>{icon}</span>
        )}
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color,
              fontFamily: fontStack,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 15,
              color: colors.textMuted,
              fontFamily: fontStack,
            }}
          >
            {sublabel}
          </div>
        </div>
      </div>

      {/* 详情标签 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 12,
          opacity: detailsOpacity,
        }}
      >
        {details.map((detail, i) => {
          const detailDelay = interpolate(progress, [0.4 + i * 0.08, 0.5 + i * 0.08], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                fontSize: 14,
                color: colors.text,
                backgroundColor: `${color}20`,
                border: `1px solid ${color}40`,
                borderRadius: 4,
                fontFamily: fontStack,
                opacity: detailDelay,
                transform: `translateY(${(1 - detailDelay) * 10}px)`,
              }}
            >
              {detail}
            </span>
          );
        })}
      </div>

      {/* 消化句 */}
      {digestText && (
        <div
          style={{
            marginTop: 10,
            fontSize: 16,
            color: colors.accent,
            fontFamily: fontStack,
            fontStyle: 'italic',
            opacity: digestProgress,
            transform: `translateY(${(1 - digestProgress) * 8}px)`,
          }}
        >
          {digestText}
        </div>
      )}
    </div>
  );
};

/**
 * 带动画控制的上下文层
 * 自动根据 frame 计算 progress
 */
interface AnimatedContextLayerProps {
  label: string;
  sublabel: string;
  color: string;
  details: string[];
  digestText?: string;
  icon?: string;
  enterFrame: number;
  duration: number;
  style?: React.CSSProperties;
}

export const AnimatedContextLayer: React.FC<AnimatedContextLayerProps> = ({
  label,
  sublabel,
  color,
  details,
  digestText,
  icon,
  enterFrame,
  duration,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springProgress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const digestProgress = digestText
    ? interpolate(
        frame,
        [enterFrame + duration * 0.6, enterFrame + duration * 0.8],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 0;

  return (
    <ContextLayer
      label={label}
      sublabel={sublabel}
      color={color}
      progress={springProgress}
      details={details}
      digestText={digestText}
      digestProgress={digestProgress}
      icon={icon}
      style={style}
    />
  );
};
