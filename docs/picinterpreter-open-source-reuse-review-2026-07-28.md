# 图语家开源源码复用审阅记录（2026-07-28）

## 审阅原则

- **意图：** 在继续补齐图语家双端功能前，先用本地源码、固定提交、真实安装、测试和构建判断哪些成熟模块值得复用，避免只看仓库介绍或重复自研。
- **决策：** 本轮审阅固定 CBoard、AsTeRICS Grid、OpenAAC、PaddleOCR 和 PaddleOCR-json 五个本地源码快照；能够运行的候选必须运行，缺少运行时的候选只记录静态证据，不把“读过代码”写成“运行通过”。
- **理由：** 完整项目通常同时携带自己的 UI、数据层、依赖和部署假设；图语家需要复用的是经过验证的纯核心、provider 契约和格式设计，而不是把另一套应用整体搬进 CBoard 或微信小程序。
- **证据：** 五个仓库均已在本地 Git 工作树中核对远端、固定提交和干净状态；AsTeRICS Grid 完成依赖安装、`6 suites / 53 tests` 和 production build，微信 OCR 适配完成全量测试、production build 与官方 Skill E2E。
- **生效范围：** 图语家 CBoard Web、cboard-api、微信小程序后续选型、源码账本和架构决策；不代表候选项目已经获得图语家维护承诺，也不替代许可证、生产部署、真机和患者可用性验收。
- **记录：** Codex（GPT-5.6），2026-07-28 11:41:50。

## CBoard

- **源码：** `D:\used-by-codex\picinterpreter\tmp\matching-research\cboard`
- **远端：** `https://github.com/cboard-org/cboard.git`
- **固定提交：** `e68e47307a29630468257ed94a39a5c0f825eee5`
- **意图：** 核对 CBoard 原生图卡、板、路由和跨平台边界，确认图语家继续以 CBoard fork 为成熟底座，而不是复制第二套 AAC 应用。
- **决策：** 继续完整复用 CBoard 的板、图卡、编辑器、打印、Electron/Cordova/Web 基础设施；图语家核心仅进入中性的 `communicationSupport` 纯核心和薄平台适配层。
- **理由：** CBoard 已提供成熟的 AAC 数据模型、编辑与跨平台能力；把这些能力重新实现在微信或图语家品牌目录会增加分叉和维护成本。
- **证据：** 本地固定源码已逐文件审阅；当前产品 fork 的 Communication Support 最近一轮为 `94 suites / 732 tests / 1 snapshot` 和 production build 通过，微信构建直接编译同一共享核心。
- **生效范围：** CBoard Web/Electron/Cordova 及微信复用的纯核心；不把 React DOM、Material UI、PDF 引擎或浏览器路由搬入微信小程序。

## AsTeRICS Grid

- **源码：** `D:\used-by-codex\picinterpreter\tmp\matching-research\AsTeRICS-Grid`
- **远端：** `https://github.com/asterics/AsTeRICS-Grid.git`
- **固定提交：** `ba8afe0f7051d444a4c2b95ba5e0143ff90fa09b`
- **意图：** 学习成熟 AAC 项目如何把 OpenSymbols、ARASAAC 等公共图源从 UI 分离，并判断其搜索实现能否直接进入图语家。
- **决策：** 复用 provider 分层、分批查询、语言回退和结果标准化的架构思想；不复制 AsTeRICS Grid 的整套 UI、数据库、WASM、Webpack bundle 或浏览器运行时。
- **理由：** 图语家当前 cboard-api 已实现 ARASAAC、OpenSymbols、Global Symbols 的鉴权、缓存、并发合并、可信 URL、来源许可和排序；直接复制 AsTeRICS 代码会形成第二套 provider，且完整产物明显超过微信小程序适配边界。
- **证据：** 重点审阅 `src/js/service/pictograms/openSymbolsService.js` 与 `src/js/service/pictograms/arasaacService.js`；固定源码完成 Yarn 安装，Jest `6 suites / 53 tests` 全通过，production build 通过。构建同时报告主 bundle 约 `1.28 MiB`、WASM 约 `5.07 MiB` 及多个大 chunk，证明只应复用纯 provider 思路。构建生成文件已经精确恢复，候选仓库重新为干净状态。
- **生效范围：** 图源搜索的架构依据、cboard-api provider 复核和未来排序改进；不增加微信主包体积，不引入 AsTeRICS UI/WASM，不替换当前 CBoard matcher。

## OpenAAC

- **源码：** `D:\used-by-codex\picinterpreter\tmp\matching-research\OpenAAC`
- **远端：** `https://github.com/RonanOD/OpenAAC.git`
- **固定提交：** `eac89f47738eee164bde93d49f71ad97cf5365d0`
- **意图：** 核对开放 AAC 日志、匿名研究数据和跨端数据边界，避免自创不可互操作的数据格式。
- **决策：** 继续复用已经吸收进共享核心的 OpenAAC 日志契约和匿名化边界；OpenAAC 应用本身仅作为格式与 Supabase 架构参考，不整体接入。
- **理由：** 当前 CBoard 与微信已共享 `.obl`/`.obla` 构建、严格匿名化和禁止恢复逻辑；复制 Flutter UI 或 Supabase 应用不会补足当前核心缺口，反而新增一套客户端和后端。
- **证据：** 固定源码、Flutter/Dart 项目结构、TypeScript/Supabase 边界和日志相关实现已完成静态审阅；本机没有可用 Flutter SDK，因此本轮未运行 OpenAAC 测试或构建，不把静态审阅表述为运行通过。
- **生效范围：** 沟通日志、匿名研究副本和未来互操作研究；不改变当前账号、Mongo、Settings、私有备份或微信 UI。

## PaddleOCR

- **源码：** `D:\used-by-codex\open-source-audit-sources\paddleocr`
- **远端：** `https://github.com/PaddlePaddle/PaddleOCR.git`
- **固定提交：** `c166448875bcecb8d3b7628fd697ac1c28f8705b`
- **意图：** 判断是否应把成熟中文 OCR 直接嵌入图语家小程序或 cboard-api，以补齐图片文字识别。
- **决策：** 暂不引入 PaddleOCR 运行时；保留为未来可选服务端 OCR provider 参考，当前继续复用 cboard-api 的受控 OCR 边界和微信薄上传适配。
- **理由：** 当前源码要求 `paddlex[ocr-core]>=3.7,<3.8` 及模型运行时，不能进入微信小程序包；为单一功能引入完整 Python 推理栈会显著扩大部署和资源维护范围。
- **证据：** 本机 Python `3.13.5`、pytest `9.0.3`；导入 API client 实际失败于缺少 `paddlex`，两个最小 pytest 尝试均在 60 秒工具时限内未完成。没有下载模型或安装重型推理依赖，因此没有伪造运行成功结论。
- **生效范围：** OCR provider 选型；不修改当前 production OCR 协议，不新增 Python 服务、模型下载、GPU/CPU 资源承诺或微信包依赖。

## PaddleOCR-json

- **源码：** `D:\used-by-codex\open-source-audit-sources\paddleocr-json`
- **远端：** `https://github.com/hiroi-sora/PaddleOCR-json.git`
- **固定提交：** `1beac1c0f3ec2c6d503aee1424efe336e03dffd6`
- **意图：** 评估比完整 PaddleOCR 更轻的本地进程封装，确认是否能直接作为 cboard-api OCR 模块。
- **决策：** 仅保留为未来桌面/服务端进程适配参考，当前不接入。
- **理由：** 该项目仍依赖原生可执行文件、Paddle inference、模型、AVX 和子进程或 TCP 生命周期；它没有消除部署复杂度，也不能嵌入微信小程序。
- **证据：** 固定源码、C++/模型目录、命令行/TCP 模式及 Node/Python adapter 已静态审阅；本轮未配置其原生可执行文件和模型，因此不声称运行通过。
- **生效范围：** 未来离线桌面 OCR 或自托管 provider 的备选清单；不进入当前微信包、cboard-api production 容器或 CBoard Web 依赖。

## 本轮最小适配：微信图片文字识别运行门

- **意图：** 在不引入新的 OCR 引擎、不复制识别逻辑的前提下，证明现有“图片 → 服务端 OCR → 可编辑文字 → 人工确认 → 显式分词找图”契约在微信官方运行时成立。
- **决策：** 生产代码继续复用现有 `imageTextRecognitionPort`、Taro `uploadFile`、一次性 intent 和接收端工作区；仅扩展既有官方 Skill E2E 与本地受控 API。测试端点只返回文字，不保存图片，也不写图片内容日志。
- **理由：** OCR 最重要的安全边界不是“识别后自动生成”，而是原图不持久化、识别文字可人工修改、修正前不触发匹配/历史副作用。把该契约放进正式页面运行门，比接入第二套 OCR 或编写测试专用页面更能证明产品行为。
- **证据：** 微信全量 `77 files / 344 tests`、质量门 `10/10`、TypeScript、ESLint、`214 app / 32 core` 边界和 production build 通过；官方微信开发者工具 background-only OCR E2E PASS，真实调用 `wx.getFileInfo` 与 `wx.uploadFile`，验证鉴权 multipart、有字节图片、可编辑一次性文字 `我想吃苹里`、修正为 `我想吃苹果` 前零候选/零历史，以及显式生成后才建立草稿。原 18 项 storage 全部恢复，临时 API 关闭，默认 AppID 配置和 production build 恢复。
- **生效范围：** `cboard-wechat-poc` OCR E2E、受控假 API 与 npm 验证入口；不修改 production OCR 业务语义，不选择具体 OCR 供应商，不上传、预览、发布或部署。

## 后续边界

- **意图：** 把剩余工作限定在真实缺口，避免继续横向堆叠候选框架和重复模块。
- **决策：** 下一阶段优先完成真实 HTTPS cboard-api、OCR/AI/公共图源凭据、合法域名和物理真机验收；只有现有 provider 无法满足中文准确率、隐私或成本要求时，才重新启动 PaddleOCR/PaddleOCR-json 小规模服务端试验。
- **理由：** 当前代码缺口主要是部署和外部环境证据，不是再缺一套 UI、matcher、日志格式或 OCR 客户端。
- **证据：** 当前微信全部单包低于 `1.5 MiB`，OCR 分包约 `66,752 B`；官方插件实际下载体积、性能扫描、真实网络和物理设备仍未由本轮替代。
- **生效范围：** 后续开发优先级与防重复实现边界；不关闭既有远期 issue，也不把模拟器结果写成物理真机或生产服务已完成。
