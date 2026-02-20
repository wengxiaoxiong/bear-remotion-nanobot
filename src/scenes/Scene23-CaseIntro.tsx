import React from 'react';
import { StoryboardScene } from './SceneShared-Storyboard';

export const Scene23CaseIntro: React.FC = () => (
  <StoryboardScene
    part="Part 3 · Case Study"
    title="实战案例：一句话委托"
    subtitle="“调研 Agent 进展，做 PPT，发群里”"
    highlight="“调研 Agent 进展，做 PPT，发群里”"
    body="用户只说目标，系统自己拆解执行路径。"
    bullets={["输入很短，目标很大", "先规划再执行", "每轮都基于新观察修正"]}
    chips={["需求", "规划", "执行", "交付"]}
  />
);
