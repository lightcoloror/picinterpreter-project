# 图语家短视频动作图卡的 Taro 源码复用与双端适配记录

- 记录时间：2026-07-28 14:38:43
- 执行工具 / 模型：Codex（GPT-5）
- 关联 issue：[#71 支持 GIF/短视频动作图符](https://github.com/picinterpreter/picinterpreter/issues/71)
- 结论状态：工程实现与生产构建已通过，浏览器和微信物理真机仍待验收

## 变动 1：固定并运行 Taro 4.2.0 视频能力源码

- **意图：** 在给图语家新增短视频图卡前，先确认当前微信技术栈已经提供可复用的原生视频、媒体选择、压缩和本机文件能力，避免重新实现播放器或引入大体积视频依赖。
- **决策：** 固定审阅 `NervJS/taro` 标签 `v4.2.0`，标签对象 `170c050e...`，实际提交 `f0e5c39d5f04290db975670411e23c3a396e15f8`；使用仓库 CI 声明的 pnpm 10 按锁文件安装，构建 `@tarojs/taro-h5`、`shared`、`api`、`runtime`、`router`、`components`，并运行上游 Video 组件测试。业务侧只复用 Taro `<Video>`、`chooseMedia`、`compressVideo`、`saveFile` 和 `removeSavedFile` 契约。
- **理由：** Taro 已把微信原生视频组件和文件 API 封装为 React 18 可用能力，直接复用比引入 React DOM 播放器、FFmpeg 运行时或自行维护原生组件桥接更小、更稳定，也符合小程序包体要求。
- **证据：** 源码检出目录 `D:\used-by-codex\source-reviews\picinterpreter-video-pictogram-20260728\taro`；六个上游包构建成功；`video.spec.tsx` 为 `1 suite / 8 tests / 8 snapshots` 全通过；类型中确认 `src`、`poster`、`controls`、`autoplay`、`loop`、`muted`、`objectFit`，API 类型确认选择结果包含 `tempFilePath`、`thumbTempFilePath`、`size`、`duration` 与 `fileType`。
- **生效范围：** 只确定图语家微信端视频适配的上游依据；不复制 Taro UI、不引入新播放器依赖、不把研究仓库加入业务提交，也不声称真机播放已通过。

## 变动 2：固化共享媒体契约并保持旧数据兼容

- **意图：** 让同一个动作图卡在 CBoard Web、表达输出、接收端、微信和 ZIP 备份中保持封面与视频语义，不再依赖平台私有临时字段。
- **决策：** 在 `TileDTO v1` 和输出项中增加可选 `mediaType: image | gif | video` 与 `video`；旧的仅 `image` 快照继续合法。图库 ZIP v1 不升级版本，只增加可选 `videos/` 根目录、`videoAssetCount` 和图卡视频引用；旧 ZIP 继续按原格式恢复。
- **理由：** 新字段是向后兼容扩展，既能明确视频来源，又不会破坏已有板、图片、GIF、声音、历史或旧备份。保留独立封面可让候选列表只加载图片，避免批量解码视频。
- **证据：** CBoard DTO、匹配、接收管线、归档/恢复测试覆盖媒体字段；Web ZIP 与微信 ZIP 都完成封面、声音、视频三类资产往返；CBoard 短视频聚焦 `7 suites / 51 tests / 2 snapshots` 和双向沟通 `94 suites / 737 tests / 1 snapshot` 通过。
- **生效范围：** 共享纯核心、CBoard Web ZIP、微信备份分包和输出项；不改变分词、匹配权重、历史语义、账号协议或现有图片字段。

## 变动 3：微信家属图库维护接入短视频

- **意图：** 让家属在“照护设置 → 图片库维护”创建最长 10 秒的动作图卡，并让患者表达、表达序列和接收全屏真正播放，而不是把入口放到患者表达设置中。
- **决策：** 新增平台无关 `personalVideoPort` 与 Taro adapter；使用 `chooseMedia` 选择视频和缩略图，必要时调用 `compressVideo`，最终视频限制 10 秒、8 MiB。视频与封面分别持久化；封面保存失败时回滚视频。编辑器用草稿注册表管理取消、覆盖、复制、删除和共享引用。患者板、表达覆盖层和接收全屏静音循环播放；列表、候选和管理页只显示封面。
- **理由：** 低频维护功能留在 backup 分包，不扩大患者首屏；短时、静音循环更接近动作图符，封面模式又能防止大量视频同时解码。独立端口使纯核心可测试，并保留以后替换存储方式的能力。
- **证据：** 微信全量 `79 files / 352 tests`、产物质量门 `10/10`、TypeScript、ESLint、`219 app files / 32 CBoard core files` 边界、`46 boards / 871 tiles / 798 images` 一致性和 Taro production build 全通过。未压缩主包 `1,285,089 B`，距 `1.5 MiB` 建议线 `287,775 B`；backup 分包 `625,801 B`。视频文件不进入代码包。
- **生效范围：** 微信 backup 分包的家属图片库维护、患者表达图卡、表达序列、接收端显示和本机 ZIP；不新增登录、云同步、AI 视频识别、视频编辑、支付或患者端维护入口。

## 变动 4：CBoard Web 与 API 复用现有媒体入口

- **意图：** 让同一视频图卡可在 CBoard Web 编辑、板面、输出栏和接收全屏使用，同时避免把 8 MiB Base64 写进浏览器板数据。
- **决策：** `Symbol` 按场景渲染原生 `<video>`：患者板、输出栏和接收全屏播放，管理列表只显示封面。`TileEditor` 新增 MP4/WebM 选择，限制 10 秒和 8 MiB；仅登录用户可持久化，保存时复用 `API.uploadFile`，失败时禁止保存临时 `blob:` URL。`cboard-api /media` 保留通用接口，增加图片、GIF、录音、MP4/WebM 白名单与 8 MiB 上限。
- **理由：** CBoard 已有认证媒体上传与 Blob URL 返回，不需要新增专用 API；禁止本地 Base64 视频可保护浏览器存储。后端白名单同时修补了原通用上传可接受任意文件的旧风险。
- **证据：** Web 编辑器测试验证限制和 CDN URL 持久化；API 纯校验 `2/2` 通过，请求级环境验证无令牌 `403`、未知类型 `400`，图片和视频均通过新校验后才因本机未配置 Azure Blob 返回同一个旧环境 `500`。CBoard production build 成功；`CI=true` 只因既有 AAC vendor lint 警告失败，取消“警告即错误”后编译完成。
- **生效范围：** CBoard Web/Electron 的图卡编辑与显示、通用媒体上传安全边界；Cordova 是否能从原生文件选择器选择视频、生产 Blob 配置和真实上传仍待独立验收。

## 外部验收门

- 浏览器使用真实登录账号上传许可明确的小体积 MP4/WebM，刷新后验证封面、板面、输出栏、接收全屏和 ZIP 往返。
- 微信物理真机验证选择、压缩、静音循环、删除、复制、备份恢复、低端机内存与无声/有声视频体验。
- 微信开发者工具运行官方性能扫描，核验 WechatSI 插件下载体积和组件/文件依赖报告；当前 Skill 未暴露该面板。
- 为动作视频建立许可、患者可理解性和不诱发不适的内容审查，不把技术播放成功等同于沟通效果通过。

## 边界确认

- 本轮未使用 Computer Use。
- 本轮未打开、激活、聚焦、抬升或置顶微信开发者工具窗口。
- 本轮未预览、上传、发布、部署、提交或推送。
- 源码账本只读 Bridge 当前不可用，已保留精确仓库、标签、提交、检出目录和运行证据，待 Bridge 恢复后登记。
