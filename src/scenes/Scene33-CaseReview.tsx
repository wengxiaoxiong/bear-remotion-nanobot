import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene33CaseReview: React.FC = () => (
  <StoryboardScene
    part="Part 3 · Review"
    title="复盘：为什么能跑通？"
    subtitle="Context × Loop × Tool 三者闭环"
    highlight="Context × Loop × Tool 三者闭环"
    body="不是一次回答，而是连续决策系统。"
    bullets={["上下文提供方向", "循环负责试错", "工具负责落地"]}
    chips={["Context", "Loop", "Tool", "Outcome"]}
  />
);
