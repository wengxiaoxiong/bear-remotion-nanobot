import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Scene03HookConclusion: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(frame, [0, 30], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const q1 = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const q2 = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const q3 = interpolate(frame, [150, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const q4 = interpolate(frame, [260, 320], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* 前面的 Chat 画面淡出 */}
      <div style={{ opacity: fadeOut, position: 'absolute', inset: 0 }} />

      <div style={{ textAlign: 'center', maxWidth: 1400 }}>
        <div style={{ fontSize: 96, fontWeight: 800, color: colors.text, opacity: q1, transform: `translateY(${(1 - q1) * 20}px)`, marginBottom: 50 }}>
          差别在哪？
        </div>
        <div style={{ fontSize: 60, color: colors.textMuted, opacity: q2, marginBottom: 40 }}>
          不是模型能力的差距
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, color: colors.accent, opacity: q3, transform: `scale(${0.9 + q3 * 0.1})`, marginBottom: 50 }}>
          是上下文工程的差距
        </div>
        <div style={{ fontSize: 44, color: colors.text, opacity: q4, lineHeight: 1.6 }}>
          Agent 的"眼睛" = System Prompt + 上下文
        </div>
        <div style={{ marginTop: 70, display: 'flex', gap: 32, justifyContent: 'center', opacity: q4 }}>
          {['分层设计', '记忆生命周期', '三平面架构'].map((tag, i) => (
            <div key={tag} style={{ padding: '16px 36px', borderRadius: 10, backgroundColor: colors.primary + '20', border: `1px solid ${colors.primary}50`, color: colors.primaryLight, fontSize: 32, fontWeight: 700, opacity: interpolate(frame, [320 + i * 20, 350 + i * 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
