# 私有快照真实云端跨端联调

## 结论

图语家的两个账号私有快照已经从“Web/微信离线互操作”推进到真实 `cboard-api + MongoDB + Azure Blob` 兼容链验证。Web 生成的 `PIE2EE01` 密文可以经认证 API、Mongo 元数据和私有 Blob 后由微信端解密；微信生成的密文也可以由 Web 端解密。服务端不接触密码和明文 ZIP，明文上传会被拒绝，元数据响应不返回 Blob URL。

## 变动 1：复用官方 Azurite 建立真实 Blob 协议门

- **意图：** 在不依赖生产 Azure 凭据的前提下，验证真实 Azure Storage SDK、共享密钥认证、容器、Block Blob、下载和删除路径，而不是以 controller stub 代替云端证据。
- **决策：** 固定并复用微软官方 Azurite `v3.35.0`（提交 `fd1103bbf702dc35220ba282260176132d7c7844`），先完成源码安装、编译和官方 Blob 内存测试，再以官方 Docker 镜像启动只绑定 `127.0.0.1:11000` 的一次性内存实例。
- **理由：** `cboard-api` 当前使用 Azure Storage Node SDK `2.10.7`；Azurite 官方 Blob 套件也覆盖同系列 SDK，能够暴露伪造内存仓储无法发现的 REST 头与认证兼容问题。
- **证据：** Azurite 源码 `npm ci`、TypeScript build、ESLint 通过，官方 `test:blob:in-memory` 为 `472 passing / 3 pending`；镜像固定为 `mcr.microsoft.com/azure-storage/azurite:3.35.0`，摘要 `sha256:647c63a91102a9d8e8000aab803436e1fc85fbb285e7ce830a82ee5d6661cf37`。来源审查见 `docs/azurite-private-snapshot-cloud-interop-source-review-2026-07-29.md`。
- **生效范围：** 本地一次性云端互操作验证与源码账本；不把 Azurite 加入 CBoard、微信、API 产品依赖，不替代生产 Azure、HTTPS、合法域名或双真机验收。

## 变动 2：修复私有容器创建时的非法公共访问值

- **意图：** 让私有快照在真实 Azure Blob 协议下可创建私有容器并上传，同时保持匿名访问关闭。
- **决策：** `communicationPrivateLibrary` 调用通用 Blob helper 时不再传入 `publicAccessLevel: 'off'`；继续保留 Blob 内容设置 `cacheControl: 'private, no-store'`。对应 helper/controller 单测改为断言私有调用使用存储服务的默认私有容器语义。
- **理由：** Azure REST 的 `x-ms-blob-public-access` 是可选头，省略时容器为私有；公开值只有 `blob` 或 `container`。旧 SDK 的 `BlobContainerPublicAccessType.OFF` 是解析“响应没有公共访问头”时的结果值，不是创建容器时可发送的 REST 值。把 `off` 发送为请求头会创建不受支持的访问类型并使后续共享密钥访问失败。
- **证据：** 修复前两条真实上传均返回 HTTP 500；Azurite 日志明确为 `Unsupported containerPublicAccessType off`。修复并重建内存容器后，图片库与设备数据上传、HEAD、GET 和 DELETE 均通过共享密钥认证。聚焦单测 `14 passing`，后端完整单测 `374 passing`，目标文件 Prettier 全通过。
- **生效范围：** `cboard-api` 两个私有归档端点共用的容器创建路径；不改变公共媒体 Blob 的长期缓存和公共访问逻辑，不改变加密格式、Mongo schema、路由或客户端 UI。

## 变动 3：新增显式门控的真实双向云端互操作测试

- **意图：** 把离线 ZIP/加密 adapter 证据连接到生产中性 cloud port 和真实 HTTP 服务，防止仅凭各层单测推断端到端可用。
- **决策：** 新增 `tests/interop/privateArchiveCloudInterop.test.ts`，仅在 `PRIVATE_ARCHIVE_CLOUD_E2E=1` 时访问本机隔离 API；默认测试发现时跳过两条外部运行用例。测试直接复用 Web Blob 加解密、微信 Uint8Array 加解密、微信生产 cloud port、真实 `fetch` multipart/download 和现有 API 路由。
- **理由：** 外部服务测试不应让普通离线测试依赖 Docker、Mongo 或固定端口；显式门控既保留可复现的真实证据，也避免开发者无意访问网络或污染本机数据库。
- **证据：** 显式运行得到 `1 file / 2 tests passed`。方向一为 Web 加密图片库→API/Mongo/Blob→微信解密；方向二为微信加密设备数据→API/Mongo/Blob→Web 解密。两个方向均逐字节验证密文上传/下载和解密后 ZIP；测试同时断言明文 ZIP 返回 400、元数据包含格式/版本/大小/SHA-256 且不包含 `blobUrl`，删除后设备数据元数据返回 404。
- **生效范围：** 微信仓库独立互操作测试与本机/CI 可选集成门；不进入生产包，不新增测试专用 API，不在默认 `npm test` 中启动外部服务。

## 变动 4：完成真实 API、Mongo 和 Blob 往返

- **意图：** 证明前后端分离方式可以承载图语家私有数据迁移，而不是要求小程序把服务器能力全部搬入客户端。
- **决策：** 使用一次性 `mongo:4.4`（`127.0.0.1:27028`）、Azurite Blob（`127.0.0.1:11000`）和 `cboard-api`（`127.0.0.1:19011`），复用已有本地账号 seed、Bearer 登录、Swagger 路由、Mongo 模型和 Azure SDK；验证结束后仅停止本轮命名资源。
- **理由：** 真实登录、multipart、Mongo 元数据、Blob 私有认证、完整性校验和下载组合，才能覆盖前后端之间最容易遗漏的类型、协议、认证与持久化边界。
- **证据：** `/health` 返回 HTTP 200，`database=connected`、`communicationIndexes=ready`、`privatePictureLibrary=configured`；API 日志记录登录 200、两类密文上传 200、元数据 200、明文上传 400、两类下载 200、删除 200 和删除后元数据 404。Azurite 日志记录私有容器没有公共访问类型、共享密钥签名匹配、`cache-control: private, no-store`、229/243 字节 Blob 的下载与永久删除。
- **生效范围：** 本机真实协议证据和后续部署验收基线；不证明生产 Azure 账号、Caddy/HTTPS、微信合法域名、弱网、并发覆盖或两台物理设备已经通过。

## 变动 5：扩大质量门并清理隔离资源

- **意图：** 确认最小后端修复和集成测试没有破坏 CBoard API 或微信生产包，并避免临时服务长期占用端口。
- **决策：** 在真实集成通过后执行后端完整单测、微信完整测试/质量门/类型/Lint/边界/生产构建；随后只停止已核验 API PID 和本轮唯一命名的 Azurite、Mongo 容器。
- **理由：** 私有云闭环横跨共享核心、Web adapter、微信 port 和 API；只跑新测试不足以排除生产构建、包体或边界回归。隔离服务退出即删除可以防止后续任务误用旧状态。
- **证据：** API `374 passing`；微信 `85 files passed / 1 skipped`、`376 tests passed / 2 skipped`，显式云端测试另为 `2 passed`；微信质量门 `10/10`、TypeScript、ESLint、`229 app files / 32 CBoard core files` 边界和 Taro production build 全通过。主包 `1,285,089 B`，所有分包低于 1.5 MiB 建议线。API PID `69820` 和两个本轮容器已停止，容器列表为空，`19011` 与 `11000` 不再响应。
- **生效范围：** 当前未提交工作树的验证结论、性能基线和环境清理；微信插件下载体积仍须在正式上传前由开发者工具官方性能扫描确认，本轮未预览、上传、发布、部署、提交或推送。

## 记录

- **执行者：** Codex（GPT-5.6）
- **时间：** 2026-07-29 00:37:49
- **运行方式：** 后台 shell 与 Obsidian MCP；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶微信开发者工具窗口。
- **安全边界：** 未记录账号密码、存储密钥或密文内容；测试凭据与模拟器连接串只存在于一次性进程环境。

