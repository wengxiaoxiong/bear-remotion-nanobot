/**
 * Scene22-DeliveryNotChat: 金句场景
 * 「不是帮你聊两句，而是帮你做交付」
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

const TOOLS = [
  { icon: '📖', name: 'read_file', color: colors.primary },
  { icon: '✏️', name: 'write_file', color: colors.primary },
  { icon: '🗂️', name: 'list_dir', color: colors.primary },
  { icon: '📁', name: 'search_files', color: colors.primary },
  { icon: '💻', name: 'exec', color: colors.accent },
  { icon: '🔍', name: 'web_search', color: colors.info },
  { icon: '🌐', name: 'web_fetch', color: colors.info },
  { icon: '💬', name: 'message', color: colors.warning },
  { icon: '🔄', name: 'delegate', color: colors.success },
];

export const Scene22DeliveryNotChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 金句入场
  const quoteSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 背景网格渐入
  const gridOpacity = interpolate(frame, [0, 60], [0, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 底部小字
  const footerOpacity = interpolate(frame, [180, 210], [0, 1], {
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
      {/* 背景九宫格（模糊） */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 180px)',
          gridTemplateRows: 'repeat(3, 100px)',
          gap: 16,
          opacity: gridOpacity,
          filter: 'blur(4px)',
        }}
      >
        {TOOLS.map((tool, i) => (
          <div
            key={i}
            style={{
              backgroundColor: `${tool.color}10`,
              borderRadius: 12,
              border: `1px solid ${tool.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            {tool.icon}
          </div>
        ))}
      </div>

      {/* 金句 */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 10,
          opacity: quoteSpring,
          transform: `scale(${0.9 + quoteSpring * 0.1})`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: colors.accent,
            textShadow: `0 0 40px ${colors.accent}50`,
            lineHeight: 1.4,
          }}
        >
          不是帮你聊两句
          <br />
          而是帮你做交付
        </div>
      </div>

      {/* 底部小字提醒 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          textAlign: 'center',
          opacity: footerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: colors.textDark,
          }}
        >
          生产环境 → 沙盒隔离
        </div>
      </div>
    </AbsoluteFill>
  );
};
