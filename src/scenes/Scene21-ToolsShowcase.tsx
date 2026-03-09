/**
 * Scene21-ToolsShowcase: 九宫格展示9个工具
 * 600帧/20秒
 * 按类别依次亮起：文件(4) → Shell(1) → Web(2) → 通信(1) → 子任务(1)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

const TOOLS = [
  // 文件类 (4个)
  {
    icon: '📖',
    name: 'read_file',
    desc: '读取文件内容',
    category: 'file',
    color: colors.primary,
  },
  {
    icon: '✏️',
    name: 'write_file',
    desc: '写入/修改文件',
    category: 'file',
    color: colors.primary,
  },
  {
    icon: '🗂️',
    name: 'list_dir',
    desc: '列出目录内容',
    category: 'file',
    color: colors.primary,
  },
  {
    icon: '📁',
    name: 'search_files',
    desc: '搜索文件内容',
    category: 'file',
    color: colors.primary,
  },
  // Shell类 (1个)
  {
    icon: '💻',
    name: 'exec',
    desc: '执行 Shell 命令',
    category: 'shell',
    color: colors.accent,
    note: '你装了什么就能用什么',
  },
  // Web类 (2个)
  {
    icon: '🔍',
    name: 'web_search',
    desc: '网页搜索',
    category: 'web',
    color: colors.info,
  },
  {
    icon: '🌐',
    name: 'web_fetch',
    desc: '抓取网页内容',
    category: 'web',
    color: colors.info,
  },
  // 通信类 (1个)
  {
    icon: '💬',
    name: 'message',
    desc: '发送消息',
    category: 'comm',
    color: colors.warning,
  },
  // 子任务类 (1个)
  {
    icon: '🔄',
    name: 'delegate',
    desc: '委派子任务',
    category: 'task',
    color: colors.success,
  },
];

const CATEGORY_ORDER = ['file', 'shell', 'web', 'comm', 'task'];
const CATEGORY_NAMES: Record<string, string> = {
  file: '文件操作',
  shell: 'Shell 命令',
  web: 'Web 工具',
  comm: '通信',
  task: '子任务',
};

export const Scene21ToolsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleSpring = spring({
    frame,
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
        paddingTop: 60,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          textAlign: 'center',
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
          marginBottom: 40,
        }}
      >
        <span style={{ fontSize: 22, color: colors.textMuted }}>Part 2</span>
        <br />
        <span style={{ fontSize: 38, fontWeight: 700, color: colors.text }}>
          工具一览
        </span>
      </div>

      {/* 九宫格 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 280px)',
          gridTemplateRows: 'repeat(3, 160px)',
          gap: 24,
        }}
      >
        {TOOLS.map((tool, index) => {
          // 计算该工具的入场时间
          const categoryIndex = CATEGORY_ORDER.indexOf(tool.category);
          const prevCategories = TOOLS.filter(
            (t) => CATEGORY_ORDER.indexOf(t.category) < categoryIndex
          ).length;
          const categoryPosition = TOOLS.filter(
            (t, i) => t.category === tool.category && i < index
          ).length;

          const delay = prevCategories * 15 + categoryPosition * 8 + 30;

          const toolSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          const opacity = toolSpring;
          const scale = interpolate(toolSpring, [0, 1], [0.8, 1]);

          return (
            <div
              key={tool.name}
              style={{
                backgroundColor: colors.backgroundCard,
                borderRadius: 16,
                border: `2px solid ${tool.color}40`,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity,
                transform: `scale(${scale})`,
                boxShadow: `0 0 20px ${tool.color}10`,
              }}
            >
              <div style={{ fontSize: 40 }}>{tool.icon}</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: tool.color,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {tool.name}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: colors.textMuted,
                  textAlign: 'center',
                }}
              >
                {tool.desc}
              </div>
              {tool.note && (
                <div
                  style={{
                    fontSize: 13,
                    color: colors.accent,
                    marginTop: 4,
                    fontStyle: 'italic',
                  }}
                >
                  {tool.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 类别标签 */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          marginTop: 40,
        }}
      >
        {CATEGORY_ORDER.map((cat, i) => {
          const delay = 30 + i * 15 + 100;
          const labelOpacity = interpolate(
            frame,
            [delay, delay + 15],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const catTools = TOOLS.filter((t) => t.category === cat);
          const color = catTools[0]?.color || colors.text;

          return (
            <div
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: labelOpacity,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
              />
              <span style={{ fontSize: 16, color: colors.textMuted }}>
                {CATEGORY_NAMES[cat]}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: color,
                  fontWeight: 700,
                }}
              >
                {catTools.length}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
