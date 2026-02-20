import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene34ArchitectureSummary: React.FC = () => (
  <StoryboardScene
    part="Part 4 · Summary"
    title="架构母板总结"
    subtitle="Context Builder → LLM → Executor → Memory"
    highlight="Context Builder → LLM → Executor → Memory"
    body="这是一种可迁移到多数 Agent 场景的通用结构。"
    bullets={["可插拔工具层", "可演进记忆层", "可观测执行链路"]}
    chips={["Builder", "LLM", "Executor", "Memory"]}
  />
);
