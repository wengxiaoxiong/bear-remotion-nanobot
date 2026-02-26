/**
 * Scene26-SevenRounds: 七轮循环展示（一镜到底）⭐核心场景（重构版）
 * 3000帧/100秒
 *
 * 新版设计：
 * - 左侧：循环图 + 轮次指示器 + 时间轴
 * - 右侧上半：LLM思考区域（为什么调这个工具）
 * - 右侧下半：工具调用卡片（tool → args → result）
 * - 第5轮：左右分屏对比 OS-level vs 云端Agent
 *
 * 时间轴：
 * - 0-400:       第1轮：read_file - 学习方法
 * - 400-800:     第2轮：web_search - 搜索（结合记忆偏好）
 * - 800-1200:    第3轮：web_fetch - 403失败 + 思考过程
 * - 1200-1600:   第4轮：web_fetch - 重试成功
 * - 1600-2000:   第5轮：read_file - 本地笔记（分屏对比）
 * - 2000-2400:   第6轮：exec - 生成PPT
 * - 2400-2800:   第7轮：message - 发送完成
 * - 2800-3000:   总结淡出
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { CycleDiagram } from '../components/CycleDiagram';
import { LAYOUT_GAP, LAYOUT_SAFE_MARGIN } from '../lib/motion';

const TIMELINE = {
  round1Start: 0,
  round1End: 400,
  round2Start: 400,
  round2End: 800,
  round3Start: 800,
  round3End: 1200,
  round4Start: 1200,
  round4End: 1600,
  round5Start: 1600,
  round5End: 2000,
  round6Start: 2000,
  round6End: 2400,
  round7Start: 2400,
  round7End: 2800,
  summaryStart: 2800,
  summaryEnd: 3000,
} as const;

const ROUNDS = [
  {
    round: 1,
    tool: 'read_file',
    args: 'skills/deep-research/SKILL.md',
    result: '✓ 获取调研方法论：先搜索→再精读→最后整理',
    status: 'success' as const,
    step: 0,
    thinking: '用户要我调研AI Agent进展，我需要先了解调研的方法。让我读取 deep-research 技能的说明书...',
    insight: 'Agent 先学习方法论，不是盲目开始',
  },
  {
    round: 2,
    tool: 'web_search',
    args: '"AI Agent 2025 进展 多模态"',
    result: '✓ 找到 5 篇相关文章（已按相关性排序）',
    status: 'success' as const,
    step: 2,
    thinking: '根据 MEMORY.md，用户关注"多模态"和"Agent架构"。我应该在搜索词中体现这些偏好，而不是泛泛地搜"AI Agent进展"。',
    insight: '搜索词结合了用户偏好（记忆驱动）',
  },
  {
    round: 3,
    tool: 'web_fetch',
    args: 'https://example.com/article-1',
    result: '✗ Error 403: Forbidden（访问被拒绝）',
    status: 'error' as const,
    step: 2,
    thinking: '第一篇文章看起来最相关，让我抓取详细内容... 咦，403？可能是反爬虫机制。我需要换个源试试。',
    insight: '遇到失败，Agent 决定换源重试',
  },
  {
    round: 4,
    tool: 'web_fetch',
    args: 'https://openai.com/blog/',
    result: '✓ 成功获取文章内容（约2000字）',
    status: 'success' as const,
    step: 2,
    thinking: '刚才的源失败了，但搜索结果里还有官方博客。官方源通常更稳定，让我试试这个... 成功了！',
    insight: '自我修正完成，无需用户干预',
  },
  {
    round: 5,
    tool: 'read_file',
    args: '~/research/notes/agent-survey.md',
    result: '✓ 读取用户此前的调研笔记',
    status: 'success' as const,
    step: 0,
    thinking: '网上资料有了，但用户本地可能还有之前的调研笔记。作为 OS-level Agent，我可以直接读取这些文件来补充...',
    insight: 'OS-level 优势：访问本地文件',
    showComparison: true,
  },
  {
    round: 6,
    tool: 'exec',
    args: 'python make_ppt.py --output ~/output/report.pptx',
    result: '✓ PPT 已生成: ~/output/report.pptx',
    status: 'success' as const,
    step: 2,
    thinking: '资料收集完毕，用户要求做PPT。我可以直接调用本地安装的 python-pptx 库生成，文件直接存到用户目录。',
    insight: '使用用户本地的 Python 环境生成交付物',
  },
  {
    round: 7,
    tool: 'message',
    args: 'channel=工作群, content="报告已生成..."',
    result: '✓ 已发送到群聊，循环结束',
    status: 'success' as const,
    step: 1,
    thinking: '任务完成，PPT已生成。现在调用 message 工具把结果和文件路径发给用户，不需要再调其他工具了。',
    insight: '任务完成，主动退出循环',
    isFinal: true,
  },
];

const STATUS_COLORS = {
  success: colors.success,
  error: colors.error,
  pending: colors.warning,
};

export const Scene26SevenRounds: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T = TIMELINE;

  // 计算当前轮次
  const currentRoundIndex = ROUNDS.findIndex((_, i) => {
    const start = i === 0 ? T.round1Start : T[`round${i + 1}Start` as keyof typeof T];
    const end = T[`round${i + 1}End` as keyof typeof T];
    return frame >= start && frame < end;
  });

  const activeRound = currentRoundIndex >= 0 ? currentRoundIndex : ROUNDS.length - 1;
  const roundData = ROUNDS[activeRound];

  // 屏幕闪烁效果（错误时）
  const isErrorRound = activeRound === 2;
  const errorFlash = isErrorRound
    ? interpolate(
        frame % 40,
        [0, 8, 16],
        [0, 0.12, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // 是否是第5轮（展示分屏对比）
  const isComparisonRound = activeRound === 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        overflow: 'hidden',
      }}
    >
      {/* 错误闪烁覆盖层 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.error,
          opacity: errorFlash,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />

      {/* 主内容区：左右并排紧凑布局 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: LAYOUT_SAFE_MARGIN.top,
          paddingBottom: LAYOUT_SAFE_MARGIN.bottom,
          paddingLeft: LAYOUT_SAFE_MARGIN.x - 24,
          paddingRight: LAYOUT_SAFE_MARGIN.x - 24,
          display: 'flex',
          flexDirection: 'row',
          gap: LAYOUT_GAP.sm,
          alignItems: 'stretch',
        }}
      >
        <LeftPanel frame={frame} fps={fps} activeRound={activeRound} timeline={T} />
        <RightPanel
        frame={frame}
        fps={fps}
        round={roundData}
        activeRound={activeRound}
        isComparisonRound={isComparisonRound}
        timeline={T}
        />
      </div>

      {/* 总结阶段 */}
      {frame >= T.summaryStart && (
        <SummaryView frame={frame} fps={fps} timeline={T} />
      )}

      {/* 顶部标题 */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: LAYOUT_SAFE_MARGIN.x,
          fontSize: 16,
          color: colors.textMuted,
        }}
      >
        Part 3: 完整案例 — 七轮循环拆解
      </div>
    </AbsoluteFill>
  );
};

// 左侧面板
const LeftPanel: React.FC<{
  frame: number;
  fps: number;
  activeRound: number;
  timeline: typeof TIMELINE;
}> = ({ activeRound }) => {
  const roundData = ROUNDS[activeRound];

  return (
    <div
      style={{
        flex: '0 0 38%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 循环图 */}
      <div style={{ marginBottom: 10, flexShrink: 0 }}>
        <CycleDiagram
          highlightedStep={roundData?.step ?? 0}
          showExit={activeRound === 6}
          animateFlow={true}
        />
      </div>

      {/* 时间轴 */}
      <TimelineView activeRound={activeRound} />
    </div>
  );
};

// 时间轴视图
const TimelineView: React.FC<{ activeRound: number }> = ({ activeRound }) => {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        padding: LAYOUT_GAP.sm,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: colors.textMuted,
          marginBottom: 8,
          fontFamily: "'Fira Code', monospace",
        }}
      >
        执行时间轴
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ROUNDS.slice(0, Math.min(activeRound + 1, ROUNDS.length)).map((round, i) => {
          const isCurrent = i === activeRound;
          const isPast = i < activeRound;
          const isFuture = i > activeRound;
          const statusColor =
            round.status === 'error' ? colors.error : colors.success;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                backgroundColor: isCurrent ? `${colors.primary}15` : 'transparent',
                borderRadius: 6,
                borderLeft: `3px solid ${
                  isCurrent ? colors.primary : isPast ? statusColor : 'transparent'
                }`,
                opacity: isFuture ? 0.4 : 1,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: isCurrent ? colors.primary : isPast ? statusColor : colors.textDark,
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                R{round.round}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: colors.text,
                  fontFamily: "'Fira Code', monospace",
                  flex: 1,
                }}
              >
                {round.tool}
              </span>
              {isPast && (
                <span style={{ fontSize: 12, color: statusColor }}>
                  {round.status === 'error' ? '✗' : '✓'}
                </span>
              )}
              {isCurrent && (
                <span style={{ fontSize: 12, color: colors.primary }}>▶</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 右侧面板
const RightPanel: React.FC<{
  frame: number;
  fps: number;
  round: typeof ROUNDS[0];
  activeRound: number;
  isComparisonRound: boolean;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, round, activeRound, isComparisonRound, timeline }) => {
  const T = timeline;
  const roundStart = T[`round${activeRound + 1}Start` as keyof typeof T] as number;

  const enterSpring = spring({
    frame: frame - roundStart,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const statusColor = STATUS_COLORS[round.status];

  // 如果是第5轮，显示分屏对比
  const content = isComparisonRound ? (
    <ComparisonView
      frame={frame}
      fps={fps}
      round={round}
      roundStart={roundStart}
    />
  ) : (
    <ToolCallCard round={round} statusColor={statusColor} />
  );

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        opacity: enterSpring,
        transform: `translateX(${(1 - enterSpring) * 40}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* 轮次标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 14,
            color: colors.textMuted,
            backgroundColor: colors.backgroundCard,
            padding: '4px 12px',
            borderRadius: 4,
          }}
        >
          第 {round.round} 轮
        </span>
        {round.insight && (
          <span
            style={{
              fontSize: 14,
              color: colors.accent,
              fontStyle: 'italic',
            }}
          >
            {round.insight}
          </span>
        )}
      </div>

      {/* LLM思考区域 - 保持位置固定 */}
      <LLMThinking thinking={round.thinking} status={round.status} frame={frame - roundStart} />

      {/* 动态内容区域 */}
      {content}
    </div>
  );
};

// LLM思考区域
const LLMThinking: React.FC<{
  thinking: string;
  status: 'success' | 'error' | 'pending';
  frame?: number;
}> = ({ thinking, status, frame = 0 }) => {
  const borderColor = status === 'error' ? colors.error : colors.accent;
  const bgColor = status === 'error' ? `${colors.error}10` : `${colors.accent}10`;
  const icon = status === 'error' ? '💭' : '💡';

  // Typewriter effect
  const charsToShow = Math.min(
    thinking.length,
    Math.floor(interpolate(frame, [0, 90], [0, thinking.length], { extrapolateRight: 'clamp' }))
  );
  const displayText = thinking.slice(0, charsToShow);
  const isTyping = charsToShow < thinking.length;

  // Glow breathing effect
  const glowIntensity = 0.5 + Math.sin(frame * 0.1) * 0.2;

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: 12,
        border: `2px solid ${borderColor}${Math.floor(glowIntensity * 80).toString(16).padStart(2, '0')}`,
        padding: 12,
        boxShadow: `0 0 ${20 + Math.sin(frame * 0.08) * 10}px ${borderColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 18, opacity: 0.8 + Math.sin(frame * 0.12) * 0.2 }}>{icon}</span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: borderColor,
            fontFamily: "'Fira Code', monospace",
          }}
        >
          LLM 的思考过程
        </span>
      </div>
      <div
        style={{
          fontSize: 15,
          color: colors.text,
          lineHeight: 1.6,
          minHeight: '3em',
        }}
      >
        {displayText}
        {isTyping && (
          <span style={{ 
            opacity: 0.7 + Math.sin(frame * 0.3) * 0.3,
            color: borderColor,
          }}>▋</span>
        )}
      </div>
    </div>
  );
};

// 工具调用卡片
const ToolCallCard: React.FC<{
  round: typeof ROUNDS[0];
  statusColor: string;
}> = ({ round, statusColor }) => {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        border: `2px solid ${statusColor}50`,
        padding: 12,
        boxShadow: `0 0 30px ${statusColor}15`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: colors.textMuted }}>Tool Call</span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: statusColor,
            fontFamily: "'Fira Code', monospace",
          }}
        >
          {round.tool}
        </span>
      </div>

      <div
        style={{
          backgroundColor: 'rgba(15, 15, 26, 0.6)',
          borderRadius: 8,
          padding: '12px 14px',
          fontFamily: "'Fira Code', monospace",
          fontSize: 15,
          color: colors.text,
          marginBottom: 12,
          border: `1px solid ${colors.border}`,
        }}
      >
        {round.args}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          backgroundColor: `${statusColor}10`,
          borderRadius: 8,
          borderLeft: `4px solid ${statusColor}`,
        }}
      >
        <span style={{ fontSize: 22 }}>
          {round.status === 'success' ? '✓' : round.status === 'error' ? '✗' : '…'}
        </span>
        <span style={{ fontSize: 15, color: colors.text }}>{round.result}</span>
      </div>

      {/* 最终结果标记 */}
      {round.isFinal && (
        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            padding: '10px',
            backgroundColor: `${colors.success}15`,
            borderRadius: 8,
            border: `2px solid ${colors.success}`,
          }}
        >
          <span style={{ fontSize: 18, color: colors.success, fontWeight: 700 }}>
            🎉 任务完成，退出循环
          </span>
        </div>
      )}
    </div>
  );
};

// 分屏对比视图（第5轮专用）
const ComparisonView: React.FC<{
  frame: number;
  fps: number;
  round: typeof ROUNDS[0];
  roundStart: number;
}> = ({ frame, fps, round, roundStart }) => {
  const leftProgress = interpolate(
    frame,
    [roundStart + 80, roundStart + 180],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const rightProgress = interpolate(
    frame,
    [roundStart + 200, roundStart + 300],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px',
          backgroundColor: `${colors.accent}15`,
          borderRadius: 8,
          border: `1px solid ${colors.accent}`,
        }}
      >
        <span style={{ fontSize: 16 }}>⚡</span>
        <span style={{ fontSize: 15, color: colors.accent, fontWeight: 700 }}>
          OS-level Agent 的核心优势
        </span>
      </div>

      {/* 分屏对比 */}
      <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
        {/* 左侧：OS-level */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: `${colors.success}10`,
            borderRadius: 12,
            border: `2px solid ${colors.success}`,
            padding: 10,
            opacity: leftProgress,
            transform: `translateY(${(1 - leftProgress) * 20}px)`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.success,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>✓</span>
            OS-level Agent
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15, 15, 26, 0.6)',
              borderRadius: 8,
              padding: 10,
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            read_file("~/research/notes/...")
          </div>

          <div
            style={{
              padding: 8,
              backgroundColor: `${colors.success}15`,
              borderRadius: 6,
              fontSize: 13,
              color: colors.text,
            }}
          >
            <span style={{ color: colors.success }}>✓</span> 成功读取本地笔记
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            直接访问用户工作目录，
            <br />
            获取历史调研资料
          </div>
        </div>

        {/* 右侧：云端Agent */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: `${colors.error}10`,
            borderRadius: 12,
            border: `2px solid ${colors.error}`,
            padding: LAYOUT_GAP.sm,
            opacity: rightProgress,
            transform: `translateY(${(1 - rightProgress) * 20}px)`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.error,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>✗</span>
            云端沙箱 Agent
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15, 15, 26, 0.6)',
              borderRadius: 8,
              padding: 10,
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              color: colors.textMuted,
              marginBottom: 8,
              textDecoration: 'line-through',
            }}
          >
            read_file("~/research/notes/...")
          </div>

          <div
            style={{
              padding: 8,
              backgroundColor: `${colors.error}15`,
              borderRadius: 6,
              fontSize: 13,
              color: colors.text,
            }}
          >
            <span style={{ color: colors.error }}>✗</span> 无法访问本地文件
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            运行在隔离容器内，
            <br />
            无法读取用户本地数据
          </div>
        </div>
      </div>
    </div>
  );
};

// 总结视图
const SummaryView: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  const enterSpring = spring({
    frame: frame - T.summaryStart,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const statsProgress = interpolate(
    frame,
    [T.summaryStart + 60, T.summaryStart + 120],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: `${colors.background}F0`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enterSpring,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${0.9 + enterSpring * 0.1})`,
        }}
      >
        {/* 标题 */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: colors.accent,
            marginBottom: 30,
          }}
        >
          七轮循环完成
        </div>

        {/* 统计卡片 */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            marginBottom: 40,
            opacity: statsProgress,
          }}
        >
          {[
            { label: '总轮次', value: '7', color: colors.primary },
            { label: '使用工具', value: '5', color: colors.accent },
            { label: '自我修正', value: '1', color: colors.warning },
            { label: '用户追问', value: '0', color: colors.success },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                width: 120,
                padding: '20px',
                backgroundColor: colors.backgroundCard,
                borderRadius: 12,
                border: `2px solid ${stat.color}40`,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 轮次状态 */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {ROUNDS.map((round, i) => {
            const statusColor =
              round.status === 'error' ? colors.error : colors.success;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: `${statusColor}20`,
                    border: `2px solid ${statusColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    color: '#ffffff',
                  }}
                >
                  {round.status === 'error' ? '✗' : '✓'}
                </div>
                <span style={{ fontSize: 12, color: colors.textMuted }}>
                  R{round.round}
                </span>
              </div>
            );
          })}
        </div>

        {/* 金句 */}
        <div
          style={{
            fontSize: 32,
            color: colors.text,
            fontWeight: 700,
          }}
        >
          一条消息，七轮循环，
          <span style={{ color: colors.success }}>零次追问</span>
        </div>

        <div
          style={{
            fontSize: 18,
            color: colors.textMuted,
            marginTop: 16,
            fontStyle: 'italic',
          }}
        >
          这就是 Agent 与 ChatBot 的本质区别
        </div>
      </div>
    </div>
  );
};
