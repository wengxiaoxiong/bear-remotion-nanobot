import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene18ToolsWhere: React.FC = () => (
  <StoryboardScene
    part="Part 2 · OS-level Agent"
    title="工具到底跑在哪？"
    subtitle="云端沙箱 vs 本地系统边界"
    highlight="云端沙箱 vs 本地系统边界"
    body="这些能力不在聊天框里，而在你的操作系统里。"
    bullets={["工具不是“回答”，而是“动作”", "动作必须有执行上下文", "上下文决定了上限和风险"]}
    chips={["提问", "调工具", "读写文件", "执行命令"]}
  />
);
