# Azurite 私有快照云端互操作来源审查

## 结论

微软官方 Azurite `v3.35.0` 可作为本轮一次性、本机隔离的 Azure Blob 兼容服务，用于验证 `cboard-api` 私有快照真实 HTTP/Mongo/Blob 路径。它不进入 CBoard、微信或 API 的产品依赖，不替代生产 Azure 验收，也不注册为长期本地工具。

## 变动 1：固定官方源码与版本

- **意图：** 在启动第三方 Blob 模拟器前先核对真实源码、许可证和固定提交，避免只相信 Docker 镜像标签。
- **决策：** 浅克隆微软官方 `Azure/Azurite` 标签 `v3.35.0`，固定提交 `fd1103bbf702dc35220ba282260176132d7c7844`，保存在隔离来源审查目录；采用 MIT 许可边界。
- **理由：** 图语家的私有快照控制器使用 Azure Blob API；官方模拟器比自写内存 Blob 或伪造 controller 更接近生产协议，同时固定提交可让运行证据可复现。
- **证据：** 本地 `package.json` 为 `azurite@3.35.0`，提供 `azurite-blob`、`--blobHost`、`--blobPort` 和内存持久化；`LICENSE` 为 Microsoft MIT。官方发布页记录 `v3.35.0`，官方文档说明 Docker Blob 入口与 `UseDevelopmentStorage=true` 连接方式。
- **生效范围：** 本轮来源审查和临时 Blob 联调；不把 Azurite 源码、镜像、依赖或配置打入任何产品包。

## 变动 2：源码安装、编译和 Blob 测试

- **意图：** 用真实运行结果确认模拟器能承载创建容器、上传、下载和删除 Blob，而不是只阅读 README。
- **决策：** 按官方 `package-lock.json` 执行 `npm ci`，由 `prepare` 完成 TypeScript build，再运行官方 `test:blob:in-memory`。
- **理由：** 私有快照需要验证真实二进制密文往返；官方 Blob 套件能覆盖认证、容器、Block Blob、下载、删除、条件请求和内存存储等底层行为。
- **证据：** 安装与 TypeScript build 成功；ESLint 通过；Blob 内存模式为 `472 passing / 3 pending`，总时长约两分钟。测试依赖包含 `azure-storage 2.10.x`，与 `cboard-api` 当前使用的同系列 SDK 兼容。安装输出同时提示 `azure-storage`、`request`、`uuid 3` 等旧依赖已弃用，因此 Azurite只作隔离开发依赖，不进入生产运行时。
- **生效范围：** Azurite 源码审查目录及一次性本地联调可信度；不声称完整 Queue/Table、SQL 后端、生产 Azure、HTTPS 或性能已经通过。

## 变动 3：临时运行安全边界

- **意图：** 让后续真实 HTTP/Mongo/Blob 联调可复现，同时不污染长期服务或暴露开发存储端口。
- **决策：** 如获明确授权，只启动固定版本官方容器，Blob 端口仅映射到本机 `127.0.0.1:10000`，使用内存持久化、关闭遥测，并在验证结束后删除容器；Mongo 继续使用已获授权的独立临时容器和数据库。
- **理由：** 本机回环、内存存储和退出即删除可以把影响限制在当前验证；长期运行或映射到所有网卡没有必要。
- **证据：** 官方源码和 Microsoft Learn 均支持独立 `azurite-blob`、自定义监听地址/端口和内存持久化；本机预检确认 `10000`、`19011`、`27028` 当前均未监听。
- **生效范围：** 后续一次性端到端联调进程；不创建持久 volume，不修改 Docker Compose、系统代理、开发者工具或生产配置。

## 记录

- **执行者：** Codex（GPT-5.6）
- **时间：** 2026-07-29 00:11:57
- **本地源码：** `D:\used-by-codex\source-reviews\picinterpreter-private-cloud-interop-20260729\azurite`
- **上游：** https://github.com/Azure/Azurite/tree/fd1103bbf702dc35220ba282260176132d7c7844
- **官方运行文档：** https://learn.microsoft.com/azure/storage/common/storage-install-azurite
- **工具边界：** 全程后台 shell；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶任何窗口；未提交、推送、预览、上传、发布或部署产品。

## 变动 4：真实集成发现并验证 Azure 私有容器协议缺陷

- **意图：** 将来源审查从“模拟器自身可运行”推进到“能否真实验证 cboard-api 当前 Azure SDK 请求”。
- **决策：** 使用固定镜像启动只绑定 `127.0.0.1:11000` 的 Blob 内存实例；因本机 `10000` 无法绑定且未发现可安全终止的已知占用，不终止任何未知进程，改用显式连接串指向 `11000`。真实失败后同时核对 Azurite 日志、微软 REST 文档和本地 `azure-storage 2.10.7` 源码。
- **理由：** 临时端口不应成为清理无关进程的理由；协议差异必须判断是模拟器缺陷还是产品请求错误，不能为“让测试变绿”加入 Azurite 专用分支。
- **证据：** 首轮上传复现 `Unsupported containerPublicAccessType off`。微软 REST 规定省略 `x-ms-blob-public-access` 即私有，公开值为 `blob`/`container`；旧 SDK 创建逻辑会原样发送 `publicAccessLevel`，而 `OFF` 仅用于解析没有公共访问字段的响应。移除非法创建值后，同一官方镜像完成两类密文 Blob 的共享密钥上传、HEAD、GET 和 DELETE，显式跨端测试 `2/2` 通过。
- **生效范围：** Azurite 作为 Azure 协议验证器的可信证据、cboard-api 私有容器最小修复与本轮端口选择；不产生模拟器专用产品代码，不宣称生产 Azure 已验收。

## 变动 5：一次性运行结束并回收环境

- **意图：** 保持来源审查工具不演变为未登记的长期后台服务。
- **决策：** 证据提取后停止并自动删除本轮唯一命名的 Azurite、Mongo 容器，同时停止已由 PID 文件和健康检查核验的 API 进程。
- **理由：** 内存模式的价值就是可重复且无长期状态；保留旧容器会使后续测试误用历史 Blob 或端口。
- **证据：** 停止后两个容器在 `docker ps -a` 中均不存在，API 和 Blob 回环端点不再响应；没有停止其他 Docker 容器或 Node 进程。
- **生效范围：** 本轮本机隔离运行时；保留固定源码审查目录、来源账本条目、测试和文档证据。

- **追加记录：** Codex（GPT-5.6），2026-07-29 00:37:49。
