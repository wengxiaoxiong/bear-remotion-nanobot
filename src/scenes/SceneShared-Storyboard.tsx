/**
 * Storyboard 通用场景
 */

import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

interface StoryboardSceneProps {
  part: string;
  title: string;
  subtitle: string;
  highlight: string;
  body: string;
  bullets: string[];
  chips: string[];
}

export const StoryboardScene: React.FC<StoryboardSceneProps> = ({
  part,
  title,
  subtitle,
  highlight,
  body,
  bullets,
  chips,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const cardProgress = spring({ frame: frame - 14, fps, config: { damping: 17, stiffness: 110 } });

  const pulse = (Math.sin(frame * 0.045) + 1) * 0.5;
  const backdropOpacity = interpolate(frame, [0, 25], [0.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 18% 20%, ${colors.primary}22, transparent 45%), ${colors.background}`,
        fontFamily: fontStack,
        color: colors.text,
        opacity: backdropOpacity,
      }}
    >
      <div style={{ position: 'absolute', top: 52, left: 64, color: colors.textMuted, fontSize: 20 }}>{part}</div>
      <div
        style={{
          position: 'absolute', top: 88, left: 64, right: 64,
          transform: `translateY(${(1 - titleProgress) * 24}px)`, opacity: titleProgress,
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 900, letterSpacing: 1 }}>{title}</div>
        <div style={{ fontSize: 28, color: colors.accent, marginTop: 8 }}>{subtitle}</div>
      </div>

      <div
        style={{
          position: 'absolute', left: 64, right: 64, top: 250, bottom: 84,
          display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 28,
          transform: `translateY(${(1 - cardProgress) * 16}px)`, opacity: cardProgress,
        }}
      >
        <div style={{ backgroundColor: colors.backgroundCard, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '32px 34px' }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: colors.primaryLight }}>{highlight}</div>
          <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.65, color: colors.textMuted }}>{body}</div>
          <div style={{ marginTop: 28, display: 'grid', gap: 14 }}>
            {bullets.slice(0,3).map((item, i) => {
              const o = interpolate(frame, [34 + i * 10, 54 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const x = interpolate(frame, [34 + i * 10, 54 + i * 10], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return <div key={item} style={{ opacity: o, transform: `translateX(${x}px)`, fontSize: 23, color: colors.text }}>• {item}</div>;
            })}
          </div>
        </div>

        <div style={{ backgroundColor: `${colors.backgroundCard}cc`, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '30px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 24, color: colors.textMuted }}>关键要素</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {chips.slice(0,4).map((chip, i) => {
              const local = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 14, stiffness: 140 } });
              return (
                <div key={chip} style={{
                  borderRadius: 14, padding: '12px 16px',
                  border: `1px solid ${colors.accent}66`, backgroundColor: `${colors.accent}18`,
                  transform: `scale(${0.92 + local * 0.08})`, opacity: local, fontSize: 22,
                }}>
                  {chip}
                </div>
              );
            })}
          </div>
          <div style={{
            alignSelf: 'flex-end', fontSize: 16, color: colors.textDark,
            textShadow: `0 0 ${8 + pulse * 10}px ${colors.accent}55`,
          }}>Agent Loop keeps moving →</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
