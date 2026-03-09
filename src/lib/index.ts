/**
 * lib 模块导出
 */

export { colors, easings, seconds as secondsToFrames, truncate, formatTime } from './utils';
export { fontFamily, fontStack } from './fonts';
export {
  DEFAULT_DURATIONS,
  TOTAL_DURATION_FRAMES,
  FPS,
  WIDTH,
  HEIGHT,
  seconds,
  SCENE06_TIMELINE,
  SCENE12_TIMELINE,
  SCENE06_SCRIPT_MAP,
  SCENE12_SCRIPT_MAP,
} from './durations';
export { SCENE_SCRIPTS } from './sceneScripts';
export { getSceneSubtitleSegments, type SubtitleSegment } from './subtitleSegments';
