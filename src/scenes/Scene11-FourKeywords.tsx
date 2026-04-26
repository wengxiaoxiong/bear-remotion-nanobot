import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { SCENE11_TIMELINE } from '../lib/durations';

const KEYWORDS = [
  { label: '分层清晰', color: colors.layerIdentity, points: ['身份 → 规范 → 记忆 → 技能', '顺序固定、职责单一', '不会行为规范写在技能文档里'] },
  { label: '常驻与按需结合', color: colors.layerBootstrap, points: ['Bootstrap 常驻 = 底线不丢', 'Skill 分全文/摘要', 'MEMORY.md 浓缩 ≠ 全量历史'] },
  { label: 'Progressive Loading', color: colors.layerMemory, points: ['核心规则常驻', '技能按需扩展', '无限增加 Skill 不爆上下文'] },
  { label: 'Token 可控', color: colors.layerSkills, points: ['该长则长、该短则短', '每层开销可预期', '不会失控'] },
];

export const Scene11FourKeywords: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = SCENE11_TIMELINE;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', left: 58, top: 36, fontSize: 22, color: colors.textDark }}>
        <span style={{ color: colors.textMuted }}>Part 3</span><br />
        <span style={{ color: colors.text, fontSize: 36, fontWeight: 700 }}>为什么说上下文工程"做得好"？</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, maxWidth: 1600, marginTop: 50 }}>
        {KEYWORDS.map((kw, i) => {
          const start = [T.keyword1Start, T.keyword2Start, T.keyword3Start, T.keyword4Start][i];
          const s = spring({ frame: frame - start, fps, config: { damping: 15, stiffness: 120 } });
          if (frame < start - 10) return <div key={i} />;
          const op = interpolate(s, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{ opacity: op, transform: `translateY(${(1 - s) * 30}px)`, padding: '36px 40px', backgroundColor: `${kw.color}10`, border: `1px solid ${kw.color}40`, borderRadius: 16, borderLeft: `6px solid ${kw.color}` }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: kw.color, marginBottom: 20 }}>{kw.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {kw.points.map((p, j) => {
                  const pop = interpolate(frame, [start + 20 + j * 10, start + 35 + j * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                  return <div key={j} style={{ fontSize: 26, color: colors.text, opacity: pop, transform: `translateX(${(1 - pop) * 10}px)` }}>• {p}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 结论 */}
      <div style={{ marginTop: 60, textAlign: 'center', opacity: interpolate(frame, [T.conclusionStart, T.conclusionStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: colors.accent }}>这四点 = 上下文工程最佳实践</div>
        <div style={{ fontSize: 28, color: colors.textMuted, marginTop: 14 }}>如果你自己要设计 Agent 系统，这个分层策略可以直接参考</div>
      </div>
    </AbsoluteFill>
  );
};
