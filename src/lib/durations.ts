/**
 * 音频时长配置
 * 从生成的音频元数据自动加载
 */

// 默认时长（帧）- 当音频文件不存在时使用
export const DEFAULT_DURATIONS: Record<string, number> = {
  // 开场 (0:00-0:55)
  'Scene01-Intro': 540,                    // 18s
  'Scene02-AgentLoopHighlight': 510,       // 17s
  'Scene03-Title': 600,                    // 20s

  // Part 1A: Agent 每次「看到」什么？ (0:55-3:20)
  'Scene04-PipelineReview': 600,           // 20s
  'Scene05-ContextQuestion': 390,          // 13s
  'Scene06-ContextAssembly': 3360,         // 112s（合并原 Scene06-10，一镜到底）

  // Part 1B: 循环怎么转？ (3:20-5:30)
  'Scene11-AgentLoopTitle': 300,           // 10s
  'Scene12-AgentLoopBreakdown': 3600,      // 120s（合并原 Scene12-17，一镜到底）

  // Part 2: 为什么是 OS-level Agent？ (5:30-7:20)
  'Scene18-ToolsWhere': 300,
  'Scene19-OSLevelVsCloud': 2100,
  'Scene21-ToolsShowcase': 600,
  'Scene22-DeliveryNotChat': 300,

  // Part 3: 完整走一遍——从调研到交付 (7:20-9:35)
  'Scene23-CaseIntro': 540,
  'Scene24-ContextWithMemory': 900,
  'Scene26-SevenRounds': 2610,
  'Scene33-CaseReview': 450,

  // Part 4: 总结与下集预告 (9:50-10:30)
  'Scene34-ArchitectureSummary': 600,
  'Scene35-OSLevelValue': 300,
  'Scene36-NextEpisode': 300,
};

// Scene06 内部时间轴（帧，相对于 Composition 起点）
export const SCENE06_TIMELINE = {
  // 第一层：身份 Identity
  identityStart: 0,
  identityEnd: 540,          // 18s
  // 第二层：规范 Bootstrap
  bootstrapStart: 540,
  bootstrapEnd: 1200,         // 22s
  // 第三层：记忆 Memory
  memoryStart: 1200,
  memoryEnd: 2000,            // ~27s
  // 第四层：技能 Skills
  skillsStart: 2000,
  skillsEnd: 2600,            // 20s
  // 四层合并 + 追加对话历史/当前消息
  mergeStart: 2600,
  mergeEnd: 2900,             // 10s
  // 伪代码块渐入
  codeStart: 2900,
  codeEnd: 3360,              // ~15s
} as const;

// Scene12 内部时间轴（帧，相对于 Composition 起点）
export const SCENE12_TIMELINE = {
  // Phase 1: 发送 messages + 工具清单给 LLM
  sendToLLMStart: 0,
  sendToLLMEnd: 540,          // 18s
  // Phase 2: 检查回复（分支：有 tool_call?）
  checkResponseStart: 540,
  checkResponseEnd: 1080,     // 18s
  // Phase 3: 工具说明（工具清单 + tool call 示例）
  toolsExplainedStart: 1080,
  toolsExplainedEnd: 1680,    // 20s
  // Phase 4: 执行工具（执行流程 + 伪代码）
  executeToolStart: 1680,
  executeToolEnd: 2280,       // 20s
  // Phase 5: 循环返回（箭头回到顶部）
  loopBackStart: 2280,
  loopBackEnd: 2820,          // 18s
  // Phase 6: ChatBot vs Agent 对比
  comparisonStart: 2820,
  comparisonEnd: 3600,        // 26s
} as const;

// Scene06 子场景台词映射
export const SCENE06_SCRIPT_MAP = [
  { key: 'Scene06-IdentityLayer', startFrame: 0, endFrame: 540 },
  { key: 'Scene07-BootstrapLayer', startFrame: 540, endFrame: 1200 },
  { key: 'Scene08-MemoryLayer', startFrame: 1200, endFrame: 2000 },
  { key: 'Scene09-SkillsLayer', startFrame: 2000, endFrame: 2600 },
  { key: 'Scene10-ContextAssembly', startFrame: 2600, endFrame: 3360 },
] as const;

// Scene12 子场景台词映射
export const SCENE12_SCRIPT_MAP = [
  { key: 'Scene12-SendToLLM', startFrame: 0, endFrame: 540 },
  { key: 'Scene13-CheckResponse', startFrame: 540, endFrame: 1080 },
  { key: 'Scene14-ToolsExplained', startFrame: 1080, endFrame: 1680 },
  { key: 'Scene15-ExecuteTool', startFrame: 1680, endFrame: 2280 },
  { key: 'Scene16-LoopBack', startFrame: 2280, endFrame: 2820 },
  { key: 'Scene17-AgentVsChatbot', startFrame: 2820, endFrame: 3600 },
] as const;

// 计算总时长
export const TOTAL_DURATION_FRAMES = Object.values(DEFAULT_DURATIONS).reduce((a, b) => a + b, 0);

// 帧率
export const FPS = 30;

// 视频尺寸
export const WIDTH = 1920;
export const HEIGHT = 1080;

// 时长计算辅助函数
export const seconds = (s: number) => s * FPS;
