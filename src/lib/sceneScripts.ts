export const SCENE_SCRIPTS: Record<string, string> = {
  'Scene01-Intro': '大家好，我是熊老板。前两集我们聊了 小龙虾 为什么看起来那么聪明——多轮推理循环、主动执行、声明式扩展。但有一个最隐蔽、却最决定智能上限的东西，我一直没细说。',
  'Scene02-DualAgentCompare': '看这两个 Agent。用的是同一个大模型，连参数都一样。左边这个，你让它写周报，它还得问你"请提供本周工作内容"。右边这个，直接就写出来了——而且里面的项目进展是你上周聊天时随口提到的，它记住了。',
  'Scene03-HookConclusion': '差别在哪？不是模型能力的差距。是上下文工程的差距。Agent 的"眼睛"就是它的 System Prompt 和上下文。上下文拼得好，Agent 聪明；拼得烂，再强的模型也会表现得像个傻子。今天最后一集，我们来拆 NanoBot 上下文工程的核心——分层设计、记忆生命周期，以及它的三平面整体架构。',

  'Scene04-LayerCakeIntro': 'NanoBot 的 System Prompt 不是一大段文字直接塞进去的。它是按固定顺序、分层拼接的，每一层有明确的职责。我把它叫做上下文千层饼。从上到下，一共四层。',
  'Scene05-ContextAssembly': '第一层：Identity，身份与环境。我是谁？现在几点？Workspace 路径在哪？这一层是所有后续能力的基础。第二层：Bootstrap，常驻规范文件。AGENTS.md、SOUL.md、USER.md。这些文件每次对话都完整注入。不会因为聊久了就忘了自己是谁。第三层：Memory，记忆。MEMORY.md 的内容会被作为记忆层注入。关键信息被浓缩在一个文件里，比全量历史省太多 token 了。第四层：Skills，技能。always 技能全文注入，其余只进摘要。四层拼完，就是一条完整的 System Message。为什么这个顺序很重要？因为大模型对 System Prompt 的注意力分配不是均匀的——靠前的内容影响力更大。这就是为什么说顺序即优先级。',
  'Scene06-ContextFlow': '四层拼完，加上对话历史和当前输入，发给 LLM。这就是 Agent 每次睁眼看到的全部信息。',

  'Scene07-MemoryIntro': '很多人对 Agent 的记忆有误解，觉得它只是把聊天记录全部存起来。不是的。NanoBot 的记忆分两层。',
  'Scene08-MemoryLayers': '第一层：MEMORY.md——长期事实。这不是只读文件，Agent 自己会往里面写东西。当 Agent 识别到关键信息，它会主动调用 write_file 把信息写进 MEMORY.md。然后每次新对话开始时，MEMORY.md 的内容会被完整注入到 System Prompt 的记忆层。这就形成了一个闭环。第二层：HISTORY.md——事件日志。这个文件由系统自动维护。但关键是——HISTORY.md 不会被注入到 System Prompt 里。Agent 只有在被问到"上周我让你做了什么"这类问题时，才会用 grep 去搜 HISTORY.md。MEMORY.md 存事实——Agent 主动写、全文注入。HISTORY.md 存日志——系统自动追加、Agent 按需 grep。',
  'Scene09-MemoryConclusion': '记忆分两层，一层常驻、一层按需。这个设计直接解决了记太多爆上下文，记太少丢信息的矛盾。',

  'Scene10-WhyGoodIntro': '我们往上拉一层，看看 NanoBot 的上下文工程为什么值得学习。四个关键词。',
  'Scene11-FourKeywords': '分层清晰。身份、规范、记忆、技能，顺序固定、职责单一。常驻与按需结合。Bootstrap 文件常驻——底线不能漏。Skill 分全文和摘要——常用的随时可用，不常用的不占空间。记忆用浓缩的 MEMORY.md 而不是全量历史。Progressive Loading。核心规则常驻，技能按需扩展。你可以无限增加 Skill，而不会导致 System Prompt 爆掉。Token 可控。该长的适度长，该短的短。每一层的 token 开销都是可预期的。这四点加在一起，就是上下文工程的最佳实践。',

  'Scene12-PlanesIntro': '最后，我们把 NanoBot 的所有模块放在一起看。我把它归纳为三个平面。',
  'Scene13-ThreePlanes': '第一个，调度平面——决定何时动。四种触发源：用户消息、Cron 定时任务、Heartbeat 心跳、子任务回报。第二个，控制平面——决定看什么、怎么想。上下文构建加 Agent 核心循环。第三个，执行平面——决定能做什么。工具注册表：文件读写、Shell 执行、网络请求、发消息、派发子 Agent。安全护栏也在这一层。贯穿三个平面的是 LLM 层。不管你用 Claude、GPT、DeepSeek 还是其他模型，Agent 的行为逻辑不变。再加上多通道支持——同一套逻辑接 Telegram、Discord、飞书、Slack。三个平面加统一 LLM 加多通道——这就是 NanoBot 的完整架构。',
  'Scene14-ArchitectureTip': '这个架构图建议你截图保存。以后看任何 Agent 系统，都可以拿它当对照模板。',

  'Scene15-StabilityFlash': '最后快速提一下稳定性。迭代轮数有上限，防止死循环。工具参数有校验，单次失败以错误字符串返回，不会拖垮服务。Shell 有黑名单，文件有路径限制。会话和 Cron 可持久化，重启不丢。消息队列解耦，某个通道挂了不影响核心。',
  'Scene16-StabilityConclusion': '一句话：安全默认、失败可控、状态不丢、模块解耦。',

  'Scene17-SeriesReview': '好，三集讲完了。第一集，回答了为什么智能——多轮推理循环、主动执行、声明式扩展、分层上下文。第二集，拆了 Proactive 和 Skill——心跳定期叫醒、Cron 精确定时、Skill Progressive Loading。第三集，拆了上下文工程和整体架构——四层千层饼、记忆分两层、三个平面覆盖何时动、看什么、做什么。',
  'Scene18-CodeCompare': '小龙虾 几十万行代码，NanoBot 几千行。但核心设计思想是一样的。如果你只记一句话：Agent 的智能 = 会推理 + 会主动 + 会扩展 + 看得准。',
  'Scene19-Outro': '理解了这四点，你不只是理解了 小龙虾——你理解了一个设计良好的 AI Agent 系统该长什么样。我是熊老板，这个系列到这里就结束了。如果有帮助，别忘了三连。我们下个系列见。',
};
