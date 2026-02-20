import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene19OSLevelVsCloud: React.FC = () => (
  <StoryboardScene
    part="Part 2 · 能力对比"
    title="OS-level vs Cloud Agent"
    subtitle="同样是 Agent，战场完全不同"
    highlight="同样是 Agent，战场完全不同"
    body="NanoBot 在你的机器上操作真实文件系统，闭环更短。"
    bullets={["云端：安全隔离但受限", "本地：能力强但需权限治理", "关键是可控的执行边界"]}
    chips={["本地文件", "本机命令", "低延迟", "可组合"]}
  />
);
