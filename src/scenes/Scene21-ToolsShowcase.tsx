import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene21ToolsShowcase: React.FC = () => (
  <StoryboardScene
    part="Part 2 · 武器库"
    title="工具箱展开"
    subtitle="文件 + 命令 + 检索 = 可交付"
    highlight="文件 + 命令 + 检索 = 可交付"
    body="工具不是装饰，是让 LLM 具备“手和脚”。"
    bullets={["read/write/append/delete", "exec 调用现有 CLI 生态", "message 回传结果到会话"]}
    chips={["CRUD", "exec", "web", "message"]}
  />
);
