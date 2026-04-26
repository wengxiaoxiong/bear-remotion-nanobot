import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { colors } from '../lib/utils';
import { fontStack, codeFontStack } from '../lib/fonts';
import { SCENE05_TIMELINE } from '../lib/durations';
import { CodeBlock } from '../components/CodeBlock';

const LAYERS = [
  { label: '身份 Identity', color: colors.layerIdentity, icon: '🪪', details: ['我是谁', '当前时间', 'Workspace 路径', 'MEMORY.md / HISTORY.md 位置'], digest: '这一层是所有后续能力的基础' },
  { label: '规范 Bootstrap', color: colors.layerBootstrap, icon: '📋', files: ['AGENTS.md', 'SOUL.md', 'USER.md'], details: ['行为规范', '人格定义', '用户偏好'], digest: '不会因为聊久了就忘了自己是谁' },
  { label: '记忆 Memory', color: colors.layerMemory, icon: '🧠', details: ['MEMORY.md', 'Agent 自己维护', '浓缩记事本'], digest: '比全量历史省太多 token' },
  { label: '技能 Skills', color: colors.layerSkills, icon: '🛠️', details: ['always 技能全文', '其他技能摘要', '按需 read_file'], digest: '按需加载，不爆上下文' },
];

const BUILD_CODE = `// 四层拼装 System Prompt
function build_system_prompt():
  prompt = ""
  prompt += identity()          // 第一层
  prompt += read("AGENTS.md")   // 第二层
  prompt += read("SOUL.md")
  prompt += read("USER.md")
  prompt += read("MEMORY.md")   // 第三层
  prompt += skills_summary()    // 第四层
  return prompt

messages = [
  {role: "system", content: prompt},
  ...session.history.slice(-N),
  {role: "user", content: current_msg}
]`;

export const Scene05ContextAssembly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = SCENE05_TIMELINE;

  const stackShift = interpolate(frame, [0, T.skillsEnd], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mergeProgress = interpolate(frame, [T.mergeStart, T.mergeEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const codeOpacity = interpolate(frame, [T.codeStart - 10, T.codeStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const conclusionOpacity = interpolate(frame, [T.conclusionStart, T.conclusionStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fontStack, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 58, top: 36, fontSize: 22, color: colors.textDark }}>
        <span style={{ color: colors.textMuted }}>Part 1</span><br />
        <span style={{ color: colors.text, fontSize: 36, fontWeight: 700 }}>上下文组装</span>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: codeOpacity > 0.1 ? 40 : 0, alignItems: 'flex-start', transform: `translateY(${stackShift}px)` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: mergeProgress > 0 ? interpolate(mergeProgress, [0, 1], [16, 4]) : 16, width: 820 }}>
            <div style={{ fontSize: 24, color: colors.textMuted, textAlign: 'center', marginBottom: 8 }}>System Prompt</div>
            {LAYERS.map((layer, i) => {
              const enter = [T.identityStart, T.bootstrapStart, T.memoryStart, T.skillsStart][i];
              const s = spring({ frame: frame - enter, fps, config: { damping: 15, stiffness: 120 } });
              if (frame < enter) return null;
              const op = interpolate(s, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const compact = Math.min(Math.max(mergeProgress, 0), 1);
              const bodyOp = 1 - compact;
              const bodyH = interpolate(compact, [0, 1], [220, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const digestStart = enter + 120;
              const digestOp = interpolate(frame, [digestStart, digestStart + 15, digestStart + 300, digestStart + 350], [0, 1, 1, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

              return (
                <div key={i} style={{ borderLeft: `6px solid ${layer.color}`, backgroundColor: `${layer.color}10`, borderRadius: 12, padding: `${interpolate(compact, [0, 1], [22, 10])}px ${interpolate(compact, [0, 1], [28, 20])}px`, opacity: op, transform: `translateY(${(1 - s) * 20}px)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: interpolate(compact, [0, 1], [14, 0]) }}>
                    <span style={{ fontSize: 32 }}>{layer.icon}</span>
                    <span style={{ fontSize: 30, fontWeight: 700, color: layer.color }}>{layer.label}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, opacity: bodyOp, maxHeight: bodyH, overflow: 'hidden' }}>
                    {layer.details.map((d, j) => {
                      const dop = interpolate(frame, [enter + 20 + j * 6, enter + 30 + j * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                      return <span key={j} style={{ display: 'inline-block', padding: '8px 16px', fontSize: 20, color: colors.text, backgroundColor: `${layer.color}18`, border: `1px solid ${layer.color}30`, borderRadius: 6, opacity: dop, transform: `translateY(${(1 - dop) * 6}px)` }}>{d}</span>;
                    })}
                  </div>
                  {'files' in layer && layer.files && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 10, opacity: bodyOp, maxHeight: bodyH, overflow: 'hidden' }}>
                      {layer.files.map((f, j) => {
                        const fop = interpolate(frame, [enter + 40 + j * 10, enter + 55 + j * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                        return <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', backgroundColor: `${layer.color}15`, borderRadius: 6, fontSize: 18, color: layer.color, fontFamily: codeFontStack, opacity: fop }}>📄 {f}</div>;
                      })}
                    </div>
                  )}
                  <div style={{ marginTop: 10, fontSize: 24, color: colors.accent, fontStyle: 'italic', opacity: digestOp * bodyOp, maxHeight: bodyH, overflow: 'hidden' }}>{layer.digest}</div>
                </div>
              );
            })}
          </div>

          <div style={{ opacity: codeOpacity, width: 700, flexShrink: 0, transform: `translateX(${(1 - codeOpacity) * 40}px)` }}>
            <div style={{ fontSize: 22, color: colors.textDark, marginBottom: 10, textAlign: 'center' }}>build_messages()</div>
            <CodeBlock code={BUILD_CODE} startFrame={0} revealDuration={90} />
          </div>
        </div>
      </div>

      {/* 结论 */}
      <div style={{ position: 'absolute', bottom: 160, left: 0, right: 0, textAlign: 'center', opacity: conclusionOpacity }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: colors.accent }}>顺序即优先级</div>
        <div style={{ fontSize: 32, color: colors.textMuted, marginTop: 14 }}>靠前的内容影响力更大</div>
      </div>
    </AbsoluteFill>
  );
};
