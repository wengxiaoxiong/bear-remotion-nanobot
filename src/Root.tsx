import React from 'react';
import { Composition, Folder } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { DEFAULT_DURATIONS, FPS, HEIGHT, WIDTH } from './lib/durations';

import { Scene01Intro } from './scenes/Scene01-Intro';
import { Scene02AgentLoopHighlight } from './scenes/Scene02-AgentLoopHighlight';
import { Scene03Title } from './scenes/Scene03-Title';
import { Scene04PipelineReview } from './scenes/Scene04-PipelineReview';
import { Scene05ContextQuestion } from './scenes/Scene05-ContextQuestion';
import { Scene06ContextAssembly } from './scenes/Scene06-ContextAssembly';
import { Scene11AgentLoopTitle } from './scenes/Scene11-AgentLoopTitle';
import { Scene12AgentLoopBreakdown } from './scenes/Scene12-AgentLoopBreakdown';
import { Scene18ToolsWhere } from './scenes/Scene18-ToolsWhere';
import { Scene19OSLevelVsCloud } from './scenes/Scene19-OSLevelVsCloud';
import { Scene21ToolsShowcase } from './scenes/Scene21-ToolsShowcase';
import { Scene22DeliveryNotChat } from './scenes/Scene22-DeliveryNotChat';
import { Scene23CaseIntro } from './scenes/Scene23-CaseIntro';
import { Scene24ContextWithMemory } from './scenes/Scene24-ContextWithMemory';
import { Scene26SevenRounds } from './scenes/Scene26-SevenRounds';
import { Scene33CaseReview } from './scenes/Scene33-CaseReview';
import { Scene34ArchitectureSummary } from './scenes/Scene34-ArchitectureSummary';
import { Scene35OSLevelValue } from './scenes/Scene35-OSLevelValue';
import { Scene36NextEpisode } from './scenes/Scene36-NextEpisode';

const TRANSITION_FRAMES = 15;

const EP2_SCENES = [
  { id: 'Scene01-Intro', component: Scene01Intro },
  { id: 'Scene02-AgentLoopHighlight', component: Scene02AgentLoopHighlight },
  { id: 'Scene03-Title', component: Scene03Title },
  { id: 'Scene04-PipelineReview', component: Scene04PipelineReview },
  { id: 'Scene05-ContextQuestion', component: Scene05ContextQuestion },
  { id: 'Scene06-ContextAssembly', component: Scene06ContextAssembly },
  { id: 'Scene11-AgentLoopTitle', component: Scene11AgentLoopTitle },
  { id: 'Scene12-AgentLoopBreakdown', component: Scene12AgentLoopBreakdown },
  { id: 'Scene18-ToolsWhere', component: Scene18ToolsWhere },
  { id: 'Scene19-OSLevelVsCloud', component: Scene19OSLevelVsCloud },
  { id: 'Scene21-ToolsShowcase', component: Scene21ToolsShowcase },
  { id: 'Scene22-DeliveryNotChat', component: Scene22DeliveryNotChat },
  { id: 'Scene23-CaseIntro', component: Scene23CaseIntro },
  { id: 'Scene24-ContextWithMemory', component: Scene24ContextWithMemory },
  { id: 'Scene26-SevenRounds', component: Scene26SevenRounds },
  { id: 'Scene33-CaseReview', component: Scene33CaseReview },
  { id: 'Scene34-ArchitectureSummary', component: Scene34ArchitectureSummary },
  { id: 'Scene35-OSLevelValue', component: Scene35OSLevelValue },
  { id: 'Scene36-NextEpisode', component: Scene36NextEpisode },
] as const;


const PART1_SCENES = EP2_SCENES.slice(0, 8);

const part1TotalDuration =
  PART1_SCENES.reduce((sum, scene) => sum + (DEFAULT_DURATIONS[scene.id] || 300), 0) -
  TRANSITION_FRAMES * (PART1_SCENES.length - 1);

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
            {i < PART1_SCENES.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

const ep2TotalDuration =
  EP2_SCENES.reduce((sum, scene) => sum + (DEFAULT_DURATIONS[scene.id] || 300), 0) -
  TRANSITION_FRAMES * (EP2_SCENES.length - 1);

const EP2Full: React.FC = () => {
  return (
    <TransitionSeries>
      {EP2_SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        const SceneComponent = scene.component;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneComponent />
            </TransitionSeries.Sequence>
            {i < EP2_SCENES.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EP2"
        component={EP2Full}
        durationInFrames={ep2TotalDuration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Composition
        id="EP2-Part1"
        component={EP2Part1}
        durationInFrames={part1TotalDuration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Folder name="Scenes">
        {EP2_SCENES.map((scene) => {
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
