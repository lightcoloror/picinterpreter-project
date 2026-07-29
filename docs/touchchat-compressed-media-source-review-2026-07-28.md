# TouchChat 压缩图片与声音开源复用审查

## 结论

当前 CBoard API 已能导入 TouchChat `.ce` 的文字、板面、导航，以及 `Images.c4s` 中直接保存为 PNG/JPEG 的自定义图片。经过源码账本预检、三套公开实现本地拉取、依赖安装、定向测试、真实公开样本检查和 GitHub 代码检索，尚未找到可直接复用且通过真实 schema 验证的 TouchChat 压缩/专有图片解码器，也未找到能从真实 `.ce` 文件恢复按钮录音的成熟公开实现。

因此本轮不新增猜测性解码代码，不把测试对象上存在 `audioRecording` 字段误称为实际文件导入能力，也不放宽现有安全边界。后续只有在获得合法样本、公开格式说明或可运行上游实现后，才继续补齐这两类媒体。

## 变动 1：固定并运行 Node AACTools 当前实现

- **意图：** 验证最新版 AACTools 是否已经补齐现有 `@willwade/aac-processors@0.2.20` 缺少的 TouchChat 图片或声音读取能力，避免重复开发。
- **决策：** 固定 `AACTools/AACProcessors-nodejs` 提交 `221c8c924c8348b3d373f12d86952b01f2b8ddb7`，完成依赖安装、构建和 TouchChat 定向测试；不把该仓库的新版本整体替换进 cboard-api。
- **理由：** 上游当前 `helpers.ts` 仍明确写明 TouchChat 不填充 `resolvedImageEntry`，`openImage` 返回 `null`；主处理器没有从 `.ce` 读取音频的代码。综合测试虽然给 `AACButton` 人工挂载 `audioRecording`，但只断言保存后标签仍存在，没有断言音频被保存或恢复。
- **证据：** Node 包安装成功；Node/browser build 成功；TouchChat 相关定向测试共 `7 suites / 40 tests` 通过。公开样本 `example.ce` 的 `Images.c4s` schema 为 `symbols(id,rid,compressed,type,width,height,data)`，但该样本 `symbols` 表为 0 行，不能证明任何图片解码能力。全量 Jest 运行超过 300 秒未完成，未伪称全量通过。
- **生效范围：** 仅形成 TouchChat 媒体能力证据和未来升级依据；不改变 cboard-api 依赖、API、Open Board 输出、CBoard Web 或微信小程序。

## 变动 2：复核 Bravo AAC 当前图片边界

- **意图：** 确认目前已经复用的 Bravo RID 关联是否还有可直接追加的压缩图片解码逻辑。
- **决策：** 固定 `OSUBlakester/BravoGCPCopilot` 提交 `a0189275fab53bd2f2bd05e3107b4a3a4dea68f9`，继续只复用其 `buttons.symbol_link_id -> symbol_links.rid -> Images.c4s.symbols.rid` 关联思想；不复制其完整 Python/Firebase/GCP 应用，也不扩写未知 `compressed/type` 载荷。
- **理由：** Bravo 最新 `load_symbol_png_bytes` 仍只在 `data` 以 PNG 签名开头时返回图片，没有压缩载荷解码、声音恢复或可用于这些能力的测试。当前 cboard-api 已在相同关联链上额外安全支持 JPEG，因此没有可再机械移植的成熟实现。
- **证据：** 本地源码逐行审阅 `_load_embedded_symbol_rids` 与 `load_symbol_png_bytes`；仓库未发现自动化测试。GitHub 代码检索 `Images.c4s + compressed`、`symbol_links + Images.c4s` 和真实表字段组合均未找到另一套可运行公开解码实现。
- **生效范围：** 保持现有 PNG/JPEG 自定义图片导入不变；压缩/专有图片、商业符号库、录音和动态供应商动作继续明确不支持。

## 变动 3：运行 Python AACTools 并拒绝错误 schema 适配

- **意图：** 核查 Python AACTools 的可选 `TouchChatSymbolExtractor/Resolver` 是否可以直接补齐缺口。
- **决策：** 固定 `willwade/AACProcessors` 提交 `ff9cfb40ba518a5ba2df170fb49b48dfd57f64ad`，安装 dev extra 并运行 TouchChat 主处理器测试；可选 symbol tools 只保留为反例证据，不接入 cboard-api。
- **理由：** 可选 extractor 在 `Images.c4s` 查询 `buttons.image_id`，resolver 查询 `images(name,image_data)`，均不符合公开真实 schema `symbols(rid,compressed,type,width,height,data)`，且没有对应测试。照抄会让“所有图片缺失”以另一种形式重现。
- **证据：** 沙箱外 TouchChat 测试主逻辑 `7 passed`；唯一错误是保存测试结束后 `output.c4v` 仍被进程占用，Windows teardown 无法删除，显示上游还有资源释放问题。该仓库许可证为 AGPL-3.0-or-later，进一步支持只把它作为审查参考而非无必要引入服务端运行时。
- **生效范围：** 不增加 Python 服务、AGPL 运行依赖或第二套 TouchChat parser；现有 Node 服务端转换架构保持不变。

## 变动 4：将未实现边界固定为证据门

- **意图：** 让未来开发者能区分“尚未找到合法成熟实现”和“忘记开发”，避免再次用猜测、文件头碰运气或虚假能力字段处理患者沟通数据。
- **决策：** 压缩/专有 TouchChat 图片和真实按钮录音的进入条件固定为：合法可分享样本、可解释字段/编码、公开许可实现、成功运行测试、恶意输入边界、Open Board 往返与 Web/微信复核链。任一项缺失时只返回现有 warning/能力边界，不自动解码。
- **理由：** 供应商格式中的 `compressed` 和 `type` 没有公开契约，错误解码可能造成图片错配，直接改变患者表达含义；声音同样不能由一个未被保存/恢复断言覆盖的内存字段推断。
- **证据：** 三个上游当前实现都未提供所需闭环；真实公开样本无图片行；GitHub 主代码搜索没有发现等价 decoder。现有 cboard-api 已对无法识别或超限载荷计数并返回 warning，且不会删除对应按钮。
- **生效范围：** TouchChat 导入能力声明、后续源码复用门和验收标准；不阻止 PNG/JPEG、文字、布局、导航和大词库的既有导入。

## 来源固定

| 来源 | 固定提交 | 本地路径 | 审查结论 |
| --- | --- | --- | --- |
| AACTools/AACProcessors-nodejs | `221c8c924c8348b3d373f12d86952b01f2b8ddb7` | `D:\used-by-codex\source-reviews\picinterpreter-aac-import-20260728\AACProcessors-nodejs` | 主 parser 可用，TouchChat 图片和真实文件音频未实现 |
| OSUBlakester/BravoGCPCopilot | `a0189275fab53bd2f2bd05e3107b4a3a4dea68f9` | `D:\used-by-codex\source-reviews\picinterpreter-aac-import-20260728\BravoGCPCopilot` | RID 关联可复用，只读取原始 PNG |
| willwade/AACProcessors | `ff9cfb40ba518a5ba2df170fb49b48dfd57f64ad` | `D:\used-by-codex\source-reviews\picinterpreter-aac-import-20260728\AACProcessors-python` | 主测试大体可运行，可选图片工具 schema 不匹配且无测试 |

## 记录

- **执行者：** Codex（GPT-5.6）
- **时间：** 2026-07-28 19:40:59
- **操作边界：** 本轮未修改业务代码，未使用 Computer Use，未打开、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
