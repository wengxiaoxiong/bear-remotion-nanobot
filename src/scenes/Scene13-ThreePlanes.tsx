import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';
import { SCENE13_TIMELINE } from '../lib/durations';

const PLANES = [
  { label: '调度平面', sub: '决定何时动', color: '#f97316', items: ['用户消息触发', 'Cron 定时任务', 'Heartbeat 心跳', '子任务回报/唤醒'] },
  { label: '控制平面', sub: '决定看什么、怎么想', color: '#22c55e', items: ['System Prompt 构建', '记忆生命周期', '上下文压缩策略', 'Agent 核心循环'] },
  { label: '执行平面', sub: '决定能做什么', color: '#06b6d4', items: ['文件读写', 'Shell / 网络请求', '发消息 / 通知', '子 Agent 派发'] },
];

export const Scene13ThreePlanes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = SCENE13_TIMELINE;

  const activePlane = frame < T.controlStart ? 0 : frame < T.executionStart ? 1 : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 58, top: 36, fontSize: 22, color: colors.textDark }}>
        <span style={{ color: colors.textMuted }}>Part 4</span><br />
        <span style={{ color: colors.text, fontSize: 36, fontWeight: 700 }}>三平面整体架构</span>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, bottom: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50, perspective: 1000 }}>
        {PLANES.map((plane, i) => {
          const start = [T.orchestrationStart, T.controlStart, T.executionStart][i];
          const s = spring({ frame: frame - start, fps, config: { damping: 15, stiffness: 120 } });
          if (frame < start - 10) return null;
          const op = interpolate(s, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isActive = i === activePlane;
          const scale = isActive ? 1.05 : 0.95;
          const z = isActive ? 0 : -50;

          return (
            <div key={i} style={{ opacity: op, transform: `translateZ(${z}px) scale(${scale}) rotateX(5deg)`, width: 440, padding: '36px 30px', backgroundColor: `${plane.color}12`, border: `2px solid ${isActive ? plane.color : plane.color + '40'}`, borderRadius: 20, boxShadow: isActive ? `0 0 50px ${plane.color}30` : 'none', transition: 'all 0.3s' }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: plane.color, marginBottom: 8 }}>{plane.label}</div>
              <div style={{ fontSize: 22, color: colors.textMuted, marginBottom: 24 }}>{plane.sub}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plane.items.map((item, j) => {
                  const iop = interpolate(frame, [start + 20 + j * 12, start + 35 + j * 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                  return <div key={j} style={{ padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 8, fontSize: 22, color: colors.text, opacity: iop }}>{item}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* LLM 贯穿层 */}
      <div style={{ position: 'absolute', left: '50%', top: 100, bottom: 160, width: 4, background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`, opacity: interpolate(frame, [T.llmLayerStart, T.llmLayerStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', padding: '8px 20px', backgroundColor: colors.primary + '30', borderRadius: 24, color: colors.primaryLight, fontSize: 20, fontWeight: 700, opacity: interpolate(frame, [T.llmLayerStart, T.llmLayerStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        LLM 层 —— 贯穿三个平面的"大脑"
      </div>

      {/* 多通道 */}
      <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24, opacity: interpolate(frame, [T.multiChannelStart, T.multiChannelStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        {['Telegram', 'Discord', '飞书', 'Slack'].map((p, i) => (
          <div key={p} style={{ padding: '10px 20px', backgroundColor: colors.backgroundCard, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.textMuted, fontSize: 18, opacity: interpolate(frame, [T.multiChannelStart + i * 10, T.multiChannelStart + i * 10 + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            {p}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
