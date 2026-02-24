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
import { MOTION_DURATION, MOTION_EASING, MOTION_STAGGER, SPRING_PRESETS } from '../lib/motion';

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
  const arrowY = Math.round((1 - arrowOpacity) * 12);

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
          top: 48,
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
          top: 170,
          left: 0,
          right: 0,
          bottom: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
        }}
      >
        {/* 管线图 */}
        <PipelineDiagram
          highlightedLayer={2}
          style={{ width: 560, flexShrink: 0 }}
        />

        {/* 连接箭头 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            opacity: arrowOpacity,
            transform: `translate3d(0, ${arrowY}px, 0)`,
          }}
        >
          <div
            style={{
              width: 96,
              height: 4,
              backgroundColor: colors.accent,
              borderRadius: 2,
            }}
          />
          <span style={{ color: colors.accent, fontSize: 44 }}>→</span>
          <span style={{ fontSize: 24, color: colors.textDark }}>展开</span>
        </div>

        {/* 循环图 */}
        <div
          style={{
            opacity: cycleSpring,
            transform: `translate3d(${Math.round((1 - cycleSpring) * 24)}px, 0, 0)`,
            flexShrink: 0,
          }}
        >
          <CycleDiagram
            highlightedStep={-1}
            showExit={true}
            animateFlow={frame > 40}
            style={{ transform: 'scale(1.12)', transformOrigin: 'center center' }}
          />
        </div>
      </div>

      <FadeIn delay={25} duration={MOTION_DURATION.enterNormal} direction="up">
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 52,
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
