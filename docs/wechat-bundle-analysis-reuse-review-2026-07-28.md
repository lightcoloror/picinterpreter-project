# 图语家微信小程序包体分析复用审阅（2026-07-28）

## 变动一：固定并运行上游分析器源码

- **意图：** 在继续优化微信小程序前，先找到、拉取并运行成熟的 Webpack 包体分析实现，避免只凭单个构建告警自行拆包或从零编写依赖分析器。
- **决策：** 选择 MIT 许可的 `webpack-bundle-analyzer 5.3.1`，固定本地源码提交 `97d2ef8706556f871309e63d5d13cefe4ca91d40`；只复用其 Webpack 插件、stats 生成和 JSON 报告能力，不启动分析服务器、不打开浏览器，也不复制其前端可视化代码。
- **理由：** 图语家微信端使用 Taro 4.2.0 与 Webpack 5.91.0，Taro 生产配置模板也直接把该项目列为体积分析方案；使用上游插件比自制模块图更可靠，`disabled + generateStatsFile` 又能满足后台开发和不置顶窗口的约束。
- **证据：** 源码位于 `D:\used-by-codex\source-reviews\picinterpreter-weapp-performance-20260728\webpack-bundle-analyzer`；按锁文件 `npm ci` 成功并跳过 Puppeteer 浏览器下载，纯核心 `4 suites / 63 tests` 全通过，上游 production build 成功。完整测试为 `84 passed / 45 failed / 4 skipped`：失败项均要求未下载的 Chrome、受限环境子进程或 Linux LF fixture；不把该结果写成全量通过。随后同一插件在图语家真实 Taro production 构建中成功生成模块级 stats 和 JSON 报告。
- **生效范围：** 微信小程序开发期包体诊断和源码账本；不进入微信运行时包，不启动 HTTP 服务，不替代微信开发者工具官方性能扫描，也不改变 CBoard、cboard-api 或患者功能。

## 变动二：接入显式、无界面的分析命令

- **意图：** 让包体分析成为可重复的工程命令，而不是一次性的人工排查，同时保证默认开发和正式构建不承担分析开销。
- **决策：** 在 `cboard-wechat-poc` 增加开发依赖 `webpack-bundle-analyzer@5.3.1`；仅当 `WEAPP_BUNDLE_ANALYZE=1` 时向 `mini.webpackChain` 注入插件，使用 `analyzerMode: disabled`、`openAnalyzer: false`，把 stats 和 JSON 报告写入被忽略的 `.bundle-analysis/`。新增 `npm run analyze:weapp`，顺序复用现有板库校验、production build、postbuild 质量门和上游 CLI JSON 报告。
- **理由：** 环境开关能保持普通 `build:weapp` 的行为不变；离线 JSON 既可机器读取，又不会自动打开页面、抢焦或置顶微信开发者工具。依赖放在 `devDependencies`，不会成为小程序运行时依赖。
- **证据：** `npm run analyze:weapp` 已从头执行成功，自动生成约 `26,881,523 B` 的 stats 和约 `92,660 B` 的 JSON 报告；`77 test files / 344 tests`、质量门 `10/10`、TypeScript、ESLint、`214 app / 32 CBoard core` 边界全部通过。production 输出继续为 main `1,282,746 B`、caregiver `600,813 B`、emergency `97,054 B`、management `550,039 B`、backup `616,887 B`、AAC import `650,496 B`、OCR `66,752 B`，所有单包低于 `1.5 MiB` 建议线。
- **生效范围：** `cboard-wechat-poc` 的 `package.json`、`yarn.lock`、Taro Webpack 配置和 `.gitignore`；不改业务源码、页面、分词、匹配、图卡、语音、账号或 API，不生成 `package-lock.json`，分析产物不提交。

## 变动三：用模块证据保留成熟 AAC 导入链

- **意图：** 判断 Webpack 对 AAC 导入页 `295 KiB` 的提示是否代表真实重复或可安全删除的代码，避免为追求一个通用 Web 告警而破坏 AAC 格式兼容。
- **决策：** 当前不拆分、不替换 Open Board、Gridset、AsTeRICS Grid、JSZip 或 `fast-xml-parser`；继续把 AAC 导入保留在独立低频分包。只有后续分析发现明确重复、微信官方扫描越线或真机内存问题，才启动针对性优化。
- **理由：** 报告显示 AAC 页解析后 `302,330 B`，主要来源为 JSZip `96,952 B`、Gridset 处理器 `67,351 B`、AsTeRICS Grid 处理器 `20,913 B` 和 Gridset commands `20,123 B`，均对应已经支持的真实格式能力；跨所有输出资源未发现相同模块重复打包。盲目深导入第三方内部文件或自研解析器会牺牲升级稳定性和格式兼容，却没有可证明的包体收益。
- **证据：** 上游 JSON 报告按 asset、group 和 leaf module 给出 stat/parsed/gzip 三种体积；AAC 独立分包总计 `650,496 B`，距 `1.5 MiB` 建议线尚余 `922,368 B`。构建中的 `295 KiB` 是 Webpack 通用的 `244 KiB` Web 资源建议，不等同于微信单包 `2 MiB` 限制或 `1.5 MiB` 建议线。
- **生效范围：** 微信 AAC 导入与后续性能优化优先级；不代表官方插件实际下载体积、官方性能评分、物理真机低内存或超大 AAC 文件已经验收。

## 变动四：更新官方 Skill，但保留官方扫描缺口

- **意图：** 确保后续微信开发者工具操作使用当前内置 Skill，同时核对它是否已经提供性能扫描接口。
- **决策：** 把 Codex 已加载的微信开发者工具 Skill 从 `0.3.4` 同步为工具内置 `0.3.5`，逐文件校验 `23/23` 哈希一致；继续只使用后台 CLI/Skill，不使用 Computer Use，不打开、聚焦、抬升或置顶窗口。由于 `0.3.5` 仍未暴露性能扫描/依赖分析命令，不用自研报告冒充官方扫描。
- **理由：** 版本一致可以减少 CLI 与工具能力漂移；但“本地质量门通过”和“官方性能扫描通过”是两种证据，必须保留边界。
- **证据：** `wechatide check_wechatide_status --skill-version 0.3.5` 返回 `versionRelation: equal`、登录有效、无需 CLI token；内置 Skill 文件清单未发现性能扫描工具。本轮分析、构建和测试全过程未调用 Computer Use，也未打开任何 GUI。
- **生效范围：** 后续微信开发者工具后台自动化与证据表述；上传前仍需在微信开发者工具官方“性能/代码质量”面板核验插件下载体积、主包依赖归属和官方评分。

## 记录

- **执行工具/模型：** Codex（GPT-5.6）。
- **记录时间：** 2026-07-28 12:16:07。

