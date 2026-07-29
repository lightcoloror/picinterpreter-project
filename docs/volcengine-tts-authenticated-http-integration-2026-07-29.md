# 豆包 TTS 真实认证 HTTP 联调

- 记录时间：`2026-07-29 02:39:11`
- 执行工具 / 模型：`Codex（GPT-5.6）`

## 意图

确认 issue #1 的“豆包语音后端化”已经能够经过 CBoard 普通用户认证、公开 speech 路由和服务端 provider 返回私有 MP3，而不是只有配置和 mock。

## 决策

固定 OpenClaw 官方提交 `642befa179d377395c1bb927f4bb562a29af9d67` 并运行 Volcengine 插件测试；cboard-api 新增显式门控的隔离 Mongo + 本地 SSE provider 组合测试。继续复用现有中国区 V3 契约，不引入 OpenClaw 运行时，不改 Web/微信协议。

## 理由

OpenClaw 是既有决策引用的成熟 MIT 来源，但当前默认端点已转向 BytePlus 国际服务，不能无审查覆盖中国区配置。用其测试确认协议思想，再用本 fork 的真实 HTTP 链确认认证、请求和响应，是比重写或真实付费调用更稳妥的边界。

## 证据

- OpenClaw 干净源码：`D:\used-by-codex\source-reviews\picinterpreter-volcengine-tts-http-20260729\openclaw-source`，提交 `642befa179d377395c1bb927f4bb562a29af9d67`；同级 `openclaw` 目录保留本轮依赖安装与测试产物，不作为源码账本路径。
- 固定 lockfile 供应链检查通过；Volcengine `tts.test.ts` 与 `index.test.ts` 为 `22/22`。本机 Node 低于上游 engine 下限，pnpm 官方入口按预期拒绝，直接执行同一 Vitest 在沙箱外通过，未隐瞒环境差异。
- cboard-api 集成 `2/2`：匿名 403 且 provider 未调用；普通用户 200，MP3 字节一致，响应为 `private, no-store` / `nosniff`；本地 provider 收到服务端 key、resource、UUID、voice、rate 和规范请求体。
- API 无数据库单元 `376/376`，Prettier 通过。

## 生效范围

已证明豆包 TTS 的服务端认证工程链；未证明真实火山引擎凭据、服务授权、音色质量、费用、延迟、公网 HTTPS、微信合法域名或真机播放。ASR、WechatSI、患者文字、分词、图片匹配和接收 UI 不变。未提交、推送、部署、预览、上传、发布或使用 Computer Use。
