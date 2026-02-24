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
  opacity?: number;
  style?: React.CSSProperties;
}

export const PipelineDiagram: React.FC<PipelineDiagramProps> = ({
  highlightedLayer = -1,
  pulseLayer = -1,
  opacity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame,
    fps,
    config: SPRING_PRESETS.soft,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        opacity: opacity * enterProgress,
        transform: `scale(${0.9 + enterProgress * 0.1})`,
        width: 480,
        ...style,
      }}
    >
      {PIPELINE_LAYERS.map((layer, i) => {
        const isHighlighted = i === highlightedLayer;
        const isPulsing = i === pulseLayer;
        const layerOpacity = highlightedLayer >= 0 && !isHighlighted ? 0.45 : 1;

        const pulseScale = isPulsing
          ? 1 + Math.sin(frame * 0.09) * 0.025
          : 1;
        const pulseGlow = isPulsing
          ? 8 + Math.sin(frame * 0.09) * 6
          : 0;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                height: 76,
                borderRadius: 12,
                backgroundColor: isHighlighted || isPulsing
                  ? `${layer.color}30`
                  : 'rgba(22, 22, 42, 0.6)',
                border: `2px solid ${isHighlighted || isPulsing ? layer.color : colors.border}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 28px',
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
                  opacity: layerOpacity,
                }}
              >
                <span style={{ color: colors.textDark, fontSize: 24 }}>▼</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
