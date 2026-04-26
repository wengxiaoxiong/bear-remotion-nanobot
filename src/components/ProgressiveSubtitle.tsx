import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

interface LineInfo {
  text: string;
  start: number;
  end: number;
}

/**
 * 灏嗘枃妗堟寜鍙ュ瓙鎷嗗垎锛屾瘡琛屼笉瓒呰繃 maxChars 涓瓧
 */
function splitIntoLines(text: string, maxChars: number = 15): string[] {
  if (!text) return [];

  const sentences = text.split(/([銆傦紒锛焅.\!\?])/);
  const lines: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if (!part) continue;

    // 鏍囩偣绗﹀彿
    if (/^[銆傦紒锛焅.\!\?]$/.test(part)) {
      current += part;
      if (current.trim()) {
        lines.push(current.trim());
      }
      current = '';
      continue;
    }

    // 濡傛灉褰撳墠琛屽姞涓婃柊閮ㄥ垎瓒呰繃 maxChars锛屽厛淇濆瓨褰撳墠琛�
    if (current.length + part.length > maxChars && current.length > 0) {
      lines.push(current.trim());
      current = part;
    } else {
      current += part;
    }

    // 濡傛灉鍗曡瓒呰繃 maxChars锛屾寜 maxChars 鎴柇
    while (current.length > maxChars) {
      lines.push(current.slice(0, maxChars));
      current = current.slice(maxChars);
    }
  }

  if (current.trim()) {
    lines.push(current.trim());
  }

  return lines.length > 0 ? lines : [text];
}

/**
 * 璁＄畻姣忚瀛楀箷鐨勬椂闂磋酱
 * 鎸夊瓧鏁版瘮渚嬪垎閰嶅湪鎬绘椂闀垮唴锛岀暀 8% 寮€澶寸紦鍐� + 8% 缁撳熬缂撳啿
 */
function calculateTimings(lines: string[], duration: number): LineInfo[] {
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  if (totalChars === 0) return [];

  const usableDuration = duration * 0.84; // 鐣� 8% 寮€澶� + 8% 缁撳熬缂撳啿
  const startOffset = duration * 0.08;
  const charDuration = usableDuration / totalChars;

  let currentFrame = startOffset;
  return lines.map((text) => {
    const lineDuration = text.length * charDuration;
    const start = currentFrame;
    const end = currentFrame + lineDuration;
    currentFrame = end;
    return { text, start, end };
  });
}

interface ProgressiveSubtitleProps {
  text: string;
  duration: number; // 鍦烘櫙鎬诲抚鏁�
}

export const ProgressiveSubtitle: React.FC<ProgressiveSubtitleProps> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame();
  const lines = splitIntoLines(text, 15);
  const timings = calculateTimings(lines, duration);

  if (timings.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '0 40px',
      }}
    >
      {timings.map((line, i) => {
        const isActive = frame >= line.start && frame < line.end;
        const isPast = frame >= line.end;
        const isFuture = frame < line.start;

        // 娣″叆娣″嚭璁＄畻
        const fadeIn = interpolate(
          frame,
          [line.start - 6, line.start],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const fadeOut = interpolate(
          frame,
          [line.end - 6, line.end],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        let opacity = 0;
        let color = colors.text;
        let fontWeight: React.CSSProperties['fontWeight'] = 400;
        let transform = 'translateY(8px)';

        if (isActive) {
          opacity = Math.min(fadeIn, fadeOut);
          color = colors.text;
          fontWeight = 600;
          transform = 'translateY(0)';
        } else if (isPast) {
          opacity = 0.35;
          color = colors.textMuted;
          fontWeight = 400;
          transform = 'translateY(0)';
        } else {
          opacity = 0;
          transform = 'translateY(8px)';
        }

        return (
          <span
            key={i}
            style={{
              fontSize: 24,
              lineHeight: 1.5,
              color,
              fontFamily: fontStack,
              textAlign: 'center',
              opacity,
              fontWeight,
              transform,
              transition: 'none', // Remotion 鍔ㄧ敾鐢卞抚椹卞姩锛屼笉鐢� CSS transition
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {line.text}
          </span>
        );
      })}
    </div>
  );
};
