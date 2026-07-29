# 视觉 AI 官方 SDK 认证 HTTP 与私密结果验收

- **记录时间：** 2026-07-29 09:02:35
- **执行者：** Codex（GPT-5.6）
- **关联需求：** PicInterpreter issue #1、#3、#20、#21

## 意图

证明图语家的图片识字、个人图卡元数据建议和缺词 AI 图符生成真实复用了 CBoard 账号、官方 OpenAI-compatible SDK、Mongo 用量账本和既有人工确认流程，而不是只有 helper mock 或尚未组合的前后端代码。

## 决策

1. 复用源码账本已有 `openai-node v4.104.0` 固定源码、cboard-api 通用 AI provider、现有 JWT/Swagger、月额度和客户端 ports，不新增协议、依赖或视觉专用账号体系。
2. 新增隔离 Mongo + 官方 SDK + Nock 组合门；Nock 仅返回确定性模型响应，真实执行生产 SDK 请求构造、认证、multipart、内存 Data URL、图片生成、PNG 归一化和用量结算。
3. OCR 与元数据结果继续可编辑且不自动分词、匹配或保存；家庭原图不落库，provider 请求体只包含内存 Data URL，不包含上传文件名、本地路径或服务端密钥。
4. 生成图继续只作为 `device-private` 草稿返回，照护者确认前不进入缺词规则；用户标识只发 SHA-256，输出不声明公共许可。
5. 视觉输入、生成图与去背景成功响应统一禁止缓存，并保持音频端既有相同私密边界。

## 理由

- provider 单元测试不能证明普通用户角色、Swagger multipart、官方 SDK、Mongo reservation/settlement 和响应头能一起工作。
- 家庭照片和识别文字可能包含个人信息；“服务端不落库”仍不足以阻止浏览器或代理缓存。
- 视觉模型会误识别，图片模型也可能生成不准确内容；人工编辑、预览和确认是图语家双向沟通的安全核心，不能被网络增强绕过。
- AI 生成图不具备 ARASAAC/OpenSymbols 的公共许可语义，必须与公共候选保持不同 scope。

## 证据

- 官方源码：<https://github.com/openai/openai-node>
- 本地源码：`D:\used-by-codex\source-reviews\picinterpreter-ai-http-quota-20260729\openai-node`
- 固定提交：`7704e54f048c75f5fd96fa26e2b7b56cf0900a80`，版本 `4.104.0`，Apache-2.0。
- 官方 Images 测试 `6/6`：variation、edit、generate 的必填/可选参数均通过本机等价 HTTP harness；上游 `scripts/test` 在 Windows 依赖 `lsof`，因此改用同一官方 Jest 文件而未修改上游源码。
- 视觉 HTTP/Mongo `3/3`：匿名 OCR 为 403 且 provider 未调用；普通用户 OCR、元数据和生成图均为 200，结果带 `no-store, private` 与 `nosniff`。
- OCR 与元数据发送的 Data URL 与输入 JPEG 字节完全一致，请求体没有原文件名或密钥；返回均为 `sourceStored: false` 和可编辑字段。
- 生成请求包含受限 AAC prompt、`gpt-image-1`、低质量 PNG 和哈希用户，返回 300×300 私密 PNG；20 + 25 + 32 provider usage 最终在 Mongo 结算为 77。
- 去背景 HTTP/Mongo `2/2` 同步通过私密响应头；聚焦 `59/59`，API 全量单元 `377/377`。

## 生效范围

- 覆盖 issue #1/#3/#20/#21 的视觉服务端密钥隔离、认证、用量、隐私和组合验证证据；#82 去背景共享响应隐私加固。
- 不改变 Web/微信已有入口、OCR 后人工修改、元数据预填规则、缺词维护确认、matcher、分词、公共图库、离线模式或图片文件生命周期。
- 真实模型凭据、生产公网、微信合法域名、家庭照片质量、供应商数据保留、费用、延迟、低端机和物理手机仍待外部验收。
- 未使用 Computer Use，未打开、聚焦或置顶微信开发者工具，未真实调用模型、预览、上传、发布、部署、提交或推送。
