import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

const ITEMS = [
  { icon: '🔄', title: '迭代轮数上限', desc: '防止 Agent 陷入死循环', color: colors.error },
  { icon: '🛡️', title: '工具参数校验', desc: '失败以错误字符串返回，不拖垮服务', color: colors.warning },
  { icon: '💾', title: '会话持久化', desc: '重启不丢状态', color: colors.info },
  { icon: '🔒', title: '安全沙箱执行', desc: 'Shell 黑名单 + 路径限制', color: colors.success },
];

export const Scene15StabilityFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 50 }}>
      <div style={{ position: 'absolute', left: 58, top: 36, fontSize: 22, color: colors.textDark }}>
        <span style={{ color: colors.textMuted }}>Part 5</span><br />
        <span style={{ color: colors.text, fontSize: 36, fontWeight: 700 }}>稳定性保障</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, maxWidth: 1200 }}>
        {ITEMS.map((item, i) => {
          const s = spring({ frame: frame - 30 - i * 60, fps, config: { damping: 15, stiffness: 120 } });
          const op = interpolate(s, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{ opacity: op, transform: `scale(${0.9 + s * 0.1})`, padding: '40px 44px', backgroundColor: `${item.color}10`, border: `1px solid ${item.color}40`, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ fontSize: 56 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: item.color, marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 24, color: colors.textMuted }}>{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
