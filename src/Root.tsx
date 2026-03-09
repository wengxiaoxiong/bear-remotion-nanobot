import React from 'react';
import { Composition, Folder } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { DEFAULT_DURATIONS, FPS, WIDTH, HEIGHT } from './lib/durations';

// Part 1 场景
import { Scene01Intro } from './scenes/Scene01-Intro';
import { Scene02AgentLoopHighlight } from './scenes/Scene02-AgentLoopHighlight';
import { Scene03Title } from './scenes/Scene03-Title';
import { Scene04PipelineReview } from './scenes/Scene04-PipelineReview';
import { Scene05ContextQuestion } from './scenes/Scene05-ContextQuestion';
import { Scene06ContextAssembly } from './scenes/Scene06-ContextAssembly';
import { Scene11AgentLoopTitle } from './scenes/Scene11-AgentLoopTitle';
import { Scene12AgentLoopBreakdown } from './scenes/Scene12-AgentLoopBreakdown';

// Part 2 场景
import { Scene18ToolsWhere } from './scenes/Scene18-ToolsWhere';
import { Scene19OSLevelVsCloud } from './scenes/Scene19-OSLevelVsCloud';
import { Scene21ToolsShowcase } from './scenes/Scene21-ToolsShowcase';
import { Scene22DeliveryNotChat } from './scenes/Scene22-DeliveryNotChat';

// Part 3 场景
import { Scene23CaseIntro } from './scenes/Scene23-CaseIntro';
import { Scene24ContextWithMemory } from './scenes/Scene24-ContextWithMemory';
import { Scene26SevenRounds } from './scenes/Scene26-SevenRounds';
import { Scene33CaseReview } from './scenes/Scene33-CaseReview';

// Part 4 场景
import { Scene34ArchitectureSummary } from './scenes/Scene34-ArchitectureSummary';
import { Scene35OSLevelValue } from './scenes/Scene35-OSLevelValue';
import { Scene36NextEpisode } from './scenes/Scene36-NextEpisode';

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

// Part 2 场景列表
const PART2_SCENES = [
  { id: 'Scene18-ToolsWhere', component: Scene18ToolsWhere },
  { id: 'Scene19-OSLevelVsCloud', component: Scene19OSLevelVsCloud },
  { id: 'Scene21-ToolsShowcase', component: Scene21ToolsShowcase },
  { id: 'Scene22-DeliveryNotChat', component: Scene22DeliveryNotChat },
] as const;

// Part 3 场景列表
const PART3_SCENES = [
  { id: 'Scene23-CaseIntro', component: Scene23CaseIntro },
  { id: 'Scene24-ContextWithMemory', component: Scene24ContextWithMemory },
  { id: 'Scene26-SevenRounds', component: Scene26SevenRounds },
  { id: 'Scene33-CaseReview', component: Scene33CaseReview },
] as const;

// Part 4 场景列表
const PART4_SCENES = [
  { id: 'Scene34-ArchitectureSummary', component: Scene34ArchitectureSummary },
  { id: 'Scene35-OSLevelValue', component: Scene35OSLevelValue },
  { id: 'Scene36-NextEpisode', component: Scene36NextEpisode },
] as const;

// 所有场景
const ALL_SCENES = [...PART1_SCENES, ...PART2_SCENES, ...PART3_SCENES, ...PART4_SCENES];

// 计算 Part 1 总时长（考虑过渡重叠）
const calcTotalDuration = (scenes: readonly { id: string; component: React.FC }[]) =>
  scenes.reduce(
    (sum, scene) => sum + (DEFAULT_DURATIONS[scene.id] || 300),
    0,
  ) - TRANSITION_FRAMES * (scenes.length - 1);

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

/** Part 2 完整合成 */
const EP2Part2: React.FC = () => {
  return (
    <TransitionSeries>
      {PART2_SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        const SceneComponent = scene.component;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneComponent />
            </TransitionSeries.Sequence>
            {i < PART2_SCENES.length - 1 && (
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

/** Part 3 完整合成 */
const EP2Part3: React.FC = () => {
  return (
    <TransitionSeries>
      {PART3_SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        const SceneComponent = scene.component;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneComponent />
            </TransitionSeries.Sequence>
            {i < PART3_SCENES.length - 1 && (
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

/** Part 4 完整合成 */
const EP2Part4: React.FC = () => {
  return (
    <TransitionSeries>
      {PART4_SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        const SceneComponent = scene.component;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneComponent />
            </TransitionSeries.Sequence>
            {i < PART4_SCENES.length - 1 && (
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

/** 完整 EP2 */
const EP2Full: React.FC = () => {
  return (
    <TransitionSeries>
      {ALL_SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        const SceneComponent = scene.component;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneComponent />
            </TransitionSeries.Sequence>
            {i < ALL_SCENES.length - 1 && (
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
      {/* 完整 EP2 合成 */}
      <Composition
        id="EP2-Full"
        component={EP2Full}
        durationInFrames={calcTotalDuration(ALL_SCENES)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 各 Part 合成 */}
      <Composition
        id="EP2-Part1"
        component={EP2Part1}
        durationInFrames={calcTotalDuration(PART1_SCENES)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="EP2-Part2"
        component={EP2Part2}
        durationInFrames={calcTotalDuration(PART2_SCENES)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="EP2-Part3"
        component={EP2Part3}
        durationInFrames={calcTotalDuration(PART3_SCENES)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="EP2-Part4"
        component={EP2Part4}
        durationInFrames={calcTotalDuration(PART4_SCENES)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 独立场景（开发预览用） */}
      <Folder name="Scenes">
        {ALL_SCENES.map((scene) => {
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

      {/* 按 Part 分组的场景 */}
      <Folder name="Part1">
        {PART1_SCENES.map((scene) => {
          const duration = DEFAULT_DURATIONS[scene.id] || 300;
          return (
            <Composition
              key={scene.id}
              id={`P1-${scene.id}`}
              component={scene.component}
              durationInFrames={duration}
              fps={FPS}
              width={WIDTH}
              height={HEIGHT}
            />
          );
        })}
      </Folder>

      <Folder name="Part2">
        {PART2_SCENES.map((scene) => {
          const duration = DEFAULT_DURATIONS[scene.id] || 300;
          return (
            <Composition
              key={scene.id}
              id={`P2-${scene.id}`}
              component={scene.component}
              durationInFrames={duration}
              fps={FPS}
              width={WIDTH}
              height={HEIGHT}
            />
          );
        })}
      </Folder>

      <Folder name="Part3">
        {PART3_SCENES.map((scene) => {
          const duration = DEFAULT_DURATIONS[scene.id] || 300;
          return (
            <Composition
              key={scene.id}
              id={`P3-${scene.id}`}
              component={scene.component}
              durationInFrames={duration}
              fps={FPS}
              width={WIDTH}
              height={HEIGHT}
            />
          );
        })}
      </Folder>

      <Folder name="Part4">
        {PART4_SCENES.map((scene) => {
          const duration = DEFAULT_DURATIONS[scene.id] || 300;
          return (
            <Composition
              key={scene.id}
              id={`P4-${scene.id}`}
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
