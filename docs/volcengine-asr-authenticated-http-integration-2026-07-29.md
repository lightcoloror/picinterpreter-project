# 火山引擎粤语 ASR 认证 HTTP 集成验收

- **记录时间：** 2026-07-29 08:19:24
- **执行者：** Codex（GPT-5.6）
- **关联需求：** PicInterpreter issue #1、#3、#5
- **关联实现：** `cboard-api` 的 `POST /gpt/communication/dialect-asr`

## 意图

把图语家已有的“粤语录音识别后人工修改，再进入分词和图片匹配”从 provider 单元测试推进到真实 CBoard 用户认证、multipart 上传、服务端持密钥和私密转写响应的组合证据，同时继续复用 CBoard API 与现有中性 ASR 端口。

## 决策

1. 继续复用火山引擎官方大模型录音文件极速版 HTTP API 契约，不新增 Python sidecar、WebSocket、ffmpeg、客户端密钥或第二套路由。
2. 拉取并运行 MIT `doubao-speech` 成熟开源实现，学习其认证、错误映射、配置和测试结构；由于它以流式 WebSocket/Python 为主，不机械替换当前 Node 22 Flash HTTP adapter。
3. 新增显式环境门控的隔离 Mongo + loopback provider 集成测试。认证、Swagger、multipart、音频校验、provider factory 和响应序列化均执行生产代码，只有收费公网响应被确定性本地服务替代。
4. 为成功转写响应补齐 `Cache-Control: no-store, private` 和 `X-Content-Type-Options: nosniff`，避免敏感文字被客户端或中间缓存持久化。
5. 复用成熟实现的非敏感请求标识做法：每次请求 UUID 同时作为 `X-Api-Request-Id` 与 `user.uid`，API key 只进入认证头，不重复写入可能被业务日志记录的 JSON 请求体。

## 理由

- provider 单测能验证函数，但不能证明匿名请求在上游调用前被拒绝，也不能证明真实 JWT、Swagger multipart 和环境密钥组合正确。
- 真实火山联网需要账号开通、凭据、费用和患者音频治理；loopback 组合门能重复验证协议而不发送真实数据。
- `doubao-speech` 提供成熟工程参考，但其运行时和传输形态与当前 CBoard Node API 不同。复用架构与测试思想、保留现有官方 HTTP adapter，比引入第二运行时更小、更稳定。
- ASR 结果可能错误。服务端仍只返回可编辑原文，不自动触发分词或图卡匹配，照护者保留最终修正权。

## 证据

### 官方与开源来源

- 火山引擎官方接口：<https://www.volcengine.com/docs/6561/1631584?lang=zh>
- `doubao-speech`：<https://github.com/Hypnus-Yuan/doubao-speech>
- 固定提交：`949f2de8ce6dcca36e8d3f4ff55c30ffb5df30db`
- 本地干净源码：`D:\used-by-codex\source-reviews\picinterpreter-volcengine-asr-http-20260729\doubao-speech-clean-local-2`
- 上游实测：`uv sync --frozen --dev` 成功，Ruff 通过，mypy 覆盖 27 个源码文件通过，pytest `123 passed / 2 deselected`，覆盖率 `91.46%`。首次 pytest 的 49 个 setup error 来自 Windows 用户临时目录权限；改用源码内 `--basetemp` 后全部通过。

### CBoard API 组合门

- `verify:communication-volcengine-asr-http-mongo`：`2 passing`。
- 匿名上传返回 403，loopback provider 调用数为 0。
- 普通用户完成注册、激活和登录后，multipart MP3 返回 200。
- 上游认证头包含服务端 `X-Api-Key`；JSON 请求体包含 `volc.bigasr.auc_turbo` 对应请求数据、与请求头一致的非敏感 UUID、序列 `-1`、Base64 音频、ITN 和标点开关，并有断言证明请求体不含 API key。
- 客户端响应只包含可编辑文本、方言、engine、provider、时长和“不存音频”状态，不包含 API key 或 request id，并带 `no-store, private` 与 `nosniff`。
- 聚焦 ASR/provider/controller 回归 `30/30`；cboard-api 全量单元回归 `376/376`。

## 生效范围

- 生效于部署方显式选择 `COMMUNICATION_DIALECT_ASR_PROVIDER=volcengine` 时的认证服务端识别，以及所有 provider 成功返回的转写缓存边界。
- 不改变 CBoard Web 或微信 UI、录音格式选择、人工修改、文字规范化、分词、matcher、图卡、历史、WechatSI 和腾讯云 ASR。
- 不证明真实火山账号开通、额度、费用、粤语语料准确率、弱网、公开 HTTPS、微信合法域名或物理手机已经通过。
- 本轮没有使用 Computer Use，没有打开、聚焦或置顶微信开发者工具，没有真实 provider 请求、预览、上传、发布、部署、提交或推送。
