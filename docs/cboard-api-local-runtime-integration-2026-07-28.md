# CBoard API 本地真实运行联调记录

## 结论

图语家复用的 `cboard-api` 已在隔离 Mongo 和真实 HTTP 进程中完成核心联调，不再只依赖 model/controller 单元测试。账号登录、`communicationSupport`/旧 `tuyujia` Settings 兼容、接收记录乐观并发、反馈合并、结构化删除墓碑、防止旧设备复活、数据库索引 readiness 与 Swagger 均通过。外部邮件、AI、IPInfo、Azure 等未配置能力仍保持降级，不冒充生产联调完成。

## 变动 1：隔离本地运行环境并验证公开健康面

- **意图：** 证明 CBoard API 在真实 Node、Mongo、Swagger 和 HTTP socket 中可启动，避免把纯函数测试当成可运行后端。
- **决策：** 不修改仓库默认端口或环境文件；临时使用 `127.0.0.1:19010`，并启动退出即删除的 `mongo:4.4` 容器映射到 `127.0.0.1:27027`。两个端口均先通过本机端口记录、live listener、排除范围和真实 bind 预检。
- **理由：** 默认 `10010` 位于本机 Windows 动态端口范围，临时改用范围外端口可以避免偶发 bind 冲突；隔离数据库不会污染用户已有 Mongo 或其他 Docker 服务。
- **证据：** Mongo `db.adminCommand('ping').ok=1`；API `/health` 返回 `status=ok`、`database=connected`、`communicationIndexes=ready`，`/docs/` 返回 HTTP 200 且包含 Swagger。API PID `10768` 和容器 `picinterpreter-cboard-mongo-smoke` 均在验证后精确停止，容器因 `--rm` 自动删除。
- **生效范围：** 本轮本机 cboard-api 运行证据；不改变生产部署、仓库端口、Docker Compose、环境文件、数据库 schema、微信合法域名或公网 HTTPS。

## 变动 2：真实账号、Settings 与接收同步主链闭环

- **意图：** 证明图语家双向沟通的服务端持久化不是只有 schema 字段，而能经过认证路由真实写入、读取、冲突和删除。
- **决策：** 直接复用仓库已有 `seed:local-runtime-user`、`verify:communication-support-settings`、`verify:communication-receiver-sync` 和 `verify:communication-readiness`，不新增第二套 smoke 客户端或专用 API。
- **理由：** 这些 verifier 调用与 Web/微信相同的登录、Settings 和 receiver-records 路由，覆盖真实 Bearer token、Mongo 文档与版本更新，比 controller stub 更接近跨设备联调。
- **证据：** Settings verifier 通过 `legacy-tuyujia-read` 与 `dual-write-readback`；receiver verifier 通过认证创建、设备 A 反馈、旧设备 canonical conflict、追加反馈重试、结构化墓碑、旧记录防复活和同时反馈冲突重试，删除后的最终 `serverVersion=4`，并发记录结算为 `serverVersion=3`；readiness verifier 明确报告数据库和必需索引 ready。
- **生效范围：** CBoard Web 与微信共用的账号 Settings 和接收记录 API；不证明真实邮箱激活、短信、Azure 私有 Blob、AI/provider、两台物理手机或公网并发已经通过。

## 变动 3：如实保留旧 controller 套件限制

- **意图：** 避免为了得到全绿结果而伪造外部服务、扩大超时或把基础设施失败误写成图语家业务失败。
- **决策：** 完整 `npm test` 在 `604` 秒内无终态后停止等待；随后只为定位进行旧文件分组。分组并行时两个 Mocha 进程同时监听默认 `10010`，产生 `EADDRINUSE`，同时旧 GPT 和 IPInfo 用例暴露未配置 provider/无效 token。该分组结果只用于诊断，不记为业务回归结果。
- **理由：** 旧集成目录仍混合真实 SMTP、GPT、IPInfo、固定端口和 2 秒 hook；本轮真实 HTTP verifier 已独立证明图语家核心路由。修改旧测试或伪造外部响应不应与功能迁移混在同一切片。
- **证据：** 完整命令超时退出码 `124`；诊断组为 `5 passing / 7 failing`，失败包含端口冲突、旧外部 GPT 503、IPInfo 403/404 和由 before hook 超时引发的后续空数据。超时子进程均自行结束，未终止无关 Node；源码账本校验保持 `0 errors`，当前 `83 warnings` 均为既有条目分类。
- **生效范围：** 后续 API 验收口径和测试治理；不削弱已通过的真实 Settings/receiver/readiness 证据，也不声称旧完整 controller 套件已通过。

## 工具与记录

- **执行工具/模型：** Codex（GPT-5.6）、Docker、PowerShell、仓库现有 Node verifier、Obsidian MCP。
- **记录时间：** 2026-07-28 23:22:39。
- **操作边界：** 未使用 Computer Use；未打开、聚焦、抬升或置顶微信开发者工具；未预览、上传、发布、部署、提交或推送。
