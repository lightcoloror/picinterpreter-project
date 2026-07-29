# AI Token 月额度真实 Mongo 并发与拒绝退款（2026-07-29）

## 结论

图语家 issue #1 要求的“Token billing、按用户时间窗限流和月额度”已有 cboard-api 请求前预留与实际 usage 结算实现。本轮没有重造配额系统，而是通过上游源码和真实 Mongo 发现并修复一个并发边界：`rate-limiter-flexible.consume()` 在超额 reject 前仍会原子增加点数，旧代码会让未调用供应商的拒绝请求永久占用额度。现在拒绝路径会使用同一上游库的 `reward()` 原子退回本次预留。

## 变动 1：重新核对需求与当前实现

- **意图：** 判断“请求前 Token 预留”究竟未实现，还是覆盖矩阵历史段落没有反映后续代码。
- **决策：** 读取当前 GitHub issue #1、覆盖矩阵变动 163、cboard-api quota service、usage ledger、middleware 和测试；确认预留、结算、释放、查询和删除均已存在，不重复增加第二套实现。
- **理由：** 开放 issue 和历史文字不能替代当前源码证据；重复实现会造成两个计数事实源并破坏现有 Web/微信降级协议。
- **证据：** issue #1 明确包含 Token billing、按用户时间窗限流和月额度；`createCommunicationAiTokenQuotaService` 已提供 `reserve`、`settleReservation`、`releaseReservation`、`getStatus` 和 `deleteUserQuota`。
- **生效范围：** 需求判断与后续实现边界；不改变代码、价格、套餐、支付或客户端。

## 变动 2：固定并运行成熟上游源码

- **意图：** 先确认项目实际依赖的 Mongo 原子语义，再决定是否需要补丁。
- **决策：** 固定 ISC 许可 [rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) `v11.2.0` 提交 `2c12f60043c4bc2d0a7b7d05392824027d810b75`，在隔离测试依赖中运行其 `RateLimiterMongo.test.js`，只复用现有 `consume/reward/penalty/get/delete`。
- **理由：** 该库已经是 cboard-api 的直接依赖，并提供 Mongo 原子操作；复用它比新增锁、队列、计数模型或 tokenizer 更小、更成熟。
- **证据：** 上游 `RateLimiterMongo with fixed window` 为 `32 passing`；源码 `_afterConsume` 明确在 `consumedPoints > points` 时 reject，但数据库增量已经完成。
- **生效范围：** cboard-api 配额并发语义的来源证据；不把上游仓库当作新的运行服务，不新增生产依赖。

## 变动 3：真实 Mongo 复现拒绝仍占额

- **意图：** 验证 mock 单测是否遗漏真实存储行为。
- **决策：** 新增环境变量显式门控的 `communicationAiTokenQuota.mongo.integration.js`，在隔离 Mongo 4.4 中让三个请求并发预留 40 Token、月额度固定 100。
- **理由：** 只有真实 `findOneAndUpdate` 和上游 reject 结果能证明并发状态；单元 mock 原先把 rejection 当成“没有写入”。
- **证据：** 首轮测试失败：两个 reservation fulfilled、一个正确 429，但 `getStatus()` 返回 `120 consumed`，而不是被接受请求应有的 `80`。
- **生效范围：** cboard-api Token 月额度真实 Mongo 验收门；默认单元测试不启动 Docker 或访问网络。

## 变动 4：使用上游原子退款做最小修复

- **意图：** 让未调用供应商的拒绝请求不占用额度，同时保持并发安全和失败关闭。
- **决策：** `reserve()` 捕获成熟 limiter rejection 后先对同一 hashed month key 执行 `reward(reservationTokens)`，成功后返回既有 429；退款失败返回既有 503。新增“拒绝后退款”和“退款失败关闭”单元测试。
- **理由：** `reward()` 是上游与 `consume()` 配套的原子操作；它能准确抵消本请求增量，不需要读取后写回、分布式锁或新 schema。
- **证据：** 修复后真实 Mongo 状态由 `120` 恢复为 `80`；单元回归同时证明退款参数使用同一哈希键和 4096 预留，退款故障返回 `COMMUNICATION_AI_TOKEN_QUOTA_UNAVAILABLE`。
- **生效范围：** 六类 Chat Completions 操作的月额度拒绝路径；不改变成功请求、usage schema、服务商调用、TTS、ASR、图片搜索、默认板或本地沟通。

## 变动 5：完整验证与环境清理

- **意图：** 排除回归并保证一次性源码/数据库验证不污染工程环境。
- **决策：** 运行上游定向测试、配额单元、cboard-api 全量单元、真实 Mongo 集成和 Prettier；完成证据提取后停止唯一命名容器并保留源码快照供后续复核。
- **理由：** 配额 middleware 位于所有 API 请求链，必须通过全量 controller 回归；隔离 Mongo 不能残留给后续任务误用。
- **证据：** 上游 `32/32`、配额单元 `13/13`、API `376 passing`、真实 Mongo `1/1`、四个变更文件 Prettier 通过；`picinterpreter-ai-token-quota-mongo-20260729` 已停止并自动删除，临时 npm 依赖目录已删除。
- **生效范围：** 当前未提交 cboard-api 工作树、来源账本、验证命令与本机隔离环境；不代表真实 AI provider、生产 Mongo、价格、支付、公网或物理手机已验收。

## 记录

- **执行工具 / 模型：** Codex（GPT-5.6）
- **时间：** 2026-07-29 01:14:05
- **操作边界：** 未使用 Computer Use；未打开、聚焦、抬升或置顶微信开发者工具；未预览、上传、发布、部署、提交或推送。
