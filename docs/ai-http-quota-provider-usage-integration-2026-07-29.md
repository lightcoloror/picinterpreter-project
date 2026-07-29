# 图语家 AI 增强 HTTP 配额与用量真实联调

- 文档状态：已验证
- 最后更新：2026-07-29 01:33:49
- 执行工具 / 模型：Codex（GPT-5.6）
- 关联工程：`cboard-api`、图语家 issue #1

## 变动 1：核对现有主链，避免重复开发

- **意图：** 确认 issue #1 要求的请求前额度保护、服务商 usage 记账和本人额度查询是否已有实现，只补真实缺口。
- **决策：** 保留现有 `communicationAiTokenQuota`、`communicationAiUsage`、OpenAI-compatible provider adapter、Swagger Bearer 认证和通用 `/gpt/communication/usage`；不新增计费服务、数据库、队列、代理或专用小程序 API。
- **理由：** 当前源码已经具备预留、结算、失败释放、Mongo 月账本和客户端降级，重复实现会增加并发与隐私风险。
- **证据：** 代码核对覆盖 `api/controllers/gpt.js`、`api/helpers/communicationAiTokenQuota.js`、`api/helpers/communicationAiUsage.js`、`api/swagger/swagger.yaml` 及现有单元测试；上一轮真实 Mongo 已证明拒绝退款后并发消耗不超过额度。
- **生效范围：** 本轮实施边界和 issue #1 完成度判断；不改变产品代码。

## 变动 2：固定并运行实际 OpenAI-compatible 依赖源码

- **意图：** 在编写端到端 fixture 前，验证 cboard-api 实际使用的 OpenAI Node SDK 版本和 Chat Completions 契约。
- **决策：** 克隆官方 `openai/openai-node` tag `v4.104.0`，固定提交 `7704e54f048c75f5fd96fa26e2b7b56cf0900a80`，使用仓库官方 `scripts/test` 启动 Prism 并运行 Chat Completions 测试。
- **理由：** cboard-api 的 `yarn.lock` 实际解析到 `openai 4.104.0`；直接复用官方测试入口比自行猜测请求、重试和 usage 字段更可靠。
- **证据：** 官方 harness 的 `tests/api-resources/chat/completions/completions.test.ts` 为 `11/11` 通过；直接 Jest 首次因未启动官方 Prism 而 `0/11`，随后按官方脚本修正。源码工作树保持干净，测试后 4010 端口无残留监听。
- **生效范围：** OpenAI-compatible fixture、SDK 重试与 usage 字段的来源证据；不把上游源码复制进产品包，也不调用真实 provider。

## 变动 3：建立真实认证 HTTP、Mongo 与假 provider 组合门

- **意图：** 验证登录、Swagger 角色、请求前预留、SDK 请求、provider usage、异步结算、Mongo 账本和额度查询能作为一条链工作。
- **决策：** 新增环境显式门控的 `communicationAiHttpQuota.mongo.integration.js` 和 npm 命令；使用现有 Supertest/Nock/用户 fixture，连接调用者提供的隔离 Mongo。测试 provider 只返回固定候选句与 usage，不访问互联网。
- **理由：** controller mock、limiter mock 和数据库单测分别通过，仍不能证明真实路由权限、认证和响应结束钩子正确装配；显式门避免默认测试依赖 Docker。
- **证据：** 首次测试因环境变量在 `test/helper` 加载后才设置，错误读取默认 Mongo；把环境设置移到项目模块加载前后，真实服务正确连接 `127.0.0.1:27031`。该失败只修改测试装配，没有更改业务语义。
- **生效范围：** cboard-api 可选本地集成验证；默认 `npm run test:unit` 和生产运行不启动 Mongo 容器或假 provider。

## 变动 4：修复普通用户无法读取本人 AI 额度

- **意图：** 让患者/家庭使用的普通 CBoard 账号能够读取自己的当前月用量和剩余额度，同时不暴露其他用户数据。
- **决策：** 将 `/gpt/communication/usage` 的首个 Swagger scope 从误写的第二个 `admin` 改为 `user`，继续保留 `admin`；控制器仍只使用认证令牌中的 `req.user.id` 查询当前用户。
- **理由：** 路由定义为 `admin/admin` 与控制器、决策文档和双端状态 UI 的“本人额度”语义冲突。放行 `user` 不增加跨账号查询参数，因此不会扩大到他人数据。
- **证据：** 修复前，同一普通用户生成候选句为 HTTP 200，但随后 usage 查询为 403；修复后查询为 200，响应只包含当前月数字汇总、按操作拆分和 quota，不含提示词、患者正文或 provider key。
- **生效范围：** 普通用户与管理员的本人 AI 用量查询权限；不改变其他路由角色、查询条件、额度算法或响应内容。

## 变动 5：验证结算、失败释放和 provider 前拒绝

- **意图：** 证明额度不仅“能查询”，还与真实 SDK 请求结果一致，并在耗尽时阻止费用发生。
- **决策：** 用 100-token 月额度和 40-token 文字预留执行四步场景：25-token 成功、provider 500、60-token 成功、第四次超额请求；轮询现有异步结算结果，不增加测试专用业务分支。
- **理由：** 成功、失败和拒绝必须在同一认证用户和同一 Mongo 月键上连续发生，才能验证预留生命周期完整且 provider 不被超额请求调用。
- **证据：** 第一次结算 25；OpenAI SDK 按现有 `maxRetries=1` 发出两次 500 后预留释放，余额仍 25；第二次结算后总额 85、剩余 15；第四次返回 `429 COMMUNICATION_AI_TOKEN_QUOTA_EXCEEDED`，Nock 证明没有额外 provider 调用，最终仍为 85。API 单元 `376/376`、底层真实 Mongo `1/1`、HTTP 组合门 `1/1`、Prettier 通过。
- **生效范围：** issue #1 的工程验收证据、cboard-api 测试门和本人 usage 权限；真实供应商密钥、供应商账单、生产 Mongo、公网 HTTPS、微信合法域名、价格和支付仍需独立验收。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
