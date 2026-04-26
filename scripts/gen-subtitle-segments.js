const fs = require('fs');

// 按口播意群拆分，每句不超过 15 字，一眼能看完
const scripts = {
  'Scene01-Intro': [
    '大家好，我是熊老板。',
    '前两集我们聊了 小龙虾',
    '为什么看起来那么聪明',
    '多轮推理循环',
    '主动执行',
    '声明式扩展',
    '但有一个最隐蔽',
    '却最决定智能上限的东西',
    '我一直没细说。',
  ],
  'Scene02-DualAgentCompare': [
    '看这两个 Agent。',
    '用的是同一个大模型',
    '连参数都一样。',
    '左边这个',
    '你让它写周报',
    '它还得问你',
    '"请提供本周工作内容"。',
    '右边这个',
    '直接就写出来了',
    '而且里面的项目进展',
    '是你上周聊天时随口提到的',
    '它记住了。',
  ],
  'Scene03-HookConclusion': [
    '差别在哪？',
    '不是模型能力的差距。',
    '是上下文工程的差距。',
    'Agent 的"眼睛"',
    '就是它的 System Prompt',
    '和上下文。',
    '上下文拼得好',
    'Agent 聪明；',
    '拼得烂',
    '再强的模型也会表现得像个傻子。',
    '今天最后一集',
    '我们来拆 NanoBot',
    '上下文工程的核心',
    '分层设计',
    '记忆生命周期',
    '以及它的三平面整体架构。',
  ],
  'Scene05-ContextAssembly': [
    '第一层：Identity',
    '身份与环境。',
    '我是谁？',
    '现在几点？',
    'Workspace 路径在哪？',
    '这一层是所有后续能力的基础。',
    '第二层：Bootstrap',
    '常驻规范文件。',
    'AGENTS.md、SOUL.md、USER.md。',
    '这些文件每次对话都完整注入。',
    '不会因为聊久了',
    '就忘了自己是谁。',
    '第三层：Memory',
    '记忆。',
    'MEMORY.md 的内容',
    '会被作为记忆层注入。',
    '关键信息被浓缩在一个文件里',
    '比全量历史省太多 token 了。',
    '第四层：Skills',
    '技能。',
    'always 技能全文注入',
    '其余只进摘要。',
    '四层拼完',
    '就是一条完整的 System Message。',
    '为什么这个顺序很重要？',
    '因为大模型对 System Prompt',
    '的注意力分配不是均匀的',
    '靠前的内容影响力更大。',
    '这就是为什么说',
    '顺序即优先级。',
  ],
  'Scene08-MemoryLayers': [
    '第一层：MEMORY.md',
    '长期事实。',
    '这不是只读文件',
    'Agent 自己会往里面写东西。',
    '当 Agent 识别到关键信息',
    '它会主动调用 write_file',
    '把信息写进 MEMORY.md。',
    '然后每次新对话开始时',
    'MEMORY.md 的内容',
    '会被完整注入到 System Prompt 的记忆层。',
    '这就形成了一个闭环。',
    '第二层：HISTORY.md',
    '事件日志。',
    '这个文件由系统自动维护。',
    '但关键是',
    'HISTORY.md 不会被注入到 System Prompt 里。',
    'Agent 只有在被问到',
    '"上周我让你做了什么"',
    '这类问题时',
    '才会用 grep 去搜 HISTORY.md。',
    'MEMORY.md 存事实',
    'Agent 主动写、全文注入。',
    'HISTORY.md 存日志',
    '系统自动追加、Agent 按需 grep。',
  ],
  'Scene11-FourKeywords': [
    '分层清晰。',
    '身份、规范、记忆、技能',
    '顺序固定、职责单一。',
    '常驻与按需结合。',
    'Bootstrap 文件常驻',
    '底线不能漏。',
    'Skill 分全文和摘要',
    '常用的随时可用',
    '不常用的不占空间。',
    '记忆用浓缩的 MEMORY.md',
    '而不是全量历史。',
    'Progressive Loading。',
    '核心规则常驻',
    '技能按需扩展。',
    '你可以无限增加 Skill',
    '而不会导致 System Prompt 爆掉。',
    'Token 可控。',
    '该长的适度长',
    '该短的短。',
    '每一层的 token 开销',
    '都是可预期的。',
    '这四点加在一起',
    '就是上下文工程的最佳实践。',
  ],
  'Scene13-ThreePlanes': [
    '第一个，调度平面',
    '决定何时动。',
    '四种触发源：',
    '用户消息',
    'Cron 定时任务',
    'Heartbeat 心跳',
    '子任务回报。',
    '第二个，控制平面',
    '决定看什么、怎么想。',
    '上下文构建',
    '加 Agent 核心循环。',
    '第三个，执行平面',
    '决定能做什么。',
    '工具注册表：',
    '文件读写',
    'Shell 执行',
    '网络请求',
    '发消息',
    '派发子 Agent。',
    '安全护栏也在这一层。',
    '贯穿三个平面的是 LLM 层。',
    '不管你用 Claude、GPT、DeepSeek',
    '还是其他模型',
    'Agent 的行为逻辑不变。',
    '再加上多通道支持',
    '同一套逻辑接 Telegram',
    'Discord',
    '飞书',
    'Slack。',
    '三个平面加统一 LLM 加多通道',
    '这就是 NanoBot 的完整架构。',
  ],
  'Scene15-StabilityFlash': [
    '最后快速提一下稳定性。',
    '迭代轮数有上限',
    '防止死循环。',
    '工具参数有校验',
    '单次失败以错误字符串返回',
    '不会拖垮服务。',
    'Shell 有黑名单',
    '文件有路径限制。',
    '会话和 Cron 可持久化',
    '重启不丢。',
    '消息队列解耦',
    '某个通道挂了不影响核心。',
  ],
  'Scene17-SeriesReview': [
    '好，三集讲完了。',
    '第一集',
    '回答了为什么智能',
    '多轮推理循环',
    '主动执行',
    '声明式扩展',
    '分层上下文。',
    '第二集',
    '拆了 Proactive 和 Skill',
    '心跳定期叫醒',
    'Cron 精确定时',
    'Skill Progressive Loading。',
    '第三集',
    '拆了上下文工程和整体架构',
    '四层千层饼',
    '记忆分两层',
    '三个平面覆盖',
    '何时动',
    '看什么',
    '做什么。',
  ],
  'Scene18-CodeCompare': [
    '小龙虾 几十万行代码',
    'NanoBot 几千行。',
    '但核心设计思想是一样的。',
    '如果你只记一句话：',
    'Agent 的智能 =',
    '会推理',
    '+ 会主动',
    '+ 会扩展',
    '+ 看得准。',
  ],
  'Scene19-Outro': [
    '理解了这四点',
    '你不只是理解了 小龙虾',
    '你理解了一个设计良好的',
    'AI Agent 系统该长什么样。',
    '我是熊老板',
    '这个系列到这里就结束了。',
    '如果有帮助',
    '别忘了三连。',
    '我们下个系列见。',
  ],
};

const audioDurations = {
  'Scene01-Intro': 15.02,
  'Scene02-DualAgentCompare': 17.57,
  'Scene03-HookConclusion': 25.46,
  'Scene05-ContextAssembly': 56.83,
  'Scene08-MemoryLayers': 53.76,
  'Scene11-FourKeywords': 41.06,
  'Scene13-ThreePlanes': 53.16,
  'Scene15-StabilityFlash': 22.63,
  'Scene17-SeriesReview': 30.58,
  'Scene18-CodeCompare': 13.15,
  'Scene19-Outro': 14.45,
};

const FPS = 30;
const BUFFER_FRAMES = 30; // 1秒缓冲

const segments = {};

for (const [sceneId, sentences] of Object.entries(scripts)) {
  const duration = audioDurations[sceneId];
  const totalFrames = Math.round(duration * FPS) + BUFFER_FRAMES;
  const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);

  const minFrames = 20; // 最少 0.67 秒

  let currentFrame = 0;
  const sceneSegments = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    let allocated = Math.max(minFrames, Math.round((sentence.length / totalChars) * totalFrames));

    if (i === sentences.length - 1) {
      allocated = Math.max(minFrames, totalFrames - currentFrame);
    }

    const start = currentFrame;
    const end = Math.min(currentFrame + allocated, totalFrames);
    sceneSegments.push({ text: sentence, start, end });
    currentFrame = end;
  }

  segments[sceneId] = sceneSegments;
}

// 生成 TypeScript 文件
let ts = 'export interface SubtitleSegment {\n';
ts += '  text: string;\n';
ts += '  start: number;\n';
ts += '  end: number;\n';
ts += '}\n\n';
ts += 'export const SCENE_SUBTITLE_SEGMENTS: Record<string, SubtitleSegment[]> = {\n';

for (const [sceneId, segs] of Object.entries(segments)) {
  ts += `  '${sceneId}': [\n`;
  for (const seg of segs) {
    const escaped = seg.text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    ts += `    { text: '${escaped}', start: ${seg.start}, end: ${seg.end} },\n`;
  }
  ts += '  ],\n';
}
ts += '};\n';

fs.writeFileSync('./src/lib/subtitleSegments.ts', ts, 'utf8');
console.log('Generated subtitleSegments.ts');
console.log('\nScene summary:');
for (const [sceneId, segs] of Object.entries(segments)) {
  const dur = audioDurations[sceneId];
  const maxLen = Math.max(...segs.map(s => s.text.length));
  console.log(`${sceneId}: ${segs.length} segments, max ${maxLen} chars, audio ${dur.toFixed(2)}s`);
}
