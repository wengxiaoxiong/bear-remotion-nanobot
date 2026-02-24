/**
 * 五层管线图组件
 * 复用 EP1 管线概念：消息接收 → 预处理 → Agent Loop → 后处理 → 发送回复
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { SPRING_PRESETS } from '../lib/motion';

const PIPELINE_LAYERS = [
  { label: '消息接收', sublabel: 'Telegram / 飞书', color: colors.info },
  { label: '预处理', sublabel: '解析意图', color: colors.primaryLight },
  { label: 'Agent Loop', sublabel: '核心循环', color: colors.accent },
  { label: '后处理', sublabel: '格式化输出', color: colors.primaryLight },
  { label: '发送回复', sublabel: '回到用户', color: colors.info },
];

interface PipelineDiagramProps {
  highlightedLayer?: number;
  pulseLayer?: number;
  flowStrength?: 'off' | 'subtle';
  opacity?: number;
  maxWidth?: number;
  minWidth?: number;
  contentPadding?: string;
  style?: React.CSSProperties;
}

export const PipelineDiagram: React.FC<PipelineDiagramProps> = ({
  highlightedLayer = -1,
  pulseLayer = -1,
  flowStrength = 'subtle',
  opacity = 1,
  maxWidth = 480,
  minWidth = 360,
  contentPadding = '0 28px',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame,
    fps,
    config: SPRING_PRESETS.soft,
  });
  // Enhanced flowing animation with smoother easing
  const flowCycle = (frame % 60) / 60;
  const flowOffset = flowStrength === 'off' ? 0 : -flowCycle * 20;
  const flowOpacity = flowStrength === 'off' ? 0.58 : 0.75 + Math.sin(frame * 0.1) * 0.15;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        opacity: opacity * enterProgress,
        transform: `scale(${0.9 + enterProgress * 0.1})`,
        width: '100%',
        maxWidth,
        minWidth,
        ...style,
      }}
    >
      {PIPELINE_LAYERS.map((layer, i) => {
        const isHighlighted = i === highlightedLayer;
        const isPulsing = i === pulseLayer;
        const layerOpacity = highlightedLayer >= 0 && !isHighlighted ? 0.45 : 1;

        const pulseScale = isPulsing
          ? 1 + Math.sin(frame * 0.12) * 0.03
          : 1;
        const pulseGlow = isPulsing
          ? 12 + Math.sin(frame * 0.12) * 8
          : 0;
        const pulseBorderWidth = isPulsing
          ? 2 + Math.sin(frame * 0.12) * 1
          : 2;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                height: 76,
                borderRadius: 12,
                backgroundColor: isHighlighted || isPulsing
                  ? `${layer.color}30`
                  : 'rgba(22, 22, 42, 0.6)',
                border: `${pulseBorderWidth}px solid ${isHighlighted || isPulsing ? layer.color : colors.border}`,
                display: 'flex',
                alignItems: 'center',
                padding: contentPadding,
                gap: 16,
                opacity: layerOpacity,
                transform: `scale(${pulseScale})`,
                boxShadow: pulseGlow > 0
                  ? `0 0 ${pulseGlow}px ${layer.color}60`
                  : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: isHighlighted || isPulsing ? layer.color : colors.text,
                  fontFamily: fontStack,
                }}
              >
                {layer.label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: colors.textMuted,
                  fontFamily: fontStack,
                }}
              >
                {layer.sublabel}
              </div>
            </div>
            {i < PIPELINE_LAYERS.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: layerOpacity,
                  height: 26,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 16,
                    backgroundImage:
                      'repeating-linear-gradient(90deg, transparent 0 4px, currentColor 4px 10px, transparent 10px 14px)',
                    color: colors.primaryLight,
                    transform: 'rotate(90deg)',
                    backgroundPositionX: `${flowOffset}px`,
                    opacity: flowOpacity,
                    borderRadius: 3,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
