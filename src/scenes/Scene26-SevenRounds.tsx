import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene26SevenRounds: React.FC = () => (
  <StoryboardScene
    part="Part 3 · Iteration"
    title="七轮循环完成任务"
    subtitle="搜索、失败、重试、生成、发送"
    highlight="搜索、失败、重试、生成、发送"
    body="Loop 的价值：允许犯错并自愈，直到达成目标。"
    bullets={["Round1 学技能说明", "Round3 抓取失败后改源", "Round6 生成 PPT，Round7 回传"]}
    chips={["7 Rounds", "Self-heal", "Tool-use", "Done"]}
  />
);
