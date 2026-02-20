import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene22DeliveryNotChat: React.FC = () => (
  <StoryboardScene
    part="Part 2 · 收束"
    title="不是聊天，是交付"
    subtitle="目标是完成任务，不是生成段子"
    highlight="目标是完成任务，不是生成段子"
    body="能落地到文件、脚本、结果物，才叫 Agent。"
    bullets={["输出包含可验证产物", "过程可追溯可复现", "人只负责给目标与约束"]}
    chips={["任务闭环", "可验证", "可复现", "可迭代"]}
  />
);
