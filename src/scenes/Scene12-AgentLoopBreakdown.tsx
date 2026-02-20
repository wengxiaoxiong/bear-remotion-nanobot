/**
 * Scene12-AgentLoopBreakdown: Agent Loop 循环拆解（一镜到底）
 * 合并原 Scene12-17，120秒连续动画 (3600帧 @30fps)
 *
 * 六个阶段：
 * Phase 1 (0-540):     发送 messages + 工具清单给 LLM
 * Phase 2 (540-1080):  检查回复（分支：有 tool_call?）
 * Phase 3 (1080-1680): 工具说明（工具清单 + tool call 示例）
 * Phase 4 (1680-2280): 执行工具（执行流程 + 伪代码）
 * Phase 5 (2280-2820): 循环返回（箭头回到顶部）
 * Phase 6 (2820-3600): ChatBot vs Agent 对比 + 金句
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { SCENE12_TIMELINE } from '../lib/durations';
import { CodeBlock } from '../components/CodeBlock';
import { ToolCallBox } from '../components/ToolCallBox';
import { BranchNode } from '../components/BranchNode';
import { ComparisonPanel } from '../components/ComparisonPanel';

const AGENT_LOOP_CODE = `async function agent_loop(messages, tools):
  while iteration < max_iterations:
    response = await llm.chat(messages, tools)
    if response.has_tool_calls:
      for tc in response.tool_calls:
        result = await tools.execute(
          tc.name, tc.arguments
        )
        messages.append({
          role: "tool",
          tool_call_id: tc.id,
          content: result
        })
    else:
      return response.content`;

const TOOL_LIST = [
  'read_file', 'write_file', 'exec', 'web_search',
  'web_fetch', 'message', 'delegate',
];
const TOOL_LABELS_ZH: Record<string, string> = {
  read_file: '读取文件',
  write_file: '写入文件',
  exec: '执行命令',
  web_search: '网页搜索',
  web_fetch: '抓取网页',
  message: '发送消息',
  delegate: '委派子任务',
};
const PHASE_OVERLAP = 24;

export const Scene12AgentLoopBreakdown: React.FC = () => {
  const frame = useCurrentFrame();

  const T = SCENE12_TIMELINE;

  const phase =
    frame < T.checkResponseStart ? 1
    : frame < T.toolsExplainedStart ? 2
    : frame < T.executeToolStart ? 3
    : frame < T.loopBackStart ? 4
    : frame < T.comparisonStart ? 5
    : 6;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        overflow: 'hidden',
      }}
    >
      {/* 左上角标题 */}
      <div style={{ position: 'absolute', left: 60, top: 50 }}>
        <span style={{ color: colors.textMuted, fontSize: 22 }}>Part 1B</span>
        <br />
        <span style={{ color: colors.text, fontSize: 34, fontWeight: 700 }}>
          Agent Loop 循环
        </span>
      </div>

      <Sequence
        from={T.sendToLLMStart}
        durationInFrames={T.checkResponseStart - T.sendToLLMStart + PHASE_OVERLAP}
      >
        <PhaseMotion durationInFrames={T.checkResponseStart - T.sendToLLMStart + PHASE_OVERLAP} enterFromX={70} exitToX={-90}>
          <Phase1SendToLLM />
        </PhaseMotion>
      </Sequence>

      <Sequence
        from={T.checkResponseStart}
        durationInFrames={T.toolsExplainedStart - T.checkResponseStart + PHASE_OVERLAP}
      >
        <PhaseMotion durationInFrames={T.toolsExplainedStart - T.checkResponseStart + PHASE_OVERLAP} enterFromX={85} exitToX={-85}>
          <Phase2CheckResponse />
        </PhaseMotion>
      </Sequence>

      <Sequence
        from={T.toolsExplainedStart}
        durationInFrames={T.executeToolStart - T.toolsExplainedStart + PHASE_OVERLAP}
      >
        <PhaseMotion durationInFrames={T.executeToolStart - T.toolsExplainedStart + PHASE_OVERLAP} enterFromX={90} exitToX={-95}>
          <Phase3ToolsExplained />
        </PhaseMotion>
      </Sequence>

      <Sequence
        from={T.executeToolStart}
        durationInFrames={T.loopBackStart - T.executeToolStart + PHASE_OVERLAP}
      >
        <PhaseMotion durationInFrames={T.loopBackStart - T.executeToolStart + PHASE_OVERLAP} enterFromX={85} exitToX={-85}>
          <Phase4ExecuteTool />
        </PhaseMotion>
      </Sequence>

      <Sequence
        from={T.loopBackStart}
        durationInFrames={T.comparisonStart - T.loopBackStart + PHASE_OVERLAP}
      >
        <PhaseMotion durationInFrames={T.comparisonStart - T.loopBackStart + PHASE_OVERLAP} enterFromX={75} exitToX={-70}>
          <Phase5LoopBack />
        </PhaseMotion>
      </Sequence>

      <Sequence from={T.comparisonStart} durationInFrames={3600 - T.comparisonStart}>
        <PhaseMotion durationInFrames={3600 - T.comparisonStart} enterFromX={80} exitToX={0}>
          <Phase6Comparison />
        </PhaseMotion>
      </Sequence>

      <PhaseIndicator phase={phase} />
    </AbsoluteFill>
  );
};

const PhaseMotion: React.FC<{
  durationInFrames: number;
  enterFromX: number;
  exitToX: number;
  children: React.ReactNode;
}> = ({ durationInFrames, enterFromX, exitToX, children }) => {
  const frame = useCurrentFrame();

  const enterProgress = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitProgress = interpolate(frame, [durationInFrames - PHASE_OVERLAP, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = Math.min(enterProgress, 1 - exitProgress);
  const translateX = (1 - enterProgress) * enterFromX + exitProgress * exitToX;
  const translateY = (1 - enterProgress) * 8 - exitProgress * 6;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
      }}
    >
      {children}
    </div>
  );
};

/** Phase 1: messages + 工具清单 → LLM → response */
const Phase1SendToLLM: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step1Spring = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const step2Spring = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 120 } });
  const step3Spring = spring({ frame: frame - 60, fps, config: { damping: 15, stiffness: 120 } });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 44,
      }}
    >
      <div style={{ fontSize: 34, color: colors.textMuted }}>
        第一步：发送消息和工具清单
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 38 }}>
        <FlowBox label="messages" sublabel="上下文 + 历史" color={colors.primary} opacity={step1Spring} />
        <Arrow opacity={step1Spring} />
        <FlowBox label="tools" sublabel="工具清单" color={colors.success} opacity={step2Spring} />
        <Arrow opacity={step2Spring} />
        <div
          style={{
            opacity: step3Spring,
            transform: `scale(${0.9 + step3Spring * 0.1})`,
          }}
        >
          <div
            style={{
              width: 200,
              height: 124,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${colors.primary}40, ${colors.accent}40)`,
              border: `2px solid ${colors.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 30px ${colors.accent}30`,
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 800, color: colors.accent }}>LLM</span>
          </div>
        </div>
        <Arrow opacity={step3Spring} />
        <FlowBox label="response" sublabel="回复内容" color={colors.accent} opacity={step3Spring} />
      </div>

      <div
        style={{
          opacity: interpolate(frame, [80, 100], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
          fontSize: 34,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        坐等 LLM 回复…
      </div>
    </AbsoluteFill>
  );
};

/** Phase 2: 检查回复 — 有 tool_call? */
const Phase2CheckResponse: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
      }}
    >
      <div style={{ fontSize: 34, color: colors.textMuted }}>
        第二步：检查回复
      </div>

      <BranchNode
        question="有 tool_call?"
        showYes={frame > 15}
        showNo={frame > 25}
        yesLabel="有 → 继续执行工具"
        noLabel="没有 → 任务完成，退出循环"
        enterDelay={0}
      />

      <div
        style={{
          opacity: interpolate(frame, [60, 80], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
          fontSize: 30,
          color: colors.textMuted,
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.8,
          marginTop: 20,
        }}
      >
        LLM 有两种回法：直接给文本 → 任务完成；返回 tool_call → 需要动手
      </div>

      <div
        style={{
          opacity: interpolate(frame, [85, 105], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
          fontSize: 24,
          color: colors.accent,
          textAlign: 'center',
          maxWidth: 960,
          lineHeight: 1.7,
        }}
      >
        tool_call = LLM 给出的结构化动作指令
        （调用哪个工具 + 传什么参数）
      </div>
    </AbsoluteFill>
  );
};

/** Phase 3: 工具说明 */
const Phase3ToolsExplained: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 86,
        padding: '0 110px 70px',
      }}
    >
      {/* 左侧：工具清单 */}
      <div style={{ width: 500, alignSelf: 'center' }}>
        <div style={{ fontSize: 34, color: colors.textMuted, marginBottom: 18 }}>
          工具 = Agent 的「手」
        </div>
        <div
          style={{
            fontSize: 23,
            color: colors.accent,
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          每个工具都告诉 LLM 两件事：能做什么、参数怎么传
        </div>
        <div
          style={{
            backgroundColor: colors.backgroundCard,
            borderRadius: 16,
            padding: '26px 34px',
            border: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ fontSize: 21, color: colors.textDark, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Tool Registry
          </div>
          {TOOL_LIST.map((tool, i) => {
            const toolOpacity = interpolate(
              frame, [10 + i * 6, 18 + i * 6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return (
              <div
                key={i}
                style={{
                  opacity: toolOpacity,
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontFamily: "'Fira Code', monospace",
                  borderBottom: i < TOOL_LIST.length - 1 ? `1px solid ${colors.border}` : 'none',
                }}
              >
                <span style={{ fontSize: 29, color: colors.accent }}>{tool}</span>
                <span style={{ fontSize: 22, color: colors.textMuted, fontFamily: fontStack }}>
                  {TOOL_LABELS_ZH[tool] ?? ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧：tool call 示例 */}
      <div style={{ width: 640, alignSelf: 'center' }}>
        <div style={{ fontSize: 34, color: colors.textMuted, marginBottom: 18 }}>
          tool_call 示例
        </div>
        <ToolCallBox
          toolName="web_search"
          args={{ keywords: '什么是「鸡你太美」' }}
          result="「鸡你太美」是网络流行语，源自篮球运动员蔡徐坤在赛事表演时的配乐空耳，常用来调侃其表演风格和引发的网络讨论。"
          showResult={frame > 80}
          resultStatus="success"
          enterDelay={30}
        />
        <div
          style={{
            marginTop: 20,
            opacity: interpolate(frame, [100, 120], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            }),
            fontSize: 30,
            color: colors.accent,
            fontStyle: 'italic',
          }}
        >
          tool_call 就是：工具名 + 参数（不是给用户的自然语言）
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Phase 4: 执行工具 + 伪代码 */
const Phase4ExecuteTool: React.FC = () => {
  const frame = useCurrentFrame();

  const execSteps = [
    { label: 'tool_call', frame: 0 },
    { label: '→ 找到工具', frame: 15 },
    { label: '→ 执行', frame: 30 },
    { label: '→ result', frame: 45 },
    { label: '→ 追加到 messages', frame: 60 },
  ];

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '0 110px',
      }}
    >
      <div style={{ fontSize: 34, color: colors.textMuted }}>
        执行工具，结果喂回 LLM
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {execSteps.map((step, i) => {
          const stepOpacity = interpolate(
            frame, [step.frame, step.frame + 12], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          const isLast = i === execSteps.length - 1;
          return (
            <span
              key={i}
              style={{
                opacity: stepOpacity,
                fontSize: 30,
                fontWeight: isLast ? 800 : 400,
                color: isLast ? colors.accent : colors.text,
                fontFamily: "'Fira Code', monospace",
                padding: '10px 18px',
                backgroundColor: isLast ? `${colors.accent}15` : 'transparent',
                borderRadius: 8,
              }}
            >
              {step.label}
            </span>
          );
        })}
      </div>

      <div
        style={{
          opacity: interpolate(frame, [80, 100], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
          padding: '20px 36px',
          backgroundColor: `${colors.accent}10`,
          border: `1px solid ${colors.accent}30`,
          borderRadius: 10,
          fontSize: 32,
          color: colors.accent,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        注意：Tool Call的结果不是给用户看的，是给 LLM 接着思考用的
      </div>

      <div
        style={{
          width: 860,
          opacity: interpolate(frame, [120, 145], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}
      >
        <CodeBlock
          code={AGENT_LOOP_CODE}
          startFrame={0}
          revealDuration={120}
          highlightLines={[6, 7, 8, 9, 10, 11]}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Phase 5: 循环返回 */
const Phase5LoopBack: React.FC = () => {
  const frame = useCurrentFrame();

  const loopProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const rotation = interpolate(frame, [10, 100], [0, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 46,
      }}
    >
      <div
        style={{
          width: 184,
          height: 184,
          borderRadius: '50%',
          border: `4px solid ${colors.accent}`,
          borderTopColor: 'transparent',
          transform: `rotate(${rotation}deg)`,
          opacity: loopProgress,
        }}
      />

      <div
        style={{
          textAlign: 'center',
          opacity: interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, color: colors.text }}>
          结果喂回去，循环回到顶部
        </div>
        <div style={{ fontSize: 32, color: colors.textMuted, marginTop: 16 }}>
          LLM 再次审视——「结果有了，还要干啥？」
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          opacity: interpolate(frame, [60, 80], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}
      >
        {['tool result', '→ messages', '→ LLM', '→ 再看一遍'].map((step, i) => (
          <span
            key={i}
            style={{
              padding: '12px 24px',
              fontSize: 29,
              color: i === 3 ? colors.accent : colors.text,
              fontWeight: i === 3 ? 700 : 400,
              backgroundColor: `${colors.primary}15`,
              borderRadius: 8,
              fontFamily: "'Fira Code', monospace",
            }}
          >
            {step}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          opacity: interpolate(frame, [120, 150], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
          fontSize: 38,
          fontWeight: 700,
          color: colors.warning,
          fontStyle: 'italic',
        }}
      >
        什么时候停，全看 LLM 自己决定
      </div>
    </AbsoluteFill>
  );
};

/** Phase 6: ChatBot vs Agent 对比 */
const Phase6Comparison: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ComparisonPanel enterDelay={10} />
    </AbsoluteFill>
  );
};

// 辅助组件：流程框
const FlowBox: React.FC<{
  label: string;
  sublabel: string;
  color: string;
  opacity: number;
}> = ({ label, sublabel, color, opacity }) => (
  <div
    style={{
      opacity,
      transform: `translateY(${(1 - opacity) * 15}px)`,
      padding: '20px 32px',
      backgroundColor: `${color}12`,
      border: `1px solid ${color}40`,
      borderRadius: 14,
      textAlign: 'center',
      minWidth: 190,
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 700, color, fontFamily: "'Fira Code', monospace" }}>
      {label}
    </div>
    <div style={{ fontSize: 22, color: colors.textMuted, fontFamily: fontStack }}>
      {sublabel}
    </div>
  </div>
);

// 辅助组件：箭头
const Arrow: React.FC<{ opacity: number }> = ({ opacity }) => (
  <span style={{ opacity, fontSize: 42, color: colors.textDark }}>→</span>
);

// 阶段指示器
const PhaseIndicator: React.FC<{ phase: number }> = ({ phase }) => {
  const phases = ['发送 LLM', '检查回复', '工具说明', '执行工具', '循环返回', '对比总结'];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 34,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 26,
      }}
    >
      {phases.map((p, i) => {
        const isActive = i + 1 === phase;
        const isDone = i + 1 < phase;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: isDone ? colors.accent : isActive ? colors.primary : colors.textDark,
              }}
            />
            <span
              style={{
                fontSize: 22,
                color: isActive ? colors.text : colors.textDark,
                fontFamily: fontStack,
              }}
            >
              {p}
            </span>
          </div>
        );
      })}
    </div>
  );
};
