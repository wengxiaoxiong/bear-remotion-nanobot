/**
 * Scene04-PipelineReview
 * 上下布局适配 16:9：
 *   上方标题
 *   中间：左侧管线图 + 右侧循环图 水平居中
 *   下方标注
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { PipelineDiagram } from '../components/PipelineDiagram';
import { CycleDiagram } from '../components/CycleDiagram';
import { FadeIn } from '../components/FadeIn';
import {
  LAYOUT_BANDS,
  LAYOUT_GAP,
  LAYOUT_SAFE_MARGIN,
  MOTION_DURATION,
  MOTION_EASING,
  MOTION_STAGGER,
  SPRING_PRESETS,
} from '../lib/motion';

export const Scene04PipelineReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cycleSpring = spring({
    frame: frame - (10 + MOTION_STAGGER.md),
    fps,
    config: SPRING_PRESETS.soft,
  });

  const arrowOpacity = interpolate(frame, [15, 15 + MOTION_DURATION.enterNormal], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: MOTION_EASING.standard,
  });
  const arrowY = Math.round((1 - arrowOpacity) * 16);
  
  // Arrow breathing animation
  const arrowBreathing = 1 + Math.sin(frame * 0.1) * 0.05;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
      }}
    >
      {/* 顶部标题 */}
      <div
        style={{
          position: 'absolute',
          top: LAYOUT_BANDS.top.top,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <FadeIn delay={0} duration={MOTION_DURATION.enterNormal}>
          <span style={{ fontSize: 28, color: colors.textDark }}>Part 1A</span>
          <h2
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: colors.text,
              margin: '10px 0 0',
            }}
          >
            三步构成一个
            <span style={{ color: colors.accent }}>循环</span>
          </h2>
        </FadeIn>
      </div>

      {/* 中间内容区：管线图 + 箭头 + 循环图 */}
      <div
        style={{
          position: 'absolute',
          top: LAYOUT_BANDS.main.top,
          left: LAYOUT_SAFE_MARGIN.x,
          right: LAYOUT_SAFE_MARGIN.x,
          bottom: LAYOUT_BANDS.main.bottom,
          display: 'grid',
          gridTemplateColumns: '42% 16% 42%',
          alignItems: 'center',
          columnGap: LAYOUT_GAP.md,
          maxWidth: 1520,
          margin: '0 auto',
        }}
      >
        {/* 管线图 */}
        <PipelineDiagram
          highlightedLayer={2}
          flowStrength="subtle"
          maxWidth={620}
          minWidth={460}
          style={{ width: '100%', justifySelf: 'center' }}
        />

        {/* 连接箭头 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            opacity: arrowOpacity,
            transform: `translate3d(0, ${arrowY}px, 0) scale(${arrowBreathing})`,
          }}
        >
          <div
            style={{
              width: 96,
              height: 4,
              backgroundColor: colors.primaryLight,
              borderRadius: 2,
              boxShadow: `0 0 14px ${colors.primaryLight}55`,
            }}
          />
          <span style={{ color: colors.primaryLight, fontSize: 44 }}>→</span>
          <span style={{ fontSize: 24, color: colors.text, opacity: 0.86 }}>展开</span>
        </div>

        {/* 循环图 */}
        <div
          style={{
            opacity: cycleSpring,
            transform: `translate3d(${Math.round((1 - cycleSpring) * 24)}px, 0, 0)`,
            justifySelf: 'center',
          }}
        >
          <CycleDiagram
            highlightedStep={-1}
            showExit={true}
            animateFlow={frame > 40}
            maxWidth={640}
            minWidth={500}
            style={{ transform: 'scale(1.03)', transformOrigin: 'center center' }}
          />
        </div>
      </div>

      <FadeIn delay={25} duration={MOTION_DURATION.enterNormal} direction="up">
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: LAYOUT_BANDS.bottom.bottom,
            textAlign: 'center',
            fontSize: 32,
            color: colors.textMuted,
          }}
        >
          不是线性流程，而是「判断 - 行动 - 反馈」的闭环
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};
