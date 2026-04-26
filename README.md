# EP3 上下文工程 - Remotion 动画项目

## 项目结构

```
ep3-remotion/
├─ public/
│  └─ audio/              # TTS 音频文件目录
│     ├─ Scene01-Intro.mp3
│     ├─ Scene02-DualAgentCompare.mp3
│     └─ ...
├─ src/
│  ├─ components/         # 通用组件
│  ├─ lib/                # 工具函数、配置、文案
│  ├─ scenes/             # 场景组件
│  ├─ Root.tsx            # Composition 定义
│  └─ index.tsx           # 入口
└─ package.json
```

## 分层架构说明

本项目采用**动画层 + 字幕层 + 音频层**的三层分离架构：

| 层级 | 位置 | 说明 |
|------|------|------|
| **动画层** | `top:0` ~ `bottom:SUBTITLE_HEIGHT` | 所有视觉动画内容，自动避开字幕区域 |
| **字幕层** | 底部 `SUBTITLE_HEIGHT` 固定高度 | 显示当前场景口播文案，半透明毛玻璃背景 |
| **音频层** | 全画面叠加 | 通过 `<Audio>` 组件播放 TTS 音频 |

### 字幕预留高度

在 `src/lib/durations.ts` 中配置：
```typescript
export const SUBTITLE_HEIGHT = 140;  // 字幕区域高度（像素）
export const ANIMATION_HEIGHT = HEIGHT - SUBTITLE_HEIGHT;  // 动画可用高度
```

## 安装依赖

```bash
cd ep3-remotion
npm install
```

## 启动预览

```bash
npx remotion studio
```

## 添加口播音频

1. 根据 `src/lib/sceneScripts.ts` 中的文案生成 TTS 音频
2. 将音频文件命名为对应场景 ID，放入 `public/audio/` 目录
3. 修改 `src/Root.tsx` 中 `<Audio volume={0} />` 为正常音量（如 `volume={1}`）

音频文件命名对照：

| 场景 | 音频文件名 |
|------|-----------|
| 开场 | `Scene01-Intro.mp3` |
| 双 Agent 对比 | `Scene02-DualAgentCompare.mp3` |
| Hook 结论 | `Scene03-HookConclusion.mp3` |
| 四层上下文组装 | `Scene05-ContextAssembly.mp3` |
| 记忆双层 | `Scene08-MemoryLayers.mp3` |
| 四个关键词 | `Scene11-FourKeywords.mp3` |
| 三平面架构 | `Scene13-ThreePlanes.mp3` |
| 稳定性 | `Scene15-StabilityFlash.mp3` |
| 系列回顾 | `Scene17-SeriesReview.mp3` |
| 代码量对比 | `Scene18-CodeCompare.mp3` |
| 结尾 | `Scene19-Outro.mp3` |

## 渲染输出

```bash
npx remotion render EP3-Full ep3-output.mp4
```

## 一镜到底场景

- **Scene05-ContextAssembly**: 四层上下文千层饼（90秒）
- **Scene08-MemoryLayers**: 记忆双层结构（75秒）
- **Scene11-FourKeywords**: 四个关键词（55秒）
- **Scene13-ThreePlanes**: 三平面架构（60秒）
