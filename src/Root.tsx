import React from 'react';
import { Composition, Folder, Audio, staticFile, AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { DEFAULT_DURATIONS, FPS, WIDTH, HEIGHT } from './lib/durations';
import { SCENE_SUBTITLE_SEGMENTS } from './lib/subtitleSegments';
import { colors } from './lib/utils';
import { fontStack } from './lib/fonts';
import { SingleLineSubtitle } from './components/SingleLineSubtitle';

import {
  Scene01Intro,
  Scene02DualAgentCompare,
  Scene03HookConclusion,
  Scene05ContextAssembly,
  Scene08MemoryLayers,
  Scene11FourKeywords,
  Scene13ThreePlanes,
  Scene15StabilityFlash,
  Scene17SeriesReview,
  Scene18CodeCompare,
  Scene19Outro,
} from './scenes';

const TRANSITION_FRAMES = 15;

const SCENES = [
  { id: 'Scene01-Intro', component: Scene01Intro, scriptKey: 'Scene01-Intro', transition: fade() },
  { id: 'Scene02-DualAgentCompare', component: Scene02DualAgentCompare, scriptKey: 'Scene02-DualAgentCompare', transition: fade() },
  { id: 'Scene03-HookConclusion', component: Scene03HookConclusion, scriptKey: 'Scene03-HookConclusion', transition: wipe({ direction: 'from-right' }) },
  { id: 'Scene05-ContextAssembly', component: Scene05ContextAssembly, scriptKey: 'Scene05-ContextAssembly', transition: fade() },
  { id: 'Scene08-MemoryLayers', component: Scene08MemoryLayers, scriptKey: 'Scene08-MemoryLayers', transition: slide({ direction: 'from-bottom' }) },
  { id: 'Scene11-FourKeywords', component: Scene11FourKeywords, scriptKey: 'Scene11-FourKeywords', transition: fade() },
  { id: 'Scene13-ThreePlanes', component: Scene13ThreePlanes, scriptKey: 'Scene13-ThreePlanes', transition: wipe({ direction: 'from-left' }) },
  { id: 'Scene15-StabilityFlash', component: Scene15StabilityFlash, scriptKey: 'Scene15-StabilityFlash', transition: fade() },
  { id: 'Scene17-SeriesReview', component: Scene17SeriesReview, scriptKey: 'Scene17-SeriesReview', transition: fade() },
  { id: 'Scene18-CodeCompare', component: Scene18CodeCompare, scriptKey: 'Scene18-CodeCompare', transition: fade() },
  { id: 'Scene19-Outro', component: Scene19Outro, scriptKey: 'Scene19-Outro', transition: fade() },
] as const;

const totalDuration = SCENES.reduce(
  (sum, scene) => sum + (DEFAULT_DURATIONS[scene.id] || 300),
  0,
) - TRANSITION_FRAMES * (SCENES.length - 1);

/**
 * 鍦烘櫙鍖呰鍣細鍔ㄧ敾灞?+ 闊抽灞?+ 瀛楀箷灞傦紙涓夊眰鍒嗙锛屾棤鍗＄墖鍖栵級
 *
 * 甯冨眬璇存槑锛? * - 鏁翠釜鍦烘櫙浣跨敤缁熶竴鐨?colors.background 鑳屾櫙
 * - 鍔ㄧ敾鍐呭鍗犳弧鍏ㄥ睆锛堜笉鍗曠嫭鐣欏瓧骞曞尯鍩燂紝瀛楀箷閫氳繃娓愬彉閬僵鍙犲姞锛? * - 搴曢儴鏈変粠鑳屾櫙鑹插埌閫忔槑鐨勬笎鍙橀伄缃╋紝纭繚鏂囧瓧鍙
 * - 瀛楀箷鎸夊彛鎾搴忛€愬彞楂樹寒鍑虹幇锛屾棤鍓嶅彞鏃朵笉鏄剧ず
 * - 瀛楀箷浣滀负鍦烘櫙鍐呴儴缁勪欢锛岃窡闅?TransitionSeries 鑷劧杩囨浮锛屼笉鍫嗗彔
 */
const SceneWithLayers: React.FC<{
  SceneComponent: React.FC;
  sceneId: string;
  duration: number;
}> = ({ SceneComponent, sceneId, duration }) => {
  const segments = SCENE_SUBTITLE_SEGMENTS[sceneId] || [];
  const audioPath = `audio/${sceneId}.mp3`;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        overflow: 'hidden',
      }}
    >
      {/* === 鍔ㄧ敾灞傦細鍗犳弧鍏ㄥ睆 === */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <SceneComponent />
      </div>

      {/* === 闊抽灞?=== */}
      <Audio src={staticFile(audioPath)} />

      {/* === 瀛楀箷灞傦細搴曢儴娓愬彉閬僵 + 娓愯繘寮忓瓧骞?=== */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          background: `linear-gradient(to top, ${colors.background} 45%, ${colors.background}DD 70%, transparent)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 24,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <SingleLineSubtitle segments={segments} />
      </div>
    </div>
  );
};

/** EP3 瀹屾暣鍚堟垚 */
const EP3Full: React.FC = () => {
  return (
    <TransitionSeries>
      {SCENES.map((scene, i) => {
        const duration = DEFAULT_DURATIONS[scene.id] || 300;
        return (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={duration}>
              <SceneWithLayers
                SceneComponent={scene.component}
                sceneId={scene.id}
                duration={duration}
              />
            </TransitionSeries.Sequence>
            {i < SCENES.length - 1 && (
              <TransitionSeries.Transition
                presentation={scene.transition as any}
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
      <Composition
        id="EP3-Full"
        component={EP3Full}
        durationInFrames={totalDuration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Folder name="Scenes">
        {SCENES.map((scene) => {
          const duration = DEFAULT_DURATIONS[scene.id] || 300;
          return (
            <Composition
              key={scene.id}
              id={scene.id}
              component={() => (
                <SceneWithLayers
                  SceneComponent={scene.component}
                  sceneId={scene.id}
                  duration={duration}
                />
              )}
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
