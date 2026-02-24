/**
 * Agent Loop 三节点循环图组件
 * 三个步骤：「组装上下文」→「调 LLM」→「执行工具」形成环形
 * 出口：「LLM 说做完了 → 退出」
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { SPRING_PRESETS } from '../lib/motion';

const STEPS = [
  { label: '组装上下文', sublabel: 'Build Messages', color: colors.primary },
  { label: '调 LLM', sublabel: 'Call LLM', color: colors.accent },
  { label: '执行工具', sublabel: 'Execute Tools', color: colors.success },
];

interface CycleDiagramProps {
  highlightedStep?: number;
  showExit?: boolean;
  progress?: number;
  animateFlow?: boolean;
  maxWidth?: number;
  minWidth?: number;
  style?: React.CSSProperties;
}

export const CycleDiagram: React.FC<CycleDiagramProps> = ({
  highlightedStep = -1,
  showExit = true,
  progress = 1,
  animateFlow = false,
  maxWidth = 700,
  minWidth = 520,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: SPRING_PRESETS.soft,
  });

  const flowIndex = animateFlow ? Math.floor((frame / 36) % 3) : -1;

  // Flowing dash animation for connecting lines
  const dashOffset = animateFlow ? -(frame % 60) * 0.4 : 0;
  const flowOpacity = animateFlow ? 0.7 + Math.sin(frame * 0.1) * 0.2 : 1;

  // 放大到 700x620 以填满画面
  const W = maxWidth;
  const H = 620;
  const cx = W / 2;
  const cy = 260;
  const radius = 200;
  const positions = STEPS.map((_, i) => {
    const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const nodeW = 200;
  const nodeH = 88;
  const exitLineStartX = positions[1].x + nodeW / 2 + 8;
  const isCompactExit = W <= 680;
  const exitLineEndX = Math.min(
    exitLineStartX + (isCompactExit ? 56 : 92),
    W - (isCompactExit ? 26 : 18),
  );

  return (
    <div
      style={{
        width: W,
        maxWidth: '100%',
        minWidth,
        height: H,
        position: 'relative',
        opacity: enterSpring * progress,
        ...style,
      }}
    >
      {/* SVG 连接线 */}
      <svg
        width={W}
        height={H}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="12" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill={colors.textMuted} />
          </marker>
          <marker id="arrowhead-active" markerWidth="12" markerHeight="8" refX="12" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill={colors.accent} />
          </marker>
        </defs>

        {[0, 1, 2].map((i) => {
          const from = positions[i];
          const to = positions[(i + 1) % 3];
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const offsetX = (cy - midY) * 0.35;
          const offsetY = (midX - cx) * 0.35;

          return (
            <path
              key={i}
              d={`M ${from.x} ${from.y} Q ${midX + offsetX} ${midY + offsetY} ${to.x} ${to.y}`}
              fill="none"
              stroke={colors.textDark}
              strokeWidth={2.5}
              strokeDasharray="8 5"
              strokeDashoffset={dashOffset}
              markerEnd="url(#arrowhead)"
              style={{ opacity: flowOpacity }}
            />
          );
        })}

        <circle
          cx={cx}
          cy={cy}
          r={radius + 24}
          fill="none"
          stroke={colors.accent}
          strokeOpacity={0.28}
          strokeWidth={2}
          strokeDasharray="9 7"
        />

        {showExit && (
          <line
            x1={exitLineStartX}
            y1={positions[1].y}
            x2={exitLineEndX}
            y2={positions[1].y}
            stroke={colors.success}
            strokeWidth={3}
            markerEnd="url(#arrowhead)"
          />
        )}
      </svg>

      {/* 三个节点 */}
      {STEPS.map((step, i) => {
        const pos = positions[i];
        const isHighlighted = i === highlightedStep;
        const isFlowingNode = animateFlow && flowIndex === i;
        const nodeOpacity = highlightedStep >= 0 && !isHighlighted ? 0.5 : 1;
        const nodeGlow = isFlowingNode
          ? 18 + Math.sin(frame * 0.14) * 7
          : 0;
        const nodeScale = isFlowingNode
          ? 1.02 + Math.sin(frame * 0.14) * 0.015
          : 1;
        const borderColor = isHighlighted || isFlowingNode
          ? step.color
          : colors.border;
        const bgColor = isHighlighted || isFlowingNode
          ? `${step.color}25`
          : 'rgba(22, 22, 42, 0.9)';
        const titleColor = isHighlighted || isFlowingNode
          ? step.color
          : colors.text;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x - nodeW / 2,
              top: pos.y - nodeH / 2,
              width: nodeW,
              height: nodeH,
              borderRadius: 14,
              backgroundColor: bgColor,
              border: `2px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: nodeOpacity,
              boxShadow: isHighlighted || isFlowingNode
                ? `0 0 ${nodeGlow}px ${step.color}55`
                : 'none',
              transform: `scale(${nodeScale})`,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: titleColor,
                fontFamily: fontStack,
              }}
            >
              {step.label}
            </div>
            <div
              style={{
                fontSize: 16,
                color: colors.textDark,
                fontFamily: fontStack,
                marginTop: 2,
              }}
            >
              {step.sublabel}
            </div>
          </div>
        );
      })}

      {/* 退出标签 */}
      {showExit && (
        <div
          style={{
            position: 'absolute',
            right: isCompactExit ? 18 : 12,
            top: isCompactExit
              ? positions[1].y + nodeH / 2 + 10
              : positions[1].y - 28,
            fontSize: isCompactExit ? 17 : 20,
            color: colors.success,
            fontFamily: fontStack,
            whiteSpace: isCompactExit ? 'normal' : 'nowrap',
            lineHeight: isCompactExit ? 1.25 : 1.2,
            fontWeight: 600,
            textAlign: 'right',
            maxWidth: isCompactExit ? 120 : 'none',
          }}
        >
          做完了
          <br />
          → 退出循环
        </div>
      )}
    </div>
  );
};
