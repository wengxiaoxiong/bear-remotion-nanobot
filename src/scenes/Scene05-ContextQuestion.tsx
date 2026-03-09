/**
 * Scene05-ContextQuestion
 * 标题「Agent 每次看到什么？」
 * 左侧：Workspace 文件树
 * 右侧：System Prompt 四层预览
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { FadeIn } from '../components/FadeIn';
import { SystemPromptStack } from '../components/SystemPromptStack';

const FILE_TREE = [
  { name: 'workspace/', indent: 0, isDir: true },
  { name: 'AGENTS.md', indent: 1, isDir: false },
  { name: 'SOUL.md', indent: 1, isDir: false },
  { name: 'USER.md', indent: 1, isDir: false },
  { name: 'MEMORY.md', indent: 1, isDir: false },
  { name: 'skills/', indent: 1, isDir: true },
  { name: 'deep-research/', indent: 2, isDir: true },
  { name: 'ppt-maker/', indent: 2, isDir: true },
];

export const Scene05ContextQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const visibleLayers = interpolate(frame, [30, 80], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 15}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 66,
            fontWeight: 800,
            color: colors.text,
            margin: 0,
          }}
        >
          Agent 每次
          <span style={{ color: colors.accent }}>「看到」</span>
          什么？
        </h2>
      </div>

      {/* 内容区 */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 0,
          right: 0,
          bottom: 50,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 70,
        }}
      >
        {/* 左侧：文件树 */}
        <FadeIn delay={10} direction="up">
          <div
            style={{
              backgroundColor: colors.backgroundCard,
              borderRadius: 18,
              padding: '32px 42px',
              border: `1px solid ${colors.border}`,
              minWidth: 500,
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: colors.textDark,
                marginBottom: 20,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              Workspace 文件树
            </div>
            {FILE_TREE.map((item, i) => {
              const itemDelay = 15 + i * 4;
              const itemOpacity = interpolate(
                frame,
                [itemDelay, itemDelay + 8],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              );
              const itemX = interpolate(
                frame,
                [itemDelay, itemDelay + 8],
                [-20, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
              );
              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: item.indent * 28,
                    fontSize: 28,
                    lineHeight: 2.1,
                    color: item.isDir ? colors.primaryLight : colors.text,
                    fontFamily: "'Fira Code', monospace",
                    opacity: itemOpacity,
                    transform: `translate3d(${itemX}px, 0, 0)`,
                  }}
                >
                  <span style={{ marginRight: 10 }}>
                    {item.isDir ? '📁' : '📄'}
                  </span>
                  {item.name}
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* 中间箭头 */}
        <FadeIn delay={25}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 170,
            }}
          >
            <span style={{ 
              color: colors.accent, 
              fontSize: 60,
              opacity: 0.7 + Math.sin(frame * 0.1) * 0.3,
              transform: `scale(${1 + Math.sin(frame * 0.08) * 0.05})`,
            }}>→</span>
          </div>
        </FadeIn>

        {/* 右侧：System Prompt Stack */}
        <FadeIn delay={20} direction="up">
          <div style={{ marginTop: 20 }}>
            <SystemPromptStack
              visibleLayers={Math.floor(visibleLayers)}
            />
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
};
