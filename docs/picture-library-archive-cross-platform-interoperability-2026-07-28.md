# PictureLibraryArchive v1 Web 与微信双向互操作验证

## 结论

`PictureLibraryArchive v1` 先前已有 Web 自往返和微信自往返测试，但“cross-platform”名称没有证明两套压缩实现能互相读取。本轮不新增归档格式、依赖或业务逻辑，而是在独立互操作测试层直接调用 CBoard Web 的 JSZip adapter 与微信生产 fflate service，证明包含图片、图卡录音和短视频的归档可以双向迁移。

## 变动 1：补齐 Web 到微信的真实恢复证据

- **意图：** 证明 CBoard Web 生成的真实 ZIP 不只是满足共享 manifest 的表面结构，而能由微信生产恢复器完成校验、解压、媒体落盘和 BoardDTO 恢复。
- **决策：** 测试直接调用 Web `buildPictureLibraryArchive` 生成 `uint8array`，再调用微信 `restoreArchiveData`；fixture 包含 PNG、MP3、MP4、板布局和稳定 Tile ID，并在恢复前使用空本机图库，避免“字节完全相同则复用本机资源”的既有优化掩盖落盘路径。
- **理由：** 手工拼 ZIP 或在微信实现中自导出、自恢复只能证明单实现往返，不能发现 JSZip 与 fflate 在压缩条目、manifest、媒体路径或字节读取上的兼容差异。直接连接两端真实 adapter 是最小且最可信的契约验证。
- **证据：** Web 归档 manifest 的 `sourcePlatform` 为 `cboard-web`；微信恢复结果包含原板名称、分类、布局及 `wxfile://restored/images|sounds|videos/boards/` 路径，暂存媒体字节与 Web 输入 PNG/MP3/MP4 完全一致。
- **生效范围：** 独立测试和 `PictureLibraryArchive v1` 的跨端证据；不改变 Web 或微信归档业务实现、媒体额度、冲突策略、UI、API、schema 或生产依赖。

## 变动 2：补齐微信到 Web 的真实读取证据

- **意图：** 证明微信生产 fflate 生成的 ZIP 能被 CBoard Web 的 JSZip reader 读取，而不是只依赖共享核心推断反向兼容。
- **决策：** 测试调用微信 `buildArchive` 生成实际 fflate ZIP，再交给 Web `readPictureLibraryArchive`；显式传入现有图库、偏好、缺词、排序和身份，避免测试触碰浏览器 localStorage。
- **理由：** 双向迁移是家庭在 Web、微信和未来其他 CBoard 平台之间转移私有图库的基础。只有两个方向都经过各自生产 adapter，才能把“格式相同”提升为“实现互操作”。
- **证据：** Web 恢复出微信板名称、分类及图片、声音、视频 data URI；解码后的 Base64 分别对应原始 PNG、MP3 和 MP4 字节。聚焦互操作与微信归档测试为 `2 files / 24 tests`，全量为 `84 files / 369 tests`，质量门 `10/10`、TypeScript、应用源码 ESLint、新增互操作测试 ESLint、`229 app / 32 CBoard core` 边界均通过。
- **生效范围：** Web/微信双向离线归档契约和自动回归；不等同于两台物理设备、系统文件选择、低存储、真实云备份或端侧加密密码迁移已经人工验收。

## 变动 3：保持应用源码边界与包体不变

- **意图：** 防止为了跨端测试把 CBoard React DOM/组件层或 JSZip 带入微信应用源码和生产包。
- **决策：** 互操作测试放在 `tests/interop`，Vitest 同时发现 `src/**/*.test.ts` 与 `tests/**/*.test.ts`；`src` 内的旧用例改名为“微信 ZIP 自往返”，继续只测试微信实现。跨平台边界脚本不增加例外，生产代码不导入 Web helper。
- **理由：** 跨仓库 adapter 集成属于测试基础设施，不属于小程序运行时。把它放在应用源码外可以获得真实互操作证据，同时维持“微信只复用纯核心、不搬 React DOM / Material UI”的硬边界。
- **证据：** 边界门通过 `229 app / 32 CBoard core`；生产构建成功，main `1,285,089 B`、caregiver `603,180 B`、backup `649,483 B`，全部包低于 1.5 MiB 建议线；798 张 CBoard 图片共 `986,160 B` 只在主包存放一次。两端实际版本为 `JSZip 3.10.1` 与 `fflate 0.8.3`；源码账本固定 fflate 提交 `dcb3714a6c25db3a2748641019c5277413d09714`，校验仍为 `0 errors / 83 existing warnings`。
- **生效范围：** 微信 Vitest 配置、独立互操作测试和证据文档；不新增依赖、插件、图片、音频或视频，不改变开发者工具、预览、上传、发布、部署、提交或推送状态。

## 记录

- **执行者：** Codex（GPT-5.6）
- **时间：** 2026-07-28 23:38:28
- **工具边界：** 全程使用后台 shell 与 apply_patch；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶微信开发者工具。
