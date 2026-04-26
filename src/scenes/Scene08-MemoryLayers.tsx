import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack, codeFontStack } from '../lib/fonts';
import { SCENE08_TIMELINE } from '../lib/durations';

export const Scene08MemoryLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = SCENE08_TIMELINE;

  // MEMORY.md 展开
  const memoryOp = interpolate(frame, [T.memoryIntroStart, T.memoryIntroStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const loopOp = interpolate(frame, [T.memoryLoopStart, T.memoryLoopStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // HISTORY.md 滑入
  const historyX = interpolate(frame, [T.historyIntroStart, T.historyIntroStart + 40], [300, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const historyOp = interpolate(frame, [T.historyIntroStart, T.historyIntroStart + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const noInjectOp = interpolate(frame, [T.historyGrepStart, T.historyGrepStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const grepOp = interpolate(frame, [T.historyGrepStart + 30, T.historyGrepStart + 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 对比表格
  const tableOp = interpolate(frame, [T.compareStart, T.compareStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const analogyOp = interpolate(frame, [T.analogyStart, T.analogyStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 58, top: 36, fontSize: 22, color: colors.textDark }}>
        <span style={{ color: colors.textMuted }}>Part 2</span><br />
        <span style={{ color: colors.text, fontSize: 36, fontWeight: 700 }}>记忆的生命周期</span>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, bottom: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 80 }}>
        {/* MEMORY.md */}
        <div style={{ width: 560, opacity: memoryOp, transform: `translateY(${(1 - memoryOp) * 20}px)` }}>
          <div style={{ padding: '28px 32px', backgroundColor: colors.layerMemory + '15', border: `2px solid ${colors.layerMemory}60`, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 36 }}>📝</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: colors.layerMemory }}>MEMORY.md</span>
              <span style={{ marginLeft: 'auto', fontSize: 18, color: colors.layerMemory, backgroundColor: colors.layerMemory + '20', padding: '6px 14px', borderRadius: 6 }}>Agent 自己在写</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['API Key 已更换为 sk-xxx', '邮件偏好：只发摘要', '项目优先级：NanoBot > 其他'].map((line, i) => {
                const lop = interpolate(frame, [T.memoryIntroStart + 40 + i * 15, T.memoryIntroStart + 55 + i * 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return <div key={i} style={{ padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, fontSize: 22, color: colors.text, fontFamily: codeFontStack, opacity: lop }}>{line}</div>;
              })}
            </div>
          </div>

          {/* 闭环箭头 */}
          <div style={{ marginTop: 28, textAlign: 'center', opacity: loopOp }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', backgroundColor: colors.success + '15', border: `1px solid ${colors.success}40`, borderRadius: 28, color: colors.success, fontSize: 22 }}>
              ↻ Agent 写入 → 下次读取 → 行为影响
            </div>
          </div>
        </div>

        {/* HISTORY.md */}
        <div style={{ width: 560, opacity: historyOp, transform: `translateX(${historyX}px)` }}>
          <div style={{ padding: '28px 32px', backgroundColor: colors.textDark + '15', border: `2px solid ${colors.textDark}40`, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 36 }}>📜</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: colors.textMuted }}>HISTORY.md</span>
              <span style={{ marginLeft: 'auto', fontSize: 18, color: colors.textMuted, backgroundColor: colors.textDark + '20', padding: '6px 14px', borderRadius: 6 }}>系统自动写入</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['[2024-01-15] 用户询问周报写法', '[2024-01-14] Agent 完成架构设计', '[2024-01-13] 用户更换 API Key', '...'].map((line, i) => {
                const lop = interpolate(frame, [T.historyIntroStart + 30 + i * 12, T.historyIntroStart + 45 + i * 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return <div key={i} style={{ padding: '8px 12px', fontSize: 20, color: colors.textMuted, fontFamily: codeFontStack, opacity: lop }}>{line}</div>;
              })}
            </div>
            <div style={{ marginTop: 16, opacity: noInjectOp, display: 'flex', alignItems: 'center', gap: 10, color: colors.error, fontSize: 22 }}>
              <span>❌</span> 不注入 System Prompt（太长）
            </div>
            <div style={{ marginTop: 10, opacity: grepOp, padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, fontFamily: codeFontStack, fontSize: 20, color: colors.accent }}>
              $ grep "上周" HISTORY.md
            </div>
          </div>
        </div>
      </div>

      {/* 对比表格 */}
      <div style={{ position: 'absolute', bottom: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: tableOp }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 24, color: colors.text }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 40px', borderBottom: `2px solid ${colors.border}`, color: colors.layerMemory }}>MEMORY.md</th>
              <th style={{ padding: '12px 40px', borderBottom: `2px solid ${colors.border}`, color: colors.textMuted }}>HISTORY.md</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['📌 存事实', '📝 存日志'],
              ['✏️ Agent 主动写', '🤖 系统自动追加'],
              ['📥 全文注入', '🔍 按需 grep'],
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '10px 40px', textAlign: 'center', color: colors.text }}>{row[0]}</td>
                <td style={{ padding: '10px 40px', textAlign: 'center', color: colors.textMuted }}>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 类比 */}
      <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', opacity: analogyOp }}>
        <span style={{ fontSize: 26, color: colors.textMuted }}>常识 = MEMORY.md</span>
        <span style={{ fontSize: 26, color: colors.textDark, margin: '0 24px' }}>|</span>
        <span style={{ fontSize: 26, color: colors.textMuted }}>日记本 = HISTORY.md</span>
      </div>
    </AbsoluteFill>
  );
};
