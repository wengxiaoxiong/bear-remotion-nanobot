/**
 * 四层 System Prompt 堆叠可视化组件
 */

import React from 'react';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

interface LayerConfig {
  label: string;
  sublabel: string;
  color: string;
  icon: string;
}

const LAYERS: LayerConfig[] = [
  { label: '身份 Identity', sublabel: '我是谁？在哪？', color: colors.primary, icon: '🪪' },
  { label: '规范 Bootstrap', sublabel: '行为 / 人格 / 偏好', color: colors.accent, icon: '📋' },
  { label: '记忆 Memory', sublabel: 'MEMORY.md', color: colors.warning, icon: '🧠' },
  { label: '技能 Skills', sublabel: '能力摘要', color: colors.success, icon: '🛠' },
];

interface SystemPromptStackProps {
  visibleLayers: number;
  compact?: boolean;
  style?: React.CSSProperties;
}

export const SystemPromptStack: React.FC<SystemPromptStackProps> = ({
  visibleLayers,
  compact = false,
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 6 : 14,
        width: 520,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 22,
          color: colors.textMuted,
          fontFamily: fontStack,
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        System Prompt
      </div>

      {LAYERS.map((layer, i) => {
        const isVisible = i < visibleLayers;
        const opacity = isVisible ? 1 : 0.15;
        const height = compact ? 52 : 80;

        return (
          <div
            key={i}
            style={{
              height,
              borderLeft: `5px solid ${layer.color}`,
              backgroundColor: isVisible
                ? `${layer.color}18`
                : 'rgba(22, 22, 42, 0.4)',
              borderRadius: 10,
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity,
            }}
          >
            <span style={{ fontSize: compact ? 24 : 32 }}>{layer.icon}</span>
            <div>
              <div
                style={{
                  fontSize: compact ? 20 : 24,
                  fontWeight: 600,
                  color: layer.color,
                  fontFamily: fontStack,
                }}
              >
                {layer.label}
              </div>
              {!compact && (
                <div
                  style={{
                    fontSize: 18,
                    color: colors.textMuted,
                    fontFamily: fontStack,
                  }}
                >
                  {layer.sublabel}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
