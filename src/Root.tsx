import React from 'react';
import { Composition, Folder } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { DEFAULT_DURATIONS, FPS, WIDTH, HEIGHT } from './lib/durations';

import { Scene01Intro } from './scenes/Scene01-Intro';
import { Scene02AgentLoopHighlight } from './scenes/Scene02-AgentLoopHighlight';
import { Scene03Title } from './scenes/Scene03-Title';
import { Scene04PipelineReview } from './scenes/Scene04-PipelineReview';
import { Scene05ContextQuestion } from './scenes/Scene05-ContextQuestion';
import { Scene06ContextAssembly } from './scenes/Scene06-ContextAssembly';
import { Scene11AgentLoopTitle } from './scenes/Scene11-AgentLoopTitle';
import { Scene12AgentLoopBreakdown } from './scenes/Scene12-AgentLoopBreakdown';

const TRANSITION_FRAMES = 15; // 0.5s 过渡

// Part 1 场景列表
const PART1_SCENES = [
  { id: 'Scene01-Intro', component: Scene01Intro },
  { id: 'Scene02-AgentLoopHighlight', component: Scene02AgentLoopHighlight },
  { id: 'Scene03-Title', component: Scene03Title },
  { id: 'Scene04-PipelineReview', component: Scene04PipelineReview },
  { id: 'Scene05-ContextQuestion', component: Scene05ContextQuestion },
  { id: 'Scene06-ContextAssembly', component: Scene06ContextAssembly },
  { id: 'Scene11-AgentLoopTitle', component: Scene11AgentLoopTitle },
  { id: 'Scene12-AgentLoopBreakdown', component: Scene12AgentLoopBreakdown },
] as const;

// 计算 Part 1 总时长（考虑过渡重叠）
const part1TotalDuration = PART1_SCENES.reduce(
  (sum, scene) => sum + (DEFAULT_DURATIONS[scene.id] || 300),
  0,
) - TRANSITION_FRAMES * (PART1_SCENES.length - 1);

/** Part 1 完整合成 */
const EP2Part1: React.FC = () => {
  return (
    <TransitionSeries>
      {PART1_SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        const SceneComponent = scene.component;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneComponent />
            </TransitionSeries.Sequence>
            {i < PART1_SCENES.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 完整 Part 1 合成 */}
      <Composition
        id="EP2-Part1"
        component={EP2Part1}
        durationInFrames={part1TotalDuration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 独立场景（开发预览用） */}
      <Folder name="Scenes">
        {PART1_SCENES.map((scene) => {
          const duration = DEFAULT_DURATIONS[scene.id] || 300;
          return (
            <Composition
              key={scene.id}
              id={scene.id}
              component={scene.component}
              durationInFrames={duration}
              fps={FPS}
              width={WIDTH}
              height={HEIGHT}
            />
          );
        })}
      </Folder>
    </>
  );
};
