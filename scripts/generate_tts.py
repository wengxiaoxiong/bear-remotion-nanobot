#!/usr/bin/env python3
"""
火山引擎 TTS 音频生成脚本
参照 EP2 方式，批量生成 EP3 所有场景的口播音频

用法:
    cd D:\特赞\ep3-remotion
    python scripts\generate_tts.py
"""

import os
import sys
import json
import uuid
import time
import base64
import requests

# ==================== 配置 ====================
APP_ID = "5129424057"
ACCESS_TOKEN = "3YuoHC7z6SwI9eOW_9h0tXlHkfuAbpBL"
CLUSTER = "volcano_tts"

# 音色选择（男声，适合技术讲解）
# 可选音色参考：https://www.volcengine.com/docs/6561/1257584
VOICE_TYPE = "zh_female_cancan_mars_bigtts"
# 备选男声：zh_male_M392_conversation_wvae_bigtts

API_URL = "https://openspeech.bytedance.com/api/v1/tts"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "audio")

# 场景文案配置（与 src/lib/sceneScripts.ts 保持一致）
SCENES = {
    "Scene01-Intro": "大家好，我是熊老板。前两集我们聊了 小龙虾 为什么看起来那么聪明——多轮推理循环、主动执行、声明式扩展。但有一个最隐蔽、却最决定智能上限的东西，我一直没细说。",
    "Scene02-DualAgentCompare": "看这两个 Agent。用的是同一个大模型，连参数都一样。左边这个，你让它写周报，它还得问你，请提供本周工作内容。右边这个，直接就写出来了——而且里面的项目进展是你上周聊天时随口提到的，它记住了。",
    "Scene03-HookConclusion": "差别在哪？不是模型能力的差距。是上下文工程的差距。Agent 的眼睛就是它的 System Prompt 和上下文。上下文拼得好，Agent 聪明；拼得烂，再强的模型也会表现得像个傻子。今天最后一集，我们来拆 NanoBot 上下文工程的核心——分层设计、记忆生命周期，以及它的三平面整体架构。",
    "Scene05-ContextAssembly": "第一层：Identity，身份与环境。我是谁？现在几点？Workspace 路径在哪？这一层是所有后续能力的基础。第二层：Bootstrap，常驻规范文件。AGENTS.md、SOUL.md、USER.md。这些文件每次对话都完整注入。不会因为聊久了就忘了自己是谁。第三层：Memory，记忆。MEMORY.md 的内容会被作为记忆层注入。关键信息被浓缩在一个文件里，比全量历史省太多 token 了。第四层：Skills，技能。always 技能全文注入，其余只进摘要。四层拼完，就是一条完整的 System Message。为什么这个顺序很重要？因为大模型对 System Prompt 的注意力分配不是均匀的——靠前的内容影响力更大。这就是为什么说顺序即优先级。",
    "Scene08-MemoryLayers": "第一层：MEMORY.md——长期事实。这不是只读文件，Agent 自己会往里面写东西。当 Agent 识别到关键信息，它会主动调用 write_file 把信息写进 MEMORY.md。然后每次新对话开始时，MEMORY.md 的内容会被完整注入到 System Prompt 的记忆层。这就形成了一个闭环。第二层：HISTORY.md——事件日志。这个文件由系统自动维护。但关键是——HISTORY.md 不会被注入到 System Prompt 里。Agent 只有在被问到上周我让你做了什么这类问题时，才会用 grep 去搜 HISTORY.md。MEMORY.md 存事实——Agent 主动写、全文注入。HISTORY.md 存日志——系统自动追加、Agent 按需 grep。",
    "Scene11-FourKeywords": "分层清晰。身份、规范、记忆、技能，顺序固定、职责单一。常驻与按需结合。Bootstrap 文件常驻——底线不能漏。Skill 分全文和摘要——常用的随时可用，不常用的不占空间。记忆用浓缩的 MEMORY.md 而不是全量历史。Progressive Loading。核心规则常驻，技能按需扩展。你可以无限增加 Skill，而不会导致 System Prompt 爆掉。Token 可控。该长的适度长，该短的短。每一层的 token 开销都是可预期的。这四点加在一起，就是上下文工程的最佳实践。",
    "Scene13-ThreePlanes": "第一个，调度平面——决定何时动。四种触发源：用户消息、Cron 定时任务、Heartbeat 心跳、子任务回报。第二个，控制平面——决定看什么、怎么想。上下文构建加 Agent 核心循环。第三个，执行平面——决定能做什么。工具注册表：文件读写、Shell 执行、网络请求、发消息、派发子 Agent。安全护栏也在这一层。贯穿三个平面的是 LLM 层。不管你用 Claude、GPT、DeepSeek 还是其他模型，Agent 的行为逻辑不变。再加上多通道支持——同一套逻辑接 Telegram、Discord、飞书、Slack。三个平面加统一 LLM 加多通道——这就是 NanoBot 的完整架构。",
    "Scene15-StabilityFlash": "最后快速提一下稳定性。迭代轮数有上限，防止死循环。工具参数有校验，单次失败以错误字符串返回，不会拖垮服务。Shell 有黑名单，文件有路径限制。会话和 Cron 可持久化，重启不丢。消息队列解耦，某个通道挂了不影响核心。",
    "Scene17-SeriesReview": "好，三集讲完了。第一集，回答了为什么智能——多轮推理循环、主动执行、声明式扩展、分层上下文。第二集，拆了 Proactive 和 Skill——心跳定期叫醒、Cron 精确定时、Skill Progressive Loading。第三集，拆了上下文工程和整体架构——四层千层饼、记忆分两层、三个平面覆盖何时动、看什么、做什么。",
    "Scene18-CodeCompare": "小龙虾 几十万行代码，NanoBot 几千行。但核心设计思想是一样的。如果你只记一句话：Agent 的智能 = 会推理 + 会主动 + 会扩展 + 看得准。",
    "Scene19-Outro": "理解了这四点，你不只是理解了 小龙虾——你理解了一个设计良好的 AI Agent 系统该长什么样。我是熊老板，这个系列到这里就结束了。如果有帮助，别忘了三连。我们下个系列见。",
}


def generate_tts(text: str, output_path: str) -> bool:
    """调用火山引擎 TTS API 生成音频"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer;{ACCESS_TOKEN}",
    }

    payload = {
        "app": {
            "appid": APP_ID,
            "token": ACCESS_TOKEN,
            "cluster": CLUSTER,
        },
        "user": {
            "uid": "ep3_user",
        },
        "audio": {
            "voice_type": VOICE_TYPE,
            "encoding": "mp3",
            "speed_ratio": 1.1,  # 稍快一点，适合技术讲解
        },
        "request": {
            "reqid": str(uuid.uuid4()),
            "text": text,
            "operation": "query",
        },
    }

    try:
        print(f"  请求生成: {os.path.basename(output_path)}")
        print(f"  文本长度: {len(text)} 字")

        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)

        if response.status_code != 200:
            print(f"  请求失败: HTTP {response.status_code}")
            print(f"  响应: {response.text[:500]}")
            return False

        data = response.json()

        # 检查响应结果
        if data.get("code") != 3000:
            print(f"  API 错误: code={data.get('code')}, message={data.get('message')}")
            return False

        # 解码 base64 音频数据
        audio_data = data.get("data", "")
        if not audio_data:
            print(f"  响应中没有音频数据")
            return False

        audio_bytes = base64.b64decode(audio_data)

        with open(output_path, "wb") as f:
            f.write(audio_bytes)

        print(f"  已保存: {output_path} ({len(audio_bytes)} bytes)")
        return True

    except Exception as e:
        print(f"  异常: {e}")
        return False


def main():
    print("=" * 60)
    print("EP3 火山引擎 TTS 音频批量生成")
    print("=" * 60)
    print(f"音色: {VOICE_TYPE}")
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"场景数量: {len(SCENES)}")
    print("=" * 60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    success_count = 0
    fail_count = 0

    for scene_id, text in SCENES.items():
        output_path = os.path.join(OUTPUT_DIR, f"{scene_id}.mp3")

        # 强制重新生成（因为文案已修改）
        if os.path.exists(output_path):
            os.remove(output_path)
            print(f"\n[{scene_id}] 删除旧音频，重新生成")
        else:
            print(f"\n[{scene_id}]")

        print(f'  "{text[:60]}..."')

        if generate_tts(text, output_path):
            success_count += 1
        else:
            fail_count += 1

        # 稍微延迟，避免触发频率限制
        time.sleep(0.5)

    print("\n" + "=" * 60)
    print(f"成功: {success_count} | 失败: {fail_count} | 总计: {len(SCENES)}")
    print("=" * 60)

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
