# 图语家去背景真实认证 HTTP 联调

- 文档状态：已验证
- 最后更新：2026-07-29 01:53:50
- 执行工具 / 模型：Codex（GPT-5.6）
- 关联需求：issue #82

## 变动 1：补齐 rembg 源码账本

- **意图：** 给既有本地 rembg smoke 补上可复现的官方源码、提交和运行证据，而不是只记录安装包名称。
- **决策：** 克隆官方 `danielgatis/rembg v2.0.75`，固定提交 `7b8de60ef9fc225af1768d81aa09da29db22a355`；使用独立 Python 3.11 虚拟环境安装 `cpu/cli/dev` extras，不把 Python 依赖或模型放入三个产品仓库。
- **理由：** 源码账本此前没有 rembg；历史 PyPI `2.0.76` 可以解析，但官方 Git 当前最新可审计 tag 是 `v2.0.75`，必须区分包版本和固定源码提交。
- **证据：** 安装解析 102 个包并确认 `rembg==2.0.75` 来自固定本地源码，源码 `git status --short` 为空。
- **生效范围：** rembg 来源证据、后续升级基线和源码账本；不改变 cboard-api 生产依赖或部署版本。

## 变动 2：运行官方 HTTP 服务和真实模型

- **意图：** 确认 CBoard adapter 所依赖的 `/api/remove` multipart 路由不是文档假设，并取得真实透明图片输出。
- **决策：** 使用官方 CLI `rembg s --host 127.0.0.1 --port 17000 --no-ui` 后台启动，只监听本机；把 Numba 缓存和模型目录隔离到 `C:\tmp`。用官方自带汽车 fixture 和较小 `u2netp` 模型执行一次处理。
- **理由：** 官方唯一全量 pytest 会下载并运行 15 个模型，成本过高且不适合作为日常门；一个真实 fixture 已足以验证 CLI、FastAPI、multipart、模型加载和透明输出契约。
- **证据：** 首次 CLI 因 Numba 无缓存定位器失败，设置受支持的 `NUMBA_CACHE_DIR` 后成功；`/openapi.json` 为 200。真实输出 `480x360 / 82,754 B`、PNG、透明通道存在、alpha `0-255`。
- **生效范围：** 官方 rembg 源码运行证据；不代表家庭照片抠图质量、生产吞吐或全模型回归。

## 变动 3：用 CBoard adapter 直连官方 rembg

- **意图：** 证明已有 `communicationBackgroundRemovalProvider` 能直接使用官方服务，而不是只有 curl 能工作。
- **决策：** 复用仓库现有 `npm run verify:background-removal` 和官方 fixture，不增加专用 adapter 或测试算法。
- **理由：** 真实产品使用的是 Node adapter；只运行官方 curl 不能证明 multipart 字段、输出边界和隐私标志一致。
- **证据：** adapter 输出 `480x360 / 78,560 B` 透明 PNG，哈希 `46854ef1a07f8411fef89b2eadff905bc47712c1ded4e997d7f082fb2ffe6302`，`sourceStored=false`、`originalRetained=true`，约 14 秒完成。
- **生效范围：** cboard-api 自托管 rembg adapter 的本机真实 provider 证据；不配置生产 URL 或密钥。

## 变动 4：建立普通用户真实认证 HTTP 闭环

- **意图：** 补齐矩阵 #82 明确缺失的“真实鉴权 HTTP 全链”，确认患者家庭使用的普通账号能从 API 路由取得候选图。
- **决策：** 新增环境显式门控的隔离 Mongo、真实用户注册/激活/登录、Swagger multipart 上传和 Nock provider 集成测试。provider 返回由 Sharp 生成的真实透明 PNG；测试事后捕获并验证 multipart。
- **理由：** controller 单测和 Swagger fixture 不执行真实 Bearer 角色；真实 provider smoke 又不经过账号。组合门能证明认证、隐私改名、controller 和响应校验在一条链中工作，又不产生真实费用。
- **证据：** 匿名上传返回 CBoard 既有 403 且 provider 未调用；普通 `user` 上传 JPEG 后返回 200，provider 收到字段 `file` 和 `communication-image.jpg`，响应 PNG 字节、`4x3` 尺寸、provider、未存储和保留原图标志全部一致。最终 `2/2` 通过。
- **生效范围：** cboard-api 去背景认证路径和 issue #82 工程证据；不改变 Web/微信 UI、授权或保存逻辑。

## 变动 5：代理与夹具问题不转化为产品改动

- **意图：** 记录联调中的环境失败，避免未来重复把测试基础设施问题误判为业务缺陷。
- **决策：** 接受全站既有匿名 403；把合成域名追加到测试进程现有 `NO_PROXY/no_proxy`；Nock 捕获二进制 multipart 后识别其十六进制表示再断言。不改产品认证、代理或 multipart 实现。
- **理由：** 调试日志证明系统代理曾把请求送往 `127.0.0.1:10808`，绕过 Nock；Nock 回调又把二进制 body 序列化为 hex。二者都不是 provider 业务错误。
- **证据：** 修正后集成 `2/2`、API 全量单元 `376/376`、Prettier 全通过；测试请求不访问真实付费 provider。
- **生效范围：** 新集成测试的可重复性；用户和生产代理配置保持不变。真实公网、合法域名、生产并发、家庭照片质量和真机仍待外部验收。本轮未使用 Computer Use，未打开或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
