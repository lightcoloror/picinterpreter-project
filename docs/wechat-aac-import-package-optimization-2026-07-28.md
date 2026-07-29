# 微信 AAC 导入包体优化与 ZIP 平台端口决策

## 结论

本轮没有删除 Gridset 功能，也没有为微信复制一套解析器。CBoard 共享核心只定义受限、只读的 ZIP 平台端口；CBoard Web 继续用 JSZip，微信小程序改用已经在备份模块中运行的 fflate，并开启 Taro 官方 `optimizeMainPackage`。最终微信主包恢复到 `1,285,089 B`，AAC 导入分包从 `652,021 B` 降到 `554,555 B`，减少 `97,466 B`；原约 `302,330 B` 的 AAC 页面 JS 降到 `205,247 B`。Bundle Analyzer 中不再出现 `jszip` 或根目录 `9778.js`。

## 变动：Gridset ZIP 解包改为显式平台端口

- **意图：** 保留 CBoard 成熟 Gridset 解析能力，同时避免共享纯核心把 Web 专用 JSZip 强制带进微信主包。
- **决策：** `convertGridsetToOpenBoardDocuments` 必须接收 `zipAdapter`；共享核心统一负责路径安全、条目数、单条目大小、总解压大小、重复路径和只读限制。CBoard Web 提供 `createJsZipArchiveAdapter`，微信提供 `createFflateGridsetZipAdapter`。AACTools vendored 的源码版与兼容版 resolver 都只引用纯 `symbolReference`，不再为了两个字符串解析函数加载完整符号库和 ZIP 实现。
- **理由：** ZIP 解包属于平台能力，不属于“Gridset 转 Open Board”业务语义。显式注入让 Web、微信和未来 Cordova 可以各用合适实现，且安全限制只有一份；比删除 Gridset、复制解析器或在 Taro 中依赖不可靠的动态 `import()` 更可维护。
- **证据：** CBoard Gridset/Asterics/Web 导入聚焦回归 `3 suites / 19 tests` 两轮通过；微信 ZIP/Gridset/AAC 归属聚焦回归 `3 files / 9 tests` 两轮通过。CBoard 全量 `205 suites / 1435 tests / 72 snapshots` 通过；微信全量 `83 files / 365 tests`、产物质量门 `10/10`、TypeScript、ESLint 和 `229 app / 32 CBoard core` 边界检查通过。
- **生效范围：** CBoard Web 的 Gridset 导入、微信 AAC 导入分包、共享 Gridset 转换核心和 vendored AACTools 依赖边界；不改变 OBF/OBZ/GRD/Snap/TouchChat 业务语义，不改变患者表达、接收端、matcher、分词、TTS、账号、API 或图板内容。

## 变动：微信复用 fflate 并启用官方分包依赖提取

- **意图：** 消除微信 AAC 页面约 `295 KiB` 的构建提示和被提升到主包的 JSZip 大块依赖，为后续 AAC 格式扩展保留包体余量。
- **决策：** 微信 Gridset adapter 复用 `src/packages/backup/zipArchive.ts` 已有的 fflate ZIP 扫描与读取能力，限制 `5000` 条目、单条目 `20 MiB`、总解压 `64 MiB`；开启 Taro 官方 `mini.optimizeMainPackage.enable`，把仅供分包使用的共享模块放入对应 `sub-common`，而不是提升到主包。
- **理由：** fflate 是小型纯 TypeScript/JavaScript ZIP 实现，适合微信运行时；项目已有 fflate 备份读写和回归，不需要引入第二套 ZIP 栈。Taro 官方说明 `optimizeMainPackage` 会把分包共享模块复制到对应分包的 `sub-common`，以主包体积为优先，符合微信“主包不放仅供分包依赖 JS”的性能建议。
- **证据：** 基线为 main `1,285,089 B`、AAC `652,021 B`；中间实验曾因兼容 resolver 间接引用 `symbols -> utils/zip -> jszip` 产生根目录 `9778.js=97,081 B`，main 上升为 `1,384,051 B`。切断该静态链后最终 main `1,285,089 B`、AAC `554,555 B`，分别有 `287,775 B` 和 `1,018,309 B` 的 1.5 MiB 余量；Analyzer 标志为 `jszip=false`、`9778=false`、`fflate=true`，production build 成功。
- **生效范围：** 微信生产构建、AAC 导入分包和分包依赖归属；总包可能因为跨分包复制共享模块略有增加，但主包和每个分包均低于 1.5 MiB。插件下载体积仍必须由微信开发者工具官方性能扫描确认。本轮未打开、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。

## 开源来源审查

- fflate 官方仓库：<https://github.com/101arrowz/fflate>，本地固定提交 `dcb3714a6c25db3a2748641019c5277413d09714`，版本 `0.8.3`，MIT。
- 本地路径：`D:\used-by-codex\source-reviews\picinterpreter-wechat-aac-size-20260728\fflate-source`。
- `npm ci` 通过；官方 TypeScript 源码和 ESM 配置均能 `tsc --noEmit`。
- 官方 `npm test` 在 Windows 上因 POSIX 环境变量语法而未启动；直接运行 uvu 又因测试下载大型外部样本超时，且仓库 ZIP 测试文件仍标注 `TODO`。因此不声称 fflate 官方全套测试通过，ZIP 集成证据来自本项目上述真实 ZIP/Gridset 回归和生产构建。
- Taro 官方依据：<https://docs.taro.zone/docs/3.x/mini-split-chunks-plugin>。
- 微信性能依据：<https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009>。

## 未采用方案

- 没有只把 Gridset 核心改成动态 `import()`：Taro 构建未生成预期异步分块，提示未消失且页面略增，实验已完整撤回。
- 没有删除 JSZip 依赖：微信测试和后台 Skill smoke 仍用它验证 ZIP 互操作；CBoard Web adapter 也继续复用成熟 JSZip。
- 没有自研 ZIP 解压算法：复用已审查 fflate 和现有项目 ZIP 安全扫描，新增代码仅是平台 adapter 与依赖解耦。

## 记录

- Codex（GPT-5.6），2026-07-28 22:01:33。
