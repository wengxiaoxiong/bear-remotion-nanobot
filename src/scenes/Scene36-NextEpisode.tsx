import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene36NextEpisode: React.FC = () => (
  <StoryboardScene
    part="Part 4 · Teaser"
    title="下集预告"
    subtitle="技能系统与记忆生命周期"
    highlight="技能系统与记忆生命周期"
    body="下一集拆 Skill 声明式扩展与 Memory 流转机制。"
    bullets={["如何声明技能入口", "如何做技能版本治理", "如何做记忆写入与回收"]}
    chips={["Skill DSL", "Lifecycle", "Versioning", "See you"]}
  />
);
