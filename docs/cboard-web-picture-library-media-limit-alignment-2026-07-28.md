# CBoard Web 图库媒体恢复额度对齐

## 结论

CBoard Web 与微信小程序共用 `PictureLibraryArchive v1`，但此前只有微信端限制单个媒体和声音、视频总量。Web 会通过 JSZip 将归档条目完整解压并转换为 Base64 data URI，因此缺少额度门会让异常 ZIP 或过大的家庭媒体在浏览器中占用不可控内存。本轮不改变归档格式、UI 或依赖，只把微信已经验证的媒体额度复用于 Web 导出和恢复。

## 变动 1：Web 导出执行媒体额度与真实字节校验

- **意图：** 阻止 Web 生成微信无法安全恢复、浏览器自身也可能难以处理的超大图库备份。
- **决策：** 图片单文件上限保持 `2 MiB`，录音单文件/合计保持 `5/20 MiB`，视频单文件/合计保持 `8/40 MiB`；读取适配器声明的 `size` 必须与实际 `ArrayBuffer`、`Uint8Array` 或 `Blob` 字节数一致。
- **理由：** 这些阈值已经在微信文件端口、个人录音和短视频能力中运行并通过真实 ZIP 回归。复用同一数值比为 Web 发明第二套格式或另加媒体库更容易解释和维护。
- **证据：** 五段各 `4 MiB + 1 B` 的录音在导出阶段超过 20 MiB 后被拒绝；原有图片、录音、短视频和完整本机 sidecar 往返继续通过。
- **生效范围：** CBoard Web 的普通图库 ZIP、完整本机 ZIP、私人图片快照和完整私有数据快照的生成；不改变微信实现、manifest v1、账号 API、患者表达、matcher、分词或语音。

## 变动 2：Web 恢复按真实解压字节执行同一额度门

- **意图：** 防止归档 manifest 伪报大小、录音合计绕过限制，或视频错误占用声音额度。
- **决策：** JSZip 条目先解压为 `Uint8Array`，检查非空、manifest 声明大小与真实字节一致，再按 `images/`、`sounds/`、`videos/` 分别执行单文件限制；声音与视频使用独立累计器，校验通过后才转换为 Base64 data URI 并进入既有事务合并。
- **理由：** JSZip 官方说明 `async()` 会在内存中保留完整结果，JavaScript 字符串还会增加内存开销；恢复前的有界校验是继续复用 JSZip 时最小、可审计的安全补丁。官方依据：[JSZip limitations](https://stuk.github.io/jszip/documentation/limitations.html)、[ZipObject.async](https://stuk.github.io/jszip/documentation/api_zipobject/async.html)。
- **证据：** 真实压缩 ZIP 中五段各 `4 MiB + 1 B` 的录音在合计超过 20 MiB 时被拒绝；三段各 7 MiB 的视频合计 21 MiB 时成功恢复，证明视频未被计入声音额度。聚焦回归 `2 suites / 17 tests`，整站 `205 suites / 1438 tests / 72 snapshots` 全通过，production build 和约 `41.8 MB / 1010 resources` 的 Service Worker 预缓存生成成功，目标文件 Prettier 检查通过。
- **生效范围：** CBoard Web 本地选择 ZIP 后的媒体读取与恢复；不新增压缩算法、网络请求、schema、依赖或后台服务，也不把自动化结果冒充低内存真机、浏览器原生文件选择和超大真实图库人工验收。

## 工具与记录

- **执行工具/模型：** Codex（GPT-5.6）。
- **记录时间：** 2026-07-28 23:00:22。
- **操作边界：** 未使用 Computer Use，未打开、聚焦、抬升或置顶微信开发者工具；未预览、上传、发布、部署、提交或推送。
