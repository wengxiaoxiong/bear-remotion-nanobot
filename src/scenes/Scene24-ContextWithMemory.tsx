import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene24ContextWithMemory: React.FC = () => (
  <StoryboardScene
    part="Part 3 · Case Study"
    title="上下文 + 记忆先就位"
    subtitle="不是从零开始，而是从历史偏好开始"
    highlight="不是从零开始，而是从历史偏好开始"
    body="Memory 让每次决策都带着用户长期习惯。"
    bullets={["读取 MEMORY.md 偏好", "结合近期对话历史", "决定第一轮动作优先级"]}
    chips={["偏好", "历史", "约束", "策略"]}
  />
);
