# 手机号验证真实认证 HTTP 与 Mongo 联调

- 记录时间：`2026-07-29 02:23:05`
- 执行工具 / 模型：`Codex（GPT-5.6）`
- 对应路线图：PicInterpreter issue #1“手机号验证”

## 意图

确认图语家迁移到 CBoard 后，手机号验证不是只有界面、字段和 mock，而是能够经过 CBoard 公共 API、腾讯云官方 SDK、Mongo challenge、人工验证码确认和既有邮件激活注册链完成一次性消费；同时避免在没有真实运营配置时发送短信或产生费用。

## 决策

- 复用 cboard-api 已固定的 `tencentcloud-sdk-nodejs-sms@4.1.240`，不自行实现 TC3-HMAC-SHA256、腾讯云 JSON 协议、重试或错误模型。
- 按 npm 元数据的 `gitHead=3d3fe1bbd5fd293a938f535619d7246caf7ca870` 克隆腾讯云官方 monorepo，并以该提交作为源码审查边界；npm 子包版本与 monorepo 根版本不同的事实单独记录，不猜测不存在的 tag。
- 新增显式环境门控的 `phoneVerificationHttp.mongo.integration.js` 和 `verify:phone-verification-http-mongo`。测试使用隔离 Mongo；Nock 只替代腾讯云公网响应，官方 SDK 仍真实生成签名请求。
- 完整验证公开配置、challenge、错误验证码、正确确认、既有 `POST /user` 注册、Mongo 消费状态和 token 重放拒绝。测试开始和结束都清理自身三类限流集合，保证同一隔离数据库可重复运行。
- 注册请求显式使用本地代理 IP，避免旧 `localize` 的 IPv6 映射地址识别问题触发无关 IPInfo 外网请求；不借机修改本轮无关业务逻辑。

## 理由

单元测试中的假 SDK、假 repository 和假注册服务只能分别证明局部逻辑，无法证明 Swagger 参数校验、官方 SDK 的 action/version/authorization、Mongo 原子状态和 CBoard 临时用户注册真正组合。直接调用真实腾讯云则依赖密钥、套餐、审核签名和模板，并可能向真实手机发码。使用官方 SDK 加本地确定性响应可以保留协议、签名和完整服务端链，又不泄露患者或家庭数据、不产生短信费用。

## 证据

- 官方来源：`https://github.com/TencentCloud/tencentcloud-sdk-nodejs`，固定提交 `3d3fe1bbd5fd293a938f535619d7246caf7ca870`，本地路径 `D:\used-by-codex\source-reviews\picinterpreter-phone-verification-http-20260729\tencentcloud-sdk-nodejs`。
- npm `tencentcloud-sdk-nodejs-sms@4.1.240` 的 repository 指向官方仓库，`gitHead` 指向上述提交；该提交 monorepo 根 `package.json` 为 `4.1.239`，安装到 cboard-api 的 SMS 包为 `4.1.240`，公共签名依赖为 `4.1.220`。这是发布结构差异，不冒充统一版本或 tag。
- 官方源码 `npm ci` 安装 408 packages，CJS/ES build 通过；官方 `sms.v20210111` 测试 `19/19` 通过，测试只验证 SDK 边界错误，没有发送短信。
- 独立 SDK 探针观察到 `x-tc-action=SendSms`、`x-tc-version=2021-01-11`、`TC3-HMAC-SHA256` authorization，以及 `PhoneNumberSet`、`TemplateParamSet` 和 `SessionContext`；本地响应被 SDK 正确解包。
- 新增组合门连续三次通过。最终结果为 `1 passing`，约 2 秒：公开响应不含密钥和验证码；错误码 400；正确码签发 64 位令牌；首次注册 200；Mongo challenge 保存脱敏号码、供应商 request id 和 `consumedAt`，不含原始号码/验证码；删除临时用户后重放 token 为 403 且不会生成第二个临时用户。
- cboard-api `npm run test:unit` 为 `376 passing`，新增测试与 `package.json` 的 Prettier 检查通过。完整旧 `npm test` 两次在 124 秒和 364 秒内没有终态，因此不作为通过证据。

## 生效范围

本次变更只增加 cboard-api 的可选手机号注册 provider/HTTP/Mongo 工程验收门、README 使用说明、决策记录和源码账本证据；不改变 CBoard Web 或微信界面，不改变 challenge、验证码、token、注册或登录协议，不新增依赖或 lockfile。

已证明的是“真实官方 SDK 请求 + 本地确定性供应商响应 + 真实 API/Mongo/注册消费”。尚未证明的是腾讯云真实账号、短信套餐、已审核签名与模板、运营商投递、物理手机收码、公网 HTTPS、微信合法域名、生产 Mongo、控制台防轰炸和隐私政策。没有发送真实短信、产生费用、提交、推送、部署、预览、上传或发布；没有使用 Computer Use，也没有打开、聚焦、抬升或置顶任何窗口。
