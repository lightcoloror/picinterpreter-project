# GIF 动态图卡开源复用与双端适配审阅

- 记录时间：`2026-07-28 13:10:14`
- 执行工具 / 模型：`Codex（GPT-5.6）`
- 对应需求：PicInterpreter issue #71
- 审阅源码：`https://github.com/ericnograles/browser-image-resizer.git`
- 固定提交：`c6b2c2320d97fa81df92102061a7f846c9c7c695`
- 本地审阅目录：`D:\used-by-codex\source-reviews\picinterpreter-animated-gif-20260728\browser-image-resizer`

## 意图

在不复制媒体体系、不增加小程序包依赖的前提下，补齐 CBoard Web 与微信小程序家属图片库对 GIF 动态图卡的安全上传能力，同时保留现有成熟静态图片压缩链。

## 决策

1. CBoard 保留既有 `browser-image-resizer 2.4.1`，只让 GIF 绕过 Canvas 压缩，原文件继续进入既有上传和 `image` 字段。
2. CBoard 的裁剪、AI 元数据识别与去背景不处理 GIF，并向家属说明原因，避免动画静默变成单帧。
3. 微信继续复用官方 Taro 图片 API：选择原图、用 `getImageInfo` 判断 GIF，GIF 保留原路径，静态图片才用 `compressImage`。
4. 不新增视频字段、播放器、运行时下载代码或动画图库；短视频继续等待资源许可、大小、交互和患者理解证据。

## 理由

`browser-image-resizer` 的实现通过 Canvas `drawImage` 和 `toDataURL` 生成静态输出，适合 JPEG/PNG，却会破坏 GIF 帧序列。现有 CBoard/微信 DTO、图片组件、备份和导入链已经把 GIF 当作图片处理，因此只需修正上传入口，不需要重写渲染器或数据模型。继续复用成熟静态路径并对动态图片做最薄分流，风险和维护成本最低。

## 证据

- 上游许可证为 MIT；项目原本已经依赖 `browser-image-resizer 2.4.1`，本轮没有新增生产依赖。
- 固定源码完成 `npm ci`；上游未提供自动化测试，production webpack build 成功，bundle 约 `3.49 KiB`。
- CBoard GIF 定向测试为 `2 suites / 17 tests / 3 snapshots`；最终全仓为 `204 suites / 1421 tests / 72 snapshots`；production build 退出码 `0`。
- 微信最终为 `77 test files / 347 tests`、产物质量门 `10/10`；TypeScript、ESLint、边界检查、图板生成一致性与 production build 全部通过。
- 微信生成内容为 `46 boards / 871 tiles / 798 images`；未压缩主包 `1,282,746 B`，距离内部 `1.5 MiB` 建议线约 `290 KiB`。
- CBoard build 仍保留 vendored AACProcessors 既有 lint/动态依赖警告和主 bundle 偏大警告；微信仍保留 AAC import 单 JS `295 KiB` 和插件下载体积需官方性能扫描的提示。

## 生效范围

本轮只影响 CBoard 家属图卡上传、微信“照护设置 → 图片库维护”的个人图片选择、既有图片保存和图库备份恢复。不改变患者表达页、分词、matcher、语音、历史、账号、API、媒体 schema 或短视频能力。浏览器与物理真机真实动画、低端设备内存、素材许可和患者可理解性仍需外部验收。

本轮未使用 Computer Use，未打开、激活、聚焦、抬升或置顶微信开发者工具窗口，未预览、上传、发布、部署、提交或推送。
