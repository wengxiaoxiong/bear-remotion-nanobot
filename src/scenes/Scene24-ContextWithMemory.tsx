/**
 * Scene24-ContextWithMemory: 上下文四层 + Memory 高亮（优化版）
 * 1200帧/40秒（从30秒延长，强化记忆驱动决策展示）
 *
 * 时间轴：
 * - 0-60:      四层快速回放（简化版）
 * - 60-400:    Memory 层高亮展开，展示具体内容
 * - 400-700:   记忆驱动决策演示：对比"有记忆"vs"无记忆"的搜索词
 * - 700-900:   技能摘要层亮起
 * - 900-1200:  过渡到 Loop 循环图，标注"Loop 开始"
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
import { CycleDiagram } from '../components/CycleDiagram';

const TIMELINE = {
  layersStart: 0,
  layersEnd: 60,
  memoryStart: 60,
  memoryEnd: 400,
  searchCompareStart: 400,
  searchCompareEnd: 700,
  skillsStart: 700,
  skillsEnd: 900,
  loopStart: 900,
  loopEnd: 1200,
} as const;

const LAYERS = [
  { label: '身份 Identity', color: colors.primary, icon: '🪪', desc: '我是谁、几点、在哪台机器' },
  { label: '规范 Bootstrap', color: colors.accent, icon: '📋', desc: 'AGENTS.md + SOUL.md + USER.md' },
  { label: '记忆 Memory', color: colors.warning, icon: '🧠', highlight: true, desc: '用户偏好、历史关注' },
  { label: '技能 Skills', color: colors.success, icon: '🛠', desc: '可用技能清单' },
];

const MEMORY_CONTENT = `## 用户关注方向

- 🔥 多模态大模型（重点关注）
- 🏗️ Agent 架构设计
- 📚 RAG 优化策略

## 交付偏好

- PPT 用深色主题
- 周报只要摘要
- 搜索优先中文结果`;

export const Scene24ContextWithMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T = TIMELINE;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: fontStack,
        overflow: 'hidden',
      }}
    >
      {/* 阶段 1：四层快速回放 */}
      {frame < T.memoryEnd && (
        <LayersView frame={frame} fps={fps} timeline={T} />
      )}

      {/* 阶段 2：搜索词对比（记忆驱动决策演示） */}
      {frame >= T.searchCompareStart - 60 && frame < T.skillsEnd && (
        <SearchComparisonView frame={frame} fps={fps} timeline={T} />
      )}

      {/* 阶段 3：循环图过渡 */}
      {frame >= T.loopStart - 60 && (
        <LoopView frame={frame} fps={fps} timeline={T} />
      )}

      {/* 阶段指示 */}
      <PhaseLabel frame={frame} timeline={T} />

      {/* 顶部标题 */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 60,
          fontSize: 18,
          color: colors.textMuted,
        }}
      >
        Part 3: 上下文组装 → 记忆驱动决策
      </div>
    </AbsoluteFill>
  );
};

// 四层视图
const LayersView: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  // 快速回放各层
  const layerProgress = interpolate(
    frame,
    [T.layersStart, T.layersEnd],
    [0, 4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Memory 展开
  const memoryExpand = spring({
    frame: frame - T.memoryStart,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // 记忆内容逐行显示
  const memoryLines = MEMORY_CONTENT.split('\n');
  const lineProgress = interpolate(
    frame,
    [T.memoryStart + 60, T.memoryStart + 200],
    [0, memoryLines.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: '35%',
        top: 100,
        width: 550,
      }}
    >
      <div style={{ fontSize: 22, color: colors.textMuted, marginBottom: 24 }}>
        System Prompt 四层结构
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {LAYERS.map((layer, i) => {
          const isVisible = layerProgress > i;
          const isMemoryHighlight = layer.highlight && frame >= T.memoryStart;

          return (
            <div key={i}>
              <div
                style={{
                  padding: '14px 22px',
                  backgroundColor: isMemoryHighlight
                    ? `${layer.color}25`
                    : `${layer.color}10`,
                  borderRadius: 12,
                  border: `2px solid ${
                    isMemoryHighlight ? layer.color : `${layer.color}40`
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: isVisible ? 1 : 0,
                  transform: `translateX(${(1 - (isVisible ? 1 : 0)) * -30}px)`,
                  boxShadow: isMemoryHighlight
                    ? `0 0 30px ${layer.color}40`
                    : 'none',
                }}
              >
                <span style={{ fontSize: 26 }}>{layer.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: isMemoryHighlight ? layer.color : colors.text,
                    }}
                  >
                    {layer.label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: colors.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {layer.desc}
                  </div>
                </div>
              </div>

              {/* Memory 展开内容 */}
              {isMemoryHighlight && (
                <div
                  style={{
                    marginTop: 12,
                    marginLeft: 20,
                    padding: 18,
                    backgroundColor: colors.backgroundCard,
                    borderRadius: 10,
                    border: `1px solid ${colors.warning}40`,
                    opacity: memoryExpand,
                    transform: `translateY(${(1 - memoryExpand) * 20}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.warning,
                      marginBottom: 10,
                      fontFamily: "'Fira Code', monospace",
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>📄</span>
                    MEMORY.md
                  </div>
                  <pre
                    style={{
                      fontSize: 14,
                      color: colors.text,
                      lineHeight: 1.7,
                      fontFamily: "'Fira Code', monospace",
                      margin: 0,
                    }}
                  >
                    {memoryLines.map((line, idx) => (
                      <span
                        key={idx}
                        style={{
                          opacity: idx < lineProgress ? 1 : 0.2,
                          transition: 'opacity 0.1s',
                          display: 'block',
                        }}
                      >
                        {line || ' '}
                      </span>
                    ))}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 标注文字 */}
      <div
        style={{
          marginTop: 24,
          padding: '12px 18px',
          backgroundColor: `${colors.warning}15`,
          borderRadius: 8,
          borderLeft: `4px solid ${colors.warning}`,
          opacity: interpolate(
            frame,
            [T.memoryStart + 120, T.memoryStart + 160],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          ),
        }}
      >
        <div style={{ fontSize: 15, color: colors.text, fontWeight: 600 }}>
          💡 记忆让 Agent 不从零开始
        </div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
          它知道用户关注什么，不需要每次都重新说明
        </div>
      </div>
    </div>
  );
};

// 搜索词对比视图（新增 - 展示记忆驱动决策）
const SearchComparisonView: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  const enterSpring = spring({
    frame: frame - T.searchCompareStart,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const showWithMemory = interpolate(
    frame,
    [T.searchCompareStart + 80, T.searchCompareStart + 140],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const showDiff = interpolate(
    frame,
    [T.searchCompareStart + 200, T.searchCompareStart + 280],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: -290, // Centered (width 580)
        top: 100,
        width: 580,
        opacity: enterSpring,
        transform: `translateX(${(1 - enterSpring) * 60}px)`,
      }}
    >
      <div style={{ fontSize: 22, color: colors.textMuted, marginBottom: 20 }}>
        记忆如何驱动决策？
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 无记忆版本 */}
        <div
          style={{
            backgroundColor: `${colors.error}10`,
            borderRadius: 12,
            border: `2px solid ${colors.error}50`,
            padding: 20,
            opacity: showWithMemory,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ fontSize: 15, color: colors.error, fontWeight: 700 }}>
              没有记忆的 Agent
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15, 15, 26, 0.8)',
              borderRadius: 8,
              padding: '14px 18px',
              fontFamily: "'Fira Code', monospace",
              fontSize: 15,
              color: colors.textMuted,
            }}
          >
            web_search(<span style={{ color: colors.text }}>"AI Agent 进展"</span>)
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: colors.textDark,
            }}
          >
            搜索结果过于宽泛，需要用户进一步筛选
          </div>
        </div>

        {/* vs 标记 */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: colors.textMuted,
            opacity: showWithMemory,
          }}
        >
          vs
        </div>

        {/* 有记忆版本 */}
        <div
          style={{
            backgroundColor: `${colors.success}10`,
            borderRadius: 12,
            border: `2px solid ${colors.success}50`,
            padding: 20,
            opacity: showWithMemory,
            transform: `scale(${0.95 + showDiff * 0.05})`,
            boxShadow: showDiff > 0.5 ? `0 0 30px ${colors.success}30` : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>🧠</span>
            <span style={{ fontSize: 15, color: colors.success, fontWeight: 700 }}>
              有记忆的 Agent（NanoBot）
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15, 15, 26, 0.8)',
              borderRadius: 8,
              padding: '14px 18px',
              fontFamily: "'Fira Code', monospace",
              fontSize: 15,
            }}
          >
            web_search(
            <span style={{ color: colors.text }}>"AI Agent 2025 进展</span>
            <span style={{ color: colors.warning }}> 多模态</span>
            <span style={{ color: colors.text }}>"</span>)
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: colors.textDark,
            }}
          >
            搜索词精准匹配用户关注的
            <span style={{ color: colors.warning, fontWeight: 600 }}>多模态</span>
            方向
          </div>

          {/* 高亮标记 */}
          {showDiff > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                backgroundColor: `${colors.warning}15`,
                borderRadius: 6,
                borderLeft: `3px solid ${colors.warning}`,
              }}
            >
              <span style={{ fontSize: 13, color: colors.warning }}>
                🔍 "多模态"来自 MEMORY.md 的记忆
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 底部总结 */}
      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          opacity: interpolate(
            frame,
            [T.searchCompareStart + 220, T.searchCompareStart + 260],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          ),
        }}
      >
        <span
          style={{
            fontSize: 18,
            color: colors.accent,
            fontWeight: 700,
            fontStyle: 'italic',
          }}
        >
          记忆不是摆设，而是直接影响每一步执行
        </span>
      </div>
    </div>
  );
};

// 循环图视图
const LoopView: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  const enterSpring = spring({
    frame: frame - T.loopStart,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // 技能层亮起（与循环图同时展示）
  const skillsProgress = interpolate(
    frame,
    [T.skillsStart, T.skillsEnd],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      {/* 左侧技能提示 */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 100,
          width: 300,
          opacity: skillsProgress,
        }}
      >
        <div
          style={{
            backgroundColor: `${colors.success}15`,
            borderRadius: 12,
            border: `2px solid ${colors.success}50`,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: colors.success,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>🛠</span>
            技能已就绪
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(15, 15, 26, 0.6)',
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: colors.success,
                fontFamily: "'Fira Code', monospace",
              }}
            >
              deep-research (available)
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              知道有，不知道怎么用 → 一会儿去读
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(15, 15, 26, 0.6)',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: colors.success,
                fontFamily: "'Fira Code', monospace",
              }}
            >
              ppt-maker (available)
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              待调用时读取说明书
            </div>
          </div>
        </div>
      </div>

      {/* 右侧循环图 */}
      <div
        style={{
          position: 'absolute',
          right: 700,
          top: '50%',
          transform: `translateY(-50%) translateX(${(1 - enterSpring) * 100}px)`,
          opacity: enterSpring,
        }}
      >
        <CycleDiagram highlightedStep={0} animateFlow={false} />

        {/* Loop 开始标注 */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              backgroundColor: `${colors.accent}20`,
              borderRadius: 30,
              border: `2px solid ${colors.accent}`,
              opacity: interpolate(
                frame,
                [T.loopStart + 60, T.loopStart + 120],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            <span style={{ fontSize: 20, color: '#ffffff' }}>▶</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: colors.accent }}>
              Agent Loop 开始运转
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// 阶段标签
const PhaseLabel: React.FC<{
  frame: number;
  timeline: typeof TIMELINE;
}> = ({ frame, timeline }) => {
  const T = timeline;

  let label = '';
  let sublabel = '';

  if (frame < T.memoryEnd) {
    label = '上下文组装';
    sublabel = '四层信息叠加';
  } else if (frame < T.searchCompareEnd) {
    label = '记忆驱动决策';
    sublabel = '有记忆 vs 无记忆';
  } else if (frame < T.skillsEnd) {
    label = '技能加载';
    sublabel = '按需读取说明书';
  } else {
    label = '进入循环';
    sublabel = 'Agent Loop 启动';
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        right: 60,
        textAlign: 'right',
      }}
    >
      <div style={{ fontSize: 16, color: colors.accent, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: colors.textMuted }}>
        {sublabel}
      </div>
    </div>
  );
};
