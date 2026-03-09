/**
 * Scene35-OSLevelValue: OS-level Agent 价值总结
 * 三行并列：「读你的文件」「用你的工具」「记你的偏好」
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

const VALUES = [
  {
    icon: '📁',
    title: '读你的文件',
    desc: '直接访问本地文件系统\n无需上传下载',
    color: colors.primary,
  },
  {
    icon: '🛠️',
    title: '用你的工具',
    desc: '调用你已安装的软件\nGit、Docker、Python...',
    color: colors.accent,
  },
  {
    icon: '🧠',
    title: '记你的偏好',
    desc: '记住你的习惯和风格\n越用越懂你',
    color: colors.success,
  },
];

export const Scene35OSLevelValue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 三行依次入场
  const valueSprings = VALUES.map((_, i) =>
    spring({
      frame: frame - 40 - i * 30,
      fps,
      config: { damping: 12, stiffness: 150 },
    })
  );

  // 金句
  const quoteOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 小字提醒
  const footerOpacity = interpolate(frame, [240, 270], [0, 1], {
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
      {/* 三行并列 */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginBottom: 60,
        }}
      >
        {VALUES.map((value, i) => {
          const springVal = valueSprings[i];
          const opacity = Math.max(0, springVal);

          return (
            <div
              key={i}
              style={{
                width: 280,
                height: 320,
                backgroundColor: colors.backgroundCard,
                borderRadius: 20,
                border: `2px solid ${value.color}40`,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity,
                transform: `translateY(${(1 - opacity) * 50}px)`,
                boxShadow: `0 0 30px ${value.color}15`,
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 20 }}>{value.icon}</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: value.color,
                  marginBottom: 20,
                }}
              >
                {value.title}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: colors.textMuted,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}
              >
                {value.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* 金句 */}
      <div
        style={{
          textAlign: 'center',
          opacity: quoteOpacity,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: colors.accent,
            textShadow: `0 0 40px ${colors.accent}40`,
          }}
        >
          OS-level Agent {'>'} 云端沙箱
        </div>
      </div>

      {/* 小字提醒 */}
      <div
        style={{
          textAlign: 'center',
          opacity: footerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: colors.textDark,
            fontStyle: 'italic',
          }}
        >
          生产环境 → 沙盒
        </div>
      </div>
    </AbsoluteFill>
  );
};
