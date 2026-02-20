/**
 * Scene02-AgentLoopHighlight
 * 上下布局：上方管线图居中（Agent Loop 高亮脉动），下方注释文字
 * 适配 1920x1080 16:9 画面
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { PipelineDiagram } from '../components/PipelineDiagram';
import { FadeIn } from '../components/FadeIn';

export const Scene02AgentLoopHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const noteSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 120 },
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
        padding: '40px 120px 60px',
        gap: 42,
      }}
    >
      {/* 上方：管线图居中 */}
      <PipelineDiagram
        highlightedLayer={2}
        pulseLayer={2}
        style={{ width: 760 }}
      />

      {/* 下方：注释区域 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <FadeIn delay={10}>
          <div
            style={{
              fontSize: 34,
              color: colors.textMuted,
              textAlign: 'center',
            }}
          >
            上次一句话带过的「循环」——
          </div>
        </FadeIn>

        <div
          style={{
            opacity: noteSpring,
            transform: `translateY(${(1 - noteSpring) * 20}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: colors.accent,
            }}
          >
            其实是核心
          </div>
        </div>

        <FadeIn delay={35}>
          <div
            style={{
              fontSize: 31,
              color: colors.textMuted,
              textAlign: 'center',
              lineHeight: 1.7,
              marginTop: 8,
            }}
          >
            它是怎么调用工具的？它怎么跟工作区交互？
            <br />
            这一集我们把它拆开来讲。
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
};
