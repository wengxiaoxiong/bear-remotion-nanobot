/**
 * 分支判断节点组件
 * 菱形决策节点：「有 tool_call?」→ 是/否两条路径
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

interface BranchNodeProps {
  question?: string;
  showYes?: boolean;
  showNo?: boolean;
  yesLabel?: string;
  noLabel?: string;
  enterDelay?: number;
  style?: React.CSSProperties;
}

export const BranchNode: React.FC<BranchNodeProps> = ({
  question = '有 tool_call?',
  showYes = true,
  showNo = true,
  yesLabel = '有 → 执行工具',
  noLabel = '没有 → 退出循环，返回文本',
  enterDelay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const yesOpacity = showYes
    ? interpolate(frame, [enterDelay + 15, enterDelay + 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const noOpacity = showNo
    ? interpolate(frame, [enterDelay + 25, enterDelay + 40], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
        opacity: enterSpring,
        ...style,
      }}
    >
      {/* 菱形节点 */}
      <div
        style={{
          width: 300,
          height: 150,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: `${colors.warning}15`,
            border: `2px solid ${colors.warning}`,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: colors.warning,
            fontFamily: fontStack,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {question}
        </span>
      </div>

      {/* 分支 */}
      <div
        style={{
          display: 'flex',
          gap: 100,
          width: '100%',
          justifyContent: 'center',
          position: 'relative',
          paddingTop: 40,
        }}
      >
        {/* 分支连线与箭头 */}
        <svg
          width={760}
          height={72}
          style={{
            position: 'absolute',
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            overflow: 'visible',
            opacity: Math.max(yesOpacity, noOpacity),
          }}
        >
          <defs>
            <marker id="branch-arrow-yes" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill={colors.accent} />
            </marker>
            <marker id="branch-arrow-no" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill={colors.success} />
            </marker>
          </defs>
          <path
            d="M 380 0 Q 300 36 220 64"
            fill="none"
            stroke={colors.accent}
            strokeWidth={3}
            strokeOpacity={yesOpacity}
            markerEnd="url(#branch-arrow-yes)"
          />
          <path
            d="M 380 0 Q 460 36 540 64"
            fill="none"
            stroke={colors.success}
            strokeWidth={3}
            strokeOpacity={noOpacity}
            markerEnd="url(#branch-arrow-no)"
          />
        </svg>

        {/* 是分支 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: yesOpacity,
          }}
        >
          <span style={{ fontSize: 24, color: colors.accent, fontFamily: fontStack, fontWeight: 700 }}>
            是 ✓
          </span>
          <div
            style={{
              padding: '14px 28px',
              backgroundColor: `${colors.accent}15`,
              border: `1px solid ${colors.accent}40`,
              borderRadius: 10,
              fontSize: 22,
              color: colors.text,
              fontFamily: fontStack,
              textAlign: 'center',
              maxWidth: 320,
            }}
          >
            {yesLabel}
          </div>
        </div>

        {/* 否分支 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: noOpacity,
          }}
        >
          <span style={{ fontSize: 24, color: colors.success, fontFamily: fontStack, fontWeight: 700 }}>
            否 ✗
          </span>
          <div
            style={{
              padding: '14px 28px',
              backgroundColor: `${colors.success}15`,
              border: `1px solid ${colors.success}40`,
              borderRadius: 10,
              fontSize: 22,
              color: colors.text,
              fontFamily: fontStack,
              textAlign: 'center',
              maxWidth: 320,
            }}
          >
            {noLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
