# PIE2EE01 端侧加密 Web 与微信双向互操作验证

## 结论

图语家的两个账号私有快照已经共用 `PIE2EE01`、Noble `scrypt + XChaCha20-Poly1305` 和同一纯核心，但原有测试分别只证明 Web Blob adapter 自往返、微信 Uint8Array adapter 自往返。本轮不新增密码学、格式、依赖或生产代码，而是在独立互操作测试层证明两端真实 wrapper 可以双向解密，并保持错误密码认证失败。

## 变动 1：Web 密文由微信 adapter 解密

- **意图：** 证明浏览器生成的 `.pijenc` Blob 可以在微信端恢复，而不是只根据两端都调用同一函数推断兼容。
- **决策：** 直接调用 Web `encryptPrivateArchiveBlob`，读取实际 `application/octet-stream` 字节后交给微信 `decryptPrivateArchiveData`；测试固定安全随机输入以获得稳定信封，但加密、KDF、AAD 和认证解密全部运行真实共享核心。
- **理由：** 跨设备迁移经过 Blob 与 Uint8Array 两种平台边界，wrapper 的类型转换、内容类型或字节截断同样可能破坏密文。直接连接两端 adapter 比只测纯核心更接近真实迁移路径。
- **证据：** 密文以 `PIE2EE01` 开头且不暴露 ZIP `PK` magic；微信 adapter 解密后与原始 ZIP 字节完全一致。
- **生效范围：** Web→微信端侧加密快照互操作证据；不改变密码、信封、API、Blob、UI 或本机恢复逻辑。

## 变动 2：微信密文由 Web adapter 解密

- **意图：** 证明微信生成的 Uint8Array 密文可以由 CBoard Web 恢复，形成真正双向迁移证据。
- **决策：** 调用微信 `encryptPrivateArchiveData` 生成实际信封，再包装为 Web `application/octet-stream` Blob 并交给 `decryptPrivateArchiveBlob`；同时用 Web 加密、微信错误密码解密验证跨 adapter 的认证失败码。
- **理由：** 每账号最新快照可能由任一端创建、另一端恢复；单向兼容不足以支撑家庭在 Web 与小程序之间迁移完整私有数据。
- **证据：** Web 输出 `application/zip` Blob 且字节与原始归档完全一致；错误密码返回 `PRIVATE_ARCHIVE_DECRYPTION_FAILED`，没有输出明文。
- **生效范围：** 微信→Web 端侧加密快照和错误密码契约；不等同于真实 Azure、HTTPS、两台设备或人工密码输入已经验收。

## 变动 3：保持开源复用与小程序边界

- **意图：** 在补强跨端证据时继续复用既有成熟密码学，不把浏览器组件或测试依赖打入微信生产包。
- **决策：** 沿用已固定的 `@noble/ciphers@1.3.0`、`@noble/hashes@1.8.0` 和共享 `privateArchiveEncryption.js`；测试放在 `tests/interop`。Node 测试只按现有 Taro adapter 单测模式 mock 未调用的 `getRandomValues` 宿主入口，生产 wrapper 和加密核心保持真实。
- **理由：** 自研密码学或新增第二种信封会制造不可审计风险；跨仓库测试属于验证基础设施，不属于小程序运行时。
- **证据：** 聚焦 `1 file / 3 tests`，新增测试 ESLint、`229 app / 32 CBoard core` 边界通过；最终微信全量 `85 files / 372 tests`、质量门 `10/10`、TypeScript、应用源码 ESLint和 production build 全通过。包体不变：main `1,285,089 B`、backup `649,483 B`，全部包低于 1.5 MiB。源码账本校验仍为 `0 errors / 83 existing warnings`，本轮没有引入新的第三方来源。
- **生效范围：** 独立互操作测试与两个账号私有快照的工程证据；不新增依赖、插件、媒体、密钥或云配置，不预览、上传、发布、部署、提交或推送。

## 变动 4：完整私有快照组合链双向通过

- **意图：** 证明 `PictureLibraryArchive v1 custom + LocalDeviceData sidecar + PIE2EE01` 不是四组可分别通过却无法组合的模块，而能完成真实跨端私有数据迁移。
- **决策：** Web→微信路径由 Web JSZip builder 生成带 `account-private-snapshot` purpose 和常用语 sidecar 的 custom ZIP，经 Web Blob adapter 加密、微信 byte adapter 解密，再由微信 fflate service 事务恢复；微信→Web 路径由微信 `buildPrivateDeviceDataArchive` 生成 fflate ZIP，经微信加密、Web 解密，再由 Web JSZip reader 合并。两端都使用现有身份、冲突策略和 LocalDeviceData 规范化，不建立测试专用格式。
- **理由：** 分别证明 ZIP 互通与密文互通仍可能遗漏组合处的 Blob/Uint8Array、sidecar purpose、归档内容类型或恢复合并差异。账号完整私有快照必须按用户实际操作顺序验证整条管线。
- **证据：** 聚焦归档互操作 `1 file / 4 tests` 通过；Web 加密快照在微信恢复后调用常用语覆盖端口并包含“Web 私有常用语”，微信加密快照在 Web 恢复后 `deviceDataStats.savedPhraseCount=1` 且包含“微信私有常用语”。最终微信全量 `85 files / 374 tests`、质量门 `10/10`、TypeScript、应用源码和互操作测试 ESLint、`229 app / 32 CBoard core` 边界及 production build 全通过；生产包体不变。
- **生效范围：** #46/#47 的账号完整私有数据离线跨端迁移工程证据；不改变普通账号同步白名单、私人图片独立快照、密码、加密信封、API/schema 或 UI，也不冒充 Azure/Mongo/HTTPS、合法域名、两台物理设备、弱网覆盖和人工密码输入已通过。

## 变动 5：私人图片加密快照组合链双向通过

- **意图：** 独立验证家庭私人图片快照能够携带真实图片字节、当前家庭身份和来源归属跨 Web 与微信迁移，而不是从完整私有数据 sidecar 或纯加密字节测试推断图片可恢复。
- **决策：** 继续复用 `PictureLibraryArchive v1 custom`、设备私有图片偏好、现有 JSZip/fflate adapter 和 `PIE2EE01`。Web→微信执行 Web custom ZIP 生成、Web 加密、微信解密、微信事务恢复；微信→Web执行微信 custom ZIP 生成、微信加密、Web 解密、Web ZIP 读取。fixture 仅包含一张家庭私图及真实 PNG 字节，归档稳定路径沿用 `images/custom/`，不建立测试专用路径或格式。
- **理由：** 私人图片是与常用语等 LocalDeviceData 不同的独立账号快照；只有把图片偏好、媒体字节、attribution 和身份重绑定放进真实双向组合链，才能排除 data URI、微信本地文件路径、ZIP 条目或 adapter 字节转换造成的“记录恢复但图片不可显示”。
- **证据：** 聚焦 `1 file / 6 tests` 通过；Web 加密快照由微信恢复后保持当前身份和 attribution，媒体写入 `wxfile://restored/images/custom/`，落盘 PNG 字节与原始字节完全一致；微信加密快照由 Web 恢复后得到 `data:image/png;base64,iVBORw0KGgo=`，并保持 attribution 与当前身份。最终微信全量 `85 files / 376 tests`、质量门 `10/10`、TypeScript、应用源码和互操作测试 ESLint、`229 app / 32 CBoard core` 边界及 production build 全通过；main `1,285,089 B`、backup `649,483 B`，生产包体不变。
- **生效范围：** #46/#47 的私人图片独立账号快照与 Web/微信离线迁移工程证据；不改变完整私有数据 sidecar、普通账号同步、归档路径、密码、信封、API/schema、UI、依赖或生产包。真实云、HTTPS、合法域名、两台物理设备、低存储和人工密码交互仍待外部验收。

## 记录

- **执行者：** Codex（GPT-5.6）
- **时间：** 2026-07-29 00:00:38
- **工具边界：** 全程使用后台 shell 与 apply_patch；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶微信开发者工具。
