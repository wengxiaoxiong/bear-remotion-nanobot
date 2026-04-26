import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

const EPISODES = [
  { num: 'EP1', title: '为什么智能', color: colors.layerIdentity, points: ['多轮推理循环', '主动执行', '声明式扩展', '分层上下文'] },
  { num: 'EP2', title: 'Proactive 和 Skill', color: colors.layerBootstrap, points: ['Heartbeat + Cron', '统一管线', 'Skill 渐进加载', 'OS-level 能力'] },
  { num: 'EP3', title: '上下文工程与架构', color: colors.layerSkills, points: ['四层千层饼', '记忆分两层', '三平面架构', '稳定性保障'], highlight: true },
];

export const Scene17SeriesReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: colors.text, marginBottom: 30 }}>三集内容回顾</div>
      <div style={{ display: 'flex', gap: 50 }}>
        {EPISODES.map((ep, i) => {
          const s = spring({ frame: frame - 30 - i * 40, fps, config: { damping: 15, stiffness: 120 } });
          const op = interpolate(s, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{ opacity: op, transform: `translateY(${(1 - s) * 30}px)`, width: 400, padding: '36px 30px', backgroundColor: ep.highlight ? `${ep.color}18` : colors.backgroundCard, border: `2px solid ${ep.highlight ? ep.color : colors.border}`, borderRadius: 20, boxShadow: ep.highlight ? `0 0 40px ${ep.color}25` : 'none' }}>
              <div style={{ fontSize: 24, color: ep.color, fontWeight: 700, marginBottom: 12 }}>{ep.num}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, marginBottom: 20 }}>{ep.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ep.points.map((p, j) => (
                  <div key={j} style={{ fontSize: 22, color: colors.textMuted }}>• {p}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
