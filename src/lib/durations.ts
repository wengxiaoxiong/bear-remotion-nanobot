export const DEFAULT_DURATIONS: Record<string, number> = {
  // 闊抽鏃堕暱 + 30甯�(1s)缂撳啿锛岀‘淇濆彛鎾畬鏁存挱鏀�
  'Scene01-Intro': 481,
  'Scene02-DualAgentCompare': 557,
  'Scene03-HookConclusion': 794,
  'Scene05-ContextAssembly': 1735,
  'Scene08-MemoryLayers': 1643,
  'Scene11-FourKeywords': 1262,
  'Scene13-ThreePlanes': 1625,
  'Scene15-StabilityFlash': 709,
  'Scene17-SeriesReview': 947,
  'Scene18-CodeCompare': 425,
  'Scene19-Outro': 463,
};

// 涓€闀滃埌搴曞満鏅師濮嬪弬鑰冩椂闀匡紙鐢ㄤ簬璁＄畻缂╂斁姣斾緥锛�
export const SCENE05_REFERENCE_DURATION = 3600;
export const SCENE08_REFERENCE_DURATION = 2250;
export const SCENE11_REFERENCE_DURATION = 1650;
export const SCENE13_REFERENCE_DURATION = 1800;

// Scene05 鍐呴儴鏃堕棿杞达紙甯э紝鐩稿浜� Composition 璧风偣锛�
// 鍘熷鎬婚暱搴� 3600甯э紝鐜版寜姣斾緥缂╂斁
const S5_SCALE = DEFAULT_DURATIONS['Scene05-ContextAssembly'] / SCENE05_REFERENCE_DURATION;
export const SCENE05_TIMELINE = {
  identityStart: Math.round(0 * S5_SCALE),
  identityEnd: Math.round(540 * S5_SCALE),
  bootstrapStart: Math.round(540 * S5_SCALE),
  bootstrapEnd: Math.round(1200 * S5_SCALE),
  memoryStart: Math.round(1200 * S5_SCALE),
  memoryEnd: Math.round(2000 * S5_SCALE),
  skillsStart: Math.round(2000 * S5_SCALE),
  skillsEnd: Math.round(2600 * S5_SCALE),
  mergeStart: Math.round(2600 * S5_SCALE),
  mergeEnd: Math.round(2900 * S5_SCALE),
  codeStart: Math.round(2900 * S5_SCALE),
  codeEnd: Math.round(3300 * S5_SCALE),
  conclusionStart: Math.round(3300 * S5_SCALE),
  conclusionEnd: Math.round(3600 * S5_SCALE),
} as const;

// Scene08 鍐呴儴鏃堕棿杞达紙甯э紝鐩稿浜� Composition 璧风偣锛�
// 鍘熷鎬婚暱搴� 2250甯э紝鐜版寜姣斾緥缂╂斁
const S8_SCALE = DEFAULT_DURATIONS['Scene08-MemoryLayers'] / SCENE08_REFERENCE_DURATION;
export const SCENE08_TIMELINE = {
  memoryIntroStart: Math.round(0 * S8_SCALE),
  memoryIntroEnd: Math.round(300 * S8_SCALE),
  memoryLoopStart: Math.round(300 * S8_SCALE),
  memoryLoopEnd: Math.round(900 * S8_SCALE),
  historyIntroStart: Math.round(900 * S8_SCALE),
  historyIntroEnd: Math.round(1200 * S8_SCALE),
  historyGrepStart: Math.round(1200 * S8_SCALE),
  historyGrepEnd: Math.round(1500 * S8_SCALE),
  compareStart: Math.round(1500 * S8_SCALE),
  compareEnd: Math.round(1950 * S8_SCALE),
  analogyStart: Math.round(1950 * S8_SCALE),
  analogyEnd: Math.round(2250 * S8_SCALE),
} as const;

// Scene11 鍐呴儴鏃堕棿杞达紙甯э紝鐩稿浜� Composition 璧风偣锛�
// 鍘熷鎬婚暱搴� 1650甯э紝鐜版寜姣斾緥缂╂斁
const S11_SCALE = DEFAULT_DURATIONS['Scene11-FourKeywords'] / SCENE11_REFERENCE_DURATION;
export const SCENE11_TIMELINE = {
  keyword1Start: Math.round(0 * S11_SCALE),
  keyword1End: Math.round(420 * S11_SCALE),
  keyword2Start: Math.round(420 * S11_SCALE),
  keyword2End: Math.round(840 * S11_SCALE),
  keyword3Start: Math.round(840 * S11_SCALE),
  keyword3End: Math.round(1260 * S11_SCALE),
  keyword4Start: Math.round(1260 * S11_SCALE),
  keyword4End: Math.round(1560 * S11_SCALE),
  conclusionStart: Math.round(1560 * S11_SCALE),
  conclusionEnd: Math.round(1650 * S11_SCALE),
} as const;

// Scene13 鍐呴儴鏃堕棿杞达紙甯э紝鐩稿浜� Composition 璧风偣锛�
// 鍘熷鎬婚暱搴� 1800甯э紝鐜版寜姣斾緥缂╂斁
const S13_SCALE = DEFAULT_DURATIONS['Scene13-ThreePlanes'] / SCENE13_REFERENCE_DURATION;
export const SCENE13_TIMELINE = {
  orchestrationStart: Math.round(0 * S13_SCALE),
  orchestrationEnd: Math.round(420 * S13_SCALE),
  controlStart: Math.round(420 * S13_SCALE),
  controlEnd: Math.round(840 * S13_SCALE),
  executionStart: Math.round(840 * S13_SCALE),
  executionEnd: Math.round(1260 * S13_SCALE),
  llmLayerStart: Math.round(1260 * S13_SCALE),
  llmLayerEnd: Math.round(1440 * S13_SCALE),
  multiChannelStart: Math.round(1440 * S13_SCALE),
  multiChannelEnd: Math.round(1800 * S13_SCALE),
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const SUBTITLE_HEIGHT = 140;
export const ANIMATION_HEIGHT = HEIGHT - SUBTITLE_HEIGHT;

export const seconds = (s: number) => s * FPS;
