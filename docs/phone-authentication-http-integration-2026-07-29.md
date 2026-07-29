# 手机号登录与短信找回真实认证 HTTP 联调（2026-07-29）

- 记录时间：`2026-07-29 03:08:53`
- 执行工具 / 模型：`Codex（GPT-5.6）`

## 意图

验证图语家在 CBoard 技术底座上的手机号登录和短信找回不是只有界面、端口或单元测试，而是能够经过腾讯云官方 SDK 请求、Swagger HTTP、Mongo challenge、CBoard 用户查询、密码哈希和 JWT 撤销形成完整工程闭环。

## 决策

- 继续复用源码账本中已固定并运行的腾讯云官方 `tencentcloud-sdk-nodejs-sms@4.1.240`，对应 Git 提交 `3d3fe1bbd5fd293a938f535619d7246caf7ca870`。
- 继续使用现有 `/user/phone-verification`、`/user/phone-verification/confirm`、`/user/login/phone` 和 `/user/store-password/phone`，不新增小程序专用账号接口。
- 在既有显式门控集成测试中增加 `login` 与 `password-reset` 两种 purpose，使用隔离 Mongo 和 Nock 本地供应商响应；TC3 签名、SDK 请求模型及其余服务端代码全部走生产实现。
- 修复真实联调发现的旧 JWT 撤销缺口：`User.getById()` 返回给认证中间件的内部对象保留不可枚举 `authVersion`，供版本比较使用，但不进入 `/me` JSON。

## 理由

现有单元测试分别证明了 challenge purpose、密码更新和版本比较，却没有证明这些层组合后仍保留内部版本。公开 `toJSON()` 为保护响应主动删除 `authVersion`，恰好让认证中间件把所有数据库用户都当成版本 0；这种跨层错误只能由真实 HTTP 登录、重置和再次鉴权发现。复用不可枚举内部字段能保持公开隐私边界，也不需要改变 token 或建立第二套认证查询。

## 证据

- 修复前，短信找回已把数据库 `authVersion` 增加到 1，但旧 JWT 访问 `/me` 仍返回 `200`。
- 修复后，旧 JWT 返回 `403`；旧密码登录返回 `401`；新密码登录和新 JWT 访问 `/me` 均返回 `200`，响应不含 `authVersion` 或原始手机号。
- `login` token 用于密码重置返回 `400`，随后仍可正确登录；同一登录 token 重放返回 `401`。`password-reset` token 首次消费成功，重放返回 `400`。
- Mongo 中登录与重置 challenge 的 purpose 分别为 `login`、`password-reset`，均有 `consumedAt`，序列化结果不含原始手机号。
- `npm run verify:phone-verification-http-mongo`：`2 passing`。
- `npm run test:unit`：`376 passing`。
- CBoard 账号定向：`4 suites / 74 tests / 1 snapshot`。
- 微信 `cboardAccountPort`：`21 tests`；TypeScript、ESLint、production build 和 `10/10` 产物门通过。
- 微信 production 包：主包 `1,285,089 B`，距离 1.5 MiB 建议线仍有 `287,775 B`；全部分包低于建议线。
- CBoard 使用隔离 `BUILD_PATH` 的 production build 成功；已有 vendored AAC processor ESLint 警告未由本变动引入。

## 生效范围

本变动覆盖 cboard-api 中国大陆普通用户手机号登录、短信找回、purpose 隔离、一次性消费、密码哈希、旧 JWT/旧密码撤销和内部认证用户加载；CBoard Web 与微信现有入口继续复用同一协议，无 UI 语义变化。它不代表真实腾讯云账号、短信套餐、签名/模板审核、运营商投递、物理手机、公网 HTTPS、微信合法域名、国际号码或生产防轰炸已经验收。本轮未发送真实短信、未产生费用，未提交、推送、部署、预览、上传或发布；未使用 Computer Use，也未调用、打开、聚焦、抬升或置顶微信开发者工具。
