/**
 * 场景台词/文案配置
 */

export const SCENE_SCRIPTS: Record<string, string> = {
  // 开场
  'Scene01-Intro': '大家好，我是熊老板。上一集我们聊了 Clawdbot 这种 Agent 为什么看起来那么聪明——它有 SystemPrompt、有 Workspace 工作区、还有 HeartBeat 心跳机制。但是！有一个最核心的环节，我上次其实只用一句话就带过了。',
  'Scene02-AgentLoopHighlight': '就是这个——「Agent Loop」。这里面其实藏着特别多细节：它是怎么调用工具的？它怎么跟工作区交互？这一集我们把它拆开来讲。',
  'Scene03-Title': '所以今天这一集，我们全程高能，专注拆解 NanoBot 的 Agent Loop。看完这一集，你就能彻底搞懂，一个跑在操作系统上的 Agent，到底是怎么 work 的。',
  
  // Part 1A
  'Scene04-PipelineReview': '当你在飞书给 Clawdbot 发一条消息，Agent 收到后，其实主要就在死磕三件事儿：第一，组装上下文；第二，调用 LLM；第三，执行工具。这三步构成了一个循环。',
  'Scene05-ContextQuestion': '我们先回顾一下第一步：组装上下文。简单说，就是把 Workspace 里的各种文件，拼成一个巨大的 System Prompt。这个过程，我们可以把它拆成四层来看。',
  'Scene06-IdentityLayer': '第一层：身份。我是谁？现在几点？我跑在 macOS 上还是 Linux 上？我的工作区在哪？这一层非常关键，如果没有它，Agent 醒来连自己在哪台机器上都不知道，更别提干活了。',
  'Scene07-BootstrapLayer': '第二层：规范。AGENTS.md 规定行为，SOUL.md 定义人格，USER.md 记录你的偏好。如果没有这一层，Agent 的性格就会飘忽不定。这一秒是严谨工程师，下一秒可能就变成复读机了。',
  'Scene08-MemoryLayer': '第三层：记忆。Workspace 里有个 MEMORY.md。如果没有这一层，它就是个只有七秒记忆的金鱼。比如你上次说「周报只要摘要」，Agent 会自动把这条写进 MEMORY.md。',
  'Scene09-SkillsLayer': '第四层：技能摘要。它会什么？deep-research？写 PPT？查 Github？所有技能都会列在这里。如果没有这一层，它就是个失忆专家。',
  'Scene10-ContextAssembly': '好，身份、规范、记忆、技能，这四层一叠，就是一个完整的 System Prompt。再加上之前的对话历史和你刚发的消息，打包发给 LLM。这就是 Agent 每次「睁眼」看到的所有信息。',
  
  // Part 1B
  'Scene11-AgentLoopTitle': '上下文组装好了，接下来进入心脏地带——Agent Loop 迭代循环。这块逻辑是整个 Agent 的灵魂，我来一步一步拆给你看。',
  'Scene12-SendToLLM': '第一步：把刚才打包好的 messages 发给 LLM，顺便附上一张工具清单——告诉它：「哥们，你有这些工具可以用」。然后，坐等 LLM 回复。',
  'Scene13-CheckResponse': '第二步：检查回复。LLM 一般有两种回法。一种是直接给一段话，意思是「我想好了，这是答案」。如果是这种，没 tool call，那就说明任务结束，直接退出循环。',
  'Scene14-ToolsExplained': '但如果有 tool call，好戏才刚开始。工具就是 Agent 的「手」——读文件、跑命令、搜网页。NanoBot 把所有工具都写在一张清单里。',
  'Scene15-ExecuteTool': '系统拿到这个请求，哐当一下执行工具，拿到结果。然后——注意这步最关键——把结果塞回 messages 里，再次喂给 LLM。这结果不是给用户看的，是给 LLM 接着思考用的。',
  'Scene16-LoopBack': '结果喂回去，循环回到顶部，LLM 再次审视——「结果有了，还要干啥？」。也许它觉得信息不够，再调个工具；也许觉得够了，直接给结论。什么时候停，全看 LLM 自己心情。',
  'Scene17-AgentVsChatbot': 'Agent Loop 的本质，其实就是给 LLM 发了一张草稿纸。ChatGPT 是闭卷考试，一次定生死；Agent 是开卷考试，允许你打草稿、查资料、甚至算错了重算。',
  
  // Part 2
  'Scene18-ToolsWhere': '刚才说 Agent 有一堆工具，能读写、能跑命令。但有个致命的问题还没说——这些工具，到底跑在哪？',
  'Scene19-OSLevelVsCloud': 'NanoBot 是跑在你自己的电脑，或者你自己的服务器上的。它操作的不是什么云端沙箱，而是你实实在在的本地文件系统。这和 Manus 那些云端 Agent 有本质区别。',
  'Scene20-SandboxExplained': '但是，OS-level Agent 是有风险的。它能直接操作你的文件系统，能跑任意命令。所以在生产环境，我们会使用沙盒。沙盒可以隔离 Agent 的执行环境，限制它的权限。',
  'Scene21-ToolsShowcase': '来看看它的武器库。文件操作四件套：增删改查，动的是你硬盘上的真文件。exec：直接跑 Shell 命令——你电脑装了 git、gh、curl，它就能用。',
  'Scene22-DeliveryNotChat': '这九个工具，全是操作系统级别的能力。这就是为啥它能干真活儿——它不是陪你聊天的，它是能帮你读文件、跑脚本、真正做交付的。',
  
  // Part 3
  'Scene23-CaseIntro': '理论讲完了，咱们来个真刀真枪的实战。假设你在 Telegram 上跟 Agent 说：「帮我调研下 AI Agent 最新进展，做个 PPT，发到群里」。就这一句话。',
  'Scene24-ContextWithMemory': '消息进 Loop。第一件事，组装上下文。这里最神的是第三层 Memory。它在 MEMORY.md 里看到了一条记忆：「用户最近关注多模态大模型、RAG 优化」。',
  'Scene25-SkillsReady': '同时，技能栏里亮着 deep-research。Agent 此时还不知道具体怎么用，但它知道「我有这个技能，随时待命」。好，Loop 开始。',
  'Scene26-Round1-Learn': '第一轮。Agent 决定先读 deep-research 的说明书。调用 read_file，读取 SKILL.md。学会了调研方法论——先搜、再读、再整理。',
  'Scene27-Round2-Search': '第二轮。脑子学会了，开始动手。结合你的偏好，Agent 调用 web_search 搜「AI Agent 2025 进展 多模态」。',
  'Scene28-Round3-FetchFail': '第三轮。结果出来了，Agent 挑了一篇最相关的去抓。结果——啪，403 Forbidden，抓取失败。',
  'Scene29-Round4-Retry': '第四轮。LLM 看到报错，没崩。它很冷静地换了个源，重新 fetch。这次成了。这就是 Loop 的意义——允许犯错，允许重试，它自己能兜底。',
  'Scene30-Round5-LocalFile': '第五轮。Agent 还没完，它想看看你本地有没有相关笔记。于是调用 read_file，读了你硬盘上的 ~/research/notes。这一步，云端 Agent 只有干瞪眼的份。',
  'Scene31-Round6-GeneratePPT': '第六轮。料齐了。Agent 整理内容，直接调用 exec，用你机器上的 python-pptx 库生成 PPT。文件直接存到了你的 ~/output 目录下。',
  'Scene32-Round7-SendMessage': '第七轮。PPT 搞定。Agent 调用 message 工具，把摘要和文件路径发回 Telegram 群。完事儿，LLM 给出最终回复，循环结束。',
  'Scene33-CaseReview': '回头看一眼。你发了一条消息，它默默跑了七轮循环——中间还崩了一次，自己修好了。从头到尾，没人多嘴问你一句，活儿就干完了。',
  
  // Part 4
  'Scene34-ArchitectureSummary': '升维总结一下。今天讲的这套 Context Builder → LLM → Executor → Memory 结构，不光是 NanoBot，它是 90% Agent 系统的通用母板。',
  'Scene35-OSLevelValue': '它真不是个聊天机器人。它跑在你机器上，读你的文件，用你的工具，记你的偏好。这就是为啥 OS-level Agent 比云端沙箱更有用——因为它就在你的主场作战。',
  'Scene36-NextEpisode': '但是，光有 Loop 还不够。Agent 能干多大的事，取决于它的「技能」怎么扩展，它的「记忆」怎么流转。下一集，我们硬核拆解 Skill 声明式技能系统和记忆的生命周期。下集见！',
};
