/**
 * Scene06-ContextAssembly: 四层上下文组装（一镜到底）
 * 合并原 Scene06-10，112秒连续动画 (3360帧 @30fps)
 *
 * 时间轴：
 * - 0-540:     第一层「身份 Identity」亮起
 * - 540-1200:  第二层「规范 Bootstrap」展开，文件图标飞入
 * - 1200-2000: 第三层「记忆 Memory」展开，读写循环动画
 * - 2000-2600: 第四层「技能 Skills」展开，技能标签依次出现
 * - 2600-2900: 四层合并，追加「对话历史」和「当前消息」
 * - 2900-3360: 伪代码块渐入
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
import { SCENE06_TIMELINE } from '../lib/durations';
import { CodeBlock } from '../components/CodeBlock';
import { MOTION_DURATION, MOTION_EASING, MOTION_STAGGER, SPRING_PRESETS } from '../lib/motion';

// 四层配置
const LAYERS = [
  {
    label: '身份 Identity',
    color: colors.primary,
    icon: '🪪',
    details: ['我是谁', '当前时间', 'macOS / Linux', 'Workspace 路径', '工具列表'],
    digestText: '→ 醒来第一件事：我在哪？',
  },
  {
    label: '规范 Bootstrap',
    color: colors.accent,
    icon: '📋',
    files: ['AGENTS.md', 'SOUL.md', 'USER.md'],
    details: ['行为规范', '人格定义', '用户偏好'],
    digestText: '→ 换个文件，风格就变',
  },
  {
    label: '记忆 Memory',
    color: colors.warning,
    icon: '🧠',
    details: ['MEMORY.md', '用户偏好记录', '历史决策'],
    digestText: '→ 不从零开始',
    example: '「周报只要摘要」',
  },
  {
    label: '技能 Skills',
    color: colors.success,
    icon: '🛠',
    details: ['deep-research', 'ppt-maker', 'github-helper', 'web-search'],
    digestText: '→ 先知道有什么，用的时候再查',
  },
];

const BUILD_MESSAGES_CODE = `// 四层拼装 System Prompt
system_prompt = ""
system_prompt += identity()          // 身份
system_prompt += read("AGENTS.md")   // 行为规范
system_prompt += read("SOUL.md")     // 人格
system_prompt += read("USER.md")     // 用户偏好
system_prompt += read("MEMORY.md")   // 长期记忆
system_prompt += skills_summary()    // 技能摘要

messages = [
  {"role": "system", "content": system_prompt},
  ...session.history[-50:],
  {"role": "user", "content": current_msg}
]`;

export const Scene06ContextAssembly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T = SCENE06_TIMELINE;

  // 整个堆叠区域的垂直偏移（随着层数增加向上移动）
  const stackShift = interpolate(
    frame,
    [0, T.skillsEnd],
    [150, 10],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );

  // 合并阶段：压缩间距
  const mergeProgress = interpolate(
    frame,
    [T.mergeStart, T.mergeEnd],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );

  // 代码块阶段
  const codeOpacity = interpolate(
    frame,
    [T.codeStart - MOTION_STAGGER.sm, T.codeStart + MOTION_DURATION.enterSlow],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );
  const codeShiftX = interpolate(
    frame,
    [T.codeStart - MOTION_STAGGER.sm, T.codeStart + MOTION_DURATION.enterSlow],
    [90, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );

  // 合并后追加项的透明度
  const appendOpacity = interpolate(
    frame,
    [T.mergeStart + MOTION_STAGGER.lg, T.mergeStart + MOTION_STAGGER.lg + 70],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );
  const appendY = interpolate(
    frame,
    [T.mergeStart + MOTION_STAGGER.lg, T.mergeStart + MOTION_STAGGER.lg + 70],
    [18, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: MOTION_EASING.standard,
    },
  );
  const stackWidth = interpolate(
    frame,
    [T.codeStart - 10, T.codeStart + 35],
    [760, 620],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const sceneGap = interpolate(
    frame,
    [T.codeStart - 10, T.codeStart + 35],
    [0, 52],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        overflow: 'hidden',
      }}
    >
      {/* 左侧标题区 */}
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 48,
          fontSize: 22,
          color: colors.textDark,
        }}
      >
        <span style={{ color: colors.textMuted, fontSize: 16 }}>Part 1A</span>
        <br />
        <span style={{ color: colors.text, fontSize: 30, fontWeight: 700 }}>
          上下文组装
        </span>
      </div>

      {/* 主内容区：System Prompt Stack */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: sceneGap,
            alignItems: 'flex-start',
            transform: `translateY(${stackShift}px)`,
          }}
        >
          {/* 四层堆叠 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: mergeProgress > 0 ? interpolate(mergeProgress, [0, 1], [20, 6]) : 20,
              width: stackWidth,
            }}
          >
            {/* System Prompt 顶部标签 */}
            <div
              style={{
                fontSize: 20,
                color: colors.textMuted,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              System Prompt
            </div>

            {/* 四层 */}
            {LAYERS.map((layer, i) => (
              <LayerBlock
                key={i}
                layer={layer}
                index={i}
                frame={frame}
                fps={fps}
                compactProgress={mergeProgress}
                timeline={T}
              />
            ))}

            {/* 合并后追加项 */}
            <div
              style={{
                opacity: appendOpacity,
                transform: `translateY(${appendY}px)`,
              }}
            >
              <AppendItem
                label="对话历史"
                sublabel="session.history[-50:]"
                color={colors.info}
              />
              <div style={{ height: 6 }} />
              <AppendItem
                label="当前消息"
                sublabel="current_msg"
                color={colors.primaryLight}
              />
            </div>
          </div>

          {/* 伪代码块（合并完成后出现） */}
          <div
            style={{
              opacity: codeOpacity,
              width: 680,
              flexShrink: 0,
              transform: `translate3d(${Math.round(codeShiftX)}px, 0, 0)`,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: colors.textDark,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              build_messages()
            </div>
            <CodeBlock
              code={BUILD_MESSAGES_CODE}
              startFrame={0}
              revealDuration={90}
            />
          </div>
        </div>
      </div>

      {/* 底部进度指示 */}
      <ProgressIndicator frame={frame} timeline={T} />
    </AbsoluteFill>
  );
};

// 单层渲染
const LayerBlock: React.FC<{
  layer: typeof LAYERS[0];
  index: number;
  frame: number;
  fps: number;
  compactProgress: number;
  timeline: typeof SCENE06_TIMELINE;
}> = ({ layer, index, frame, fps, compactProgress, timeline }) => {
  // 各层的进入帧
  const enterFrames = [
    timeline.identityStart,
    timeline.bootstrapStart,
    timeline.memoryStart,
    timeline.skillsStart,
  ];
  const enterFrame = enterFrames[index];

  const layerSpring = spring({
    frame: frame - enterFrame,
    fps,
    config: SPRING_PRESETS.soft,
  });

  const isActive = frame >= enterFrame;
  if (!isActive) return null;

  const layerOpacity = interpolate(layerSpring, [0, 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clampedCompact = Math.min(Math.max(compactProgress, 0), 1);
  const bodyOpacity = 1 - clampedCompact;
  const bodyHeight = interpolate(clampedCompact, [0, 1], [220, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 消化句 fade（在层展开完后出现，持续一段时间）
  const digestStart = enterFrame + 120;
  const digestOpacity = layer.digestText
    ? interpolate(
        frame,
        [digestStart, digestStart + 15, digestStart + 300, digestStart + 330],
        [0, 1, 1, 0.6],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 0;

  return (
    <div
      style={{
        borderLeft: `4px solid ${layer.color}`,
        backgroundColor: `${layer.color}10`,
        borderRadius: 8,
        padding: `${interpolate(clampedCompact, [0, 1], [20, 8])}px ${interpolate(clampedCompact, [0, 1], [28, 18])}px`,
        opacity: layerOpacity,
        transform: `translate3d(0, ${Math.round((1 - layerSpring) * 20)}px, 0)`,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: interpolate(clampedCompact, [0, 1], [14, 0]),
        }}
      >
        <span style={{ fontSize: interpolate(clampedCompact, [0, 1], [27, 22]) }}>{layer.icon}</span>
        <span
          style={{
            fontSize: interpolate(clampedCompact, [0, 1], [25, 18]),
            fontWeight: 700,
            color: layer.color,
            fontFamily: fontStack,
          }}
        >
          {layer.label}
        </span>
      </div>

      {/* 详情标签 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, opacity: bodyOpacity, maxHeight: bodyHeight, overflow: 'hidden' }}>
        {layer.details.map((detail, j) => {
          const detailGroupDelay = Math.floor(j / 2) * MOTION_STAGGER.sm + (j % 2) * 3;
          const detailOpacity = interpolate(
            frame,
            [enterFrame + 20 + detailGroupDelay, enterFrame + 20 + detailGroupDelay + MOTION_DURATION.enterFast],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: MOTION_EASING.standard,
            },
          );
          return (
            <span
              key={j}
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                fontSize: 17,
                color: colors.text,
                backgroundColor: `${layer.color}18`,
                border: `1px solid ${layer.color}30`,
                borderRadius: 4,
                fontFamily: fontStack,
                opacity: detailOpacity,
                transform: `translate3d(0, ${Math.round((1 - detailOpacity) * 8)}px, 0)`,
              }}
            >
              {detail}
            </span>
          );
        })}
      </div>

      {/* 文件图标飞入（Bootstrap 层专用） */}
      {'files' in layer && layer.files && (
        <div style={{ display: 'flex', gap: 12, marginTop: 10, opacity: bodyOpacity, maxHeight: bodyHeight, overflow: 'hidden' }}>
          {layer.files.map((file, j) => {
            const fileGroupDelay = Math.floor(j / 2) * MOTION_STAGGER.sm + (j % 2) * 3;
            const fileOpacity = interpolate(
              frame,
              [enterFrame + 40 + fileGroupDelay, enterFrame + 40 + fileGroupDelay + MOTION_DURATION.enterNormal],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: MOTION_EASING.standard,
              },
            );
            const fileX = interpolate(
              frame,
              [enterFrame + 40 + fileGroupDelay, enterFrame + 40 + fileGroupDelay + MOTION_DURATION.enterNormal],
              [-30, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: MOTION_EASING.standard,
              },
            );
            return (
              <div
                key={j}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  backgroundColor: `${layer.color}15`,
                  borderRadius: 4,
                  fontSize: 16,
                  color: layer.color,
                  fontFamily: "'Fira Code', monospace",
                  opacity: fileOpacity,
                  transform: `translate3d(${Math.round(fileX)}px, 0, 0)`,
                }}
              >
                📄 {file}
              </div>
            );
          })}
        </div>
      )}

      {/* MEMORY 示例 */}
      {'example' in layer && layer.example && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 16px',
            backgroundColor: 'rgba(15, 15, 26, 0.5)',
            borderRadius: 6,
            fontSize: 16,
            color: colors.text,
            fontFamily: "'Fira Code', monospace",
            borderLeft: `3px solid ${layer.color}`,
            opacity: interpolate(
              frame,
              [enterFrame + 60, enterFrame + 75],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ) * bodyOpacity,
            maxHeight: bodyHeight,
            overflow: 'hidden',
          }}
        >
          Memory: {layer.example}
        </div>
      )}

      {/* 消化句 */}
      {layer.digestText && (
        <div
          style={{
            marginTop: 12,
            fontSize: 21,
            color: colors.accent,
            fontFamily: fontStack,
            fontStyle: 'italic',
            opacity: digestOpacity * bodyOpacity,
            maxHeight: bodyHeight,
            overflow: 'hidden',
          }}
        >
          {layer.digestText}
        </div>
      )}
    </div>
  );
};

// 追加项
const AppendItem: React.FC<{
  label: string;
  sublabel: string;
  color: string;
}> = ({ label, sublabel, color }) => (
  <div
    style={{
      height: 48,
      borderLeft: `4px solid ${color}`,
      backgroundColor: `${color}12`,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      padding: '0 18px',
      gap: 12,
    }}
  >
    <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: fontStack }}>{label}</span>
    <span style={{ fontSize: 14, color: colors.textDark, fontFamily: "'Fira Code', monospace" }}>
      {sublabel}
    </span>
  </div>
);

// 底部进度指示
const ProgressIndicator: React.FC<{
  frame: number;
  timeline: typeof SCENE06_TIMELINE;
}> = ({ frame, timeline }) => {
  const steps = [
    { label: '身份', end: timeline.identityEnd },
    { label: '规范', end: timeline.bootstrapEnd },
    { label: '记忆', end: timeline.memoryEnd },
    { label: '技能', end: timeline.skillsEnd },
    { label: '合并', end: timeline.mergeEnd },
    { label: '代码', end: timeline.codeEnd },
  ];

  const currentStep = steps.findIndex((s) => frame < s.end);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 34,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 18,
      }}
    >
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: isDone
                  ? colors.accent
                  : isActive
                    ? colors.primary
                    : colors.textDark,
              }}
            />
            <span
              style={{
                fontSize: 16,
                color: isActive ? colors.text : colors.textDark,
                fontFamily: fontStack,
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
