/**
 * 字幕分段配置
 * 用于精确控制每行字幕的显示时机
 */

export interface SubtitleSegment {
  text: string;
  startMs: number;
  endMs: number;
}

// 场景字幕分段配置
export const SUBTITLE_SEGMENTS: Record<string, SubtitleSegment[]> = {
  // 示例配置 - 需要根据实际音频生成
  'Scene01-Intro': [],
};

// 获取场景的字幕分段
export const getSceneSubtitleSegments = (sceneId: string): SubtitleSegment[] | null => {
  return SUBTITLE_SEGMENTS[sceneId] || null;
};
