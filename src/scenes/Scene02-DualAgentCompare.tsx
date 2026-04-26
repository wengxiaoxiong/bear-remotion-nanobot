import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

const ChatBubble: React.FC<{ text: string; isUser?: boolean; delay: number }> = ({ text, isUser, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 150 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(s, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '90%', padding: '16px 20px', borderRadius: 16, backgroundColor: isUser ? colors.info + '30' : colors.success + '20', border: `1px solid ${isUser ? colors.info + '50' : colors.success + '40'}`, color: colors.text, fontSize: 26, lineHeight: 1.5, marginBottom: 14 }}>
      {text}
    </div>
  );
};

export const Scene02DualAgentCompare: React.FC = () => {
  const frame = useCurrentFrame();

  const leftX = interpolate(frame, [0, 30], [-400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rightX = interpolate(frame, [15, 45], [400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80 }}>
      {/* Agent A */}
      <div style={{ transform: `translateX(${leftX}px)`, width: 520, height: 680, backgroundColor: colors.backgroundCard, borderRadius: 20, border: `1px solid ${colors.border}`, padding: 32, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: colors.textMuted, marginBottom: 28, textAlign: 'center' }}>Agent A</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatBubble text="请帮我写一份周报" isUser delay={40} />
          <ChatBubble text="请提供本周工作内容，我才能帮你写。" delay={100} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 24, color: colors.error, marginTop: 16 }}>❌ 需要反复追问</div>
      </div>

      {/* Agent B */}
      <div style={{ transform: `translateX(${rightX}px)`, width: 520, height: 680, backgroundColor: colors.backgroundCard, borderRadius: 20, border: `1px solid ${colors.success}60`, padding: 32, display: 'flex', flexDirection: 'column', boxShadow: `0 0 40px ${colors.success}20` }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: colors.success, marginBottom: 28, textAlign: 'center' }}>Agent B</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatBubble text="请帮我写一份周报" isUser delay={55} />
          <ChatBubble text="好的，已根据你上周提到的 NanoBot 架构设计进展，生成了本周周报..." delay={115} />
          <div style={{ marginTop: 12, padding: '12px 16px', backgroundColor: colors.warning + '20', borderRadius: 12, border: `1px solid ${colors.warning}50`, color: colors.warning, fontSize: 20, opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            💡 记住了你上周随口提到的项目进展
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 24, color: colors.success, marginTop: 16 }}>✅ 直接写出来</div>
      </div>
    </AbsoluteFill>
  );
};
