# 图语家迁移逐项覆盖矩阵

- 审计时间：`2026-07-16 20:33:53`
- 最近回填：`2026-07-29 10:07:11`
- 执行工具 / 模型：`Codex（GPT-5）`
- 对照范围：图语家原 MVP、CBoard Web fork、独立 Taro 微信小程序 PoC
- issue 来源：本仓库文档中的 issue 引用，以及开发过程中在线核验并持续回填的功能 issue。
- 在线状态限制：本轮已通过 GitHub API 逐项读取全部当前 issue 清单，并补读此前遗漏的 #1/#2/#3/#4/#5/#7/#9/#14/#17/#20/#21/#25/#46/#47/#50-#56/#71/#74/#82 正文；代码完成度仍只以本地工作树、测试、构建和真实运行证据为准。

## 如何读状态

| 状态 | 含义 |
|---|---|
| `已验证` | 找到代码证据，并有测试或构建证据 |
| `部分` | 只完成了需求的一部分，或仅继承底座能力但未完成图语家语义 |
| `仅文档` | 有研究或决策，但没有对应运行代码 |
| `未开始` | 未找到可执行实现证据 |
| `主动延期` | 当前 PoC 边界明确不做，不等于需求被删除 |

## 原 README 未独立 issue 的运行功能补充

| 功能 | 原实现 | CBoard Web | 微信 PoC | 证据与边界 |
|---|---|---|---|---|
| 首次使用引导 / 重看引导 | `OnboardingModal` + localStorage | `已验证`：复用中性 `COMMUNICATION_ONBOARDING_CONTENT` 与本地偏好，首次展开自动显示、完成后持久化，照护设置可重看 | `已验证（代码/build/官方模拟器；物理真机待验收）`：同一三步内容契约、完成状态、微信 storage、照护重看入口和再次完成均通过 | Web `CommunicationOnboardingDialog`、微信 `CommunicationOnboarding`、偏好测试和 `test:e2e:weapp:accessibility`；不复制 React DOM 或原 Tailwind 弹窗；原 19 项 storage 恢复 |
| 高对比度 / 字号 / 图卡列数 | 原 settings store 与 `.hc` 样式 | `已验证`：Communication Accessibility 对话框、患者板和接收全屏共用偏好 | `已验证（代码/build/官方模拟器；真机视觉待验收）`：高对比、超大字号、两列网格通过正式设置进入患者页并跨 `reLaunch` 保持，重看引导不丢偏好 | `communicationPreferences`、双端 accessibility/settings/display tests；微信 `77 files / 343 tests`、production build、background-only E2E；系统读屏、色彩对比和物理设备视觉仍需人工验收 |
| 分类可见性 | 原分类隐藏设置 | `已验证`：继续复用 CBoard 原生板编辑，并以中性 hidden board 偏好保护患者入口 | `已验证（代码/build；真机待验收）`：照护设置按板隐藏/恢复，患者端过滤 | `toggleCommunicationBoardVisibility` 与双端偏好/store 测试；不删除板或图卡 |
| 新版本更新提示 | 原 Service Worker `UpdateBanner` | `已验证`：复用 CBoard Service Worker registration 回调与 App 通知，不建立第二套 PWA 更新器 | `已验证（代码/build；发布版待验收）`：复用微信原生 `getUpdateManager`，全局 banner 可立即更新或稍后 | Web App container service-worker tests；微信 `appUpdatePort`/`taroAppUpdatePort` tests；预览版与正式发布版的更新行为由微信平台决定 |

## 变动 1：建立单一覆盖矩阵

- **意图：** 防止把“文档已经决定”“原 MVP 已经验证”“CBoard 自带能力”和“微信已经完成”混为一谈。
- **决策：** 以 issue 为最小追踪单位，同时记录原实现、CBoard Web、微信 PoC、证据和下一动作；以后每个功能切片完成后回填本表。
- **理由：** 图语家已有大量研究和设计，如果迁移只看当前 UI，容易重复踩坑或漏掉隐私、离线、纠错、验收等非显性要求。
- **证据：** `decision-index.md`、`implementation-task-index.md`、`ROADMAP.md`、ADR-001/002/003，以及三个工作树的当前代码和测试。
- **生效范围：** 图语家原仓库的需求治理、CBoard Web 迁移、微信小程序迁移和后续 PR/验收；不改变 issue 的 GitHub 状态。

## A. 产品、架构与研究 issue

| Issue | 意图 | 决策 | 理由 | 原实现 | CBoard Web | 微信 PoC | 证据 | 生效范围 / 下一步 |
|---|---|---|---|---|---|---|---|---|
| [#6](https://github.com/picinterpreter/picinterpreter/issues/6) | 患者端图标优先、44px+、不超过 3 个核心步骤 | 以共享 `PatientActionLanguage v1` 固化动作 ID、图标语义、短标签和完整无障碍标签；Web 与微信分别使用轻量平台 adapter，照护者复杂功能继续与患者路径分层 | 失语患者不能依赖长文字说明；共享语义而非共享 UI 才能同时保留跨端一致性和包体控制 | `部分`：患者图卡主流程存在，仍有文字控件 | `已验证（代码/测试/build；视觉待验收）`：表达/接收/求助入口、图片重排删除、撤回清空、优化确认、朗读停止、收藏分享、全屏反馈、返回和紧急图卡均为图标优先；Material Icons 仅留在 Web adapter | `已验证（代码/测试/build；真机待验收）`：同一动作契约由字符 glyph + Taro Button 渲染，保留 E2E ID 和 `data-patient-action`；紧急短句继续使用自包含大图 | Web `6 suites / 48 tests` 与 production build；微信 `48 files / 184 tests`、TypeScript、ESLint、`148 app / 26 core`、production build；caregiver `1,484,584 B`，距 1.5 MiB 建议线 `88,280 B` | 双端工程闭环已完成；仅保留系统读屏、真机安全区、横竖屏、物理触控和人工视觉理解验收。开发者工具可后台操作但不得打开、置顶、聚焦或抢占输入 |
| [#8](https://github.com/picinterpreter/picinterpreter/issues/8) | 提升文字到图片匹配，必要时在线补图和 AI 重分词 | 本地确定性匹配为底线；AI 只接受不劣于本地结果的受限分词；在线图片必须经照护者确认并保留来源许可；OpenSymbols 外部图在 API 内受限解码并统一输出 PNG；服务端对同词成功结果做有界短期缓存，对搜索与 OpenSymbols token/401 刷新并发分别合并；微信所有图卡统一通过可恢复图片组件渲染 | 沟通不能因网络或模型失败中断，外部结果也不能未经确认直接替换图卡；SVG/WebP 即使下载成功也可能在微信真机不渲染，必须在可信服务端边界统一格式；即使本地文件损坏或运行时解码失败，也不能给患者留下无法理解的空白卡片 | `部分`：原 MVP 已验证本地匹配、ARASAAC/OpenSymbols 在线补图和 AI 方向 | `已验证（代码与定向门）`：中文词典、短语保护、Board 感知合并、AI 候选/重分词与 ARASAAC/OpenSymbols 服务端补图均接入；Web 只接受同源 API 图片代理 | `已验证（假 API 官方运行门；最新降级真机待验收）`：复用纯 matcher；优先请求 `cboard-api`，失败时再尝试 ARASAAC 直连；候选须人工确认并保存离线文件；空地址或真实加载失败时显示对应词语而不是空白，新图片地址可自动恢复正常显示 | 原 `aac-search.ts`、API `pictogramSearch.js`/`pictogramImage.js`、微信 `PictogramImage.tsx`/`pictogramSearchPort.test.ts`；API 聚焦 `111 passing`；微信全量 `55 files / 216 tests`、TypeScript、ESLint、边界和 production quality gate 通过；真实 SVG/WebP→PNG、损坏字节、超大像素、2 MiB 输入门及图片失败源切换均有测试 | 多图库客户端、跨格式 PNG 归一化、来源门、缓存生命周期、服务端并发去重及客户端非空白降级已形成代码闭环；真实 OpenSymbols/AI 凭据、公网可信域名、微信合法域名、部署后 API 和最新源码真机显示仍待配置与验收 |
| [#10](https://github.com/picinterpreter/picinterpreter/issues/10) | 支持用户自定义图片并保留许可/隐私边界 | 默认板继续复用 CBoard；Web 使用原生 Board/Tile 编辑，小程序在低频 backup 分包使用共享 BoardDTO 契约新增、编辑、跨板移动、板内前移/后移、复制到多个板和删除 `device-private` 个人图卡；复制生成新 Tile ID 并共享同一媒体与来源 `originalId`；默认图覆盖与缺词私图继续作为独立本机层，默认不进入 Settings 或事件同步，只有用户主动执行账号私有备份时才进入每账号一个 custom ZIP 快照 | 家庭照片既要能成为独立词汇，也不能因整板或 Settings 同步意外上传；同一媒体应可被多个板复用，但 Tile 布局身份必须独立；共享不可变更新与引用检查可保持板布局、来源说明和图片/录音文件生命周期一致 | `部分`：有本地图符和来源类型，隐私 scope 未完整落地 | `已验证（CBoard 原生能力 + 共享契约）`：可上传/编辑自定义 Tile 的标签、朗读、同义词和分类；共享纯核心支持把设备私图复制为另一块板的新 Tile、板内相邻换位，并保护共享媒体；默认覆盖及缺词私图仍留在本机 | `已验证（代码/测试/build/官方模拟器；物理真机待验收）`：可新增独立个人图卡，编辑名称/朗读/同义词/分类/作者/使用说明，直接录制/试听/替换/清除专属声音，移动板块、板内前移/后移、复制到多个板和删除，并立即进入浏览、搜索、匹配和录音/TTS 混合朗读；删除任一副本不误删其余板共享媒体 | `pictogramMetadataSuggestion.js`、`CustomPictogramEditor.tsx`、`customPersonalPictogram.ts`、`pictureLibraryArchiveInterop.test.ts`；CBoard 聚焦 `1 suite / 12 tests`；微信全量 `85 files passed / 1 skipped`、`380 tests passed / 4 skipped`、TypeScript、ESLint、边界与 production build；双向 JSZip/fflate 互操作证明板内顺序随完整图库迁移 | #10 本机自定义图卡、板内排序、多板复用和跨端完整图库迁移已形成工程闭环；真实相册/麦克风、原生 Picker、大量图卡、账号私有云与两台真机仍待验收。受控整板公共贡献已有代码/测试/build 闭环；生产公网发布仍待验收，逐图审核型公共图库投稿因无成熟上游审核 API 继续有条件延期 |
| [#11](https://github.com/picinterpreter/picinterpreter/issues/11) | 建立结构化 AAC 图库、概念、符号、板与排除规则 | 新增中性 `PictogramLibraryDTO v1`，把概念、图片资产、概念图片关系、板布局和图卡位置分开；继续以 CBoard BoardDTO/TileDTO 为运行模型，`relatedTerms` 只保存人工策展关系而不参与自动匹配；Web 负责导出、解析、复核和确认导入，微信只消费同一纯核心恢复结果 | 不重造成熟板模型；结构化层需要把词义、布局和逐图来源许可分开，才能去重、审计和跨端恢复；相关概念不等于同义词，误入 matcher 会产生错误图卡 | `部分`：Dexie pictogram/category seed 已有，目标 schema v2 未完成 | `已验证（结构化工程闭环；内容策展持续）`：可从 CBoard 板树导出结构化 AAC JSON，保留中英文名称、synonyms/relatedTerms/exclude/category、图片来源许可和布局；导入时严格校验引用并进入既有“解析、复核、确认”门，再恢复为 BoardDTO | `已验证（结构化消费闭环）`：图片库 storage 可直接识别 `PictogramLibraryDTO v1` 并通过共享纯核心恢复 BoardDTO，名称、图片和同义词可重载；不复制 React DOM、Material UI 或完整编辑器 | `pictogramLibrary.js`、Web Structured export/import/review tests、微信 `pictureLibraryStore.test.ts`；Web `177/1086/72` 与 production build；微信 `49 files / 188 tests`、类型、ESLint、`151 app / 28 core`、production build | 结构化 schema、双端导入/消费和许可审计已形成工程闭环；自定义概念英文名可能为空，真实大图库内容策展、供应商扩展、生产公网发布、逐图审核型投稿和微信完整板编辑器仍不冒充完成；受控整板公共贡献已有代码/测试/build 闭环 |
| [#12](https://github.com/picinterpreter/picinterpreter/issues/12) | 每条实时候选句可评价“有帮助/不符合”，立即本地保存，登录后同步，且不干扰播报 | 中性核心统一 `candidates[].feedback = up/down/null`；未确认时写独立本地草稿，确认后并入 expression record；同一按钮可取消、另一按钮可替换；触控目标至少 88rpx/44px；面板重建时按 session、输出签名和候选句文本恢复最新匹配草稿，禁止把旧评价按数组下标错贴到新 AI 候选 | 单纯增加字段不能证明功能，必须同时有实时入口、状态高亮、草稿、确认记录、历史复盘和后续 AI 消费；反馈按钮不能与朗读按钮重叠或触发语音；持久化但无法恢复的草稿不算闭环 | `Issue 已完整决策`：本轮未在原 MVP 运行代码中找到可直接复用的完整闭环 | `已验证（生产浏览器三视口）`：实时按钮、状态高亮、本机草稿、未确认草稿离线刷新恢复、确认合并、草稿清除、登录提示、切换/取消和不调用 TTS 均接入 | `已验证（官方模拟器运行态；真机待验收）`：独立触摸区阻止冒泡；草稿创建、同 ID 替换、取消删除、确认写入历史、历史改评、两次页面重建与 storage 恢复均通过 | 共享 `candidateFeedback`、repository 与双端 UI；CBoard `203 suites / 1409 tests / 72 snapshots`、production build、三视口 E2E `3/3 PASS`；微信 `76 files / 339 tests`、质量门 `7/7`、TypeScript、ESLint、`213 app / 32 core`、production build及官方 Skill E2E PASS | Web 和微信模拟器均完成草稿→确认历史→重建复盘；后续 AI 继续只消费已确认反馈。微信物理触控、与真实 WechatSI 播报并行及登录云同步仍待真机/部署验收 |
| [#13](https://github.com/picinterpreter/picinterpreter/issues/13) | “新对话”必须二次确认、建立全新会话并清空 AI 上下文，同时保留可复盘历史 | Web 与微信均先显示确认界面；确认后创建新 session、清除当前场景和工作区，只从新 session 构建后续 AI 上下文 | 换 session ID 但继续把全部历史发送给 AI 并不是真正的新对话；历史应保留给照护复盘，但不能隐式污染新语境 | `Issue 已完整决策`：原实现覆盖程度未找到完整运行证据 | `已验证（production 三视口）`：二阶段确认后活动 session ID 真实变化、场景清除、界面回到未选择且双向历史保持；AI 仅使用活动 session 的约束继续由既有自动化覆盖 | `已验证（官方模拟器运行态）`：取消确认不改变 session/场景/历史；确认后新 session 清空场景、接收输入和患者图片序列，旧历史原样保留并跨页面重建恢复 | `conversationSession.js`、repository、AI payload tests；CBoard 全仓 `203 suites / 1404 tests / 72 snapshots`、production 三视口 `3/3`；微信官方 Skill session E2E PASS、`76 files / 339 tests`、质量门 `7/7` | Web 与微信新对话运行闭环已验证；不删除历史，不执行账号或云端数据清理。物理手机确认框和触控仍待真机验收 |
| [#15](https://github.com/picinterpreter/picinterpreter/issues/15) | 否定、复合短语和高风险歧义不能错误匹配 | 使用短语保护、排除词、概念 profile 和 80 条证据回归；默认板缺少安全图时保留完整 token，禁止 partial 猜图 | 错图可能改变照护语义，明确缺图比错误高匹配率更安全 | `部分`：研究、词典和高风险测试已有 | `已验证（80/80 + 餐具校准）`：全量样本无 partial，医疗、否定、重复对象、家庭、活动和餐具自然中文退化已修复 | `已验证（共享核心与模拟器）`：复用同一 matcher，关键差异句和“叉子/刀/勺子/碗”四图已在官方模拟器运行 | `receiverCaregiverFixtures.test.js`、`segmentation.test.js`、`symbolMatching.test.js`、CBoard `3/161`、微信官方 Skill | matcher 回归已全量迁移；缺图概念继续进入照护者维护而非猜图 |
| [#16](https://github.com/picinterpreter/picinterpreter/issues/16) | 语音输入时显示可理解且不误导的状态 | 两端分别使用平台 adapter；Web 在 SpeechRecognition 后异步复用 Web Audio API 计算真实 RMS 音量，微信继续使用 WechatSI 静态监听状态；最终识别文字和分词必须可人工修改 | 只有真实时域样本可以驱动音量反馈；WechatSI 文字回调不是振幅，不能伪造波形；识别只是文字输入方式，不能绕过人工复核管线 | `部分`：原 MVP 有 Web Speech 与微信环境规避实现 | `已验证（生产浏览器 API 边界；真麦克风待验收）`：三视口真实 production 页面以时域样本驱动七段 meter，静音/有声/恢复静音、最终文字人工修改、原 matcher 和音频资源释放均通过；不支持或权限失败仍静态降级 | `部分（代码与模拟器已验证）`：无伪波形，录音开始显示静态状态；用户已确认 ASR 正常，文字与分词可人工修正，新 UI 待真机复测 | Web `browserAudioLevel.js`、`browserSpeech.js`、ReceiverLoopPanel；CBoard 全仓 `203 suites / 1404 tests / 72 snapshots`、production build、语音状态三视口 `3/3`、合并 `9/9`；微信 RecognitionPort、官方 Skill、用户反馈 | CBoard Web 与微信照护者输入；Web API 接线和资源生命周期已验证，监测流只在本机采样且不保存/上传，SpeechRecognition 自身网络边界不变；真实浏览器权限、设备噪声底、识别准确率和端到端延迟仍待人工验收 |
| [#19](https://github.com/picinterpreter/picinterpreter/issues/19) | 记录缺图并提供照护者维护工作流 | 未匹配本地聚合，并由照护者查看、忽略、恢复、关联现有图卡、确认在线候选、建立设备私有图片，或在登录后显式生成一个 AI 图符并预览；任何候选都必须人工确认后才改善下次沟通 | 只显示一次无法形成词库改进闭环；公共图源、家庭图片和模型生成内容的许可/隐私不同，必须共用人工确认但保留不同来源边界 | `部分`：运行时缺词和在线补图有代码，无维护表 | `已验证（production 三视口 + 代码/测试/build）`：持久化、忽略/恢复、现有图、ARASAAC/OpenSymbols、本机图片及 AI 生成 PNG 的预览/确认/设备私有保存闭环；production 页面批量在线搜索、逐项来源许可、人工确认、立即复用和刷新持久化已通过 | `已验证（代码/测试/build；AI 真机待验收）`：既有在线候选和本机私图官方 Skill 闭环保留；新增 AI 图符保存到 USER_DATA_PATH，确认前不写规则，取消/失败清理文件，恢复待处理继续删除设备私图 | ADR-001、`missingTokens.js`、`runtimePictogram.js`、两端 MissingTokenQueue、`communicationPictogramGenerationProvider.js`；API `58 passing`；Web 缺词 production 三视口 `3/3`、最新离线全组 `27/27`、全仓 `203 suites / 1405 tests / 72 snapshots` 与 production build；微信 `75 files / 333 tests`、类型、ESLint、边界与 production build | 现有图、设备私图、多公共图库和照护者 AI 私图均已形成工程闭环；生成图不进入公共图库、不声明公共许可。真实公共图源公网/HTTPS、图像模型凭据、生成质量、代表性患者理解研究、微信真机交互、跨设备私有快照和生产公网发布仍待验收；受控整板公共贡献已有代码/测试/build 闭环，逐图审核投稿继续延期 |
| [#22](https://github.com/picinterpreter/picinterpreter/issues/22) | 照护者按会话复盘历史、修正接收记录并评价患者表达候选，评价影响下一次 AI | 继续复用既有会话分组、接收纠错日志和照护管理入口；候选评价沿用 #12 schema，历史接收修正沿用 receiver correction schema，并新增 `caregiver_history_review` 上下文与前后序列快照；原确认记录始终只读 | 实时反馈和事后复盘必须写同一事实；历史修正必须保留患者当时看到的原记录与每次修订证据，患者主界面不能暴露照护编辑工具 | `Issue 已完整决策`：原迁移前实现覆盖程度仍需逐文件补证 | `已验证（生产浏览器三视口）`：真实会话中的历史候选评价、已确认接收换图、原记录只读、追加式前后快照、最新修订投影和离线刷新恢复均通过；会话分组与 AI 上下文继续由既有自动化覆盖 | `已验证（代码/测试/build/官方模拟器；真机待验收）`：照护历史复用同一纯核心与微信 storage，提供 88rpx 操作区、图片目录搜索和完整序列修正；后台官方 Skill 已验证从两条确认记录中修正任意较旧记录、原历史只读、追加前后快照、最新图片投影、`reLaunch` 恢复及 storage 还原 | 共享 `receiverLifecycle/storage/repository`；CBoard 全仓 `203 suites / 1409 tests / 72 snapshots`、production build、三视口历史复盘 `3/3`；微信 `76 files / 339 tests`、TypeScript、ESLint、`213 app / 32 core` 边界、production build 与历史复核专用 E2E PASS | #22 的 Web production 与微信官方模拟器闭环均已完成；纠错审计仍按既有隐私决策只在本机，不冒充云同步；物理真机触控、真实登录同步和弱机重启仍待外部验收 |
| [#23](https://github.com/picinterpreter/picinterpreter/issues/23) | 接收端由照护者声明医院、家庭或康复门诊场景，并让 AI 在不虚构事实的前提下使用场景 | 共享核心固定三个稳定 ID；再次点击已选场景即清除。场景随活动 session 持久化并只发送给受限 AI 请求；新对话自动清除，不读取 GPS | 场景能改善候选措辞，但任意位置文本或自动定位会引入隐私、提示注入和错误推断；固定枚举更可审计 | `Issue 已完整决策`：未找到原 MVP 完整运行闭环 | `已验证（production 三视口）`：真实接收页完成“医院”选择、同按钮清除、重新选择、session 持久化和新对话自动清除；固定枚举与 AI payload 继续由既有自动化覆盖 | `已验证（官方模拟器运行态）`：接收分包医院场景即时激活、同键清除、重新选择、storage 与页面重建恢复、新对话清除均通过；固定场景到 AI port 的传递继续由自动化覆盖 | `conversationSession.js`、repository、`communicationAi.js`、Web UI；CBoard 全仓 `203 suites / 1404 tests / 72 snapshots`、production 三视口 `3/3`；微信官方 Skill session E2E PASS、`76 files / 339 tests`、API `6 passing` | CBoard Web 与微信场景运行闭环已验证且不采集定位；真实登录 AI 请求仍待部署验收，不改变 matcher、历史 schema 或本地离线候选 |
| [#24](https://github.com/picinterpreter/picinterpreter/issues/24) | 将完整图片库、元数据和图片文件批量导出为可恢复 ZIP | 定义 `PictureLibraryArchive v1`，支持“自定义图片/完整图库”范围、“备份优先合并/本地优先跳过”重复 ID 策略和逐阶段进度；完整本机档再用固定 sidecar 保存双向沟通数据，普通图库档不混入历史 | 备份必须同时保存图卡语义、板布局和真实图片字节；设备交接还必须可逆恢复沟通事实和删除墓碑。共享纯核心、平台文件端口与事务回滚可避免 Web/微信形成两套格式或半恢复状态 | `仅 Issue`：原 MVP 没有可复用完成实现 | `已验证（代码/测试/build）`：Settings 可生成和恢复普通图库或完整本机 ZIP；确认页显示常用语、沟通记录、纠错和反馈草稿范围，相同 ID 服从现有冲突策略，删除墓碑与当前患者/家庭身份均保留 | `已验证（官方 Skill；跨真机待验收）`：custom 私图 ZIP 完成真实删除/新路径恢复；完整本机 ZIP 又完成常用语、删除墓碑、沟通历史、接收记录、修正和反馈草稿恢复，默认 775 图按字节一致性复用包内资源 | `pictureLibraryArchive.js`、`localDeviceData.js`、Web `PictureLibraryArchive.helpers.js`、微信 `pictureLibraryBackupService.ts`/文件与 storage ports；Web 聚焦 `5 suites / 25 tests / 3 snapshots`、共享核心 `7/7`、微信服务/端口 `2 files / 22 tests`、两端 production build、完整微信 Skill E2E 约 566 秒 PASS | 普通图库 ZIP 仍不包含沟通历史；完整本机沟通数据恢复已在 Web 与微信共用同一解析和合并契约。账号密钥从不进入 ZIP；Web 浏览器人工选择/下载、系统文件 UI、真实云和跨两台真机恢复仍需人工验收 |
| 原 MVP 运行功能：重置默认词库 | 用户可以从导入或本地修改后的图库安全回到应用内置版本 | CBoard Web 继续以原生 Board/Tile、导入和同步作为主数据，不复制原 Dexie seed 重置；微信本地 BoardDTO 快照提供二次确认的“恢复默认 CBoard 图库”，只清除图库快照覆盖 | 原 `forceReseed` 是旧 Dexie seed 的维护动作，直接移植到 CBoard 会误删或覆盖成熟底座数据；微信独立图库快照则确实需要可逆出口 | `已验证（原 MVP）`：设置页 `forceReseed()` 重新导入 seed | `不新增专用重置`：避免把 CBoard 用户板当成临时 seed；仍可使用原生编辑、导入和账号同步 | `已验证（代码/测试/build）`：备份页第三步二次确认后恢复 44 块内置板，个人替换图片、已确认补图、沟通历史、账号设置和排序记录均保留 | 原 `SettingsDrawer.tsx`/`forceReseed`；微信 `boardStore.reset()`、backup service `4/4`、全量 `35/123`、TypeScript、ESLint 与 production gate | 仅微信本地完整图库覆盖；不是清空全部数据，也不改变 CBoard Web 云端板、个人图片或历史 |
| 隐私分层（历史决策，非 GitHub #24） | 公共、设备私有与账号私有分层；设备数据默认不上传，只有用户分别确认“私人图片”或“完整私有数据”备份时才进入对应账号快照 | 公共内容继续使用 CBoard；家庭熟悉图片默认采用设备本地覆盖。账号侧保留两个独立密文快照：私人图片快照把只含个人替换图/补图的 `PictureLibraryArchive v1` custom ZIP 在客户端加密；完整私有数据把 compact ZIP及常用语、墓碑、历史、接收记录、修正和反馈草稿在客户端加密。两者都使用用户恢复密码与 `PIE2EE01` 信封，经认证 API 写入独立私有 Blob且不返回公开 URL；密码从不上传或持久化 | CBoard 原公开媒体 URL 不满足家庭照片隐私；账号权限和私有 Blob也不能阻止服务端读取明文。复用现有账号、JSZip、Azure Blob、Mongoose、导入复核及经审计的 Noble `scrypt + XChaCha20-Poly1305`，可在不引入第二后端、自研密码学或第二种加密格式的前提下实现可撤销迁移 | `仅文档`：`scope` 未进入现有 PictogramEntry | `已验证（代码/测试/build/密码遗失保护）`：Web 分别管理两个密文快照，密码仅在内存；上传前双次输入并明确告知遗忘后不可恢复 | `已验证（代码/测试/build/真实隔离云端并发与响应丢失）`：微信 backup 分包用官方 CSPRNG 生成两个独立密文，本机解密复核；恢复密码双次输入和遗失警告、并发原子胜者、结果未知提示、元数据核对及同密文安全重试均有证据 | `privateArchivePassphrase.js`、`privateArchiveEncryption.js`、Web/Taro adapters、API 两类 controller/model；API `374 passing`，Web `203 suites / 1401 tests / 72 snapshots`；微信 `377 passed / 4 external skipped`，真实 API/Mongo/Azurite 集成 `4/4`、production gate | 两个账号快照均为用户显式触发的端侧加密最新版本，不等于实时 CRDT 同步。旧明文快照需回原设备重新加密，仍可删除。生产 Azure/HTTPS、合法域名、两台真机、真实网络中断、低内存 KDF 和历史版本仍待验收 |
| [#26](https://github.com/picinterpreter/picinterpreter/issues/26) | 接收端草稿、确认、纠错、可见历史和局部修正记忆分层 | 匹配即建草稿；全屏展示才确认；维护日志与普通历史分开；同一 workspace 最新换图立即优先，删除图形成 90 天墓碑，可查看并停用活动规则 | “保存内部证据”“展示给用户”和“影响未来匹配”是三个独立决定；局部规则不能污染默认词典或跨家庭传播 | `仅文档/部分类型`：Expression 有 receive，但无 recordStatus/Correction 表 | `已验证`：草稿/确认、五类日志、完整前后序列、工作区覆盖、评分/墓碑、冲突优先级、活动规则展示与停用均接入 | `已验证（官方 Skill）`：换图复用、删除 tombstone、原生 Switch 关闭学习、管理器 2→1、审计保留、默认图恢复和 storage 恢复均通过 | `receiverLifecycle.js`、`correctionMemory.js`、CBoard `49/349`、微信 `22/87`、Web/微信完整 E2E | Web/微信本机 workspace 纠错记忆已完成；原始日志不云同步，跨设备家庭规则同步不在当前边界 |
| [#27](https://github.com/picinterpreter/picinterpreter/issues/27) | 匿名身份、版本冲突和跨设备同步 | 账号和轻量配置继续复用 CBoard Settings；设备首次运行生成独立匿名 `userId/patientId/workspaceId`；确认记录使用 `baseVersion/serverVersion/conflicted` 乐观并发；登录合并完成后保留匿名 ID 作为来源，并写入账号关联墓碑阻止重复提示 | 核心沟通必须本地可用；旧设备不能覆盖患者已经看过的确认事实；匿名身份与患者/工作区身份必须分离，账号合并不能靠删除本机身份伪装完成 | `部分`：device/syncOutbox 代码存在 | `已验证（工程）`：匿名 userId、账号关联墓碑、Web 显式同步、版本化确认记录和 tombstone 合并已接入 | `已验证（工程与官方 Skill 假 API 门）`：匿名 userId、登录合并确认、按账号最多三次暂缓、完整同步后退役关联、版本字段和本地恢复已接入；多真机公网服务仍未验收 | CBoard `savedPhraseSync.js`、微信 `communicationCloudSync.ts`、API `CommunicationSavedPhrase`；API 全量隔离回归 `155 passing`；真实本地 HTTP/Mongo 接收并发 smoke 通过 | 匿名身份、账号关联、确认记录和常用语逐条 `serverVersion`、冲突保留及 tombstone 已形成工程闭环；真实可信 HTTPS、邮箱激活和两台物理手机交错断网仍待验收 |
| [#29](https://github.com/picinterpreter/picinterpreter/issues/29) | 表达历史保存失败时不得清空当前图片序列或关闭候选句，并允许原地重试 | 中性表达核心用 `persistExpressionHistoryEntry` 将“生成记录”和“持久化成功”分开；只有 repository 返回已保存记录才进入已确认状态。返回空值或抛出 storage 错误时，两端保留图片、候选、所选句和确认按钮，显示明确错误；候选反馈回写也使用同一安全边界 | AAC 表达首先是当前沟通内容，历史保存只是后续记录；把 storage 失败误当成确认成功会丢失患者正在表达的内容，也会让用户无法重试 | `仅 Issue`：原 MVP 运行代码中未找到完整实现 | `已验证（production 三视口 + 代码/测试/build）`：浏览器 storage 配额失败会传到 repository；首次确认显示错误、历史为空、图片和全部候选原样保留且可重试，第二次写入成功后才进入已确认 | `已验证（官方模拟器运行态；真机低存储待验收）`：官方 `wx.setStorageSync` 配额错误下历史为空，图片、全部候选、当前选句和确认按钮均保留；恢复真实 API 后原地重试只写一条确认历史，重复确认不产生副本 | 共享 `expressionPipeline`、browser/Wechat KeyValueStore 与 repository；CBoard `203 suites / 1405 tests / 72 snapshots`、production build、历史重试三视口 `3/3`；微信 `76 files / 339 tests`、TypeScript、ESLint、`213 app / 32 core`、production build 与 storage-failure Skill E2E PASS | CBoard Web 与微信官方模拟器的 storage 失败重试均形成闭环；物理设备真实低存储/配额边界仍需外部验收。不改变历史 schema、候选算法、TTS、账号或 API |
| [#30](https://github.com/picinterpreter/picinterpreter/issues/30) | 导入 CBoard/其他 AAC 图库并支持 Board/PictureSet | CBoard 作为主模型，直接复用 JSON/OBF/OBZ、Board，并复用 [AACTools AACProcessors](https://github.com/AACTools/AACProcessors-nodejs) 的 AsTeRICS Grid、Snap 与 TouchChat 处理器；普通 CBoard JSON 复用共享 `BoardDTO v1` 校验板面、图卡和唯一 ID，并把损坏固定网格归一化为安全矩阵；解析后先生成板块、图片、重复 ID、损坏/不支持条目摘要，照护者确认后才申请配额并合并。标准 CBoard/OpenBoard 冲突保留本机板；图语家图库归档继续使用明确的 merge/skip 策略 | 迁移底座后不应再自研第二套导入器；AACTools 已实现多种 AAC 格式的成熟解析。为避免把 `better-sqlite3`、Excel 等无关/原生依赖带进 Web 与微信包，浏览器只保留必要的 GPL-3.0 兼容切片，Snap/TouchChat 原生解析留在 GPL-3.0 服务端，图语家只实现有界校验、图片关联和 Open Board 胶水 | `已验证（代码级跨端闭环；真机待验收）`：JSON/OBF/OBZ/GRD/Gridset/Snap/TouchChat 已接入同一复核与合并管线，公开 WordPower 大型样本通过 | `已验证（解析 → 校验 → 复核 → 确认合并）`：原生 JSON、OBF/OBZ 与 AsTeRICS `.grd` 共用既有复核/合并链；Gridset/Snap/TouchChat 经服务端转换后进入相同流程。冲突与损坏条目明确报告，嵌入图片在确认前保持本机，确认前零同步、确认后才落地 | `已验证（代码/测试/build；真机待验收）`：低频 backup 分包消费同一共享纯核心，支持现有全部格式、跨板链接、固定网格、内嵌图片、本机暂存和 merge/skip；大型图库使用用户目录 A/B 双槽文件保存并兼容旧 storage，不搬运 React DOM/Material UI | 上游 `@willwade/aac-processors@0.2.20`、GPL-3.0 许可证与 Bravo AAC Apache-2.0 图片关联可追溯；公开 `WordPower42 Basic SS_UK.ce` 真实转换为 `348` 个板面、`11,953` 个按钮。API 全量 `355 passing`；CBoard 全量 `200 suites / 1352 tests / 72 snapshots` 与 production build；微信全量 `72 files / 321 tests`、7/7 质量门、TypeScript、ESLint、`202/30` 边界和 production build，backup 分包 `913444 B` | Web 继续承担上传配额、可视复核和完整编辑；微信提供本机标准板导入。TouchChat 内嵌 PNG/JPEG 自定义图片通过 Bravo AAC RID 关联恢复。供应商专用动作、压缩/专有图片、真实部署 API、真机文件选择/图片解码、A/B 槽异常恢复和跨板导航交互仍需样本验收 |
| [#31](https://github.com/picinterpreter/picinterpreter/issues/31) | 表达与接收共享会话，30 分钟空闲或手动重置 | 共享纯核心活动 session；表达与接收自动复用，30 分钟无操作换新，两端提供“新对话”入口 | 没有统一 session 就不能可靠构建双向历史和上下文 | `部分`：Expression 有 sessionId，但原 MVP 未形成完整跨方向运行闭环 | `已验证`：repository 自动归属、空闲换新、手动重置及 Web 入口完成 | `已验证（代码与模拟器刷新）`：同一核心经微信 storage 工作；新对话清空当前草稿，刷新后不恢复旧草稿，5 条历史和 4 个会话分组仍可读 | `conversationSession.js`、repository/UI/session tests、官方 Skill | Web/微信本地会话；手机杀进程和多设备并发仍由 #67 验收 |
| [#32](https://github.com/picinterpreter/picinterpreter/issues/32) | 离线优先和核心词库在断网时可用 | 本地板、纯管线和平台 storage 为最低链路；在线能力只增强 | AAC 工具不能把网络作为前提 | `部分`：Dexie/PWA/模板已有，完整验收未完成 | `已验证（Web 核心离线）`：生产 Service Worker、默认板 matcher、表达、接收和双向历史均在断网刷新后通过 | `部分`：fixture、纯管线、微信 storage 已编译，真机未验收 | `playwright.offline.config.ts`、production offline E2E、跨端契约 | Web 生产 PWA 已收口；微信断网运行仍对应 #65/#67 |
| [#33](https://github.com/picinterpreter/picinterpreter/issues/33) | Playwright、开发者工具与真机 MVP 验收 | 自动化、官方模拟器和真机清单分层执行 | jsdom 单测不能证明触控、全屏、语音、图片编码和离线 | `部分`：有测试基础，验收任务未完成 | `已验证（生产离线自动门）`：桌面 Chrome 使用 click，Pixel 5 竖屏与横屏使用真实 tap，三种形态均完成断网双向沟通和刷新恢复；物理设备仍由 #67 验收 | `部分（当前源码预览已推送）`：官方 Skill 覆盖患者/接收、纠错、个人图片和 storage；用户已确认 TTS/ASR。最新 Electron Skill 已通过无窗口 `auto_preview` 推送当前生产包，网络状态端口/文案已自动化，但事件型断网和当前版真机操作仍待反馈 | `playwright.offline.config.ts`、生产离线 E2E `3 passed`、production build、官方 Skill `auto_preview`、微信验收清单、用户真机反馈 | Web 自动点击、移动触控和横屏门已完成；继续执行 #67 当前预览的物理触控、旋转、真实断网和错误恢复验收 |
| [#35](https://github.com/picinterpreter/picinterpreter/issues/35) | 新增接收数据前先定义安全迁移 | 不复制 Dexie；为实际 key-value repository 建 schema v1、幂等迁移和未来版本写保护 | 目标底座存储不同，复制 schema 会产生第二数据库；无版本键会让旧客户端误写未来数据 | `仅文档`：当前 DB 已到 v6，但没有 ADR-001 的表 | `已验证`：schema v1、旧键合并、损坏修复与未来版本保护完成 | `已验证`：同一共享迁移经微信 adapter 真实编译和恢复 | `repository.js`、`repository.migration.test.js`、微信 migration test | CBoard Web/微信本地 repository；不修改原 Dexie 或 API |
| [#36](https://github.com/picinterpreter/picinterpreter/issues/36) | 空闲后自动播放候选表达 | 严格按 issue 实现：默认 15 秒，照护者可关闭或选 5/10/15/30 秒；单句点选、图片序列变化、停止、触摸、滚动和离开页面均取消旧计时/队列 | issue 已把误触风险转化为可关闭设置和完整取消规则；复用同一 TTS 队列可避免自动与手动语义分叉 | `仅文档`：issue 有完整产品决策和验收标准，未找到原 MVP 运行代码 | `已验证（production 三视口 TTS 边界）`：中性偏好/控制器、默认 15 秒、真实照护设置入口、手动取消、表达变化后重计、全部候选顺序播报、重播和关闭持久化均在 production 页面通过；设置 Dialog 同时具备可访问名称 | `已验证（代码与生产构建；真机待验收）`：复用同一控制器与 WechatSI，照护设置持久化，患者触摸/滚动/停止/换图可取消 | GitHub REST issue #36；`candidateAutoplay.js`、`communication-support-autoplay.spec.js`；CBoard 全仓 `203 suites / 1405 tests / 72 snapshots`、production build、自动播报三视口 `3/3`、完整 production 离线回归 `30/30`；微信 `25 files / 103 tests`、production gate | CBoard Web production 已证明提交给系统 TTS 前的真实计时、取消、顺序与设置闭环；微信真机 WechatSI、物理触控及各系统最终声音/延迟仍待验收。未打开或置顶开发者工具，未预览、上传、发布、部署、提交或推送 |
| [#38](https://github.com/picinterpreter/picinterpreter/issues/38) | 用真实照护话术建立接收端 fixture | 80 条原样本全部作为共享迁移验收，校验已知图卡、关键词界、重复对象与无 partial 安全边界 | 少量演示词不能代表真实接收质量，全量基线能暴露低频词界和否定退化 | `仅文档/部分测试` | `已验证（80/80）`：全部证据话术进入共享永久回归 | `已验证（共享核心）`：同一 80 条回归由微信直接编译复用，关键差异句已在模拟器抽查 | `receiver-fixture-samples-evidence.md`、`receiverCaregiverFixtures.test.js`、CBoard `3/160`、微信 `19/72` | 样本迁移完成；fixture 不是用户词库，新增真实反馈继续增量追加 |
| [#45](https://github.com/picinterpreter/picinterpreter/issues/45) | 用户可导出完整本机数据、只清除私人图片或清除全部设备数据，且不得把本机清除误称为云端账号删除 | 固化 `LocalDeviceData v1`：完整 ZIP 在 `library.json` 之外增加 `device-data.json`、`pictograms.json`、`categories.json`、`expressions.json`；私人清除只删除个人换图和 `device-private` 运行图符；全部清除覆盖平台存储及应用已知物理文件，两个清除范围都需二次确认 | 原图库 ZIP 故意不含沟通历史，历史 TXT 又不能恢复图片、许可、修正和草稿；只重命名旧按钮会形成虚假闭环。共享清单与平台端口可以同时保证数据范围、失败语义和 Web/微信一致性 | `仅 Issue`：已在线核验完整正文，原 MVP 没有可直接复用的完整设备级闭环 | `已验证（代码/测试/build/生产浏览器 E2E）`：照护管理新增本机数据页签；可导出完整 ZIP、只清私人图片、清 IndexedDB/localStorage/sessionStorage 并成功后刷新；完整 ZIP 的六类沟通数据已在桌面、手机竖屏和手机横屏生产构建中完成恢复、身份重绑定与刷新持久化 | `已验证（代码/测试/build；真机待验收）`：复用低频 backup 分包；ZIP 分享、私图物理文件删除、全部微信 storage/保存文件/图库目录/备份文件清除和成功后重启已接线 | `localDeviceData.js`、浏览器/Taro ports、两端 ZIP service/UI；CBoard 聚焦 `5 suites / 25 tests / 3 snapshots`、production build、Playwright `3/3`；微信备份服务/端口 `2 files / 22 tests`、TypeScript、ESLint 与 production build | 仅当前浏览器或当前微信小程序设备；不删除云端账号/同步数据，不做选择性单条删除或删除审计。Web 原生文件选择人工操作、微信真机文件分享、取消、重启与清除范围仍需人工验收 |
| [#74](https://github.com/picinterpreter/picinterpreter/issues/74) | 评估 AI 生成 AAC 图卡的可理解性、风格一致性、许可与披露路径 | 继续禁止患者自动触发和自动采用；仅允许登录照护者为持久缺词显式生成，在预览中披露 provider/model、声明设备私有和供应商条款，确认后才进入本机词图。公共图源 normalizer 仍拒绝 `ai`/`ai-generated` 冒充许可图库 | AI 图像可能语义不透明、风格漂移或许可不清；技术生成闭环只能支持受控试验，不能证明患者理解度，也不能把模型输出转换成公共许可素材 | `仅研究`：issue 原文没有生产生图闭环 | `部分已验证（工程边界）`：服务端 AAC prompt、鉴权/配额/用量、有界 PNG、Web 预览确认和设备私有 attribution 已完成 | `部分已验证（工程边界）`：同一纯核心、Taro AI port、USER_DATA_PATH 保存、预览确认和取消/失败清理完成；未使用真实模型或真机做理解研究 | issue #74、CBoard AI Engine prompt、`communicationPictogramGenerationProvider.js`、`pictogramAttribution.js`、`runtimePictogram.js`、两端 MissingTokenQueue；API `58 passing`、Web `112 tests`、微信 `333 tests` 与双端 production build | 已具备“可安全开展照护者受控试验”的工程底座，不等于完成 #74 研究结论。真实供应商条款、成本、偏差、风格一致性、代表性患者理解率、错误图处置和是否允许跨设备备份仍需研究；公共上传与患者自动生图继续禁止 |
| [#75](https://github.com/picinterpreter/picinterpreter/issues/75) | 建立 AAC 参考资料库存 | 保留为研究入口，不伪装成功能实现 | 来源、许可和证据需要可追溯 | `已验证（文档）` | `不适用` | `不适用` | `aac-reference-inventory.md` 标记 closes #75 | 研究治理；新增来源继续回填原文档 |
| [#83](https://github.com/picinterpreter/picinterpreter/issues/83) | 固定人工顺序默认显示，可切换常用优先，并独立持久化人工顺序与实际点击次数 | 排序与计数进入平台无关本地事件契约；导航文件夹保持原位置。CBoard 固定顺序继续复用原生 Board 编辑和布局持久化，小程序用照护设置中的板块选择与上移/下移保存本地覆盖；常用优先按成功点选次数降序、人工顺序并列兜底 | 患者需要稳定空间记忆，照护者又可能需要高频入口；复用 CBoard 原生布局可避免第二套 Web 编辑器，独立事件 storage 可防止点击统计污染 Board、TileDTO、matcher 或云同步 | `已验证（原 MVP）`：Dexie `usageCount/manualOrder`、固定/常用切换、人工调整和点击计数均有代码与单测 | `已验证（代码与自动化）`：默认复用 Board 顺序，解锁后原生编辑；患者实际点图计数，常用优先不移动文件夹，编辑态强制固定顺序，偏好变更即时生效 | `已验证（官方模拟器运行态）`：真实照护设置完成逐板人工下移，患者点图计数、固定/常用切换、导航文件夹原位、两次页面重建和微信 storage 恢复全部通过 | 原 `pictogram-order.ts`/`PictogramGrid`/`SettingsDrawer`；共享 `pictogramOrdering.js`/store；CBoard `63/421/3 snapshots`；微信官方 Skill 排序 E2E PASS、`76 files / 339 tests`、质量门 `7/7`、production build | CBoard Web 与微信本机排序闭环；人工顺序和计数不进入账号云同步，不改变 matcher/relatedTerms。微信模拟器运行门已完成，物理手机触控仍待真机验收；未预览、上传或发布 |

| [#18](https://github.com/picinterpreter/picinterpreter/issues/18) | 患者确认句可异步分享为文字；接收端按确认顺序合成一张可读长图并分享，保留图片来源许可且不打断当前沟通 | 固化 `CommunicationShare contract v1`：文字只取当前选中句；接收文档最多 40 项、保持顺序并汇总逐图署名。Web 优先系统分享，能力不足时下载 TXT/PNG；微信文字复制到剪贴板供用户粘贴，图片使用原生 `showShareImageMenu` | 分享是沟通后的可选动作，不能触发朗读、清空、关闭或历史副作用；纯文档/布局/Canvas 核心可避免 Web 与微信重复实现和顺序漂移 | `仅 Issue/文档`：已核验完整正文，未找到可直接复用的原 MVP 运行闭环 | `已验证（production Web Share API 边界；真实系统面板待验收）`：三视口表达与接收入口、当前句文字载荷、正式 Canvas PNG/File、非零字节及无沟通副作用均通过；下载回退、等比图片、失败占位和许可页脚继续由既有自动化覆盖 | `已验证（代码/测试/build；真机待验收）`：表达复制分享、接收长图原生分享完成；取消或单图失败不清空当前现场 | 共享核心与浏览器 adapter；CBoard 全仓 `203 suites / 1404 tests / 72 snapshots`、production build、分享三视口 `3/3`、核心合并 `12/12`；微信 `37 files / 128 tests`、TypeScript、ESLint、`114 app / 26 core`、production gate | CBoard Web API 交付载荷已验证且不新增上传、账号、API、插件、依赖或媒体；iOS Safari、Android Chrome、微信真机实际系统分享面板、目标应用兼容性和可读性仍待物理设备验收 |

## B. 接收端 P0/P1 实施 issue

| Issue | 意图 | 决策 | 理由 | 原实现 | CBoard Web | 微信 PoC | 证据 | 生效范围 / 下一步 |
|---|---|---|---|---|---|---|---|---|
| [#57](https://github.com/picinterpreter/picinterpreter/issues/57) | 接收记录、纠错、缺词和隐私所需本地 schema | 在 CBoard 目标中映射为版本化独立 repository keys，不复制 Dexie 表 | 迁移目标使用 storage port，需保留语义而非数据库品牌 | `未开始`：原有 Dexie v6 无目标表/字段 | `已验证（接收数据）`：records/corrections/missing tokens/identity/schema v1 已有 | `已验证（接收数据）`：同一 schema 经微信 adapter 可恢复和升级 | lifecycle、missing-token 与 migration repository tests | 接收本地持久化完成；设备私图隔离由“隐私分层”决策跟踪，完整图库 ZIP 备份由真实 issue #24 跟踪 |
| [#58](https://github.com/picinterpreter/picinterpreter/issues/58) | 验证全新安装、旧版升级和数据不丢失 | 对 neutral repository 验证 fresh、旧快照、损坏值、重复启动和未来版本 | 迁移必须针对实际生产底座，并证明旧数据不丢失、旧客户端不降级写穿 | `未开始` | `已验证`：4 类迁移/修复/保护测试完成 | `已验证`：未版本化微信对象/数组快照升级且幂等 | `repository.migration.test.js`、微信 migration test、37/141 Web 与 7/19 微信回归 | Web localStorage/微信 storage；不新增 IndexedDB 或云迁移 |
| [#59](https://github.com/picinterpreter/picinterpreter/issues/59) | 服务端保存已确认接收字段 | 新增独立 `CommunicationReceiverRecord` 与同步/删除路由，只接收白名单内的 confirmed receive；草稿和私有维护字段在 Swagger 边界拒绝 | Settings 适合轻量设置，不适合作为事件数据库；专用模型才能约束容量、身份、删除和未来演进 | `未开始`：原 Prisma 无目标字段 | `已验证`：确认后立即同步、登录合并、显式上传/下载和删除 tombstone 已接入 | `已验证（代码门）`：同一事件 API 经 CBoardAccountPort 工作 | API controller/model/Swagger、Web/微信 sync tests、API `24 passing` | `cboard-api`、CBoard Web 和微信 PoC；不上传 draft、correction、missing token 或未完成记录 |
| [#60](https://github.com/picinterpreter/picinterpreter/issues/60) | 每个接收会话一个活动草稿，全屏后确认 | 匹配创建草稿、编辑覆盖同一草稿、全屏确认；确认后再编辑自动新建草稿，并归入统一活动 session | 已确认历史应不可变，草稿可更新且会话归属必须稳定 | `未开始` | `已验证`：两阶段状态机、统一 session 和手动换新入口均完成 | `已验证`：同一状态机、session 与微信 storage 均通过测试/构建 | `receiverLifecycle.js`、`conversationSession.js`、两端 UI/repository tests | Web/微信接收闭环；草稿仍只在本机，不进入可见历史 |
| [#61](https://github.com/picinterpreter/picinterpreter/issues/61) | 家属查看、忽略、解决缺图项 | 队列显示次数与原句；可忽略/恢复，或关联当前 CBoard Tile 并在后续匹配中复用 | 状态标签本身不能解决缺图，真实 Tile 关联才形成可验收闭环 | `未开始` | `已验证`：接收页队列、审核、搜索关联与自动回放已完成 | `已验证`：接收页队列、微信 storage 审核与自动回放已完成 | `MissingTokenQueue.component.js/.tsx`、`missingTokens.test.js`、36/137 Web 与 6/18 微信回归 | 仅照护者接收模式和本机数据；不暴露患者端技术错误，不云同步 |
| [#62](https://github.com/picinterpreter/picinterpreter/issues/62) | 接收管线把未匹配 token 写入本地记录 | 复用 receiver identity/storage，按规范化 token 聚合次数、场景和最多 5 条原句 | 形成可维护词库证据，同时不阻断患者沟通 | `未开始` | `已实现`：管线后本地写入，失败不阻断 review | `已实现`：同一 repository 经微信 storage 可恢复 | `missingTokens.test.js`、两端 repository tests、36/137 Web 与 6/18 微信回归 | 共享核心/Web/微信；现由 #61 队列消费 |
| [#63](https://github.com/picinterpreter/picinterpreter/issues/63) | 已确认接收轮次进入历史与 LLM 上下文 | 只纳入同 session 的表达与 confirmed 接收；上下文按长度限界后交给可选 AI 句子生成，draft/纠错/缺词永不进入 | 历史展示、上下文数据边界和 AI 调用必须分别受约束，网络失败时仍保留本地表达 | `部分`：Expression 类型支持 receive，但保存链不足 | `已验证`：本地历史、会话上下文、OpenAI-compatible/Azure 配置和可选 AI 句子候选已串联 | `已验证（代码与降级门）`：同一上下文经 CommunicationAiPort 工作；无 API 时官方模拟器明确回落本地规则 | `buildConversationContext`、`communicationAi.js`、`communicationAiProvider.js`、`ExpressionWorkspace.tsx`、相关测试 | Web/微信表达增强；AI 只产生候选，不自动替用户发送；真实模型调用待部署验收 |
| [#64](https://github.com/picinterpreter/picinterpreter/issues/64) | 记录替换、删除、排序、插入和重分词事件 | 根据人工复核前后状态生成 replace/delete/reorder/insert/resegment 五类本地纠错事件 | 只记录真实发生的编辑，同时完整保留人工修正对词库和后续质量分析的证据 | `未开始` | `已验证`：五类 UI/事件、本地持久化、完整 `pictogramIdsBefore/After` 与人工来源均通过 | `已验证（官方 Skill）`：默认板“后加图片”真实点按，复核/预览 1→2、索引、完整 ID 数组、非学习审计和 `manual` 草稿来源均通过 | `receiverPipeline.js`、`receiverLifecycle.js`、Web/微信 tests/build、官方 Skill、13 项 storage 恢复 | Web/微信本地维护日志；纠错不进入普通历史和云同步，手机插入触控仍由 #67 验收 |
| [#65](https://github.com/picinterpreter/picinterpreter/issues/65) | 验证离线 app shell、图库、表达、接收和历史 | 构建通过只是前置条件，仍需离线运行验收 | “可编译”不能证明“断网可沟通” | `未完成` | `已验证（桌面 PWA 生产门）`：拦截外网并切换 offline 后，app shell、默认板匹配、接收全屏、患者表达、新对话和双向历史刷新恢复通过 | `部分（官方模拟器离线状态闭环；真机断网待验收）`：复用完整本地图包、纯核心和微信 storage；官方 `getNetworkType=none` 运行门已完成患者表达、照护接收、隔离全屏、双向历史及 `reLaunch` 恢复 | Service Worker 时序单测、`tests/offline`、微信网络状态端口、`test:e2e:weapp:offline`、官方 Skill、微信验收清单 | Web 自动门与微信官方模拟器门已完成；物理真机系统级断网仍由 #67 跟踪 |
| [#66](https://github.com/picinterpreter/picinterpreter/issues/66) | 照护者侧显示离线/降级能力 | 在线补图和 AI 明确显示可用、无结果或失败状态；微信额外监听真实网络，只在照护者工具和接收页显示离线能力边界 | 可选网络增强已经接入，照护者需要知道当前结果来自本地还是在线以及失败是否影响沟通 | `未开始` | `已验证`：CBoard Web 设置页可检测 AI；缺词队列、AI 候选和在线补图均有降级状态 | `部分（官方模拟器离线状态已验证）`：AI 未配置降级与网络离线提示均通过官方 Skill；患者首屏不显示技术状态，照护工具和接收页显示“当前为离线模式”；图片搜索继续区分 API、ARASAAC 与双通道失败。真实断网和外网请求仍待设备验收 | `NetworkStatusNotice.tsx`、`fallbackPictogramSearchPort.ts`、网络/图片搜索测试、production build、`test:e2e:weapp:offline` | Web/微信照护者 UI；不在患者首屏暴露技术错误，不误报未知状态，不返回密钥，不把模拟离线写成真实断网通过 |
| [#67](https://github.com/picinterpreter/picinterpreter/issues/67) | 真机验收触控、TTS、全屏、横竖屏、离线和错误 | Web 与微信使用各自清单，不用桌面浏览器或模拟器代替真机 | 平台权限、缓存、图片编码和布局差异只能在设备上确认 | `未完成（实现已就绪）` | `部分（自动化已验证，物理设备未完成）`：桌面、Pixel 5 竖屏 tap、Pixel 5 横屏 tap 的生产断网闭环 `3 passed`；真实手机浏览器触控、旋转、权限和缓存仍未验收 | `部分（当前最新预览已后台推送）`：TTS/ASR 已由用户确认正常；个人图片真实微信文件生命周期已在官方 Skill 通过。当前预览包含图卡加载失败词语降级、775 张默认图主包单份共享、统一显示/朗读/导航板名、272 个中文键校正、账号私有图库和标准 OBF/OBZ 导入；首次上传发现 Taro `sub-common` WXSS 被未使用文件优化误过滤，按官方 `packOptions.include` 修复后无窗口 `auto_preview` 成功 | Web production offline E2E、speech/recognition tests、44 boards / 825 tiles / 775 PNG；微信 `58 files / 245 tests`、类型、Lint、`169 app / 29 core`、production build/产物门；官方 Skill 实际上传 main `1,275,066 B`、总包 `2,892,081 B` | 在手机复测主包默认图、餐具/紧急图显示与朗读、板块入口名称、损坏图词语降级、纠错记忆、后加图片、个人选图、私有图库、OBF/OBZ、分包启动、旋转、断网和错误恢复；预览成功不代替真机结果。后续操作继续不得置顶、聚焦或抢占输入 |
| [#68](https://github.com/picinterpreter/picinterpreter/issues/68) | 自动化表达和接收核心流程 | 单测覆盖纯核心与适配器，官方 Skill 验证平台 UI，真机只验证平台特有能力 | 分层测试比把网络、AI 和麦克风全部塞进单一 E2E 更稳定且可归因 | `部分` | `已验证（Web gate）`：Communication Support `52 suites / 375 tests / 1 snapshot` 与 production build 通过 | `已验证（官方 Skill gate）`：`25 files / 102 tests`、TypeScript、ESLint、`83 app / 21 core`、逐包性能门和 production build；官方 Skill 通过全部既有沟通链及账号登录/合并/退出/隐私边界，13 项 storage 精确恢复 | 2026-07-19 当前测试、构建、包体、API confirmed receive `13 passing` 与官方 Skill 运行结果 | 自动化核心/storage/adapter/性能门已完成；真实账号服务、AI、图片网络和设备能力继续由 #67 验收 |

## 当前开发顺序

1. `#67` 微信侧：当前最新预览已包含默认图片主包共享、中文显示/朗读、272 个中文审阅键、账号私有图库和标准 OBF/OBZ 导入；后续不再为了例行构建自动重推，只在确有新增真机验收内容且不会置顶、聚焦或抢占输入时推送。手机仍需复测纠错学习开关、同 workspace 再次匹配、“后加图片”、自动进入患者分包、接收页往返、静态监听状态、8 张紧急图、餐具四图和相册/相机个人图片选择/恢复。预览生成成功不能代替逐项真机结论。
2. `#8/#67`：部署包含 OpenSymbols PNG 归一化的 `cboard-api`，配置真实 OpenSymbols 凭据、公众平台 request/downloadFile 合法域名，再用“厕所”等缺词验收真实候选、人工确认、本地缓存和 SVG/WebP 来源图的真机显示。
3. `#10/#19/#65`：部署并验收公开只读 bundle 与受限图片端点，在 Web 与微信家属“图片库维护”中验证搜索、原子离线导入、失败后显式网络回退、重复导入、私有子板隔离、许可证未知提示、手机重启恢复和真实断网显示。该能力只消费 CBoard 公开图板，不代表公开图库贡献、任意外链代理或上传已完成。
4. `#30`：JSON/OBF/OBZ/AsTeRICS GRD/Gridset/Snap/TouchChat 已形成代码级跨端导入闭环；TouchChat `Images.c4s` 自定义 PNG/JPEG 已通过复用 Bravo AAC 的 Apache-2.0 关联算法补齐，公开 WordPower 样本的 `348` 板面、`11,953` 按钮也已完成有界转换和跨端容量验证。下一步处理压缩/专有图像载荷、真实部署 API 与真机文件选择/双槽恢复验收，继续不自行反向工程未公开格式。
5. `#65/#67`：继续按清单验证触控、全屏、横竖屏、系统断网、错误恢复和隐私；模拟器不能替代这些真机结论。

## 变动 2：接收端两阶段记录与纠错日志

- **意图：** 落实 ADR-001 与 #26/#60/#64，不再把“生成图片”“发送输出”和“患者已经看过”当成同一事件。
- **决策：** 共享核心新增 draft/confirmed 生命周期、稳定匿名 patient/workspace identity 和 replace/delete/reorder correction；Web 与微信均在匹配后写草稿、编辑时覆盖草稿并记日志、全屏展示时确认并进入普通历史。
- **理由：** 普通历史只应展示真正用于沟通的确认记录；草稿和纠错对调试、词库维护有价值，但隐私敏感且不应默认同步。
- **证据：** CBoard `receiverLifecycle.test.js`、`repository.receiverLifecycle.test.js`、两个 Web 组件测试共 `4 suites / 14 tests`；微信 TypeScript、边界扫描及 `5 files / 15 tests` 通过。
- **生效范围：** `src/common/communicationSupport`、CBoard Web Communication Support、微信 PoC；不写 CBoard API、不进入 Settings、不改变原 CBoard Board/Tile 模型。

## 变动 3：未匹配 token 本地证据链

- **意图：** 落实 ADR-001 与 #19/#57/#62，使未匹配词不再随着一次接收交互结束而消失。
- **决策：** 共享核心新增 `MissingTokenRecord` 聚合函数和独立 repository key；Web 与微信在本地 matcher 返回未匹配项后写入 `normalizedToken`、次数、场景、最多 5 条原句及匿名 identity；数据不进入 Settings/API。
- **理由：** 照护者维护队列必须建立在可恢复证据上，同时缺词记录属于隐私敏感维护数据，写入失败不能阻断接收、纠错或全屏展示。
- **证据：** CBoard 定向 `3 suites / 11 tests`、扩展回归 `35 suites / 129 tests / 3 snapshots`、相关 ESLint 与生产 build 通过；微信 TypeScript、ESLint、边界扫描（`24 app / 17 core`）、`6 files / 16 tests` 与 Taro production build 通过。
- **生效范围：** CBoard 共享 repository、Web 接收 UI、微信接收 UI 与微信 storage adapter；该持久化切片当时不实现 #61 UI，现由变动 4 补齐；仍不新增患者端错误提示或云同步。

## 变动 4：照护者缺图维护闭环

- **意图：** 落实 #19/#61，把已经持久化的词汇缺口变成照护者能处理、且能改善下一次接收结果的闭环。
- **决策：** 共享核心增加缺词审核状态转换和人工关联回放；Web 与微信均在照护者接收模式展示队列，支持查看证据、忽略、恢复和关联现有 CBoard Tile；关联失效时安全回退未匹配。
- **理由：** “已解决”标签若不改变匹配结果只是形式完成；复用真实 CBoard Tile 能维持单一板/图卡体系，也避免在迁移期自研第二图库。
- **证据：** Web `36 suites / 137 tests / 3 snapshots`、相关 ESLint 与生产 build 通过；微信 TypeScript、ESLint、`25 app / 17 core` 边界、`6 files / 18 tests` 与 Taro production build 通过。
- **生效范围：** 共享 missing-token/repository/receiver pipeline、CBoard Web 接收页、微信接收页和本机 storage；不影响患者表达，不新增 API、云同步、自定义上传、在线补图或 AI。

## 变动 5：中性 repository schema v1 与升级保护

- **意图：** 落实 #35/#57/#58，使接收草稿、纠错、缺词和匿名身份在 Web 与微信升级时可恢复、可修复且不会被旧客户端降级覆盖。
- **决策：** repository 创建时执行 schema v1 幂等迁移；合并未版本化中性键与 Tuyujia 兼容键，规范化各类数组并保留合法 identity；损坏值只记录修复键名，未来版本只读并拒绝写穿。
- **理由：** CBoard 目标没有使用图语家 Dexie，迁移应针对真实 storage port；同时隐私数据不能为了“备份损坏值”再复制一份原文。
- **证据：** Web migration `1 suite / 4 tests`、聚合 `37 suites / 141 tests / 3 snapshots`、ESLint 与 production build 通过；微信 TypeScript、ESLint、`26 app / 17 core` 边界、`7 files / 19 tests` 与 production build 通过。
- **生效范围：** CBoard Communication Support repository、浏览器 storage 与微信 storage adapter；不修改原 Dexie、API、Settings 云同步或自定义图符 scope。

## 变动 6：统一双向会话与确认上下文契约

- **意图：** 落实 #31/#60/#63，使患者表达、照护者接收草稿和已确认接收结果具有同一可追溯会话边界。
- **决策：** 共享核心新增 conversation session v1；repository 自动为表达和接收分配同一活动 session，30 分钟无操作或手动“新对话”时换新。Web 与微信重置当前工作区但保留历史；上下文只返回当前 session 的表达和 confirmed 接收，排除 draft、纠错和缺词。
- **理由：** 跨方向 session 是对话上下文的前提；未确认草稿和照护者维护证据不能被误当成已发生沟通。先提供纯本地可选契约可保持离线优先，也不迫使当前 PoC 引入 LLM 或网络依赖。
- **证据：** Web 会话/迁移/组件定向 `5 suites / 20 tests`，聚合 `39 suites / 147 tests / 3 snapshots`、相关 ESLint 与整站 production build 通过；微信 TypeScript、ESLint、`26 app / 18 core` 边界、`7 files / 21 tests` 与 Taro production build 通过。
- **生效范围：** CBoard 共享核心、Web Communication Support、微信 PoC 和本机 storage；不新增 API、云同步、登录、LLM 调用或原图语家 Dexie 写入。已确认历史仍沿用既有 Settings 策略，上下文函数本身不联网。

## 变动 7：Web 生产离线自动化门

- **意图：** 落实 #32/#33/#65/#68，补上“生产构建在真实断网后仍能双向沟通”的运行证据。
- **决策：** CBoard 新增独立 build 静态服务器和 offline Playwright 配置；阻断所有非本机 HTTP 请求，等待真实 Service Worker 控制页面后切换浏览器 offline，覆盖默认板 matcher、接收全屏确认、患者表达、同 session 双向历史、新对话和再次刷新。修复页面已 load 后才调用注册函数时 Service Worker 永不注册的既有时序缺口。
- **理由：** 原本的登录/API Playwright、jsdom 和 production build 都不能证明 PWA 已缓存并能断网运行；首轮 E2E 在 `navigator.serviceWorker.ready` 超时，提供了该缺口的直接运行证据。
- **证据：** Service Worker 时序 `2 tests`、Web 定向 `40 suites / 149 tests / 3 snapshots`、production build 与 `977 resources / 41.1 MB` 预缓存通过；最终 `npm run test:e2e:offline` 为 `1 passed`，核心流程 `5.3s`。
- **生效范围：** CBoard Web 生产 PWA 与本机自动化 gate；不改变业务 matcher/repository/API，不加入登录、云同步、AI、麦克风或支付，也不替代微信开发者工具和真机验收。

## 变动 8：微信开发者工具 UI/storage 自动化前置门

- **意图：** 落实 #33/#65/#68，在真机前先用真实微信 WXML 事件证明患者表达、照护者接收、独立结果页和本地恢复可以串成闭环。
- **决策：** 微信 PoC 引入测试专用 `miniprogram-automator 0.12.1`；脚本清空 storage 后按稳定文案点选“我想要 / 喝 / 水”，保存并重启恢复，再生成“想喝水”、进入只含结果的展示页、返回验证双向历史、新建对话并再次重启。Windows 启动使用开发者工具自带 Node/CLI；进程内只替换 CLI 硬编码 `3799` 桥接端口。普通命令不自动开启 IDE 服务端口，显式一次性入口才可接受官方安全确认。
- **理由：** fixture 下标易随图卡扩展误报，真实文案和页面 class 更接近用户操作；本机 `3799` 位于 TCP 排除区间 `3720-3819`，但修改系统端口或安装文件风险更高。IDE 服务端口属于持久化安全设置，必须获得用户明确授权，不能把脚本就绪写成运行通过。
- **证据：** Node 语法、TypeScript、ESLint、`7 files / 21 tests`、`26 app / 18 core` 边界和 Taro production build 通过；CLI 已从 `listen EACCES 127.0.0.1:3799` 推进到官方 `IDE service port disabled` 确认。`docs/微信开发者工具与真机验收清单.md` 已记录自动化与真机步骤；当前 UI E2E 未进入页面，状态仍为部分。
- **生效范围：** 微信 PoC 的本地 devDependency、测试脚本和验收文档；不进入 runtime bundle，不修改 CBoard Web 业务语义，不调用 preview/upload，不改变系统端口或微信安装文件，也不替代 #67 真机验收。

## 变动 9：完整板树、微信 TTS 与官方 Skill 验收回填

- **意图：** 让微信版本不再停留在演示 fixture，并补齐原图语家核心闭环所需的图卡浏览、表达朗读和接收结果朗读，同时如实记录平台授权边界。
- **决策：** 将 CBoard 默认内容转换为版本化 BoardDTO/TileDTO v1 包，微信患者端与接收端共用同一纯核心；TTS 拆成平台无关 speech port 和 Taro/WechatSI adapter，默认无插件构建保持可用，获授权后再显式启用插件构建。
- **理由：** 完整复用 CBoard 内容可以避免维护第二套图库；纯端口可单测且不把 Taro 带入共享核心；条件插件声明可防止未获授权的 AppID 整个模拟器启动失败。
- **证据：** 44 块板、825 张图卡、775 张去重 WebP；9 files / 35 tests；32 app / 18 core 边界检查；默认 production 包 1.870 MiB；官方 Skill 已完成患者表达、接收全屏、双向历史、storage 恢复和 TTS/ASR 降级验收。正式 AppID 已添加插件，插件版 production build、兼容语法 gate 与 `auto_preview` 均成功。
- **生效范围：** 微信 PoC 的默认板包、Board/Tile 纯契约、表达与接收 UI、speech port、Taro adapter、构建配置和验收文档；不新增登录、云同步、AI、完整编辑器、自定义上传或支付，也不把模拟器结果替代为真机通过。

## 变动 10：照护者语音输入核心回填

- **意图：** 补齐原图语家 README 明确列出的“照护者输入文字或语音，再转换成图片序列”核心能力，避免迁移后只剩手动打字。
- **决策：** 微信新增平台无关 RecognitionPort 和 Taro/WechatSI adapter；识别中间文字回填输入框，最终文字自动复用既有分词、matcher、复核、草稿和历史链。默认无插件构建禁用录音入口但保留文字兜底，插件版才声明 WechatSI 与 `scope.record`。
- **理由：** ASR 是输入方式，不应复制第二套图片匹配逻辑；端口隔离可以测试停止、取消、错误和超时，也能防止插件授权失败拖垮本地图片沟通。
- **证据：** ASR `6/6`、完整微信回归 `9 files / 35 tests`、TypeScript、ESLint、`32 app / 18 core` 边界和默认/插件 production build 均通过。授权后语音入口可在模拟器启动/停止，文字“想喝水”仍为 `3/3`；插件版产物含录音权限用途说明并已成功推送手机预览。
- **生效范围：** 微信接收模式、WechatSI 语音识别 adapter、录音权限说明和自动化稳定 ID；不修改 CBoard Web Speech API、共享 matcher、云端 ASR、登录或同步，也不把模拟器 UI 结果写成真机识别通过。

## 变动 11：WechatSI 授权与真机预览前置完成

- **意图：** 把 TTS/ASR 从“代码和构建已完成、账号未授权”推进到“正式 AppID 可进入手机验收”。
- **决策：** 由账号管理员在“账号设置 → 第三方设置 → 插件管理”添加 WechatSI，无需先发布；Taro 插件声明继续由环境开关控制，重建后只清编译与项目文件列表缓存。
- **理由：** 插件授权是账号外部状态，不能用代码绕过；预览仍引用已删除可选链则是开发者工具缓存，不能误归因给 matcher 或语音端口。
- **证据：** `app.json` 含 WechatSI 0.3.4 与 `scope.record`；输出兼容检查通过；定向清缓存后 `auto_preview` 成功，最新包 628057 bytes；TTS 新增缺省 `retcode` 回归后 `9 files / 35 tests` 通过。
- **生效范围：** 图语家微信 PoC 的正式 AppID、插件构建、开发者工具和手机预览；不发布、不上传体验版，也不把预览推送成功等同于真机 TTS/ASR 已验收。

## 变动 12：微信真机图卡编码与内容指纹

- **意图：** 把真机“语音与分词正常但图片不显示”的问题从 matcher 层剥离，并修复部分线条图持续不可见。
- **决策：** 微信完整默认图库改为 96×96、32 色白底 PNG8，强制加入预览包；构建门禁拒绝可疑小文件；输出文件名包含源 SVG 内容与转换版本指纹。
- **理由：** 首轮 WebP 在手机全部不可见；PNG 恢复大部分后，线条 SVG 被定位为 117 B 透明空图；白底修复后同名路径仍命中手机缓存，必须由内容指纹生成新 URL。
- **证据：** 本地逐张确认水、叉子、刀、勺子、碗图案正常；775 张图无小于 200 B 文件；旧路径不再存在；9 files / 35 tests、TypeScript、ESLint、边界扫描、WechatSI production build 均通过；指纹版预览包为 1,580,386 B 并成功推送。
- **生效范围：** CBoard 微信 PoC 的图卡生成、构建门禁和真机预览；不修改 CBoard 原 SVG、共享 matcher、Web、API、登录、云同步或 AI。手机最终显示以最新预览复测为准。
- **记录：** Codex（GPT-5），2026-07-17 18:23:32。

## 变动 13：Web 与微信功能补齐到同一中性核心

- **意图：** 避免迁移后只保留演示闭环，把原图语家已经验证的历史管理、常用语、无障碍、紧急沟通、AI 候选和缺词在线补图接入 CBoard Web 与微信。
- **决策：** 所有业务规则继续放在 `src/common/communicationSupport` 中；Web 使用现有 React/Material UI 外壳，微信使用 Taro/React 18 外壳；在线与 AI 通过平台 port 调用 `cboard-api`，失败时保留本地确定性结果。
- **理由：** 共享纯核心可以避免两端分词、纠错和隐私边界再次分叉，同时完整复用 CBoard Board/Tile、登录和设置体系，不搬运 React DOM 到小程序。
- **证据：** Web 沟通范围 `43 suites / 203 tests / 1 snapshot` 与本轮 production build 通过；微信 TypeScript、ESLint、`17 files / 65 tests`、44 板/825 图卡/775 图片 production build 通过；API AI、补图和接收记录共 `24 passing`。
- **生效范围：** CBoard Web fork、Taro 微信 PoC、共享 communicationSupport 纯核心和 `cboard-api` 可选增强接口；不改变上游 CBoard Board/Tile 基础模型，不让在线失败阻断本地沟通。

## 变动 14：已确认接收事件独立同步与删除 tombstone

- **意图：** 补齐账号跨设备接收历史，同时防止把草稿、纠错和缺词私有数据塞进 Settings，也防止旧离线设备复活已删除记录。
- **决策：** `cboard-api` 新增白名单化 `CommunicationReceiverRecord`、同步路由和删除路由；只同步 `direction=receive`、`recordStatus=confirmed` 且图片序列完整的记录。删除写 `deletedAt` tombstone，Web 与微信合并时从 repository 和可见历史同时移除对应 ID。
- **理由：** Settings 不是事件数据库；物理删除无法阻止持有旧副本的设备再次上传，而 tombstone 可以跨设备传播删除意图。
- **证据：** API controller/Swagger route 覆盖草稿拒绝、私有字段拒绝、批量上限、确认 upsert 和 tombstone，共同回归 `24 passing`；Web `receiverSync`、主面板/Settings 同步测试及微信 `communicationCloudSync`、`CboardAccountPort` 测试均通过。
- **生效范围：** `cboard-api`、CBoard Web 登录态、微信登录态和本地 repository；guest 仍完全本地，草稿/纠错/缺词不上传，旧 `tuyujia` Settings 只保留读兼容。

## 变动 15：Board 感知分词合并与官方模拟器验收

- **意图：** 修复“我想喝水”被拆为“我 / 想 / 喝 / 水”后，“我”无图而“想”错误借用“我想”图卡的质量倒退。
- **决策：** 仅在自动分词路径中，当当前 token 未匹配且与下一 token 合并后能精确/同义命中现有 CBoard 图卡时保守合并；人工编辑的 `preSegmented` 结果保持原样，不被系统再次改写。
- **理由：** 默认 CBoard 已有“我想”复合图卡，利用实际板内容比扩张通用词典更准确；只合并“未匹配 + 可验证命中”可避免吞并正常词，并保留照护者最终修正权。
- **证据：** `symbolMatching.test.js` `17/17`、receiver pipeline `5/5`、ReceiverLoopPanel `5/5`；Web 完整沟通回归 `43/203/1`；微信 `17/65` 和 production build 通过。官方 Skill 实测分词值 `我想 / 喝 / 水`、3 个图片节点、0 个未匹配节点，Console `grep -i error` 为空。
- **生效范围：** Web 与微信共享自动 matcher；不改变手工分词、原始 CBoard 板数据、图卡标签、在线补图、AI 决策或 API。
- **记录：** Codex（GPT-5），2026-07-18 08:47:37。

## 变动 16：正式 AppID 固化、WechatSI 生产启用与紧急图卡闭环

- **意图：** 修复手机预览仍提示“未启用微信语音插件”以及紧急求助页只有文字、没有任何图片的问题，并防止后续构建再次退回临时配置。
- **决策：** 生产环境固定启用 WechatSI `0.3.4`；项目从 `touristappid` 切换为当前账号可管理的正式“图语家”AppID `wx02246603dc9a960c`。紧急页按稳定短语 ID 复用 6 张已打包 CBoard 图卡，并离线打包 CBoard `need_toilet` 与图语家既有 ARASAAC `37183` 两张专用图卡；未知映射明确显示“缺少图卡”而不静默空白。
- **理由：** 上一版只在临时命令行启用插件，生产 `.env` 与 `dist/app.json` 都没有插件声明；同时 `project.config.json` 使用游客 AppID，即使公众平台已添加插件也无法生效。紧急页源码原本完全没有 `<Image>`，因此不是网络或缓存导致“图片没显示”，而是功能未实现。离线资产可避免紧急沟通依赖第三方网络，复用 CBoard Tile ID 可避免维护第二套图库。
- **证据：** 微信完整回归 `18 files / 68 tests`、TypeScript、ESLint 和 production build 通过；产物含 WechatSI provider `wx069ba97219f66d99`、`scope.record`、正式 AppID、775 张 CBoard 图及 3 个紧急资源文件。官方 Skill 定向清理旧编译缓存后实测紧急页 `8` 个图片节点、`0` 个缺图提示，点击“帮帮我”返回“朗读完成”，Console 对 `error / fail / plugin` 检索为空；`auto_preview` 成功推送 `1,677,721` 字节预览包。
- **生效范围：** 图语家微信 PoC 的生产配置、正式 AppID、紧急求助 UI、离线资源、打包门禁和手机预览；不发布体验版，不修改 CBoard 原图，不配置或伪造 AI 后端。手机最终视觉显示仍以用户打开本次最新预览复测为准。
- **记录：** Codex（GPT-5），2026-07-18 09:39:30。

## 变动 17：个人熟悉图片跨端私有覆盖

- **意图：** 落实原图语家“优先患者熟悉图片、删除后回退通用图符”的原则，同时继续把 CBoard 默认板作为唯一公共内容底座。
- **决策：** 新增平台无关个人图片偏好核心，以 Board/Tile ID 和患者/工作区身份保存设备私有覆盖；CBoard Web 复用现有图片输入和压缩，小程序复用微信媒体选择与持久文件。覆盖只作用于显示和沟通输出，不修改默认 Tile，不进入 Settings、接收事件或云同步。
- **理由：** 熟悉照片能提高语义理解，但家庭照片具有高隐私风险；如果直接写回 CBoard Board 或 Settings，可能随整板或账号同步意外上传。显示层覆盖兼顾完整复用、隐私和可逆性。
- **证据：** 共享核心/repository schema v3 覆盖独立 key、身份隔离、保存、删除和默认回退；Web 个人图片管理器、主板与输出显示覆盖测试通过；微信完整回归 `19 files / 72 tests`、TypeScript、ESLint、`65 app / 18 core` 边界和 production build 通过，官方模拟器可进入个人图片入口。
- **生效范围：** CBoard Web、微信小程序、当前设备和当前患者/工作区；不上传家庭照片，不修改公开板，不把本机路径同步到 API。真机选图、替换、删除与重启恢复仍待验收。
- **记录：** Codex（GPT-5），2026-07-18 10:30:16。

## 变动 18：WechatSI 构建模式漂移收口

- **意图：** 修复正式 AppID 已授权且曾在真机正常发声后，后续预览再次提示插件未启用的回归。
- **决策：** 在正式账号授权已完成的前提下，微信应用配置对开发和生产构建都固定声明 WechatSI `0.3.4` 与录音权限，移除仅由 production 环境变量控制的启用分支。
- **理由：** 开发者工具重新编译会使用 development 环境；旧配置会静默生成无插件 `app.json`，导致同一 AppID 的预览能力随构建模式改变。此时继续保留授权前的保护开关，风险已经大于收益。
- **证据：** 最新产物含 WechatSI provider 与 `scope.record`；官方模拟器 `requirePlugin` 返回 TTS/ASR 方法，紧急页有 `8` 个图片节点且无缺图项；`19 files / 72 tests`、类型、Lint、边界和 production build 通过，`auto_preview` 成功推送 `1,690,501` 字节包。
- **生效范围：** 正式图语家 AppID 的开发、生产构建、患者朗读、照护者语音输入和手机预览；不代表 AI 后端已配置，不上传体验版、不审核、不发布。真机最终结果仍以本轮新预览为准。
- **记录：** Codex（GPT-5），2026-07-18 10:30:16。

## 变动 19：真实照护话术首批高风险覆盖

- **意图：** 把图语家原仓库已经收集并标记证据的真实照护话术转为 CBoard/微信共享回归，避免迁移只对少量演示句有效。
- **决策：** 从 80 条样本中先固定 15 条医疗、安全和基本照护高风险话术；默认板已有概念必须准确或受控同义命中，缺少安全图卡的完整词语保留未匹配，所有样本禁止 partial 猜图。
- **理由：** 高风险沟通中不能以错误图换取更高匹配率；首轮基线真实发现“吃药”“量血压”“痛不痛”三个退化，证明原文档样本必须进入自动化而不能只作参考。
- **证据：** CBoard `receiverCaregiverFixtures.test.js`、segmentation 和 symbol matching 共 `3 suites / 69 tests`；微信 `19 files / 72 tests`、TypeScript、ESLint、边界和 production build 通过。官方模拟器确认吃药、量血压和痛不痛的分词/匹配语义，WechatSI TTS/ASR 方法存在，紧急页 8 个本地图片节点，Console 无 error/fail/plugin；最新预览 `1,690,779` B 推送成功。
- **生效范围：** CBoard Web 与微信共享分词/matcher、覆盖矩阵和回归门；不新增 CBoard 默认板图卡，不把证据样本直接当词库，不代表在线 AI 已部署。其余样本继续按风险增量迁移。
- **记录：** Codex（GPT-5），2026-07-18 11:17:51。

## 变动 20：日常照护与体位样本扩展

- **意图：** 让真实 fixture 不只覆盖医疗危险词，也覆盖换洗、休息和床旁体位等每天会发生的照护沟通。
- **决策：** 新增 13 条后达到 28/80；尿片、衣服、枕头、被子、盖上和关掉作为跨平台保护词，换衣服拆成动作/对象并保留重复衣服。
- **理由：** 微信可能没有 `Intl.Segmenter`；逐字拆分会破坏照护概念，复合动作又可能吞掉重复对象。新增样本基线确实发现尿片、换衣服和盖上三处退化。
- **证据：** 修复后 CBoard `3 suites / 92 tests`，微信 `19 files / 72 tests`、TypeScript、ESLint、边界和 production build 通过。生产 `dist` 含新短语；定向清理开发者工具编译缓存后，三条目标句在官方模拟器分词正确且 Console 无 error/fail，最新预览 `1,690,916` B 推送成功。
- **生效范围：** Web/微信共享分词和 matcher、覆盖矩阵与微信运行门；不把 fixture 直接变成词库，不为缺图概念猜图，剩余 52 条继续增量迁移。
- **记录：** Codex（GPT-5），2026-07-18 11:29:30。

## 变动 21：80 条证据 fixture 全量迁移

- **意图：** 完成 #38/#15，不让任何一条原图语家证据话术继续只存在于文档而不受回归保护。
- **决策：** 80 条全部进入 `receiverCaregiverFixtures.test.js`；已知图卡校验 labelKey，关键概念校验完整 token，重复名词校验次数，所有结果禁止 partial。`不回家`作为否定单元整体保留。
- **理由：** 从 50 条扩到 80 条后仍发现 10 个差异，包括程度、冷热问句、帮助、交通、探视、家人和活动词；抽样不足以证明迁移质量。
- **证据：** 修复后 CBoard `3 suites / 160 tests`；微信 `19 files / 72 tests`、TypeScript、ESLint、边界和 production build 通过。官方模拟器抽查四类新差异全部正确，Console 无 error/fail，最新预览 `1,691,223` B 推送成功。
- **生效范围：** Web/微信共享分词和 matcher、覆盖矩阵、微信运行门；不把 fixture 当词库，不承诺默认板已有每个概念图卡，新增真实反馈继续追加。
- **记录：** Codex（GPT-5），2026-07-18 11:39:32。

## 变动 22：微信语音识别波形反馈

- **意图：** 补齐 #16，使照护者无需从按钮文案猜测麦克风是否仍处于识别状态。
- **决策：** 微信端新增由 `isListening` 驱动的独立 7 柱动画与状态说明，停止识别后卸载；保留识别文字即时显示和结束后人工修正。
- **理由：** 当前 WechatSI port 没有原始音频振幅，状态驱动反馈是可验证且不误导的边界；若状态节点不消失，还会重现界面堆叠与录音状态不清的问题。
- **证据：** 微信 TypeScript、ESLint、`19 files / 72 tests`、`65 app / 18 core` 边界和 production build 通过；官方模拟器开始时查询到 1 个反馈区和 7 根波形，结束后为 0，Console 无 error/fail，`1,693,589` B 预览推送成功。
- **生效范围：** 覆盖矩阵 #16、微信接收端和真机验收清单；不采集/保存音频，不表示真实音量，不把正式 AppID 与插件授权标记为自动完成。
- **记录：** Codex（GPT-5），2026-07-18 11:49:29。

## 变动 23：最新预览语音真机通过

- **意图：** 把 #33/#67 的语音结论从历史反馈更新为当前包的真实设备证据。
- **决策：** 最新预览中的 ASR 与 TTS 标记为真机通过；波形、图片、AI、触控、旋转和离线继续保持未验收。
- **理由：** 语音恢复证明正式 AppID、WechatSI 授权与手机音频链可工作，但不同能力必须独立取证，不能连带宣布图片或网络服务正常。
- **证据：** 用户明确确认 `1,693,589` B 最新预览“语音输入以及播报都恢复正常了”。
- **生效范围：** 覆盖矩阵 #33/#67 与微信真机清单；不改变其他 `部分` 或 `未完成` 状态。
- **记录：** Codex（GPT-5），2026-07-18 11:52:55。

## 变动 24：按真机反馈修正波形语义

- **意图：** 响应用户发现的“没说话也在动”，让 #16 不再用持续动画伪装实时反馈。
- **决策：** `isListening` 只控制反馈区存在；`onRecognize` 增量文字独立控制 900ms 活动，停止、取消、超时和重置清除活动。
- **理由：** WechatSI 没有振幅数据，不能实现真实分贝曲线；复用插件增量事件可避免与第二录音器争用麦克风，并保住已经真机恢复的 ASR。
- **证据：** 用户真机反馈定位旧行为；修复后微信类型、Lint、`19 files / 72 tests`、边界和 production build 通过。官方模拟器静音为 `1 feedback / 0 active`、停止为 0，Console 无 error/fail，最新预览已重新推送。
- **生效范围：** 覆盖矩阵 #16/#67/#68 与微信验收清单；真机说话活动尚待复测，不将其标记为完成，也不称为原始音频振幅。
- **记录：** Codex（GPT-5），2026-07-18 12:02:28。

## 变动 25：缺词在线补图直连备用通道

- **意图：** 让 #8 在尚未部署公开 CBoard API 时仍有可测试实现，而不是只有不可达的端口代码。
- **决策：** CBoard API 优先；无 API 地址时只把单个缺词发给 ARASAAC 中文搜索，候选经人工确认后仅缓存规范来源图片。设置默认开启、可关闭并持久化。
- **理由：** 本地沟通必须始终可用，但用户明确需要恢复缺词自动找图；最小披露、来源校验和人工确认可以在不伪造 AI 的前提下恢复功能。
- **证据：** ARASAAC “厕所”“头晕”和规范 PNG 已实网只读验证；微信 TypeScript、ESLint、`20 files / 77 tests`、`67 app / 18 core` 与 production build 通过。官方模拟器验证开关持久化和自动触发；真实请求被合法域名门禁拦截，故仍标记为部分完成。
- **生效范围：** 覆盖矩阵 #8/#66/#67、小程序缺词队列与验收清单；不自动采用候选，不发送整句、历史、语音或设备私有图片。
- **记录：** Codex（GPT-5），2026-07-18 13:12:52。

## 变动 26：重复识别回调去重并取消无限动画

- **意图：** 响应用户再次发现的静音持续运动，收紧 #16 的真实语义。
- **决策：** 识别 port 过滤空白和重复增量文字；每次新文字让 7 柱只脉冲一次，录音按钮和活动柱均不再使用无限动画。
- **理由：** 旧版 900 毫秒循环可被重复回调不断续期，仍像虚假实时振幅；WechatSI 没有振幅，有限事件脉冲是不会破坏 ASR 的准确边界。
- **证据：** 新测试覆盖“想喝/重复想喝/空白/想喝水”，Vitest `20 files / 77 tests` 通过；类型、Lint、边界和 production build 通过。官方模拟器静音等待 2 秒为 `1 feedback / 0 active`，`1,698,996` B 预览推送成功。
- **生效范围：** 覆盖矩阵 #16/#67/#68 和微信接收端；真机说话单次脉冲仍待复测，不把它描述为原始振幅。
- **记录：** Codex（GPT-5），2026-07-18 13:12:52。

## 变动 27：餐具自然词跨端校准与模拟器实图验证

- **意图：** 将用户发现的餐具缺图纳入 #8/#15/#67/#68 的长期覆盖，而不是只修一个临时图片路径。
- **决策：** 在 CBoard/微信共享概念 profile 中校准 fork、knife、spoon、bowl 的自然中文和同义词；保持上游 CBoard 翻译不变，微信 BoardDTO 对同一 labelKey 校准显示和朗读。验收同时检查资源、matcher、构建产物、开发者工具缓存、运行节点和截图。
- **理由：** 上游中文“分叉/刀具/弓箭手”与用户自然用词不一致，导致修复前四词只有两图；修复后短暂残留的两图结果来自开发者工具旧编译缓存。两种原因必须分别有测试和运行证据。
- **证据：** 新共享测试验证四个 labelKey、标准文字、同义词和非空图片；CBoard `3 suites / 161 tests`、微信 `20 files / 78 tests`、类型、Lint、边界和 production build 通过。官方模拟器修复前为 2 个复核图片，定向清理缓存后为 4 个复核图片和 4 个预览图片，截图肉眼确认四图；Console 无 error/fail，最新预览 `1,699,897` B 已推送。
- **生效范围：** 覆盖矩阵 #8/#15/#67/#68、CBoard Web、微信接收端和真机清单；不修改上游翻译，不表示手机端已自动通过。
- **记录：** Codex（GPT-5），2026-07-18 13:41:01。

## 变动 28：新对话刷新恢复门闭环

- **意图：** 关闭 #31/#65/#68 中“新对话后再次重启”缺少平台运行证据的问题。
- **决策：** 直接使用官方模拟器中已有的接收草稿与双向历史，验证新对话前后和刷新后的输入值、历史数量、提示及历史正文，不清空业务 storage、不注入测试数据。
- **理由：** repository 单测不能证明 Taro UI、微信 storage 和恢复时序共同正确；提示成功也不能证明历史没有被误删。
- **证据：** 输入由“叉子 刀 勺子 碗”清空，点击后与刷新后历史均为 5 条；刷新后旧草稿未恢复，“全部历史”仍可读取 4 个会话分组的表达与接收正文，Console 无 error/fail。
- **生效范围：** 覆盖矩阵 #31/#65/#68、微信活动会话、storage 恢复和历史管理；不替代真机杀进程、断网或多设备验收。
- **记录：** Codex（GPT-5），2026-07-18 13:51:48。

## 变动 29：取消延迟波形并保留即时监听状态

- **意图：** 根据真机反馈修正 #16/#67，使视觉反馈不再落后于说话并冒充实时音量。
- **决策：** 删除所有波形节点与动画；录音开始立即显示静态状态，新识别文字到达时只改颜色和文案，继续保留去重、停止卸载与人工修正。
- **理由：** WechatSI 只给延迟可变的文字事件，不给振幅；另开 RecorderManager 会争用同一麦克风。无法安全获得实时振幅时，诚实静态状态优于延迟伪波形。
- **证据：** 用户确认上一版能区分静音/说话但活动延迟高；微信类型、Lint、`20 files / 78 tests`、边界和 production build 通过。官方模拟器即时显示“监听中”和非波形说明，截图无柱形；源码/产物无旧节点与动画，Console 无 error/fail，`1,699,175` B 预览已推送。
- **生效范围：** 覆盖矩阵 #16/#33/#67/#68、微信语音 UI 和验收清单；不改变 WechatSI 识别延迟，也不把新手机 UI 标记为已验收。
- **记录：** Codex（GPT-5），2026-07-18 14:12:14。

## 变动 30：本地词库改进后自动清理过期缺词

- **意图：** 补强 #8/#15/#67/#68，使 matcher 改进不仅影响新输入，也能安全修复历史缺词队列，并向照护者显示真实进展。
- **决策：** 在 Web/微信共享核心中新增安全自动消解：仅精确标签或受控同义词、必须有本地图、歧义 Tile 必须同一非空语义键；结果保留 `catalog-auto` 来源且不冒充照护者审核。待处理数按全部记录计算，列表仍分页限制 20 条，自动结果与网络状态分别展示。
- **理由：** 餐具中文校准后，微信 storage 中仍留有旧“叉子、刀”缺词；首次实现实际已经完成消解，但 UI 只统计前 20 条且提示被在线结果覆盖，用户无法看见变化，也可能继续误触发网络搜索。
- **证据：** 真实 storage 显示“叉子、刀、痛”自动解决，“头晕”保持未解决。官方模拟器显示待处理 26、自动解决 3 个、ARASAAC 域名提示和“头晕”待处理同时成立；Console 无 error/fail。CBoard `6 suites / 179 tests`，微信 `20 files / 78 tests`、类型、Lint、边界、production build 和 `1,701,030` B 预览推送均通过。
- **生效范围：** 覆盖矩阵 #8/#15/#67/#68、Web/微信缺词 repository 消费层、照护者缺图维护和在线搜索前置过滤；不把网络图自动采用，不消解多义词，不宣称合法域名后的真机下载已完成。
- **记录：** Codex（GPT-5），2026-07-18 14:52:04。

## 变动 31：患者首屏三步化与接收独立分包

- **意图：** 收口 #6，并继续补强 #33/#67/#68 的真实 UI 边界。
- **决策：** 患者首屏移除宣传说明、折叠照护工具、直接显示图板；表达拆为三步。接收端使用独立分包页，紧急和照护入口用一次性返回意图衔接患者页。
- **理由：** 患者不应滚动后才能看到图卡；独立路由能消除同页堆叠，也能让自动化明确判断当前页面。
- **证据：** 官方模拟器读取根板 29 个图卡节点，截图首屏可见实图；点“是”可加入/撤回。接收页出现输入框；紧急返回后 8 图存在，照护返回后面板展开，Console 无 error/fail。
- **生效范围：** 矩阵 #6/#33/#67/#68 与微信患者/接收 UI；Web #6 状态不变，手机触控/旋转仍待验收。
- **记录：** Codex（GPT-5），2026-07-18 15:43:46。

## 变动 32：微信性能门与完整沟通分包

- **意图：** 落实用户提供的微信官方性能指南，确保后续继续补功能时不突破包体与质量边界。
- **决策：** 开启三类压缩、无依赖过滤、按需注入和自动体验评分；构建逐包检查包体、媒体、插件、组件、图片和兼容语法。将患者、接收与离线图卡放入沟通分包，主包仅启动。
- **理由：** WechatSI 计入主包；只拆接收页后主包仍达 `1,968,857 B`。完整分包既保留 775 张离线图卡，也为主包留出空间。
- **证据：** 未压缩构建为主包 `292,760 B`、沟通分包 `1,388,411 B`；最终预览为主包 `318,307 B`、沟通分包 `1,362,769 B`、总计 `1,681,076 B`。`21 files / 81 tests`、`74 app / 18 core`、TypeScript、ESLint、production build、图卡完整门和官方模拟器均通过。官方原文：https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009
- **生效范围：** 矩阵 #6/#33/#65/#67/#68、微信构建与预览；不将分包和模拟器结果替代真机断网、触控、旋转或发布验收。
- **记录：** Codex（GPT-5），2026-07-18 15:43:46。

## 变动 33：CBoard Web 患者优先入口与独立接收界面

- **意图：** 继续收口 #6，使 CBoard Web 与微信都不再把照护者复杂流程默认堆叠在患者图板上。
- **决策：** CBoard Web 默认保持紧凑入口；患者表达按需展开，接收理解进入独立全屏 Dialog，照护工具默认隐藏，紧急求助始终可见。核心继续复用中性 `CommunicationSupport`，不把新逻辑放进 `Tuyujia` 包装层。
- **理由：** 直接复用成熟 Board/Tile 的前提是患者仍以图板为主；接收端分词、匹配、换图、缺图维护和历史属于照护者工作区，应有独立边界。
- **证据：** 新增接收 Dialog 及测试；定向 `2 suites / 17 tests`，Communication Support 纯核心、组件与 Board 集成 `45 suites / 326 tests` 全部通过；CBoard production build 成功并生成 `977 resources / 41.2 MB` Service Worker。桌面 Chrome 与 Pixel 5 竖屏生产离线 E2E `2 passed`，三个一级入口实测均不低于 44px。
- **生效范围：** 矩阵 #6/#33/#67/#68 与 CBoard Web UI；不修改共享管线、默认板、API、存储或微信 UI。真实手机安全区、横屏、系统级触控和人工视觉仍待验收。
- **记录：** Codex（GPT-5），2026-07-18 16:14:48。

## 变动 34：五类接收纠错与后加图片

- **意图：** 修正覆盖矩阵对 #64 的提前完成声明，让替换、删除、排序、插入和重分词都成为两端真实可调用、可持久化的编辑。
- **决策：** 共享核心新增插入操作和完整前后图片 ID 数组；Web 与微信接收复核均增加“后加图片”，并区分 `corrected` 与 `manual` 来源。纠错日志继续本地保存且不用于学习。
- **理由：** 原代码没有插入消费者，规范化还会丢掉完整序列，无法证明五类闭环；同时 correction audit 与 correction memory 是两个边界，不能在没有冲突/撤销规则时混合。
- **证据：** CBoard `45 suites / 329 tests`、production build、离线 E2E `2 passed`；微信 `21 files / 82 tests`、TypeScript、ESLint、`74 app / 18 core`、production build与官方 `1,681,074 B` 预览通过。模拟器窗口因 `appLaunch with non-empty page stack` 继续运行旧缓存模板，故新按钮触控等待手机预览复测。
- **生效范围：** 矩阵 #26/#33/#64/#67/#68、共享接收核心、Web/微信接收 UI 与本地纠错记录；不进入普通历史、API、云同步或自动学习。
- **记录：** Codex（GPT-5），2026-07-18 16:54:12。

## 变动 35：工作区纠错记忆消费层

- **意图：** 完成 #26 最后一条本地功能缺口，让真实人工修正影响后续接收，同时严格限制在当前工作区。
- **决策：** 共享核心从追加式 correction 日志派生规则：最新 replace 立即优先，delete 形成 90 天墓碑，评分为频次乘 30 天半衰期；默认参与学习但两端均可按会话关闭。insert/reorder/resegment 不进入词图学习。
- **理由：** 纠错审计、未来匹配和普通历史必须继续分层；派生层无需第二数据库，不改 CBoard 默认词典，也不会把一个家庭的判断扩散为全局规则。
- **证据：** CBoard `46 suites / 334 tests` 与 production build；微信 `21 files / 83 tests`、TypeScript、ESLint、边界、production build，以及主包 `318,619 B`、沟通分包 `1,364,012 B`、总计 `1,682,631 B` 的官方预览全部通过。
- **生效范围：** 矩阵 #26/#33/#64/#67/#68、共享 matcher/lifecycle、CBoard Web 与微信接收端和本机 repository；不上传 correction，不跨 workspace，不新增 API、全局词典或自动采用网络图片。手机开关和跨重启触控仍由 #67 验收。
- **记录：** Codex（GPT-5），2026-07-18 17:42:58。

## 变动 36：人工删除高于缺词自动补图

- **意图：** 修正 #26/#68 中“纯算法已通过但组合运行仍会复活已删除图片”的遗漏，并把纠错记忆从代码/构建证据推进到官方微信运行闭环。
- **决策：** 将缺词解决视为纠错 memory 之后的受控补充：同词同图 `catalog-auto` 不得覆盖 tombstone；旧人工确认不得覆盖较新删除；删除后的新人工确认或不同图片可以覆盖。首次生成和微信异步刷新使用同一共享过滤函数。
- **理由：** 真实失效链是 tombstone 先命中，随后缺词自动消解和 `useEffect` 又把同一 CBoard 图片填回。该冲突属于跨端业务优先级，不能只在微信隐藏节点或关闭自动补图。
- **证据：** 官方 E2E 证明删除、持久化和重匹配图卡 ID 同为 `ryctMA9amqtZ`，workspace 和时间戳有效；修复后换图复用、删除抑制、关闭学习、同会话双向历史、新对话保留历史、Console 无 error 和 13 项 storage 精确恢复全部通过。CBoard `48 suites / 342 tests / 1 snapshot`、微信 `21 files / 85 tests`、TypeScript、ESLint、边界和两端 production build 通过；未压缩主包 `293,081 B`、沟通分包 `1,395,574 B`，符合微信官方性能指南。
- **生效范围：** 覆盖矩阵 #26/#33/#67/#68、CBoard Web/微信共享接收管线、微信异步缺词刷新和官方 Skill gate；手机最新预览仍为上一版，本轮上传等待用户再次明确授权，不改变真机触控、旋转、断网和网络增强的未完成状态。
- **记录：** Codex（GPT-5），2026-07-18 20:07:36。

## 变动 37：OpenAI-compatible AI 配置与两端健康诊断

- **意图：** 补齐 #8/#63/#66/#68 中“原图语家已有通用 AI 配置，但 CBoard fork 只能识别 Azure，且照护者无法诊断未配置原因”的迁移缺口。
- **决策：** `cboard-api` 优先支持 OpenAI-compatible 服务端配置并保留 Azure 回退；请求固定超时和重试边界，健康接口不暴露密钥。CBoard Web 与微信照护设置复用同一健康接口，AI 保持候选性质，本地分词和匹配永远可用。
- **理由：** 兼容原 MVP 的提供方比新建第二套 AI 服务更可复用；`cboard-ai-engine` 继续承担整板生成，不进入实时沟通状态机。将配置状态显示给照护者能把“AI 不可用”变成可诊断状态，但不能把本地健康降级冒充真实模型成功。
- **证据：** API 定向 `19 passing`；CBoard `48 suites / 343 tests / 1 snapshot` 与 production build；微信 `21 files / 86 tests`、TypeScript、ESLint、`74 app / 18 core`、production build 和逐包门通过。官方模拟器确认无 HTTPS API 时显示配置提示，点击检测后继续本地规则，Console 无 error/fail；当前未压缩主包 `293,081 B`、沟通分包 `1,397,537 B`。
- **生效范围：** 覆盖矩阵 #8/#63/#66/#68、`cboard-api`、CBoard Web 设置和微信照护设置；不包含真实 HTTPS 部署、登录、服务端密钥、合法域名、真实 AI 请求或手机预览上传。
- **记录：** Codex（GPT-5），2026-07-18 20:40:35。

## 变动 38：工作区修正记忆可视化与撤销

- **意图：** 补齐 #26/#68 中“规则已经影响匹配，但照护者看不见也不能撤销”的治理缺口。
- **决策：** 两端复用共享活动规则行和停用函数；Web 在照护管理弹窗展示，微信在独立接收页默认折叠展示。停用只关闭相同 workspace/token 的 replace/delete 学习标记，保留 correction 审计；Web 使用接收端同一板集和 `intl` 显示自然图名。
- **理由：** 可追溯审计不能因撤销学习而删除；技术 Tile ID 不能作为照护者界面。管理、审计和 matcher 消费必须分别可验证。
- **证据：** Web 定向 `3/27`、既定门 `49/349/2 snapshots`、production build、桌面/Pixel 5 离线 E2E `2 passed`；微信 `22/87`、TypeScript、ESLint、`76 app / 18 core`、production build 与官方 Skill E2E 通过。Skill 验证规则 2→1、审计数量不变、目标行 `isUsedForLearning: false`、默认“喝”图恢复和原 storage 恢复。
- **生效范围：** 覆盖矩阵 #26/#33/#67/#68、Web/微信照护管理、共享 correction memory/repository 与自动化；不修改默认词典、不跨 workspace、不上传 correction。本轮未上传手机预览。
- **记录：** Codex（GPT-5），2026-07-18 21:31:42。

## 变动 39：“后加图片”微信官方运行闭环

- **意图：** 补齐 #64/#68 中人工插图只有代码与构建证据、没有微信 UI/storage 组合证据的缺口。
- **决策：** 官方 Skill E2E 从有稳定本地图的单词出发，真实点击“后加图片”和默认板候选；同时检查 UI 1→2、插入索引、完整前后 ID 顺序、非学习 correction 审计和 draft 中 `manual` 来源，并 finally 恢复全部原 storage。
- **理由：** 插入功能跨越 Taro 事件、Board 导航、共享纯核心和微信 repository，任一层失配都可能出现“按钮能点但顺序或审计错误”；没有图的词不能作为测试锚点。
- **证据：** 官方完整 E2E 最终输出包含 `manual insertion` 并恢复 13 项 storage；微信 `22/87`、TypeScript、ESLint、`76 app / 18 core`、production build、44 boards / 825 tiles / 775 images 和逐包性能门通过。
- **生效范围：** 覆盖矩阵 #33/#64/#67/#68、微信接收插图、draft/correction repository 和官方 Skill gate；不把模拟器点按写成手机触控，不上传预览或发布。
- **记录：** Codex（GPT-5），2026-07-18 21:51:04。

## 变动 40：设备私有熟悉图片微信官方运行闭环

- **意图：** 补齐 #10/#24/#67/#68 中个人图片只有代码、端口和入口证据，没有真实微信文件生命周期证据的缺口。
- **决策：** 官方 Skill 只 mock `chooseMedia` 的人为选择，真实执行 `compressImage`、`saveFile`、`getSavedFileInfo` 和 `removeSavedFile`；按稳定 Board/Tile、patient/workspace 保存 `device-private` 偏好，重启后复查患者图板，再恢复默认并验证 storage 与物理文件共同清除。
- **理由：** 临时路径不能保证重启恢复，偏好删除也不等于照片文件删除；repository、显示覆盖和文件清理必须在同一平台运行态组合验收，同时家庭照片不得进入云同步。
- **证据：** 官方 Skill 得到真实 `http://tmp/...jpg` 和不同的 `http://store/...jpg`，重启后患者图卡使用持久路径，恢复默认后偏好为 `[]` 且 `getSavedFileInfo` 确认文件不存在；完整 E2E 输出包含 `personal images` 并恢复 13 项原 storage。微信 `22/87`、TypeScript、ESLint、`76 app / 18 core`、production build 和逐包门通过。
- **生效范围：** 覆盖矩阵 #10/#24/#67/#68、微信个人图片 port/管理器/患者图板/repository 与官方 Skill gate；不上传家庭照片，不进入账号同步，不把模拟器结果称为手机相册/相机真机验收。
- **记录：** Codex（GPT-5），2026-07-18 23:34:38。

## 变动 41：微信真实网络状态与离线能力提示

- **意图：** 补齐 #65/#66/#67/#68 中“本地能力实际可用，但照护者看不到真实断网边界”的缺口。
- **决策：** 新增平台无关网络状态端口与 Taro adapter；明确离线才在照护工具和接收页提示本地图板、分词、图片、朗读和历史可用，AI/在线补图/同步不可用。未知状态不误报，患者首屏不放技术提示。
- **理由：** 离线优先既要保证功能，也要让家属理解降级范围；网络 API 自身失败不能被当成断网。官方 Skill 不支持 mock `onNetworkStatusChange`，因此不能用不可信 UI 自动化替代设备验收。
- **证据：** 端口与文案 `2 files / 7 tests`，全量 `24/94`、TypeScript、ESLint、`82 app / 18 core`、production build 和逐包门通过；主包 `293,081 B`、沟通分包 `1,404,609 B`。两次受限模拟均恢复 13 项 storage；恢复原 E2E 边界后完整官方 Skill 流程通过。
- **生效范围：** 覆盖矩阵 #65/#66/#67/#68、微信照护者 UI、网络 adapter、自动化和真机清单；不发起请求，不改变核心管线，不把单测标成真实断网通过，不上传预览或发布。
- **记录：** Codex（GPT-5），2026-07-19 00:05:41。

## 变动 42：离线能力边界从微信实现提升为 CBoard 跨端契约

- **意图：** 补齐 #65/#66/#67/#68 中 CBoard Web 缺少真实浏览器网络状态入口、且 Web/微信重复维护离线规则与文案的遗漏。
- **决策：** 将状态归一化和离线能力文案移动到 CBoard 中性 `networkStatus.js`；Web 通过 browser port 接入照护工具和独立接收界面，微信端改为复用该纯核心并保留 Taro adapter。显式连接状态优先，未知不误报，患者首屏保持无技术提示；微信边界门把新核心纳入 19 个共享文件扫描。
- **理由：** 原图语家的离线优先原则应成为技术底座契约，而不是微信局部文案。平台 API 与 UI 必须解耦，才能在不搬运 React DOM / Material UI 的前提下复用 CBoard 代码，并防止两端故障语义分叉。
- **证据：** CBoard 定向 `4/27`、完整沟通门 `52/362/3 snapshots` 与 production build 通过；微信定向 `1/4`、全量 `23/91`、TypeScript、ESLint、`80 app / 19 core`、production build 和逐包性能门通过。主包 `293,081 B`、沟通分包 `1,404,908 B`；官方 Skill 完整 E2E PASS 并恢复 13 项原 storage。
- **生效范围：** 覆盖矩阵 #65/#66/#67/#68、CBoard 共享网络契约、Web/微信照护者入口、类型和质量门；不代表真实系统断网 UI 已验收，不发起新请求，不改变本地匹配、语音、历史或同步，不上传预览或发布。
- **记录：** Codex（GPT-5），2026-07-19 00:34:55。

## 明确未完成

- GitHub issue #1 已于 2026-07-22 通过本机 10808 代理和 GitHub REST API 在线核验；其余 issue 的最新正文、评论和开关状态仍需在相关变动前逐条核验。
- 本矩阵中的 `部分` 不得在 README、PR 或演示中改写为“全部完成”。
- Web 生产离线与双向沟通 E2E gate、微信开发者工具 UI/storage gate、WechatSI 插件授权、手机预览推送、真实 TTS 发声和照护者 ASR 已完成；全部图卡真机复测、触控、横竖屏和系统级断网仍未验收。
- 登录、Settings 同步、已确认接收事件同步、AI 候选、AI 重分词和在线补图已进入当前 Web/微信代码；多设备真机并发和网络故障恢复仍需验收。
- 微信端 AI 已兼容 OpenAI-compatible 与 Azure OpenAI，但仍缺可由手机访问的 HTTPS `cboard-api` 地址、登录令牌和服务端提供方密钥；当前“AI 服务尚未配置，继续使用本地规则”是准确降级状态，不得写成真实 AI 已可用。
- 微信端 ARASAAC 备用搜索已进入代码，但真实候选、下载和缓存仍需先配置 `https://api.arasaac.org` 与 `https://static.arasaac.org` 合法域名后真机验收。
- 微信版本更新 port、全局提示与生产产物已经完成；开发版/体验版没有正式版本更新语义，`onUpdateReady → applyUpdate` 仍需在正式发布后的新旧版本切换中验收。
- 接收端五类日志和 workspace 本地修正记忆消费层均已实现；尚未实现跨设备家庭规则同步，且不得把本机规则升级为全局词典。
- 完整微信板编辑器不是当前 PRD 目标；设备私有图片选择、压缩、持久化、恢复默认和 ZIP 迁移已经完成。尚未实现的是公开图库贡献/许可编辑；支付属于商业化计划第三阶段，不应冒充原 MVP 迁移缺口。
- 账号级私人图库与完整私有数据快照协议、Web/微信显式上传、端侧加密解密、认证下载、导入复核、删除、Blob `no-store` 与生产配置门已经实现，但尚未部署到真实 Azure/Mongo，也未完成合法域名、两台真机跨设备恢复和账号删除后的真实 Blob 清理验收。两者都是每账号一个最新客户端加密信封，使用独立端点、格式和删除动作；旧明文记录需回原设备重新加密。当前仍不支持家庭成员共享授权、历史版本、逐图撤销或公开图库贡献。

## 变动 43：患者理解反馈跨端闭环

- **意图：** 补齐 PRD 6.2 第 5、6 步和矩阵 #33/#59/#63/#67/#68，使患者能对照护者展示的图片序列给出可追溯反馈，而不是把“已展示”误写成“已理解”。
- **决策：** CBoard 中性核心定义 `understood / not_understood / repeat_requested`，只附着于 confirmed receive；保存最新反馈及最多 20 条事件。Web 和微信分别用原生 UI 消费同一 repository，API 只白名单同步该契约。“再说一次”留在全屏并重播，另外两项返回复核界面；存储失败不阻断患者退出或重播。
- **理由：** 图语家的核心是双向沟通。患者反馈必须与原确认记录、时间和会话关联，同时不能把 React DOM、Material UI 或微信 API 放入共享核心，也不能把反馈塞回通用 Settings。
- **证据：** API 定向 `13 passing`；CBoard 中性门 `53/369/3 snapshots` 与 production build；微信 `23/91`、TypeScript、ESLint、`80 app / 20 core`、production build 和官方 Skill E2E 通过。官方运行态验证反馈轨迹 `repeat_requested → understood`、全屏停留/返回和 13 项原 storage 恢复。扩大旧 `Tuyujia` 兼容测试后剩两项既有断言债务，已明确隔离，未伪报全绿。
- **生效范围：** 覆盖矩阵 #33/#59/#63/#67/#68、CBoard Web、微信小程序、共享 receiver repository/sync 和 `cboard-api`；不表示真机反馈按钮已触控，不上传预览、不发布，不改变默认 Board/Tile、纠错记忆或缺词策略。微信包体继续依据[官方性能原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)验收。
- **记录：** Codex（GPT-5），2026-07-19 01:39:33。

## 变动 44：旧模板缓存证据分级

- **意图：** 修正过去“源码和 dist 已更新，但开发者工具仍运行旧模板”造成的验收歧义。
- **决策：** 自动化失败时同时检查磁盘 bundle、运行 WXML 和失败截图；确认仅编译缓存失效后使用官方 `cleanCompileCache`，不得默认清 storage、授权、会话或全部缓存。
- **理由：** 构建成功不等于运行时生效，运行时旧模板也不等于新业务实现错误；证据分级可以保护用户数据并避免错误修复业务代码。
- **证据：** 清理前截图只有旧朗读底栏，运行时不存在反馈按钮，而磁盘 bundle 已含新选择器；最窄缓存清理后同一 E2E 完整通过且 13 项 storage 恢复。
- **生效范围：** 覆盖矩阵 #33/#67/#68 的微信模拟器证据口径；不扩大为真机或发布证据，不改变业务源码。
- **记录：** Codex（GPT-5），2026-07-19 01:39:33。

## 变动 45：患者“没明白”后恢复照护者工作台

- **意图：** 补齐矩阵 #33/#59/#63/#67/#68 中“患者能反馈，但照护者返回后无法沿用原复核结果继续修正”的状态连续性缺口。
- **决策：** 在共享 receiver session 边界定义可测试的恢复快照；微信父页面持有快照，独立患者页只返回反馈与保存结果。`not_understood` 恢复原会话、输入、分词、复核图、活动 confirmed draft 和学习开关；再次展示复用同一记录。共享历史 helper 输出稳定中文反馈标签，CBoard Web 和微信历史界面共同消费。
- **理由：** 双向沟通闭环不仅是患者能点反馈，还必须让照护者根据反馈继续调整。保留隐藏工作台会重现 UI 堆叠，丢弃工作台会中断流程，复制记录会破坏审计。
- **证据：** CBoard 定向 `3/13` 与 production build `977 resources / 41.2 MB`；微信 `23/92`、TypeScript、ESLint、`80 app / 20 core`、production build 和逐包门通过。官方 Skill 完整验证 `repeat_requested → not_understood → 原文/3 项复核恢复 → understood`、同一 confirmed record 复用、历史反馈可见和 13 项 storage 恢复。主包 `293,081 B`、沟通分包 `1,412,749 B`，继续低于官方 1.5 MiB 建议线。
- **生效范围：** 覆盖矩阵 #33/#59/#63/#67/#68、共享反馈/历史核心、CBoard Web 历史管理、微信接收页恢复和 E2E；不代表应用冷启动恢复或手机最新预览已验收，不自动更改照护者修正，不上传预览或发布。性能依据为[微信官方原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5），2026-07-19 02:11:57。

## 变动 46：接收上下文跨页面与应用重建恢复

- **意图：** 补齐矩阵 #33/#59/#63/#67/#68 中“当前页面能返回，但刷新、重开或 `reLaunch` 后接收草稿与没明白记录仍会丢失”的生命周期缺口。
- **决策：** CBoard 中性 repository 以 schema v4 固化单一活动草稿和恢复标记；Web 与微信只消费同一恢复 API。活动 draft 可直接恢复，confirmed receive 仅在患者最新反馈为 `not_understood` 时恢复，`understood` 或照护者显式重新开始清除恢复路径。恢复已保存的图序列，不重新分词或匹配。
- **理由：** 图语家的人工分词、换图、排序、插图和缺词处理都是照护者的最终修正；生命周期恢复若重新推断，就会把已经确认的人类决策打回算法默认值。
- **证据：** CBoard `3/22` 定向测试；微信 `23/94`、TypeScript、ESLint、`80 app / 20 core`、production build 与逐包门通过。官方 Skill E2E 真实执行两次 `reLaunch`，验证活动草稿冷恢复、“没明白”记录冷恢复、草稿/确认去重、“明白了”清除恢复路径及完整既有回归，最终恢复 13 项原 storage。
- **生效范围：** 覆盖矩阵 #33/#59/#63/#67/#68、CBoard Web、微信小程序和共享接收 repository/pipeline；不改变 API 同步白名单，不上传本地恢复标记，不代表最新源码已进入手机。微信质量依据为[官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5），2026-07-19 03:55:42。

## 变动 47：缺词设备私图闭环补齐 #10/#11/#19

- **意图：** 补齐“公共板和在线候选都没有合适图片时，照护者无法用患者熟悉照片完成缺词”的核心缺口。
- **决策：** 新增平台无关 `device-private` runtime pictogram；Web 与微信缺词队列消费同一契约，图片只保存在设备本地缺词 repository。微信保存失败回滚新文件，恢复待处理删除关联和持久文件；不把私图加入 Settings、事件 API、公开板或全局词典。
- **理由：** 患者家庭物品和个体称呼不一定存在于公共 AAC 图库；人工最终修正必须可复用，同时隐私图片不能因云同步或许可字段被误公开。
- **证据：** CBoard `38 suites / 324 tests`、缺词组件 `6/6` 和 production build；微信 `24 files / 95 tests`、TypeScript、ESLint、`81 app / 21 core`、production build与官方 Skill完整 E2E 通过。运行态验证微信临时路径转持久路径、下一次匹配显示、恢复后字段清空和物理文件删除，finally 恢复 13 项 storage。
- **生效范围：** 覆盖矩阵 #10/#11/#19、CBoard Web、微信接收端、共享缺词/runtime pictogram 契约；不等于完整自定义板编辑、公开上传、许可管理或跨设备家庭图库。当前源码未上传手机预览。
- **记录：** Codex（GPT-5），2026-07-19 04:34:32。

## 变动 48：CBoard Web 照护者语音输入闭环回填 #16

- **意图：** 补齐微信已有语音输入而 CBoard Web 覆盖矩阵仍标记“不适用”的跨端缺口，并证明识别结果不会绕过照护者最终修正。
- **决策：** 直接复用原图语家的 Web Speech 环境判断与 React hook；普通浏览器优先使用 `SpeechRecognition` 或 `webkitSpeechRecognition`，微信 WebView 和不支持的浏览器隐藏语音按钮并保留文字输入。最终识别文字进入既有 matcher，之后仍允许修改原文和分词。
- **理由：** ASR 只是输入适配器，不应建立第二套分词/匹配链；渐进增强可以恢复 Web 语音能力，又不会让 Firefox、Safari、微信 WebView 或麦克风授权失败阻断核心沟通。
- **证据：** 浏览器语音与接收组件定向 `2 suites / 13 tests`；新增回归实际执行“语音最终文字 `我想喝水` → 自动匹配 → 改为 `我想喝苹果` → 人工分词 `我想 / 喝 / 苹果` → 重新匹配”。扩大回归首次发现测试 mock 缺少冷恢复 API，补齐替身后 `CommunicationSupportPanel` 为 `17/17`，最终 Communication Support 为 `52 suites / 375 tests / 1 snapshot`；production build 成功，Service Worker 为 `977 resources / 41.2 MB`。
- **生效范围：** CBoard Web Communication Support 的照护者接收入口、浏览器语音 adapter、降级文案与自动化；不修改微信 RecognitionPort，不保存音频，不保证所有浏览器支持，也不把 jsdom 回归写成真实麦克风权限或识别准确率已验收。
- **记录：** Codex（GPT-5），2026-07-19 04:50:50。

## 变动 49：在线缺词搜索建立后端优先与直连容灾

- **意图：** 补齐 #8/#66 中“配置了 `cboard-api` 后，一旦后端临时失败就完全失去在线候选”的单点故障，同时继续保护离线沟通和数据最小化边界。
- **决策：** 微信端同时构造既有 `cboard-api` 与 ARASAAC 端口，由纯 `fallbackPictogramSearchPort` 组合；后端成功或返回空候选时不重复直连，只有请求失败才尝试 ARASAAC。缓存下载按候选可信图片来源精确路由，不盲试两个下载器；设置文案明确只发送缺词、不发送完整原句，候选仍须照护者确认。
- **理由：** `cboard-api` 便于统一合法域名、缓存和未来鉴权，但不能成为可选补图的唯一故障点；直接把搜索逻辑复制到 UI 会增加漂移和包体。纯组合层既复用现有代码，也保证双通道失败不阻断本地 matcher、历史、语音和设备私图。
- **证据：** 新增容灾定向 `3 files / 14 tests`，微信全量 `25 files / 100 tests`、TypeScript、ESLint、`83 app / 21 core` 边界和 production build 通过；API 图片 helper/route 为 `6 passing`。未压缩主包 `293,081 B`、照护分包 `1,421,025 B`、775 张图片共 `953,152 B`；官方 Skill 完整 E2E PASS 并恢复 13 项原 storage。
- **生效范围：** 覆盖矩阵 #8/#66/#68、微信缺词在线搜索与缓存 adapter、照护设置文案和后续真机验收；不自动采用候选，不发送整句/历史/语音/私图，不改变 CBoard 默认板，不表示真实 HTTPS、合法域名或 ARASAAC 外网已验收。本轮未执行预览、体验版上传或发布。性能依据为[微信官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5），2026-07-19 05:09:20。

## 变动 50：微信账号同步从代码门推进到官方运行门

- **意图：** 补齐 #27/#68 中“账号、Settings 和 confirmed receive 同步只有端口单测，尚未证明真实微信 UI、Taro request 与 storage 能共同运行”的证据缺口。
- **决策：** session store 的 session/token 双写改为失败回滚，退出时两个键独立删除；官方 E2E 在快照 13 项真实 storage 后移除账号键，编译假 HTTPS API，通过 `wx.request` mock 执行登录、云端常用语合并、Settings 回写、confirmed receive 同步和退出。请求日志只记录路径、方法、字段名、鉴权布尔值和私图泄露布尔值，不记录密码或 token 内容；包装脚本无论成功失败都恢复原 storage 与默认构建。
- **理由：** 只测 port 不能发现 Taro Promise 对 mock 返回值的要求、Input 事件、页面状态切换和双键半写入；直接使用真实账号又会泄露凭据并让测试依赖外网。可恢复的假 API 运行门能验证客户端契约，同时保持真实服务边界诚实。
- **证据：** session/account/cloud 定向 `3 files / 17 tests`，全量 `25 files / 102 tests`、TypeScript、ESLint、`83 app / 21 core` 和 production build 通过；`cboard-api` confirmed receive controller/Swagger 为 `13 passing`。官方 Skill 最终 PASS，验证登录请求不带旧 token、所有受保护请求带 Bearer、远程短语进入本机、设备私图不进 payload、退出清除 session/token 且历史不变，13 项原 storage 深比较恢复。假 API 分包 `1,421,168 B`，恢复后的默认分包 `1,421,096 B`。
- **生效范围：** 覆盖矩阵 #27/#68、微信账号 session、登录/同步/退出 UI、官方 Skill E2E 和生产构建恢复门；不代表真实 HTTPS、邮箱激活、真实账号数据、多设备并发或 tombstone 冲突已验收，不上传预览或发布。性能继续依据[微信官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5），2026-07-19 05:56:18。

## 变动 51：OpenSymbols 多图库补图与缓存回收闭环

- **意图：** 补齐原图语家已实现但迁移后缺失的 OpenSymbols 回退，减少 ARASAAC 无结果时的空图，并让每张候选保持可追溯许可。
- **决策：** `cboard-api` 先查 ARASAAC，中文和英文回落均无结果后才查 OpenSymbols；共享密钥仅存在服务端。OpenSymbols 只接受 `arasaac / mulberry / sclera` 白名单仓库和非空许可，外部图片经 HTTPS 主机白名单、HMAC 签名与 2 MiB 响应上限代理。Web/微信只消费同源 API URL；微信候选必须人工确认后 `saveFile`，恢复待处理同时删除缓存文件。
- **理由：** 原实现已经证明多图库回退有价值；客户端持有共享密钥会泄露凭据，直接加载任意第三方 URL会扩大 SSRF/域名风险，撤销关联却不删文件会长期占用小程序存储。
- **证据：** API controllers/helper/Swagger `37 passing`；CBoard 定向 `54 suites / 384 tests / 3 snapshots`，隔离 production compile 成功，标准 build 仅被 Windows 的 `build/.well-known/assetlinks.json` 与 `.eslintcache` 文件锁阻断。微信 `25 files / 103 tests`、TypeScript、ESLint、`83 app / 21 core`、production build 和官方 Skill E2E 通过；运行态显示 `OpenSymbols / mulberry · CC BY-SA 2.0 UK`，确认后文件存在，恢复后同一路径不存在，13 项原 storage 与默认构建恢复。
- **生效范围：** 覆盖矩阵 #8/#19、`cboard-api` 图片搜索/代理、CBoard Web 同源候选消费、微信缺词维护/离线缓存/官方 Skill gate；不代表真实 OpenSymbols 外网已经请求成功，不执行预览、上传或发布。质量依据为[微信官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)和[OpenSymbols API 文档](https://www.opensymbols.org/api)。
- **记录：** Codex（GPT-5），2026-07-19 07:01:49。

## 变动 52：图符来源与许可贯穿 DTO、历史、同步和患者展示

- **意图：** 补齐 #8/#10/#11/#19/#24 中“候选阶段有来源文字，但确认后的图符、历史、全屏展示和同步记录可能丢失来源或误标图库”的追溯缺口。
- **决策：** 中性核心新增可选 `pictogramAttribution`，统一保存 provider、原始 ID、名称、许可、作者、来源 URL 和 repoKey；TileDTO、运行时图符、输出预览与 receiver history v2 逐层保留。患者全屏只读展示“图片来源与许可”；公开来源同步白名单化，设备私图的 attribution 和私有 pictogramId 在同步前剥离。
- **理由：** 图语家要求图片来源可记录、可追溯、可展示；只在缺词候选卡展示一次不能证明最终沟通记录使用了哪张图，也会让 OpenSymbols 候选被旧的 `online → ARASAAC` 映射误标。家庭私图又不能因增加许可字段而进入云端。
- **证据：** CBoard 来源归属扩大回归 `51 suites / 377 tests`，API 相关路由与控制器 `36 passing`；微信 Vitest `25 files / 103 tests`、TypeScript、ESLint、production build 与官方 Skill 账号版 E2E 通过。E2E 断言全屏可见 `OpenSymbols / mulberry` 与 `CC BY-SA 2.0 UK`，confirmed receiver record 为 contract v2、`source=opensymbols`、`repoKey=mulberry`，并恢复 13 项原 storage 和默认无测试地址构建。
- **生效范围：** CBoard Web、微信小程序、共享 DTO/runtime/matcher/receiver repository、`cboard-api` confirmed receive 白名单与 Swagger。在线 ARASAAC/OpenSymbols 和原始 `/symbols/...` 路径可逐图追溯；压缩后的微信默认板目前只提供集合级许可回退，CBoard 自有 symbol 缺少逐图独立许可时明确显示“未提供逐图独立许可”，不伪造结论。真实 OpenSymbols 外网、合法域名和手机网络仍待验收，本轮未预览、上传或发布。微信质量依据为[官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5.6），2026-07-19 08:17:35。

## 变动 53：OBF/OBZ 导入收口到 BoardDTO

- **意图：** 补齐 #30 中“CBoard 自带导入器存在，但图语家尚未证明导入结果可进入跨平台表达核心”的缺口，并阻止损坏文件生成空白看板。
- **决策：** 继续复用 CBoard `obfImportAdapter` / `obzImportAdapter`，增加最小 `open-board-0.1` 文档校验；独立 OBF 无效时明确拒绝，OBZ 中单个无效看板跳过。合法结果仍由既有转换器生成 CBoard Board，再通过 `createBoardDTO` 进入图语家纯核心。
- **理由：** 自研第二套 AAC 导入器会增加维护和格式漂移；但旧实现把 JSON 解析异常作为对象继续处理，可能生成 `unknown name` 空看板。微信若直接搬入 Web 导入器和完整编辑器，还会增加包体、DOM 依赖与平台耦合。
- **证据：** 新增回归验证 OBF 的固定网格顺序、朗读、HTTPS 图片、背景色和 `communicationSynonyms` 完整进入 BoardDTO；验证损坏 JSON、未知版本拒绝，以及 OBZ 混合合法/损坏/不支持条目时仅导入合法看板。相关面 `40 suites / 328 tests / 4 snapshots` 通过，标准 `npm run build` 成功并生成 `977 resources / 41.2 MB` Service Worker。
- **生效范围：** CBoard Web 的 OBF/OBZ 导入失败边界及其到 BoardDTO 的跨平台消费；微信小程序继续只消费校验后的 BoardDTO，不增加导入 UI、完整板编辑器、插件或依赖。大型第三方 AAC 样本、嵌入二进制图片和跨板导航仍需真实文件验收。微信质量继续依据[官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5.6），2026-07-19 08:32:54。

## 变动 54：关联词成为可往返但不自动匹配的策展元数据

- **意图：** 补齐 #11/#83 中“相关概念需要保留供照护者整理，但不能像同义词一样自动触发图片”的语义边界，并阻止现有沟通元数据在 OBF 导出后丢失。
- **决策：** 在中性键、旧 `tuyujia` 兼容键和 TileDTO v1 中增加可选 `relatedTerms`；TileEditor 提供“关联词（不自动匹配）”字段。matcher 继续只消费同义词、排除词和概念规则。OBF 导出统一保存 synonyms/relatedTerms/exclude/category，并由轻量纯序列化模块隔离 PDF/字体依赖。
- **理由：** “医院”和“医生”有关但不是同义词；若自动匹配会制造危险错图，若只存在编辑器内又会在文件迁移中丢失。纯序列化模块也让格式契约可独立测试，不需要加载 PDF、DOM 或字体。
- **证据：** CBoard 聚焦回归 `6 suites / 41 tests / 2 snapshots`、扩大回归 `42 suites / 334 tests / 6 snapshots` 和标准 `npm run build` 全通过，生成 `977 resources / 41.2 MB` Service Worker。微信 TypeScript、ESLint、Vitest `25 files / 103 tests`、边界 `83 app files / 21 CBoard core files`、44 boards / 825 tiles / 775 images 与 production build 通过；主包 `293,081 B`、照护分包 `1,426,891 B`，无单个超过 `200 KiB` 的图片或音频，`sub-vendors.js 305,085 B` 警告保留。
- **生效范围：** CBoard Web TileEditor、Tile metadata、BoardDTO/TileDTO v1、OBF/OBZ 文件往返及微信 TypeScript 消费边界；不改变 matcher 排名，不给微信增加完整板编辑器，不执行预览、上传或发布。小程序质量持续依据[微信官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5.6），2026-07-19 08:51:09。

## 变动 55：候选句空闲自动播报按 issue #36 跨端落地

- **意图：** 降低患者在候选句已经生成后还必须继续点按的认知与运动负担，同时避免自动语音在患者主动操作时继续播放。
- **决策：** 复用 CBoard 中性 `candidateAutoplay` 控制器和现有平台 TTS；默认 15 秒，照护者可选关闭、5、10、15、30 秒。候选单句点选只播该句；图片序列变化取消旧计时并按新候选重计；停止、触摸、滚动、离开页面取消当前和待播队列。设置只出现在照护者设置，不放入患者主操作区。
- **理由：** GitHub issue #36 已给出完整产品决策和验收标准；把计时/取消做成平台无关控制器，可以让 CBoard Web 与微信保持同一语义，又继续复用各自成熟的语音实现。
- **证据：** `gh api repos/picinterpreter/picinterpreter/issues/36` 于 `2026-07-19` 返回 `state=open` 和完整正文；CBoard 聚焦 `5 suites / 34 tests`、扩大回归 `55 suites / 394 tests / 3 snapshots`、整站 production build 均通过；微信 TypeScript、ESLint、Vitest `25 files / 103 tests`、`83 app / 21 core`、44 boards / 825 tiles / 775 images 与 production quality gate 均通过。
- **生效范围：** CBoard Web 与微信小程序的患者候选句、照护者设置、中性偏好/storage 和 TTS 取消语义；不改变候选句生成算法，不新增插件、依赖或媒体。本轮全程后台开发，未启动或置顶微信开发者工具，未执行模拟器 E2E、预览、上传或发布；真实手机 15 秒时序、触摸/滚动取消和连续 TTS 仍待明确授权后的真机验收。
- **记录：** Codex（GPT-5.6），2026-07-19 09:26:52。

## 变动 56：issue #83 固定顺序与常用优先跨端闭环

- **意图：** 恢复图语家已经验证的“固定空间顺序为默认、需要时按实际使用频率优先”能力，避免迁移到 CBoard 后退化为永远只按 fixture 顺序显示。
- **决策：** 新增平台无关 `pictogramOrdering` 与独立本地 store，人工顺序和 `boardId:tileId` 点击记录分别持久化。常用优先只重排可表达图卡，导航文件夹保持位置，次数并列时使用人工顺序。CBoard 复用原生 Board 编辑；微信设置页提供逐板选择及上移/下移。
- **理由：** 固定顺序支持患者空间记忆，常用优先减少高频表达路径；事件统计不能进入 BoardDTO、matcher 或账号 Settings。Web 继续复用成熟编辑器，小程序只增加轻量管理 UI，符合全平台复用和微信包体边界。
- **证据：** 原 MVP 的 Dexie schema、`pictogram-order.ts`、`PictogramGrid`、`SettingsDrawer` 与单测逐项核对。CBoard 聚焦 `5 suites / 20 tests`、扩大功能门 `63 suites / 421 tests / 3 snapshots` 和整站 production build 通过；旧 `src/api/api.test.js` 单独稳定复现 16 条既有 mock 失配，已与本切片隔离。微信 TypeScript、ESLint、Vitest `26 files / 104 tests`、边界 `85 app / 21 core`、44 boards / 825 tiles / 775 images 和 production gate 通过。
- **生效范围：** 覆盖矩阵 #83、CBoard 患者图板/显示设置、微信患者表达/照护设置及共享本地存储；不关闭 GitHub issue，不同步点击事件，不改变候选、分词或图片匹配。本轮全程后台开发，未调用开发者工具、未预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-19 10:28:01。

## 变动 57：微信默认板恢复逐图提供方与许可

- **意图：** 补齐 PRD“图片来源可追溯、署名信息可展示”的明确要求，避免 775 张离线默认图在哈希压缩后全部退化为同一个集合级 `cboard-default` 说明。
- **决策：** 不复制图片、不改变生成文件名；依据 CBoard 上游 `labelKey → 原图路径提供方` 的稳定关系，在微信 BoardDTO 生成边界复用共享 `getPictogramAttribution`，为每张 TileDTO 写入 Mulberry、ARASAAC 或 CBoard 的提供方、作者和许可。新增测试逐项对照上游 `boards.json`，未知提供方直接失败。
- **理由：** 许可属于图卡数据契约，不应靠 UI 猜测；在 fixture adapter 注入可继续复用 CBoard 纯核心，又不会把 Web 默认板 JSON、React DOM 或额外许可库打入小程序。
- **证据：** 上游 825 张 tile 精确得到 Mulberry `782`、ARASAAC `26`、CBoard `17`；聚焦 `1 file / 2 tests`、全量 Vitest `27 files / 106 tests`、TypeScript、ESLint、边界 `87 app / 22 core` 与 production build 通过。主包 `293,693 B`、照护分包 `1,439,771 B`、775 张图片 `953,152 B`；无新增媒体、插件或依赖，`sub-vendors.js 300 KiB` 告警保留。
- **生效范围：** 微信默认 BoardDTO、接收全屏“图片来源与许可”、历史/同步中的公共 attribution 和跨平台边界检查；不改变图片、标签、板顺序、分词、matcher、个人私图或云 API。本轮后台开发，未启动开发者工具，未预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-19 10:48:08。

## 变动 58：原 MVP 更新提示迁移为微信 UpdateManager

- **意图：** 恢复原 PicInterpreter `usePwaUpdate/UpdateBanner` 的产品意图，避免已发布新功能后用户长期停留在旧小程序包，或把旧包表现误判成当前源码问题。
- **决策：** 新增平台无关更新状态机和 Taro adapter，直接复用微信 `getUpdateManager`。仅 `onUpdateReady` 后显示全局“新版本已经准备好”，用户可“立即更新”或“稍后”；下载失败不向患者展示技术错误，不阻断当前沟通。
- **理由：** PWA Service Worker 不能搬到微信，但“检测、下载完成、知情重启、可稍后”的交互语义可以保留。状态机与 Taro API 解耦后可自动化，也不会在开发版误调用重启。
- **证据：** 聚焦 `1 file / 2 tests`、全量 Vitest `28 files / 108 tests`、TypeScript、ESLint、边界 `91 app / 22 core` 和 production build 通过；产物 `app.js/app.wxss` 含 `getUpdateManager` 及三个更新节点。主包 `295,964 B`、照护分包 `1,439,771 B`、图片 `953,152 B`，质量门通过。
- **生效范围：** 微信所有页面的已下载更新提示和版本应用；不改变 CBoard Web Service Worker、业务 storage、患者表达、接收、图片或 API。本轮未启动开发者工具，未预览、上传或发布；开发版/体验版无正式版本概念，真实更新切换仍待正式版本验收。
- **记录：** Codex（GPT-5.6），2026-07-19 10:56:59。

## 变动 59：患者表达图片序列恢复逐项移动与删除

- **意图：** 恢复原 PicInterpreter 在生成和播报句子前由患者或照护者修正已选图片顺序、删除任意误选图片的能力，避免迁移后只能“撤回最后一张”。
- **决策：** 在 CBoard 中性 `expressionPipeline` 增加无副作用的单项移动与删除函数；CBoard Web 和微信分别用现有 UI 组件消费同一函数。有效修改后重建 expression pipeline，取消旧自动播报与当前语音；越界操作保持原状态。
- **理由：** 图片顺序会改变句意，人工最终修正属于表达核心而不是视觉装饰。把数组规则留在纯核心、平台只负责按钮和播报 adapter，可以避免 Web 与微信产生两套语义，也不需要修改 Redux、BoardDTO、TileDTO 或服务端 API。
- **证据：** CBoard 聚焦 `2 suites / 17 tests`，扩大 Communication Support 门 `55 suites / 399 tests / 1 snapshot` 与标准 production build 全部通过；微信聚焦 `1 file / 7 tests`、全量 `28 files / 109 tests`、TypeScript、ESLint、边界 `91 app / 22 core` 和 production build 通过。生产分包已包含三个稳定按钮 ID、移动/删除 action 与 52px 操作样式。
- **生效范围：** CBoard Web 与微信患者表达的已选图片序列、候选句重建和语音取消；不改变图卡匹配、接收端人工修正、固定/常用图板排序、历史 schema、云同步或 AI。本轮全程后台开发，未启动、置顶或操控微信开发者工具，未预览、上传或发布；微信真机触控与小屏视觉仍待明确授权验收。
- **记录：** Codex（GPT-5.6），2026-07-19 11:13:39。

## 变动 60：常用语恢复独立的一键即时播报

- **意图：** 恢复原 PicInterpreter `QuickAccessBar → PlaybackOverlay` 的核心效率：高频常用语一次点击即可发声，不必先覆盖当前表达、再进入候选、再点击朗读。
- **决策：** CBoard Web 与微信都把“一键播报”和“重用/载入修改”拆为两个明确动作；一键播报先取消旧自动播报与当前语音，朗读该常用语原句并递增使用次数，但不替换患者当前已选图片。继续复用既有常用语、storage/settings 和 TTS adapter，不新增 schema、API、播放器或依赖。
- **理由：** 高频短语常用于时间敏感沟通，额外步骤会降低可达性；同时，播报历史短语不应破坏患者正在编辑的新表达。播放与载入分离后，两种意图都可直接完成。
- **证据：** CBoard 聚焦 `2 suites / 28 tests`，扩大主链门 `63 suites / 425 tests / 3 snapshots` 和标准 production build 通过，主 JS 增加约 `305 B gzip`、CSS 增加约 `65 B gzip`；父组件测试证明 `usageCount` 经既有 settings payload 持久化且未调用 `onApplyOutput`。微信全量 `28 files / 109 tests`、TypeScript、ESLint、边界 `91 app / 22 core` 和 production build 通过，产物含“一键播报/载入修改”；主包 `295,964 B`、照护分包 `1,442,390 B`、775 张图片 `953,152 B`。两条 `Tuyujia` 兼容旧断言已按事件保留与安全不猜图语义校正并通过 `10/10`；整库扫描仍有旧 Axios mock、WelcomeScreen 样式 mock 与 SpeechProvider Node 22 基线失败，不冒充全仓测试全绿。
- **生效范围：** CBoard Web 与微信患者表达页的高频常用语、使用次数和语音取消；“重用/载入修改”仍可进入编辑。当前恢复的是一次点击即时播报语义，不表示原 MVP 的专用全屏 `PlaybackOverlay` 视觉层已迁移；不影响当前图片序列、接收端、匹配、AI、账号或同步。本轮全程后台开发，未打开或置顶开发者工具，未预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-19 11:39:07。

## 变动 61：常用语恢复全屏图文播放层

- **意图：** 补齐原 PicInterpreter `PlaybackOverlay` 的可见沟通能力，让常用语不仅立即发声，还能把配套图片和大号句子直接展示给沟通对象。
- **决策：** CBoard Web 复用 Material UI `Dialog fullScreen`，微信使用不依赖新组件库的固定全屏层；两端都展示全部图卡、标签、原句、播报状态、“重播”和“完成”。首次进入沿用一键播报并只记录一次使用；重播不重复计数，完成或关闭立即停止语音，始终不覆盖当前表达。
- **理由：** AAC 播报既服务听觉也服务视觉理解，尤其在嘈杂环境、语音失败或面对面沟通时，大图和大字不能由一个后台 TTS 调用替代。平台只负责视觉和语音 adapter，可避免复制原 Dexie、AI Hook 与 React DOM 实现。
- **证据：** CBoard 挂载测试 `1 suite / 10 tests` 覆盖图片、打开、重播、完成、单次计数和不替换输出；扩大门 `63 suites / 425 tests / 3 snapshots` 与标准 production build 通过，主 JS 增加约 `490 B gzip`、CSS 增加约 `471 B gzip`，产物含全屏 Dialog 节点和样式。微信全量 `28 files / 109 tests`、TypeScript、ESLint、边界 `92 app / 22 core` 和 production build 通过；主包 `295,964 B`、照护分包 `1,447,071 B`、775 张图片 `953,152 B`，产物含 `phrase-playback-overlay/replay/close` 和安全区 CSS。
- **生效范围：** CBoard Web 与微信患者表达页的常用语播放生命周期、图文展示和 TTS 停止；不改变 saved phrase schema、当前 output、历史、接收端、匹配、AI、账号或 API。原 MVP 全屏播放的核心视觉语义现已迁移，但微信真机尺寸、滚动、读屏和触控仍待明确授权验收；本轮未打开或置顶开发者工具，未预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-19 11:56:41。

## 变动 62：CBoard 全仓测试基线恢复为可依赖质量门

- **意图：** 清除此前被局部通信回归掩盖的 CBoard 全仓测试失效，让后续图语家迁移可以区分真实业务回归、旧测试漂移与 Windows 环境锁文件。
- **决策：** 不修改生产业务语义；API 旧测试移除失效的 `jest-mock-axios` 请求队列，改为明确注入 HTTP mock 并真实等待、断言方法、路径、载荷、鉴权与未登录发网边界。WelcomeScreen、SpeechProvider、LanguageProvider 和 Logo 只同步现有正式组件/状态/action/资源契约，Speech action 测试隔离真实浏览器 TTS。
- **理由：** “测试进程崩溃”或“调用后没有断言”不能作为质量证据；同时，为通过测试而回退 ElevenLabs、语言字段或现有 Logo 会破坏 CBoard 底座。把平台依赖隔离在测试边界，才能保留全部上游能力并让未来 PR 可复核。
- **证据：** 四组初始失败已逐项复现；API 重写后 `27/27`，其余定点 `3 suites / 29 tests` 通过。最终 CBoard 全仓为 `150 suites / 933 tests / 72 snapshots`、退出码 `0`。`git diff --check` 无空白错误。标准构建只因现有进程锁住旧 `build/.well-known/assetlinks.json`、`.eslintcache` 与 `build/service-worker.js` 失败；隔离 `BUILD_PATH` 且关闭被锁 ESLint cache 后 Webpack 显示 `Compiled successfully`，独立 `sw-precache` 成功生成 `95,231 B` Service Worker，覆盖 `977 resources / 41.2 MB`。
- **生效范围：** CBoard 全仓测试与本地构建验收口径；不改变图语家业务、CBoard API 运行语义、微信源码或包体，不关闭或终止占锁进程。本轮全程后台执行，未启动、置顶或操控微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 12:22:44。

## 变动 63：原 MVP 下一词建议恢复为 Web/微信共享闭环

- **意图：** 补齐 PRD“暂存区为空显示最近使用，非空按最后一张图分类推荐高频相关图片，并排除已选图片”的迁移缺口，避免 CBoard 迁移只保留常用排序而没有表达过程中的即时推荐入口。
- **决策：** 以原 `SuggestionStrip` 的两段纯逻辑为基线，在 CBoard 中性层重建 BoardDTO 版本的 `buildExpressionPictogramSuggestions`；最近使用按 `lastUsedAt`，下一张按同类 `usageCount`，并以最近时间和 CBoard 显示顺序稳定兜底。CBoard Web 和 Taro 微信各自渲染最多 6 张推荐图，点击均走现有 12 张上限、使用计数和表达 pipeline。
- **理由：** 原 Dexie 查询和 React 组件不能跨平台复用，但业务排序规则可以；共享纯核心能够防止 Web 与微信再次出现迁移语义漂移，也不会把 React DOM、Material UI 或微信 API 带入中性层。
- **证据：** 原 `docs/prd.md`、`src/components/SelectionTray/SuggestionStrip.tsx` 与 `src/components/SelectionTray/__tests__/suggestion-logic.test.ts` 已逐项核对。CBoard 全仓 `151/939/72` 与标准 build 通过；微信 `29 files / 111 tests`、类型、Lint、`93 app / 23 core` 和 production build 通过。未压缩主包 `295,964 B`、照护分包 `1,451,374 B`、775 张图片 `953,152 B`，无新增依赖、插件或媒体；`sub-vendors.js 300 KiB` 通用警告继续保留。
- **生效范围：** 覆盖矩阵中的图片使用统计、最近使用和下一词建议，从“原 MVP 已有”推进为“CBoard Web 与微信代码/构建闭环”；真实模拟器 UI 因当前无 runtime 且禁止抢占前台窗口而未在本轮运行，不冒充真机通过。开发者工具以后可通过后台 CLI/Skill 操作，但不得置顶或抢焦点；本轮未预览、上传、发布、提交或推送。性能依据为[微信官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5.6），2026-07-19 13:01:14。

## 变动 64：PRD 跨分类搜索从未接线要求推进为双端闭环

- **意图：** 补齐原 `docs/prd.md` 第 47 至 51 行定义的“表达模式跨分类搜索图片、中文标签与同义词、防抖减少本地扫描”，避免患者只能逐层进入 CBoard 子板寻找图卡。
- **决策：** 将搜索实现为 CBoard 中性纯函数，复用 BoardDTO 图卡目录、中文概念 profile、同义词和排除词；`relatedTerms` 继续只承担策展关系，不进入搜索。标签精确优先于同义词和部分匹配，导航图卡永不作为结果。CBoard Web 与微信各自提供 250ms 防抖入口，搜索结果点击进入现有表达、计数、候选句和恢复链。
- **理由：** 原仓库只有 PRD 与未被主网格使用的 `useDebounce`，不能评价为“原实现已完成”；本次按已决策意图补齐，而不是复制一个不存在的闭环。共享算法还能防止 Web 与微信对“汤匙/勺子”等中文同义词再次产生漂移。
- **证据：** 纯核心覆盖全角/大小写规范化、跨板同义词、导航排除、排除词、关联词不匹配、排序和限制；Web 组件真实验证 250ms 前无结果、到时出现“勺子”并加入表达。CBoard 全仓 `152/946/72` 与标准 build 通过；微信默认 44 板 fixture 验证打包图片，全量 `30/113`、类型、Lint、`94/24` 和 production build 通过。
- **生效范围：** 覆盖矩阵中的“图片搜索”要求从“原 PRD 已决策但主 UI 未接线”推进为“CBoard Web 与微信代码/测试/构建闭环”；不改变接收端在线补图、自动 matcher、相关词、Board 编辑或云服务。微信主包 `295,964 B`、照护分包 `1,457,219 B`、图片 `953,152 B`，无新增依赖、插件或媒体；未启动或置顶开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 13:27:32。

## 变动 65：首次使用引导从单端实现推进为共享双端闭环

- **意图：** 补齐 PRD 第 246 至 250 行定义的首次自动引导、三步沟通说明、AI/离线边界和设置中重看入口，避免 CBoard Web 只有完成字段而没有实际 UI。
- **决策：** 以原 `OnboardingModal.tsx`、`SettingsDrawer.tsx` 和微信现有 `CommunicationOnboarding.tsx` 为证据，将三项说明提炼为 CBoard 中性纯内容。Web 首次进入表达或接收时显示独立全屏界面，完成后写既有本地偏好；设置页可重看。微信保持既有首次判断、全页样式和品牌抬头，只改为消费共享内容。
- **理由：** 原 MVP 已验证首次标记与重看交互，微信也已有运行入口；真正的遗漏是 CBoard Web 未接线和两端文案可能漂移。复用纯内容而不复制 React DOM/Zustand/Tailwind，既保留 CBoard 底座，也符合微信轻量包体和未来 upstream 中性边界。
- **证据：** 原实现与 PRD 已逐项核对。CBoard `154/950/72`、标准 build 与 Service Worker 通过；微信 `31/114`、类型、Lint、边界 `95/25` 和 production build 通过。微信主包 `295,964 B`、照护分包 `1,457,498 B`，无新增依赖、插件、图片或音频。
- **生效范围：** 覆盖矩阵的首次使用引导与易用性要求从“微信已有、Web 仅字段”推进为“共享内容 + 双端入口 + 持久完成/重看”。紧急求助不被引导阻挡；本轮只做后台状态检查，不打开或置顶开发者工具，不把未执行的模拟器/真机视觉、读屏和触控写成已通过，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 13:50:57。

## 变动 66：候选句反馈从 issue 字段推进为跨端可用闭环

- **意图：** 落实真实 GitHub issue #12 以及 #22 的候选反馈子范围，让患者或照护者在实时表达与历史复盘中评价候选句，并让评价实际影响后续 AI，而不是只增加一个无人消费的字段。
- **决策：** 中性核心定义候选反馈、切换/取消、未确认草稿和 expression record；Web 与微信各自提供独立“有帮助/不符合”按钮，评价不调用 TTS。确认前只在本机保存草稿，确认后写入历史并进入既有账号同步；历史照护视图复用同一字段。AI 请求只携带有界的 `up/down` 样本，API 明确将其视为偏好数据而非指令。
- **理由：** #12 明确要求即时持久化、44px、未登录提示、切换/取消和不中断播报；#22 又要求历史入口与后续 AI 消费。缺少任一层都不能称为功能闭环。统一 schema 还能避免 Web、微信和服务端产生三套反馈语义。
- **证据：** CBoard Communication Support `59 suites / 417 tests`，修复新增 ESLint 警告后 production build 为 `Compiled successfully`；微信 `31 files / 114 tests`、TypeScript、ESLint、边界 `95 app / 26 core` 与 production gate 通过，主包 `295,964 B`、照护分包 `1,467,003 B`、775 张图片 `953,152 B`；API helper/controller/route/provider `14 passing`。开发者工具状态为登录有效、Skill `0.3.0` 一致，但项目无 runtime。
- **生效范围：** CBoard Web、Taro 微信表达候选与照护历史、共享 repository/schema v5、`cboard-api` sentence context 和 Swagger。#22 的“从历史列表直接编辑任意旧接收记录”及真实手机触控/播报并行仍未完成；照护分包接近官方 1.5 MB 建议线，后续新增功能应优先再分包或异步化。本轮未强制开窗、未置顶、未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 14:56:48。

## 变动 67：任意历史接收记录修正成为追加式跨端闭环

- **意图：** 补齐 GitHub issue #22 剩余核心，让照护者可以从历史列表直接修正任意已确认接收记录的图片序列，同时保留患者当时看到的事实与每一次纠错证据。
- **决策：** 保持实时 `draft` 保护不变，新增只接受 `confirmed receive` 的历史修正入口；同一 receiver correction schema 增加 `caregiver_history_review` 上下文及 `revisionBefore/revisionAfter`，快照保存 labels、非内嵌图片 output 和 pictogramSequence。repository 继续独立追加 corrections，历史显示只通过最新修订投影，不改写原 history/receiver record。Web 与微信照护历史均复用现有图板目录和移动、换图、插入、删除纯函数。
- **理由：** 直接覆盖历史会抹掉患者实际看到的内容，也会让后续纠错学习失去证据；复制第二套“历史编辑记录”又会导致 Web、微信和实时接收语义漂移。追加审计加只读投影可以同时满足可修正、可追溯与既有本机隐私边界。
- **证据：** CBoard 纯核心、repository 与 Web 管理组件聚焦 `3 suites / 21 tests`，Communication Support 扩大门 `59 suites / 421 tests`，production build `Compiled successfully`，主 JS 增量约 `1.71 kB gzip`、CSS 增量 `99 B`，Service Worker 为 `977 resources / 41.3 MB`。微信 TypeScript、ESLint、`32 files / 115 tests` 与 production build 通过；主包保持 `295,964 B`，照护分包 `1,477,644 B`，775 张图片共 `953,152 B`；既有 `sub-vendors.js 306 KiB` 与无异步 chunk 警告保留。
- **生效范围：** CBoard `receiverLifecycle/storage/repository`、Web 照护历史管理、Taro 微信 `HistoryManager` 与共享类型；不修改原确认记录、BoardDTO/TileDTO、语音、候选算法、AI API 或云同步策略。历史 corrections 仍只在本机；微信照护分包已接近官方 1.5 MB 建议线，后续应优先拆分或异步化。本轮只做后台代码、测试和构建，未启动、置顶或抢占开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 15:34:15。

## 变动 68：完整图片库 ZIP 备份与恢复成为双端闭环

- **意图：** 完整落实 GitHub issue #24，让用户能够把本机自定义图片或完整图库连同标签、同义词、分类、使用次数、板布局和真实图片文件导出，并在同一或另一设备恢复。
- **决策：** 建立中性 `PictureLibraryArchive v1`；导出范围分为 `custom/full`，重复 ID 策略分为 `merge/skip`。归档剥离旧 patient/workspace 身份；导入先校验清单和全部图片字节，再写入当前本机，失败时回滚 storage 并清理暂存文件。CBoard 复用既有 Settings 导入导出和 OBZ 回退；微信把 JSZip、775 张备份资源和页面隔离到独立 `packages/backup` 分包。
- **理由：** 只导出历史文本、常用语 JSON 或 OBF/OBZ 不能恢复设备私图、运行时图符和完整本地元数据；直接把 ZIP 依赖放进微信主包又会拖慢核心沟通首屏。共享格式与事务边界可以同时满足跨端兼容、数据完整性和包体要求。
- **证据：** CBoard 全仓 `158 suites / 972 tests / 72 snapshots`、`git diff --check` 和标准 production build 通过，主 JS gzip 约 `1.62 MB`，Service Worker 预缓存约 `41.3 MB`。微信 `35 files / 121 tests`、TypeScript、ESLint、`107 app / 26 core` 边界和 production quality gate 通过；未压缩主包 `296,078 B`、照护分包 `1,486,665 B`、备份分包 `1,347,067 B`，两个资源分包各含 775 张图片共 `953,152 B`，JSZip 只出现在备份页产物。
- **生效范围：** CBoard Web Settings、本机 communication repository、Taro 微信患者/接收图库读取、独立备份分包及文件/storage adapters；不包含沟通历史、语音、账号密钥或云同步，不改变 OBF/OBZ 既有语义。微信真机分享、文件选择、跨设备恢复和大图库耗时仍待人工验收。本轮只做后台代码、测试和构建，未置顶或抢占开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 16:50:21。

## 变动 69：微信恢复默认图库入口补齐原 MVP 可逆性

- **意图：** 恢复原 PicInterpreter 设置页“重置默认词库”的可逆能力，让用户导入完整图库后仍能在界面中回到应用内置 CBoard 图库。
- **决策：** 在独立图库备份页增加第三步“恢复内置图库”。执行前必须二次确认，并明确建议先生成完整 ZIP；service 只调用 `boardStore.reset()` 清除 BoardDTO 快照覆盖，不写个人图片、缺词、排序、历史或账号 storage。CBoard Web 不复制这一按钮，因为其 Board/Tile 是成熟主数据而非可重建 seed。
- **理由：** 导入功能没有安全退出会把用户锁在错误但格式合法的图库中；反过来，把旧 Dexie 的清表重灌直接搬到 CBoard 又会破坏底座。平台差异化实现可以保留同一产品意图，而不伪造相同存储语义。
- **证据：** backup service 定向 `4/4` 验证成功、失败和个人数据零写入；微信全量 `35 files / 123 tests`、TypeScript、ESLint、`107 app / 26 core` 边界和 production gate 通过。未压缩主包 `296,078 B`、照护分包 `1,486,665 B`、备份分包 `1,349,021 B`；775 张备份图片仍为 `953,152 B`。
- **生效范围：** Taro 微信 `packages/backup` 页面、图库 store 和患者/接收页返回后的图库重载；不删除个人替换图片、补图、沟通历史、账号配置或排序记录，不修改 CBoard Web Board，不上传云端。本轮后台 Skill 只确认登录和版本对齐；因无 runtime 且禁止抢焦点，没有打开项目窗口、预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 17:09:32。

## 变动 70：个人熟悉图片来源与使用说明完成双端闭环

- **意图：** 修复迁移后个人熟悉照片只覆盖图像、却继续显示原 CBoard 公共图符提供方和许可的语义错误，并恢复图语家对自定义图片来源可追溯、可人工修正的要求。
- **决策：** 在共享个人图片偏好中持久化设备私有 `pictogramAttribution`；旧记录自动获得诚实的“未声明公开许可”默认说明。CBoard Web 可在选择照片前填写或事后单独修改，微信已启用照片可进入“编辑说明”。图片应用到图板和表达输出时同步覆盖旧署名，完整图库 ZIP 往返保留说明，公开同步仍过滤所有 `device-private` 元数据。
- **理由：** 家庭照片不能被错误标成 Mulberry、ARASAAC 或 CBoard 图符，也不能因为用户写了一段说明就被当作已核验的公共授权。把来源说明限定为本机元数据，可以修正署名、支持备份迁移，同时继续执行“家庭照片不上传”的隐私决策。
- **证据：** CBoard 定向 `4 suites / 18 tests`，全仓 `158 suites / 975 tests / 72 snapshots` 和标准 production build 通过。微信全量 `35 files / 123 tests`、TypeScript、ESLint、`107 app / 26 core` 与 production build 通过；兼容检查曾真实拦截新增可选链，改为显式判断后通过。未压缩主包 `296,078 B`、照护分包 `1,490,524 B`、备份分包 `1,350,055 B`。
- **生效范围：** 原实现“自定义图源与许可说明”从文档要求推进为 CBoard Web、微信小程序、共享本地契约和 ZIP 备份闭环。说明不等于法律授权证明，不进入账号云同步或公共图库；照护分包已非常接近 1.5 MB 建议线，后续新增低频功能必须优先独立分包。本轮开发者工具只允许后台操作，实际未打开或置顶窗口，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 17:45:38。

## 变动 71：个人熟悉图片低频管理从核心照护包拆出

- **意图：** 回应变动 70 已确认的包体风险，在不删减图语家设备私图闭环的前提下，为患者表达和双向接收主链保留后续增长空间。
- **决策：** “个人图片”继续从照护工具进入，但页面代码迁入已有 `packages/backup`；该分包已持有 ZIP 工具和 775 张默认图，因此不再建立第三个图片区。纯适配器只把 `/packages/caregiver/assets/cboard-default/` 重写到备份分包，设备私图、本地文件、来源说明和 repository 契约原样复用。返回时由患者页 `useDidShow` 重载偏好并更新当前表达快照。
- **理由：** 个人图片管理属于低频照护操作，不能挤压每次沟通都会加载的患者/接收代码；第三个独立分包会再复制约 `953,152 B` 离线图，得不偿失。复用现有低频图库分包可以在不丢离线能力的情况下实现按需加载。
- **证据：** 新增路径适配 `2 tests`，微信全量 `36 files / 125 tests`、TypeScript、ESLint、`111 app / 26 core`、44 boards / 825 tiles / 775 images 和 production quality gate 通过。主包 `296,154 B`、照护分包 `1,482,197 B`、备份分包 `1,389,866 B`；管理器标识只出现在备份产物。WechatIDE 后台状态确认登录和 Skill 正常，但项目没有 runtime，为遵守“不置顶、不自动打开窗口”没有执行会调用 `open_project_window` 的完整 E2E。
- **生效范围：** 覆盖矩阵中的个人熟悉图片、微信性能门和低频照护管理架构；CBoard Web 实现、设备私图数据、ZIP 契约、账号隐私边界和核心双向沟通语义不变。本轮未预览、上传、发布、提交或推送，真实模拟器和手机导航待已有窗口可后台复用时验收。
- **记录：** Codex（GPT-5.6），2026-07-19 18:07:00。

## 变动 72：表达历史保存失败保护完成双端闭环

- **意图：** 落实 GitHub issue #29，确保本地 storage 满额、不可用或 repository 拒绝写入时，患者正在使用的图片序列和候选句不会被误清空或假装保存成功。
- **决策：** 在中性表达管线增加安全持久化边界；只有持久化函数返回真实记录才进入确认态。空返回或异常统一视为失败，Web 显示可重试错误并保留图片、候选、所选句和确认按钮；微信确认与已确认候选反馈回写复用同一函数，保留既有失败提示和当前表达。
- **理由：** 当前表达是沟通主数据，历史只是附属记录。持久化失败不应中断患者当下沟通，也不能用“已确认”掩盖数据未落盘；将规则放入纯核心可防止 Web 和微信再次漂移。
- **证据：** 纯核心覆盖成功、空返回、抛异常和输入不可变；Web 组件分别模拟空返回与 quota 异常，均保留 2 张图片、4 条候选并可第二次确认。CBoard 全仓 `158 suites / 978 tests / 72 snapshots`、标准 production build 通过；测试可读性清理后组件 `15/15` 再次通过。微信 `36 files / 125 tests`、TypeScript、ESLint、边界 `111 app / 26 core` 和 production build 通过，主包 `296,154 B`、照护分包 `1,482,340 B`、备份分包 `1,389,866 B`。
- **生效范围：** CBoard Web 与 Taro 微信患者表达的历史确认和候选反馈回写；不修改 expression/history schema、候选生成、语音、账号、云同步或 API。本轮未打开、置顶或抢占微信开发者工具，没有预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 18:26:19。

## 变动 73：接收场景与真正的新对话上下文闭环

- **意图：** 落实 issue #13/#23，让照护者显式选择当前沟通场景，并确保“新对话”不会继续向 AI 泄漏上一会话历史或场景。
- **决策：** 共享核心只接受 `hospital/home/rehab_clinic` 三个稳定场景 ID；同一按钮再次点击清除。场景属于活动 conversation session，进入受限 AI payload；Web 与微信均二次确认后才新建会话、清空当前工作区和场景，历史继续保留。微信表达页改为读取 `loadConversationContext`，不再直接发送全局最近历史。
- **理由：** 任意场景字符串和 GPS 会扩大隐私及提示注入风险；只换 session ID 却发送旧历史属于假清空。把场景、会话和 AI 上下文固化在同一纯核心可避免 Web、微信和 API 漂移。
- **证据：** CBoard 聚焦 `5 suites / 45 tests`、全仓 `158 suites / 980 tests / 72 snapshots` 和 production build 通过。微信 `36 files / 125 tests`、TypeScript、ESLint、边界 `111 app / 26 core` 和 production build 通过；主包 `296,154 B`、照护分包 `1,486,889 B`、备份分包 `1,390,664 B`。API 场景 helper 聚焦 `6 passing`；全量旧控制器测试因本机未运行 MongoDB 失败，未伪装为功能回归。
- **生效范围：** CBoard Web 双向沟通、Taro 微信表达/接收页、共享 repository 和 `cboard-api` 候选句提示；不读取 GPS、不删除历史、不新增依赖、插件或媒体。本轮只在后台运行命令和构建，没有打开、置顶、聚焦或抢占微信开发者工具窗口，也没有预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 18:55:01。

## 变动 74：异步双向分享完成 Web 与微信迁移

- **意图：** 落实 issue #18，让患者把当前确认句带到应用外，也让照护者把已经确认的图片顺序生成一张可读图片分享，同时不打断正在进行的 AAC 沟通。
- **决策：** 新增平台无关分享文档、布局和 Canvas 渲染契约。表达端只分享当前选中句；接收端保持全部确认图顺序，显示编号、照护者原文和逐图来源许可，单图加载失败保留问号位置，非方图等比缩放。Web 使用系统分享并回退下载；微信文字使用剪贴板，图片使用原生分享菜单。
- **理由：** 浏览器与微信的系统分享能力不同，强求相同 API 会产生不可用入口；把内容与布局固化为纯核心、平台只负责交付，既能复用又能确保分享失败、用户取消或图片缺失不会清空表达、关闭接收页或触发语音。
- **证据：** CBoard 分享聚焦 `6 suites / 60 tests`，全仓 `160 suites / 992 tests / 72 snapshots` 和 production build 通过。微信 `37 files / 128 tests`、TypeScript、ESLint、`114 app / 26 CBoard core` 边界与 production gate 通过；主包 `296,154 B`、照护分包 `1,494,853 B`、备份分包 `1,390,664 B`，生产产物包含 `showShareImageMenu`、`expression-share-button` 和 `receiver-display-share`。
- **生效范围：** CBoard Web 双向沟通面板、Taro 微信患者表达与照护接收、共享图源许可和 Canvas 渲染；不改变 matcher、分词、TTS、历史、账号、云同步或 API，不新增依赖、插件或媒体。照护分包距项目 `1,500,000 B` 预警线只剩 `5,147 B`，下一项低频功能必须进入备份/独立分包。本轮未打开、置顶或聚焦微信开发者工具，没有预览、上传、发布、提交或推送；Web 移动浏览器与微信真机分享仍待人工验收。
- **记录：** Codex（GPT-5.6），2026-07-19 19:40:29。

## 变动 75：issue #45 完整本机备份与隐私清除完成双端闭环

- **意图：** 让用户在设备交接、隐私清理或故障恢复前，能够先导出真正完整的本机数据，并明确区分“只清私人图片”“清全部本机数据”和“删除云端账号”。
- **决策：** 新增共享 `LocalDeviceData v1` 清单与私人图片清除计划，完整 ZIP 复用 `PictureLibraryArchive v1` 的图板、图片、许可和 scope，再附加常用语、历史、接收记录、修正记录和待同步反馈。Web 清 IndexedDB/localStorage/sessionStorage；微信清 storage、保存文件、图库目录和已生成备份。两个清除范围均二次确认，失败时不声称成功。
- **理由：** 旧图库 ZIP 与历史文本各自只覆盖一半数据，无法承担设备交接；把平台文件系统写进共享核心又会破坏跨端复用。纯数据清单、平台端口和低频 UI 分层可以保留 CBoard 成熟底座，并遵守微信包体要求。
- **证据：** CBoard 聚焦 `5 suites / 36 tests`、全仓 `162 suites / 999 tests / 72 snapshots` 与标准 production build 通过；微信聚焦 `2 files / 9 tests`、全量 `38 files / 133 tests`、TypeScript、ESLint、边界 `117 app / 26 core` 与 production build 通过。未压缩主包 `296,154 B`、caregiver `1,494,954 B`、backup `1,401,424 B`，均低于项目十进制 `1,500,000 B` 预警线。
- **生效范围：** CBoard Web 照护管理、本机 ZIP 和浏览器存储；微信 backup 分包、Taro 文件/storage 端口和共享 repository。当前不实现账号删除 API、云端同步数据删除、选择性记录删除或删除审计；不新增依赖、插件或媒体。本轮仅后台命令，允许后台操作开发者工具但未实际调用，未置顶、聚焦或抢占窗口，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 20:18:20。

## 变动 76：低频设备导出按需加载并补齐微信生成文件清理

- **意图：** 在 issue #45 功能完整的前提下，消除低频 ZIP 导出对 CBoard 主链包体的静态占用，并确保微信“清全部本机数据”不会遗漏图语家历史和常用语导出文件。
- **决策：** CBoard Web 在用户实际点击导出时才动态载入 `localDeviceDataExportAdapter`；微信文件端口同时识别 `picinterpreter-*` 英文文件名和 `图语家_对话记录_*`、`图语家_常用语_*` 中文文件名，统一纳入应用已知生成文件清理。
- **理由：** 静态引入低频 ZIP 代码会增加每次进入 CBoard 的主 JS，而微信原有英文前缀规则无法覆盖历史与常用语服务真实生成的中文文件名；两者都会形成“功能看似完成、实际仍有性能或隐私遗漏”的假闭环。
- **证据：** CBoard 动态加载改动聚焦 `2 suites / 27 tests` 通过，标准 production build 成功，主 JS 相对静态版本减少约 `3.17 kB gzip`，低频导出形成约 `3.52 kB` 独立 chunk；此前全仓门仍为 `162 suites / 999 tests / 72 snapshots`。微信最终全量 `38 files / 134 tests`、TypeScript、ESLint、边界 `117 app / 26 core` 与 production quality gate 通过；未压缩主包 `296,154 B`、caregiver `1,494,954 B`、backup `1,401,568 B`。
- **生效范围：** 只调整 CBoard Web 设备 ZIP 代码加载时机，以及微信对本应用已知导出文件的识别范围；不改变备份格式、清除确认、业务数据语义、云端账号或同步数据。本轮未打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 20:28:12。

## C. 此前漏号 issue 的逐项补漏

| Issue | 意图 | 决策 | 理由 | 原实现 | CBoard Web | 微信 PoC | 证据 | 生效范围 / 下一步 |
|---|---|---|---|---|---|---|---|---|
| [#1](https://github.com/picinterpreter/picinterpreter/issues/1) | 维护后端、图库、账号、部署和计费总路线图 | 将其作为治理索引，不把路线图复选框直接当功能验收；复用 CBoard 账号、腾讯云短信、Azure 私有快照、Mongo 原子限流、服务商 usage 以及现有 PayPal/Google Play/App Store 订阅基础，分别完成手机号归属验证、普通用户短信登录/找回、请求保护、Token 账本/月额度和订阅安全边界 | 路线图包含已被“CBoard + cboard-api + 独立微信端”重做的技术决策；账号、私有存储、计量、额度、套餐目录、支付和退款必须分层验收。现有订阅代码可复用，但原客户端可控归属/状态/交易必须先加固，不能用只读状态或一次供应商请求冒充商业闭环 | `部分` | `部分`：成熟 Web/桌面/PWA、账号、短信确认/登录/找回、私有图库快照、增强状态、Token 剩余额度、订阅界面及 PayPal 用户/计划绑定已接入 | `部分`：核心沟通、必填手机号验证、短信登录/找回、私有图库备份、增强状态、Token 剩余额度和脱敏只读订阅状态已接入 | GitHub REST 在线核验（2026-07-22）、变动 125/156/158/161/164/166/167/168/169/297/298/299/300、cboard-api User/phone verification/password reset/private library/usage/quota/subscriptionSecurity、CBoard Subscribe 和微信 account/management UI 及测试/build | 当前 issue 正文要求的后端密钥、豆包语音后端化、手机号验证、自定义图片服务器存储和 Token 计量/限流/月额度已有代码级全部或部分覆盖；视觉 OCR/元数据/生成图已进入同一真实认证与额度组合门。真实生产部署、供应商凭据与质量、逐图/公开云图库、货币账单、真实商店购买、国际号码和物理设备仍未完成。微信支付不在当前 issue 正文中，属于商业化阶段 3 |
| [#2](https://github.com/picinterpreter/picinterpreter/issues/2) | 建立后端并迁移到 Next.js | 保留“前后端分离”意图，但以 CBoard React、cboard-api 和 Taro 替代旧 Next.js 单体决定 | 当前目标是完整复用成熟 CBoard 全平台体系，不应为复刻旧技术选型而回退 | `已关闭` | `已替代实现` | `不适用` | 底座决策文档、三个 fork 工作树 | 不再迁回 Next.js；后端能力继续进入 cboard-api |
| [#3](https://github.com/picinterpreter/picinterpreter/issues/3) | API key、token 和模型调用留在后端 | 网络 AI、在线图源、去背景、粤语文字规范化、粤语音频 ASR 和服务端 TTS 必须由 cboard-api 白名单路由；ASR 可在腾讯云 `16k_yue` 与火山引擎 `bigmodel` 间选择；本地规则、原图路径与平台原生语音始终可独立工作 | 客户端不能携带生产密钥，模型、图片处理或语音提供方失败也不能阻断沟通 | `部分` | `部分（候选句、在线补图、OCR、视觉元数据建议、AI 图符生成、去背景、粤语文字规范化、两种粤语音频 ASR 与 TTS provider 已后端化）` | `部分（调用同一 API 并安全降级；接受两种中性 ASR engine，WechatSI 优先、认证服务端 TTS 后备）` | 两种 ASR provider、TTS/图片/AI provider、Swagger 与两端 ports；变动 298 火山 ASR HTTP/Mongo `2/2`、变动 299 腾讯官方 SDK TC3 HTTP/Mongo `2/2`、变动 300 视觉 AI HTTP/Mongo `3/3`，API `377/377` | 两种 ASR 与视觉 AI 的代码、密钥隔离和官方 SDK 组合门已覆盖；生产视觉、去背景、腾讯云/火山引擎语音和 TTS provider 凭据仍未配置，必须分别完成真实服务验收 |
| [#4](https://github.com/picinterpreter/picinterpreter/issues/4) | 语音后遇到缺图时自动联网找候选 | 自动触发搜索可以保留，但外部图必须显示来源并由照护者确认后离线保存 | “自动填进患者序列”可能产生危险错图；自动发现加人工确认保留原意且更安全 | `旧 HTML 有原型` | `已验证（安全等价实现）` | `已验证（代码/build；真实外网待验收）` | MissingTokenQueue、ARASAAC/OpenSymbols adapters、来源许可和缓存测试 | 真实合法域名、服务端 secret 和真机网络仍由 #8/#67 验收 |
| [#5](https://github.com/picinterpreter/picinterpreter/issues/5) | 识别粤语等方言并归一化为可匹配普通话词语 | 固化“粤语录音 → 有界服务端 ASR 原文 → 可编辑原文 → 可选文字规范化 → 人工确认 → 手动生成图片”；Web 使用显式音频上传，微信使用原生 `RecorderManager`，服务端可选腾讯云 `16k_yue` 或火山引擎 `bigmodel`，两端都逐次授权且禁止 ASR 后自动匹配 | 方言音频识别、文字规范化和图片匹配是三个独立 port；分层、保留原文和人工触发下一步可避免供应商误识别直接变成危险错图 | `仅需求` | `部分（代码/测试/build 已验证）`：音频选择、单次授权、鉴权上传、两种 provider 响应校验、可编辑回填和禁止自动 matcher 已覆盖；真实浏览器录音质量待验收 | `部分（代码/测试/build 已验证）`：16 kHz 单声道 MP3 录制、3 MiB 上限、上传、取消、临时文件清理、两种 engine 响应、可编辑回填和禁止自动 matcher 已覆盖；真机供应商语料待验收 | `dialectAudioRecognition.js`、两种 ASR provider、Web/API/微信 adapters 与 UI；火山/腾讯认证 HTTP/Mongo 各 `2/2`、聚焦 `31/31`、API `377/377`；两份 2026-07-29 ASR 验收文档 | 配置任一正式 ASR 凭据后，用真实粤语录音分别验收 Web 上传和微信真机；腾讯路径还会在 SDK 前执行 Base64 后 3 MiB 上限，火山路径支持 MP3/WAV/OGG Opus。在此之前只证明认证与协议工程闭环，不声称真实识别质量已通过 |
| [#7](https://github.com/picinterpreter/picinterpreter/issues/7) | GitHub 访客无需账号即可体验真实双向沟通 | 复用 CBoard 游客板和本地 fallback，不复制第二套假数据；独立 `/demo` 在创建 store 前切换会话级内存存储，显示常驻横幅并隐藏账号、云同步和管理入口；内部板切换继续使用 CBoard 状态但保持 `/demo` 地址 | 当前“能游客使用”不等于隔离演示；演示数据也不能污染正常 CBoard 的 IndexedDB、localStorage 或远端账号 | `仅需求` | `已验证（生产浏览器三视口）` | `不适用`：小程序本身可免登录使用，不是 GitHub Web demo | demoMode/App/Board/Navbar 容器 `23 tests / 2 snapshots`；production build；真实患者表达、照护接收、全屏反馈与刷新隔离在 desktop、Pixel 5 竖屏、横屏 `3/3 PASS`，连同原离线闭环共 `6/6 PASS` | 本地生产静态产物已验收；公开 GitHub Pages URL、真实辅助技术和物理移动设备仍待发布后验证 |
| [#9](https://github.com/picinterpreter/picinterpreter/issues/9) | 新增、删除、调整图片分类并改善入口 | Web 直接复用 CBoard Board/文件夹/Tile 编辑；微信以个人板块作为可维护分类，在低频 backup 分包提供新增、改名、上下排序、板间文件夹和空板安全删除，内置板继续只排序/隐藏；图片库中的管理入口在有无个人板时始终可达 | 完整复制 CBoard 编辑器会增加包体，但只读导航又不能满足照护者建立个人词库；个人板块契约可补齐管理闭环，同时避免误删默认图库和已有图卡；管理入口不能在创建第一块板后消失 | `仅需求` | `已由 CBoard 原生能力覆盖` | `已验证（代码/测试/build/官方模拟器；物理真机待验收）`：家属可持续进入管理页，新建、改名、排序、加入/移除板间入口和删除空板；患者可从首页文件夹进入个人板；含图卡或跳转的板仍拒绝删除 | `boardManagement.js`、`PersonalImageManager.tsx`、微信 boards 页面和 `weapp-skill-smoke.mjs`；聚焦 `2 files / 4 tests`、全量 `77 files / 343 tests`、质量门 `7/7`、TypeScript、ESLint、`214 app / 32 core`、production build；background-only E2E 验证完整生命周期及原 19 项 storage/图库文件恢复 | #9 工程与官方模拟器闭环已完成，并修复创建首块板后管理入口不可达的问题；物理真机输入、长列表滚动、触控和大量板性能仍待验收。完整 OBF/OBZ 导入继续由 #30 承担 |
| [#14](https://github.com/picinterpreter/picinterpreter/issues/14) | 竖屏单列纵向、横屏单行横向的连续大图序列 | Web 使用无换行 flex 与 orientation media query；微信使用原生 ScrollView、同一 CSS 契约和 `pageOrientation: auto` | 多行网格会破坏阅读顺序；平台布局应复用产品契约而非复制 React DOM | `仅需求` | `已验证（代码/测试/build）` | `部分（代码/测试/build 与产物已验证，真机旋转待验收）` | ReceiverDisplay 测试、CBoard `162/1000/72`、微信 `39/136`、产物含 `receiver-display-sequence` 和 `pageOrientation:auto` | 真实手机横竖屏切换、触控和安全区仍由 #67 验收 |
| [#17](https://github.com/picinterpreter/picinterpreter/issues/17) | 完全断网时仍可语音识别 | 不打包 Whisper/WASM/Vosk/sherpa 模型；浏览器继续复用 Web Speech 设备内语言包实验 API，Cordova Android/iOS 复用 MIT 插件 fork 并只在系统明确报告可用时选择专用设备内 recognizer；本机模式不可用时明确失败，不静默联网。微信继续不冒充离线 ASR | 系统设备内能力不会把 42–300 MB 级模型带入 CBoard/微信包体；浏览器、Android/iOS 设备和语言包仍各有可用性边界，必须由真实设备验证 | `已关闭但此前未证明运行闭环` | `部分（代码/测试/Web build/Android 核心 APK；真机断网待验收）`：统一 hook 在 Android/iOS 插件完整时使用原生端口，Electron/Web 保持浏览器端口；设备内不可用禁止在线降级。除最小插件烟测外，当前 CBoard Web、官方 Cordova Android 壳和设备内语音插件已形成无 Firebase 核心 Debug APK | `主动延期`：WechatSI 与现有方言服务仍是在线能力，文字输入和可编辑分词继续作为离线底线 | Android/Apple 官方 API、MIT `cordova-plugin-speechrecognition` fork、`cordovaSpeech.js`；插件 4/4，CBoard 186 suites / 1230 tests / 72 snapshots、production build；最小插件 APK 3,452,083 B；核心应用 APK 57,903,542 B / SHA-256 `52FA0AB41702FAF29DCF4B8510CF8BEC48FDC9B3191EDBC3E291F639B339E8B7`，包内主 bundle 与当前 build 哈希一致 | 在具备本地普通话语言包的 Android 12+/iOS 13+ 设备和支持实验 API 的桌面浏览器上分别切断网络做真实麦克风验收；核心 Debug APK 只在隔离副本省略 Firebase，未安装、未运行且不是正式发布包。正式 Firebase 完整包仍需真实 `google-services.json`，iOS 仍需 Xcode |
| [#20](https://github.com/picinterpreter/picinterpreter/issues/20) | 拍照后自动建议标签、同义词和分类 | 视觉结果只能异步预填空白字段，必须由照护者编辑确认；模型调用留在 cboard-api，原图只以内存 Data URL 单次中转且不落盘 | 自动元数据可省操作，但不可覆盖人工输入、直接污染图板或无同意上传家庭照片 | `仅需求` | `已验证（代码/测试/build/认证 HTTP；真实视觉质量待验收）` | `已验证（手工新增闭环；AI 代码/测试/build；真实提供方与真机待验收）` | API `/gpt/communication/pictogram-metadata`、共享 TileDTO、Web TileEditor、微信个人图卡编辑器；官方 OpenAI SDK Images `6/6`，视觉 HTTP/Mongo `3/3`，Data URL/无文件名/无密钥/私密响应与用量结算均有断言 | 工程级视觉 provider 组合门已完成；配置正式 API URL 和支持图片输入的模型后做真实家庭照片准确率、保留政策、延迟和费用验收。AI 不可用时继续保留照片和手工填写路径 |
| [#21](https://github.com/picinterpreter/picinterpreter/issues/21) | 从照片/截图 OCR 文字，再进入既有文字到图片管线 | OCR 只作为输入 adapter；识别文字必须先显示、可编辑，再由用户触发现有 matcher；成功响应禁止缓存 | 复用成熟 matcher 可避免第二套分词；未经复核直接出图会放大 OCR 错误，敏感截图也不能被中间缓存 | `仅需求` | `已验证（代码/测试/build/认证 HTTP；真实视觉质量待验收）` | `已验证（代码/测试/build；真实视觉提供方与真机待验收）` | `cboard-api` 内存 OCR、Web 图片识字对话框、微信独立 OCR 分包；普通用户真实登录后 HTTP 200、匿名 403、原图 Data URL 字节一致、`sourceStored:false`、`no-store, private`、20 token 结算 | 工程级 OCR provider 组合门已完成；部署正式模型后用真实照片分别验收浏览器和真机。识别结果继续禁止自动分词、匹配、保存或发送 |
| [#25](https://github.com/picinterpreter/picinterpreter/issues/25) | 完整图库 ZIP 导出和恢复 | 与内容相同的开放 #24 合并追踪，不维护第二套格式 | 重复 issue 不应产生重复实现 | `已关闭` | `已验证` | `已验证（真机文件往返待验收）` | PictureLibraryArchive v1 与变动 68/69 | 后续只更新 #24 对应证据 |
| [#46](https://github.com/picinterpreter/picinterpreter/issues/46) | 匿名设备数据登录后合并账号 | 微信登录后先展示数据数量和合并确认；取消后按账号最多再提示三次，之后只保留手动同步；普通账号事件同步继续只合并可同步的常用语/历史/接收记录并排除私图、纠错和录音。用户若需要迁移完整私有数据，必须另行输入自持密码、显式生成端侧加密快照、主动上传，并在下载解密后再次确认恢复；普通合并完整成功后才写账号关联墓碑 | 登录本身不是上传授权；不同隐私层不能采用同一合并策略；独立密文快照让服务端只保存不可读字节，关联墓碑则保留匿名来源并避免同一账号重复打扰 | `仅路线图` | `已验证（工程）`：Web 使用显式同步、确认记录和常用语逐条版本 API；另有独立的账号完整私有数据加密上传、下载、删除及确认恢复入口 | `已验证（工程）`：登录确认、暂缓上限、数据摘要、隐私说明、确认记录/常用语逐条同步、完整成功后退役关联及失败不误退役均已接入；低频图库备份页另提供账号完整私有数据的端侧加密快照 | accountIdentity、receiver/saved phrase sync、repository、cloud sync、`PIE2EE01` 加密归档、Web/微信私有快照 UI 与 account port 测试；本轮 CBoard 私有数据聚焦 `7 suites / 86 tests / 4 snapshots`、微信私有快照聚焦 `3 files / 31 tests`、API 独立私有数据路由 `4 passing` | 匿名身份、普通同步与完整私有数据显式迁移均已形成工程闭环；普通同步仍不上传私图/纠错/录音明文。生产凭据、公网可信证书、微信合法域名、两台物理手机、错误密码真机交互与弱网交错仍待外部验收 |
| [#47](https://github.com/picinterpreter/picinterpreter/issues/47) | 纠错与缺词的分阶段隐私同步路线 | 普通事件同步继续严格停在 Phase 1 本机；完整私有数据备份另提供用户显式触发、密码自持、服务端只见密文的离线跨设备快照，不把它冒充实时 Phase 2/3 | raw 图片序列会暴露患者沟通意图，普通账号同步不能替代端到端加密；账号权限和私有 Blob也不能保护服务端侧明文 | `决策已完成` | `已验证 Phase 1 + 显式 E2E 快照` | `已验证 Phase 1 + 显式 E2E 快照` | repository 独立键、receiverSync 白名单/API 拒绝、`PIE2EE01`、错误密码/篡改/明文拒绝及两端 build | 实时 CRDT、家庭成员密钥共享、最低群体阈值和日级时间粒度仍属未来专门项目 |
| [#49](https://github.com/picinterpreter/picinterpreter/issues/49) | 新增接收纠错持久化表，保留原确认记录和追加式修订证据 | 不复刻 Dexie v5 表实现，改由共享 `receiverCorrections` schema、repository 和平台 storage adapter 保存同一语义；修订只追加，不覆盖患者当时看到的确认记录 | CBoard Web 与微信使用不同存储平台，直接迁移 Dexie 会制造两套实现；共享纯核心与端口可以同时保留审计、隐私和跨端一致性 | `已关闭` | `已验证`：纠错独立于可见历史持久化，可投影最新修订、形成本机修正记忆并保留审计行 | `已验证`：复用同一纯核心和微信 storage adapter，照护历史修订、修正记忆管理与账号合并隐私提示已接线 | `receiverLifecycle.js`、`repository.js`、`correctionMemory.js`、Web repository/lifecycle tests、微信 `historyReceiverReview`/`receiverSession`/`correctionMemoryManagement` tests | #49 的数据语义已由 #22/#26/#47/#64 跨端覆盖；当前仍严格保留在本机，不上传 raw 图片序列，不把普通账号同步冒充端到端加密 |
| [#50](https://github.com/picinterpreter/picinterpreter/issues/50) | 新增缺词持久化表和状态机 | 用中性 repository schema 替代 Dexie 表品牌 | 跨 Web/微信迁移应保留语义而不是数据库实现 | `已关闭` | `已验证` | `已验证` | missingTokens/repository migration tests | 已由 #57/#61/#62 的实现覆盖 |
| [#51](https://github.com/picinterpreter/picinterpreter/issues/51) | 证明旧数据升级不丢失 | 测试中性 schema fresh/legacy/corrupt/future-version，而非复刻 Dexie v4→v5 | 当前生产底座不是原 Dexie，测试必须针对真实 adapter | `已关闭` | `已验证` | `已验证` | repository migration tests | 已由 #58 覆盖 |
| [#52](https://github.com/picinterpreter/picinterpreter/issues/52) | 匹配后立刻建立单一活动草稿 | 两端复用 receiverLifecycle，重跑覆盖当前草稿 | 草稿不应进入历史或同步 | `已关闭` | `已验证` | `已验证` | lifecycle/repository/UI tests | 已由 #60 覆盖 |
| [#53](https://github.com/picinterpreter/picinterpreter/issues/53) | 全屏展示时确认草稿 | 打开展示即确认且幂等，后续纠错追加事件而不覆盖原记录 | “患者真正看过”才是确认事实 | `已关闭` | `已验证` | `已验证` | confirm lifecycle 与 display tests | 已由 #60/#64 覆盖 |
| [#54](https://github.com/picinterpreter/picinterpreter/issues/54) | 从匹配结果构造有序 pictogramSequence | 保存完整顺序与未匹配位置语义，不只存散乱 ID | 接收复核、分享和纠错都依赖稳定顺序 | `已关闭` | `已验证` | `已验证` | receiverPipeline/DTO tests | 已由 #26/#60 覆盖 |
| [#55](https://github.com/picinterpreter/picinterpreter/issues/55) | 固化接收 fixture 契约 | 在测试 helper 中执行稳定字段和期望匹配断言 | fixture 必须能阻止格式漂移 | `已关闭` | `已验证（等价契约）` | `已验证（共享核心）` | receiverCaregiverFixtures tests | 继续与当前 Board seed 同步 |
| [#56](https://github.com/picinterpreter/picinterpreter/issues/56) | 建立首批 20 条中文接收样本 | 扩展到 80 条高风险、医疗、否定、家庭、活动和餐具样本 | 只追求匹配率会掩盖危险 partial 错图 | `已关闭` | `已验证（80/80）` | `已验证（共享核心）` | receiverCaregiverFixtures/segmentation/symbolMatching tests | 新真实错误继续先加 fixture 再修规则 |
| [#71](https://github.com/picinterpreter/picinterpreter/issues/71) | 支持 GIF/短视频动作图符 | GIF 继续复用 `image`；短视频以向后兼容的可选 `mediaType/video` 扩展接入共享 DTO，复用 Taro/微信原生 Video、选择、压缩和本机文件能力；家属维护页可创建，患者板、表达输出和接收全屏播放，候选列表只显示封面 | 动作图符需要真实运动语义，但不能把 React DOM 播放器或大视频运行时搬进小程序；原生组件、封面降级、10 秒/8 MiB 限制和低频分包是最小可维护边界 | `工程已实现，设备验收待完成` | `已验证（GIF/视频代码、测试、build；浏览器真实媒体待验收）` | `已验证（GIF/视频代码、测试、build；物理真机待验收）` | Taro 4.2.0 固定源码 `f0e5c39d5f04290db975670411e23c3a396e15f8`、上游 Video `8/8`；CBoard 双向沟通 `94 suites / 737 tests` 和 production build；微信 `79 files / 352 tests`、质量门 `10/10`、production build，主包 `1,285,089 B` | 浏览器登录上传、微信物理真机、低端机内存、官方性能扫描、素材许可和患者可理解性仍需外部验收；详见 `docs/short-video-pictogram-taro-reuse-review-2026-07-28.md` |
| [#82](https://github.com/picinterpreter/picinterpreter/issues/82) | 一键移除家庭照片杂乱背景 | 使用 cboard-api 可替换 provider 做单次内存中转；客户端必须单次授权、保留原图、只接受透明 PNG，并在确认保存前允许恢复 | 浏览器模型会引入大模型与许可证/包体成本；服务端 rembg 或 remove.bg 可替换，同时能把密钥、大小、超时和隐私校验统一留在 API 边界 | `仅需求` | `已验证（production 三视口 UI 闭环；本地 rembg provider 链路已实测）`：真实上传、隐私确认、失败保留原图、透明候选、恢复原图、再次处理、媒体保存和新图卡落板均通过 | `已验证（代码/测试/build；本地 rembg provider 链路已实测，真机待验收）` | API provider/Swagger/可复现 smoke command、真实普通用户 HTTP/Mongo `2/2`、Web TileEditor、微信 backup 分包 BackgroundRemovalPort/草稿文件注册表及三端回归；官方样例输出透明 PNG `987×1481`、`591310 B`；Web production `3/3`，完整离线 production E2E `36/36` | 生产部署、公网 HTTPS、微信合法域名、微信真机以及家庭成员和常见物体真实照片仍需验收主体完整度；失败继续使用原图，不把受控 API 响应、官方样例或工程构建冒充家庭照片质量通过 |

## 变动 77：开放 issue 补漏审计与连续全屏序列落地

- **意图：** 把原图语家所有此前未进入矩阵的 issue 重新拉回迁移范围，并优先修复 #14 中已经能明确复用现有 UI 的患者阅读问题。
- **决策：** GitHub issue 清单与正文作为需求源，代码、测试、构建和运行态作为完成证据；#14 在 Web 与微信分别使用平台原生布局能力，不抽象没有业务价值的共享 CSS 核心。当时尚未实现的方言、OCR、视觉标注和背景移除保持“未开始”，不以普通话 ASR、文字输入或图片上传冒充；此状态后来已被变动 159、163、165、170 及覆盖矩阵当前 #3/#5/#20/#21/#82 行取代。
- **理由：** 原矩阵只记录了开发中触达的 issue，容易把遗漏当成完成；同时跨端 UI 若为了“共享”强行套同一组件，会把 React DOM/Material UI 带进 Taro，违背既定迁移边界。
- **证据：** GitHub API 当前 issue 清单与逐项正文；CBoard #14 定向 `1 suite / 5 tests`、全仓 `162 suites / 1000 tests / 72 snapshots` 和标准 production build；微信定向 `1 file / 2 tests`、全量 `39 files / 136 tests`、TypeScript、ESLint、边界扫描和 production build。微信未压缩主包 `296,154 B`、照护分包 `1,495,677 B`、备份分包 `1,401,568 B`，生成页配置包含 `pageOrientation: auto`，接收产物包含原生 ScrollView 的 `receiver-display-sequence`。
- **生效范围：** 图语家需求治理、CBoard Web 接收全屏页、Taro 微信接收分包与后续开发顺序；不改变 BoardDTO/TileDTO、matcher、语音、历史、账号、云同步或 API。本轮未打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送；真机旋转仍必须单独验收。
- **记录：** Codex（GPT-5.6），2026-07-19 20:59:29。

## 变动 78：免登录 Web 演示使用会话级隔离而非第二套产品

- **意图：** 落实 issue #7，让不了解 CBoard 账号体系的 GitHub 访客可以通过一个固定 URL 直接体验真实图板、患者表达和照护接收闭环，同时绝不污染其正常 CBoard 数据。
- **决策：** 新增 `/demo` 运行模式，但继续渲染正式 `Board` 与中性 `CommunicationSupport` 主链。应用在创建 Redux store 和 repository 之前识别该路径，改用进程内存适配器；停用账号刷新、云同步、Google Analytics 与 Application Insights 用户上下文，隐藏登录、分享图板、设置、导入导出、私人图片和清理入口，并显示“数据只保留在当前页面”的固定横幅。
- **理由：** 复制一套 demo fixture UI 会与正式双向沟通继续漂移；只隐藏登录按钮却继续读取持久化状态或调用 API，又会泄漏/污染真实账号。把隔离放在 store、repository 和副作用边界，可以让演示复用全部正式核心，同时保持刷新即清空。
- **证据：** demoMode、localData、App、Board、Navbar、CommunicationSupport 及容器聚焦测试 `10 suites / 50 tests / 2 snapshots`；CBoard 全仓 `164 suites / 1011 tests / 72 snapshots`、ESLint、`git diff --check` 和标准 production build 通过。主 JS gzip `1.63 MB`，Service Worker 预缓存约 `41.3 MB`；本地静态服务器对 `http://127.0.0.1:4173/demo` 返回 `200`、正确 React 根节点和生产主包。
- **生效范围：** 仅 CBoard Web fork 的 `/demo` 直达运行模式及其本机副作用隔离；不改变正常 `/`、账号、云端 Settings、BoardDTO/TileDTO、matcher、语音、历史 schema、微信小程序或 API。浏览器视觉、移动触控和无障碍仍待人工验收。本轮只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 21:23:00。

## 变动 79：issue #21 图片识字完成三端代码闭环

- **意图：** 恢复图语家“照片或截图中的文字进入接收端”的能力，同时保证 OCR 错误不会未经人工确认直接变成患者看到的图片序列。
- **决策：** `cboard-api` 新增鉴权 multipart OCR 路由，图片只在内存中转为视觉模型输入，不落盘；CBoard Web 提供独立“图片识字”对话框；微信把拍照、压缩、上传放入独立 OCR 分包。两端成功后都只把最长 120 字的识别文本回填到可编辑输入框，用户必须再次主动触发既有分词和 matcher。
- **理由：** OCR、分词、图文匹配和最终发送是四个不同责任。复用现有接收管线可继承图语家已经优化的分词、歧义修复和人工换图能力；独立微信分包又避免低频网络功能挤占患者主包或照护主链。
- **证据：** `cboard-api` 新增 communication/settings 相关测试 `44 passing`；旧 controller 集成目录因本机 MongoDB `127.0.0.1:27017` 未运行得到 `45 passing / 3 pending / 39 failing`，失败均记录为环境依赖而非全绿。CBoard 全仓 `165 suites / 1015 tests / 72 snapshots` 和 production build 通过。微信全量 `41 suites / 143 tests`、TypeScript、ESLint、边界和 production build 通过；未压缩主包 `296,262 B`、caregiver `1,500,290 B`、backup `1,401,568 B`、OCR 独立分包 `43,650 B`，均低于 `1.5 MiB` 建议线，OCR 分包无静态图片或音频。
- **生效范围：** `cboard-api` `/gpt/communication/ocr`、CBoard Web 接收理解输入、微信 `packages/ocr`、一次性本地返回意图和覆盖矩阵 #21；不改变 matcher、BoardDTO/TileDTO、历史、云同步或自动发送。生产环境尚未配置 `TARO_APP_API_BASE_URL` 和可接收图片的模型，因此当前结论是代码/测试/build 闭环，不冒充真实服务通过。官方 Skill 后台状态检查为登录有效、版本 `0.3.0` 一致；单文件编译调用超过 90 秒未返回，未形成官方编译证据，也未为此打开、置顶、聚焦或终止开发者工具。未预览、上传、发布、提交或推送。质量依据为[微信官方《小程序性能优化指南》原文](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5.6），2026-07-19 22:22:59。

## 变动 80：issue #20 视觉元数据建议完成可人工确认的三端闭环

- **意图：** 恢复图语家“拍照后自动建议图卡名称、同义词和分类”的低操作成本能力，同时让家庭照片、人工输入和 CBoard 图板保持可控。
- **决策：** `cboard-api` 新增鉴权 multipart 视觉元数据路由，只接受 JPEG/PNG/WebP 和最多 `2 MiB` 图片，原图只在内存中转，响应明确 `sourceStored: false`。共享纯核心负责清洗建议、构造带 `device-private` 署名的 TileDTO、追加到指定 BoardDTO 和删除压缩布局。Web 只在新增图卡并勾选单次同意时请求建议；微信在备份分包提供“只选图手工填写”和“选图并生成建议”两条路径。异步结果只填空字段，不能覆盖照护者已经修改的内容；只有点击确认保存才写入 CBoard。
- **理由：** 视觉模型可能识别错误且涉及家庭照片隐私，不能直接保存或覆盖人工判断；标签建议、TileDTO 变更和平台选图/上传也属于不同责任。共享纯核心加平台 adapter 可以复用 CBoard 成熟图板与匹配能力，同时守住微信主包和照护分包边界。
- **证据：** API helper/controller/route/provider `23 passing`。CBoard 全仓 `166 suites / 1024 tests / 72 snapshots` 和 production build 通过。微信全量 `43 files / 151 tests`、TypeScript、ESLint、边界和 production build 通过；未压缩主包 `296,262 B`、caregiver `1,500,338 B`、backup `1,427,299 B`、OCR `43,650 B`。新增集成测试证明个人图卡写入本地 store、重载后仍能按同义词进入表达匹配管线；生产产物门证明视觉端点只存在于 backup 分包。
- **生效范围：** `cboard-api` 视觉元数据路由、CBoard Web TileEditor、新增共享个人图卡核心、微信 backup 分包个人图卡编辑器及覆盖矩阵 #20；不改变默认 CBoard 图板、语音、OCR、历史、账号同步或公共图库。生产 `.env.production` 尚未配置 `TARO_APP_API_BASE_URL` 和真实视觉模型，因此 AI 建议仍待部署与真机验收，手工新增路径不受影响。本轮只做后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-19 23:16:31。

## 变动 81：issue #82 一键去背景完成可恢复的三端工程闭环

- **意图：** 让照护者把家庭成员、杯子、药盒、轮椅等熟悉照片做成更清晰的 AAC 图卡，同时避免复杂修图步骤和处理失败造成原图丢失。
- **决策：** `cboard-api` 新增鉴权 `/gpt/communication/background-removal`，支持自托管 `rembg` 或服务端 `removebg` 两种可替换 provider；只接受最多 `2 MiB` JPEG/PNG/WebP，并只返回最多 `4 MiB`、尺寸受限且真实包含透明通道的 PNG。Web 与微信都必须先取得本次上传同意，成功后保留原图并提供“恢复原图”；失败、超时、未登录或未配置时保持原图不变。微信把端口与 UI 留在已有 backup 分包，并用纯草稿注册表管理原图、候选图、保存和离开时的文件清理。
- **理由：** 浏览器本地背景模型会增加模型下载、运行内存、许可证和微信包体风险；把处理放在可替换服务端能复用前后端分离体系，并把 API key、超时、输入/输出校验统一放在可信边界。原图保留和人工确认则防止主体被误切后直接污染沟通图板。
- **证据：** `cboard-api` 通信、图卡和设置相关测试 `56 passing`；旧全量 controller 集成目录因本机 MongoDB 未运行得到 `57 passing / 3 pending / 39 failing`，失败均为既有数据库环境依赖。CBoard 全仓 `166 suites / 1029 tests / 72 snapshots` 和 production build 通过。微信全量 `45 files / 160 tests`、TypeScript、ESLint、`137 app / 26 core` 边界与 production quality gate 通过；未压缩 main `296,262 B`、caregiver `1,500,700 B`、backup `1,435,407 B`、OCR `43,650 B`，775 张 CBoard 图片和 3 张紧急图片完整，去背景 endpoint 只存在于 backup 分包。质量门曾真实拦截输出中的 optional chaining，改为传统判空后重新构建通过。
- **生效范围：** `cboard-api` 背景移除 provider/Swagger/环境变量示例、CBoard Web TileEditor、微信 backup 分包个人图卡编辑器、草稿本机文件生命周期及覆盖矩阵 #82；不改变默认 CBoard 图板、matcher、分词、语音、OCR、历史、账号同步或公共图库。当前没有部署真实 rembg 服务或 remove.bg 密钥，因此只标记代码、测试、构建和包体闭环；主体边缘、人物和物体识别质量仍需配置后用真实照片验收。本轮只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 00:04:02。

## 变动 82：issue #82 从模拟 provider 推进到本地真实 rembg 适配链

- **意图：** 证明一键去背景不仅在 mock、测试和构建中成立，`cboard-api` 的真实 multipart provider 也能连接官方 `rembg` 服务并返回符合客户端契约的透明图片。
- **决策：** 在三个仓库之外建立隔离运行目录，使用 `uv` 和 CPython 3.11 安装官方 `rembg[cpu,cli]==2.0.76`，仅监听 `127.0.0.1:7000`；模型、样例和输出均不进入仓库。新增 `npm run verify:background-removal`，使用与 API 路由相同的 provider adapter，仅读取指定本地图片并输出尺寸、字节数、哈希、隐私标志和耗时，不写出处理图片。
- **理由：** 单元测试只能证明请求和校验逻辑，不能证明真实模型服务、multipart 格式及 PNG 响应能够共同工作；隔离运行时和只输出元数据的 smoke command 又能避免把约 176 MB 模型或家庭照片写入代码仓库。
- **证据：** `http://127.0.0.1:7000/api` 返回 `200`。官方 `plants-1.jpg` 经原始服务和 `cboard-api` provider 得到相同 SHA-256 `19ce082978ec81b6ea03365bade95fcd1514314d694229b0b52318fa4117349e`，输出为 `987×1481`、`591310 B` 的 RGBA PNG，alpha 范围 `0..255`；provider 返回 `sourceStored:false`、`originalRetained:true`，第二次适配器请求耗时 `251 ms`。未配置 provider 的 smoke command 明确以退出码 `1` 失败；provider 单元测试 `6 passing`。
- **生效范围：** `cboard-api` 本地/部署前 provider 验收入口和覆盖矩阵 #82。当前证据不覆盖需要 MongoDB 与登录的完整鉴权 HTTP 路由、生产部署、Web 页面操作、微信真机操作或家庭成员/餐具照片主体边缘质量；这些仍是独立发布门。本轮仅使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 00:20:28。

## 变动 83：issue #5 先完成可人工复核的粤语文字规范化链

- **意图：** 恢复图语家针对粤语表达的优化方向，让“食饭、饮水、唔舒服”等原始文字能够转换为 CBoard 默认词库更容易匹配的“吃饭、喝水、不舒服”，同时不隐藏或覆盖原识别结果。
- **决策：** 新增跨端 `DialectNormalization contract v1`。`cboard-api` 通过既有鉴权 AI provider 返回 `{ sourceText, normalizedText, dialect, provider, sourceStored:false }`；Web 和微信均保留原文、显示可编辑转换草稿并提供恢复原文。网络或 AI 不可用时只使用高置信本地词典；转换完成后禁止自动分词和自动匹配，必须由照护者确认并再次主动生成图片。Web 粤语模式可显式请求浏览器 `yue-HK`，微信继续如实提示 WechatSI 当前路径不保证粤语识别。
- **理由：** 真实粤语音频识别、粤语到普通话词语转换和图文匹配不能互相冒充。错误翻译可能改变否定、疼痛、用药、如厕、食物、时间、数量和紧急语义；保留原文、限制词典、服务端不存原文和人工触发下一步可以在复用现有 matcher 的同时守住安全边界。
- **证据：** CBoard 聚焦 `5 suites / 71 tests`，覆盖共享规范化、浏览器语言选择、API adapter、接收端原文保留/恢复及禁止自动匹配；`cboard-api` helper/controller/Swagger `25 passing`，覆盖方言白名单、120 字/200 词上限、未配置降级和 `sourceStored:false`；微信全量 `45 files / 161 tests`、TypeScript、ESLint、`137 app / 26 core` 边界与 production build 全部通过。未压缩包体为 main `296,262 B`、caregiver `1,507,590 B`、backup `1,435,407 B`、OCR `43,650 B`，44 boards / 825 tiles / 775 images 完整。CBoard production build 生成当前 `index.html`、manifest 和 Service Worker。
- **生效范围：** 共享 `dialectNormalization` 纯核心、CBoard Web 接收端、微信照护者接收端和 `cboard-api` `/gpt/communication/dialect-normalization`。当前只证明文字规范化代码、测试和构建闭环，不证明 WechatSI、浏览器或云厂商已完成真实粤语音频识别；下一阶段仍需服务端方言 ASR、录音平台 port、上传同意、音频不落盘约束及真实粤语录音验收。本轮只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 00:52:56。

## 变动 84：issue #5 真实粤语音频 ASR 完成三端工程闭环

- **意图：** 把“粤语支持”从浏览器语言提示和文字转换推进到真实音频采集、服务端持密钥识别、人工修正和既有图文匹配之间的完整工程边界，同时不把供应商结果直接当作患者沟通事实。
- **决策：** `cboard-api` 新增鉴权 multipart 音频路由和腾讯云一句话识别 provider，固定使用 `16k_yue`；Web 通过独立音频选择对话框上传 MP3，微信通过原生 `RecorderManager` 录制 16 kHz、单声道、48 kbps MP3。两端每次录音或上传都要求本次同意，最多 `3 MiB`、60 秒，响应必须声明 `audioStored:false`、`providerProcessing:true`。成功后只回填可编辑原文，禁止自动规范化、分词、匹配、保存、朗读或发送。
- **理由：** 录音隐私、腾讯云密钥、音频格式、提供方响应和图卡安全分别属于平台、服务端和人工复核边界。把它们压成一次“语音直接出图”会放大否定、疼痛、用药、如厕和紧急表达的误识别；逐次同意、内存中转、原文可改和手动继续能够保留沟通控制权。
- **证据：** CBoard 定向 `5 suites / 72 tests` 与 production build 通过；API communication/pictogram 聚焦 `66 passing`、settings `2 passing`，完整旧 controller 目录为 `69 passing / 3 pending / 39 failing`，失败原因是本机 MongoDB `127.0.0.1:27017` 未运行；微信 `46 files / 167 tests`、TypeScript、ESLint、`140 app / 26 CBoard core` 边界和 production quality gate 通过。生产未压缩 main `296,262 B`、caregiver `1,518,551 B`、backup `1,435,407 B`、OCR `43,650 B`，44 boards / 825 tiles / 775 images 与 3 张紧急资源完整。腾讯官方接口文档确认 `SentenceRecognition` 支持 `16k_yue` 和毫秒级 `AudioDuration`。
- **生效范围：** CBoard Web 接收端、微信照护者接收端、共享 `dialectAudioRecognition` 纯核心及 `cboard-api` `/gpt/communication/dialect-asr`。当前没有正式腾讯云凭据和真实粤语音频，因此不证明生产识别质量、浏览器上传或微信真机录音；失败继续保留文字输入、WechatSI 普通话路径和本地规则。全程只在后台执行，未打开、置顶、聚焦或抢占微信开发者工具窗口，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 01:51:07。

## 变动 85：issue #46 账号合并补齐私有图片边界和可见冲突结果

- **意图：** 让匿名设备登录后能够合并公共沟通数据，同时保证设备私有图片不会因为常用语、旧历史或旧云端脏数据被隐式带入账号设置，并让用户看见合并究竟新增或覆盖了什么。
- **决策：** 云端 payload 对常用语、历史和接收记录统一执行设备私有图符清洗：移除 `device-private` ID、署名、私有 board/tile 元数据以及 `blob:`、`data:`、`file:`、`wxfile:`、微信临时/用户目录等本机路径，只保留文字标签；公共图符引用继续保留。下载旧云设置后先执行同一清洗再合并。相同句子的常用语和相同 ID 的历史记录按 `updatedAt` 选择较新版本，时间相同保留本机版本；Web 与微信同步完成提示显示远端新增、本机上传、冲突数和双方胜出数。
- **理由：** 只过滤独立的接收记录不足以覆盖嵌在常用语和遗留历史中的私人图符；只显示“同步成功”也无法说明发生了覆盖。双向边界清洗、确定性合并和结果摘要可以在不上传私人文件、不静默改写本机原数据的前提下复用 CBoard 通用 settings 接口。
- **证据：** CBoard 聚焦 `3 suites / 22 tests`、全仓 `168 suites / 1043 tests / 72 snapshots`、`git diff --check` 与 production build 通过；主 JS gzip `1.64 MB`，本轮增加约 `981 B`，Service Worker 预缓存 `978` 个资源约 `41.4 MB`。微信账号同步聚焦 `7/7`、全量 `46 files / 169 tests`、TypeScript、ESLint、`140 app / 26 CBoard core` 边界与 production quality gate 通过；未压缩 main `296,262 B`、caregiver `1,521,355 B`、backup `1,437,913 B`、OCR `46,156 B`，775 张 CBoard 图片共 `953,152 B` 和 3 张紧急资源完整。
- **生效范围：** CBoard Web 与微信小程序的公共 settings 合并、接收记录同步、旧云数据回收和同步结果文案；不上传或迁移私人图片、纠错、缺词、录音和本机文件，不新增专用 API，不修改云端 schema。匿名 ID 墓碑、显式私人图片迁移和真实多设备并发仍是后续独立工作。本轮全程仅使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具窗口，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 02:23:24。

## 变动 86：issue #27/#46 为已确认接收记录增加服务端版本与冲突协议

- **意图：** 阻止离线旧设备把患者已经看过的确认记录静默改写，并让删除、反馈和冲突能够在 Web、微信与 API 之间保持同一语义。
- **决策：** 已确认记录上传携带 `baseVersion`，服务端返回单调递增的 `serverVersion` 和 `conflicted`。确认正文首次写入后不可变；相同版本只允许按 `type + createdAt` 追加患者反馈。过期正文写入返回服务端规范记录并计入冲突，客户端保留本机新增反馈后使用新版本在下轮重试。删除继续以 tombstone 为最终事实，并返回 `id/deletedAt/deletedBy/serverVersion`；旧客户端缺少 `baseVersion` 时按 `0` 兼容迁移。
- **理由：** 单纯 Last-Write-Wins 会把“患者看过什么”变成最后联网设备的偶然结果；完整 CRDT 又超出当前工程复杂度。不可变确认事实、追加反馈、乐观版本和墓碑能够以最小协议满足 issue 已锁定的核心决策。
- **证据：** CBoard 全量 `168 suites / 1046 tests / 72 snapshots` 与 production build 通过，主 JS gzip `1.64 MB`；API 通信相关 `59 passing`，覆盖旧设备过期写入、反馈追加、私有字段剥离、墓碑和旧版本迁移；微信 `46 files / 171 tests`、TypeScript、ESLint、`140 app / 26 CBoard core` 边界与 production build 通过。微信未压缩 main `296,262 B`、caregiver `1,523,654 B`、backup `1,439,578 B`、OCR `47,821 B`，caregiver 仍低于 `1.5 MiB` 建议线但只剩约 `49 KB`。
- **生效范围：** `cboard-api` 已确认接收记录模型/控制器/Swagger、CBoard 共享 `receiverSync/storage`、Web Settings 同步和微信账号同步；不改变草稿、默认板、分词、matcher、语音或私人文件。常用语逐条服务端版本、真实 Mongo 并发、真实 HTTPS、多设备与匿名 ID 退役仍待后续验收。本轮只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具窗口，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 03:05:44。

## 变动 87：issue #27/#46 完成真实本地 HTTP/Mongo 并发请求验收

- **意图：** 把确认记录同步从模型、控制器单测和假 API 门推进到真实登录、真实数据库、真实 HTTP 请求，并发现顺序测试覆盖不到的同时写入风险。
- **决策：** 使用 MongoDB 官方 Community Server `7.0.37` 镜像建立只绑定 `127.0.0.1:27017`、无持久卷、完成即删除的隔离数据库；通过现有 User 模型创建本地测试账号，继续调用公开登录、Settings、确认记录同步和删除路由。服务启动时把 Azure Blob 改为上传发生时才初始化，未配置媒体凭据不再阻断与媒体无关的账号和沟通 API。确认记录写入后核对本次患者反馈事件是否真实存在；若条件更新因另一个同时请求而落空，返回冲突而不是假成功，让客户端合并并重试。
- **理由：** 单元测试不能证明数据库条件更新的真实竞争结果；两个请求可能同时读取同一版本，只有一个写入成功。写后核对能够在不引入重型 CRDT 的前提下识别丢失更新，并继续复用客户端既有冲突恢复逻辑。
- **证据：** 公开登录返回 `200` 和有效 bearer token；Settings smoke 通过旧 `tuyujia` 读取与 `communicationSupport/tuyujia` 双写回读；确认记录 smoke 通过创建、旧设备正文冲突、追加反馈重试、结构化墓碑、防复活及两个 `Promise.all` 同时反馈请求，重试后两条反馈都保留，主记录墓碑版本为 `4`、并发记录收敛版本为 `3`。通信/图卡/Blob 聚焦回归 `71 passing`；完整 controllers 为 `180 passing / 5 pending / 7 failing`，7 项均是未配置 GPT、IPInfo、Azure 或 Google Play 外部凭据，不属于本轮同步回归。
- **生效范围：** `cboard-api` 启动边界、确认记录写后冲突检测、两个可重复运行的本地 smoke 命令及覆盖矩阵 #27/#46；不代表可信公网 HTTPS、生产邮箱、两台物理手机、断网恢复、匿名 ID 退役或常用语逐条版本已经验收。本轮只使用后台 shell 和环回服务；允许后续通过 Skill/CLI 操作微信开发者工具，但不得置顶、聚焦、抢占窗口或用户输入。未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 03:39:34。

## 变动 88：issue #27/#46 固化匿名身份与登录合并确认

- **意图：** 补齐匿名设备在登录前后的身份连续性，避免“登录即静默上传”或每次登录重复询问，同时保持患者、工作区和账号三个概念不混用。
- **决策：** repository schema 升至 6，为每台设备持久化独立匿名 `userId`，原 `patientId/workspaceId` 不变；账号关联状态按账号保存 `deferred/retired`、提示次数和时间。微信登录成功后先显示公共数据数量与隐私边界，确认才同步；取消最多累计三次，之后停止自动提示但保留手动同步。只有 Settings 与确认记录都同步成功才写 `retired` 关联墓碑；私人图片、纠错和录音不上传。CBoard Web 保持现有显式同步入口，只在完整成功后写同一墓碑。
- **理由：** issue #27 要求匿名 UUID 与 patient/workspace 分离，issue #46 要求登录合并前确认和有限次暂缓。删除匿名 ID 会失去来源审计，登录即上传又会越过用户意愿；按账号的关联墓碑能兼顾可追溯、少打扰和失败可重试。
- **证据：** CBoard accountIdentity/repository/localData/Settings 容器聚焦 `4 suites / 26 tests`，全仓 `169 suites / 1050 tests / 72 snapshots` 与 production build 通过；微信 account merge/cloud sync/account port 聚焦 `3 files / 22 tests`，全量 `47 files / 177 tests`、TypeScript、ESLint、`142 app / 26 core` 边界与 production quality gate 通过。未压缩 main `296,262 B`、caregiver `1,531,265 B`、backup `1,443,138 B`、OCR `47,964 B`。
- **生效范围：** CBoard 共享 repository、Web 显式账号同步、微信登录与手动同步入口；不改变 `patientId/workspaceId`、账号认证 API、确认记录版本协议或私人数据迁移规则。真实可信 HTTPS、邮箱激活、两台物理手机和弱网交错仍待发布前验收。全程只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 04:14:49。

## 变动 89：issue #27/#46 将常用语从整包 Settings 合并升级为逐条版本同步

- **意图：** 防止两台设备编辑或删除同一常用语时发生静默覆盖、删除后复活或设备私图外泄，并让冲突能够在 CBoard Web 与微信端明确显示。
- **决策：** `cboard-api` 新增常用语模型及 `/communication/saved-phrases/sync`、`DELETE /communication/saved-phrases`；每条记录使用 `baseVersion/serverVersion/conflicted`，删除使用结构化墓碑。共享 repository schema 升至 7，保存独立 tombstone 队列；Web 与微信先提交待同步墓碑，再调用逐条 API，最后仅把安全结果写入旧 `communicationSupport/tuyujia` 作为兼容镜像。服务端再次剥离 `source:user`、`device_private_*` 和非 HTTPS 图片。
- **理由：** 常用语是会独立编辑、使用和删除的用户数据，整包 Last-Write-Wins 无法处理离线并发；直接删除又会被旧设备复活。逐条乐观版本和墓碑提供最小、可维护的一致性协议，同时保留旧 CBoard Settings 客户端的迁移路径。
- **证据：** API 新增模型、控制器和路由测试 `16 passing`；CBoard API adapter、Settings、repository migration/management 与共享同步核心 `5 suites / 27 tests`；微信全量 `47 files / 181 tests`、TypeScript、ESLint、`142 app / 26 CBoard core` 边界及 production quality gate 全部通过。未压缩 main `296,262 B`、caregiver `1,539,596 B`、backup `1,453,767 B`、OCR `56,920 B`；775 张默认图片与 3 张紧急图片完整，无单媒体超过 `200 KiB`。
- **生效范围：** CBoard 共享 repository/savedPhraseSync、Web Settings 同步、微信 account port/cloud sync、`cboard-api` 常用语 API 与账号删除清理；不上传私人图片文件、纠错、缺词或录音，不改变默认板、分词、matcher 和语音。可信公网 HTTPS、两台物理手机和弱网交错仍待发布前验收。本轮只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，也未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 05:13:55。

## 变动 90：issue #3/#8/#27/#46 增加可恢复的生产 HTTPS 部署基础

- **意图：** 把 Web 与微信已经完成的账号、云同步、在线补图、AI 和服务端语音能力，从本地 HTTP/schema 证据推进到可配置真实域名的统一 HTTPS 后端，同时保持全部密钥只在服务端。
- **决策：** 继续复用 `cboard-api` 与 MongoDB，不建立图语家第二套后端。生产配置只从环境变量读取 Mongo、JWT 和 session secret；新增公开但只返回 `status/database` 的 `/health`。Docker Compose 让 Mongo 只进入 internal 网络、API 不发布宿主端口且以非 root/read-only 运行，Caddy 作为唯一 80/443 入口并主动探测 API。环境示例可入库，真实 `.env.production` 必须忽略并通过占位值、强度、域名、端口暴露校验。
- **理由：** 微信合法域名和跨设备同步需要稳定 HTTPS，但把 provider key 或数据库信息放进小程序会破坏前后端分离；只检查进程存活又会在数据库断线时产生假健康。单一 CBoard API、隔离网络、就绪检查和可恢复反代能够减少维护量并保留成熟底座。
- **证据：** 生产模板校验与 Compose 展开通过；Node `22.23.1` 非 root 镜像使用冻结 `yarn.lock` 构建成功，腾讯粤语 SDK 进入锁文件。Mongo `7.0.37`、API、Caddy `2.11.4` 本地栈全部 Healthy；HTTPS 返回 `200/connected`，宿主机未监听 `10010/27017`。停止 Mongo 后 API 返回 `503/degraded`、Caddy 返回 `503`；重启 Mongo 后无需重启 API 即恢复 `200/connected`。通信/部署 `94 passing`；完整 controller 基线 `202 passing / 5 pending / 7 failing`，七项均要求未配置的 GPT、IPInfo、Azure Storage 或 Google Play 外部凭据。
- **生效范围：** `cboard-api` 生产配置、Docker 镜像、Compose/Caddy 拓扑、健康检查、部署校验器，以及矩阵 #3/#8/#27/#46 的后端发布基础。当前只证明本地生产拓扑和内置证书 TLS，不表示真实 DNS、公众信任证书、微信合法域名、生产邮箱/provider 凭据、两台物理手机或弱网交错已完成。全程只使用后台 shell/Docker，没有打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 05:59:52。

## 变动 91：紧急求助独立分包与包体余量门

- **意图：** 保证紧急求助继续是患者端和接收端都能一跳打开的独立安全界面，同时为已经接近微信 1.5 MiB 建议线的照护分包释放空间。
- **决策：** 新增 `packages/emergency` 分包；患者页和接收页直接导航进入，关闭后返回原页面。8 张紧急图全部由该分包自包含：6 张按稳定 CBoard Tile ID 复用默认图文件，2 张继续使用既有紧急资源；旧 `utilityView: emergency` intent 仅保留升级兼容。质量门新增 64 KiB 建议线余量预警，并校验紧急页面四类产物、清单、文件大小与 CBoard tile/image 一致性。
- **理由：** 常用语逐条同步加入后，照护分包只剩 `33,268 B` 即达到 1.5 MiB 建议线；继续把低频独立能力留在同一分包会让后续功能轻易越线。紧急能力又不能依赖在线下载或另一分包的图片是否已加载，独立自包含比压缩几行代码更可维护。
- **证据：** 微信全量 `47 files / 182 tests`、TypeScript、ESLint、`144 app / 26 CBoard core` 边界与 production build 通过；8 张紧急图全部进入生产产物。未压缩包体为 main `296,378 B`、caregiver `1,520,858 B`、emergency `35,524 B`、backup `1,453,612 B`、OCR `56,920 B`。照护分包较拆分前减少 `18,738 B`，当前余量 `52,006 B`，质量门仍主动提示低于 64 KiB 缓冲。
- **生效范围：** 微信患者页、接收页、紧急朗读页面、生产分包与性能质量门；不改变 CBoard Web、默认 Board/Tile、TTS provider、沟通历史、账号同步或在线能力。官方 Skill 状态已确认登录和版本对齐，但后台 E2E 因项目窗口未打开而安全停止，未擅自开窗、置顶、聚焦或抢占输入；未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 06:25:25。

## 变动 92：照护管理能力拆为独立分包并保留患者表达闭环

- **意图：** 在继续完整迁移图语家照护功能的同时，避免低频管理 UI、账号同步和 AI 检查继续挤占患者表达与接收理解所在的高频照护分包。
- **决策：** 新增 `packages/management`，集中承载常用语管理、全部历史、显示设置、账号登录/注册/同步/上传/退出和 AI 健康检查。患者页只保留表达、接收入口、会话、快捷短语和候选反馈；三个管理按钮统一导航到新分包。管理页复用常用语时只写入一次性 `reuseSavedPhraseId`，返回后由患者页使用共享纯核心恢复表达序列并记录使用次数；旧 `utilityView` intent 继续兼容并转入管理分包。
- **理由：** 这些能力需要保留但使用频率远低于点图和接收确认。拆分前照护分包距离 1.5 MiB 建议线只剩 `52,006 B`；分包比继续压缩或删除功能更符合微信性能指南，也不需要复制 repository、BoardDTO、matcher 或账号协议。
- **证据：** 微信全量 `47 files / 183 tests`、TypeScript、ESLint、`146 app / 26 CBoard core` 边界和 production quality gate 全部通过。未压缩 main `296,510 B`、caregiver `1,478,153 B`、emergency `35,524 B`、management `438,988 B`、backup `1,453,612 B`、OCR `56,920 B`；caregiver 到 1.5 MiB 建议线余量增加到 `94,711 B`。质量门确认管理页四类产物及 `/user/login`、`/settings`、`/gpt/communication/health` 均真实进入 management 分包。
- **生效范围：** 微信小程序页面导航、分包归属、管理 UI 和一次性常用语返回意图；不改变 CBoard Web、共享常用语/历史/账号协议、默认板、分词、matcher、语音或接收事实。官方 Skill 后台状态为登录有效、版本 `0.3.0` 一致；E2E 因该项目运行时未打开而安全停止，没有自动开窗、置顶、聚焦或页面操作，因此不写成模拟器通过。未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 06:46:28。

## 变动 93：issue #6 完成双端图标优先患者动作工程闭环

- **意图：** 把“患者端图标优先”从入口尺寸要求推进到完整表达、接收反馈和紧急沟通动作语言，并让两端实现可独立维护。
- **决策：** 在 CBoard 纯核心中新增 `PatientActionLanguage v1`；Web adapter 使用已有 Material Icons，微信 adapter 使用字符 glyph 和原生 Taro Button。两端都保留短标签、完整无障碍标签和稳定动作 ID；微信不新增依赖或媒体。Web 紧急短句优先从当前 CBoard 图板按标签/发音和 matcher 取图，找不到才显示明确 `!`，不伪造匹配。
- **理由：** 只把按钮放大仍要求患者阅读长文字；把 Material UI 搬进微信又会破坏包体和平台边界。共享动作语义、各端轻量渲染能同时满足一致性、可访问性和性能。
- **证据：** CBoard 聚焦 `6 suites / 48 tests` 与 production build 通过；微信 `48 files / 184 tests`、TypeScript、ESLint、`148 app / 26 CBoard core` 边界与 production build 通过，生成产物保留 `data-patient-action`。微信未压缩 main `296,510 B`、caregiver `1,484,584 B`、emergency `39,454 B`、management `440,450 B`、backup `1,453,612 B`、OCR `56,920 B`，所有分包低于 1.5 MiB 建议线。
- **生效范围：** 覆盖矩阵 #6、CBoard Web 患者沟通表面、微信患者/接收/紧急表面及共享纯动作契约；不改变默认板、分词、matcher 主逻辑、语音、历史或同步。真实视觉、读屏、横竖屏、安全区和物理触控仍待新预览验收。本轮只运行后台 shell，没有打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 07:23:27。

## 变动 94：issue #10 补齐小程序个人图卡保存后编辑闭环

- **意图：** 将“用户自定义图片”从默认图替换和缺词临时配图推进到可长期维护的独立个人词汇，同时继续完整复用 CBoard Board/Tile 模型。
- **决策：** CBoard 纯核心新增不可变 `updatePersonalPictogramInBoards`，同板更新保持原布局位置，跨板移动先安全移除再追加并重算行数；微信 backup 分包允许照护者重新编辑名称、朗读、同义词、语义分类、作者、使用说明和目标板块。编辑保持原图片与稳定 Tile ID，换图仍要求删除后重新创建，避免误删正在被沟通记录引用的本机文件。
- **理由：** issue #10 的验收不只是“能选择照片”，还要求标签、分类和正常选择流程；保存后只能删除会让错误名称或板块无法修正。复用共享 BoardDTO 更新契约比在 Taro 页面直接改数组更能防止布局、归属和来源元数据漂移。
- **证据：** CBoard 共享核心 `1 suite / 8 tests` 与 production build 通过；微信个人图卡定向 `1 file / 6 tests`，全量 `48 files / 186 tests`、TypeScript、ESLint、`148 app / 27 CBoard core` 边界和 production build 通过。未压缩 main `296,510 B`、caregiver `1,484,584 B`、emergency `39,454 B`、management `440,450 B`、backup `1,456,892 B`、OCR `56,920 B`，所有分包低于 1.5 MiB 建议线。
- **生效范围：** CBoard 共享个人图卡纯核心、微信个人图片管理页、本机完整板 storage、搜索/matcher/朗读和覆盖矩阵 #10；不上传家庭照片，不修改云同步，不新增公开图库贡献或完整微信板编辑器。真机相册/相机、编辑触控、跨板后重启恢复仍待新预览验收；本轮只运行后台 shell，没有打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 07:46:09。

## 变动 95：issue #9 补齐微信个人板块管理闭环

- **意图：** 让照护者在微信端建立和整理自己的图片分类，而不是只能浏览 CBoard 内置板或把所有家庭照片塞进既有分类。
- **决策：** CBoard 纯核心新增不可变个人板块管理契约；微信在 `packages/backup/pages/boards` 提供新增、改名、上下排序和删除入口。只有 `device_private_board_*` 空板可被删除；CBoard 内置板不可在此改名或删除，仍可排序并在显示设置中隐藏；含图卡个人板必须先通过个人图片页移动或删除图卡。
- **理由：** issue #9 要求真实管理入口和增删排序。把完整 CBoard React/Material UI 编辑器搬进 Taro 会破坏复用边界和包体，而允许直接删除默认板或含图卡板又会造成不可逆数据损失；低频分包加受限纯契约同时满足功能、安全和性能。
- **证据：** 共享核心定向 `1 suite / 5 tests`、CBoard standard production build 通过；微信定向 `2 files / 3 tests`、全量 `49 files / 187 tests`、TypeScript、ESLint、`151 app / 28 CBoard core`、production build 和产物页检查通过。未压缩 main `296,552 B`、caregiver `1,484,874 B`、emergency `39,454 B`、management `440,450 B`、backup `1,471,369 B`、OCR `56,920 B`；backup 到 1.5 MiB 建议线仍有 `101,495 B`。
- **生效范围：** 覆盖矩阵 #9、共享 BoardDTO 板块 mutation、微信照护工具入口、本机完整板 storage 与 backup 分包；不改变 CBoard Web 原生编辑器、默认图卡内容、账号同步、公开图库或 OBF/OBZ 导入。真机表单、长列表滚动、排序、删除确认和重启恢复仍待新预览验收；本轮只运行后台 shell，没有打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 08:10:04。

## 变动 96：issue #17 增加浏览器设备内语音渐进增强

- **意图：** 在不把大型语音模型塞进 CBoard 或微信包体的前提下，让支持 Web Speech 设备内识别的浏览器获得真实离线语音路径。
- **决策：** CBoard Web 检测实验性 `SpeechRecognition.available/install`，只管理 `zh-CN` 浏览器语言包；语音包可下载时必须由用户点击安装，就绪后才允许“优先在本机识别”，断网时自动设置 `processLocally:true`。不支持、下载失败或语音包未就绪时保留原在线识别和可编辑文字输入，不伪装成功；粤语和微信端不纳入本变动。
- **理由：** 浏览器托管语言包能避免将 Whisper/WASM 与模型文件并入已有大体积 Web 包或微信 2 MiB 包限制，但该接口仍属实验能力，必须以能力检测和明确降级隔离兼容风险。
- **证据：** MDN `SpeechRecognition.processLocally` 与 Web Speech API 使用指南、W3C Web Speech 规范；新增 availability/install/local-start 及接收 UI 回归。CBoard 全量 `173 suites / 1075 tests / 72 snapshots` 通过，CRA production build 成功，主 JS gzip `1.65 MB`，本变动约增加 `1.28 kB`；`git diff --check` 无错误。仓库没有独立 `lint` script，实际 ESLint 编译检查由成功的 CRA production build 执行。
- **生效范围：** CBoard Web 普通话接收端和支持浏览器管理设备内语音包的环境；不改变微信 WechatSI、粤语云 ASR、文字编辑、分词、matcher、TTS、后端 API 或小程序包体。浏览器/操作系统语言包可用性、首次下载和真实断网麦克风尚待运行验收；本轮只使用后台 shell，未打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 08:29:49。

## 变动 97：issue #30 增加导入前复核与确认门

- **意图：** 让照护者在 CBoard JSON、OBF、OBZ 或图语家图库归档真正写入本机/账号前，看见将导入的板块、图片、重复 ID 和被跳过条目。
- **决策：** 继续复用 CBoard 既有解析器、配额申请、Board API 和 communicator 同步；新增纯 `ImportReview` 摘要层。文件选择阶段只解析并保存在内存，标准格式重复板块保留本机版本，图库归档按已选择的 merge/skip 策略生成预览；只有显式点击“确认导入”才调用原落地链，取消或确认失败不静默写入。嵌入 OBF/OBZ 图片在复核前保持 data URI，不调用媒体上传。
- **理由：** 原 issue #30 明确要求冲突清楚报告并在需要时最终合并前复核。解析后立即同步会让用户无法撤回，也可能在尚未确认内容时产生远端媒体副作用；在成熟导入器外增加提交门比重写格式转换更安全。
- **证据：** 纯摘要、OBF/OBZ 诊断、延后媒体上传、React 复核 UI 和容器确认门定向 `5 suites / 16 tests / 3 snapshots` 通过；CBoard 全量 `175 suites / 1080 tests / 72 snapshots` 与 production build 通过。主 JS 约增加 `1.42 kB gzip`、导入异步块 `406 B`、CSS `90 B`；`git diff --check` 无错误，新增模块/测试通过 Prettier 1.15。
- **生效范围：** CBoard Web Settings 的 JSON/ZIP/OBF/OBZ 导入、简体中文复核文案和图语家图库归档；不改变 OBF/OBZ 格式、BoardDTO/TileDTO、微信运行时、公开图库、云端 API schema 或原导出逻辑。当前 fixture 已验证，真实大型第三方 AAC 样本、跨板链接、供应商扩展和浏览器视觉/键盘/读屏仍待运行验收；本轮未操作、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-20 08:55:50。

## 变动 98：issue #11 结构化 AAC 图库完成跨端工程闭环

- **意图：** 把图语家已经验证的词图匹配元数据从“散落在 Tile 字段中”提升为可去重、可审计、可导入导出并可由微信直接消费的结构化图库，同时继续完整复用 CBoard 的成熟板模型。
- **决策：** 新增 `PictogramLibraryDTO v1`，分别保存概念、图片资产、概念图片关系、板布局和图卡位置；图片资产必须携带来源、许可和署名，缺失时明确标记“来源待补充”而不伪造公共归属。CBoard Settings 新增“结构化 AAC JSON”导出；导入严格校验版本、唯一 ID、引用和布局，再进入既有 `ImportReview` 确认门。微信图片库 storage 直接调用共享纯核心恢复 BoardDTO，不复制 Web UI 或另造图库模型。
- **理由：** BoardDTO/TileDTO 适合运行与编辑，但无法单独表达一个概念对应多张图片、同一图片跨板复用和逐图许可审计；另造微信板模型又会形成长期分叉。结构化交换层加成熟运行模型可以同时满足 issue #11、跨端复用和小程序包体约束。
- **证据：** Web 聚焦 `6 suites / 25 tests / 4 snapshots`，全量 `177 suites / 1086 tests / 72 snapshots` 与 CRA production build 通过，新增压缩代码约 `945 B`；微信聚焦 `3/3`、全量 `49 files / 188 tests`、TypeScript、ESLint、`151 app / 28 CBoard core` 边界、默认板完整性和 production build 全部通过。生产包 main `296,552 B`、caregiver `1,488,955 B`、emergency `39,454 B`、management `444,462 B`、backup `1,475,519 B`、OCR `56,920 B`，全部低于 `1.5 MiB`；44 块板、825 张图卡和 775 张图片完整。质量门还真实拦截了翻译源哈希过期，核对生成 JSON 和图片集合完全一致后只更新清单哈希。
- **生效范围：** 覆盖矩阵 #11、CBoard 共享纯核心、Web Settings 结构化导出/导入复核和微信图片库 storage；不改变默认 CBoard 板内容、matcher 的 `relatedTerms` 排除规则、账号 API、公开图库上传或微信完整编辑器。真实浏览器下载/导入、大型第三方 AAC 文件、真机重载和内容策展仍需运行验收；本轮只使用后台命令，没有打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 09:02:09。

## 变动 99：官方 Skill 后台 E2E 完成在线补图与账号同步真实请求闭环

- **意图：** 证明微信缺词自动补图、照护者确认、离线缓存、CBoard 账号登录和云同步不是只有 schema、mock 或单元测试，而能在官方开发者工具运行态组成完整闭环。
- **决策：** 缺词持久化成功后由接收页业务边界立即触发一次在线搜索，维护面板只负责展示、人工重试和确认；账号 E2E 启动固定端口 `49321` 的本机假 API，让小程序走真实 `Taro.request`、`Taro.downloadFile` 和版本化常用语/确认记录接口。脚本默认只使用后台 runtime、refresh 和 page API，禁止打开、关闭、置顶或聚焦项目窗口。
- **理由：** 子组件 effect 不是可靠的业务触发点；Skill 在应用启动后注入 `wx.request` mock 会被 Taro 绕过，模拟器刷新又会清除 mock；随机假 API 端口还会与开发者工具 dist 缓存形成竞态。固定真实 HTTP 地址和业务层确定触发可以同时验证产品语义与前后端分离架构。
- **证据：** 账号 E2E 真实通过 OpenSymbols 缺词请求、来源/许可显示、照护者确认、PNG 下载、微信持久文件、接收记录 v2 署名、恢复待处理删除缓存、登录合并、兼容 token、版本化常用语同步、settings 回写、确认记录鉴权同步、私人图片 payload 排除、退出清令牌和本地历史保留，最后恢复 17 项原 storage、API mock、私有配置和默认构建。默认离线核心 E2E 随后通过患者表达、接收冷恢复、没明白反馈复核恢复、后加图片、纠错记忆、双向历史、缺词私图、个人图片和 17 项 storage 恢复。Vitest `49 files / 188 tests`、TypeScript、ESLint、`151 app / 28 CBoard core` 边界和 production quality gate 通过；默认 dist 不含本机地址、测试域名或测试令牌。
- **生效范围：** 覆盖矩阵 #8/#19/#27/#68、微信接收端自动补图触发、账号 E2E 测试基础设施和账号通知稳定 ID；不改变 CBoard 默认板、matcher、语音、生产 API 地址、公开上传或云端密钥。真实公网 HTTPS、微信合法域名、两台物理手机和系统断网仍待 #67 真机验收。本轮未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 13:01:16。

## 变动 100：小程序补齐云端账号永久删除闭环

- **意图：** 补上 CBoard Web 已有、但微信管理页缺失的云端账号删除能力，并继续明确区分“删除云端账号”和 issue #45 的“清除当前设备数据”。
- **决策：** 微信继续复用 cboard-api 既有 `DELETE /account/{id}`，不新增专用接口。设置页必须先展开危险区并准确输入 `delete-account`，随后再通过系统模态框二次确认；请求使用当前账号 Bearer token。只有服务端明确成功后才清除 CBoard 登录会话，本机图卡、家庭图片、沟通历史、纠错与缺词资料均不删除。页面增加执行中互斥，防止重复提交；API 删除账号时同步级联清理确认接收记录和版本化常用语。
- **理由：** 只提供“清除本机数据”会让用户无法行使云端账号删除能力，把两者合成一个按钮又可能误删离线沟通资料。复用 CBoard 原账号路由可以保持工程体系一致；双重确认和成功后清会话可避免误触、失败后假退出及重复删除。
- **证据：** 小程序账号 port 与编排器定向 `2 files / 19 tests`，全量 `50 files / 196 tests`、TypeScript、ESLint、`153 app / 28 CBoard core` 边界和 production build 通过；API 账号/确认接收/常用语聚焦 `22 passing`。生产包 main `296,328 B`、caregiver `1,489,918 B`、emergency `39,454 B`、management `449,662 B`、backup `1,475,990 B`、OCR `57,391 B`，全部低于 `1.5 MiB` 建议线。
- **生效范围：** 微信 `packages/management` 账号设置、CBoardAccountPort、可测试账号删除编排与 cboard-api 账号级联删除；不改变 CBoard Web 原生账号删除 UI，不清除本机沟通数据，不连接或删除真实账号。新增删除 UI 的官方模拟器 E2E 尚未完成：最近一次隔离假账号运行在到达删除步骤前停于在线补图请求等待；本轮为避免开发者工具抢焦点，没有再次调用模拟器、预览或上传命令，不将单元/构建门冒充运行态通过。
- **记录：** Codex（GPT-5.6），2026-07-21 13:45:53。

## 变动 101：原分类链接能力完成 CBoard Web 复用与微信个人板闭环

- **意图：** 补齐原图语家 `CategoryLinksDrawer` 已验证的“在一个分类中放入另一个分类入口”能力，同时避免在 Web 端重复实现 CBoard 已经成熟的文件夹图卡编辑器。
- **决策：** Web 继续完全复用 CBoard 原生 `TileEditor` 的 folder/loadBoard 选择与 Board 导航，不增加图语家平行分类模型。共享纯核心新增个人板跳转创建、移除和图遍历环检测；微信 `packages/backup/pages/boards` 只允许 `device_private_board_*` 个人板维护跳转，可指向内置板或其他个人板。重复、自链和会形成循环的候选被拒绝；跳转继续使用 `TileDTO.loadBoardId`，在患者页显示“进入”且不加入表达序列。
- **理由：** 原图语家的 `linkedCategoryIds` 与 CBoard 的 folder/loadBoard 表达的是同一类板间导航；复制数据模型会造成长期双写和导入导出分叉。小程序此前只能消费默认板已有跳转，不能维护个人板入口，因此只在这一真实缺口上增加轻量 UI 和纯函数，比搬运 React DOM/Material UI 完整编辑器更符合复用和包体边界。
- **证据：** CBoard `communicationSupport` 全量 `59 suites / 423 tests` 通过，其中板管理新增创建、移除、内置板保护、重复、自链和间接环路用例；微信定向 `2 files / 7 tests`、全量 `50 files / 197 tests`、TypeScript、ESLint、`153 app / 28 CBoard core` 边界与 production build 全部通过。生产包 main `296,328 B`、caregiver `1,490,189 B`、emergency `39,454 B`、management `449,852 B`、backup `1,482,153 B`、OCR `57,391 B`，全部低于 `1.5 MiB`；质量门真实拦截新增可选链，改为显式判空后重建通过。
- **生效范围：** CBoard 共享 `boardManagement` 纯核心、微信个人板管理页、个人板 storage 与患者板间导航；CBoard Web 原生编辑器不改，内置默认板不可在微信端改名、删除或加链接，完整 Web 编辑仍由 CBoard 负责。不改变分词、matcher、TTS、账号同步、默认板内容或图片许可。本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送；真机长列表、触控、重启恢复和跳转视觉仍待后续运行验收。
- **记录：** Codex（GPT-5.6），2026-07-21 14:08:33。

## 变动 102：默认板可挂接本机个人板并保护 CBoard 原生导航

- **意图：** 修正变动 101 只允许个人板作为链接源的临时边界，让照护者可以把本机个人板挂到 CBoard 首页或任意默认分类下，同时不破坏官方板自带的导航结构。
- **决策：** 共享纯核心允许任意现有 `BoardDTO` 添加图语家本机托管链接，链接仍使用 `TileDTO.loadBoardId` 和稳定的 `device_private_link_*` 标识；移除操作只接受这一私有前缀，CBoard 默认板原有 folder/loadBoard 图卡保持只读。个人板改名时同步更新所有指向它的本机跳转标签和朗读文字；重复目标、自链、间接循环、失效源或目标继续拒绝。原 `add/removePersonalCommunicationBoardLink` 保留为兼容包装。
- **理由：** 原图语家 `CategoryLinksDrawer` 允许普通分类链接到自定义分类，若只能从个人板出发，用户仍无法从熟悉的 CBoard 首页进入家庭板；但允许小程序删除所有 folder 图卡又可能破坏成熟默认板。按链接所有权区分可编辑范围，既补齐原功能，又完整保护 CBoard 官方内容。
- **证据：** CBoard `boardManagement` 新增默认板添加/移除、本机与原生链接隔离、重命名同步和兼容包装测试，聚焦 `1 suite / 9 tests`，共享核心全量 `59 suites / 425 tests` 通过；微信持久化测试覆盖默认首页添加、重载和移除个人板入口，全量 `50 files / 197 tests`、TypeScript、ESLint、`153 app / 28 CBoard core` 边界及 production build 全部通过。生产包 main `296,328 B`、caregiver `1,490,189 B`、emergency `39,454 B`、management `449,852 B`、backup `1,482,607 B`、OCR `57,391 B`，全部低于 `1.5 MiB` 建议线。
- **生效范围：** CBoard 共享 `boardManagement` 契约、微信板管理页、本机 Board repository/storage 和患者板间导航；本条取代变动 101 中“内置默认板不可在微信端加链接”的临时限制。默认板仍不可改名、删除或移除官方原生链接，CBoard Web 原生编辑器、后端 Board API、分词、matcher、语音、账号同步和图片许可均不改变。本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送；真机触控与视觉仍待不抢焦点条件下的后续运行验收。
- **记录：** Codex（GPT-5.6），2026-07-21 14:21:40。

## 变动 103：原图语家服务端 TTS 迁入 cboard-api 并作为微信安全后备

- **意图：** 补回原图语家已经实现的服务端 OpenAI 兼容语音合成能力，避免微信同声传译插件临时不可用时患者完全失去朗读，同时继续完整复用微信原生语音与 cboard-api 账号体系。
- **决策：** cboard-api 新增认证 `POST /gpt/communication/speech`，只接受 JSON body 中 1 至 300 字文本和 0.5 至 2 的语速，服务端使用环境变量调用 OpenAI 兼容 `/audio/speech` 并返回 MP3；患者文字不进入 URL，响应标记 `no-store, private`，限制 8 MiB 和 25 秒。微信端保持 WechatSI 为第一优先级，仅在插件不可用、供应商、播放、超时或网络失败后，且用户已登录并配置可访问 API 时调用服务端；无效输入和主动停止绝不触发后备付费请求。
- **理由：** 原图语家的服务端 TTS 证明了该能力需要保留，但把 provider key 放进小程序会泄密，把患者文本放查询参数会进入代理日志，直接替换 WechatSI 又会增加成本和网络依赖。平台原生优先、认证后端后备可以在不复制第二套账号或后端的前提下提高核心沟通可用性。
- **证据：** cboard-api communication 模块 `83 passing`、production deploy template 校验通过；微信语音与本机清理定向 `4 files / 18 tests`，全量 `52 files / 206 tests`、TypeScript、ESLint、边界 `157 app / 28 CBoard core` 和 production build 全部通过；CBoard Communication Support 回归 `59 suites / 425 tests` 通过。生产包 main `296,328 B`、caregiver `1,495,412 B`、emergency `90,222 B`、management `455,202 B`、backup `1,482,653 B`、OCR `57,391 B`，均低于 `1.5 MiB` 建议线。超时后迟到响应不会写文件或播放；临时音频固定覆盖 `picinterpreter-tts-current.mp3`，正常结束、失败、停止和“清除本机数据”均会删除。
- **生效范围：** cboard-api communication TTS provider/controller/Swagger/生产环境示例，微信语音 adapter、AI 健康提示、照护设置和本机文件清理；CBoard Web 现有浏览器 TTS 保持不变，不新增客户端密钥、不改变分词、matcher、板数据或图片许可。真实 TTS provider 凭据与真机插件故障回退尚未运行验收；本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 15:10:42。

## 变动 104：原云端 TTS 音色选择迁为服务端白名单闭环

- **意图：** 补齐原图语家 `server-tts-voices.ts` 与设置页已经跑通的云端音色选择/试听能力，让照护者可以为微信插件失效后的服务端朗读选择合适音色，而不是所有用户只能使用部署者写死的单一默认值。
- **决策：** cboard-api 增加 `AI_TTS_VOICES` 逗号分隔白名单，`AI_TTS_VOICE` 默认音色始终自动加入；健康接口只公开默认音色和最多 20 个允许 ID，`POST /gpt/communication/speech` 在调用 provider 前拒绝清单外音色。共享 `CommunicationPreferences` 增加最长 80 字符的 `speechVoice`，空值表示跟随服务器默认并兼容旧数据。微信照护设置在登录并检测服务后显示公开清单，可选择并强制通过 cboard-api 试听；普通患者表达、接收全屏、紧急短句、常用语和历史朗读继续走统一 WechatSI 优先端口，并自动将同一偏好传给服务端后备。原 MVP 允许手输任意自定义 ID 的入口不直接复制；部署者仍可通过服务端白名单增加自定义音色。
- **理由：** 原 MVP 的多音色体验需要保留，但 cboard-api 已是多供应商通用后端，不能假定所有 provider 都支持同一组 CosyVoice 预设；允许客户端任意透传 ID 还会造成供应商参数注入、不可预测错误和付费请求。服务端发布能力、客户端只选公开项既保持可配置性，也让默认变化、下线音色和旧偏好有可恢复契约。
- **证据：** 原代码 `SERVER_TTS_VOICE_OPTIONS`、`ttsServerVoiceName`、云端音色选择与试听 UI 已核对。cboard-api 全部 communication 模块 `86 passing`、Swagger 路由与 production deploy template 通过；CBoard Communication Support `76 suites / 524 tests / 1 snapshot` 和 production build 通过；微信全量 `54 files / 212 tests`、TypeScript、ESLint、边界 `161 app / 28 CBoard core` 与 production build 通过。未压缩包 main `296,328 B`、caregiver `1,496,937 B`、emergency `90,886 B`、management `461,195 B`、backup `1,482,653 B`、OCR `57,391 B`，全部低于 `1.5 MiB`；产物门禁新增 speech endpoint/试听按钮标记，并真实两次拦截可选链，改为显式判空后通过。
- **生效范围：** cboard-api TTS config/provider/health/Swagger/部署示例，CBoard 中性偏好 schema，微信 AI health adapter、音色目录、照护设置、服务端试听和全部朗读后备请求；CBoard Web 原生浏览器语音选择保持不变，音色偏好当前只保存在本机，不进入患者文本、图板、匹配或账号事件数据。真实 provider 多音色、费用、音质和真机试听尚需部署凭据后验收；本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 15:59:01。

## 变动 105：完成原运行代码、issue 与迁移实现的差集复核

- **意图：** 防止覆盖矩阵只跟踪已知 issue，却漏掉原图语家源码中没有单独 issue 的运行能力；同时避免把 CBoard 已有成熟实现再次复制进 Communication Support。
- **决策：** 逐项反查原仓库 `src` 下 96 个源文件（含 20 个测试文件）和当前 62 条 GitHub issue。表达、接收、常用语、历史、紧急沟通、引导、设置、账号、同步、导入、分类导航、候选推荐、全屏播报、Service Worker 更新、语音和 AI provider 均已有迁移实现、CBoard 等价能力或明确延期边界。原 `UpdateBanner/usePwaUpdate` 不复制：CBoard 已通过 `registerServiceWorker`、`AppContainer`、`Notifications` 和 refresh action 提供等价的新版本提示；微信更新由小程序平台管理，不引入 Web Service Worker。原自动同步不直接复制到微信：保留首次登录确认合并、公共常用语/确认记录同步与私人图片不上云的既定隐私契约。`MatcherDemo` 等开发诊断页不进入患者产品。
- **理由：** “文件名不同”不等于功能缺失；重复实现更新横幅、同步器或 CBoard 图板导航会制造第二套状态和维护路径。反过来，只看 issue 状态也可能漏掉 PWA 更新、快捷常用语和同步启动等真实代码，因此必须同时核对源码入口、store、provider、测试和目标端 UI。
- **证据：** 在线 `gh issue list --state all` 返回 62 条 issue；原 `App.tsx`、设置、PWA、同步、快捷常用语、分类链接、候选推荐、占位图与 NLG 上下文源码均已逐项核对。新增 CBoard `App.container` 行为测试证明新版本回调发送 `refresh` 类型通知、首次缓存完成发送离线可用通知；定向 `1 suite / 8 tests` 通过，`git diff --check` 无新增格式错误。原常用语一键播报/载入/导入导出、图卡建议、会话上下文和分类导航在 Web/微信均找到真实 UI 与持久化证据。
- **生效范围：** 后续“原功能是否遗漏”的审计口径、CBoard PWA 复用边界、微信同步与平台更新边界；不改变现有业务语义、同步默认、Service Worker、微信包体、图板、分词、matcher、语音或后端 API。该结论只表示当前原运行代码均有明确去向，不把真实外网 provider、浏览器离线语音、微信新预览、真机触控/旋转/断网和多设备同步写成已验收。本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 16:14:24。

## 变动 106：CBoard 生产离线双向沟通完成桌面与移动端闭环

- **意图：** 用真实生产包和 Service Worker 证明 CBoard fork 的双向沟通核心在断网后仍能工作，避免把单元测试、旧 `build/` 或开发服务器结果误报为完整离线闭环。
- **决策：** 离线 E2E 显式完成首次使用引导、按管理弹窗正式无障碍名称定位、遵循“新对话”的二次确认，并只按“当前输出：”唯一文本定位表达结果。管理弹窗新增 `aria-labelledby` 契约。`sw-precache-config.js` 与离线静态服务器支持可选 `BUILD_PATH`；未设置时继续使用原 `build/`，不改变默认发布路径。
- **理由：** 首次引导会有意遮挡刚打开的接收端，管理页标题和新对话安全流程也已扩展；旧 E2E 跳过这些真实行为会产生假失败。标准 `build/` 又被 Windows 进程锁定，继续复用旧产物无法证明当前源码；可重复的隔离路径比终止无关进程、删除锁定文件或临时改配置更安全。
- **证据：** 管理弹窗与主面板定向 `2 suites / 27 tests` 通过；Node 语法、受影响文件 ESLint 和 `git diff --check` 通过。隔离 production compile 输出 `Compiled successfully`，同一目录生成 `service-worker.js`，预缓存 979 个资源、约 41.4 MB。无头 Chrome 的 desktop/mobile 两个项目最终 `2 passed`，真实覆盖首次引导、接收文字分词与匹配、换图、全屏展示、纠错记忆停用、患者表达候选确认、新对话二次确认、Service Worker 断网刷新和两条本地历史恢复。标准 `npm run build` 仍在清理 `build/.well-known/assetlinks.json` 时被 Windows `EPERM` 阻断，未冒充标准路径通过。
- **生效范围：** CBoard Web 双向沟通管理弹窗可访问性、生产离线 E2E 和隔离构建/Service Worker 验证基础设施；不改变图板、分词、matcher、纠错学习规则、API schema、微信小程序代码或默认发布目录。API 账号/settings/AI 与真实 MongoDB 的联调仍待本地数据库启动后验收；本轮只使用后台 shell 和无头 Chrome，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 16:54:20。

## 变动 107：cboard-api settings 中性与兼容字段补齐公开契约

- **意图：** 让 `communicationSupport` 和旧 `tuyujia` 不仅能被 Mongoose 保存，也成为 API 文档、Swagger 校验和客户端生成可见的正式 settings 字段。
- **决策：** 在 Swagger 的请求 `Settings` 与响应 `SettingsResponse` 中同时声明两个 object 字段；继续使用通用 `/settings`，不新增图语家专用路由。控制器单测捕获 `findByIdAndUpdate` 的真实参数，证明请求 ID 不能覆盖现有 settings ID，且两个 payload 均进入更新对象。
- **理由：** 模型和控制器已有字段，但 Swagger 未声明会让文档、类型生成和未来严格校验与运行时分叉；只让 mock 固定返回字段也不能证明更新调用真正收到数据。沿用通用 settings 接口最符合完整复用 cboard-api 的原则。
- **证据：** settings 单测 `3 passing`；最终后端聚焦集合 `101 passing`；Swagger YAML 解析、Prettier、`git diff --check` 与 production deploy template 全部通过。现有 Mongoose `Settings` schema 含 `communicationSupport`/`tuyujia`，控制器更新参数断言和 Swagger 两套 definition 均已核验。
- **生效范围：** cboard-api `/settings` 请求/响应公开契约、兼容字段测试和未来客户端生成；不改变数据库集合、认证、CBoard Web/微信 payload、AI provider 或同步策略。当前机器没有运行 MongoDB，`verify:communication-support-settings` 的真实登录、写入、读取和重启持久化仍未执行；未启动 Docker，未提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 17:10:08。

## 变动 108：CBoard 移动触控与横屏进入生产离线自动门

- **意图：** 在无法用桌面鼠标点击代替移动交互的前提下，持续拦截 CBoard 双向沟通在触控事件和横屏小高度视口中的回归。
- **决策：** 离线 E2E 增加平台动作适配：desktop 项目使用 `click()`，移动项目统一使用 Playwright `tap()`。保留 Pixel 5 竖屏，并新增宽高互换、保留 mobile/touch/user-agent 的 Pixel 5 横屏项目；三种项目运行同一完整生产断网闭环。
- **理由：** 原 mobile 项目虽然使用移动视口，但 `locator.click()` 仍是鼠标语义，不能证明触控命中；只测竖屏也无法发现横屏下全屏展示、管理页和长流程按钮被遮挡。共享同一场景可避免为横屏另写缩水 smoke test。
- **证据：** Playwright 正确列出 desktop/mobile portrait/mobile landscape 三个项目；JS ESLint、旧版 Prettier `--debug-check` 与 `git diff --check` 通过。隔离 production build + Service Worker 下最终 `3 passed`，三种形态均完成首次引导、接收匹配、全屏、换图纠错、纠错记忆、患者表达、会话确认和断网刷新历史恢复。
- **生效范围：** CBoard Web/PWA 生产离线自动化、移动触控事件和 Pixel 5 横屏视口；不改变业务组件、CSS、分词、matcher、存储或 API。模拟触控仍不能替代物理手机的安全区、系统旋转、权限、键盘和真实缓存验收；微信开发者工具未调用、未置顶，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 17:20:47。

## 变动 109：issue #74 固化 AI 图卡候选的跨端安全拒绝门

- **意图：** 防止把“图片由可信 cboard-api 域名代理”误当成“图片来源、许可和 AAC 适用性已审核”，并纠正覆盖矩阵对 issue #74 研究范围的旧描述。
- **决策：** 微信在线补图端口删除宽松的本地归一化，直接复用 CBoard 共享 `normalizeRuntimePictogram`；共享来源白名单继续只接受 ARASAAC、OpenSymbols、Mulberry、CBoard、CBoard 默认图包和设备私图。服务端即使从同源接口返回 `ai` 或 `ai-generated`，两端也必须拒绝，且微信不得下载或缓存。issue #74 继续保持研究任务，不实现 AI 生图供应商。
- **理由：** 同源 URL 只解决网络信任，不能回答图片是否准确表达词义、是否适合 AAC、是否需要 AI 披露以及是否具备可传播许可。让两个客户端各自维护白名单还会产生 Web 拒绝而微信接受的安全分叉。
- **证据：** 微信新增同源 AI 候选拒绝用例，定向 `1 file / 6 tests`，完整 `54 files / 213 tests`、TypeScript、ESLint、`161 app files / 28 CBoard core files` 边界检查全部通过；生产产物兼容检查通过，775 张照护与备份默认图片完整，未压缩 main `296,328 B`、caregiver `1,496,262 B`、emergency `90,886 B`、management `461,195 B`、backup `1,482,653 B`、OCR `57,391 B`，均低于 `1.5 MiB` 建议线。CBoard attribution 定向 `1 suite / 5 tests` 与 `git diff --check` 通过。
- **生效范围：** CBoard 共享图源归属契约、微信 cboard-api 在线补图响应归一化和离线缓存入口；不改变现有 ARASAAC/OpenSymbols/CBoard/设备私图，不新增 AI 生图、模型调用、客户端密钥或供应商依赖。真实研究样本、患者/照护者可理解性测试、许可声明和披露 UI 尚未完成，因此不得把 AI 图卡能力标记为可用。本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 17:41:12。

## 变动 110：cboard-api 统一图源归属白名单并阻断未批准图片持久化

- **意图：** 将 AI 图卡的拒绝边界从新客户端扩展到服务端，保护旧客户端和跨设备常用语，避免未知 provider 的图片 URL 进入云端后失去归属信息继续传播。
- **决策：** 新增单一 `pictogramAttribution` helper，统一 ARASAAC、OpenSymbols、Mulberry、CBoard 和 CBoard 默认图包白名单、HTTPS 来源及字段限长；在线搜索、确认接收记录和常用语同步共同复用。常用语若显式携带归属但归属不合法，同时剥离图片 URL；没有归属字段的旧 CBoard 公网图片继续兼容。`device-private`、`ai` 和 `ai-generated` 都不能成为服务端公共归属。
- **理由：** 三处复制白名单会随新 provider 漂移；只删除未知署名但保留图片 URL，会让旧客户端在不知道图片来源和许可的情况下继续显示或同步。旧数据没有 attribution 与显式提供错误 attribution 必须区分，才能在安全和兼容之间保持清晰边界。
- **证据：** 新 helper 验证合法归属、AI/设备私图拒绝和 HTTPS 来源；搜索 helper/路由、确认记录和常用语控制器定向 `32 passing`。完整 communication/pictogram/settings 聚焦集合 `101 passing`；6 个相关文件全部通过 Prettier 1.19，`git diff --check` 无空白错误。
- **生效范围：** cboard-api 在线补图响应、确认接收记录归属、常用语输出图片及未来公共图源扩展；不改变合法 ARASAAC/OpenSymbols/CBoard 数据，不删除旧版无 attribution 的公网 CBoard 图片，不实现 AI 生图供应商，也不上传设备私图。未启动 Mongo/Docker，真实数据库持久化与旧客户端联调仍按既有外部门等待明确授权。本轮只运行后台 shell，未打开、置顶、聚焦微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 17:53:12。

## 变动 111：当前微信源码通过官方无窗口预览推送

- **意图：** 在不再次置顶或抢占微信开发者工具窗口的条件下，把手机从旧预览更新到当前源码，为真实触控、旋转、断网和错误恢复验收建立有效版本基线。
- **决策：** 按官方 Skill 门禁先用明确的新版安装根目录检查 Electron，再检查登录和 Skill 版本；只调用无需 `open_project_window` 的 `auto_preview`。不调用项目开窗、窗口二维码、模拟器截图、自动化点击或上传发布。
- **理由：** 旧手机预览无法验证最近加入的分包、当前图源安全门和最新 UI；但普通编译/自动化会打开项目窗口并可能抢焦点。官方 previewer 明确支持无窗口预览，能够同时满足版本更新和桌面不被打断。
- **证据：** `D:\Tencent\微信web开发者工具` 为 Electron `2.02.2607202`，CLI 可用；`check_wechatide_status` 返回登录有效、Skill `0.3.1` 与工具一致。`auto_preview` 返回 `success: true`；压缩后总包 `3,764,201 B`，main `321,907 B`、backup `1,453,401 B`、caregiver `1,459,473 B`、emergency `40,214 B`、management `435,063 B`、OCR `54,143 B`，各单包均低于 `1.5 MiB` 建议线。
- **生效范围：** 微信当前源码真机预览版本、覆盖矩阵 #33/#67 和后续人工验收基线；不代表真机触控、横竖屏、系统断网、权限、图片解码和错误恢复已经通过，不是体验版上传或正式发布。全程没有调用 `open_project_window`、窗口二维码或模拟器自动化，未置顶/聚焦开发者工具，未提交或推送代码。
- **记录：** Codex（GPT-5.6），2026-07-21 17:57:58。

## 变动 112：cboard-api 在线补图增加有界短期缓存与并发合并

- **意图：** 让真实部署后的缺词自动补图在重复点击、多客户端查询同一词和上游短暂抖动时保持可用，避免每次请求都重新访问 ARASAAC/OpenSymbols。
- **决策：** 每个 API 进程按规范化 token 缓存最多 256 项；通过来源白名单的成功结果保留 15 分钟，无结果或暂时失败只保留 15 秒。同一 token 的并发请求共享一个进行中的 Promise；LRU 命中更新顺序，超过容量淘汰最旧项。缓存只在内存中，不写 Mongo、磁盘、日志或客户端设置。
- **理由：** 无限缓存会积累患者词语并长期保留过期图；完全不缓存会放大上游延迟、配额和故障。短负缓存既能抑制连续点击，又允许网络恢复后快速重试；并发合并可消除同一时刻的请求风暴而不改变结果语义。
- **证据：** 搜索测试覆盖跨请求成功命中、容量 1 时 LRU 淘汰、同词并发只访问上游一次、负缓存到期后重新请求；定向 `8 passing`。communication/pictogram/settings 完整聚焦集合 `104 passing`，相关文件通过 Prettier 1.19，`git diff --check` 无空白错误。
- **生效范围：** cboard-api 当前进程的 ARASAAC/OpenSymbols 搜索编排和响应时延；不缓存图片二进制，不跨进程共享，不改变客户端候选、照护者确认、许可、离线文件或 AI 生图边界。真实外网上游延迟、限流和多实例命中率仍需部署后观测。本条发生在当前微信预览推送之后，但未修改小程序源码，因此无需重新推送预览；未启动 Mongo/Docker，未打开、置顶或聚焦开发者工具，未提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 18:05:31。

## 变动 113：OpenSymbols token 获取与 401 刷新按请求合并

- **意图：** 防止多个不同缺词同时回退 OpenSymbols 时重复交换短期 access token，并防止 token 失效后多个 401 各自刷新。
- **决策：** `pictogramSearch` 为 token 获取维护单一 in-flight Promise。正常请求复用当前 token；刷新调用携带被拒绝的旧 token，如果另一请求已经换成新 token 就直接复用，只有当前值仍等于被拒绝值时才发起一次刷新。Promise 完成或失败后清理，不持久化 secret/token。
- **理由：** 结果缓存只合并相同 token，不会合并“苹果”和“喝水”这类不同词；二者仍可能同时请求 OpenSymbols 鉴权。401 后无版本识别的强制刷新还会在第一个请求已经成功换 token 后继续重复刷新。
- **证据：** 新测试证明两个不同词并发时首次 token POST 计数为 1；两个请求同时收到旧 token 的 401 时总 POST 严格为 2（首次一次、刷新一次），两个搜索都成功。搜索定向 `10 passing`，完整 communication/pictogram/settings 聚焦 `106 passing`，Prettier 与 `git diff --check` 通过。
- **生效范围：** cboard-api 单进程 OpenSymbols token 生命周期和搜索可靠性；不改变 token 响应内容、secret 存放、ARASAAC、图片代理签名、客户端候选或照护者确认。真实 OpenSymbols 凭据、配额与多实例仍待生产验证。本条不修改小程序源码，当前手机预览继续有效；未打开、置顶或聚焦开发者工具，未启动 Mongo/Docker，未提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 18:10:07。

## 变动 114：OpenSymbols 外部图片在服务端统一为受限 PNG

- **意图：** 修复“在线候选已经搜索成功，但微信真机仍不显示图片”的跨格式缺口，让 OpenSymbols 的 SVG、WebP 或其他可解码图源在进入小程序前具有稳定且一致的像素格式。
- **决策：** cboard-api 新增独立 `pictogramImage` 边界，使用固定版本 Sharp `0.35.3` 解码 OpenSymbols 二进制；输入最多 2 MiB、最多 1600 万像素、单页且最多 4 通道，输出统一为不超过 `300 x 300` 的 PNG。损坏内容、超限尺寸、非图片或转换失败统一返回受控 502，不把原始 SVG/WebP 继续发给客户端；ARASAAC 原有 300px PNG 路径保持直通。
- **理由：** HTTP `image/*` 和成功下载只能证明取得了字节，不能证明微信 Image 组件能够稳定解码；在服务端的可信代理边界一次归一化，既不把原生图片库塞进 2 MiB 小程序包，也能用字节、像素、页数和输出格式限制外部输入风险。
- **证据：** 新测试真实执行 SVG→PNG、WebP→PNG，并验证损坏字节、声明超大像素和超过 2 MiB 输入均被拒绝；图片/search/route 窄回归 `19 passing`，communication/pictogram/settings 聚焦 `111 passing`。Sharp 声明与实际加载版本均为 `0.35.3`，Yarn `--frozen-lockfile --offline` 校验通过，相关文件通过 Prettier 1.19，`git diff --check` 无空白错误。
- **生效范围：** cboard-api 的 OpenSymbols 签名图片代理、Swagger PNG 响应契约和未来微信/Web 在线候选下载；不改变 ARASAAC、来源许可、照护者确认、本地图包、matcher、分词、AI 或小程序代码包。该变动尚未部署到公网 API，当前手机预览不会自动获得它；真实 OpenSymbols 凭据、生产容器和真机显示仍需后续部署验收。本轮仅使用后台 shell，未打开、置顶、聚焦或抢占微信开发者工具，未启动 Docker/Mongo，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 18:24:30。

## 变动 115：微信图卡渲染统一提供非空白降级

- **意图：** 修复图片地址为空、本机缓存文件丢失或微信运行时解码失败时整张图卡留白的问题，让患者和照护者至少始终看见对应词语。
- **决策：** 新增应用级 `PictogramImage` 组件和纯状态函数；正常地址继续使用 Taro `Image`，只有空地址或当前地址触发 `onError` 时切换为高对比词语卡片。失败状态按图片地址记录，后续换成新地址即可自动恢复尝试，不形成永久失败。患者表达、默认图板、搜索与建议、接收复核/换图/全屏、常用语、历史、缺词补图、紧急短句、排序设置、个人覆盖和个人图卡编辑全部复用同一组件。
- **理由：** 服务端 PNG 归一化只能处理 OpenSymbols，无法覆盖本地图包文件缺失、微信文件过期、个人图片损坏或其他运行时错误；每个页面各写一个 `onError` 又会产生不一致。统一组件可以在不改变 matcher、图源和图片数据的前提下消除不可理解的空白状态。
- **证据：** 纯状态测试覆盖空源、失败源、新地址恢复和无标签默认文案；仓库扫描确认除共享组件自身外没有剩余原生 `Image` 渲染。微信全量 `55 files / 216 tests`、TypeScript、全量 ESLint、`164 app files / 28 CBoard core files` 边界和 44 板/825 图卡/775 图片完整性均通过；Taro production build 成功，未压缩 main `296,335 B`、caregiver `1,498,346 B`、emergency `92,753 B`、management `463,084 B`、backup `1,484,556 B`、OCR `57,391 B`，各包低于 1.5 MiB 建议线。
- **生效范围：** 微信小程序所有当前图卡与个人图片预览；不修改图片二进制、分词、matcher、来源许可、在线搜索、CBoard Web 或 cboard-api。最新源码尚未无窗口推送，因此真机是否触发降级、词语卡可读性和新文件恢复仍待下一次预览验收；本轮只运行后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 18:46:26。

## 变动 116：775 张离线默认图改为主包单份共享

- **意图：** 在继续完整离线携带 CBoard 默认图库的前提下，消除 caregiver 与 backup 两个分包各复制 775 张图造成的包体浪费，并为后续功能保留安全余量。
- **决策：** 按微信普通分包可引用主包资源的边界，把全部默认图只复制到 `/assets/cboard-default`；患者、接收、个人图库、紧急页和官方 E2E 均使用同一绝对路径。历史 `/packages/caregiver/...` 与 `/packages/backup/...` 路径在个人图库和 ZIP 归档读取边界归一化到新路径，不丢弃旧数据。紧急分包继续保留两张图语家专用本地图，但 6 张 CBoard 紧急图改为复用主包。
- **理由：** 原产物把同一套 `953,152 B` 图片打包两次，并额外复制紧急子集，caregiver 和 backup 都已接近 1.5 MiB 建议线；改用 CDN 会破坏首次安装后的完全离线沟通。主包单份共享同时保住离线能力、减少总下载体积并消除不同分包副本漂移。
- **证据：** 生产质量门确认 main 恰有 775 张 / `953,152 B`，caregiver、backup、emergency 的 `cboard-default` 副本均为 0；总未压缩包体由 `3,892,465 B` 降为 `2,930,817 B`，减少 `961,648 B`。当前 main `1,249,487 B`、caregiver `545,063 B`、emergency `84,559 B`、management `462,953 B`、backup `531,364 B`、OCR `57,391 B`，各包低于 1.5 MiB。微信全量 `55 files / 216 tests`、TypeScript、正式 ESLint、变动脚本定向 ESLint、`164 app / 28 CBoard core`、默认板完整性及 Taro production build 全部通过；质量门新增分包重复图片硬失败。
- **生效范围：** 微信构建配置、默认 BoardDTO 图片路径、个人图库/归档旧路径兼容、紧急图映射、官方 E2E 常量和产物性能门；不改变图片像素、图卡 ID、分词、matcher、许可、CBoard Web 或 cboard-api。主包首次下载增加约 953 KiB，但仍低于建议线且之后所有普通分包共同复用；最新源码尚未无窗口推送，真实微信端主包图片引用和旧数据迁移仍待下一次真机验收。本轮未调用、打开、置顶、聚焦或抢占开发者工具，未预览、上传、发布、提交或推送。性能依据继续采用[微信官方《小程序性能优化指南》](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **记录：** Codex（GPT-5.6），2026-07-21 18:58:54。

## 变动 117：微信默认中文图卡显示、朗读与板块入口统一

- **意图：** 修复经过中文校正的默认图卡仍朗读 CBoard 原错误译文，以及跳转卡显示名称与实际进入板块不一致的问题，保证患者看到什么就听到什么、点进什么板就显示什么名称。
- **决策：** 在共享 `TileDTO v1` 增加显式 `synchronizeVocalizationLabelKeys` 选项，只对调用方列出的官方 labelKey 使用已解析标签作为 vocalization；不全局覆盖自定义发音。微信把人工中文覆盖和共享概念 profile 的键列入该选项，并在所有默认 BoardDTO 建立后，将导航 tile 的标签与发音统一为目标板名称。
- **理由：** 旧链路只校正可见 label，`牛奶` 的 vocalization 仍可能保留错误的 `牛肉`；只校准少数餐具键也会让其他已审阅词继续出现所见非所读。导航卡依赖同一份低质量翻译时，还可能把“植物”显示成“厂”。共享选项必须是逐键启用，才能保留用户自定义图卡独立设置的发音。
- **证据：** 共享 DTO 定向 `1 suite / 8 tests`，微信默认板与搜索定向 `2 files / 8 tests`；回归逐项证明 `牛奶/叉子/刀/勺子/碗` 的 label 与 vocalization 相同，并遍历全部导航 tile 断言其 label/vocalization 等于目标板名称。CBoard 双向沟通全套 `74 suites / 517 tests`、微信全量 `56 files / 222 tests`、TypeScript、两端变动 ESLint、微信 `165 app / 28 CBoard core`、44 板/825 图卡/775 图片完整性及两端 production build 全部通过。微信包体仍为 main `1,249,487 B`、caregiver `545,601 B`、emergency `84,559 B`、management `463,491 B`、backup `531,902 B`、OCR `57,391 B`。
- **生效范围：** CBoard 中性 DTO 的可选翻译校准契约、微信内置 CBoard 默认板中文显示/朗读及导航入口；不修改 CBoard 官方 `boards.json`/`zh-CN.json`，不改变 matcher、图片像素、个人图卡独立发音、在线图源、API 或同步。最新源码尚未无窗口推送，真实 TTS 发音、板块跳转文案和主包图片仍待下一次手机验收；本轮只使用后台 shell，未调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 19:11:58。

## 变动 118：默认中文图卡完成跨端质量审查并守住安全匹配边界

- **意图：** 清理 CBoard 默认中文里仍会让患者误解或朗读错误的历史译文，同时防止更自然的新标签反向破坏图语家已经建立的分词和匹配安全门。
- **决策：** 微信以 74 个经审阅的 labelKey 覆盖食物、情绪、衣物、身体、时间、动作、家人、动物、植物、交通和医疗等默认词，并继续让显示与朗读逐键同步；CBoard Web 的 `zh-CN.json` 同步修正 149 个现有值。两端都增加默认板中文质量测试，拒绝未审阅英文和尾随冒号。完整回归发现“坏”图卡初稿使用“**不好**”会从“**好不好**”中产生部分匹配，因此两端统一改为“**坏**”，不放宽高风险照护语句断言。
- **理由：** 已同步的最新 upstream 仍存在“植物→厂、碗→弓箭手、牛奶→牛肉”等明显错误，不能直接作为中文 AAC 语义；但翻译优化也不能只看文案是否自然，短词、否定词和反问结构必须经过真实 matcher 回归。显示、朗读、默认板生成数据和 Web 翻译需要同源审查，才能避免两端再次漂移。
- **证据：** Web 翻译质量、matcher 与 80 条照护者夹具定向 `3 suites / 113 tests`，完整 Communication Support `75 suites / 529 tests`；微信完整 `57 files / 230 tests`、TypeScript、ESLint、`166 app / 28 CBoard core` 边界、44 板/825 图卡/775 图片一致性全部通过。两端 production build 成功；微信 775 张默认图仍只在主包保存一份，main `1,249,487 B`，距 1.5 MiB 建议线 `323,377 B`，其余分包为 `57,391–549,232 B`。
- **生效范围：** CBoard Web 默认中文翻译、微信默认 BoardDTO 显示/朗读/导航名称、板库生成指纹及跨端中文质量回归；不改变图卡 ID、板结构、个人图卡独立发音、在线图源、API、账号或同步。最新源码尚未推送预览，真实手机中文显示、朗读和板间导航仍待下一次人工验收。本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 19:31:24。

## 变动 119：默认中文改为可持续同步的独立 AAC 审阅层

- **意图：** 继续清理首批 74 项之外仍残留在默认板中的明显机翻，并避免以后同步 CBoard upstream 时把人工校正覆盖掉或让 Web 与微信再次分叉。
- **决策：** 新增中性 `zh-CN.aac-review.json`，集中保存 272 个已经核对且确实存在于默认板的 labelKey；CBoard Web 仅在 `zh-CN` 运行时合并该层，其他语言和 upstream 基础翻译保持不变。微信板库生成器同时读取基础翻译与审阅层，并把两个文件的 SHA-256 都纳入过期检查。匹配、纠错和照护夹具统一使用合并后的真实运行词表。
- **理由：** 实际生成板仍发现“煮鸡蛋→吹过的蛋、番茄酱→番茄休眠、卫生巾→卫生冲锋枪、猫→笼子、啤酒→啤酒店”等大量错误；继续把修正直接散落在 Web JSON 和微信 TypeScript 中会制造两份来源。独立覆盖层既保留完整复用 upstream 的能力，也让图语家的中文 AAC 审阅证据可维护、可测试、可追踪。
- **证据：** 272 个审阅键全部命中真实 CBoard 默认 tile，未使用键为 0；测试还拒绝未审阅英文、尾随冒号和未经允许的跨概念同名，并通过 SVG 语义复核把长裤/三角内裤分开。Web 定向 `5 suites / 130 tests`，最终核心集合 `76 suites / 539 tests`；微信 `57 files / 235 tests`、TypeScript、ESLint、`166 app / 28 CBoard core`、44 板/825 图卡/775 图片与两端 production build 全部通过。微信 main `1,249,487 B`，距 1.5 MiB 建议线 `323,377 B`，其余分包为 `57,391–546,690 B`。
- **生效范围：** CBoard Web 中文运行时消息、Communication Support matcher/纠错测试、小程序默认板生成与指纹门、默认图卡显示和朗读；不修改图卡 ID、板结构、其他语言、个人图卡发音、在线图源、API 或同步。272 项代表本轮已确认并纳入硬门的修正，不声称未经人工逐图验收的其余词永远无误。最新源码尚未推送手机预览；本轮只使用后台 shell，没有调用、打开、置顶、聚焦或抢占微信开发者工具，未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 19:54:08。

## 变动 120：CBoard 个人板所有权与沟通者关联改为原子写入

- **意图：** 保证图语家的个人图卡或个人板从默认 CBoard 复制、新建链接板或递归复制板树时，新增板一定进入当前用户自己的沟通者，并能沿用现有 API 保存链长期保留。
- **决策：** 新增 `verifyAndAddBoardCommunicator` 原子 thunk，在同一个不可分割的数据变换中先把板 ID 合并进沟通者，再执行用户所有权校验与 upsert；访客在本地创建板后立即调用，登录用户在 API 保存开始前调用。Board TileEditor、Board 递归复制和 CommunicatorDialog 复制入口统一复用该 action。`EDIT_COMMUNICATOR` 与 `ADD_BOARD_COMMUNICATOR` reducer 同时改为不可变更新，后者拒绝重复板 ID。
- **理由：** 旧入口先向当前活动沟通者派发 `ADD_BOARD_COMMUNICATOR`，随后才校验所有权；旧 reducer 又通过浅复制数组后原地修改沟通者对象，使后续旧 React props 偶然携带新板。该行为违反 Redux 不可变约束，一旦修正 reducer 或渲染时序变化，登录用户就可能从旧 props 再创建一个不含新板的沟通者，造成个人板未关联、重复沟通者或同步后丢失。把板 ID 与所有权转换合并，才能消除对对象污染和调用时序的依赖。
- **证据：** 新 action 测试覆盖访客不修改源对象、登录用户取得所有权和重复板去重；reducer 测试覆盖旧 state/嵌套对象不被修改；Board 容器测试覆盖访客本地导航、登录保存委托和 API 持久化前原子关联。定向 `3 suites / 51 tests`、相关模块 `9 suites / 230 tests / 13 snapshots`、整站 `178 suites / 1122 tests / 72 snapshots` 全部通过；变动文件 ESLint 为 `0 errors`，`git diff --check` 无空白错误。标准输出目录受 Windows 对旧 `build/.well-known/assetlinks.json` 与 `node_modules/.cache/.eslintcache` 的文件锁影响，未终止任何进程；改用隔离 `BUILD_PATH`、保留独立 ESLint 门并关闭重复 webpack ESLint 插件后，CRA production 编译成功，`sw-precache` 实际生成约 `41.4 MB / 979 resources` 的 Service Worker，入口、manifest、主 bundle 和 `service-worker.js` 均已核验，临时产物已清理。
- **生效范围：** CBoard Web 的链接板创建、公开板/板树复制、沟通者本地状态和既有 API 持久化调用顺序；不改变 CBoard BoardDTO/TileDTO、cboard-api schema、微信小程序代码、matcher、分词、图片或语音。没有打开、置顶、聚焦或操作微信开发者工具，没有预览、上传、发布、提交或推送；真实登录账号跨设备同步仍需后续联调验收。
- **记录：** Codex（GPT-5.6），2026-07-21 20:10:53。

## 变动 121：CBoard 合并同一本地沟通者的并发创建请求

- **意图：** 防止新建或复制个人板触发多个保存链时，同一个尚未取得服务端 ID 的用户沟通者被并发 POST 多次，形成重复远端沟通者。
- **决策：** `upsertApiCommunicator` 仅对短本地 ID 和默认本地 ID 的“创建”请求维护进程内 in-flight Map，以“本地沟通者 ID + 当前账号邮箱”为键复用同一个 Promise；成功或失败后都在 `finally` 中按 Promise 身份清理。长服务端 ID 的普通更新不合并，继续逐次 PUT，避免吞掉后续编辑。同步逻辑中原“服务器创建多个沟通者”TODO 随当前客户端并发根因消除。
- **理由：** 原逻辑在每个调用中独立判断短 ID 并立即执行 `createApiCommunicator`，两个近同时发生的板保存都会 POST `/communicator`。只给所有 upsert 做统一防抖又会丢失合法的远端更新；失败后不清理则会让该沟通者永远无法重试。按账号和本地 ID 只合并进行中的 create，可以最小化行为变化并保持失败恢复。
- **证据：** action 测试证明两个并发 create 只调用一次 API 且共享结果；共享失败后第三次调用会重新请求；同一远端 ID 的两个 update 仍调用两次 API。定向 `1 suite / 24 tests`、相关 `9 suites / 233 tests / 13 snapshots`、整站 `178 suites / 1125 tests / 72 snapshots` 全部通过；变动 ESLint 为 `0 errors`，`git diff --check` 无空白错误。隔离 CRA production 编译成功，主 bundle `main.c30cce97.js`，`sw-precache` 再次生成约 `41.4 MB / 979 resources` 的 Service Worker并核验入口、manifest 与产物，临时目录已清理。
- **生效范围：** 单个 CBoard Web JavaScript 进程内、同一账号同一本地沟通者的并发创建；不改变已存在沟通者 PUT、创建响应 schema、cboard-api、微信小程序或用户主动创建多个不同沟通者。跨标签页、跨设备、旧客户端以及“服务端已创建但客户端在收到响应前超时”的重试仍需要后端幂等键，历史重复数据也不在本条自动删除。没有打开、置顶、聚焦或操作微信开发者工具，没有预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 20:19:18。

## 变动 122：CBoard 与 cboard-api 建立跨进程沟通者创建幂等契约

- **意图：** 补齐进程内 Promise 合并无法覆盖的跨标签页、跨设备及“服务端已创建但客户端收包前超时”重试，防止同一本地沟通者在远端形成重复记录，同时继续允许同一账号主动创建多个不同沟通者。
- **决策：** CBoard Web 在创建短本地 ID 沟通者时发送可选 `Idempotency-Key`，默认本地沟通者的旧 update-create 分支改为复用同一创建函数；缺少本地 ID 时不发送该头，保留旧客户端行为。cboard-api 新增不公开的 `clientCreationKey` 字段，以 `{ email, clientCreationKey }` 建立带 `partialFilterExpression` 的唯一索引，只索引实际带键的新记录。控制器先按可信 `req.user.email` 查找并重放既有响应，并以 Mongo `11000` 后再次查询处理并发竞态；带键请求必须使用登录账号邮箱，非法键在持久化前拒绝。更新接口忽略客户端试图写入的内部键。
- **理由：** 邮箱不能直接唯一，因为 CBoard 合法支持一个账号拥有多个沟通者；普通 sparse 复合索引仍可能把缺少创建键的历史记录纳入唯一约束。稳定本地 ID 能区分“同一次创建重试”和“新建另一个沟通者”，部分唯一索引又能让历史数据与无键旧客户端保持兼容。只有数据库唯一约束加重复键重查，才能覆盖两个 API 进程同时通过预查询的真实竞态。
- **证据：** Web API 定向 `1 suite / 34 tests`，整站 `178 suites / 1126 tests / 72 snapshots`；cboard-api 全部无数据库单元测试 `129 tests`，其中新增 8 项覆盖同键重放、不同键保留、`11000` 竞态恢复、非法键、账号隔离、旧请求兼容、部分唯一索引及 Swagger 头契约。变动静态检查为 `0 errors`，只保留两条既有测试未使用变量警告；两仓 `git diff --check` 与 API 语法、Swagger 解析、新测试 Prettier 均通过。隔离 production build 成功，主 bundle `main.9d5eafb3.js`（原始 `6,535,741 B`，约 `1.65 MB gzip`），`sw-precache` 生成约 `41.4 MB / 979 resources` 的 Service Worker并核验入口、manifest 与产物，临时目录已清理。
- **生效范围：** CBoard Web 新版客户端到 cboard-api 新版服务端的沟通者 POST；不改变 BoardDTO/TileDTO、微信小程序、matcher、分词、图片、语音、已取得服务端 ID 的普通 PUT、不同本地 ID 的多个沟通者或无键旧客户端。代码尚未提交、推送或部署；真实 Mongo 必须确认部分唯一索引成功创建后，跨进程竞态保证才正式生效。历史重复记录不会自动删除，真实账号跨标签页/跨设备/超时重试仍待部署联调。本轮只使用后台 shell，没有调用、打开、置顶、聚焦或操作微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-21 20:37:29。

## 变动 123：通信唯一索引进入 API 启动与健康就绪门

- **意图：** 让跨进程沟通者创建幂等、接收记录同步和收藏短语同步所依赖的唯一索引成为可观察、可验证的服务就绪条件，避免 schema 已声明但生产数据库尚未建索引时 API 仍错误报告健康。
- **决策：** 直接复用当前 Mongoose 5.13.20 已提供的 `Model.createIndexes()`，由一个轻量 coordinator 读取三个既有 schema 的索引定义，在 Mongo `connected` 后建立 `Communicator`、`CommunicationReceiverRecord` 和 `CommunicationSavedPhrase` 索引；并发初始化共享同一 Promise，失败可重试，断线会使旧构建结果失效。三个 schema 为所需唯一索引指定稳定名称，继续作为索引定义的唯一事实源，不在 helper 中复制底层 Mongo 索引规格。
- **理由：** 单靠 Mongoose schema 声明无法证明目标数据库已经完成建索引，Mongo 断线重连也会使旧就绪状态失真；自行维护第二份 `createIndex` 规格容易与 model 漂移。复用框架原生 API，配合有界状态机和断线 generation，可以用最小胶水代码把成熟底座能力接入部署门，而不重新研发索引管理器。
- **证据：** 新增测试覆盖三个 model 均调用内建 `createIndexes()`、并发合并、失败重试、断线使旧 Promise 失效、schema 中三个命名唯一索引、数据库 connected/disconnected 事件、健康控制器和公开 Swagger 路由。cboard-api 全量无数据库单元回归为 `140 passing`；`verify:production-deploy-template` 通过；package JSON、Swagger YAML、相关 Node 语法和 `git diff --check` 均通过。公开 `verify:communication-readiness` 脚本只在 `/health` 同时返回 Mongo `connected` 与索引 `ready` 时成功，不需要账号或密钥。
- **生效范围：** cboard-api 启动、Mongo 重连、`/health`、Swagger 和部署后 smoke check；不改变 CBoard Web 或微信 UI、BoardDTO/TileDTO、matcher、分词、图片、语音、业务记录 schema 或历史数据。代码尚未提交、推送或部署；本轮没有启动 Docker/真实 Mongo，所以只证明 wiring、契约和失败路径，生产索引实际创建仍必须在部署后由公开 verifier 验收。全程只使用后台 shell，没有调用、打开、置顶、聚焦或操作微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-21 20:50:12。

## 变动 124：README 反向审计与 TTS 官方 SDK 复用

- **意图：** 防止只按 GitHub issue 追踪而漏掉原 README 已声明并跑通过的首次引导、高对比度、分类可见性和更新提示，同时消除 cboard-api 中唯一仍手写成熟 OpenAI-compatible 语音 HTTP 协议的实现。
- **决策：** 逐项核对原组件与两端工作树，确认四项功能均已通过中性契约、CBoard 原生能力或微信平台 API 落地，因此不再复制 UI；在 cboard-api 中改用仓库已安装的 OpenAI 官方 Node SDK `client.audio.speech.create()`。鉴权、Base URL、超时、一次重试和二进制响应交给 SDK；保留可注入的 SDK `fetch` transport，以及现有文字长度、语音白名单、MP3 Content-Type、8 MiB 响应上限和错误脱敏。TTS provider 缓存签名同时纳入 `AI_TTS_VOICES`。
- **理由：** “未单列 issue”不等于功能缺失，盲目重做会形成第二套 onboarding/accessibility/update 逻辑。OpenAI SDK 已由 AI 候选链使用并包含正式 speech resource，自行拼接 `/audio/speech`、Authorization、AbortController 和状态码会重复维护官方协议；只保留业务安全层和注入胶水更符合复用优先。漏掉语音白名单的缓存签名还会使运行时只改该配置时继续暴露旧列表。
- **证据：** 原 README 与 `OnboardingModal`、settings store、UpdateBanner 对照双端 `communicationOnboarding`、`communicationPreferences`、Web Service Worker callback 和微信 `getUpdateManager` 代码/测试，已新增非 issue 功能补充表。本地安装的 `openai/resources/audio/speech.js/.d.ts` 明确提供 `audio.speech.create` 和二进制 `Response`；官方仓库为 https://github.com/openai/openai-node 。TTS 定向回归 `27 passing`，其中 controller 测试真实经过本地 SDK并只替换标准 `fetch Response`；cboard-api 全量无数据库单元回归 `142 passing`，生产部署模板、Node 语法和 `git diff --check` 通过。
- **生效范围：** cboard-api 认证后的 Communication Support TTS provider、AI health 中的语音白名单刷新，以及迁移覆盖矩阵；不改变 Web/微信请求 schema、WechatSI 优先策略、服务端 TTS 降级顺序、语音模型/声音配置、BoardDTO/TileDTO、图片、分词、matcher 或本地沟通。未配置密钥时继续安全禁用；本轮没有真实供应商凭据，因此不声称公网 TTS 已通过。没有新增依赖、提交、推送、部署、预览或发布，全程未调用、打开、置顶、聚焦或操作微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-21 21:05:31。

## 变动 125：微信复用 CBoard 语义补齐标准 OBF/OBZ 本机导入

- **意图：** 让照护者无需先经过 Web 或重新手工录入，就能把 CBoard 和其他 AAC 工具导出的 Open Board 文件导入微信本机图库，同时不复制 CBoard 的 React DOM/Material UI 导入器。
- **决策：** 从 CBoard 现有导入 helper、BoardDTO、个人板管理和设备私图归属中提取平台无关 `openBoardFormat.js`；Web 原 helper 改为复用同一校验器。微信只在低频 `packages/backup` 分包接入既有 JSZip，支持单 OBF 与 OBZ、多板路径/ID 跳转、固定网格、`ext_cboard_*` 扩展、merge/skip 冲突以及 PNG/JPEG/GIF/WebP 图片本机暂存。导入板统一使用设备私有前缀，不覆盖默认 root；完成后由既有板块管理决定是否加入首页。`react-obf` 经源码审计只是 OBF 渲染组件，不是解析器，因此不引入；Android-only 的 `cboard-speech-tts` 和 Web-only 的 `react-scannable` 也不错误搬入 Taro。
- **理由：** CBoard 已经定义成熟的 Open Board 语义、DTO 和板管理边界，重新设计格式会制造跨端漂移；但直接搬运浏览器 UI 会违反小程序包体和运行时限制。共享纯核心加薄平台文件/存储适配器可以最大程度复用，JSZip 隔离在备份分包又不会拖慢患者沟通首屏。设备私图仍不接入 CBoard 当前公开 Blob 上传路径，因为可直接访问 URL 与本机私密承诺冲突；云端家庭图库需等待私有鉴权资源协议。
- **证据：** CBoard 共享核心与原 Import helper 定向 `2 suites / 10 tests`、新增文件 ESLint 和 `git diff --check` 通过。微信完整 `57 files / 238 tests`、TypeScript、ESLint、`166 app files / 29 CBoard core files` 边界检查及 Taro production build 全部通过；44 板、825 图卡、775 图片完整。未压缩 main `1,249,487 B`，距 1.5 MiB 建议线 `323,377 B`；backup `544,132 B`，证明 JSZip/OBF 导入仍隔离在低频分包。
- **生效范围：** CBoard Web Open Board 校验、跨平台 BoardDTO 导入纯核心、微信照护工具的备份分包、文件选择和本机图片暂存；不改变 Web 上传配额/复核/完整编辑器，不上传设备私图，不新增依赖，不启用公共家庭图库，也不声称大型供应商文件或真机文件选择已验收。本轮只使用后台 shell，没有调用、打开、聚焦、抬升或置顶微信开发者工具；未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 21:36:45。

## 变动 126：账号私有图库快照完成 Web、API 与微信工程闭环

- **意图：** 在继续保留“家庭图片默认只在设备本机”的隐私承诺下，补上用户主动把个人替换图和已确认补图带到另一台设备的能力，并彻底避开 CBoard 现有可直接访问的公共媒体 URL。
- **决策：** 完整复用 cboard-api 既有 Bearer 账号、`azure-storage`、Mongoose、Swagger 和账号删除流程，新增每账号一个最新 `PictureLibraryArchive v1` 私有快照。服务端只保存私有 blob 名、大小和 SHA-256，不返回 Blob URL；上传原子替换元数据并清理旧 Blob，下载必须通过认证 API 且重新校验 ZIP、大小和哈希，删除先删 Blob 再删元数据。CBoard Web 复用现有 Export/ImportReview，只上传 custom 范围；微信复用同一纯 `pictureLibraryArchive`、JSZip、账号 session 和备份分包，新增元数据读取、上传、下载、二次复核恢复与删除。三端都不自动上传，也不新增专用账号或新依赖。
- **理由：** 手工分享 ZIP 已能迁移，但操作成本高；把设备私图塞进原 `/media` 会生成长期可访问 URL，与既有隐私决策冲突。API 认证代理比在客户端保存 SAS 或云密钥更适合现有 CBoard 账号体系；只保存 custom 快照可避免整板、语音、历史、纠错和草稿意外上云。参考 Microsoft Azure 私有 Blob 与短期最小权限访问建议，但为兼容现有客户端采用 API 代理，不把 SAS 暴露给 Web/微信。
- **证据：** cboard-api 私有图库、索引、账号删除及全部隔离控制器/路由回归 `150 passing`，相关文件通过 Prettier 1.19 和 `git diff --check`；CBoard Web 本轮独立 `BUILD_PATH` production build 成功并生成约 `41.4 MB / 979 resources` Service Worker，实施后历史定向结果为 `5 suites / 54 tests / 4 snapshots`，但本轮 Jest 复跑因旧 CRACO 子进程未退出在 4 分钟超时，未冒充当前全量通过；微信全量 `58 files / 245 tests`、TypeScript、ESLint、`169 app files / 29 CBoard core files` 边界与 production build 全部通过。微信未压缩 main `1,249,487 B`，距 1.5 MiB 建议线 `323,377 B`；backup `558,206 B`。官方参考：[Azure 用户委派 SAS](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-create-user-delegation-sas-javascript)、[浏览器上传私有 Blob](https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/browser-file-upload-azure-storage-blob)。
- **生效范围：** cboard-api 私有图库 model/controller/blob helper/Swagger/账号删除，CBoard Web Settings 的私人图片备份与复核恢复，微信 `packages/backup` 云端入口和平台传输 adapter；不改变默认板、分词、matcher、语音、公共补图、Settings/事件同步、纠错或完整本机数据 ZIP。当前只证明代码、契约、失败路径和生产编译，真实 Azure Storage、MongoDB、HTTPS 合法域名、登录账号、两台物理设备、弱网和账号删除清 Blob 尚未运行验收；不是端到端加密，也不支持家庭成员共享或版本历史。全程只使用后台 shell，没有调用、打开、置顶、聚焦或操作微信开发者工具；未预览、上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 22:26:22。

## 变动 127：私有图库进入生产配置门并修正 Blob 缓存语义

- **意图：** 防止账号私有图库虽然在三端代码中存在，却因为生产容器没有 Azure 配置而部署后不可用，同时避免私有 ZIP 继承 CBoard 公共图片的一年缓存属性。
- **决策：** 继续复用 cboard-api 既有 `azure-storage` helper，不新增云 SDK；给上传 helper 增加可选 ContentSettings 和容器选项覆盖，公共媒体继续 `max-age=31536000` 且沿用原容器调用，账号私有 ZIP 明确写入 `private, no-store`，创建私有容器时显式传入 `publicAccessLevel: off`。生产环境模板和 Compose 新增 `PRIVATE_LIBRARY_CONTAINER_NAME`，部署校验器要求真实 Azure 连接字符串，并按 Azure 官方规则校验容器名 3–63 位、小写字母/数字/单连字符、首尾为字母或数字。
- **理由：** 认证 API 的下载响应即使是 `no-store`，底层 Blob 若仍保存长期缓存属性，会形成不一致的隐私语义；而仅靠 controller 默认容器名又无法证明生产容器收到真实云凭据。复用同一 helper 并让 CLI/单元测试共用纯校验函数，能用最小胶水补齐部署门，不复制 Azure 客户端或另造部署系统。
- **证据：** Microsoft 官方说明容器名须为 3–63 位、小写字母/数字/连字符、不得连续连字符，并建议匿名访问级别保持 Private：[Blob Storage 介绍](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)、[门户容器管理](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal)；本地 `azure-storage 2.10.6` 类型和源码确认 `createContainerIfNotExists` 支持 `publicAccessLevel`。定向测试证明公共媒体不传容器覆盖、私有图库传 `off`；缓存/私图库/部署测试 `16 passing`，cboard-api 全部隔离 controller/route 回归 `155 passing`，`verify:production-deploy-template`、Node 语法、Prettier 1.19 和 `git diff --check` 通过。
- **生效范围：** cboard-api Blob helper、账号私有图库上传、生产环境模板、Compose、部署校验器、README 和覆盖矩阵；不改变公共图片缓存、CBoard Web/微信请求契约、默认板、分词、matcher、语音或事件同步。未启动 Docker、Azure、Mongo 或微信开发者工具，未预览、上传、发布、提交或推送；真实凭据、合法域名和两台真机仍待验收。
- **记录：** Codex（GPT-5.6），2026-07-21 22:45:51。

## 变动 128：修复微信预览打包误删分包共享 WXSS

- **意图：** 让 Taro production build 的绿色结果真正等价于微信上传编译可用，避免多个核心分包页面因为共享样式文件被预览打包器过滤而全部无法打开。
- **决策：** 保持微信官方建议的 `ignoreUploadUnusedFiles: true`，不关闭未使用文件优化；针对 Taro 自动生成且被 5 个页面 `@import` 的 `sub-common/*.wxss`，在 `project.config.json` 的 `packOptions.include` 精确加入 `**/sub-common/**`。产物门同步要求源码与 dist 配置都含该规则，并逐个解析所有 WXSS `@import`，确认本地产物目标真实存在。
- **理由：** 首次后台 `auto_preview` 明确报告 backup、caregiver、emergency、management 共 5 个页面引用的同一共享 WXSS 在上传包内不存在；本地文件其实存在于各分包，说明根因是 `ignoreUploadUnusedFiles` 的误过滤，而不是 Taro 未生成。微信官方性能指南明确允许在误过滤时通过 `packOptions.include` 手工纳入，关闭整个优化会扩大包体并掩盖其他无依赖文件。
- **证据：** 修复前新增质量门在旧 dist 上主动失败并指出缺少 `**/sub-common/**`；重新 production build 后产物门通过。第二次使用 Electron `2.02.2607202`、Skill `0.3.1` 的无窗口 `auto_preview` 成功，实际上传总包 `2,892,081 B`、main `1,275,066 B`、其余分包 `54,143–525,567 B`。微信全量 `58 files / 245 tests`、TypeScript、ESLint、`169 app / 29 core` 边界、Node 语法和 `git diff --check` 通过。官方原文：[小程序性能优化指南](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。
- **生效范围：** 微信小程序 production/preview 打包、所有 Taro 分包共享样式、`project.config.json` 和输出质量门；不改变业务 UI、CSS 内容、默认图片、API、分词、matcher、语音或存储。全程未调用 `open_project_window`、模拟器、截图、聚焦、抬升或置顶窗口；只通过后台 CLI 状态检查与 `auto_preview`，未上传体验版、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 22:53:01。

## 变动 129：账号私有图库配置能力可观测并安全降级

- **意图：** 防止生产环境尚未配置 Azure 私有存储时，Web 和微信把账号私人图片备份的失败误报为普通网络错误或未知服务器异常，同时让部署与运维能够在不泄露凭据的前提下判断该能力是否已配置。
- **决策：** 继续复用 cboard-api 既有 Blob helper 和通用健康接口，不新增专用能力 API。Blob helper 暴露只判断连接字符串是否非空的 `isBlobStorageConfigured`；`/health` 增加 `privatePictureLibrary: configured|unconfigured`，但不因该可选能力缺失而把核心 API 判为不健康。四个认证私有图库接口在接触 Blob 前统一返回受控 `503`；账号删除只有在确有私有快照需要清 Blob 时才受该配置限制。CBoard Web 和微信仅对 `503` 显示“服务器尚未配置账号私人图片存储，本机 ZIP 备份仍可正常使用”，其他错误继续走原处理链。
- **理由：** Azure 是账号跨设备私图快照的可选外部依赖，不应阻断默认板、双向沟通和本机 ZIP；但缺配置若落成通用 500，用户无法区分服务器未部署与临时网络失败。复用健康接口、认证控制器和现有 Import/Export/backup UI，只增加能力状态与错误映射，可以避免另造配置探测协议，也不会把连接字符串、容器名或 Blob URL 暴露给客户端。
- **证据：** cboard-api 全部隔离 controller/route 回归 `157 passing`，生产模板 `verify:production-deploy-template` 与 `git diff --check` 通过；CBoard Web 相关 API、导入、导出和中文文案定向 `4 suites / 47 tests` 通过，独立 production build 成功并核验 `index.html`、`asset-manifest.json`、`service-worker.js` 和主 bundle，临时目录已安全清理；微信完整 `58 files / 246 tests`、TypeScript、ESLint、`169 app files / 29 CBoard core files` 边界、44 板/825 图卡/775 图片完整性及 production build 全部通过。当前未压缩 main `1,249,564 B`、caregiver `546,690 B`、emergency `84,559 B`、management `464,580 B`、backup `558,384 B`、OCR `57,391 B`，均低于 1.5 MiB 建议线。
- **生效范围：** cboard-api Blob 配置判断、公开健康响应和账号私有图库认证路由，CBoard Web Settings 私有图库导入/导出提示，以及微信 backup 分包云端提示；不改变默认板、分词、matcher、语音、公共补图、本机 ZIP、Settings 同步或其他 API 健康语义。`configured` 只证明环境变量已提供，不证明 Azure 凭据有效、容器可访问或公网链路可用；真实 Azure/Mongo/HTTPS 合法域名和两台真机仍待验收。为遵守用户窗口约束，本轮只完成后台构建，没有再次调用预览、打开、聚焦、抬升或置顶微信开发者工具，未上传体验版、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 23:13:45。

## 变动 130：微信官方 12 项性能要求进入可重复质量门

- **意图：** 防止 Taro 编译成功、测试源码出现插件名或其他页面使用同名组件时，错误地把微信“无使用插件/组件”和包体优化要求标记为通过。
- **决策：** 继续复用 Node 内建测试与现有 production postbuild，不新增依赖。插件使用只接受 production JavaScript 中与 app 配置一致的静态 `requirePlugin` 调用；组件按声明 JSON 对应 WXML 及其 `import/include` 依赖闭包检查，只有全局 app 配置可使用完整 WXML 清单。现有单包 2 MiB、1.5 MiB 建议线、200 KiB 媒体、三类压缩、未使用文件过滤、按需注入、共享 WXSS、默认图卡单份共享继续保留。插件真实下载体积和主包依赖归属明确留给官方性能扫描，不伪造本地结论。
- **理由：** 测试里的 `requirePlugin('WechatSI')` 不能证明发布包会调用插件；A 页面使用 `comp` 也不能证明 B 页声明有效。与此同时，Taro 页面通过导入根 `base.wxml` 间接使用 `comp`，只查页面自身标签又会误删框架必需组件，因此必须按 WXML 依赖闭包判断。插件二进制不在本地 `dist`，主包依赖归属又由微信上传分析器计算，本地脚本不应冒充官方扫描。
- **证据：** 新增 4 项同进程 Node 测试覆盖正确/错误/动态插件名、页面隔离、全局组件和 WXML 依赖提取；完整 `npm test` 为 `58 files / 246 tests` 加质量门 `4/4`，TypeScript、ESLint、`169 app files / 29 CBoard core files` 边界和 production build 全部通过。最新未压缩 main `1,249,564 B`、caregiver `546,690 B`、emergency `84,559 B`、management `464,580 B`、backup `558,384 B`、OCR `57,391 B`，44 板/825 图卡/775 图片完整；构建会显式提醒发布前核验插件体积。
- **生效范围：** 微信小程序 package scripts、production 产物质量门和中文性能文档；不改变患者 UI、默认板、分词、matcher、图片、语音、账号或业务数据。官方依据为[微信《小程序性能优化指南》](https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009)。本轮没有调用预览、开窗、模拟器、截图、聚焦、抬升或置顶开发者工具，未上传、发布、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-21 23:24:18。

## 变动 131：离线 ASR 开源复用审计保持平台边界

- **意图：** 核实 #17 是否已有成熟开源方案可直接补进 CBoard Web 和微信，而不是继续自行研发语音识别器。
- **决策：** Web 继续优先复用浏览器原生 `SpeechRecognition.available/install/processLocally`，不在当前 CBoard 包中追加模型运行时；微信继续使用已授权 WechatSI 和可编辑文字回退，不把 sherpa-onnx、whisper.cpp 或 Transformers.js 直接塞进小程序包。未来若建立原生 App 壳或独立模型下载/校验/缓存方案，优先评估 Apache-2.0 的 sherpa-onnx；当前不写空 adapter 或未接 UI 的字段。
- **理由：** 三个项目都提供浏览器/WASM 或离线 ASR 能力，但完整能力仍需要推理运行时和独立模型。sherpa-onnx 官方列出的原生发布物已达到数 MiB，中文模型另需独立下载；Paraformer 示例的量化模型达到数十至数百 MiB。whisper.cpp 和 Transformers.js 同样依赖 WASM/ONNX 与模型下载。当前微信每个代码包 2 MiB、建议 1.5 MiB，且项目没有已验证的小程序 WASM 运行、模型校验、断点下载和设备性能基线，直接接入会破坏包体与可靠性。
- **证据：** [sherpa-onnx 官方仓库](https://github.com/k2-fsa/sherpa-onnx)明确支持 WebAssembly、Android/iOS/HarmonyOS 和中文模型；[whisper.cpp 官方仓库](https://github.com/ggml-org/whisper.cpp)提供浏览器 WASM 流式示例；[Transformers.js 官方文档](https://huggingface.co/docs/transformers.js/en/index)说明浏览器 ASR 由 ONNX Runtime 与模型驱动。现有 Web 本机语言包能力已有代码/测试/build，微信 WechatSI ASR 与最终文字/分词人工修正已通过用户真机反馈。
- **生效范围：** 覆盖矩阵 #17、Web/微信语音技术选型和后续开源复用顺序；不删除现有语音能力，不声称离线 ASR 真机已经完成，也不阻止未来在原生 CBoard App 或经验证的模型下载分包中接入 sherpa-onnx。本条只形成决策证据，没有新增运行依赖。
- **记录：** Codex（GPT-5.6），2026-07-21 23:24:18。

## 变动 132：CBoard 原生 JSON 导入复用 BoardDTO 完成输入校验

- **意图：** 补齐普通 CBoard JSON 只检查 `tiles` 是否为数组的真实缺口，避免空图卡、缺标签、重复 ID 或损坏网格通过复核后在保存、板间链接或固定网格渲染阶段失败。
- **决策：** 不新增图语家专用格式或第二套 schema；`cboardImportAdapter` 直接复用共享 `createBoardDTO` 校验板面名称、图卡标签、板面/图卡 ID 和图卡唯一性，同时保留原 CBoard 对象及其扩展字段。存在固定网格时用 DTO 已验证的顺序生成完整矩阵；同一文件内后出现的重复板面 ID 作为损坏条目跳过，并继续进入现有 import diagnostics 和复核页。已完成校验后删除容器中的过期 JSON validation TODO。
- **理由：** CBoard 导出本身就是后续导入的权威格式，重写 schema 容易丢掉 CBoard 字段；共享 `BoardDTO v1` 已有跨 Web/微信使用、唯一 ID 和布局一致性测试。把它当作验收器并只归一化关键身份/网格字段，既能修复输入，又不会把原生 CBoard 板转换成缩水的图语家对象。
- **证据：** 新测试证明合法原生导出保留描述和自定义图卡字段，空图卡、重复图卡 ID、缺标签和重复板面 ID 被跳过，未知/重复网格引用被修复为完整矩阵。导入/DTO 定向回归 `4 suites / 25 tests`，CBoard 全量 `180 suites / 1143 tests / 72 snapshots` 全部通过；隔离 `BUILD_PATH` production build 编译成功并生成约 `41.4 MB / 979 resources` 的 Service Worker，临时产物已验证路径后清理；`git diff --check` 无新增空白错误。
- **生效范围：** CBoard Web Settings 的普通 JSON 导入解析与既有复核页，以及共享 `BoardDTO v1` 的复用边界；不改变 OBF/OBZ、PictureLibraryArchive、PictogramLibraryDTO、同步时机、API schema、微信代码、默认板、分词、matcher、图片或语音。未调用预览、开窗、模拟器、截图、聚焦、抬升或置顶微信开发者工具，未提交、推送、部署或发布。
- **记录：** Codex（GPT-5.6），2026-07-21 23:42:03。

## 变动 133：cboard-api 板面写操作绑定认证所有者

- **意图：** 保证图语家的个人板、复制板和跨端同步板不能仅凭请求体邮箱归到其他账号，也不能被知道板面 ID 的普通用户修改或删除。
- **决策：** 继续复用 cboard-api 现有 Bearer 用户、Board model 和通用 `/board` 路由，不新增图语家专用 API。普通用户创建板时由服务端以 `req.user.email` 覆盖请求体邮箱；修改和删除使用 `{ _id, email: req.user.email }` 原子所有者查询，未命中统一返回 404。普通用户更新时忽略 `email`、`_id`、`id` 和 `__v`；管理员保留代用户创建、跨用户维护和显式转移板面的既有能力。公开按 ID 读取和公开板分享语义不变。
- **理由：** 原控制器明确留有“应使用调用者邮箱”的 TODO，却直接用 `new Board(req.body)`；更新只按 `_id` 查找，删除使用 `findByIdAndRemove`。认证只证明调用者已登录，不能替代资源所有权校验。把所有者条件直接放进查询可以同时避免越权和“先查后删”的竞态，并与仓库中两条被跳过的“非所有者 404、管理员可删除”测试保持一致。
- **证据：** 新增 8 条无数据库单元测试，覆盖普通用户创建邮箱覆盖且不修改请求体、管理员代建、所有者过滤更新、非所有者 404、身份字段防篡改、管理员跨用户更新、所有者过滤删除和管理员删除；两条既有集成测试已取消 `skip`。cboard-api 全量无数据库控制器测试 `165 passing`，Passport `1 passing`，Swagger YAML、生产部署模板、新测试 Prettier 和 CRLF-aware diff check 全部通过。本机 27017 未监听，因此没有启动 Docker 或执行会清测试库的 Mongo 集成测试，取消 skip 的两条请求级测试仍待 CI/专用测试库运行。
- **生效范围：** cboard-api 认证后的 `POST /board`、`PUT /board/{id}` 和 `DELETE /board/{id}`，以及对应 Swagger 与测试；不改变公开 `GET /board/{id}`、公开板列表、Board schema、CBoard Web/微信 payload、默认板、分词、matcher、图片或语音。未提交、推送、部署或发布；全程只使用后台 shell，没有调用、打开、预览、聚焦、抬升或置顶微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-21 23:54:55。

## 变动 134：cboard-api 沟通者资源绑定认证所有者

- **意图：** 保护图语家跨端主链所依赖的沟通者根板和板面 ID 集合，避免普通用户列出、读取或修改其他账号的沟通者，也避免旧客户端无幂等键创建时伪造归属邮箱。
- **决策：** 继续复用 cboard-api 现有 Communicator model、Bearer 用户、分页 helper 和通用路由。普通用户创建时统一以认证邮箱覆盖请求体邮箱，带键和无键请求采用同一归属规则；管理员可为目标邮箱创建，幂等唯一键仍按目标邮箱隔离。普通用户列表自动附加邮箱条件，单项读取和更新复用 `{ _id, email }` 所有者查询；更新剥离 `clientCreationKey`、`__v`、`_id`、`id`、`createdAt`、`lastEdited` 和普通用户提交的 `email`。管理员保留全量列表、跨账号读取、更新和所有权转移；原 DELETE 只允许 admin 的 Swagger 权限不变。
- **理由：** 沟通者不是公开分享对象，却原本只要求调用者登录：`listCommunicators` 对 user 返回全库，`getCommunicator` 和 `updateCommunicator` 只按 ID 命中，旧无键创建直接持久化请求体邮箱。沟通者保存 rootBoard 和 boards，越权更新会直接破坏用户整个 CBoard 导航与同步入口。复用板面所有者查询模式比新增权限框架更小、更一致，也不会引入第二套图语家 API。
- **证据：** 沟通者定向 `17 passing`，覆盖同键重放、竞态恢复、普通用户带键/无键邮箱绑定、管理员代建、普通用户列表过滤、管理员全量列表、所有者读取、非所有者 404、受保护字段过滤、所有者更新和管理员跨账号维护。cboard-api 全量无数据库控制器回归 `174 passing`，Passport `1 passing`，Prettier、Swagger 所有权说明、CRLF-aware diff check 和生产部署模板均通过。本机无 27017 服务，因此没有运行 Mongo 请求级套件。
- **生效范围：** cboard-api 认证后的 `POST/GET /communicator`、`GET/PUT /communicator/{id}` 及其 Swagger；不改变 `DELETE /communicator/{id}` 的 admin-only 权限、Communicator schema、幂等索引、CBoard Web/微信 payload、板面公开分享、默认板、分词、matcher、图片或语音。未提交、推送、部署或发布；全程仅后台 shell，没有调用、打开、预览、聚焦、抬升或置顶微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-22 00:00:03。

## 变动 135：三仓当前工作树完成纯后台基线验收

- **意图：** 在大量并行未提交改动已经同时进入 CBoard Web、cboard-api 和微信小程序后，重新证明当前磁盘状态整体可测试、可构建，并彻底避免例行验证再次把微信开发者工具置顶。
- **决策：** 不增加新功能、不改业务语义，直接复用三仓既有测试、类型、Lint、边界、默认板和 production 质量门。Web 使用隔离 `BUILD_PATH`，验收入口、manifest 与 Service Worker 后只删除本轮临时目录；微信只在后台运行 Taro production build 和 postbuild 包体门，不调用 Skill、CLI 预览、模拟器、截图、Browser Use、打开项目、聚焦、抬升或窗口控制。后续例行开发继续以后台命令为默认，可能使客户端前置的预览操作只在确有真机验收需要时执行。
- **理由：** 历史绿色结果不能替代当前脏工作树证据，而微信官方预览接口即使不显式开窗，也可能让已运行客户端自行前置。测试与构建本身不需要 GUI；将编译、包体和资源完整性放在后台门中，既能减少桌面干扰，也比依赖人工观察更可重复。
- **证据：** CBoard Web 当前全量 `180 suites / 1143 tests / 72 snapshots` 通过，隔离 CRA production build `Compiled successfully`，Service Worker 预缓存约 `41.4 MB / 979 resources`，入口、manifest 与 `service-worker.js` 已核对后安全清理。微信 `58 files / 246 tests` 与性能质量门 `4/4`、TypeScript、ESLint、`169 app files / 29 CBoard core files` 边界、44 板/825 图卡/775 图片完整性均通过；Taro production build 成功，775 张图片共 `953,152 B` 且只在主包保留一份，未压缩 main `1,249,564 B`、caregiver `546,690 B`、emergency `84,559 B`、management `464,580 B`、backup `558,384 B`、OCR `57,391 B`，全部低于 1.5 MiB 建议线。cboard-api 最近当前代码回归仍为控制器 `174 passing`、Passport `1 passing`、Swagger 与生产部署模板通过；两仓 CRLF-aware diff check 无空白错误。
- **生效范围：** 三仓当前工作树的工程基线和后续不置顶窗口的开发流程；不代表真实 Mongo/Azure/OpenSymbols/AI provider、微信插件下载体积、合法域名、两台物理设备、弱网或账号删除清 Blob 已验收，也没有预览、上传、发布、部署、提交或推送。微信构建最后仍明确要求发布前通过官方性能扫描核验插件下载体积；该扫描不是本地 `dist` 能替代的证据。
- **记录：** Codex（GPT-5.6），2026-07-22 00:09:43。

## 变动 136：`cboard-ai-engine` 保持可选整板生成而不接管实时沟通

- **意图：** 重新核实用户要求完整复用 CBoard 工程体系时，`cboard-ai-engine` 是否存在能够直接替换图语家实时 AI/图文管线的成熟能力，避免重复研发，也避免为了“复用全部代码”强行接入更弱实现。
- **决策：** 保留本地 `cboard-ai-engine 1.9.0` fork 及 GPL 源码，未来只作为照护者主动触发的可选整板/词汇建议候选；当前实时患者表达、照护接收、缺词补图和受限候选继续复用 CBoard BoardDTO、现有 cboard-api provider 与图语家确定性纯核心。小程序不打包该 Node/OpenAI/Azure SDK，也不把它放进患者主链。
- **理由：** 该引擎的目标是根据主题生成整板而不是解释一次沟通；`generateCoreBoard` 的图片获取当前被注释，核心类别、固定词和 locale 硬编码为英文，且库内没有测试，直接接入会产生无图英文板并扩大微信包体。现有实时链已经具备本地兜底、人工确认、图源许可、分词风险门和跨端测试，二者职责不同。
- **证据：** 本地 fork `1c31981 / 1.9.0` 的 README、`engine.ts`、`coreBoardService.ts`、依赖和 git 状态已逐项审阅；CBoard 与 cboard-api 当前没有运行时引用，既有 ADR-003 和跨端契约也明确其为可选整板生成能力。
- **生效范围：** CBoard 工程复用边界与后续 AI 技术选型；不删除或修改 `cboard-ai-engine`，不阻止未来先修复其图片/中文/测试后接入照护者板编辑器，也不把“保留源码”冒充运行功能完成。
- **记录：** Codex（GPT-5.6），2026-07-22 00:22:13。

## 变动 137：账号 Settings 改为认证用户原子单记录同步

- **意图：** 修复 Web 与微信多设备首次登录/同步时可能为同一账号创建多份 Settings，以及客户端整对象回写可能触碰服务端身份字段的问题，让图语家中性设置和旧 `tuyujia` 兼容镜像继续安全复用 CBoard 通用接口。
- **决策：** cboard-api 的 Settings model 对 `user` 建唯一索引，并加入 communication index readiness；`getOrCreate` 与更新都按认证 `req.user.id` 原子 upsert。更新只把 `language/speech/display/scanning/navigation/communicationSupport/tuyujia` 七个现有域写入 `$set`，忽略 `id/_id/user/__v`、时间和未知字段且不修改请求对象；读取空值或数据库失败不再返回空 `200`。Swagger 同步说明 partial patch 和服务端身份控制。
- **理由：** 原实现先 `findOne`、找不到再 `save`，没有唯一索引且吞掉异常；更新先修改 `req.body`，再把每个键复制到整份设置对象。多设备并发、数据库失败和恶意/旧客户端整对象提交都可能造成重复记录、不可重试的空成功或内部字段污染。复用既有 `/settings` 但把正确性放到认证查询、原子写和唯一索引，改动最小且不要求两端迁移 API。
- **证据：** Settings controller/model/readiness 聚焦 `13 passing`；cboard-api 无数据库全量 `179 passing`、Passport `1 passing`、Swagger YAML、Prettier、生产部署模板与 CRLF-aware diff check 通过。CBoard Web Settings/API `3 suites / 47 tests`、微信 Settings port/cloud sync `2 files / 24 tests` 通过，证明当前 partial patch 保持兼容。
- **生效范围：** cboard-api `GET/POST /settings`、Settings model 与通信 readiness，间接保护 CBoard Web/微信账号同步；不改变设置域内部数据、已确认接收和常用语专用版本接口、私人图库、Board/Communicator 或匿名本机数据。真实 Mongo 部署前必须检查历史是否已有同一 `user` 多记录，否则唯一索引会正确阻止 readiness；本轮没有启动 Mongo/Docker，没有预览、上传、发布、部署、提交或推送，也没有调用微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-22 00:22:13。

## 变动 138：微信账号补齐忘记密码闭环

- **意图：** 让使用 CBoard 邮箱账号的小程序照护者忘记密码后能在当前账号入口发起恢复，而不是要求手工寻找 Web 端入口。
- **决策：** 复用 CBoard Web 已使用、cboard-api Swagger 已定义的 `POST /user/forgot`；微信账号端口新增有界邮箱校验与转发，登录表单新增 88rpx“忘记密码？发送重置邮件”按钮，管理页复用现有忙碌状态和提示。成功文案不区分邮箱是否存在，密码不保存也不上传。
- **理由：** 注册、登录、重置邮件和后续 Web 重置页本来属于同一 CBoard 账号体系；新增微信专用认证或邮件实现会重复成熟代码、扩大安全边界。轻量 adapter 与原生 Taro UI 已足够补齐入口。
- **证据：** 定向 `1 file / 15 tests`、微信全量 `58 files / 248 tests`、产物质量 `4/4`、TypeScript、ESLint、`169 app / 29 core` 边界和默认板完整性通过。production build 成功，产物含新按钮和 `/user/forgot`；主包 `1,249,564 B`，未新增依赖或插件。
- **生效范围：** 覆盖矩阵账号路线 #1/#46 的微信账号可恢复性，以及小程序设置页与 CBoardAccountPort；不改变匿名离线沟通、账号合并、Settings/事件同步、CBoard Web 原 UI 或 cboard-api 协议。真实恢复邮件仍依赖已部署 HTTPS API 与邮件配置；本轮没有操作开发者工具，没有预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-22 00:33:54。

## 变动 139：在线缺词补图从单张覆盖改为最多四张人工候选

- **意图：** 补强 #8/#19 已有在线补图闭环，避免同一缺词的多张 ARASAAC/OpenSymbols 结果在 Web/微信映射时互相覆盖，最终只能看到一张且无法修正图义。
- **决策：** 不新增图片评分模型或客户端图库依赖；直接复用 ARASAAC/OpenSymbols 返回顺序，在 API、直连 adapter 与共享缺词 schema 三层统一限制每词最多 4 张并按稳定 ID 去重。`suggestedPictograms` 保存完整候选集，旧单数字段镜像第一张；两端照护 UI 逐张显示来源/许可和独立确认按钮，只有选中图在微信被下载为持久离线文件。
- **理由：** 图源第一名未必适合特定患者，而未经用户研究的自研排序也不能证明更准确。少量原始候选加人工最终选择，直接复用了成熟开源图源和现有来源规范，同时控制网络、存储、包体与渲染成本。
- **证据：** CBoard 缺词契约/存储/容器/队列 `5 suites / 52 tests`，全量 `180 suites / 1144 tests / 72 snapshots` 和 production build 通过；cboard-api ARASAAC/OpenSymbols/Swagger 路由 `15 passing`，全部无数据库单元回归 `180 passing`；微信 ARASAAC 多候选测试、全量 `58 files / 249 tests`、质量门 `4/4`、TypeScript、ESLint、`169 app / 29 core`、44 板/825 图卡/775 图片和 production build 通过。main `1,249,564 B`、caregiver `548,216 B`。
- **生效范围：** 覆盖矩阵 #8/#19、共享 missing-token migration、cboard-api 公共图源搜索、CBoard Web 与微信照护者缺图维护；不自动采用网络图、不改变供应商原排序/回退、默认板、分词、matcher、AI 生图或公开上传。真实 ARASAAC/OpenSymbols 公网、微信合法域名和手机多候选交互仍待部署后验收；本轮只使用后台 shell，没有调用、打开、聚焦、抬升或置顶微信开发者工具，没有预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-22 01:07:35。

## 变动 140：基础 API 就绪检查与 AI 检查分层

- **意图：** 补强 #66 的降级状态，让照护者在账号、云同步、私有图库、在线增强无法使用时知道究竟是 API 地址、网络、数据库、通信索引、Blob 还是 AI provider 问题，而不是继续面对一条笼统提示。
- **决策：** 复用 cboard-api 已有公开 `/health`，不增加新 endpoint 或客户端自检协议。CBoard 纯核心新增严格白名单归一化；Web 和微信都只在照护者手动点击时发匿名 GET，不带 token、患者文字、图片或历史。基础服务结果与原认证 `/gpt/communication/health` 的 AI/TTS 状态分别展示；`503` 的合法 health body 保留为“API 已响应但降级”，不误报完全断网。
- **理由：** 前后端分离迁移后，生产运行依赖分层外部状态；只有把各层状态分开，才能判断下一步是配置 `TARO_APP_API_BASE_URL`、合法域名、Mongo 索引、私有 Blob 还是模型凭据。直接复用 CBoard API 现有 readiness coordinator 比自行研发探针更符合底座复用原则。
- **证据：** Web 聚焦 `4 suites / 52 tests / 1 snapshot`、全量 `181 suites / 1150 tests / 72 snapshots` 和 production build 通过；主 JS gzip增量约 `742 B`，Service Worker `41.5 MB / 979 resources`。微信定向 `4/4`、全量 `59 files / 253 tests`、质量门 `4/4`、类型、Lint、`172 app / 29 core`、默认板完整性和 production build 通过；main `1,249,564 B`、management `471,651 B`，均低于 1.5 MiB 建议线。
- **生效范围：** 覆盖矩阵 #66、CBoard Web/微信照护设置和共享只读状态契约；不让患者主链依赖网络，不改变后端 health schema、账号/同步/AI 功能，也不把本地构建冒充公网部署完成。当前生产小程序仍未配置公网 `TARO_APP_API_BASE_URL`，因此会如实显示未配置；真实 HTTPS、域名、Mongo、Blob、模型和真机网络仍待外部配置验收。本轮未操作开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-22 01:30:44。

## 变动 141：可选增强健康检查覆盖全部已迁移 provider

- **意图：** 补强 #8/#10/#17/#19/#68 的部署可诊断性，让图片识字、图卡建议、粤语 ASR、图片去背景和后备朗读不再处于“已有代码但设置页看不见配置状态”的盲区。
- **决策：** 不新增端点或客户端环境探测，扩展现有认证 `/gpt/communication/health` 的向后兼容响应；保留原 AI/TTS 字段并追加图片 AI、粤语 ASR 和去背景的布尔状态及非敏感 provider/engine 名称。Web 与微信按能力逐项汇总，旧响应继续可读；增强未配置或检查失败时，本地图板、手工输入、分词、matcher 和朗读降级不受影响。
- **理由：** 这些 provider 已被现有 cboard-api controller 真实调用，健康报告应直接复用同一 provider factory 和环境签名缓存，避免重新实现一套可能与运行路径漂移的配置判断。只报告配置、不报告密钥和 endpoint，可帮助部署排错而不扩大秘密暴露面。
- **证据：** API 定向 `22/22`、无数据库全量 `181/181`；Web 定向 `11/11`、全量 `1150/1150`、`72/72` snapshots 与 production build；微信定向 `6/6`、全量 `253/253`、性能门 `4/4`、类型、Lint、边界、默认板与 production build 全部通过。最新微信 main `1,249,564 B`、management `472,623 B`；未新增依赖、插件、图片或音频。
- **生效范围：** 覆盖矩阵的在线增强运维状态、cboard-api 健康契约和两端照护设置；不把“provider 可构造”冒充模型/公网/真机调用通过。官方托管 `api.app.cboard.io` 当前没有 fork 的 `/health` 与图语家扩展，完整云端闭环仍依赖本 fork 的 HTTPS 部署、合法域名和真实凭据。本轮未操作开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-22 01:56:57。

## 变动 142：复用 Mongo 限流库补齐增强服务每用户保护

- **意图：** 继续落实原图语家 issue #1 中“每用户限流、月额度”的工程保护，避免完整迁移 AI、语音和图片增强后形成无上限外部成本，同时不把尚未决策的支付或商业计费混入患者核心功能。
- **决策：** cboard-api 复用 [rate-limiter-flexible 11.2.0](https://www.npmjs.com/package/rate-limiter-flexible) 的 Mongo 原子计数，不另写计数器或新后端。认证增强操作按 1/2/4 点分级，共享每分钟 30 点和 UTC 自然月 1000 点；生产模板与校验器禁止关闭或填写越界值。用户 ID 经 SHA-256 后进入限额键，患者文字、图卡、音频、图片、token 和密钥均不进入限额集合。Web/微信健康检查展示公开策略，微信端在 429 时区分短时拥塞与月额度用尽并保留对应本地/手工回退。
- **理由：** 现有 CBoard 身份、Swagger 鉴权和 Mongo 已经形成可信边界，成熟开源 limiter 能直接复用原子更新和失败语义；先完成成本保护可以安全开放增强能力，但旧 CBoard Subscriber/PayPal/App Store/Google Play 代码不等于已经形成适合图语家的套餐、支付或隐私决策，不能强行绑定。
- **证据：** API 定向 34/34、无数据库全量 190/190、生产模板通过；Web 181 suites / 1150 tests / 72 snapshots 与 production build 通过；微信 59 files / 259 tests、质量门 4/4、类型、Lint、173 app / 29 core、production build 和全部包体门通过。微信 main 1,249,564 B、management 474,188 B；Web 主 JS gzip 最终只增加 86 B。额度测试覆盖权重、哈希身份、自然月边界、分钟/月 429、响应头、存储失败和非增强路由不计点。
- **生效范围：** issue #1 的“每用户限流、月额度”获得工程级部分覆盖；“token 精确计费、付费套餐、支付、手机号验证、公开用户图库上传”仍未完成，也未被本次实现冒充完成。真实 Mongo 原子并发、公网 fork 部署、provider 费用与真机 429 体验仍需生产环境验收。本轮未操作或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-22 02:26:33。

## 变动 143：Web 真实增强入口补齐可解释限额降级

- **意图：** 把变动 142 从“服务端保护 + 设置页说明 + 微信端降级”推进为完整跨端闭环，避免 CBoard Web 在用户实际点击增强功能后仍只显示笼统失败。
- **决策：** 直接复用微信已验证的标准 429 解析语义，以一个纯 JavaScript 分类器覆盖 Web 候选句、AI 分词、粤语文字转换、粤语录音、OCR、图卡元数据建议和去背景。月额度与短时限流分别显示固定本地文案；provider 返回的 message 不透传。每个入口继续保留原有本地候选、人工编辑、本地粤语词典、手工输入、上传图片或原图。
- **理由：** 图语家双向沟通的成功条件是增强失败后仍可由人修正并完成表达，不是“调用过 AI”。同一服务端契约在 Web 与微信使用同一语义，可以减少分支漂移；复用现有降级流程也比新增重试框架、计费客户端或自研状态机更稳。
- **证据：** Web 定向 `49/49`、全量 `1160/1160`、`72/72` snapshots 与 production build 通过；限额分类单测覆盖对象、JSON 字符串、月额度、未知 429 和非 429。主 JS gzip `1.66 MB`，相对上一构建约增加 `979 B`，未新增依赖、插件、图片或音频。
- **生效范围：** 覆盖矩阵中 Web 的 #8/#10/#17/#19/#66/#68 在线增强失败可恢复性，并补强 issue #1 每用户限额的客户端体验；不表示 token 精确账单、套餐、支付、手机号验证、公开用户图库上传、公网 fork 部署或真实 provider 已完成。Web 朗读仍复用 CBoard 既有 SpeechProvider，服务端 TTS 仅在已真实接入的平台计入本次限额降级。本轮未操作或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-22 02:43:51。

## 变动 144：微信默认图卡补齐可解码 PNG 与引用闭包门

- **意图：** 把此前“部分图卡在最新预览中仍为空白”的经验固化为构建前可重复证明，避免只凭 `.png` 后缀和文件存在就认为 775 张默认图卡可以被微信解码。
- **决策：** 不更换图库、不重新设计图片协议，也不向运行包加入图片解码库；复用现有 CBoard 默认板生成器，并新增纯 Node PNG8 完整性检查。每张引用图必须通过签名、IHDR/PLTE/IDAT/IEND、CRC、zlib 解压、扫描行、最长边 96、8 位索引色、最多 32 色和不透明背景契约；源码目录文件集合必须与生成板引用集合完全相等。等比缩放产生的 `95×96`、`96×95` 保持合法，不以拉伸换取形式一致。
- **理由：** 既有存在性、扩展名和最小字节数检查能发现漏包，却不能发现伪 PNG、截断数据、校验和错误或尾部污染；这些问题会在真机上表现为图片不显示。Node 内建能力足以验证生成格式，新增第三方依赖或客户端兜底解码既浪费包体，也会重复微信运行时职责。
- **证据：** 当前 44 板、825 图卡、775 个唯一引用与 775 个源文件形成完整闭包，全部 CRC 和解压通过。773 张为 `96×96`，仅手套 `95×96`、树枝 `96×95`；刀、叉子、勺子、碗均为独立 `96×96` 不透明 PNG8。微信全量 `59 files / 259 tests`，新增 Node 质量门 `7/7`，TypeScript、ESLint、`173 app / 29 core` 边界和 production build 通过；图片只在主包保留一份，共 `953,152 B`，未压缩 main `1,249,564 B`，距 1.5 MiB 建议线 `323,300 B`。
- **生效范围：** 覆盖矩阵 #8 的小程序本地图卡可靠性、默认板生成资产和每次开发/生产构建门；不改变图片本身、图文匹配排序、分词、在线补图、CBoard Web 或 cboard-api。该证据证明源码与 production 产物完整，不代替微信解码器和物理手机显示验收；本轮没有预览、上传、发布、部署、提交、推送，也没有调用或置顶微信开发者工具。
- **记录：** Codex（GPT-5），2026-07-22 03:01:21。

## 变动 145：微信统一图卡渲染补齐点按重试

- **意图：** 在变动 144 已证明资源完整后，继续处理微信运行时偶发加载失败，避免有效图片一旦触发 `onError` 就只能靠重开页面恢复。
- **决策：** 不引入新图片组件、自动重试框架或网络依赖；所有运行时图卡继续复用 `PictogramImage`。存在图片地址且当前同一地址失败时，占位卡显示词语与“点按重试”，使用按钮 aria 语义；点击清除失败标记并重新渲染。空地址保持不可重试，地址变化仍自动恢复。
- **理由：** 自动无限重试会在断网、坏 URL 或域名配置错误时增加流量与闪烁，纯占位又无法处理瞬时失败。一次明确人工重试复用现有可读降级，成本小且不会把异常隐藏成成功；统一组件保证默认板、表达、接收、全屏、历史、常用语、缺词、个人图和紧急页使用同一行为。
- **证据：** 全仓 TSX 审计确认真正的 Taro `<Image>` 只由 `PictogramImage.tsx` 创建；状态测试覆盖空地址、失败地址与新地址恢复。微信 `59 files / 259 tests`、Node 质量门 `7/7`、类型、Lint、`173 app / 29 core`、775 图二进制门和 production build 通过；产物 JS/WXSS 已包含重试按钮、aria 和 active 状态。main 保持 `1,249,564 B`，caregiver 为 `551,169 B`。
- **生效范围：** 覆盖矩阵 #8 的微信本地/网络图卡失败恢复和全部共享图片 UI；不改变图片内容、图源、匹配排序、分词、API、缓存或 Web。静态与产物证据不能代替真实微信解码和物理点按，仍需下一次授权预览验收；本轮未预览、上传、发布、部署、提交、推送或操作/置顶开发者工具。
- **记录：** Codex（GPT-5），2026-07-22 03:07:23。

## 变动 146：复用原图语家口语词典补齐跨端分词与补图查询

- **意图：** 恢复原图语家 MVP 已验证的自然口语优化，避免迁移到 CBoard 后只识别书面词，导致“体温高”“看个电视”“头昏脑涨”等完整意思被拆散、漏匹配或错误猜图。
- **决策：** 直接复用原仓库 `src/data/lexicon.ts` 的人工词典，不引入 Jieba、WASM 或第二套 NLP 运行时。安全别名进入 CBoard 中性中文词典；默认板已有概念的“干呕/想呕吐”和“看个电视”进入概念档案；cboard-api 在 ARASAAC 英文回退前先把口语别名归一到原词。微信继续通过共享纯核心和 BoardDTO 的 `communication.synonyms` 使用同一结果，不复制词典。`受伤了 -> 出血`、`有痰 -> 咳嗽` 等可能改变医疗含义的宽泛映射不迁移；“不舒服”保持独立，“看病”仍指向医院而不是医生人物图卡。
- **理由：** 原图语家词典已经积累了真实口语表达，直接复用比重新训练或自研分词器更小、更可解释。与此同时，沟通准确性优先于命中率：默认板没有安全图卡时应保留完整词语并进入照护者补图流程，而不是用相似字或宽泛医学关系猜图。
- **证据：** 原实现明确包含 `体温高 -> 发烧`、`看个电视 -> 看电视`、`精力不足 -> 累`、`头昏脑涨 -> 头晕`、`呼吸不顺 -> 呼吸困难` 等词条。CBoard 词典、分词、matcher 定向 `3 suites / 138 tests`，全量 `182 suites / 1211 tests / 72 snapshots` 与 production build 通过；cboard-api 图卡搜索定向 `12 passing`、全部无数据库 controller `191 passing`；微信接收链 `16/16`，全量 `59 files / 260 tests`、质量门 `7/7`、TypeScript、ESLint、`173 app / 29 core`、44 板/825 图卡/775 图片和 production build 全部通过。微信主包 `1,249,564 B`，未新增依赖、插件、图片或音频。
- **生效范围：** CBoard Web 的中文分词与本地图卡匹配、cboard-api 在线补图英文回退、微信接收端共享表达管线。默认板没有对应图卡的“体温高”等词仍会安全保留为未匹配词，只有部署 fork API、配置微信合法域名并由照护者确认在线候选后才会形成图片；本地构建不冒充公网或真机验收。本轮没有调用、打开、预览、聚焦、抬升或置顶微信开发者工具，也没有上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-22 03:52:40。

## 变动 147：原图语家匹配诊断能力迁入照护管理端

- **意图：** 补回原图语家运行时 `/debug` 与 `MatcherDemoPage` 已经提供的“输入句子、观察分词、逐词看图、查看命中率和缺词”能力，让照护者能够直接判断问题来自分词、词义匹配还是缺图，而不是只能在患者接收流程里反复试错。
- **决策：** 不复制原 Next/React DOM 页面，也不恢复旧 matcher。新增平台无关的 `matchingDiagnostics` 纯契约，直接包装当前 `matchTextToCommunicationTiles`，复用中性词典、安全匹配、CBoard 默认板、个人图片和工作区修正记忆。CBoard Web 在既有管理弹窗增加“匹配诊断”；微信在既有 `management` 分包增加独立诊断页，患者主页面只增加一个照护工具入口。诊断只读运行，不保存历史、不生成缺词任务、不上传数据、不调用 AI 或图源 API。原 `/import` 批量导入器不复制，继续由现有缺词队列、多候选在线搜索、许可展示和人工确认闭环替代。
- **理由：** 原诊断页的产品意图和示例值得直接复用，但原 UI 依赖 React DOM/Next，旧匹配器又早于当前分词、纠错和医学安全边界；整体搬运会制造第二套算法和小程序不兼容依赖。把诊断收敛为共享纯函数，再分别使用 CBoard Material-UI 与 Taro 原生组件渲染，既符合工具优先和跨端复用原则，也保证诊断结果就是患者接收端真实结果。该决策细化变动 105：“不进入患者产品”继续表示不进入患者主界面，不再排除照护者只读维护工具。
- **证据：** 原仓库 `app/debug/page.tsx` 与 `src/components/MatcherDemo/MatcherDemoPage.tsx` 已核对，原页包含示例短句、分词、逐词图片、匹配类型、命中率、耗时和未匹配词。新增共享核心测试覆盖命中/缺词、120 字边界、稳定计时和修正记忆；Web 定向 `2 suites / 11 tests`，全量 `183 suites / 1215 tests / 72 snapshots` 与 production build 通过；微信定向 `2 files / 6 tests`，全量 `60 files / 262 tests`、Node 质量门 `7/7`、TypeScript、ESLint、`175 app files / 29 CBoard core files` 边界、44 板/825 图卡/775 图片和 production build 全部通过。
- **生效范围：** CBoard 中性匹配诊断契约、Web Communication Management 管理弹窗、微信照护工具入口和 `management` 分包；不改变患者表达/接收业务语义、默认板、分词结果、matcher 排序、缺词持久化、API、AI、语音、图片许可或云同步。微信未压缩主包仍为 `1,249,564 B`，管理分包为 `482,389 B`，均低于 1.5 MiB 建议线；未新增依赖、插件、图片或音频。本轮全程后台执行，没有调用、打开、预览、聚焦、抬升或置顶微信开发者工具，也没有上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-22 04:18:38。

## 变动 148：复用 Open Board Format 打通个性化图卡录音

- **意图：** 保留 CBoard 图卡编辑器已经支持的个性化录音，让录音不再只停留在 Web 当前设备；患者在 CBoard 或微信点选同一图卡时，应优先听到照护者录制的声音，失败时仍能回退到图卡文字朗读。
- **决策：** 直接采用 [Open Board Format](https://github.com/open-aac/openboardformat) 的 `sound_id`、`sounds[]`、`sounds/` 文件路径和 manifest sound path 约定，并参考其 MIT 许可的 [JavaScript 解析器](https://github.com/open-aac/obf)；不发明图语家专用 OBF 扩展。CBoard OBF/OBZ 导出写入录音，导入恢复 `tile.sound`；共享 `TileDTO v1` 以可选 `sound` 保持旧快照兼容。微信导入 OBF/OBZ 后把受支持音频保存为私有本地文件，表达序列按图卡顺序混合播放录音与 TTS；AI 改写已偏离原图卡标签时改用完整句子 TTS，避免声音与句义冲突。
- **理由：** CBoard 本来就是 Open Board Format 的原生使用者，官方格式和参考解析器已经解决声音标识、内嵌数据、远程 URL、OBZ 二进制路径及 manifest 映射；复用标准比维护私有格式更容易与其他 AAC 工具交换。把播放顺序收敛为纯核心，再由浏览器和微信各自提供音频 adapter，可避免搬运 React DOM、Material UI 或浏览器 Audio 到小程序。
- **证据：** 官方规范、示例与参考实现已核对；Web 测试覆盖 OBF 内嵌音频、OBZ `sounds/` 字节和 manifest、导入路径/URL/数据 URI、录音失败 TTS 回退；微信测试覆盖音频 adapter、表达播放协调器、OBZ 本地 staging 和 storage 恢复。上一轮 CBoard 全量为 `184 suites / 1221 tests / 72 snapshots`，微信生产构建已真实编译该依赖链。
- **生效范围：** CBoard Web 图卡录音、OBF/OBZ 导入导出、共享 DTO/播放契约和微信表达/常用语/历史重放；不在小程序内新增录音编辑器，不改变 CBoard 原录音 UI，不让 AI 改写句错误复用旧图卡声音，也不新增微信插件或第三方音频依赖。
- **记录：** Codex（GPT-5），2026-07-22 05:18:43。

## 变动 149：图语家完整备份同时迁移图片与图卡录音

- **意图：** 修复“录音已能在本机播放，但完整备份恢复到另一台设备后仍指向旧 `wxfile://` 路径”的可移植性缺口，使患者个性化声音真正随图库迁移。
- **决策：** 继续复用现有 `picinterpreter-picture-library` v1、JSZip、媒体归档计划、恢复会话和冲突合并，不建立第二种备份。现有 `assets` 清单以向后兼容方式接受 `images/` 与 `sounds/`；图卡把 `sound` 写成归档路径，Web 恢复为音频 data URI，微信恢复为新设备私有 `wxfile://.../sounds/...`。微信沿用 OBF/OBZ 已验证的 MP3/AAC、WAV、OGG、M4A、WebM 魔数识别，并限制单段 5 MiB、全部录音 20 MiB；篡改、空文件、格式不支持或超限时整次恢复失败并保留原图库。
- **理由：** 图片备份已有完整的去重、ZIP、路径穿越防护、恢复 staging、失败清理和原子持久化，扩展同一媒体资产端口比另写“录音备份服务”更少、更一致。保持 v1 的加法兼容可以继续读取旧的纯图片备份，而图片/录音分别计数能避免界面把全部 asset 错称为图片。
- **证据：** Web ZIP 测试真实检查录音字节、`sounds/boards/*.mp3` 路径和恢复后的 `data:audio/mpeg`；微信测试真实检查恢复后的新本地声音路径，并证明篡改录音不会替换当前板。CBoard `184 suites / 1222 tests / 72 snapshots` 全通过；微信 `62 files / 268 tests`、质量门 `7/7`、TypeScript、ESLint、`179 app / 29 core` 边界和 44 板/825 图卡/775 图片门通过。CBoard 标准 build 仍被旧 `build/.well-known/assetlinks.json` 文件锁阻断，隔离 `BUILD_PATH` production compile 与约 `41.5 MB / 979 resources` Service Worker 成功；微信 production build 成功，main `1,249,564 B`、backup `565,864 B`，所有分包低于 1.5 MiB 建议线。
- **生效范围：** CBoard Web 与微信小程序的图库/完整本机数据 ZIP 导出、检查和恢复；旧 v1 纯图片备份继续兼容。单次小程序内直接录制新图卡声音已由变动 209 接续补齐；官方微信插件下载体积仍需上传前性能扫描。全程只使用后台 shell、测试和构建，没有调用、打开、预览、聚焦、抬升或置顶开发者工具，也没有上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-22 05:18:43。

## 变动 150：微信个人图卡编辑器可直接录制个性化声音

- **意图：** 补齐微信只能导入、恢复和播放 CBoard 图卡录音，却不能在手机上为个人图卡新录、替换或清除声音的最后一段本机闭环。
- **决策：** 不复制 CBoard 的 React DOM/Material UI `VoiceRecorder`，而是复用其“录制、试听、保存后替换、取消不破坏原录音”的交互语义，并复用微信现有方言录音 `RecorderManager` 契约与 16 kHz、单声道、48 kbps MP3 参数。新增平台无关录音端口、Taro adapter 和草稿声音所有权注册表；录音先保存为微信私有文件，只有图卡保存成功才删除被替换的旧录音，取消编辑或组件卸载只清理本轮候选。没有新增插件、依赖、网络上传或私有 schema。
- **理由：** CBoard 已验证图卡个性化录音的产品价值，微信方言 ASR 又已经验证原生录音器、权限和临时文件生命周期；复用两者比从头研发音频组件更小、更稳定。把文件所有权独立于 React 状态管理，可以避免录音失败、取消编辑、重复录制或保存失败时误删患者仍在使用的声音。
- **证据：** 新增测试覆盖相同录音参数、停止/取消、空路径、超限、临时文件清理、草稿替换/回滚/提交和个人图卡 `sound` 持久化。微信定向 `3 files / 14 tests`、全量 `64 files / 276 tests`、质量门 `7/7`、TypeScript、ESLint、`184 app / 29 core` 边界及 44 板/825 图卡/775 图片完整性全部通过；CBoard 定向 `3 suites / 23 tests`、全量 `184 suites / 1222 tests / 72 snapshots` 通过。首次 production build 被产物可选链门禁正确拦截，改为显式监听器判断后重建成功；main `1,249,564 B`、backup `586,666 B`，全部分包低于 1.5 MiB 建议线。
- **生效范围：** 微信低频 backup 分包中的个人自定义图卡创建/编辑/删除，以及既有表达播放和完整备份声音链；不为默认 CBoard 图卡开放完整编辑器，不上传录音到账号云端，不改变方言 ASR、WechatSI、TTS、分词、matcher 或 CBoard Web 原录音 UI。官方插件下载体积仍须上传前性能扫描；本轮仅用后台 shell、测试和构建，没有调用、打开、预览、截图、聚焦、抬升或置顶微信开发者工具，也没有提交、推送、部署或发布。
- **记录：** Codex（GPT-5），2026-07-22 05:37:40。

## 变动 151：复用 CBoard 官方 Cordova 壳承接图语家全平台能力

- **意图：** 让已经进入 CBoard Web fork 的图语家双向沟通、图文匹配、个性化图卡与声音能力继续复用官方 Android、iOS、Windows/Electron 工程体系，而不是再维护一套 Flutter、原生 UI 或自建 WebView 壳。
- **决策：** 采用官方 `ccboard` 的“CBoard build -> `www` -> Cordova platform”链路；CBoard Web fork 保持唯一业务实现，微信继续使用 Taro 平台适配。新增无依赖 Node 打包脚本，优先使用官方 `./cboard` 子模块，未初始化时复用同级 `../cboard` fork；通过 Create React App 现有 `PUBLIC_URL=.` 能力构建相对路径资源，只在打包副本注入 `cordova.js`，并校验资源路径与目录结构。旧 `cboard-mobile` 的独立 Flutter 重写和仅有 LICENSE 的 `cboard-mobile-flutter` 不作为权威底座。
- **理由：** [官方 ccboard 仓库](https://github.com/cboard-org/ccboard)明确说明它包装原始 CBoard React 应用，CBoard 本身已包含 Cordova 检测、`HashRouter`、TTS、文件权限和平台插件绑定。沿用这条工程链能让图语家功能自动随同一 Web build 进入多平台，避免复制业务代码；自动化现有手改 `homepage`、手改 HTML 和 Unix `rm/cp/sed` 流程，又能减少 Windows 构建差异。
- **证据：** `ccboard` 新增 Node 内置测试 `5/5` 通过；`npm run cboard:package` 真实调用当前 CBoard fork 的 production build，输出明确为 hosted at `./`，随后校验 `www/index.html` 已加载 `cordova.js`、无根绝对本地资源地址，并生成 `3,952 files / 124,711,727 bytes`。独立 `cboard:package:verify`、JSON 解析和 `git diff --check` 通过。官方 `cboard-speech-tts` 插件已安装且确认只提供 Android 原生 TTS；其原有 `npm test` 因缺少 `spec/` 没有形成有效测试证据。
- **生效范围：** `ccboard` 的 CBoard Web 资源发现、生产构建、`www` 复制、Cordova 注入、校验命令、README 和中文决策文档；不改变 CBoard/微信业务语义、插件版本、证书、签名或发布配置。本机有 JDK 21，但没有项目级 Cordova CLI、Android SDK/ADB/Gradle，Windows 也不能构建 iOS，因此本条只证明可装壳 Web 产物，不声称 APK/AAB/IPA/Electron 安装包已验收。完整资源约 124.7 MB，后续需在保持离线 AAC 图库的前提下单独分析原生包体。未修改既有 `package-lock.json` 变动，未提交、推送、部署、预览或发布；全程只使用后台 shell/Node，没有调用、打开、聚焦、抬升或置顶微信开发者工具。
- **记录：** Codex（GPT-5），2026-07-22 05:57:03。

## 变动 152：Windows Electron 壳完成无签名安装包静态验收

- **意图：** 把变动 151 从“CBoard Web 已进入 Cordova `www`”推进到真实 Windows Electron 安装包产出，同时不为本地验证删除或伪造正式发布证书。
- **决策：** 继续复用官方 `ccboard`、`cordova-electron@3.1.0` 与 electron-builder，不重写桌面壳；新增独立 `build.unsigned.json`，固定生成 portable 与 NSIS，并用临时 `npx cordova@12.0.0` 调用。正式 `build.json` 和 `win-cert.pfx` 保持原样。README 使用 `Resolve-Path` 传绝对配置路径，因为旧插件会把相对值当成 Node 模块名。
- **理由：** 无签名本地包可以验证 CBoard fork、Cordova 注入和 Electron 打包链是否完整，而正式发布仍保持签名责任分离；复用既有开源工程和构建器比自建 Electron 入口更少代码、更容易回归。
- **证据：** 后台构建退出码 0，生成 `AACCboard 1.39.0.exe` 82,028,344 字节、`AACCboard Setup 1.39.0.exe` 82,186,909 字节及 blockmap；ASAR 125,586,939 字节、4,082 文件，包含 `index.html`、`cordova.js`、83 JS 与 2 CSS。安装包外层 `index.html` 的根绝对本地资源引用为 0；受保护的 package/config/settings/build/lockfile 哈希未变；Node 测试 5/5、Web 包复核 3,952 文件 / 124,711,727 字节和 JSON 解析通过。
- **生效范围：** 图语家 CBoard fork 的 Windows x64 Electron 无签名开发验证、ccboard README 和决策记录；没有运行生成的应用，不声称桌面 UI、正式签名、Android APK/AAB 或 iOS 已验收。未安装持久 Cordova CLI，未修改 lockfile，未提交、推送、部署或发布；全程没有打开、聚焦、抬升或置顶微信开发者工具或 Electron 窗口。
- **记录：** Codex（GPT-5），2026-07-22 06:19:10。

## 变动 153：复用系统设备内识别补齐 Cordova 离线 ASR 代码链

- **意图：** 推进 #17 的“完全断网仍可语音识别”，让图语家进入 CBoard Android/iOS 壳后不只依赖浏览器实验 API，同时避免大型模型破坏应用体积和维护性。
- **决策：** 采用可逆的系统设备内路线：基于 MIT 许可的 `pbakondy/cordova-plugin-speechrecognition` 建立独立 fork，保留原权限、麦克风、语言和结果桥接；Android API 31+ 反射调用专用 on-device recognizer，iOS 13+ 仅在 `supportsOnDeviceRecognition` 为真时强制 `requiresOnDeviceRecognition`。CBoard 新增中性语音 hook，Android/iOS Cordova 选择插件，Electron/Web 继续浏览器端口；微信不引入模型或伪装离线。
- **理由：** 官方文档明确普通 Android recognizer 可能上传音频，`EXTRA_PREFER_OFFLINE` 可能被忽略；专用设备内工厂和 Apple 强制字段才形成隐私边界。复用开源插件只增加约 14.2 KB，CBoard 主 bundle gzip 约增加 822 B，比随应用携带 42–300 MB 级模型更符合全平台和小程序包体要求；未来若需要 Vosk/sherpa，仍可作为第二 provider，不会推翻统一 hook。
- **证据：** 插件 Node 4/4、JSON/XML/diff 通过；测试覆盖默认兼容、能力查询、强制 on-device、不可用明确失败、recognizer destroy 和异步 callback 分离。CBoard 定向 52/52、全量 185 suites / 1227 tests / 72 snapshots、ESLint、diff 和两次 production build 通过；相对路径 `www` 为 3,952 文件 / 124,727,945 字节。Cordova Android 平台已合并录音权限、RecognitionService query、修正 Java 与 JS bridge；Electron portable/NSIS 重建成功，ASAR 125,605,156 字节并含插件注册和 CBoard 设备内入口，正式 package/lock/config/settings/build 哈希未变。
- **生效范围：** CBoard Web/Cordova 接收端语音来源选择、独立 Android/iOS 插件 fork、ccboard 本地生成与文档；最终文字仍进入可编辑原文、可编辑分词和人工图序复核。当前没有 Android SDK/Gradle/Xcode，ccboard 的 `cordova-android@10.1.2` 又与 file 8/media 7/firebasex 19 的最低平台版本冲突，因此不声称 APK/IPA、系统语言包、真机麦克风或真实断网已通过。微信包体、WechatSI、TTS、服务端方言 ASR 均未改变；未提交、推送、部署、预览或发布，全程没有打开、聚焦、抬升或置顶任何开发者工具或应用窗口。
- **记录：** Codex（GPT-5），2026-07-22 06:51:01。

## 变动 154：Android 14 基线纠偏并完成离线语音原生编译门

- **意图：** 把 #17 从 Java/Manifest 静态接线推进到真实 Android 编译，同时纠正一次旧平台生成导致的 `cordova-android 10.1.2` 冲突判断。
- **决策：** 继续完整复用 ccboard 已声明的 `cordova-android@14.0.1` 和全部 Cordova 插件；在隔离目录安装官方 API 35/Build Tools 35，完整重建忽略的 Android 平台并保护五个正式配置哈希。完整 app 不伪造 Firebase 文件；另用最小 Cordova 14 工程只安装 MIT 语音插件，执行独立原生烟测。
- **理由：** 项目依赖与 lockfile 本来就是 Android 14，陈旧 `platforms/android` 混入 Android 10 Gradle 模板才造成 namespace 和插件版本假冲突。Firebase 部署文件缺失与语音 Java 兼容性属于两个验证层；独立烟测既能真实覆盖 javac/DEX/APK，又不会删除正式功能或把假凭据带进应用。
- **证据：** 官方 command-line tools SHA-256 校验通过；ccboard Android 14 重建后 target/compile SDK 35，file 8.1.3、media 7.0.0、firebasex 19.0.1、speechrecognition 1.3.0 等 21 个插件全部恢复，package/lock/config/settings/build 哈希均未变化。完整构建进入 `processDebugGoogleServices` 后只因缺少真实 `google-services.json` 停止；语音最小工程 Gradle 50 tasks 全部成功，生成 3,452,083 B Debug APK，SHA-256 `7988FF5981C3C043A832CE2A49124CE4D009ABFA4F3DD6F776A1252222C2EE8D`。
- **生效范围：** 覆盖矩阵 #17、独立语音插件 fork、ccboard Android 生成链和原生编译证据；不证明完整 CBoard APK、Firebase、签名、Android 真机本地语言包、断网麦克风或 iOS 已通过。微信仍不冒充离线 ASR。本轮没有启动、聚焦、抬升或置顶任何开发者工具或应用窗口，没有提交、推送、安装、部署、预览或发布。
- **记录：** Codex（GPT-5），2026-07-22 07:19:15。

## 变动 155：复用官方 ccboard 形成无 Firebase Android 核心调试包

- **意图：** 在没有正式 Firebase 部署文件时，把验证从“Web build + 最小语音插件 APK”推进到“当前 CBoard/图语家业务 + 官方 Cordova 壳 + 设备内语音”的完整核心 Android 包，同时不伪造密钥或删除正式发布能力。
- **决策：** 继续复用官方 `ccboard`、Apache Cordova CLI、`cordova-android@14.0.1` 和本地 MIT 语音插件。新增构建器默认先重建当前 CBoard fork，再建立隔离临时工程；只从临时 manifest 省略 `cordova-plugin-firebasex`，其余插件和配置继续复用。CBoard 的 Firebase 统计、用户标识、注销与原生 Google 登录改为插件缺失时安全降级；正式 package/lock/config/settings/build 与 Firebase 配置不改。
- **理由：** 源码审计确认 Firebase 不参与默认板、双向沟通、matcher、本机 storage、TTS 或设备内 ASR；官方 Cordova 已提供临时插件管理语义。隔离变体既能绕开外部部署凭据完成本地核心 APK，又不会把假 `google-services.json`、私有密钥或永久删插件的分叉带进 release。默认重建 CBoard Web 可防止陈旧 `www` 产生假绿色。
- **证据：** 构建器与既有包装测试 `9/9`，Firebase 可选调用定向 `5 suites / 59 tests`，CBoard 全量 `186 suites / 1230 tests / 72 snapshots` 和 production build 通过；Cordova/Gradle `50 actionable tasks` 全成功。APK 为 `57,903,542 B`，SHA-256 `52FA0AB41702FAF29DCF4B8510CF8BEC48FDC9B3191EDBC3E291F639B339E8B7`，API 35、含 `RECORD_AUDIO`；插件注册表含 speechrecognition、不含 firebasex。source build、`ccboard/www` 与 APK 内主 bundle 的 SHA-256 均为 `9639FFC19F6B4D61C0CEC9EF23E075A706B6586569E7D748AC8F14F1A996CC69`，五个正式配置哈希保持不变。
- **生效范围：** CBoard Web 的可选 Firebase 容错、ccboard 本地 Android 核心调试构建和 #17 原生包证据；不改变微信小程序、API、正式 Firebase、签名或发布流程。调试包没有 Firebase Analytics/FCM/原生 Google 登录，且未安装、未启动、未连接设备，因此不证明 Android 真机 UI、触控、TTS、麦克风、中文本地语言包或断网识别。iOS 仍需 macOS/Xcode。全程只使用后台 shell、Node 和 Gradle，没有打开、聚焦、抬升或置顶任何开发者工具或应用窗口，没有提交、推送、安装、部署、预览或发布。
- **记录：** Codex（GPT-5），2026-07-22 07:50:17。

## 变动 156：复用原图语家手机号规则补齐跨端账号入口

- **意图：** 把原 MVP 已存在的手机号注册与脱敏显示迁入 CBoard Web、cboard-api 和微信小程序，避免账号迁移只保留邮箱/密码而漏掉原产品字段。
- **决策：** 直接迁移原 `normalizePhoneNumber`、`^1\d{10}$` 和 `138****8000` 规则。cboard-api 使用可选 sparse unique 手机号，兼容 CBoard 全球用户；CBoard Web 注册可选；图语家微信注册必填。服务端响应和客户端 session 只保留 `phoneMasked`，原始号码不返回、不写入微信 storage。短信验证不在没有供应商与隐私方案时伪装完成。
- **理由：** 原 PicInterpreter 代码和测试已经提供可复用证据，新增 SDK 或重写认证没有必要。把“格式/唯一性”“号码所有权验证”“手机号登录/找回”拆开，能保持安全声明准确，也不破坏 upstream 客户端。
- **证据：** CBoard 定向 `3 suites / 7 tests / 1 snapshot`、全量 `187 suites / 1233 tests / 72 snapshots`、ESLint 和 production build；API 手机号、并发冲突与 User readiness 定向 `15 passing`、无数据库全量 `201 passing`、Swagger/语法/Prettier，`/health` 会显式等待 User sparse unique 索引，无网络隔离测试证明 `phone_1` 同时存在于正式与邮件激活临时模型，临时用户竞态稳定返回 `409` 且不泄露存储错误；微信定向 `2 files / 21 tests`、全量 `64 files / 277 tests`、质量门 `7/7`、TypeScript、ESLint、`184 app / 29 core`、44 板/825 图卡/775 图片和 production build。Cordova 相对路径包 `3,952 files / 124,733,961 bytes`，CBoard build 与 `ccboard/www` 主 bundle SHA-256 一致。
- **生效范围：** issue #1 的手机号字段、唯一性、脱敏和跨端 UI 已形成工程闭环；短信发送/验证码、所有权验证、手机号登录/找回、国际号码仍未完成。旧账号、第三方登录和不带手机号的 upstream 注册不变。真实 Mongo 索引/并发、邮件激活、公网 HTTPS 和手机注册仍需部署后验收。本轮只使用后台 shell、既有生成器、测试、构建和文档工具，没有调用、打开、聚焦、抬升或置顶任何窗口，也没有预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-22 08:22:37。
- **补充记录：** Codex（GPT-5.6），2026-07-22 09:18:44；修正临时注册模型索引继承证据，API 定向 `15 passing`、无数据库全量 `201 passing`。

## 变动 157：公共图符贡献坚持复用上游投稿能力，不自研患者图片上传

- **意图：** 判断“公开用户图库上传”能否通过现成 AAC 开源项目直接复用，避免在没有审核与许可治理时把家庭照片误传成公共资源。
- **决策：** 当前继续复用 OpenSymbols、ARASAAC 和 Global Symbols 的搜索、图库聚合、来源许可与 CBoard 集成；不新增图语家公共投稿 endpoint。只有 OpenSymbols 或其他可信 AAC 上游提供稳定投稿/审核 API，或项目明确批准独立 moderation 服务、许可协议和运营责任后，才建立单独 contribution adapter。设备私图、账号私有 ZIP 和公共贡献必须继续是三个独立动作。
- **理由：** [OpenSymbols MIT 仓库](https://github.com/open-aac/opensymbols)当前实现的是本地/远程图库聚合、S3 manifest 导入和搜索；[官方站点](https://www.opensymbols.org/)明确写明新图符提交“计划开放”，现阶段只有需求反馈表。[ARASAAC public-api](https://github.com/Arasaac/public-api)是公共检索 API；[Global Symbols 的 CBoard 指引](https://globalsymbols.com/knowledge-base/3OICPNYW5GxncqOPgu3qWK?locale=es)描述的是图库 API/离线集成，不是用户投稿审核。直接拼一个上传接口会自行承担内容安全、著作权、患者隐私、删除申诉和长期运营，违背复用优先。
- **证据：** 2026-07-22 在线核对上述官方站点与开源仓库；本地 PRD 10.2 明确“私有图片不进入公共图库”，MVP 12 又把“大规模公共词库贡献系统”列为可延期。现有 CBoard/微信已经提供本机个人图卡、缺词多候选公共图源、来源许可展示、账号私有 custom ZIP 与结构化图库导入。
- **生效范围：** 覆盖矩阵 #1/#10/#19 的公开图库贡献状态与后续架构边界；不删除现有个人图卡、在线补图、私有云备份或图库导入。此处是“不自研”的审查结论，不冒充公共贡献已完成，也不阻塞核心双向沟通。未提交、推送、部署、预览、上传或发布；未打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 08:41:19。

## 变动 158：issue #1 手机号归属验证形成跨端工程闭环

- **意图：** 把变动 156 中明确保留的短信验证码缺口补齐，使原图语家“手机号注册”从格式、唯一性和脱敏推进到号码归属人工确认。
- **决策：** cboard-api 直接复用腾讯云官方 `tencentcloud-sdk-nodejs-sms@4.1.240` 和既有 `rate-limiter-flexible` Mongo adapter；建立五分钟 challenge、最多五次确认、十分钟一次性注册令牌、60 秒重发、手机号日限和 IP 时限。Web 与微信共用纯 `accountPhoneVerification` 契约，只把当前手机号匹配的令牌发送到既有 `POST /user`。验证码、手机号、IP 和供应商密钥不进入客户端 storage 或公开响应。
- **理由：** issue #1 要求的是号码所有权，而不是自行研发短信网络层。官方 SDK 与成熟原子限流已经覆盖高风险基础设施；短期一次性令牌可以保留 CBoard 邮箱激活体系，又避免把 provider 耦合进 User 或小程序。
- **证据：** API 无数据库 controller/route `221 passing`、生产模板和 frozen lock 通过；CBoard Web `189 suites / 1238 tests / 72 snapshots` 与 production build 通过；微信 `64 files / 278 tests`、质量门 `7/7`、TypeScript、ESLint、`184 app / 29 core`、44 板/825 图卡/775 图片和 production build 通过。小程序主包 `1,249,564 B`，所有分包低于 1.5 MiB 建议线。
- **生效范围：** 覆盖矩阵 #1 的短信 challenge、人工输入、确认、令牌绑定和注册消费已形成可审查代码闭环；真实腾讯云套餐、签名/模板审核、独立凭据、公网部署、微信合法域名、隐私告知、控制台防轰炸和物理手机收码仍是发布门。手机号登录、短信找回和国际号码仍未实现。本轮未发送真实短信、未产生费用、未提交、推送、部署、预览、上传或发布，也未调用、打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 10:28:30。

## 变动 159：issue #16 在 Web 使用真实音量、微信拒绝伪波形

- **意图：** 响应真机反馈中“静音也动”和“说话后延迟才动”的问题，把语音反馈从动画效果收紧为可验证的平台事实。
- **决策：** CBoard Web 新增零依赖 `BrowserAudioLevelMonitor v1`，复用浏览器原生 `getUserMedia + AudioContext + AnalyserNode`，用 256 点时域样本计算 RMS、每 80 ms 采样并量化后驱动七段 meter；不存在 keyframe 或随机动画。监测在 SpeechRecognition `onstart` 后异步启动，不等待它；停止、结束、报错、重启、卸载和延迟授权全部释放麦克风资源。不支持或权限失败只显示静态监听状态。微信 WechatSI 不提供原始振幅，因此保持现有“监听中/已更新”状态，不重新引入 RecorderManager 或延迟伪波形。
- **理由：** [MDN `getByteTimeDomainData()`](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteTimeDomainData)明确提供当前时域波形样本，[MDN `getUserMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)提供受权限和安全上下文保护的麦克风流；直接复用成熟 Web 标准比引入 waveform npm 包更轻。不同平台没有同等底层能力时，维持诚实差异比为了视觉一致复制错误语义更符合双向沟通安全边界。
- **证据：** 音量核心 7 项、Hook 8 项与接收端 20 项聚焦回归合计 `3 suites / 35 tests`；CBoard 全量 `190 suites / 1249 tests / 72 snapshots`、production build 和差分检查通过。主 JS gzip 增量约 `1.54 kB`、CSS `265 B`，无新依赖、图片或音频资源。微信源码与产物未修改，既有静态监听状态边界保持不变。
- **生效范围：** 覆盖矩阵 #16、CBoard Web 普通浏览器接收端及复用同一 Web build 的 Electron。音量采样不保存、不上传、不连接扬声器，也不改变 SpeechRecognition 自身服务边界、识别文字/分词人工修正或 matcher。Cordova 插件激活时不冒充浏览器音量；真实浏览器权限、Electron 麦克风、不同设备噪声底和微信最新静态 UI 仍需人工验收。本轮没有调用、打开、聚焦、抬升或置顶任何窗口，没有预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-22 10:50:04。

## 变动 160：复用 cboard-ai-engine 的 ARASAAC 排序而不硬接整包

- **意图：** 深度审计 CBoard 官方 AI Engine，把能直接改善图语家核心缺词补图的成熟代码复用进来，同时避免引入第二套 AI SDK、英文整板语义或患者表达拦截。
- **决策：** 不安装 `cboard-ai-engine` 整包；在 `cboard-api` 复用其 ARASAAC `bestsearch -> search` 策略和去音标查询规范化，继续沿用现有中文直查、经审核英文回退、缓存、候选限制、许可校验和同源图片代理。补入原图语家数据有明确语义证据的 `勺/勺子 -> spoon、叉子 -> fork、碗 -> bowl`；不把“刀具”猜成餐刀，因为原 ARASAAC 数据中该中文标签实际对应 `razor`。Global Symbols v1、整板生成和 Azure 内容安全不接入患者双向沟通主链。
- **理由：** AI Engine 面向“主题生成整张 AAC 板”，图语家接收端面向“保留原文、可编辑分词、逐词安全匹配”；整包还携带 `openai@3.3.0`，而 API 已使用 4.x，且仓库没有测试、整板图片装配被注释、固定词和 locale 主要为英文。Global Symbols 官方已公告 v1 即将停用、v2 需要 API key。只复用无依赖且可回退的 ranked search，能获得真实收益而不制造短期债务；患者的疼痛、自伤、虐待或求助表达也不能被通用内容安全过滤静默阻断。
- **证据：** 审计 `cboard-ai-engine@1.9.0` 的 engine/coreBoard/symbolSets/README/package；后台实测 ARASAAC v1 `bestsearch/apple` 返回 3 个候选。真实复测 `刀具、勺、勺子、叉子、碗` 全部获得图片，单字“勺”由 0 修复为命中标准勺子 `2362`；定向 `18 passing`、cboard-api 无数据库单元全量 `223 passing`。完整结论见 `cboard-api/docs/cboard-ai-engine-reuse-decision.zh-CN.md`。
- **生效范围：** cboard-api 缺词在线补图的 ARASAAC 搜索顺序与经审核餐具词典；Web/微信协议、人工确认、离线主链、默认板、分词、matcher、OpenSymbols 和图片代理均不变。Global Symbols v2 留待正式凭据与限流方案，不声称已接入；未新增依赖、路由、图片或音频。没有预览、上传、发布、部署、提交或推送，全程未打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 11:14:17。

## 变动 161：复用服务商 usage 建立按用户月度 Token 事实账本

- **意图：** 继续补齐 issue #1 中“Token 计量”的可审计事实，使可选 AI 增强不再只有请求点数上限而没有真实模型用量，同时不保存患者沟通正文或提前自研支付系统。
- **决策：** cboard-api 直接消费现有 OpenAI/Azure 兼容 Chat Completions 的 `usage`，以 `user + UTC month + provider + model + operation` 唯一键执行 Mongo 原子聚合。候选句、重分词、粤语归一化、OCR、图卡元数据和旧 `/gpt/edit` 均在模型响应后写入；缺少 usage 的请求只记为“未回报”，不估算 Token。认证 `/gpt/communication/usage` 只返回当前月数字汇总；Web 与微信在现有增强状态区展示，旧 API 无新路由时保持原健康检查可用。TTS、粤语 ASR 和去背景继续使用既有点数保护。
- **理由：** 服务商响应是模型结算事实，直接复用比引入 tokenizer 或按字符估算更准确；原请求点数负责事前保护，实际 Token 负责事后审计。月度聚合控制集合规模，只存数字可以避免成本统计扩大患者隐私面；双端消费同一接口也比复制本地计数器更可靠。
- **证据：** API 聚焦 `50 passing`、无数据库全量 `232 passing`；CBoard Web 补充未配置状态防误报后 `190 suites / 1252 tests / 72 snapshots` 与 production build；微信 `64 files / 279 tests`、质量门 `7/7`、TypeScript、ESLint、`184 app / 29 core` 边界与 production build全部通过。微信构建门真实拦截一次可选链，修正后 main `1,249,564 B`、management `493,073 B`，所有包低于 1.5 MiB 建议线；Web 最终状态修正只增加约 `40 B gzip`。详细决策见 `cboard-api/docs/communication-ai-usage-accounting-decision.zh-CN.md`。
- **生效范围：** issue #1 的服务商回报 Token 记录、无效/未回报请求标记、认证月度查询、账号删除清理和 Web/微信只读状态展示已形成代码/测试/构建闭环；请求前 Token 预留、严格 Token 配额、价格、套餐、支付、退款、管理员账单和真实供应商对账仍未完成。真实 Mongo/provider、公网 HTTPS、微信合法域名与手机展示待部署验收。本轮未预览、上传、发布、部署、提交或推送，全程没有打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 11:48:32。

## 变动 162：原设置页真实 AI 连接测试完成 Web 与微信迁移

- **意图：** 恢复原 PicInterpreter `SettingsDrawer` 已有的“测试后端 AI”能力，让照护者区分“配置项存在”与“模型当前真的能返回结果”，同时保证测试不携带患者输入。
- **决策：** 不新增探针路由、不复制模型 SDK，也不引入 OpenMeter/Lago 等计费基础设施；CBoard Web 直接复用 `API.generateCommunicationSentences`，微信直接复用 `CommunicationAiPort.generateSentences`，统一只发送固定标签“我、喝水”和 `candidateCount: 1`。只有认证请求成功且返回非空候选时才显示成功；分钟限流、月额度、未登录、未配置、网络失败和空响应使用本地有界文案，不回显上游错误。界面明确说明测试不发送患者文字、图片、历史或场景，并会消耗一次增强请求、进入既有 Token 账本。
- **理由：** 原实现已经验证了固定样例探针的产品价值，现有 cboard-api 候选句端点又已经具备认证、限流、provider 调用和 usage 记录；复用这一条真实业务链比另造 health 探针更能证明可用性，也不会引入第二套计量或供应商依赖。OpenMeter/Lago 更适合后续商业计量与账单，不应为一次连接诊断增加 PostgreSQL/Kafka/ClickHouse 或订阅模型。
- **证据：** Web 新增固定请求成功与月额度脱敏回归；全量 `190 suites / 1254 tests / 72 snapshots` 和 production build 通过，修正 TuYuJia 兼容 fixture 后其聚焦 `1 suite / 2 tests` 无 PropTypes 告警。微信连接测试聚焦 `2 files / 11 tests`，全量 `65 files / 282 tests`、质量门 `7/7`、TypeScript、ESLint、`186 app / 29 CBoard core` 边界和 production build 全部通过；构建产物真实包含测试按钮与固定词说明。main `1,249,564 B`、management `494,791 B`，全部分包低于 1.5 MiB 建议线。
- **生效范围：** CBoard Web Communication Support 设置页、微信 management 设置页及其既有 cboard-api 候选句/限额/usage 链；不改变患者表达主链、本地候选、分词、matcher、图片、语音、支付或套餐。真实 provider 凭据、公网 HTTPS、微信合法域名和物理手机按钮结果仍待部署后验收；本轮未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 12:21:04。
- **补充记录：** Codex（GPT-5.6），2026-07-22 12:38:49；对照原 `SettingsDrawer` 后补回 10 秒等待上限。Web 仅为真实连接测试向既有 API 传入 Axios timeout，超时码使用本地脱敏文案；微信纯编排层在 provider 不返回时按同一上限释放按钮，不改变普通候选请求。Web 全量增至 `190 suites / 1256 tests / 72 snapshots`，production build 成功，主 JS gzip 仅增加约 `159 B`；微信增至 `65 files / 283 tests`，质量门 `7/7`、TypeScript、ESLint、`186 app / 29 core`、production build通过，management `495,284 B`。构建产物均包含超时文案；仍未进行真实 provider、物理手机或发布验收，也未操作任何窗口。

## 变动 163：复用 OpenClaw 的豆包 Seed TTS provider 完成服务端可选接入

- **意图：** 补回原 PicInterpreter roadmap 中豆包语音后端化的可选路径，使 Web 与微信不保存火山引擎密钥，又不为新服务商复制客户端业务链。
- **决策：** cboard-api 继续复用既有认证 `/gpt/communication/speech` 和中性 provider 契约，参考 OpenClaw MIT 许可 TypeScript 实现接入火山引擎 V3 SSE；只增加零依赖适配器、部署配置、缓存签名、健康信息和回归测试。WechatSI 与设备/浏览器语音继续优先，OpenAI-compatible provider 继续兼容。豆包 ASR 不冒充完成，既有腾讯云粤语 SentenceRecognition 保持生产服务端识别路径。
- **理由：** 官方 V3 TTS 已有稳定 HTTP/SSE 合约，Node 22 原生 `fetch` 足以安全实现；OpenClaw 提供了当前 TypeScript 请求与分帧处理证据。豆包 ASR 可复用项目目前主要依赖 Python、WebSocket 和可能的 ffmpeg，把第二运行时塞进 Node API 会增加部署、隐私和恢复成本，而客户端中性端口已经允许未来独立替换。
- **证据：** provider/controller 聚焦回归 `29 passing`，cboard-api 无数据库单元全量 `241 passing`，生产部署模板校验通过；CBoard Web speech 契约 `1 suite / 14 tests`，微信 communication AI/speech 契约 `2 files / 14 tests`。覆盖 V3 headers/body、多 SSE 帧 MP3 拼接、voice allowlist、超时、限流、异常帧、12 MiB 响应体与 8 MiB 音频上限；未新增 npm 依赖，健康接口不泄露密钥。详细决策见 `cboard-api/docs/volcengine-tts-provider-decision.zh-CN.md`。
- **生效范围：** 只覆盖部署方显式选择后的服务端付费 TTS 回退；Web/微信 endpoint、表达、分词、matcher、图片和历史协议不变。没有真实豆包凭据联网、公开 HTTPS、微信合法域名、费用、弱网或真机验收，不声称豆包 ASR 完成。本轮没有预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 13:04:04。

## 变动 164：复用既有 Mongo 原子限流补齐按用户 AI Token 月额度

- **意图：** 在变动 161 的服务商实际 Token 事实账本之上，补齐 issue #1 尚缺的请求前月度 Token 额度保护，防止并发或故障客户端无上限消耗模型，同时不让额度状态阻断本地双向沟通。
- **决策：** cboard-api 继续复用已安装的 ISC 许可 `rate-limiter-flexible@11.2.0` 和 Mongo adapter，不新增依赖或第二套数据库。六类 Chat Completions 操作按认证用户和 UTC 月原子预留：文字 `4,096`、图片 `32,768`，默认月额度 `1,000,000`；服务商回报 usage 后退款或补扣差额，未回报则保留保守预留，失败则释放。Web 与微信复用既有增强状态区显示剩余量，旧 API 字段缺失仍兼容，超额统一安全回退本地规则。
- **理由：** 现有 limiter 已提供 `consume/reward/penalty/get/delete`，足以实现预留、结算、查询和删除；直接复用比自研并发计数或引入 tokenizer 更可靠。OpenMeter 的 entitlement/grant 更适合未来付费套餐、充值和结转，LiteLLM budget manager 需要额外 Python proxy；在尚无价格、订单、支付和对账前引入它们会扩大部署面而不能完成商业闭环。
- **证据：** API 聚焦 `40 passing`、无数据库全量 `253 passing`、生产部署模板通过；CBoard Web 全量 `190 suites / 1,257 tests / 72 snapshots` 与 production build 通过；微信全量 `65 files / 284 tests`、TypeScript、ESLint、`186 app / 29 CBoard core` 边界和 production build 通过。微信质量门真实拦截一次可选链，兼容修正后 main `1,249,564 B`、management `496,229 B`，所有包低于 1.5 MiB 建议线。详细决策见 `cboard-api/docs/communication-ai-token-quota-decision.zh-CN.md`。
- **生效范围：** 覆盖旧短语编辑、候选句、重分词、粤语文字归一化、OCR 和图卡元数据六类模型调用；TTS、粤语音频 ASR、去背景、WechatSI、公共图符搜索、默认板、matcher、人工修改和离线沟通不计入 Token 额度。一次实际 usage 高于预留时可能形成一次有界超额，系统会补扣并阻止后续请求，不冒充数学上的零超额。价格、套餐、充值、支付、退款、发票、管理员账单、真实 Mongo/provider、公网和物理手机仍未完成或待验收。本轮未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 13:41:56。

## 变动 165：复用火山引擎官方极速 HTTP API 补齐豆包 ASR 可选路径

- **意图：** 补回原图语家 issue #3/#5 中的豆包服务端语音识别路线，同时保持供应商密钥不进入 Web 或微信包，识别错误不直接变成图片错配。
- **决策：** cboard-api 继续复用认证 `/gpt/communication/dialect-asr`、一次同意、3 MiB/60 秒限制、增强限流和可编辑原文；在中性 factory 增加 `volcengine` provider，使用官方 `bigmodel` 极速录音识别 HTTP API。腾讯云 `16k_yue` 保持兼容，客户端只增加 engine 契约兼容，不新增路由或供应商 UI。
- **理由：** 变动 163 暂缓 ASR 的依据是当时成熟方案主要依赖 Python、WebSocket 和 ffmpeg；火山引擎当前已公开一次 HTTP POST 的正式接口，Node 22 原生 `fetch` 足以接入。复用现有路由和纯核心比加入第二运行时或复制客户端业务链更轻、更安全，也保留人工最终修正权。
- **证据：** 官方文档 <https://www.volcengine.com/docs/6561/1631584?lang=zh>；API 无数据库单元全量 `261 passing`，生产模板/语法/格式/差分检查通过；CBoard Web `190 suites / 1258 tests / 72 snapshots` 与 production build；微信 `65 files / 285 tests`、类型、ESLint、`186 app / 29 core` 边界、质量门和 production build 均通过。微信主包 `1,249,564 B`，低于 1.5 MiB 建议线。
- **生效范围：** 覆盖矩阵 #3/#5 和变动 163 的 ASR 后续状态；只影响部署方显式选择后的认证录音识别。录音不持久化，识别后仍需人工修改/确认并手动生成图片；MP3/WAV/OGG Opus 为火山引擎路径支持格式。真实凭据、服务开通、费用、粤语质量、公网、微信合法域名、弱网和物理手机仍待验收。本轮未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-22 14:31:35。

## 变动 166：复用 CBoard 会话完成普通用户手机号验证码登录

- **意图：** 补齐变动 158 明确保留的“手机号登录”缺口，让完成号码归属验证的图语家用户在 CBoard Web 和微信小程序都能进入同一账号与同步闭环。
- **决策：** 不引入第二套认证框架；在现有短信 challenge 增加 `registration/login` purpose，cboard-api 新增 `POST /user/login/phone`，并复用 CBoard 密码登录的 JWT、User、Settings、订阅和 boards 响应。Web 增加密码/短信模式；微信 management 增加邮箱登录/短信登录/注册模式，成功后统一复用原账号 session 与本地/云合并。未知手机号统一失败，管理员拒绝仅凭短信登录。
- **理由：** Better Auth 和 SuperTokens 的 OTP 能力成熟，但会引入新的 schema、Session 和认证路由，与 CBoard 现有 Passport/JWT/Settings 重叠。当前直接复用腾讯云官方短信 SDK、`rate-limiter-flexible`、短期 HMAC challenge 和 CBoard 会话，只需 purpose 与平台胶水层，迁移风险更小且不会分叉账号数据。
- **证据：** API 定向 `22 passing`；Web API/actions/UI `4 suites / 61 tests / 1 snapshot` 与 production build；微信账号及同步相邻回归 `5 files / 41 tests`、TypeScript、完整 ESLint、`186 app / 29 core` 边界和 production build。微信主包 `1,249,564 B`、management `498,590 B`，均低于 1.5 MiB 建议线。三端全量测试在当前高负载机器上未在设定时间边界内返回汇总，因此不沿用变更前基线冒充本轮全量通过。详细决策见 `cboard-api/docs/mainland-china-phone-login-decision.zh-CN.md`。
- **生效范围：** issue #1 的普通用户手机号验证码登录已形成 API/Web/微信可审查工程闭环；旧密码/OAuth、游客离线沟通和注册短信继续兼容。真实腾讯云短信、Mongo、公网 HTTPS、微信合法域名、物理手机登录、短信找回、国际号码和管理员多因素认证仍待部署或后续实现。未提交、推送、部署、预览、上传或发布；全过程只使用后台命令和补丁，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 19:34:53。

## 变动 167：复用短信 challenge 完成手机号找回并修复旧重置安全链

- **意图：** 补齐 issue #1 中普通用户忘记密码后的短信恢复，同时保证新入口不会继承 CBoard 旧邮件重置中可绕过 token 校验、泄漏原始 token 和保留旧会话的问题。
- **决策：** 现有 challenge 增加 purpose=`password-reset`，Web 与微信先验证手机号、再两次输入新密码并调用同一 cboard-api；成功后不自动登录。服务端统一已知/未知账号响应、只保存重置 token 哈希、校验过期和一次性消费；User 增加非公开 `authVersion`，重置后递增以撤销旧 JWT，短信重置先作废旧邮件 token 再更新密码。管理员拒绝短信恢复。
- **理由：** OWASP Forgot Password 指引要求通用响应、安全随机且有时效的一次性 token、密码确认、不自动登录和会话失效；复用腾讯云官方 SDK、Mongo challenge/限流、bcrypt、Node crypto 和 CBoard JWT 比引入第二套认证 schema/Session 更符合当前底座，也避免自行实现供应商或密码学协议。
- **证据：** API Swagger 加载三个 purpose 和手机号重置 route，安全聚焦 `41 passing`；CBoard Web 聚焦 `4 suites / 50 tests` 与当前 production build；微信全量 `65 files / 289 tests`、TypeScript、ESLint、`186 app / 29 CBoard core` 边界及 production build。微信 main `1,249,564 B`、management `501,244 B`，所有包低于 1.5 MiB 建议线。详细决策见 `cboard-api/docs/mainland-china-phone-password-reset-decision.zh-CN.md` 和 `cboard-wechat-poc/docs/中国大陆手机号找回密码实现记录.md`。
- **生效范围：** issue #1 的普通用户手机号找回密码已形成 API/Web/微信工程闭环，旧邮件恢复同步得到安全修复；真实腾讯云短信、Mongo、公网 HTTPS、微信合法域名、物理手机重置、邮件修改通知、应用层邮箱限流、国际号码和管理员多因素恢复仍未完成或待部署验收。本轮未提交、推送、部署、预览、上传或发布，全程只使用后台命令和文件补丁，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 20:38:50。

## 变动 168：复用并加固 CBoard 现有跨平台订阅基础

- **意图：** 不为图语家重新开发支付系统，直接复用 CBoard 已有 PayPal、Google Play 和 App Store 订阅代码；在接套餐权益或微信支付前，先让订阅归属、套餐和交易状态成为可信的服务端事实，并向微信提供安全的只读状态。
- **决策：** cboard-api 增加独立安全 helper，普通用户的 owner、初始 status 和 transaction 改由服务端控制；交易前先验 owner，再以服务端目录核对产品和 provider 计划。PayPal 复用官方 `custom_id + plan_id` 绑定 CBoard 用户，取消前核对 owner/platform；Google/iOS 核对产品；响应移除 token、receipt、signature、payer 和 facilitator access token。全局 provider 同步改为管理员；Web 发送可验证计划标识；微信只存/显示脱敏摘要，不增加购买按钮或自动扣费。
- **理由：** CBoard 的跨端订阅骨架成熟且值得复用，但原接口允许客户端伪造其他用户、状态和交易，且可能在归属校验前调用供应商；不先修复就不能把订阅作为额度或权益依据。PayPal 官方已经提供账号侧 `custom_id`，无需自研绑定协议。微信支付仍要求正式商户、服务端下单、`wx.requestPayment`、回调证书和退款链，当前外部前提不齐，不应伪装成已上线。
- **证据：** cboard-api 订阅安全聚焦 `17 passing`、无数据库单元全量 `298 passing`；CBoard Web 订阅 payload `2 suites / 3 tests / 1 snapshot` 和 production build；微信 `65 files / 289 tests`、质量门 `7/7`、TypeScript、ESLint、`186 app / 29 CBoard core` 边界和 production build 全部通过。微信 main `1,249,564 B`、management `503,194 B`，所有包低于 1.5 MiB 建议线。详细决策见 `cboard-api/docs/subscription-payment-security-reuse-decision.zh-CN.md` 和 `cboard-wechat-poc/docs/订阅状态只读展示与支付安全边界.md`。
- **生效范围：** issue #1 的现有 PayPal/Google Play/App Store 订阅归属、套餐目录核对、响应脱敏、取消边界、Web 计划绑定和微信只读状态已形成可审查工程闭环；不表示真实 provider sandbox、微信下单/支付、商户证书、价格版本、套餐权益、退款、发票、账单或对账完成。本轮未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 21:32:34。

## 变动 169：取消订阅按到期时间结束保护并在线对齐路线图

- **意图：** 修复已取消订阅在到期后仍被永久当作有效、导致用户不能重新选择套餐的状态错误；同时用线上 issue 正文确认是否应该继续扩微信支付。
- **决策：** `isSubscriberActive` 改为消费完整 subscriber：`active/in_grace_period` 继续保护；`canceled/cancelled` 在交易到期时间之前保护、到期后释放。缺少或损坏到期时间的旧记录保持保守锁定，等待供应商同步或管理员修复。通过本机 10808 代理调用 GitHub REST API，只读核对 issue #1，不修改 issue 状态或正文。
- **理由：** 旧实现和测试名称声称“到期前有效”，但实际只看字符串，取消用户会永久锁死。服务端到期时间是现有 CBoard 交易事实，直接复用即可，不应另造状态。在线 issue #1 当前没有微信支付要求，图语家商业化文档又把正式订阅放在试点后的阶段 3，因此继续扩支付会偏离产品决策。
- **证据：** 新增到期前/到期后/旧记录三类判断和 controller 重选回归；订阅聚焦 `17 passing`，cboard-api 无数据库单元全量 `298 passing`，Swagger v2 校验通过。GitHub REST 返回 issue #1 标题 `Product roadmap`、状态 `open`、更新时间 `2026-05-05T01:22:00Z`，正文仍列后端豆包语音、手机号验证、自定义图片服务器存储及 Token billing/限流/月额度。
- **生效范围：** 只影响 cboard-api 普通用户在取消订阅到期后的套餐重选和路线图证据；不提前增加套餐权益、微信下单、自动扣费、退款或账单。没有预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 21:45:08。

## 变动 170：生产模板与当前可运行环境分层验收

- **意图：** 明确区分“部署模板有效”和“图语家当前已有可供微信访问的生产后端”，防止把本地测试或示例配置误写成真实云能力完成。
- **决策：** 直接复用现有 `checkProductionDeployment.js` 和 `/health`，分别校验示例模板、真实默认配置和本地运行实例；不自动创建 `.env.production`、密钥、证书、Docker 服务或云资源。
- **理由：** 域名、Mongo、Azure、腾讯短信和可选 AI/语音凭据属于真实外部资源，必须由持有人安全配置；AI 继续写业务代码不能替代云账号、合法域名或物理设备验收。离线核心不应被这些外部缺口阻断。
- **证据：** 生产示例模板校验通过；真实检查明确缺少 `deploy/.env.production` 及其域名、Mongo、独立会话密钥、Azure 私有图库、腾讯短信和额度配置；本地 `127.0.0.1:10010/health` 在 3 秒内无响应。代码侧仍保持订阅聚焦 `17 passing`、API 无数据库全量 `298 passing` 和 Swagger v2 通过。
- **生效范围：** 当前 cboard-api 生产就绪判定、issue #1 部署证据和后续真实联调顺序；不改变患者表达/接收、Web/微信代码或支付状态。本轮未生成密钥、启动 Docker、发送短信、调用付费供应商、部署、预览、上传、发布、提交或推送，也没有操作或置顶任何窗口。详细清单见 `cboard-api/docs/production-readiness-current-gaps.zh-CN.md`。
- **记录：** Codex（GPT-5），2026-07-22 21:49:04。

## 变动 171：复用 CBoard 订阅校验并封住删除、超限输入与交易重放旁路

- **意图：** 在不自研第二套支付系统的前提下，把 CBoard 现有订阅代码从“正常路径可用”推进到“路由配置出错、客户端提交超大 provider 数据或复用他人交易时仍安全”，避免未来套餐权益建立在可绕过的记录上。
- **决策：** 继续复用 CBoard 的 JWT 认证、`Subscription` 服务端目录、PayPal/Google Play/App Store 校验和现有 Swagger 工具；控制器对删除动作再次要求管理员。Android receipt 限制为 64 KiB、purchase token 限制为 4096 字符，产品标识必须来自服务端目录，跨订阅者重复 transaction ID 在保存前拒绝。provider 验证所需 Android token 只留在服务端模型，响应继续脱敏。交易请求体只声明在 `/subscriber/{id}/transaction`。
- **理由：** Swagger scope 是第一层而不应是唯一授权层；provider payload 属于不可信输入，无界 JSON 和 token 会扩大内存、数据库及日志风险；已有 transaction ID 查询可以直接承担重放保护，无需引入新的支付 SDK、缓存或状态机。人工检查发现请求体约束曾因相似 YAML 片段误挂到 analytics/board，必须用端点级契约测试固化。
- **证据：** 订阅安全聚焦 `22 passing`，覆盖越权删除不触发数据库、64 KiB/4096 上限、服务端产品绑定、跨订阅者重放拒绝和 Swagger 端点唯一落点；cboard-api 无数据库单元全量 `303 passing`。Swagger v2 为 `0 errors`，仅保留与本次无关的既有 `phraseToEdit` 未使用警告；目标差分格式检查通过。
- **生效范围：** 只影响 cboard-api 订阅删除、Android 交易输入、跨订阅者交易复用和 Swagger 契约；不增加购买 UI、微信支付、价格、权益、退款、账单或真实 provider 能力。未运行真实 Mongo/Google Play/PayPal/App Store sandbox，未部署、预览、上传、发布、提交或推送；全程只用后台命令和补丁，没有打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 22:02:49。

## 变动 172：复用原图语家 41 场景人工审核图符提高在线补图排序

- **意图：** 修复“文字/分词正确但通用在线搜索把不合适图片排在前面”的核心质量缺口，同时避免把原 Next.js UI、图片二进制或第二套 matcher 搬入 CBoard/微信。
- **决策：** 从原 `pictogram-eval-results.json` 确定性提取 41 个场景、138 个概念及其人工确认 ARASAAC ID，记录源 SHA-256，并接入 cboard-api 现有 `bestsearch -> search -> OpenSymbols` 编排。审核 ID 在实时结果前稳定去重；上游首轮为空/失败时返回审核候选；未知词保持原搜索链。所有候选仍经过现有同源代理、许可归一化、每词 4 张上限和照护者逐图确认。
- **理由：** 原图语家 96 个主词已全部迁入当前 108 项中性词典，继续复制词典没有收益；真正差异在图库覆盖。41 条原评测含 138 个唯一概念，CBoard 默认板只直接匹配 47 个（34.06%）。把原 295 张远程图片加入微信包会破坏包体和离线边界，服务端复用审核 ID 则不增加客户端包、不新造搜索或许可系统，并保留人工最终决定权。
- **证据：** 词典主词遗漏 0；原评测文本匹配无 `partial` 错配。索引 schema v1 为 41 cases / 138 concepts，每项 1–4 个 ID。API 图符聚焦 `21 passing`、无数据库全量 `307 passing`；CBoard 缺词链 `3 suites / 14 tests`，微信候选链 `4 files / 15 tests`。真实 ARASAAC 验证中 `水 -> 2248`、`测体温 -> 36852` 均为首位，搜索和两张 PNG 下载均 HTTP 200。
- **生效范围：** cboard-api 中文在线补图排序与审核回退，CBoard Web/微信通过原响应协议自动消费；不改变分词、默认板、matcher、个人图、历史或客户端代码。公开图库投稿继续按既有复用审查延期，私有照片不得公开；本轮未部署、预览、上传、发布、提交或推送，全程后台执行，没有打开、聚焦、抬升或置顶任何窗口。详细决策见 `cboard-api/docs/picinterpreter-reviewed-pictogram-priority-decision.zh-CN.md`。
- **记录：** Codex（GPT-5），2026-07-22 22:28:21。

## 变动 173：用原场景证据桥接 CBoard 分词与人工审核图符

- **意图：** 解决同一照护句在当前 CBoard 中被分成“慢慢、一点、然后”等口语 token 后，无法命中原图语家“慢的、少许、以后”等已审核概念的问题，继续提高图文匹配质量而不自行研发新搜索算法。
- **决策：** 在 cboard-api 的原审核图符数据层加入 14 个一对一窄别名，并由现有 getReviewedArasaacIds 统一解析；所有别名都来自 41 个原 finalText、审核概念与当前真实分词的逐场景对照。抬、叫、体温、呼吸困难、按铃、受伤了等歧义、高风险或原评测明确缺图的词继续不映射。
- **理由：** 这是复用原人工审核结果所需的最小胶水层，不复制旧 UI、不增加模型或依赖，也不把候选变成自动决定。窄别名能修复词形差异；拒绝宽泛别名则避免把“体温”错误缩成“测体温”、把“受伤”错误表达成“出血”等照护风险。
- **证据：** 41 个原场景通过当前默认板、分词和 matcher 重放：211 次未匹配 token 中，审核索引覆盖由 121（57.35%）提升到 146（69.19%），唯一词由 56 增至 70。14 个别名目标与 ID 完整性全量断言通过；API 图符聚焦 21 passing、无数据库全量 307 passing，Web 3 suites / 14 tests，微信 4 files / 15 tests。真实 ARASAAC 中然后 → 13080、一点 → 7209、慢慢 → 4676 均排第一且 PNG 下载成功。
- **生效范围：** 只影响 cboard-api 已审核 ARASAAC 候选的查找键与排序，CBoard Web/微信沿用现有协议自动受益；患者原文、可编辑分词、默认板、matcher、个人图、照护者确认、包体、公开图库与部署状态均不改变。未预览、上传、发布、部署、提交或推送；全程只用后台命令与补丁，没有打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 22:41:51。

## 变动 174：微信 ARASAAC 直连容灾复用同一人工审核排序

- **意图：** 修复 cboard-api 故障或未配置时微信虽然能直连 ARASAAC，却会失去原图语家人工审核优先级、重新暴露低质量首图的问题。
- **决策：** 把变动 172/173 的紧凑索引作为 CBoard 平台无关纯核心数据供微信消费；直连 adapter 继续复用既有 Taro request、downloadFile、saveFile、可信 ARASAAC URL、许可元数据、每词四候选与照护者确认，并按 cboard-ai-engine 已验证的 bestsearch → search 编排。审核 ID 排在实时结果前；审核词上游失败时仍返回审核候选；无审核词才进入宽泛兼容搜索。降级文案明确区分人工审核候选和普通兼容候选。
- **理由：** 容灾不能以质量打回原形为代价。共享纯数据和查询函数是最小胶水，不复制 cboard-api、不加入新依赖、不把 295 张图片塞入小程序，也不会让外部候选自动写入患者表达。
- **证据：** CBoard 索引 138 concepts / 14 aliases 与 API 解析对象完全一致，规范化 SHA-256 均为 4677C0BD59555288429C7EC9A759F4797A71A3DF45F7CF4E6143CD287E7C8F9C；纯核心 1 suite / 3 tests。微信聚焦 2 files / 16 tests、全量 65 files / 294 tests、TypeScript、ESLint、186 app / 29 core 边界、production build 和质量门 7/7 通过；产物实际包含 bestsearch、审核索引和 ID 4676。主包 1,249,564 B，caregiver 568,367 B，均远低于 1.5 MiB 建议线。
- **生效范围：** 微信照护者缺词在线搜索在 cboard-api 失败或缺失时的 ARASAAC 直连候选；后端正常时仍优先 cboard-api。患者原文、可编辑分词、默认板、matcher、个人图、候选确认、缓存、历史和公开图库边界不变。真实微信合法域名和手机外网仍待配置/验收；未预览、上传、发布、部署、提交或推送，全程没有打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 23:01:42。

## 变动 175：复用原审核概念保护接收端复合词分词

- **意图：** 修复原图语家已经审核的多字概念在迁入 CBoard 后被通用分词拆散、继而无法命中审核图符的问题，避免图文匹配质量因技术底座变化而打回原形。
- **决策：** CBoard 中性核心从变动 172 的同一索引导出 116 个多字概念，按最长词优先参与分词；原有显式组合拆分表仍最后执行。微信直接编译复用 CBoard 函数，不维护第二份小程序词表，不新增分词依赖。
- **理由：** 测体温、床头柜、降低音量、叫门、胸口痛、开窗通风、涂药膏、抬肘咳嗽等词已有原 41 场景人工审核事实；复用已审核数据比自行研发词典或引入新模型更可靠，也能保持 Web/微信行为一致。
- **证据：** 41 场景实际重放后，未匹配 occurrence 从 211 降至 205；审核候选覆盖由 146/211（69.19%）提升到 157/205（76.59%），唯一覆盖 token 由 70 增至 81。CBoard 聚焦 4 suites / 206 tests、全量 193 suites / 1280 tests / 72 snapshots 与 production build 通过；微信全量 65 files / 294 tests、类型、ESLint、production build、产物检查和质量门 7/7 通过。微信主包 1,249,564 B，caregiver 569,197 B。
- **生效范围：** CBoard Web 与微信接收端的中性分词；最终文字和分词仍可人工即时修改，现有换衣服、喝水等组合表达拆分保持不变。默认板、matcher、AI、个人图、候选确认、公开图库及歧义医疗词不变。未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 23:15:27。

## 变动 176：原 41 场景成为可重复重放门并补齐句级审核桥接

- **意图：** 不再依赖一次性统计或人工记忆判断图文匹配是否退化，把原图语家 finalText、concepts 和人工 sequence 直接变成 CBoard/微信可重复质量证据，并继续补齐有明确答案的短语。
- **决策：** 新增测试专用 41 场景 fixture 和来源 SHA-256；6 条一对一句级别名保留自然分词后查审核图，7 条一对多短语严格按原 sequence 展开。剩余 25 个唯一未审核词以明确对象锁定，原评测缺图项和语法词不进入猜测映射。
- **理由：** 原人工评测已经给出句级概念答案，复用它比新增分词依赖、训练模型或重写 matcher 更可靠。重放测试同时覆盖默认板、分词、matcher 和审核索引，能在底座升级时立即暴露静默退化；显式剩余集合则阻止为了匹配率牺牲医疗和否定安全。
- **证据：** 41 场景审核候选覆盖由 157/205（76.59%）提升至 164/198（82.83%），唯一审核 token 81 → 88；剩余未审核 34 次 / 25 个唯一词。CBoard 聚焦 5 suites / 222 tests、全量 194 suites / 1296 tests / 72 snapshots 和 production build；API 聚焦 18 passing、无数据库全量 307 passing；微信 65 files / 294 tests、类型、ESLint、186/29 边界、production build 与质量门 7/7 全部通过。main 1,249,564 B、caregiver 570,059 B，两份索引对象一致。
- **生效范围：** CBoard Web 与微信接收端共享分词、cboard-api/微信直连审核候选、后续匹配回归。finalText 和分词仍可人工即时修改；默认板、matcher、AI、个人图、候选确认、公开图库不变。屋里闷、按铃动作、捂嘴动作继续明确缺图，呼吸困难只按原 sequence 拆成呼吸/困难的而不成为单图宽泛别名。未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 23:41:54。

## 变动 177：继续复用人工 sequence，将安全审核覆盖提升到 89.19%

- **意图：** 继续修复原图语家已有人工答案、迁移后却因句内介词或短语边界产生无图 token 的场景，同时拒绝为了追求覆盖率给医疗、否定或明确缺图动作配错图片。
- **决策：** 审核索引新增“平静地 → 平静的”窄别名；共享分词核心新增 11 条原人工 sequence 可直接证明的精确短语改写。来看看你因另一照护场景明确保留“看你”而不改，叫护士、不要滑倒、按铃、捂嘴和屋里闷继续保持未审核。
- **理由：** 所有新增项都直接复用原 41 场景 finalText、concepts 和人工 sequence，不引入新模型、新词库或第二套 matcher；明确锁定剩余词比自行猜测更符合接收端安全边界。
- **证据：** 自动重放覆盖从 164/198（82.83%）提升至 165/185（89.19%），剩余未审核从 34 次 / 25 唯一词降至 20 次 / 16 唯一词。CBoard 5 suites / 234 tests、全量 194 suites / 1308 tests / 72 snapshots 和 production build；API 18 passing / 307 passing；微信 65 files / 294 tests、TypeScript、ESLint、186/29 边界、production build、7/7 质量门和包体检查全部通过。main 1,249,564 B、caregiver 570,813 B；两份 41 cases / 138 concepts / 21 aliases 索引对象一致，SHA-256 为 473D20B8BAA3DB9E8CA1F46F72D78C1C17E964700D3F57382147D63B112AEA58。
- **生效范围：** CBoard Web 与微信接收端共享分词、API/微信直连人工审核候选和迁移质量门；不改变 finalText、人工可编辑分词、默认板、matcher、AI、个人图或确认流程。未预览、上传、发布、部署、提交或推送；没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-22 23:58:01。

## 变动 178：固化微信语音反馈与开源语音复用边界

- **意图：** 继续寻找成熟语音实现，同时防止把微信同声传译的延迟文字回调误称为实时音量波形，或为了视觉即时性破坏已恢复的真机识别。
- **决策：** 微信保留 WechatSI 中间文本驱动的诚实“识别活动”状态，不并发启动第二个 RecorderManager；CBoard 原生壳继续优先复用本地 MIT 系统识别插件；Apache-2.0 sherpa-onnx 仅作为未来原生壳或私有服务端候选。GitHub 未声明许可证的 voiceapi、sherpa-onnx-server 不复制代码。cboard-ai-engine 继续只选择性复用已验证的 ARASAAC 搜索顺序，不整体接入。
- **理由：** WechatSI 没有向应用暴露当前会话 PCM/RMS，应用自启录音可能争抢全局麦克风；中文/粤语 sherpa int8 模型约 226–234 MB，远超微信包体边界；现有 Cordova 插件和 API 供应商适配层更成熟且维护成本更低。
- **证据：** 小程序 recognitionPort 只消费 onRecognize/onStop，ReceiverWorkspace 已标注“监听状态，不是音量波形”；Taro RecorderManager 文档说明 onFrameRecorded 依赖应用自行 start 与 frameSize；sherpa 官方模型页给出相应体积。后台 fetch 后 CBoard/API 分别为 7/0、2/0 ahead/behind upstream，speech-tts 与 upstream 为 0/0，无需合并；cboard-ai-engine upstream 已不可访问。
- **生效范围：** 微信语音活动 UI、CBoard Cordova 离线识别和未来服务端 ASR 选型；不改变现有 WechatSI、腾讯/火山 ASR、TTS、分词、图文匹配或患者表达。本轮没有新增依赖/provider/模型，没有预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。详细评估见 cboard-api/docs/open-source-speech-reuse-assessment.zh-CN.md。
- **记录：** Codex（GPT-5），2026-07-23 00:14:04。

## 变动 179：复用四条完整人工场景，并由安全回归阻止过宽泛化

- **意图：** 继续把原图语家已有人工 sequence 接入 CBoard/微信共享核心，同时确保改写只在证据覆盖的语境生效，不为追求匹配率破坏照护和服药顺序。
- **决策：** 新增 4 条完整上下文改写：医生下午三点来看你 → 医生/下午/三点整/来/你，我叫护士 → 我/说/护士，坐轮椅下楼散步 → 轮椅/电梯/下/散步，或者抬肘咳嗽 → 抬肘咳嗽。最初尝试的通用“叫护士、来看你、下楼”被收紧；“先喝水”因删除“先喝水再吃药”的顺序词被撤回。
- **理由：** 原 sequence 可以证明完整场景的概念顺序，却不能证明同一子串在所有句子中等价。聚焦与全量测试分别暴露跨语境和医疗顺序回归，保留明确未匹配词比静默改错更安全。
- **证据：** 41 场景审核覆盖从 165/185（89.19%）升至 167/183（91.26%），剩余 16 次 / 12 个唯一词。最终聚焦 5 suites / 242 tests；CBoard 全量 194 suites / 1316 tests / 72 snapshots 与 production build；微信 65 files / 294 tests、TypeScript、ESLint、186/29 边界、production build 和 7/7 质量门全部通过。微信 main 1,249,564 B、caregiver 571,172 B、emergency 94,003 B、management 510,140 B、backup 599,098 B、ocr 64,693 B。
- **生效范围：** CBoard Web 与微信接收端共享分词、API/微信直连审核候选以及 41 场景迁移门；最终文字和分词仍可人工即时修改，按铃、屋里闷、捂嘴、不要滑倒和通用先/还是等词继续不猜图。未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 00:29:33。

## 变动 180：复用 OpenAAC OBL 0.1 补齐跨 AAC 标准沟通日志导出

- **意图：** 让图语家的双向沟通历史不只可供人阅读，还能按 AAC 社区开放格式由其他工具解析，同时避免自行发明新的私有日志格式。
- **决策：** 复用 OpenAAC open-board-log-0.1 契约，在 CBoard 中性纯核心实现最小序列化器；Web 和微信保留原文本导出并各增加独立 .obl 入口。表达记录映射为 modeling=false 的 utterance，接收端照护者输入映射为 modeling=true；重新生成文件内 ID，不写姓名、设备、网络、位置或 URL。因仍包含原文和真实时间，不设置 anonymized，不生成或冒充 .obla。
- **理由：** OpenAAC 已定义会话、事件、角色和匿名化边界，复用标准比增加图语家专用 JSON 更利于跨工具流转。官方公开实现是 MIT Rails 文档站，OBL 解析/验证仍列为未来工作，没有值得搬入 React/Taro 的成熟 TypeScript 库，因此只写跨端纯函数和平台下载胶水，不复制整站或增加依赖。
- **证据：** OpenAAC 官方 OBL 文档与 MIT 仓库在线核验；CBoard 聚焦 2 suites / 16 tests、全量 194 suites / 1319 tests / 72 snapshots、production build；微信 65 files / 294 tests、7/7 质量门、TypeScript、ESLint、186/29 边界和 production build全部通过。CBoard 主包 gzip 1.67 MB（+785 B）；微信 main 1,249,564 B、management 512,636 B，其余分包全部低于 1.5 MiB。
- **生效范围：** CBoard Web 与微信小程序本机历史的用户主动导出及共享核心；不上传日志，不改变持久化/同步/沟通/匹配/语音。在本变动发生时，OBL 导入、严格 OBLA 匿名化、研究共享和第三方验证器尚未实现；其中 OBL 导入已由后续变动 182 补齐，严格 OBLA 导出已由变动 203 补齐，匿名文件拒绝恢复的生产运行门已由变动 243 补齐；研究平台共享和第三方验证器仍未实现。未预览、上传、发布、部署、提交或推送；全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 00:57:05。

## 变动 181：区分历史判断与当前实现状态

- **意图：** 防止早期补漏审计中的“未开始”文字被误读为当前状态，导致方言、OCR、视觉元数据和去背景重复开发或被错误列为遗漏。
- **决策：** 保留变动 77 的历史时点和原始判断，但在其决策后追加“已被后续实现取代”的明确说明；矩阵顶部最近回填时间同步到本次审计时间。当前完成度继续以顶部 issue 行、后续变动、代码、测试和构建证据为准，不回写或美化历史证据。
- **理由：** 变动日志需要保留决策演进，但覆盖矩阵也必须让维护者一眼区分“当时未实现”和“现在未实现”；直接删除旧判断会损害可追溯性，完全不改又会误导下一轮开发。
- **证据：** 当前矩阵 #3/#5/#20/#21/#82 已分别记录后端化方言文字与音频、OCR、视觉元数据建议和去背景；CBoard 存在 `dialectAudioRecognition.js`、`imageTextRecognition.js`、`pictogramMetadataSuggestion.js` 及 TileEditor 去背景入口，微信存在方言录音端口、独立 OCR 分包和 backup 分包去背景端口，cboard-api 存在对应 provider、controller、Swagger 与单元测试。真实生产凭据和设备质量仍按各行保持“待验收”。
- **生效范围：** 只修正图语家迁移覆盖矩阵的阅读语义与回填时间；不改变任何 Web、小程序、API 代码、运行状态、凭据或验收结论。未预览、上传、发布、部署、提交或推送，全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 01:07:06。

## 变动 182：复用 OpenAAC OBL 0.1 补齐跨端标准日志导入

- **意图：** 完成变动 180 留下的本机互操作缺口，让照护者可以把其他 AAC 工具产生的标准 `.obl` 日志导入 CBoard Web 或微信小程序，同时保住现有历史和患者隐私。
- **决策：** 两端共用 `importCommunicationHistoryOpenBoardLog` 纯解析器，平台层只复用浏览器文件输入或微信既有文件端口。解析器兼容规范的注释前缀，只接收 `open-board-log-0.1` 的 `utterance`，按 `modeling` 与图语家扩展恢复表达/接收、标签和患者反馈；输入、会话、事件、文字和标签均有界。外部姓名、`user_id`、设备、网络、位置和 URL 不落库；导入记录标记 `localOnly`，不进入账号 settings 云同步。导入追加、幂等，历史满额时跳过外部记录而不删除本机记录。
- **理由：** OpenAAC 已定义日志交换语义，直接复用标准比自研私有 JSON 更利于跨工具流转；官方 MIT 仓库没有成熟 TypeScript 解析器可搬用，因此只实现受限纯函数和薄平台胶水。患者日志可能包含高度敏感原文，默认仅本机和非破坏式容量策略比自动同步更安全。
- **证据：** CBoard 聚焦 3 suites / 21 tests、全量 195 suites / 1324 tests / 72 snapshots 和 production build；微信聚焦 2 files / 4 tests、全量 65 files / 294 tests、7/7 质量门、TypeScript、ESLint、186/29 边界和 production build 全部通过。CBoard 主 JavaScript gzip 1.67 MB；微信 main 1,249,564 B、management 517,758 B，其余分包均低于 1.5 MiB。测试覆盖注释前缀、身份字段忽略、方向、标签、反馈、幂等、容量保护、无效格式和本机记录不进云端 settings。
- **生效范围：** CBoard Web 与微信照护管理页、本机历史 repository/storage 和 OpenAAC `.obl` 手动导入；不改变表达、接收、分词、matcher、图卡、语音或既有导出。在本变动发生时严格 `.obla` 匿名化尚未实现，后由变动 203 补齐，并由变动 243 固化匿名文件拒绝恢复边界；研究平台共享、远程 URL 导入、第三方验证器和非 `utterance` 事件恢复仍未实现。本轮未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 08:01:42。

## 变动 183：复用 CBoard PayPal helper 并修正官方请求契约

- **意图：** 继续推进 issue #1 的订阅工程可靠性，修正 CBoard 现有 PayPal 计划同步和取消路径中会在真实供应商环境失败的 Axios 参数与 JSON body 偏差，而不是为图语家重造支付系统。
- **决策：** 保留 cboard-api 现有 PayPal helper、Axios、Subscription/Subscriber 模型和控制器；`listPlans` 把 headers/params 放入同一个 Axios config，`cancelPlan` 按官方 schema 发送顶层 `reason`。OAuth 缺凭据或空 token 时失败关闭；订阅 ID 在 OAuth 前执行非空、128 字符上限与 URL 编码。复用已安装的 Nock 做无网络契约测试，不新增依赖、路由或客户端支付代码。
- **理由：** PayPal 官方 Subscriptions API 已明确计划查询参数与取消 body，直接修正薄适配器比引入第二套 SDK 或订单状态机更小、更可审查。原实现的 GET 第三个参数会被 Axios 忽略，取消请求又多包一层 `data`；吞掉 OAuth 错误后继续发送无效 Bearer 也不符合支付失败关闭原则。
- **证据：** 官方 API 文档在线核对；新 helper 测试 `6 passing`，订阅安全聚焦 `28 passing`，cboard-api 无数据库全量 `313 passing`，语法、Prettier、目标差分和生产部署模板通过。仓库总差分检查只剩既有 `api/controllers/board.js` 尾随空格，未修改该并行文件。所有 provider 调用均由 Nock 拦截，没有访问 sandbox 或生产。
- **生效范围：** cboard-api PayPal OAuth、计划列表、订阅详情和取消 helper，以及复用它们的既有目录同步/用户取消路径；不改变套餐、价格、权益、Google Play、App Store、Web、微信或患者沟通。不包含真实购买、webhook、退款、对账或微信支付；未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 08:19:09。

## 变动 184：跨分类找图归入家属图片库维护

- **意图：** 避免面向患者的表达页混入图库管理工具，让患者继续聚焦点图表达，同时让家属在统一的图片库维护入口完成跨板块检索和换图。
- **决策：** 从微信患者 `ExpressionWorkspace` 移除“跨分类找图”的状态、输入框、结果列表和专用样式；在“照护工具 → 个人图片”的 `PersonalImageManager` 中复用 CBoard 中性 `searchExpressionPictograms` 排序，支持中文标签、同义词和板块名检索。搜索结果不再加入患者表达，而是直接提供选择/更换熟悉照片、编辑来源说明和恢复默认图片。
- **理由：** 跨分类检索本质是照护者维护图库时定位图卡的工具，不是患者高频表达步骤。复用已经验证的共享搜索核心可保留“汤匙”等中文同义词优化并避免第二套匹配逻辑；患者端仍保留“最近使用/接下来可能需要”，因为它属于表达辅助。
- **证据：** 静态检索确认患者表达源码和样式中已无 `expression-search`，唯一“跨分类找图”入口位于个人图片维护页；TypeScript、ESLint、186 app / 29 core 边界检查、65 files / 294 tests、7/7 微信质量门和 production build 全部通过。产物主包 1,249,564 B，backup 分包 601,513 B，均低于 1.5 MiB 建议线。
- **生效范围：** 微信小程序患者表达页及家属“个人图片”维护页；不改变默认 CBoard 图库、搜索算法核心、接收端缺词联网找图、患者候选推荐、图卡数据、历史、同步或 Web 端。本轮未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 10:43:11。

## 变动 185：补齐照护设置到图片库维护的真实导航

- **意图：** 让家属按照“设置 → 图片库维护”的直觉找到跨分类找图，而不是必须知道主页面上的“个人图片”快捷入口。
- **决策：** 微信主入口“显示设置”统一改名为“照护设置”；设置页新增“图片库维护”卡片，进入复用现有 `packages/backup/pages/personal-images` 低频分包。该页面导航栏和标题统一为“图片库维护”，返回按钮改为兼容设置入口与快捷入口的“返回上一页”。主页面原“个人图片”快捷入口保留，避免给熟悉旧路径的家属增加操作成本。
- **理由：** 模块已经放到正确页面不等于用户能从预期入口找到它。复用同一个图片库页面和 Taro `navigateTo` 路由比复制页面或创建新分包更小、更一致；保留快捷入口兼顾新旧路径，且不会把维护功能重新暴露给患者表达流程。
- **证据：** 新增源码契约测试断言患者 `ExpressionWorkspace` 不含“跨分类找图/`expression-search`”，个人图片维护页包含搜索入口，照护设置包含 `open-picture-library-management-button`。TypeScript、ESLint、187 app / 29 core 边界、66 files / 296 tests、7/7 微信质量门和 production build 全部通过；主包 1,249,564 B、management 516,682 B、backup 601,492 B，均低于 1.5 MiB 建议线。
- **生效范围：** 微信小程序家属照护设置、图片库维护页面标题、相关提示文案和导航；不改变搜索核心、图卡数据、个人图片存储、备份、接收端缺词找图、患者候选推荐、Web 或 API。本轮未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 12:29:30。

## 变动 186：复用 PayPal 官方分页补齐完整套餐目录同步

- **意图：** 修复 CBoard 订阅同步固定只读取 PayPal 第 1 页 10 条计划导致后续套餐静默丢失 `paypalId` 映射的问题。
- **决策：** 继续复用 cboard-api 现有 PayPal helper、Axios 和订阅同步；`listPlans()` 单次获取 OAuth token，以官方最大 `page_size=20` 有界读取全部页。优先采用 `total_pages`，缺失时按满页继续/短页停止；超过 100 页失败关闭，不向同步流程返回部分目录。
- **理由：** PayPal 官方已定义 `page`、`page_size`、`total_pages`，直接在薄 adapter 中补齐比引入新 SDK 或重写订阅系统更小。漏项会被现有映射静默转为空 ID，明确失败比用不完整目录写库安全；100 页边界可阻止异常响应造成无上限外呼。
- **证据：** [PayPal Subscriptions API](https://developer.paypal.com/docs/api/subscriptions/v1/#plans_list) 在线核验；helper 离线 Nock `9 passing`，覆盖两页聚合、单 token、无页数元数据和超限失败。订阅安全聚焦 `31 passing`，API 无数据库单元全量 `316 passing`，语法、Prettier、目标差分和生产部署模板通过；没有真实供应商网络请求。
- **生效范围：** cboard-api PayPal 计划列表及既有订阅目录同步；不改变套餐、价格、权益、购买、取消、Google Play、App Store、Web、微信或沟通功能。不代表真实支付、sandbox、webhook、退款、对账或微信支付完成；未预览、上传、发布、部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5），2026-07-23 12:34:42。

## 变动 187：复用 Google Play nextPageToken 防止漏页误删套餐

- **意图：** 修复 CBoard 套餐同步只读取 Google Play 第一页，继而漏同步甚至把后续页合法套餐从本地目录误删的问题。
- **决策：** 新增薄 `googlePlaySubscriptionCatalog` helper，继续使用现有 `googleapis`；按官方最大 `pageSize=1000`，将 `nextPageToken` 原样传为后续 `pageToken`，最多读取 100 页。重复/超长 token、异常响应或超限循环全部失败关闭；控制器只在完整目录返回后执行既有保存和删除逻辑。
- **理由：** Google 官方明确列表会分页且默认最多 50 条；原控制器随后删除未在远端数组中找到的本地记录，因此漏页会变成数据破坏风险。独立 helper 比重写订阅控制器或引入新 SDK 更小，也便于离线证明 opaque token 和循环边界。
- **证据：** [Google Play Developer API](https://developers.google.com/android-publisher/api-ref/rest/v3/monetization.subscriptions/list) 在线核验；helper `4 passing`，供应商分页与订阅安全聚焦 `35 passing`，API 无数据库单元全量 `320 passing`；语法、Prettier、目标差分和生产部署模板通过，没有真实网络请求。
- **生效范围：** cboard-api 管理员 Google Play 套餐目录同步及其新增/更新/删除判断；不改变购买验证、PayPal/App Store、套餐权益、Web、微信或沟通功能。不代表真实商店或支付完成；未预览、上传、发布、部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5），2026-07-23 12:39:45。

## 变动 188：订阅同步改用全量本地目录并在删除后响应

- **意图：** 修复远端目录已完整分页后，本地同步仍只比对默认前 10 条、且成功响应包含删除前旧记录的问题。
- **决策：** 新增 `subscriptionCatalogReconciliation` helper，复用 `Subscription.find({})` 和 `findOneAndDelete` 对完整本地目录协调；管理员的 `page/limit/search` 只用于协调完成后的响应展示。所有远端和本地 ID 在第一次删除前完成有界验证，任一异常失败关闭；删除结束后才复用原 `paginatedResponse`。
- **理由：** 通用列表分页适合展示，不是全局同步事实源；第 11 条以后的 stale 套餐此前不会被处理。独立薄 helper 比改变所有端点共用的分页器更安全，也能保留原 API 响应结构并防止返回刚删除的数据。
- **证据：** 新增 helper/控制器 `4 passing`，覆盖 12 条本地目录、第 11 条删除、远端/本地坏 ID 删除前停止和调用顺序；供应商分页与订阅安全聚焦 `39 passing`，API 无数据库全量 `324 passing`，语法、Prettier、目标差分和生产部署模板通过。
- **生效范围：** cboard-api 管理员套餐同步的本地全量比对、stale 删除和响应时点；不改变普通列表分页、供应商购买、用户订阅、价格权益、Web、微信或沟通功能。不代表真实数据库事务或商店支付完成；未部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5），2026-07-23 12:46:10。

## 变动 189：CBoard Web 跨分类找图归入家属图片库维护

- **意图：** 让 CBoard Web 与微信小程序保持相同的患者/家属角色边界，避免患者表达页同时承担图库检索与维护任务。
- **决策：** 从患者 `ExpressionLoopPanel` 移除跨分类搜索输入、结果状态和专用样式；患者端继续保留“最近使用/接下来可能需要”。在家属 `PersonalImageManager` 中复用中性 `searchExpressionPictograms` 与 `normalizeExpressionPictogramSearchQuery`，支持按中文标签、同义词和板块名跨板检索，并将结果用于更换熟悉照片、编辑说明或恢复默认图片。
- **理由：** 跨分类找图是照护者维护图片库时定位图卡的低频管理动作，不应挤占患者高频表达流程。复用双方已经验证的共享搜索核心，可以保留“汤匙 → 勺子”等图语家优化，又避免 Web 和微信出现两套排序算法。
- **证据：** 静态检索确认“跨分类找图”只位于 `PersonalImageManager`，患者 `ExpressionLoopPanel` 已无 `communication-expression-pictogram-search` 和旧搜索状态；定向 3 suites / 26 tests、CBoard 全量 195 suites / 1325 tests / 72 snapshots 与 production build 全部通过。构建主 JavaScript gzip 1.67 MB，较调整前减少 304 B。
- **生效范围：** CBoard Web 患者表达页、家属个人图片库维护页、对应组件测试和废弃搜索样式；不改变微信小程序、API、默认 CBoard 图库、共享搜索算法、缺词联网找图、患者候选建议、图卡数据、历史或同步。本轮未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 13:03:48。

## 变动 190：微信图片库维护只保留家属设置入口

- **意图：** 让“跨分类找图”和个人图片维护彻底退出患者表达页面，避免患者或家属把表达流程中的旧快捷入口误认为图片库的正式归属。
- **决策：** 删除微信患者主页面“照护工具”里的“个人图片”快捷按钮；唯一正式路径统一为“照护设置 → 图片库维护”。保留原低频 backup 分包页面、跨分类搜索、个人图片存储和维护能力，不复制页面或搜索实现。
- **理由：** 同一管理功能同时从患者页和设置页进入会模糊患者/家属角色边界，也会让后续界面维护产生两个入口。统一到家属设置符合低频维护功能的使用场景，并且不增加代码包或运行时依赖。
- **证据：** 源码边界测试新增断言 `CommunicationPage` 不含 `personal-image-manager-button` 和图片库维护路由，设置页仍含 `open-picture-library-management-button`，图片库页仍含 `personal-image-library-search`。定位测试 2/2、微信全量 66 files / 296 tests、7/7 质量门、TypeScript 和 production build 全部通过；构建产物 main 1,249,564 B、management 516,682 B、backup 601,492 B，均低于 1.5 MiB 建议线。
- **生效范围：** 微信小程序患者主页面的图片库快捷入口和角色边界契约测试；不改变家属设置、图片库维护页面、跨分类搜索算法、图卡、个人图片数据、备份、Web 或 API。未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 13:27:08。

## 变动 191：复用 AACTools 补齐 AsTeRICS Grid 跨端导入

- **意图：** 继续补齐 issue #30 的“其他 AAC 图库”迁移能力，让已有 AsTeRICS Grid 用户可把 `.grd` 板面带入 CBoard Web 或微信小程序，而不是要求家属重建图库或由图语家自行发明解析器。
- **决策：** 复用 [AACTools AACProcessors](https://github.com/AACTools/AACProcessors-nodejs) `@willwade/aac-processors@0.2.20` 的 AsTeRICS Grid 浏览器处理器及其最小相对依赖，保留 GPL-3.0 许可证和上游说明；不安装包含 `better-sqlite3`、Excel 等无关能力的完整 npm 包。共享 `astericsGrid.js` 只增加输入上限、语言选择、图片保留与最小 Open Board 文档映射，CBoard 和微信分别复用既有复核/合并、文件选择、图片暂存和回滚链。原上游源码保持不改，另用 Babel 机械生成无可选链/空值合并的 ES2017 副本供两端构建。
- **理由：** AACTools 已沉淀成熟 AAC 格式解析，直接复用比自研 `.grd` 语义更可靠；但把完整多格式工具链装进微信会增加原生依赖、包体和维护面。保留可审计上游切片与机械兼容副本，在“复用成熟实现”和“小程序性能/兼容边界”之间风险最低。
- **证据：** 官方 [AsTeRICS-AAC-Data](https://github.com/asterics/Asterics-AAC-Data) 的 `shower.grd` 经共享转换器真实得到 1 个板面、29 个按钮和 29 张图片。CBoard 导入定向 `3 suites / 18 tests`、全量 `196 suites / 1328 tests / 72 snapshots` 与整站 production build 通过；微信图库导入与入口定向 `16 tests`、全量 `66 files / 297 tests`、7/7 输出质量门、TypeScript、ESLint、`187 app / 29 core` 边界和 production build 通过。微信未压缩主包 1348526 B，backup 分包 645238 B，均低于 1.5 MiB 建议线。
- **生效范围：** CBoard Web 与微信小程序的本机 JSON/OBF/OBZ/GRD 手动导入、共享 AsTeRICS 转换核心及 vendored 上游来源；不改变表达、接收、分词、图文匹配、语音、云同步或 API。当前只接入 AsTeRICS Grid；AACTools 的 Gridset、Snap、TouchChat 等处理器、供应商专用动作、真实大型文件和真机文件交互仍待后续逐格式样本验收。本轮未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 14:34:18。

## 变动 192：复用 AACTools 补齐未加密 Gridset 跨端导入

- **意图：** 继续补齐 issue #30 的其他 AAC 图库迁移能力，让已有 Grid 3 `.gridset` 板面的家庭可在家属维护流程中导入文字、布局和图片，不要求重建图库，也不自行发明 Gridset 解析器。
- **决策：** 复用已 vendored 的 AACTools `@willwade/aac-processors@0.2.20` Gridset 浏览器处理器，由共享 `gridset.js` 施加压缩包、条目、解压总量、页数、按钮数、网格尺寸和图片体积上限，并映射为既有 Open Board 文档。CBoard Web 继续走 Settings 导入复核；微信只在家属 backup 分包的图片库导入页开放 `.gridset/.gridsetx` 文件选择，未加密 `.gridset` 复用现有图片暂存、图库替换和失败回滚，加密 `.gridsetx` 明确拒绝。为避免把未使用的 Node `xml2js/sax/timers/stream` 校验链打入小程序，兼容处理器仅将可选 validator 改为显式注入，正常 `loadIntoTree()` 解析保持上游语义。
- **理由：** AACTools 已实现 Grid 3 ZIP/XML、图片引用和按钮语义，直接复用比自研可靠；但校验器不参与导入，却会破坏微信生产构建并增加包体。把它留为可注入能力，既保留未来服务端完整校验入口，又符合小程序按需打包和主包轻量原则。Gridset 导入属于家属低频图库维护，不进入患者表达页。
- **证据：** 真实 ZIP fixture 覆盖 Grid XML、两格布局、表达文字和 PNG 内嵌图片。CBoard Gridset/Settings 导入回归 `4 suites / 22 tests / 3 snapshots` 通过，完整 `npm run build` 生成 Web 生产包和 `service-worker.js`；微信导入测试 `16/16`、TypeScript、ESLint、`187 app / 29 core` 边界和 production build 通过，构建中不再出现 `timers/stream/xml2js`。未压缩主包 `1,249,564 B`，backup 分包 `881,693 B`，均低于 1.5 MiB 建议线；构建仍报告图片库导入页 JavaScript `435 KiB`，已列为后续低频分包异步化候选。CBoard 本机完整构建还验证了 AJV 8 与 Lodash `4.18.1` 的环境兼容，未把临时安装写入功能依赖或 lockfile。
- **生效范围：** CBoard Web Settings 和微信家属图片库导入中的未加密 Gridset、共享转换核心、上游审计说明及相关测试；不改变患者表达、接收端、分词、图文匹配、语音、云同步、API 或默认图卡。加密 Gridset、供应商专用动态动作、真机文件选择、大型第三方文件、Snap 和 TouchChat 仍待后续逐项实现与验收。本轮未预览、上传、发布、部署、提交或推送；全程后台执行，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-23 23:31:45。

## 变动 193：Snap 与 TouchChat 通过服务端转换接入跨端图库维护

- **意图：** 继续补齐 issue #30 的其他 AAC 图库迁移能力，让 Snap `.sps/.spb` 和 TouchChat `.ce` 用户复用现有板面，而不要求家属重建图库或把服务器原生解析依赖装进微信。
- **决策：** cboard-api 精确复用 `@willwade/aac-processors@0.2.20` 的 Snap/TouchChat 子路径处理器，新增登录后 multipart 转换端点，将不可信源文件以内存方式有界转换为版本化 Open Board 文档。CBoard Web 和微信只上传文件并复用既有审查、合并、图片暂存及回滚；微信入口只在“照护设置 → 图片库维护”backup 分包。CBoard 同时精确固定 `fast-xml-parser@4.5.3`，产物门禁锁定 AAC 端点不得进入主包。
- **理由：** Snap 基于 SQLite、TouchChat 基于 ZIP，完整上游包还包含 `better-sqlite3` 等约 66 个服务端传递依赖，不适合进入浏览器或小程序。服务端薄转换层能最大化复用成熟 parser，同时维持患者/家属边界、包体和旧版 JS 兼容。`fast-xml-parser` 5.10.1 会产出微信门禁拒绝的 `?.`/`??`，4.5.3 保持当前 API 且构建稳定。
- **证据：** 真实 AACTree → Snap/TouchChat 文件 → 上游 parser → Open Board 转换的集成链通过；AAC 聚焦 `13 passing`，API 无数据库控制器单元全量 `337 passing`。Web 聚焦 `4 suites / 64 tests / 3 snapshots` 与隔离目录 production build 通过。微信全量 `67 files / 303 tests`、TypeScript、ESLint、`190 app / 29 core` 边界和 production build/质量门通过；未压缩 main `1,249,564 B`、backup `884,442 B`。上游包 metadata 写 MIT、随包 LICENSE 为 GNU GPL，当前按更保守 GPL-3.0 记录。
- **生效范围：** CBoard Web Settings 与微信家属图片库维护中的 Snap/TouchChat 登录导入、cboard-api 转换服务及构建依赖/分包门禁；不进入患者表达页，不改变表达、接收、分词、匹配或语音。Snap 嵌入 PNG/JPEG 可保留；当前 TouchChat 上游不提取 `Images.c4s` 自定义图片，能力字段和 warning 已明确。加密文件、声音、供应商动作、离线转换和云端源文件保存未实现。原 API 目录集成测试入口会等待旧式数据库资源，已用全量 unit 结果替代；CBoard 默认 `build` 目录仍有 Windows 文件锁，等价独立输出构建已成功。本轮未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-24 00:43:18。

## 变动 194：复用 CBoard 公开图板形成家属侧安全搜索与导入

- **意图：** 在不重造公开图库、不把维护工具放回患者表达页的前提下，让家属复用 CBoard 已有公开图板资源，把需要的板面和图片导入本机图片库。
- **决策：** cboard-api 新增版本化 `cboard-public-board-bundle v1` 只读端点，只遍历公开可达子板并移除所有者邮箱、数据库内部字段和指向私有/不存在子板的链接；CBoard Web 复用同一 bundle 安全复制；微信通过平台无关 port、Taro adapter 和共享转换核心，只在“照护设置 → 图片库维护 → 浏览 CBoard 公开图板”提供按板名/作者搜索、确认和本机导入。重复导入使用稳定 ID 替换同一来源副本，不新增第二套患者表达搜索。
- **理由：** CBoard 已有成熟的公开板浏览、复制、发布和举报体系，复用它比新建图语家图库服务更小、更符合既定底座决策；但旧公开列表包含邮箱，旧递归复制还可能直接读取私有子板，因此必须先建立公开专用、有界且可审查的数据契约。公开可见也不等于图片许可已明确，患者沟通又要求离线可用，所以导入前必须由家属确认许可与远程图片风险。
- **证据：** API helper/route 新增 `6 passing`，控制器单元全量 `343 passing`，Swagger YAML 可解析；Web 共享转换器、容器和 API 客户端共 `48 passing`，整站 production build 成功；微信新增 port/service/page 后全量 `69 files / 308 tests`、TypeScript、ESLint、`197 app / 30 CBoard core` 边界、production build 和输出质量门通过。微信未压缩 main `1,249,620 B`、backup `899,391 B`，均低于 1.5 MiB 建议线；公开 API 标识只存在于 backup 分包。
- **生效范围：** cboard-api 公开板读取边界、CBoard Web 公开板复制、微信家属图片库维护中的公开板浏览/导入，以及共享 BoardDTO/TileDTO 转换；不进入患者表达页，不改变接收端缺词联网找图、默认板、matcher、语音、AI、账号同步或公开发布。公开图库贡献/上传、逐图许可证补全、远程图片自动离线化、真实部署 API、开发者工具性能扫描和真机验收仍未完成。本轮未预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-24 01:32:51。

## 变动 195：公共板图片通过受限代理原子保存到微信本机

- **意图：** 补齐变动 194 明确留下的离线缺口，让公共板在获得家属授权确认后可以成为真正可断网使用的本机图库，同时避免任意 URL 代理、半导入和重复导入文件泄漏。
- **决策：** cboard-api 为公开板真实图卡增加稳定图片端点，只接受配置中的 CBoard Blob/CDN HTTPS 主机，拒绝非 HTTPS、额外端口、URL 凭据、重定向和超限/非图片响应，并复用现有 Sharp 转为有界 PNG。bundle 保留原图 URL，只增加 `offlineImagePath`。微信复用现有 `PictureLibraryArchivePort`：默认最多 200 张、单图 2 MiB、总计 20 MiB，逐图下载、字节签名校验并写入独立恢复目录；全部成功后才替换图库，失败则清理暂存且不改本机数据。家属再次确认后才可仅保留网络链接；重复导入在新图库提交后清理旧且不再引用的本机图片。
- **理由：** 微信动态外链无法全部加入 `downloadFile` 合法域名，开放服务端抓取又会形成 SSRF 与内网访问风险。API 已有 Axios/Sharp 图片安全链，微信已有图库 ZIP 恢复事务；复用这两套成熟实现比新建下载器、缓存表或媒体服务更小。原图 URL 与离线元数据并存，也保证 CBoard Web 忽略新字段后仍按原地址复制。
- **证据：** API 聚焦 `12 passing`、无数据库控制器与 passport 全量 `350 passing`、部署模板通过；CBoard Web 转换 `2 passing`；微信定向 `26 passing`、全量 `69 files / 312 tests`、TypeScript、ESLint、`197 app / 30 core` 边界、production build 和 `7/7` 质量门通过。产物代理字符串只在 backup 分包；main `1,249,620 B`、backup `904,189 B`，均低于 1.5 MiB 建议线。
- **生效范围：** cboard-api 公开板受限图片代理、微信家属“照护设置 → 图片库维护 → 查找公共沟通板”的离线导入/网络回退/重复导入清理，以及 Web bundle 向后兼容；不进入患者表达页，不代理任意外部域名，不改变逐图权利、公开上传、缺词在线补图、默认板、matcher、语音、AI、历史或同步。真实部署、公众平台 API 合法域名、官方性能扫描、预览上传、手机重启和系统断网仍待验收；未提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-25 20:22:07。

## 变动 196：公开板图片代理复用有界缓存与并发合并

- **意图：** 防止公开图片端点在重复导入、并发手机请求或恶意重放时反复下载同一 CDN 图片并执行 Sharp，避免把离线导入能力变成 API 流量、CPU 或内存放大器。
- **决策：** 复用 cboard-api 图符搜索已验证的 Map LRU 与 in-flight promise 模式：相同板 ID、图卡 ID 和当前原图 URL 的并发请求合并；成功 PNG 缓存 5 分钟，最多 100 项且总计不超过 20 MiB，按最近使用淘汰。每次命中前仍重新确认板当前公开、图卡存在、URL 未变且主机仍在白名单；失败不缓存。
- **理由：** HTTP `Cache-Control` 不能约束不守缓存的调用者，也不能合并同一时刻的首次请求。复用项目现有模式比新增 Redis、第三方缓存包或无界 Map 更小；同时限制条目和总字节能真实约束图片内存。
- **证据：** 自动化证明并发只发生一次 HTTP/归一化、TTL 内复用和过期重取；公开板图片/helper/route 聚焦 `13 passing`，API 无数据库控制器与 passport 全量 `351 passing`，Prettier 与目标差分检查通过。
- **生效范围：** 单个 cboard-api 进程内的公开板图片代理；不跨实例共享，不缓存失败，不改变公开权限、主机白名单、Sharp 上限、微信本机缓存或其他 API。真实多实例部署仍需依赖 CDN 与每实例独立有界缓存；未部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-25 20:28:24。

## 变动 197：微信家属公共板搜索完整消费现有分页

- **意图：** 修复“查找公共沟通板”只能显示前 20 条、后续公开板无法被家属找到和导入的问题，同时继续把该能力限制在图片库维护而非患者表达页。
- **决策：** 不新增 API，也不复制搜索逻辑；直接复用既有 `PublicBoardLibraryPort.search({ page, limit })`。微信页保存实际执行过的搜索词和服务端页码，以 20 条为一页加载更多；新搜索替换旧结果，追加页按稳定 board ID 去重并接受服务端最新摘要。追加失败时保留已加载结果，触控按钮最小高度提升至 88rpx 等效尺寸。
- **理由：** cboard-api 已有成熟分页契约，客户端只请求第一页属于接线缺口。复用现有端口比自建无限滚动、客户端全量抓取或新增接口更小，也避免输入框文字在结果加载后被修改而使下一页串入另一组查询。
- **证据：** 新增分页纯 helper 的替换、去重、服务端摘要更新和是否还有下一页测试；公共板端口、分页与原子导入定向 `3 files / 12 tests`，微信全量 `70 files / 315 tests`、TypeScript、ESLint、`199 app / 30 CBoard core` 边界、production build 和 `7/7` 产物质量门通过。未压缩 main `1,249,620 B`、backup `905,024 B`，均低于 1.5 MiB 建议线；既有 ZIP 页面 434 KiB 警告未扩大为分包风险。
- **生效范围：** 微信小程序“照护设置 → 图片库维护 → 查找公共沟通板”的列表分页、搜索状态和按钮尺寸；不改变 cboard-api、CBoard Web、公共 bundle、图片代理、导入事务、患者表达、matcher、语音、AI、上传或公开贡献。未预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-25 20:35:41。

## 变动 198：公开许可图卡可在家属图片库收纳到个人板

- **意图：** 让“跨分类找图”真正成为家属图片库维护工具：家属找到合适的 CBoard、ARASAAC 或 Mulberry 图卡后，可放入自己的常用板，而不是只能替换原图或把维护模块带回患者表达页。
- **决策：** 在 CBoard 中性层新增 `publicPictogramCuration`，复用现有 BoardDTO/TileDTO、个人板识别、图卡追加/移除和公开来源归一化；只允许带公开来源说明、含图片且非导航的图卡复制到 `device_private_board_` 个人板。复制时保留文字、图像、语义提示和来源，明确不复制无独立权利说明的图卡录音；同一来源在同一目标板内去重。微信家属“照护设置 → 图片库维护”复用现有跨分类搜索，增加个人板选择、加入、已收纳列表与移除；无个人板时引导到板块管理。患者表达页继续由契约测试禁止该入口。
- **理由：** 现有微信图库只能把家庭私图加入板面，公共图卡导入后也无法策展到个人常用板，导致“跨分类找图”只有定位和换图，没有维护闭环。CoughDrop 的产品设计证明私有板与可复用许可需要显式区分，但其代码为 AGPL 且技术栈不适合直接搬入 CBoard；Open Board Format 只定义交换格式，不提供可直接复用的发布/策展组件。因此最小、可维护的方案是复用 CBoard 自有纯核心与现有 Taro 页面，仅新增许可边界和薄持久化胶水。
- **证据：** CBoard 策展核心及依赖链 `4 suites / 25 tests` 通过，覆盖公开来源、私图/导航/内置板拒绝、同源去重、布局追加和受控移除；微信新增跨重载持久化与表达匹配集成测试，全量 `71 files / 316 tests`、TypeScript、ESLint、`200 app / 30 CBoard core` 边界、production build 和 `7/7` 输出质量门全部通过。未压缩 main `1,249,620 B`、backup `911,651 B`，均低于 1.5 MiB 建议线；既有图片库导入页 `434 KiB` JavaScript 警告未扩大为分包超线。
- **生效范围：** CBoard 跨端沟通核心，以及微信家属“照护设置 → 图片库维护”的公开图卡收纳、个人板选择和本机持久化；不进入患者表达页，不修改 cboard-api，不公开上传家庭图片，不改变公共板原件、账号同步、分词、matcher、语音、AI 或公开发布。CBoard Web 的同类策展 UI、公开贡献/许可证声明、真实开发者工具性能扫描和真机交互仍待后续；本轮未预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-25 20:56:43。

## 变动 199：复用 Bravo AAC 补齐 TouchChat 自定义图片导入

- **意图：** 补齐 issue #30 中 TouchChat `.ce` 文字和布局可导入、但 `Images.c4s` 家属自定义图片会丢失的真实迁移缺口，同时坚持优先复用成熟开源实现而不是自行反向工程。
- **决策：** cboard-api 保留 `@willwade/aac-processors@0.2.20` 负责板面主解析，并机械适配 [Bravo AAC](https://github.com/OSUBlakester/BravoGCPCopilot) Apache-2.0 实现的 `buttons.symbol_link_id → symbol_links.rid → Images.c4s.symbols.rid` 关联链。只恢复带 PNG/JPEG 文件签名、单图不超过 5 MiB、总图不超过 20 MiB 的嵌入图片；ZIP 不落盘展开，两个 SQLite 数据库各限制 40 MiB并只在系统临时目录短暂只读打开。上游固定到提交 `e23ec815d9e9cd1985441ae1fc2b62467b6562ee`，代码头、中文 NOTICE 与 Apache-2.0 副本保留来源和修改说明。CBoard Web 与微信不改 UI、不新增依赖，自动消费原有登录转换端点返回的 Open Board `images/image_id`。
- **理由：** AACTools Node 的 TouchChat helper 明确仍是空实现；其 Python 可选 symbol helper 未接入主解析器，查询结构也与公开 schema 不一致。Bravo 已有真实 TouchChat 迁移和正确 RID 图片关联，Apache-2.0 与 GPL-3.0 服务端兼容。只移植该服务端薄算法比引入 Bravo 的 Python、FastAPI、Firebase、GCP 和 UI，或把 SQLite 带入 Web/小程序更小、更稳定。
- **证据：** 真实 ZIP + `.c4v` + `Images.c4s` 单元测试覆盖有效 PNG 与不支持载荷；处理器集成测试真实走通 `AACTools TouchChatProcessor → semantic_id → Bravo RID 关联 → Open Board images/image_id`。AAC 聚焦 `12 passing`，cboard-api 无数据库单元全量 `352 passing`，Prettier、Node 语法和直接依赖闭包通过。公开 AACTools `WordPower42 Basic SS_UK.ce` 的 `Images.c4s` 本身没有自定义 `symbols`，且整库超过现有 100 板面安全上限，因此只作为“大型真实文件仍待策略”的反证，不虚报为图片成功样本。
- **生效范围：** cboard-api TouchChat 转换，以及既有 CBoard Web Settings 与微信“照护设置 → 图片库维护”的登录导入；不进入患者表达页，不增加小程序包体，不改变 Snap、JSON、OBF/OBZ、GRD、Gridset、分词、matcher、语音、AI、同步或发布。只支持 `.ce` 内实际嵌入且直接编码为 PNG/JPEG 的自定义图片；TouchChat 商业内置符号库、压缩/专有图片、声音、动态动作、加密文件、超过 100 板面的大型词库、真实部署和真机文件交互仍待后续。本轮未预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5），2026-07-25 21:19:04。

## 变动 200：跨端固化“跨分类找图只属于家属图片库维护”

- **意图：** 防止图库检索、公开图卡收纳和熟悉照片维护重新侵入患者高频表达界面，并确保家属能从设置中的正式入口完成完整维护。
- **决策：** 微信唯一正式路径保持为“照护设置 → 图片库维护”，再由该分包页面提供跨分类找图、熟悉照片替换、图片说明、恢复默认、公开图卡收纳和公共沟通板导入；患者工作区不保留图片库直达入口。CBoard Web 同样把跨分类搜索和公开图卡收纳放在照护者的个人图片管理页，并通过既有 Redux `createBoard`、`updateBoard` 和 `addBoardCommunicator` 保存个人板，不新增专用 API。
- **理由：** 跨分类检索是低频图库维护动作，患者表达页应只保留点选、候选句、播报和接收理解。复用现有图片库页面、公共图卡策展核心、BoardDTO 适配器和 CBoard 原生保存动作，比复制第二套搜索页或维护接口更小，也能保证 Web 与微信共享相同的数据和许可边界。
- **证据：** 微信设置页按钮真实导航到 `/packages/backup/pages/personal-images/index`，图片库页再进入公共板分包；边界测试明确禁止患者工作区出现跨分类找图和图片库路由。微信全量 `71 files / 316 tests`、`7/7` 产物质量门和 production build 通过，未压缩 main `1,249,620 B`、backup `911,651 B`，均低于 1.5 MiB 预警线。CBoard Web 定向 `5 suites / 39 tests`、全量 `200 suites / 1348 tests / 72 snapshots` 通过；标准 `build` 目录受既有 Windows 文件锁影响，隔离输出目录 production build 成功。
- **生效范围：** 微信小程序患者工作区、家属照护设置、backup 图片库分包，以及 CBoard Web 照护者个人图片管理和个人板持久化；不改变分词、图文匹配、语音、缺词联网找图、默认图板、API 数据协议或患者表达数据。本轮未打开、激活、聚焦或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-25 21:47:19。

## 变动 201：真实大型 TouchChat 词库进入跨端有界闭环

- **意图：** 补齐 issue #30 中真实完整 TouchChat 词库超过早期验证阈值而无法导入的缺口，并确保服务端转换成功后不会在 CBoard Web、微信本机保存或图库备份阶段被再次截断。
- **决策：** 不更换已有解析器，也不自行开发 TouchChat parser；继续复用 [AACTools AACProcessors](https://github.com/AACTools/AACProcessors-nodejs) 和既有 Open Board 管线。服务端、共享核心和微信将总量边界统一为最多 `500` 板面、`20000` 按钮/图卡；重复源按钮 ID 按稳定遍历顺序追加后缀，不丢失原网格格位。微信复用原生用户目录同步文件 API，以 A/B 双槽保存图库，保留上一快照、旧 storage 自动迁移和文件失败回退。
- **理由：** [Open Board Format](https://github.com/open-aac/openboardformat) 与 AACTools 没有规定旧 `100/5000` 上限，真实公开词库已经超过该阈值；但取消所有上限会放大不可信 ZIP、SQLite 和图片的资源风险。有限提升总量并保留输入/输出字节、图片、网格和并发边界，比新增数据库、把原生 parser 搬入小程序或放弃大型词库更小、更可维护。
- **证据：** 公开 `WordPower42 Basic SS_UK.ce` 真实解析为 `348` 个板面、`11,953` 个按钮，源树 JSON `14,720,184` 字节；cboard-api 约 `750 ms` 转换为 `348` 份 Open Board 文档、`11,953` 个按钮和 `1,769,593` 字节响应。样本的 `6` 个板面、`31` 个重复按钮 ID 全部稳定消歧且保留格位。API 聚焦 `15 passing`、无数据库单元全量 `355 passing`；CBoard 全量 `200 suites / 1352 tests / 72 snapshots` 与隔离 production build 通过；微信全量 `72 files / 321 tests`、`7/7` 质量门、TypeScript、ESLint、`202 app / 30 core` 边界和 production build 通过，main `1,249,620 B`、backup `913,444 B`。
- **生效范围：** cboard-api Snap/TouchChat 转换、CBoard Web Open Board 接收/图库归档、微信“照护设置 → 图片库维护”的大型图库保存与恢复；不进入患者表达页，不改变分词、图文匹配、语音、AI、云同步或发布。专有/压缩 TouchChat 图片载荷、声音、动态动作、加密文件、真实部署、手机文件选择及双槽异常恢复仍待验收；backup 页 `434 KiB` JavaScript 警告保留为后续性能拆分项。本轮未打开、激活、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 08:45:41。

## 变动 202：微信图库 ZIP 复用 fflate 降低分包并限制解压峰值

- **意图：** 在大型 AAC 词库容量已经放宽后，降低微信图库备份/恢复的脚本体积和一次性解压内存风险，避免“能保存万级图卡”却让低频 backup 分包持续膨胀。
- **决策：** 复用 [fflate 0.8.3](https://github.com/101arrowz/fflate) 与 `base64-js 1.5.1`，替换图语家图库 ZIP 的创建、索引和提取；先检查重复条目、安全路径、条目数及声明原始大小，再以最多 `250` 项、`16 MiB` 一批恢复媒体。JSON 压缩，PNG/JPEG/GIF/WebP/音频按 ZIP STORE 保存。保留 JSZip 作为 Gridset/AACTools 运行依赖和跨实现互操作测试，不把它错误降为开发依赖；也不使用 Taro 在微信端会转成同步 require 的伪动态 import。
- **理由：** fflate 是 MIT、纯 JavaScript、具备 ZIP 读写和原始大小过滤的成熟实现；复用它比自行编写 ZIP/DEFLATE、依赖微信未提供的 ZIP 创建 API或把备份搬到服务端更小。分批恢复不改变原子写入/失败清理语义，又避免一次展开整个大型图库。Gridset 和 CBoard Web 的 ZIP 边界更广，必须单独迁移验证，不能为了本轮包体数字强行联动。
- **证据：** fflate 写出由 JSZip 真实读取，原有 JSZip 测试继续生成、篡改并读取新服务归档；新增路径、条目数、声明大小和二进制/中文测试。微信全量 `73 files / 325 tests`、`7/7` 质量门、TypeScript、ESLint、`204 app / 30 core` 边界、yarn 完整性和 production build 通过。main 保持 `1,249,620 B`；backup 从 `913,444 B` 降至 `832,869 B`，减少 `80,575 B`，`1.5 MiB` 余量增至 `739,995 B`；library 页由 `444,366 B` 降至约 `355 KiB`。
- **生效范围：** 微信 backup 分包中的图库 ZIP、完整本机数据 ZIP、账号私人图库复核恢复和 OBF/OBZ 媒体读取；不改变 manifest、冲突策略、回滚、CBoard Web、API、Gridset/Snap/TouchChat 格式语义、患者表达、matcher、分词、语音或 AI。页面仍有 Webpack `244 KiB` 通用警告，进一步拆分须分离 AAC 导入与备份服务；插件体积、官方性能扫描和真机大型归档耗时仍待验收。本轮未打开、激活、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 09:15:25。

## 变动 203：严格匿名 OpenAAC `.obla` 研究日志跨端共核

- **意图：** 在私密 `.obl` 迁移日志之外提供真正不可逆的研究副本，避免把仅移除姓名、但仍保留患者原文和真实时间的文件错误称为匿名日志。
- **决策：** 继续复用 [OpenAAC Open Board Logging 0.1](https://www.openboardformat.org/logs)，在 CBoard 中性纯核心完成 `id_pseudonymization`、`timestamp_shift`、`timestamp_jitter`、`geolocation_masking`、`net_masking`、`fringe_masking`、`name_masking`、`url_stripping`、`extras_removed` 九项保护；只有全部完成时设置 `anonymized=true`。所有自由文本保守替换为唯一 `:fringe-N` 并标记 `redacted=true`，Web 和微信只复用纯函数与各自文件保存端口。匿名文件不可导回历史，不自动上传或云同步。
- **理由：** 中文自由表达无法依靠词典可靠区分姓名、地址、医院、家庭关系和其他敏感 fringe vocabulary；完整 redaction 虽不保留词汇研究价值，但比未经证明的部分脱敏更符合严格匿名承诺。OpenAAC 官方没有成熟 TypeScript 匿名化 SDK，复用既有 `.obl` builder 后净化比移植 Rails 站点或在两端各写一套正则更小、更可审查。
- **证据：** 测试验证九项声明、伪 ID、首会话平移到 `2000-01-01T00:00:00.000Z`、事件顺序内抖动、全部原文 redaction，以及姓名、地址、医院、家庭、账号 ID、URL 和 `ext_*` 字段不进入结果。CBoard 聚焦 `2 suites / 21 tests`、全量 `200 suites / 1353 tests / 72 snapshots` 和隔离 production build 通过；微信全量 `73 files / 325 tests`、`7/7` 质量门、TypeScript、ESLint、`204 app / 30 core` 边界和 production build 通过。微信 management 分包 `520,390 B`，全部分包低于 `1.5 MiB` 建议线。
- **生效范围：** CBoard Web 与微信小程序照护管理页的本机历史手动导出、共享 Open Board Logging 纯核心和隐私提示；不改变私密 `.obl` 导入导出、普通文本、本机历史、分词、matcher、图卡、语音、AI、账号同步或 API。不包含研究平台上传、云端收集、外部 `.obla` 认证或匿名文件恢复；未预览、上传、发布、部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5.6），2026-07-26 09:46:41。

## 变动 204：公开板复用不冒充公共图符投稿审核

- **意图：** 重新确认 CBoard 已有公开板发布、复制、举报和图片代理是否足以直接完成图语家的公共图符贡献，既避免重复开发，也避免把缺少审核治理的上传能力误写成闭环。
- **决策：** 继续完整复用 CBoard 的公开板发现、bundle、受限图片代理、整板发布/复制和举报，但只定位为公开沟通板复用。当前不新增公共图符投稿 endpoint；只有 OpenSymbols、ARASAAC 或其他可信 AAC 上游提供稳定的投稿/审核/删除 API，或项目明确批准独立 moderation 服务及运营责任后，才增加薄 contribution adapter。本机个人图卡、账号私有 ZIP 与公共贡献保持三个独立动作。
- **理由：** CBoard `isPublic` 是整板可见性，举报只是邮件通知，没有逐图许可确认、待审状态、人工队列、敏感内容拦截、删除申诉和审计。技术上能公开整板不等于可以安全运营患者图片投稿；自行建设 moderation 服务也违背本阶段优先复用成熟开源、减少自研的原则。
- **证据：** 2026-07-26 复核 [OpenSymbols 官方站点](https://www.opensymbols.org/)、[OpenSymbols 官方仓库](https://github.com/open-aac/opensymbols)与 [ARASAAC public-api](https://github.com/Arasaac/public-api)：现有公开能力仍以图库聚合和搜索为主，没有发现可直接复用的第三方投稿、审核、删除和申诉契约。当前 CBoard / cboard-api 代码核对显示 `publishBoard` 只切换公开状态，公开接口只读列表/bundle/图片，`reportPublicBoard` 发送举报邮件。详细证据见 `public-pictogram-contribution-reuse-review.md`。
- **生效范围：** 覆盖矩阵 #10/#19/#65 的公共图库边界及 Web、微信、API 后续架构；不删除公开板浏览/复制/举报、缺词联网候选、公开许可图卡收纳、本机家庭图片或账号私有备份。公共投稿继续标记为有条件延期，不阻塞双向沟通核心；本轮未新增 endpoint、依赖或媒体，未预览、上传、发布、部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5.6），2026-07-26 09:46:41。

## 变动 205：脏工作树中机械复用 CBoard 官方稳定性与安全修复

- **意图：** 在继续补齐图语家跨端能力时避免 fork 错过 CBoard 官方已经修复的同步毒丸、遥测误计数和内部 OAuth 代理鉴权问题，并避免整树同步覆盖当前未提交成果。
- **决策：** 对 CBoard 只适配上游 `cfbe2fa6`、`12dfd155`、`c3d86995` 的板面说明媒体上传和未跟踪遥测行为；对 cboard-api 只适配上游 `53ad78e` 的 `INTERNAL_API_KEY` Bearer 校验。所有修改按当前 fork 文件结构合并并保留图语家的声音、AI、双向沟通及跨端代码，不执行 merge、rebase 或 cherry-pick。`cboard-ai-engine` 的本机认证 API 与 Git HTTPS 当前无法可靠核验，公开页面仍显示仓库存在，因此仅保留本地 fork并等待认证通道恢复，不删除也不虚报已同步。
- **理由：** 这些修复来自当前技术底座维护者，行为和测试均比重新设计更值得复用；但工作树包含大量并行改动，整分支合并的冲突和误覆盖风险明显高于逐项机械适配。AI engine 的公开页面、认证 API 和本机 Git 通道证据互相冲突，不能把认证或凭据失败误判为仓库删除，也不能在未取得 refs 前声称完成同步。
- **证据：** CBoard 目标回归 `2 suites / 63 tests`、全量 `200 suites / 1364 tests / 72 snapshots`、目标 ESLint、差分检查和隔离 production build 通过。cboard-api 新鉴权测试与全部 controller unit tests 共 `357 passing`，Node 语法、Prettier 和差分检查通过。官方 refs 分别解析到完整提交 `cfbe2fa664c2e380f52cdfc28ee2494302e9c218`、`12dfd1550fd94c142cec7930ea225afad89d8e60`、`c3d869952ec0da5e0b26ee29ab3e0e1e12d620cb`、`53ad78e40e3e0d5b4adb1c669514b20d69cd6e7f`。AI engine 公开 GitHub 页面仍显示 `cboard-org/cboard-ai-engine`、189 条提交和 `1.9.0` release；本机 `gh api` 返回 404，`git ls-remote` 则因 `SEC_E_NO_CREDENTIALS` 失败，故状态记为认证通道待恢复而非仓库不存在。
- **生效范围：** CBoard Web/Cordova/Electron 的同步媒体与遥测、cboard-api 内部 OAuth 代理，以及后续 upstream 同步流程；不改变微信小程序包体、患者表达、接收理解、分词、matcher、图卡、语音、账号普通登录或公共图库。生产 API 与 CBuilder 需要共享同一未入库 `INTERNAL_API_KEY`；本轮未提交、推送、预览、上传、发布、部署或生成密钥，全程未打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-26 10:14:24。

## 变动 206：最新双向沟通核心重新进入 CBoard 官方 Windows 与 Android 壳

- **意图：** 消除旧原生包早于后续图语家开发的时间差，证明当前双向沟通、接收记录和最新 CBoard 上游修复并非只存在于 Web 工作树，而是已经进入 CBoard 官方多平台工程。
- **决策：** 不建立 Flutter 或其他第二套客户端；继续复用官方 `ccboard`、Cordova CLI 12、Electron 和 `cordova-android@14.0.1`。以 `PUBLIC_URL=.` 重建当前 CBoard，将同一 `www` 分别打入 Electron 无签名验证包和无 Firebase Android 核心调试包，并核对 source、`www`、ASAR 与 APK 内主 bundle 的 SHA-256、功能标记和插件注册表。
- **理由：** CBoard 作为底座的核心价值正是成熟的 Web、Windows、Android 与 iOS 工程体系。复用同一个已经回归的业务 bundle，比把图语家页面复制到第二套原生代码、只看构建日志或继续沿用旧 APK 更小、更可维护，也能防止平台版本悄悄漂移。
- **证据：** CBoard 标准 production build 成功，`ccboard/www` 为 `3,960 files / 124,905,046 bytes`，包装与 Android 构建脚本 `9/9` 通过。Electron 生成 `82,231,334 bytes` 的便携包、`82,389,908 bytes` 的安装包和含 `4,093` 文件的 ASAR。Android SDK 35、Gradle 8.13、Cordova Android 14 的 50 个任务全部成功，新核心 APK 为 `57,963,244 bytes`，SHA-256 `8BB584A1C1DFBF5C06376E108C63C080645D0B9D134843BFA429C98E94C2BF6C`。四层主 bundle SHA-256 均为 `5951E658D5B68C6E469A0F0270253C3A8260ACC3192FD95AF080D5B1D7EEE4A6`，包内同时含 `communicationSupport`、`receiverRecords`；Android 插件注册表有 `cordova-plugin-speechrecognition`、无 `cordova-plugin-firebasex`。
- **生效范围：** 证明当前 CBoard/图语家 Web 核心已进入 Windows Electron 与 Android Cordova 壳；iOS 共用 Web 包已刷新，但 IPA 仍需 macOS/Xcode/签名。Electron 未签名、Android 核心包无 Firebase，且均未安装、启动、连接真机、提交、推送、上传或发布，不代替真实设备 UI、触控、语音、离线、登录、推送、购买和生命周期验收。本轮仅后台运行 shell、Node、Cordova 和 Gradle，没有打开、激活、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-26 10:47:58。

## 变动 207：图片库迁移后的设备私图官方运行闭环

- **意图：** 证明“跨分类找图与熟悉图片维护只属于家属设置”不只是源码路由约束；入口迁移后，家属仍能选择设备私图，患者端仍能显示，并可从设置恢复 CBoard 默认图。
- **决策：** 官方 Skill E2E 不再调用患者页已删除的图片库按钮，统一走“照护工具 → 照护设置 → 图片库维护”。复用现有 `PersonalImageManager`、微信持久文件端口和 storage repository，不新增第二套图库；为“恢复默认”保留有真实视觉含义的次级按钮样式，并以其固定类作为 Automator 锚点，避免坐标点击、重复 ID 和依赖候选数组下标。
- **理由：** 旧 E2E 的入口已与产品决策冲突；通用主按钮选择器还会误点“打开板块管理”。微信 Automator 对没有 WXSS 规则的附加类无法稳定查询，但按钮、文字和业务状态真实存在。让稳定类同时承担次级操作视觉语义，比加入仅供测试的 DOM 包装或脆弱坐标更小、更可维护。
- **证据：** 后台官方 Skill 完整 PASS：患者表达、接收草稿冷恢复、没明白复核恢复、纠错学习/删除/禁用、人工插图、纠错记忆管理、双向历史、新会话、缺词设备私图、设置内个人图片选择、微信持久文件显示、重建恢复、恢复默认和 17 项原 storage 恢复全部通过。微信全量 `73 files / 325 tests`、`7/7` 输出质量门、TypeScript、ESLint、`204 app / 30 CBoard core` 边界和 production build 通过；main `1,249,620 B`、caregiver `566,763 B`、emergency `94,125 B`、management `520,390 B`、backup `832,965 B`、ocr `64,815 B`，全部低于 1.5 MiB 建议线。
- **生效范围：** 微信小程序家属图片库入口、设备私图选择/持久化/恢复默认和官方 Skill 回归；患者表达页继续不出现跨分类维护入口。不改变 CBoard Web、cboard-api、分词、matcher、语音、AI、公共板或图库格式；真实手机相册权限、横竖屏、断网与官方性能扫描仍需真机验收。本轮未预览、上传、发布、部署、提交或推送，未打开、聚焦、抬升或置顶任何窗口。
- **记录：** Codex（GPT-5.6），2026-07-26 11:55:05。

## 变动 208：AAC 导入从图库备份拆为独立低频分包

- **意图：** 消除大型 AAC 解析器与日常图库备份页面的包体耦合，让患者表达和家属常用维护不为低频 OBF/OBZ/GRD/Gridset/Snap/TouchChat 导入承担加载成本，同时保留已验证的跨格式迁移能力。
- **决策：** 不重写任何 AAC parser，也不采用 Taro 会编译为同步 `require` 的伪动态导入；机械复用现有 CBoard Open Board、AsTeRICS、Gridset、AACTools、fflate、base64-js、微信文件端口和服务端转换端点，将 `importOpenBoard` 及其页面依赖移动到 `packages/aac-import` 独立分包。原 `packages/backup` 页面只保留“打开 AAC 沟通板导入”的家属入口；患者表达与接收页不出现该路由。生产门新增四类页面产物、端点唯一归属和静态媒体零嵌入检查。
- **理由：** 前一轮已证明 backup 的主要剩余体积来自低频 AAC 解析链；继续压缩或自写 ZIP/parser 会扩大兼容和安全风险，动态 import 在微信端也不能形成真实运行隔离。使用微信原生分包边界既符合官方性能建议，也保持既有纯核心和成熟开源转换器为唯一实现。
- **证据：** OBF/OBZ、AsTeRICS、Gridset、Snap/TouchChat 及无效/加密输入定向回归与分包放置共 `2 files / 19 tests` 通过；微信全量 `74 files / 327 tests`、输出质量 `7/7`、TypeScript、ESLint、`209 app / 30 CBoard core` 边界和 production build 全部通过。构建产物证明 `/communication/aac-import/convert` 只在 AAC 分包；main `1,249,738 B`，backup 由变动 207 的 `832,965 B` 降为 `538,430 B`，独立 AAC 分包 `624,052 B`，其余 caregiver `566,763 B`、emergency `94,125 B`、management `520,390 B`、ocr `64,815 B`，全部低于 `1.5 MiB` 建议线和 `2 MiB` 上限。
- **生效范围：** 微信“照护设置 → 图片库维护 → 本机数据工具 → 导入 AAC 沟通板”的路由、构建分包和性能门；不改变导入格式、冲突策略、图片/声音恢复、500 板/20000 图卡边界、CBoard Web、cboard-api、患者表达、接收理解、分词、matcher、语音、AI 或云同步。AAC 页面仍有约 `295 KiB` 的 Webpack 通用单文件建议，但独立分包仅 `624,052 B`，不构成微信单包违规；开发者工具运行导航、真实手机文件选择、大型词库耗时和官方性能扫描尚未复测。本轮未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 15:17:22。

## 变动 209：微信个人图卡直接录制专属声音闭环

- **意图：** 补齐“完整备份能迁移已有图卡声音，但微信创建/编辑个人图卡时不能直接录制”的本机功能缺口，让患者熟悉的家属声音可成为图卡播报内容，并在录音不可用时安全回退文字朗读。
- **决策：** 不新增录音 SDK、音频播放器或声音 schema；复用微信原生 `RecorderManager`、既有方言录音的 16 kHz 单声道 MP3 参数、CBoard `TileDTO.sound`、共享 `expressionPlayback` 混合帧、微信持久文件清理端口和 `PictureLibraryArchive v1` 声音迁移。录音最长 30 秒、单文件最多 5 MiB；创建/编辑页提供录制/停止、试听、替换和清除。候选录音只有图卡保存成功后才成为正式引用；取消、替换、删除、卸载和晚到回调都会清理草稿，原录音只在替换/清除成功提交后删除。运行按钮使用稳定 ID，便于后续官方 Skill 在不依赖坐标的情况下验收。
- **理由：** CBoard 和当前微信端已经有声音字段、混合播放、录音器、持久文件与 ZIP 恢复能力，缺少的只是家属编辑器装配和文件事务。复用这些成熟边界比引入第三方录音库、自建音频数据库或复制第二套播放器更小，也能保证个性录音失败不会阻断核心沟通。
- **证据：** 录音端口、草稿注册表、个人图卡 DTO、混合播报和放置边界定向 `5 files / 19 tests` 通过；全量 `75 files / 329 tests`、输出质量 `7/7`、TypeScript、ESLint、`210 app / 30 CBoard core` 边界和 production build 全部通过。产物 `packages/backup/pages/personal-images/index.js` 含录制/试听/清除三个稳定 ID、`getRecorderManager`、持久保存、删除清理和文字回退。未压缩 main `1,249,738 B`、backup `538,649 B`、AAC `624,052 B`，所有包仍低于 `1.5 MiB` 建议线和 `2 MiB` 上限。
- **生效范围：** 微信“照护设置 → 图片库维护 → 创建/编辑个人图卡”的本机录音、试听、替换、清除、删除、表达混播和完整 ZIP 迁移；不上传录音到普通 Settings/历史/公共板，不改变 Web TileEditor、方言 ASR、WechatSI、候选句 TTS、默认 CBoard 图卡或 cboard-api。开发者工具录音权限、真实麦克风、重启恢复、30 秒自动停止、混合播放听感和跨手机 ZIP 恢复仍需运行/真机验收；本轮未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 15:24:34。

## 变动 210：CBoard Web 与 Cordova 图卡录音复用原生能力

- **意图：** 补齐 CBoard Web 的图卡录音虽然已有界面和 `TileDTO.sound`，但打包后的 Android/iOS 仍只依赖 WebView `MediaRecorder`、没有消费已安装 Cordova Media 插件，且 iOS 缺少必需麦克风用途声明的跨平台缺口。
- **决策：** 保留 `TileEditor → VoiceRecorder → TileDTO.sound → 既有媒体上传/混合播放` 主链不变，只增加薄 `voiceRecordingAdapter`。普通浏览器和 Electron 继续复用标准 `getUserMedia + MediaRecorder`；Android/iOS 优先复用 ccboard 已安装的 Apache Cordova `cordova-plugin-media@7.0.0` 与 `cordova-plugin-file`，分别录制 AAC/M4A 到私有 cache，读成现有 data URL 后立即删除临时文件。录音统一最长 30 秒，开始期间禁止重复触发，停止幂等；停止、错误、清除、替换、播放结束和组件卸载都会释放麦克风、播放器、原生 Media 对象及临时文件。iOS 外壳新增 `NSMicrophoneUsageDescription`，错误提示进入中英文翻译。
- **理由：** 官方 CBoard 已有成熟 Tile 编辑、声音字段、上传和播放能力，ccboard 也已经携带原生 Media/File 插件；真实缺口只是平台选择和资源生命周期。复用这些现成代码比新增录音 SDK、自建原生桥、复制微信 `RecorderManager` 或改变 BoardDTO/TileDTO 更小，也避免“浏览器测试通过”被错误当成 Android/iOS 真机录音已经可靠。
- **证据：** 本机 upstream `430303dcf693d69849d6f1e758f6fe9734b6bae7` 的 `VoiceRecorder` 与当前 fork 一致，确认没有已有 Cordova adapter 可机械同步。浏览器录音、Android/iOS 选择、平台格式/路径、Cordova 原生录音、文件读取与删除定向回归连同 TileEditor、混合播放和翻译共 `5 suites / 22 tests / 3 snapshots` 通过；目标 ESLint 无告警，CBoard production build 成功且产物包含 `cboard-voice-` 原生适配代码。ccboard 配置/包装测试 `10/10` 通过，确认 Android `RECORD_AUDIO`、iOS `NSMicrophoneUsageDescription` 和 `cordova-plugin-media@7.0.0` 均保留。整站仅继续报告既有 AAC vendor ESLint 与 bundle 体积警告，本轮文件没有新增构建警告。
- **生效范围：** CBoard Web/Electron 的浏览器录音、官方 ccboard Android/iOS 的个人图卡录音，以及原有图卡声音上传、试听、清除和表达混播；不改变微信 `RecorderManager` 实现、TileDTO/BoardDTO、默认图卡、分词、matcher、语音识别、TTS、账号、同步或 cboard-api。Android/iOS 物理设备权限弹窗、后台切换、30 秒自动停止、录音格式播放和重启后云端声音仍需真机/签名包验收；iOS 仍需 macOS/Xcode。未安装或启动原生包，未打开、激活、聚焦、抬升或置顶任何窗口，未提交、推送、部署、预览、上传或发布。
- **记录：** Codex（GPT-5），2026-07-26 15:46:18。

## 变动 211：Android 核心调试包固化原生录音构建门

- **意图：** 把“配置文件声明了录音插件”推进到“最终 Android APK 确实包含录音实现、语音识别和麦克风权限”的可重复构建证据，避免只凭 Web 测试或 Cordova 中间日志判断原生能力已经进入安装包。
- **决策：** 继续复用 ccboard 既有隔离 Android 构建器、Apache Cordova Media/File、CBoard 本地语音识别插件、Cordova Android 14.0.1 和本机已有 Android SDK/JDK/Gradle；不新增原生框架或第二套打包工程。核心包注册表现在必须同时包含 `cordova-plugin-media` 与 `cordova-plugin-speechrecognition`，并继续拒绝 `cordova-plugin-firebasex`；构建报告新增 `mediaRecordingIncluded`，失败即停止产出。Web 资源以 `PUBLIC_URL=.` 重新打包后再进入临时 Cordova 工程。
- **理由：** `package.json`、`config.xml` 和单元测试只能证明意图，不能证明 Cordova 插件解析、Manifest 合并、Web 产物复制和 Gradle 装配后的最终 APK。沿用现有隔离构建脚本并增加机器断言，比维护手工检查清单、自建 Android 工程或把 Firebase 生产依赖带进核心验证包更可靠，也不会污染源仓库的 `platforms/`、`plugins/` 和 lockfile。
- **证据：** CBoard 全量 `201 suites / 1368 tests / 72 snapshots` 及 production build 通过；按 Cordova 相对路径重新包装 `3960 files / 124,925,656 B`。ccboard 全量 `10/10` 测试通过。真实 Android debug APK 为 `57,970,464 B`，SHA-256 `801859632c5303698171a41bf6d7b1ec5a35e1100c411b661d79c3f32f479764`；最终 `cordova_plugins.js` 含 Media 与本地语音识别且不含 Firebase，最终主 JS 含 `cboard-voice-` 适配标记与录音错误翻译键，二进制 Manifest 的包名为 `com.unicef.cboard` 并包含 `android.permission.RECORD_AUDIO`。
- **生效范围：** ccboard Android 核心调试构建、构建报告和后续原生录音回归门；不改变 CBoard 业务语义、TileDTO/BoardDTO、iOS 构建、微信 `RecorderManager`、生产签名、Firebase 生产版、账号、同步、AI 或支付。APK 尚未安装到物理 Android 设备，权限弹窗、录音格式播放、后台切换、30 秒自动停止和重启恢复仍需真机验收；iOS 仍需 macOS/Xcode。未打开、激活、聚焦、抬升或置顶窗口，未提交、推送、部署、预览、上传或发布。
- **记录：** Codex（GPT-5），2026-07-26 16:18:12。

## 变动 212：Global Symbols v2 服务端复用进入 Web 与微信缺词闭环

- **意图：** 避免 CBoard 原有 Global Symbols v1 直接搜索在官方停用 v1 后失效，同时让图语家的“缺词联网找图”获得第二个带完整许可证的成熟 AAC 图源，而不是自行建设图库或抓取未知图片。
- **决策：** 复用 [Global Symbols 官方 v2 API](https://globalsymbols.com/developer?locale=en) 和 cboard-api 现有图片规范化核心。`GLOBALSYMBOLS_API_KEY` 只保留在服务端；cboard-api 以 v2 搜索、校验 `globalsymbols.com` HTTPS 图片、生成 HMAC 代理令牌并统一转为 300 px PNG。Web 图卡编辑器先请求新 API，可信相对地址解析到 API 同源绝对地址，选择后把图集、作者和许可证归因写入图卡；旧 API 部署或未配置 v2 key 时，只有 Web 编辑器临时回退官方 v1，患者缺词运行时不会用缺少归因的 v1 结果。微信继续复用既有 `/pictograms/search`、同源下载端口和 CBoard 纯归因核心，无第二套 SDK 或 UI。
- **理由：** Global Symbols 官方明确提示 v1 即将停止且 v2 所有请求需要 API key；把 key 放进 Web/Cordova/小程序会泄漏。复用 cboard-api 的白名单、图片边界、PNG 转换和微信同源下载契约，比三端分别升级、信任第三方 SVG 或自行实现图源更小、更安全。ARASAAC 审核索引仍优先，Global Symbols 仅在 ARASAAC 中英文均未命中后使用，OpenSymbols继续作为下一层降级。
- **证据：** cboard-api 聚焦 `33 passing`，全部 `*.unit.js` 为 `365 passing`；真实 Swagger 路由覆盖 v2 搜索与签名图片，测试证明 API key/签名 secret 不进入响应、恶意主机和伪造令牌被拒绝、SVG 被转为 `300 x 200` PNG。CBoard Web 聚焦 `4 suites / 70 tests / 3 snapshots`，全量 `201 suites / 1373 tests / 72 snapshots` 与 production build 通过；主 JS gzip 本轮约增加 `182 B`。微信复用验证 `3 files / 10 tests`，全量 `75 files / 329 tests`、`7/7` 质量门、TypeScript、ESLint、`210 app / 30 core` 边界和 production build 通过；生成数据为 `44 boards / 825 tiles / 775 images`，未压缩 main `1,249,738 B`，所有分包均低于 `1.5 MiB` 建议线。cboard-api 混合旧集成测试在未启动 Mongo/邮件/定位服务时为 `364 passing / 41 environment failures` 并超时，不能用作本轮回归结论。
- **生效范围：** CBoard Web 图卡编辑器 Global Symbols 搜索与图卡归因、cboard-api 公共搜索/签名图片代理、微信缺词候选服务端降级，以及共用 Web bundle 的 Electron/Cordova。生产仍需申请 `GLOBALSYMBOLS_API_KEY` 并配置独立 `PICTOGRAM_IMAGE_PROXY_SECRET`；未配置时不影响 ARASAAC、OpenSymbols、本地图板、手工编辑、语音、分词或双向沟通。尚未证明真实 v2 key、公网 HTTPS、微信合法域名、真机下载、官方性能扫描或 v1 实际停用后的生产行为。本轮未打开或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 17:10:26。

## 变动 213：CBoard 外部图符候选在选择前显示授权归因

- **意图：** 让家属在把 Global Symbols 等外部候选写入图卡之前就能看见图集、作者和许可，而不是保存之后才从图卡元数据追溯来源。
- **决策：** 复用共享纯核心 `formatPictogramAttribution`，只为携带完整 `PictogramAttribution` 的候选显示两行紧凑归因；现有 100px 候选格内以 flex 分配图片和说明空间，无归因的 CBoard、ARASAAC、Mulberry 与旧服务器候选保持原布局。候选选择后仍沿用既有 `SymbolSearch → TileEditor → TileDTO` 写回，不新增许可模型或依赖。
- **理由：** 外部图库许可属于家属选图时的知情信息，仅在保存后持久化不够；共享 formatter 已经在接收展示和分享链路使用，直接复用比在搜索组件里复制字符串拼接更一致。只根据有效元数据呈现也避免为旧 Global Symbols v1 结果伪造作者或许可。
- **证据：** `SymbolSearch.component.test.js` 新增“有完整归因时选择前可见、无归因候选不预留空间”回归，并继续验证选择后完整归因传入 TileEditor；与归因纯核心合计 `2 suites / 10 tests / 1 snapshot` 通过。CBoard production build 通过，主 JS gzip 仅增加约 `42 B`、CSS 增加约 `96 B`，未引入新依赖；构建只保留既有 AAC vendor 与历史大包警告。
- **生效范围：** CBoard Web 图卡编辑器的外部图符搜索候选，以及复用同一 Web bundle 的 Electron/Cordova；微信缺词队列已经有独立归因展示，本变动不复制到 Taro。不会改变搜索顺序、匹配、分词、默认板、图片代理、语音、AI、账号或同步；未打开或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 17:23:38。

## 变动 214：CBoard AI Engine 迁移 Global Symbols v2 并恢复真实许可图片

- **意图：** 消除 `cboard-api` 已迁移 v2、但官方 `cboard-ai-engine@1.9.0` 仍默认调用即将停用 v1 的版本漂移，并修复其 Core Board 长期禁用图片和把所有 Global Symbols 图硬编码为错误 `CC BY-NC-SA` 的问题。
- **决策：** 继续复用官方 `cboard-ai-engine`、ARASAAC/Global Symbols adapter、Open Board Format 和 `tsx/tsup` 工具链；默认搜索地址改为 `/api/v2/labels/search`，由服务端 `globalSymbolsApiKey` 通过 `X-Api-Key` 发送，且只允许 Global Symbols HTTPS 主机。显式 v1 URL保留临时兼容但不伪造归因。建议结果携带真实 `symbolset.licence/publisher`，OBF 图片写真实许可、作者与来源；Core Board 恢复官方 `getImages`，按原词而非数组下标绑定图片，缺图不使后续按钮错位，重复图片去重，最多四个上游请求并发。
- **理由：** CBoard 官方引擎已经具备词语建议、图源和 OBF 主体，修复其失效接口与注释掉的图片链比在图语家另写 AI board builder 更符合完整复用。许可不能凭 provider 名猜测；普通动画贴纸库虽有 API，但不具备 AAC 语义、逐图可审计许可和患者可理解性，不能替代 AAC 图符。Global Symbols v2 当前公开文档也只证明读取 API，未证明公共投稿/审核契约，因此不新增投稿端点。
- **证据：** 官方 [Global Symbols Developer](https://globalsymbols.com/developer?locale=en) 明确 v1 即将停用、v2 需要 API key并限流 100 次/分钟；[cboard-ai-engine 官方仓库](https://github.com/cboard-org/cboard-ai-engine) 的 `1.9.0` README仍写 v1。新增 6 项无网络测试覆盖 v2 key、v1 兼容、恶意 API/图片主机拒绝、真实建议归因、真实 OBF 许可、有界并发与缺图不偏移；`npm run typecheck`、`npm test`、`npm run build`、差分检查全部通过，生成 CJS `38.26 KB`、ESM `36.60 KB` 和 DTS `1.90 KB`，测试假密钥未进入产物。
- **生效范围：** `cboard-ai-engine` 的 Global Symbols 建议、Core Board OBF 图片及未来 CBuilder/cboard-api 服务端消费者；不把 key 下发 CBoard Web、微信、Cordova 或 Electron，不改变当前双向沟通 matcher、缺词队列、默认板、语音、账号或同步。真实 v2 key、实际 AI provider、生成板视觉质量、100 图请求耗时和 CBuilder 集成仍需部署环境验收；公共投稿、动画图符继续不冒充完成。已有 `package-lock.json` 脏改动保持原样，本轮未提交、推送、部署、预览、上传或发布，也未打开或置顶窗口。
- **记录：** Codex（GPT-5），2026-07-26 17:38:30。

## 变动 215：AI Engine 保持服务端库边界，不伪造用户建板入口

- **意图：** 在 AI Engine 修复完成后验证它能否直接进入 CBoard Web / cboard-api 用户链，区分“库已经可构建”和“照护者已经可以安全生成并审核沟通板”。
- **决策：** 当前不添加本机相对依赖、未发布 tarball、浏览器 AI SDK或复制版建板实现。双向沟通继续复用 cboard-api 现有认证、速率限制、Token 月额度、用量账本和 `/gpt/communication/*` 能力；板迁移继续复用 CBoard OBF/OBZ 导入复核。AI Engine 修复版保持独立服务端库，待形成稳定可安装制品或公开 CBuilder 契约后，只增加“生成草稿 → 现有导入复核”的薄 adapter，禁止直接覆盖患者板。
- **理由：** 主题整板生成不是图语家 PRD 的患者选图成句、照护者文字转图片、缺词建议和人工纠错核心；当前官方 `cboard-ai-engine@1.9.0` 不含本轮未发布修复，公开组织也没有可复用的 CBuilder 应用源码或建板 API。本地 `file:` 依赖不可部署，浏览器调用会泄露密钥，复制代码会制造第二套引擎；新端点若绕过配额和导入审核也不具备生产边界。
- **证据：** 源码审计确认 cboard-api 已有 AI provider、用量/额度/限流和通信 AI 路由，CBoard Web 已有 OBF/OBZ 冲突复核与确认导入，两者均未直接依赖 AI Engine；GitHub 官方组织只公开 `cbuilder-landing`，未找到 CBuilder 源码。AI Engine 本地修复仍有 6 项测试、typecheck 和 CJS/ESM/DTS 构建证据，但尚未发布或部署，故不声称用户可见建板已完成。
- **生效范围：** AI Engine、cboard-api、CBoard Web 与未来 CBuilder 的依赖和部署边界；现有候选句、AI 重分词、OCR、图卡建议、Global Symbols v2、缺词联网搜索、本地模板和人工图库维护保持不变。本变动只更新决策与覆盖证据，不新增代码依赖、路由、UI、lockfile、密钥、部署、提交、推送、预览、上传或发布，也未打开或置顶窗口。
- **记录：** Codex（GPT-5.6），2026-07-26 17:58:16。

## 变动 216：最新版微信开发者工具后台核心 E2E 复验通过

- **意图：** 在微信开发者工具更新核验后，证明当前小程序源码仍能在真实微信运行时完成核心双向沟通和本机恢复，而不是只沿用旧版本工具或单元测试的历史结论。
- **决策：** 复用既有 `weapp-skill-smoke.mjs` 和官方 WeChat IDE Skill，以默认 background-only 模式连接用户已打开的项目；禁止自动开窗、清缓存、重开项目、预览或上传。测试前逐项快照全部 storage，在隔离键中执行核心流程，finally 恢复原值和测试媒体。
- **理由：** 开发者工具升级可能改变编译、WXML 事件、微信文件系统或自动化协议；只验证 `wechatide --help` 不能证明业务页面仍可用。复用既有运行门比新写一套坐标脚本更可靠，也不会让验收污染用户数据或打断前台窗口。
- **证据：** 本机与官方最新 Nightly 均为 `2.02.2607252`，Skill `0.3.4`、登录有效。`yarn test:e2e:weapp` 在约 349 秒后 PASS，真实覆盖患者表达、接收草稿冷恢复、“没明白”复核恢复、换图学习、删除墓碑、关闭学习、人工后加图片及审计、纠错记忆管理、同会话双向历史、新对话保留历史、缺词设备私图、家属图片库个人图、微信持久文件恢复默认，并完整恢复测试前 19 项 storage。首次两分钟命令门限短于脚本后台重连最坏等待而超时，没有残余测试进程；按脚本完整等待上限重试后正常完成。
- **生效范围：** 当前 `cboard-wechat-poc` 在最新版微信开发者工具模拟器中的核心交互、storage 与微信文件生命周期运行证据；不代表物理手机横竖屏、系统断网、相册/相机、麦克风、个人图卡录音、真实公网 API、Global Symbols/OpenSymbols、付费供应商或官方性能扫描已通过。未修改业务代码、未打开或置顶窗口、未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 18:10:40。

## 变动 217：独立 AAC 导入分包进入最新版微信运行门

- **意图：** 把变动 208 的“源码、测试、产物和包体已拆分”推进到真实微信模拟器页面闭环，避免独立分包只有构建证据、却无法从家属设置进入或返回。
- **决策：** 继续复用现有官方 Skill E2E、稳定元素 ID 和 background-only 安全默认；从患者页进入“照护设置 → 图库备份与恢复 → AAC 沟通板导入”，验证独立分包、开放标准/AACTools 说明、默认“导入文件优先”、切换“本机内容优先”、两种策略互斥、恢复默认策略及返回图库备份。运行门不调起原生文件选择器，不构造第二套 AAC fixture，也不改变图库数据。
- **理由：** Taro 分包声明和构建产物不能证明微信导航栈、页面事件、样式状态和返回生命周期真实可用；复用既有路由和稳定 ID 比坐标点击或复制 parser 测试更可靠。原生文件选择、真实大文件解析和服务端 Snap/TouchChat 仍依赖手机权限、样本及部署环境，不能由模拟器导航冒充。
- **证据：** `scripts/weapp-skill-smoke.mjs` 增加 AAC 页面导航与冲突策略断言，`node --check`、目标 `git diff --check` 和现有 `yarn lint` 通过。最新版开发者工具 `2.02.2607252` 中完整 background-only E2E 用时约 371 秒并 PASS，新增日志明确到达 `verifying the independent AAC import package navigation`，与患者表达、接收复核、纠错记忆、个人图片等既有流程共同完成；测试前 19 项 storage 全部恢复。
- **生效范围：** 微信“照护设置 → 图库备份 → 独立 AAC 导入分包”的模拟器导航、策略 UI、返回路径和后台自动化门；不改变 OBF/OBZ/GRD/Gridset/Snap/TouchChat parser、冲突语义、板数据、图片、语音、API 或生产包。真实文件选择、导入进度、500 板/20000 图卡、大型文件耗时、Snap/TouchChat 登录 API、物理手机与官方性能扫描仍需后续验收。未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 18:21:31。

## 变动 218：微信复用真实 Open Board 导入链完成单文件闭环

- **意图：** 补齐变动 217 只证明独立分包导航、没有证明家属选择标准板后能够真实解析和保存的证据缺口，同时保护开发者工具内已有个人图库不被 E2E 覆盖。
- **决策：** 不新增小程序 parser 或测试专用业务分支，继续复用 `AacImportPage → taroPictureLibraryArchivePort → createOpenBoardImportService → importOpenBoardDocuments → taroPictureLibraryStore`。E2E 在微信沙箱写入最小 OBF fixture，只 mock `showModal` 和 `chooseMessageFile` 两个系统交互边界；产品代码负责真实读取、校验、解析、合并和轮换文件落库。运行前快照两槽图库文件与活动槽位，运行后验证导入 DTO 并恢复、深度比对原文件和全部 storage。
- **理由：** 原生文件选择窗口不适合无置顶、无坐标的后台自动化，而单元测试 mock archive port 又不足以证明 Taro 页面和微信文件系统协作。把 mock 限制在微信原生选择边界，能够最大限度复用产品实现，并把“导入成功”建立在真实落库而非页面文案上。
- **证据：** 新增固定 OBF 板名“图语家 OBF 运行验收板”和图卡“我要喝水”；`node --check`、差分检查通过。最新版微信开发者工具 `2.02.2607252` 中 `yarn test:e2e:weapp` 用时约 384 秒并 PASS，页面返回“已导入 1 个 OBF 沟通板、1 张图卡”，再从当前活动 `boards-a/b.json` 读回同一板、单图卡标签和朗读文字；finally 恢复原图库文件并深度相等，19 项原 storage 全部恢复，既有双向沟通、纠错、缺词和个人图片流程继续通过。
- **生效范围：** `cboard-wechat-poc` 的无媒体单 OBF 文件在模拟器中的确认、读取、Open Board 转换、冲突合并、持久化、提示与恢复安全门；不代表原生文件选择器、OBZ/GRD/Gridset、媒体解包、大型文件性能、Snap/TouchChat 服务端转换、物理手机或官方性能扫描已经通过。没有修改业务代码、依赖或 lockfile，未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 18:38:40。

## 变动 219：微信标准板内嵌 PNG 进入真实文件运行门

- **意图：** 在单 OBF 文字板导入通过后，补证标准板图片字节能够经现有共享转换器写入微信私有文件并由 BoardDTO 引用，直接覆盖此前真机“有词无图”类风险。
- **决策：** 不新增图像转换器，继续复用 Open Board `image.data` 解码、现有 PNG 类型检测、`createRestoreSession/writeAsset` 与 `taroPictureLibraryStore`。运行 fixture 只增加一张有效 PNG；E2E 要求导入 Tile 图片落在 `USER_DATA_PATH/picture-library/<随机会话>/images/open-board`，通过微信文件系统 `stat` 确认非空，并在恢复图库前精确删除本次随机会话目录。开发者工具 `http://usr` 与真机 `wxfile://usr` 只在受限 USER_DATA_PATH 规则内等价。
- **理由：** parser 单测、`.png` 后缀和成功提示都不能证明微信最终持有可读取字节；直接允许任意 `http://` 又会掩盖公网 URL 或安全错误。复用产品图片链并验证本机根、文件大小和清理结果，是比复制 parser 或人工观察缩略图更强且可重复的证据。
- **证据：** 首轮运行发现真实导入路径被开发者工具映射成 `http://usr/...`，过严的 `^wxfile://` 测试失败，但 finally 已恢复原图库和 19 项 storage，证明清理门有效。收紧为两种 USER_DATA_PATH 内部映射后，最新版开发者工具 `2.02.2607252` 中完整 `yarn test:e2e:weapp` 用时约 404 秒并 PASS；导入 PNG 文件存在且大小大于零，随机资产目录删除，原 `boards-a/b.json` 深度恢复，19 项原 storage 全部恢复，既有双向沟通流程无回归。
- **生效范围：** `cboard-wechat-poc` 单 OBF 的内嵌 PNG 解码、微信私有文件落库、Tile 引用及无损清理；不外推到 SVG/WebP、OBZ/GRD/Gridset 多媒体、声音、20 MiB 边界、大规模导入、原生文件选择、Snap/TouchChat、物理手机或官方性能扫描。没有修改业务代码、依赖或 lockfile，未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 18:58:15。

## 变动 220：OBZ 多板媒体与跨板导航进入微信真实运行门

- **意图：** 将开放标准迁移从单 OBF 板提升到真实常见的多板归档，证明图片、图卡专属声音和板间导航不会在迁移到微信后丢失。
- **决策：** 继续复用项目已有 `jszip@3.10.1`、`scanZipArchive/readZipEntries`、Open Board 多文档转换、PNG/WAV 检测、恢复会话和 `loadBoardId` 重写，不增加第二套归档解析。E2E fixture 沿用现有单测的首页/子板结构，媒体升级为有效 PNG 与标准 8 kHz 单声道 WAV；通过产品页选择后验证 2 板、3 图卡、朗读、导航、两个真实本机媒体文件和同一随机资产根，再恢复图库与 storage。
- **理由：** ZIP 中相对路径、多个 OBF 文档、资源解包和跨板引用只有 OBZ 才能共同覆盖；单板通过不能支撑“完整 AAC 板迁移”的结论。复用已有转换和 fixture 结构比引入新 AAC SDK、自行解释供应商格式或只断言成功文案更可靠。
- **证据：** 首轮运行暴露 E2E 辅助函数只认 OBF 板名，产品导入本身已完成；finally 成功恢复原图库和 19 项 storage，随后精确清除唯一测试随机目录并复查为空。辅助函数支持 OBF/OBZ 后，最新版开发者工具 `2.02.2607252` 中完整 `yarn test:e2e:weapp` 用时约 455 秒并 PASS：页面报告 2 个 OBF 板、3 张图卡，首页“更多”指向导入子板，“水”保留“我要喝水”朗读，PNG 与 WAV 文件存在且非空，WAV 大于标准 44 字节头；结束后双槽图库深度恢复、19 项 storage 恢复且 `picture-library` 无残留目录。
- **生效范围：** `cboard-wechat-poc` 的中小型 OBZ 多板、PNG、WAV、跨板导航、合并和本机媒体生命周期；不代表大型归档、循环/缺失路径、所有音频编码、供应商动作、真机播放听感、GRD/Gridset/Snap/TouchChat 或官方性能扫描全部通过。没有修改业务代码、依赖或 lockfile，未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 19:20:08。

## 变动 221：OBF、OBZ、GRD 与 Gridset 本地迁移形成统一微信运行门

- **意图：** 完整证明当前无需后端的四类 AAC 导入格式在微信真实运行时均能保留关键沟通语义，而不是把一个 OBF fixture 的成功外推到所有转换器。
- **决策：** 继续复用现有 Open Board、AACTools AsTeRICS/Gridset 转换器、JSZip、媒体检测和轮换存储；新增的只是共享 E2E 编排 helper，统一执行 fixture 写入、微信选择器边界、产品导入、随机媒体根清理与双槽恢复。GRD fixture 保留两板导航、中文标签、自定义朗读和图片；Gridset fixture 保留 XML 行列、两格顺序、插入文字和图片。
- **理由：** OBF/OBZ、GRD 和 Gridset 分别经过不同解析路径，只有同一微信页面上的逐格式真实落库才能证明平台 adapter、转换器和 storage 一起工作。共享安全 helper 比复制四套 finally 或另建测试专用 parser 更可维护，也降低遗漏用户数据恢复的风险。
- **证据：** 扩展脚本 `node --check` 通过；最新版微信开发者工具 `2.02.2607252` 的完整 `yarn test:e2e:weapp` 用时约 426 秒并 PASS，依次导入单 OBF、带 PNG/WAV/导航的 OBZ、带 PNG/导航的两板 GRD、带 1×2 布局和 PNG 的 Gridset。每轮从活动图库文件验证 DTO 与媒体，最终双槽图库和 19 项 storage 恢复，后台只读 `picture-library` 返回空数组；既有患者表达、接收复核、纠错、缺词和个人图片链同时通过。
- **生效范围：** `cboard-wechat-poc` 的 OBF、OBZ、AsTeRICS GRD、未加密 Gridset 本地导入运行证据；不代表加密 Gridset、Snap/TouchChat 服务端转换、20 MiB/500 板/20000 图卡极限、供应商专有动作、原生文件选择、物理手机或官方性能扫描完成。没有修改业务代码、依赖或 lockfile，未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 19:31:15。

## 变动 222：Snap 与 TouchChat 复用认证服务端转换边界

- **意图：** 补齐两种专有 AAC 格式从微信登录态、临时文件上传、转换响应到本机图库导入的客户端闭环，同时坚持不在小程序中复制供应商 parser。
- **决策：** 保留现有 `taroCommunicationAacImportPort`、CBoard 认证 token、Taro `uploadFile` 和统一 Open Board 导入服务；Snap `.sps` 与 TouchChat `.ce` 仅在显式 `WEAPP_E2E_SERVER_AAC=1` 运行门中启用。测试以临时 API 地址编译，用官方 `automation_wx_api` 静态结果替代未部署的服务端转换边界，其余 token 读取、微信临时文件、页面事件、冲突合并、DTO 持久化与清理全部走产品代码。
- **理由：** 供应商文件解析属于服务端能力，直接迁入小程序会增加主/分包体积、引入密钥与许可风险并形成第二套导入架构。开发者工具自定义函数 mock 会改变 Taro 回调数据，官方静态结果是当前更稳定的系统边界；请求 URL、Bearer、状态码、大小限制与错误映射已经由端口单测独立证明。
- **证据：** 测试 API production build 通过，主包 `1,249,738 B`，其余六个分包均低于 1.5 MiB；最新版开发者工具 `2.02.2607252` 中完整显式 E2E 用时约 461 秒并 PASS，导入 Snap 板“图语家 Snap 运行首页/我要喝水”和 TouchChat 板“图语家 TouchChat 运行首页/需要帮助”，上传临时文件删除，19 项 storage、双槽图库和媒体目录恢复。`communicationAacImportPort.test.ts` 为 `3/3` 通过。随后重新执行默认 `yarn build:weapp`，确认测试域名未进入产物、`apiBaseUrl` 为空，并以后台缓存刷新恢复默认模拟器。
- **生效范围：** 微信专有 AAC 格式的客户端认证、上传、响应解析、标准板导入和清理边界；不声称真实 cboard-api 转换服务、供应商账号/密钥、真实 `.sps/.ce` 文件、生产 HTTPS、物理手机或转换质量已经完成。无业务源码、依赖或 lockfile 变动，未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 20:27:24。

## 变动 223：OpenAAC `.obl/.obla` 导出进入微信真实文件运行门

- **意图：** 把变动 180/203 已完成的标准日志和严格匿名核心推进到最新版微信运行态，证明照护者入口、真实历史、微信文件系统和隐私净化共同工作。
- **决策：** 继续复用 [OpenAAC Open Board Logging](https://www.openboardformat.org/logs)、共享 `historyManagement` 与现有 Taro 文件端口；产品 UI 只增加两个稳定测试 ID，官方 Skill 只 mock `openDocument` 系统边界。E2E 分别读取真实 `.obl/.obla` 字节并审计语义，运行前记录已有日志文件名，`finally` 只删除本轮新增文件，不清用户目录或 storage。
- **理由：** OpenAAC 官方已经定义标准日志和内建匿名化用途，[官方 MIT 仓库](https://github.com/open-aac/openboardformat)也提供开放格式文档与工具基础；没有必要再发明私有日志格式。纯核心测试无法覆盖微信文件写入，页面成功提示也不能证明匿名文件已移除原文、时间和扩展字段，因此需要真实文件级运行门。
- **证据：** 语法、TypeScript、ESLint、差分及 `3 files / 10 tests` 通过；production build 通过，主包 `1,249,738 B`、全部分包低于 1.5 MiB。第一次 E2E 暴露模拟器旧缓存且安全恢复，确认产物后只清编译/文件列表缓存。第二次 background-only 完整 E2E 约 447 秒 PASS：OBL 为 `open-board-log-0.1`、保留真实沟通原文且无匿名声明；OBLA 为同一格式并声明匿名，所有 session 具备 `id_pseudonymization`、`timestamp_shift`、`timestamp_jitter`、`geolocation_masking`、`net_masking`、`fringe_masking`、`name_masking`、`url_stripping`、`extras_removed`，utterance 全部不可逆遮蔽，原文、内部 ID、真实时间和图语家扩展均不存在。2 个新文件删除，19 项 storage 恢复，失败截图删除，既有双向沟通、纠错、个人图片与四类本地 AAC 导入同步通过。
- **生效范围：** CBoard 共享日志纯核心与微信照护历史本机导出运行证据；不改变私密 OBL 导入、普通文本、账号同步、表达/接收、图卡、分词、语音或 AI。不包括研究平台上传、外部匿名日志认证或匿名文件恢复；官方性能扫描和插件下载体积仍需开发者工具面板人工验收。未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 20:51:49。

## 变动 224：设备私有图片 ZIP 在微信完成真实往返恢复

- **意图：** 补齐 #24 只有代码/build、没有真实用户文件往返的证据缺口，证明家属图片备份在删除原文件后仍能恢复并重新用于患者表达。
- **决策：** 继续复用 `PictureLibraryArchive v1`、共享 `createPictureLibraryArchivePlan/restorePictureLibraryArchive`、JSZip、Taro archive port和既有 backup 页面；官方 Skill只替代系统分享、确认和文件选择边界。测试读取真实 ZIP中的 `library.json` 与 PNG，再执行“恢复默认删除原图 → 导入同一 ZIP → 新路径重载 → 再次恢复默认”，并以运行前文件快照限制清理范围。
- **理由：** 生成 ZIP、解析 ZIP和恢复 storage 分别通过仍不能证明微信文件字节、随机恢复目录、身份重绑定和患者页面能共同工作。复用现有跨端格式与端口比新增测试 API、复制 parser 或发明微信专用备份更可维护，也保持 CBoard Web/微信互操作方向一致。
- **证据：** 脚本语法/差分通过，图库备份服务与端口 `2 files / 19 tests` 通过；当前 production build 主包 `1,249,738 B`、全部分包低于 1.5 MiB。开发者工具 `2.02.2607252` 完整 background-only E2E 约 515 秒 PASS：custom manifest v1含 1 条个人换图、1 个非空 PNG且不含整板；删除旧文件后从同一 ZIP恢复为新的 USER_DATA_PATH 图片、归属当前 patient/workspace并重新显示在“是”图卡；最终恢复默认后新文件和随机根删除。1 个测试 ZIP、2 个测试日志文件删除，19 项 storage恢复，核心双向沟通、个人图、OBF/OBZ/GRD/Gridset同步通过。
- **生效范围：** 微信设备私有图片的同机 ZIP导出/恢复、图片字节、身份重绑定、患者重载与失败清理；不外推到系统文件选择/分享 UI、跨两台物理手机、完整大图库性能、账号私有云或 Web真实浏览器下载。未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-26 21:10:46。

## 变动 225：完整本机数据 ZIP 从“只导出”补齐为可逆恢复

- **意图：** 修复设备交接档只把沟通数据写进 ZIP、导入时却只恢复图库的真实缺口，并证明完整档在微信运行时可以恢复图语家的双向沟通核心数据。
- **决策：** 在 CBoard 共享 `localDeviceData` 增加固定 sidecar 的严格解析契约，复用已有 storage normalizer 和常用语删除墓碑；微信 `pictureLibraryBackupService` 自动区分普通图库档与完整本机档，在同一恢复事务中按既有冲突策略写入图库、常用语、墓碑、历史、接收记录、修正和反馈草稿，失败时回滚。接收数据重绑定当前 patient/workspace。完整默认图库恢复时，只有 ZIP 与当前同 ID CBoard 媒体逐字节完全相同才复用包内路径，不同内容仍写入隔离目录。
- **理由：** sidecar 存在不等于用户能恢复，漏掉墓碑还会复活已删除常用语；另一方面，775 张内置图逐一复制会让恢复超过五分钟并浪费空间。复用共享格式、normalizer、repository、双槽 store 和字节比较，比发明第二套微信备份、按文件名猜相同或无限增加 E2E 超时更可靠。
- **证据：** CBoard 共享核心 `5/5`，微信备份服务与端口 `2 files / 22 tests`，TypeScript、ESLint、脚本语法和 production build 全部通过；main `1,249,738 B`、backup `545,145 B`，所有单包低于 1.5 MiB。最新版开发者工具 `2.02.2607252`、Skill `0.3.4` 的 background-only 全链 E2E 约 566 秒 PASS：真实 ZIP 五文件审计、六类记录篡改后恢复、墓碑保留、身份重绑定、默认图不重复落盘，以及后续 OBF/OBZ/GRD/Gridset 和既有双向沟通链全部通过；2 个日志、2 个测试 ZIP 删除，19 项原 storage 恢复，失败截图删除。
- **生效范围：** CBoard 跨平台完整本机数据纯契约与微信本机导出/恢复运行链；普通图库 ZIP、账号私有 custom 快照、登录 token、云同步和语音不改变。此处记录的 Web UI 遗漏已由变动 226 补齐；两台物理手机、系统分享/选择、存储不足、中断恢复和官方性能扫描仍待验收。未打开或置顶窗口，未预览、上传、发布、部署、提交或推送。

## 变动 226：完整本机数据 ZIP 在 CBoard Web 补齐恢复闭环

- **意图：** 消除同一完整备份“微信可恢复、Web 只能导出”的平台差异，让使用 CBoard 浏览器、Electron/Cordova 与微信小程序的家庭共享同一种可审查恢复契约。
- **决策：** 直接复用 `PictureLibraryArchive v1`、JSZip、现有 ImportReview、浏览器 localData repository 和变动 225 的严格 sidecar parser；把微信已经验证过的稳定 ID 合并、常用语墓碑互斥和 patient/workspace 重绑定提炼成共享 `mergeLocalDeviceDataRestore`，Web 与微信同时调用。Web 检测 `device-data.json` 后必须同时读取并校验四个固定 sidecar，在照护者确认页显示常用语、沟通记录、纠错与候选反馈数量，再与图库、个人图片、缺词和排序一起写入。完整导出同时补上已删除常用语墓碑；普通图库 ZIP 行为不变。
- **理由：** 复制微信 service 的合并函数会让两端再次漂移，简单覆盖又可能丢失本机新增记录或复活已删除短语。现有共享 normalizer、repository overwrite 方法、ImportReview 和冲突策略已经覆盖绝大多数语义，只需要薄读取、评审与持久化胶水；未新增依赖或第二套格式。
- **证据：** CBoard 聚焦 `5 suites / 25 tests / 3 snapshots` 全部通过，覆盖 sidecar 严格解析、备份优先/本机优先、墓碑、稳定 ID、身份重绑定、真实 JSZip 往返、localStorage repository 落库、仅表达数据且板未变化时仍可确认；CBoard production build 成功。微信改用共享函数后备份服务/本机端口 `2 files / 22 tests`、TypeScript、ESLint 和 production build 均通过；生成数据保持 `44 boards / 825 tiles / 775 images`，main `1,249,738 B`、backup `546,189 B`，所有包低于 1.5 MiB 建议线。
- **生效范围：** CBoard Web 的 Settings ZIP 导入/确认/通知、复用同一 Web bundle 的 Electron/Cordova、微信完整本机恢复合并核心，以及完整 ZIP 中六类沟通数据。不会让普通图库 ZIP携带历史，不改变账号云备份、API、语音、AI、matcher、分词或默认板语义。Web 浏览器人工文件选择/下载、两台物理设备、存储不足/中断、微信官方性能扫描仍需另验；本轮未打开、激活、聚焦或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 22:58:10。
- **记录：** Codex（GPT-5），2026-07-26 22:31:34。

## 变动 227：CBoard Web 完整本机数据恢复进入生产浏览器运行门

- **意图：** 把变动 226 的组件、仓库和 production build 证据推进到真实浏览器页面闭环，避免把单元测试中的 ZIP 往返误当成用户实际导入成功。
- **决策：** 继续复用项目已有 Playwright、JSZip、生产构建静态服务器和 Settings `/settings/import` 页面，不新增测试专用业务分支。E2E 在内存生成合法 `LocalDeviceData v1` 五文件 ZIP，通过真实隐藏文件输入进入现有复核页并确认恢复，再直接审计浏览器仓库中的常用语、删除墓碑、表达历史、接收记录、接收修正和候选反馈草稿；最后刷新页面复查持久化。相同用例在桌面 Chrome、Pixel 5 竖屏和 Pixel 5 横屏三个现有项目运行。
- **理由：** parser、repository 和 React 组件各自通过，仍不能证明生产路由、文件输入、复核按钮、恢复编排、身份重绑定和刷新生命周期能够共同工作。复用现有 Playwright 运行门比新建测试页面、使用开发服务器或人工目测更接近真实产品，也没有引入新依赖。
- **证据：** `tests/offline/local-device-data-restore.spec.js` 语法与差异检查通过；`yarn playwright test tests/offline/local-device-data-restore.spec.js --config=playwright.offline.config.ts` 在 production build 上 `3/3` PASS，桌面、手机竖屏和手机横屏均完成 ZIP 复核、六类数据落库、patient/workspace 重绑定及刷新后逐项相等检查。测试只生成已被 `.gitignore` 覆盖的 `.last-run.json`，未产生失败截图、trace 或新增依赖。
- **生效范围：** CBoard Web Settings 完整本机数据 ZIP 的生产浏览器恢复证据，以及复用同一 Web bundle 的桌面/移动视口兼容性；不等同于 Electron/Cordova 原生文件选择、两台物理设备迁移、磁盘不足、中断恢复、微信真机系统分享/选择或官方性能扫描。未打开、激活、聚焦或置顶任何 GUI，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-26 23:08:36。

## 变动 228：缺词 AI 图符形成照护者私有确认闭环

- **意图：** 补齐 #19 在现有 CBoard 图卡、本机家庭图片和公共图库都没有合适候选时的最后维护手段，同时把 #74 的安全研究边界落实为可审查、不可自动采用的工程流程。
- **决策：** 不安装 `cboard-ai-engine` 整包，只选择性复用其 AAC 构图提示；`cboard-api` 新增受认证图像生成适配器并复用现有 OpenAI-compatible/Azure 客户端、增强限流、Token 月额度、用量账本和 PNG 归一化。图像模型必须单独配置，响应必须声明设备私有、无公共许可、供应商条款适用并披露 provider/model。CBoard Web 与微信都只在家属缺图维护提供入口，先预览再确认；微信把 PNG 写入 USER_DATA_PATH，取消、无效结果或关联失败时清理临时文件。
- **理由：** 公共图库可能找不到家庭化或罕见概念，但模型生成图存在理解偏差、风格漂移、许可与成本风险。复用 API 防滥用和共享 runtime attribution 比客户端直连、复制 AI Engine SDK 或新增第二套图库更安全；设备私有与照护者二次确认可以证明流程可控，却不会把工程可运行误写成患者可理解或公共许可已解决。
- **证据：** API 图符 provider/controller/Swagger/限流/Token/用量聚焦 `58 passing`；Web API、attribution/runtime、缺图队列和父组件 `6 suites / 112 tests` 通过，真实 Material UI Portal 测试证明确认前 `onReview` 为零、确认后才持久化，等价 production build 成功。微信 AI port 与全量 `75 files / 333 tests`、7 项产物质量门、TypeScript、ESLint、`211 app / 30 core` 边界和 production build 通过；主包 `1,249,738 B`，距 1.5 MiB 建议线 `323,126 B`，没有新增静态图片、音频、插件、依赖或 lockfile。API 全控制器在本机缺 MongoDB/SMTP/测试密钥时 `369 passing` 后超时，只记录为环境限制，不冒充全量通过。
- **生效范围：** #19/#74、`cboard-api` 可选图像模型、CBoard Web 和微信家属缺图维护、共享设备私有 attribution/runtime 及微信文件生命周期；不进入患者自动表达，不自动采用，不公开上传，不声明公共许可，不接整板生成，不部署、不预览、不上传、不发布、不提交或推送。真实模型凭据、成本、供应商条款、生成质量、代表性患者理解研究、微信真机交互和跨设备恢复仍待后续验收；全程未打开、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 00:01:34。

## 变动 229：完整私有数据形成独立账号跨设备快照

- **意图：** 让家属无需手工转发完整本机 ZIP，也能在 CBoard Web 与微信之间迁移图语家的常用语、沟通历史、接收记录、修正、反馈草稿和个人图片，同时不破坏原“私人图片快照只上传图片”的隐私承诺。
- **决策：** 继续复用 `PictureLibraryArchive v1`、`LocalDeviceData v1`、CBoard 账号/JWT、Mongoose、Azure 私有 Blob、Web ImportReview、微信 backup 分包和共享事务恢复核心；新增独立 `/communication/private-device-data` 归档，不扩 Settings 或事件同步。共享 manifest 增加用途约束：`complete-device-backup` 必须配 full 图库，`account-private-snapshot` 必须配 custom 图库；恢复时同时校验用途与 scope。原私人图片 `/communication/private-library` 路由、内容和删除动作保持独立。参考 AsTeRICS AAC 的跨设备恢复目标，但不引入 PouchDB/CouchDB 第二后端；OpenAAC/OBF 可移植契约继续作为格式方向。
- **理由：** 直接把沟通历史塞进原私人图片 ZIP 会违反既有用户预期；把整套 775 张默认图反复上传会浪费包体、带宽和存储；另建实时数据库则会复制 CBoard 已成熟的账号与 API 工程。独立、显式、可审查的 compact ZIP 可复用现有安全和恢复边界，并允许两个快照分别删除和失败降级。
- **证据：** cboard-api 独立 model/controller/Swagger/账号删除/index readiness 聚焦 `19 passing`；CBoard Web 聚焦用途契约、API、真实 JSZip、上传/复核恢复/删除和界面为 `7 suites / 94 tests / 4 snapshots`，随后全量 `201 suites / 1395 tests / 72 snapshots` 与 production build通过；微信云端口、compact build、恢复、页面和产物端点进入全量 `75 files / 335 tests`、质量门 `7/7`、TypeScript、ESLint、`211 app / 30 CBoard core` 边界及 production build。未压缩 main `1,249,738 B`、backup `555,192 B`，全部包低于 `1.5 MiB` 建议线；无新增依赖、插件、图片、音频或 lockfile。
- **生效范围：** `cboard-api` 的每账号完整私有数据 Blob、CBoard Web Settings 导入/导出、微信“照护设置 → 图片库维护/备份”低频页面和共享归档核心；不进入患者表达页，不改变默认板、分词、matcher、语音、普通 Settings/事件同步、私人图片快照或公共图库。真实 Azure/Mongo/HTTPS、微信合法域名、两台物理设备、并发覆盖、网络中断与恢复质量仍待部署/真机验收。本轮未操作、打开、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 00:46:11。

## 变动 230：完整私有数据快照改为客户端端到端加密

- **意图：** 修复变动 229 与 issue #47 的隐私冲突：账号鉴权、私有 Blob 和 `no-store` 只能防公开访问，不能阻止服务器读取患者沟通历史、接收修正和个人图片明文；完整跨设备备份必须让服务端只接触密文。
- **决策：** 复用 MIT 许可且经独立审计的 `@noble/ciphers@1.3.0` 与 `@noble/hashes@1.8.0`，共享纯核心采用 `scrypt(N=32768,r=8,p=1) + XChaCha20-Poly1305`、16 字节 salt、24 字节 nonce和 header AAD，形成有 `PIE2EE01` magic 的 v1 加密信封。恢复密码最少 12 个字符、只在 Web/微信页面内存使用；Web 使用浏览器 CSPRNG，微信使用官方 `Taro.getRandomValues`。API 的完整设备数据契约升级为 format=`picinterpreter-private-device-data-encrypted`、contractVersion=`2`、`.pijenc`/`application/octet-stream`，拒绝明文 ZIP；旧明文记录保留元数据和删除能力，但下载返回 `409 PRIVATE_DEVICE_DATA_REENCRYPTION_REQUIRED`，要求在原设备重新加密上传。本变动当时未修改私人图片 ZIP 路由，随后已由变动 231 升级为独立密文端点。
- **理由：** 自研密码学、客户端直传明文或把密码交给服务端都会削弱可审计性；Web Crypto 在微信小程序不可统一复用，而 Noble 提供纯 JavaScript、零依赖、可 tree-shake 的跨平台实现。把密码规则与加密实现拆开，还能让设置页轻量加载规则、只在实际上传/恢复时加载重型 KDF。认证加密同时检测错误密码和密文篡改，严格格式 magic 则防止页面或旧客户端误把 ZIP 当作安全备份。
- **证据：** 加密纯核心覆盖往返、错误密码、篡改、明文、未知版本和密码规则；Web 浏览器 adapter 验证 Blob 明文不会作为上传参数，完整 CBoard 为 `203 suites / 1400 tests / 72 snapshots` 全通过且 production build 成功。微信云端口和 Taro adapter `10/10`，全量 `76 files / 338 tests`、TypeScript、`213 app / 32 core` 边界、7 项产物质量门及 production build全部通过；主包 `1,249,738 B`、backup `584,718 B`，全部包低于 1.5 MiB 建议线。API 私有归档目标 `13/13`、全部无外部依赖 controller `373 passing`；包含旧集成测试的全量命令因本机缺 MongoDB/SMTP/外部凭据在 `372 passing` 后超时，不冒充全量通过。
- **生效范围：** CBoard 共享密码/加密纯核心、Web Settings 完整数据上传与恢复、微信 backup 分包、Taro 随机数/二进制 adapter、cboard-api 完整设备数据 model/controller/Swagger 和旧明文迁移提示；本变动当时不改变私人图片 ZIP（后由变动 231 独立升级）、默认板、患者表达、分词、matcher、语音、普通 Settings/事件同步、公共图库或本机完整 ZIP。真实 HTTPS/Azure/Mongo、微信合法域名、两台物理设备、弱网中断、低内存手机 KDF 延迟、忘记密码文案和旧明文原设备迁移仍待部署/真机验收；未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 01:42:32。

## 变动 231：私人图片账号快照补齐客户端端到端加密

- **意图：** 修复变动 230 留下的最后一处云端明文边界，让仅包含家庭图片的账号快照与完整私有数据具有相同的服务端不可读保护，同时继续保持两种备份的用户意图和恢复范围独立。
- **决策：** 复用现有 `PictureLibraryArchive v1`、恢复复核与事务恢复作为解密后载荷，并直接复用 Noble `scrypt + XChaCha20-Poly1305`、共享 `PIE2EE01` 信封、Web CSPRNG 和微信 `Taro.getRandomValues`；不新增密码学、依赖或后端。私人图片端点升级为 `picinterpreter-private-picture-library-encrypted` contract v2、`.pijenc` 与 `application/octet-stream`，API拒绝明文 ZIP。旧 `picinterpreter-picture-library` 记录保留删除能力，但 metadata/download 返回 `409 PRIVATE_PICTURE_LIBRARY_REENCRYPTION_REQUIRED`；Web 与微信均要求独立的至少 12 字符恢复密码，在客户端加密上传、下载后本机解密再进入原有摘要复核。
- **理由：** 家庭照片不比沟通历史低敏感，私有 Blob只能控制访问者而不能阻止服务器读取；第二套加密格式或自研算法会增加审计和跨端漂移风险。复用已经通过两端构建的纯核心只增加薄平台胶水，同时独立端点保证“只备份图片”不会静默带入历史、修正或反馈。
- **证据：** cboard-api 图片归档 controller/route `14/14`、全部无外部服务 controller `374/374`；CBoard API 客户端、容器、组件和加密 adapter 聚焦通过，全仓 `203 suites / 1401 tests / 72 snapshots` 与 production build成功。微信聚焦 `2 files / 11 tests`、全量 `76 files / 339 tests`、TypeScript、ESLint、`213 app / 32 CBoard core` 边界、`44 boards / 825 tiles / 775 images`、质量门 `7/7` 和 production build全部通过；main `1,249,738 B`、backup `586,403 B`，所有单包低于 1.5 MiB 建议线。
- **生效范围：** cboard-api `/communication/private-library`、CBoard Web Settings 私人图片云备份、微信 backup 分包、共享密码与加密核心、旧明文迁移提示，以及“文档 / issue → 原实现 → CBoard Web → 微信小程序”覆盖矩阵；不改变本机 ZIP、独立完整私有数据快照、默认板、患者表达、分词、matcher、语音、AI、普通 Settings/事件同步或公共图库。真实 HTTPS/Azure/Mongo、合法域名、两台物理设备、弱网、低内存 KDF 延迟、错误密码/篡改真机表现与忘记密码仍待部署验收；未打开、聚焦或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 02:19:50。

## 变动 232：私人图片端到端加密进入 CBoard 生产浏览器三视口运行门

- **意图：** 证明变动 231 不只是测试了加密函数和 React 容器，而是能在 CBoard 实际生产页面中由家属完成上传、拒绝错误密码、复核和恢复，并消除手机竖屏操作区相互覆盖的真实回归。
- **决策：** 继续复用 CBoard 现有 Playwright production harness、Settings Export/Import、Redux Persist、localStorage repository 和同一 `PIE2EE01` 加密 adapter；只用 BrowserContext route 模拟已认证 API 与私有 Blob，不建立测试专用页面或替换业务加解密。E2E 必须检查 multipart 中只有 `.pijenc` 密文、Bearer token、加密 magic 且无 ZIP magic。响应式修复遵循 Material UI v4 将 `ListItemSecondaryAction` 渲染为卡片根节点相邻兄弟的事实，在 `<=700 px` 让操作区按正常文档流占高。
- **理由：** 组件测试无法发现 MUI 二次包装后的兄弟节点和父容器高度问题，也不能证明生产动态分块、浏览器加密、上传、下载、复核、持久化与刷新协作。真实云服务并非验证客户端“绝不上传明文”的必要条件，内存 API 边界反而能直接审计上传字节且不接触用户账号或数据。
- **证据：** 修复前 Pixel 5 竖屏真实 click 被下一张“完整数据备份”密码输入拦截，计算布局显示视口 `393 px`、媒体查询生效但旧子选择器找不到被 MUI 提升的 action。按相邻兄弟结构修复并重建后，合并后的 `tests/offline/private-cloud-encryption.spec.js` 中私人图片用例在 desktop Chrome、Pixel 5 竖屏和 Pixel 5 横屏 `3/3 PASS`；上传密文、错误密码、正确密码、Import review、确认恢复及 localStorage 持久化全部走生产实现。最终 `npm run build` 成功，测试临时目录已删除。
- **生效范围：** CBoard Web 私人图片云备份的生产浏览器运行证据、手机竖屏导入/导出布局和覆盖矩阵；微信端继续沿用变动 231 已完成的实现与测试，本变动未重新操作开发者工具或真机。不包含真实 Azure/Mongo/HTTPS、跨两台物理设备、Cordova WebView、弱网、低内存 KDF 或忘记密码验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 03:00:18。

## 变动 233：完整私有数据端到端加密进入 CBoard 生产浏览器三视口运行门

- **意图：** 证明账号完整快照不仅能生成密文，而且能在实际 CBoard 页面中无明文上传、拒绝错误密码、复核并恢复图语家的六类双向沟通数据。
- **决策：** 复用变动 232 的 production Playwright、BrowserContext API 边界、Redux Persist 登录 fixture 和密文审计 helper，不建立第二套测试框架。完整快照继续走独立 `/communication/private-device-data`、`picinterpreter-private-device-data.pijenc` 与 `picinterpreter-private-device-data-encrypted`；测试真实写入并恢复常用语、删除墓碑、表达历史、已确认接收、接收纠错和候选反馈草稿。错误密码后必须逐项保持六个 storage 为空，正确密码后必须通过 Import review、身份重绑定与刷新持久化。
- **理由：** 图片快照只覆盖 `PictureLibraryArchive` custom 载荷，不能证明 `LocalDeviceData` sidecar、墓碑、双向历史和纠错合并；继续复用同一 Noble 信封、归档 parser 和生产 UI 比新增专用恢复器、测试页面或第二种加密格式更可维护。
- **证据：** `tests/offline/private-cloud-encryption.spec.js` 的两类快照在 desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏共 `6/6 PASS`；完整快照用例分别约 `8.1 s / 12.9 s / 8.5 s`，上传字节具有 `PIE2EE01` 且无 ZIP magic，错误密码零写入，正确密码复核后六类记录全部恢复并在 reload 后完全相等。`node --check`、ESLint、空白检查和既有 production build 均通过，临时产物已清理。
- **生效范围：** CBoard Web/Electron/Cordova 共用 Settings 完整私有数据快照的生产浏览器运行证据和覆盖矩阵；微信仍沿用变动 230/231 已通过的实现与构建，本变动不重新操作微信开发者工具。真实云、两台真机、Cordova 原生文件边界、弱网、低内存和密码遗失仍待外部验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 03:08:21。

## 变动 234：issue #7 免登录双向沟通完成生产浏览器闭环

- **意图：** 用真实生产页面证明 GitHub 访客不登录也能完成图语家患者表达与照护接收，并把此前只到 build/HTTP 的覆盖状态升级为可操作证据。
- **决策：** 继续复用 CBoard 正式图板、Redux 导航、Communication Support、Material UI 全屏展示和 Playwright，不创建 demo 专用假页面。修复演示默认板加载离开 `/demo` 的路由泄漏，并把演示横幅置于普通页面之上、Dialog 之下；正常 CBoard 路由完全保持。原离线测试只更新已经增加“匹配诊断”的对话框标题选择器。
- **理由：** 生产 trace 直接显示 URL 从 `/demo` 变为 `/board/root` 后账号入口恢复；真实 click 直接显示横幅拦截全屏返回键。两处都是组件测试无法证明的跨层运行问题，复用现有状态和层级规则比增加演示分支、强制点击或复制页面更符合 fork CBoard 的技术底座决策。
- **证据：** 聚焦 Jest `5 suites / 23 tests / 2 snapshots`、目标 ESLint、空白检查和 production build通过；演示与原离线沟通用例在桌面、手机竖屏、手机横屏共 `6/6 PASS`。演示用例逐项验证无账号/设置入口、点图输出、候选播报与确认、输入转图、全屏反馈、表达/接收历史各一条、刷新后演示历史清空、正常持久数据完全不变。
- **生效范围：** issue #7、CBoard Web `/demo` 和覆盖矩阵；微信无需新增 demo 页面，API、账号、云同步、BoardDTO/TileDTO、默认板、分词和 matcher 不变。公开部署、真实辅助技术和物理移动设备仍待外部验收；未打开、聚焦或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 03:36:09。

## 变动 235：issue #12 候选反馈完成生产浏览器持久化闭环

- **意图：** 把候选反馈从组件回调证据推进到真实患者表达、浏览器存储和离线恢复，证明反馈会成为可复盘事实而不是一次性按钮状态。
- **决策：** 直接扩展既有 production offline E2E，复用正式候选 UI、`CandidateFeedback v1`、localStorage repository、表达确认和 Service Worker；不创建专用测试页或第二套反馈存储。测试按真实 DOM 的 candidate row 定位反馈组，而不是把候选句按钮误当作父容器。
- **理由：** 草稿保存、确认合并和刷新恢复跨越 React、repository 与离线生命周期，单元测试不能外推真实运行；复用同一双向沟通用例还能验证反馈操作没有阻断后续确认、接收历史和新对话。
- **证据：** desktop Chrome、Pixel 5 竖屏和 Pixel 5 横屏 `3/3 PASS`；逐项确认反馈按钮按下、本机提示、草稿 `feedback: up`、确认后草稿清空、表达历史带反馈以及离线刷新后仍保留。目标 ESLint、空白检查通过，失败 trace 与最终测试产物均已清理。
- **生效范围：** issue #12 与 CBoard Web 候选反馈运行证据；微信代码、API、反馈 schema、AI 候选和 TTS 均未修改。微信物理设备上的触控、播报并行和登录同步仍待验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 03:43:24。

## 变动 236：issue #22 照护历史复盘完成生产浏览器持久化闭环

- **意图：** 证明照护者能够在真实生产页面事后评价患者候选句并修正任意已确认接收记录，而患者当时看到的原始记录与每次修订证据始终可追溯。
- **决策：** 复用正式照护管理入口、共享 `CandidateFeedback v1` / `ReceiverCorrection v1`、浏览器 repository、Service Worker 和既有 production offline Playwright；不建立测试专用页面或第二套事实表。测试以真实双向会话生成记录，把候选反馈从 `up` 改为 `down`，再将已确认接收序列首图替换为“是”，检查原 history 对象不变、`caregiver_history_review` 前后快照追加以及 reload 后最新投影恢复。
- **理由：** 组件回调、纯核心和 build 不能外推生产路由、对话框、触控、本地持久化与离线生命周期能够共同工作；直接覆盖原记录则违反 #22 的审计决策。复用现有成熟实现和同一离线运行门可避免新增依赖、自研存储或用强制点击掩盖真实 UI。
- **证据：** desktop Chrome 单独通过；desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏历史复盘 `3/3 PASS`，与 `/demo` 隔离合并回归 `6/6 PASS`。目标 ESLint 通过；同一业务源码状态的 CBoard 全仓 `203 suites / 1404 tests / 72 snapshots` 和 production build 已通过。运行门逐项审计反馈持久化、原记录逐字段不变、修订 context、前后序列快照、当前投影和刷新恢复。
- **生效范围：** issue #22、CBoard Web/Electron/Cordova 共用照护历史复盘运行证据及覆盖矩阵；不修改生产业务代码、历史/纠错 schema、微信小程序、API、AI、语音、分词或 matcher。微信模拟器/真机、真实登录同步和物理移动设备仍待独立验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 03:59:20。

## 变动 237：issue #16 浏览器实时音量完成 production API 边界闭环

- **意图：** 证明 CBoard 接收端在真实 production 页面中用实际时域样本变化显示麦克风状态，且语音识别不会绕过人工修正和既有 matcher。
- **决策：** 复用浏览器标准 `SpeechRecognition + Web Audio API` adapter、ReceiverLoopPanel 和既有 Playwright；BrowserContext 只替代 CI 无法稳定提供的麦克风、AudioContext 与识别事件，不替代业务 hook、meter、输入、分词或匹配。合成边界明确标记为测试证据，不冒充物理麦克风或真人 ASR 质量。
- **理由：** hook 与组件回归不能外推 production bundle、页面生命周期、移动触控和资源释放；把循环动画或识别文字回调冒充波形又会误导照护者。标准 API 边界 harness 可重复验证静音/有声状态和清理语义，同时保留真实设备差异。
- **证据：** desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏语音状态 `3/3 PASS`，与 demo、离线双向沟通合并 `9/9 PASS`；逐项验证静音为零、有声上升、恢复静音归零、识别后 meter 隐藏、原文可改成“想要苹果”并全部匹配，以及音轨/AudioContext 各释放一次。目标 ESLint、同一源码状态全仓 `203 suites / 1404 tests / 72 snapshots` 与 production build 均通过。
- **生效范围：** issue #16 与 CBoard Web/Electron/Cordova 共用浏览器语音页面接线证据；不修改 production 业务代码、微信 WechatSI、API、语音供应商、分词或 matcher。真实浏览器权限、物理麦克风噪声底、ASR 准确率和端到端延迟仍待人工验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 04:07:26。

## 变动 238：issue #18 表达文字与接收 PNG 完成 production Web Share 边界闭环

- **意图：** 证明分享入口在真实 CBoard production 页面中交付正确的当前句和接收长图，同时不会改变患者与照护者正在进行的沟通。
- **决策：** 复用 `CommunicationShare contract v1`、正式浏览器 adapter、Canvas renderer、全屏接收端和 Playwright；BrowserContext 只捕获无头环境无法打开的 `navigator.share/canShare` 系统边界，PNG 加载、布局、Blob/File 和 React 状态全部走生产实现。
- **理由：** 组件回调不能证明图卡图片、Canvas、File API、移动触控和系统分享请求共同可用；另造测试图片或测试页会跳过真实失败面。捕获标准 API 最终载荷可重复验证接线，但不冒充物理手机上的系统面板与目标应用已经通过。
- **证据：** desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏分享 `3/3 PASS`，与 demo、离线历史、语音状态合并 `12/12 PASS`；文字分享取得非空当前句，接收端生成 `图语家接收图片.png`、`image/png`、非零字节 File。分享后当前输出、候选、全屏、输入和序列保持；目标 ESLint、同一源码状态全仓 `203 suites / 1404 tests / 72 snapshots` 和 production build 通过。
- **生效范围：** issue #18、CBoard Web/Electron/Cordova 共用分享接线及覆盖矩阵；不修改 production 业务代码、微信分享、API、账号、历史、语音、分词或 matcher。真实 iOS/Android 系统面板、取消行为、目标应用和微信真机仍待物理设备验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 04:12:45。

## 变动 239：issue #13/#23 新对话与场景完成 production 三视口闭环

- **意图：** 证明“新对话”不是只换提示文字，场景也不是只改按钮颜色；活动 session、场景和可复盘历史必须在真实 production 页面保持一致。
- **决策：** 扩展既有 offline 主链：选择“医院”后再次点击清除，再重新选择并读取活动 session；走二次确认新对话后检查 session ID 更换、空场景规范化和历史保留。AI 上下文仍复用共享 `conversationSession/communicationAi`，不为 E2E 建立假 AI。
- **理由：** UI 文案、repository 和 AI payload 分别通过仍不能证明跨层接线；直接审计 production 页面与 localStorage 的活动事实，可以发现旧 session/scene 泄漏，同时不需要复制模型、调用外部服务或收集定位。
- **证据：** desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏 `3/3 PASS`；“医院”选择/清除/重选、`scene: hospital`、新 session ID、空场景和两条双向历史保持逐项通过。目标 ESLint、前序核心合并 `12/12`、同一业务源码全仓 `203 suites / 1404 tests / 72 snapshots` 与 production build 均通过。
- **生效范围：** issue #13/#23、CBoard Web/Electron/Cordova 共用会话与场景运行证据；不修改 production 业务代码、session schema、微信、API、AI、历史、语音、分词或 matcher。不采集 GPS；微信运行态和真实登录 AI 请求仍待验收，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 04:20:22。

## 变动 240：issue #19 缺词公共图源完成 production 三视口闭环

- **意图：** 证明缺词维护不是只在单元测试里保存一个状态，而能在真实 CBoard production 页面完成“发现 → 忽略/恢复 → 联网候选 → 来源许可 → 人工确认 → 后续复用”。
- **决策：** 复用正式 MissingTokenQueue、公共图源 API adapter、runtime pictogram、浏览器 repository 与 Playwright；受控 API 一次返回真实分词产生的全部缺词候选，照护者逐项确认。测试只模拟 cboard-api/图片字节边界并阻断其余外网，不复制 matcher、分词、存储或维护 UI；本地服务器改用合法 `localhost`，API 边界用例显式绕过 CSP 以命中本地 route。
- **理由：** 生产构建在 `127.0.0.1` 会按 CBoard 域名规则形成非法 `api.127.0.0.1`，合法 `api.localhost` 又会被 production CSP 在请求到达 route 前阻止；二者都是自动验收环境边界而非补图逻辑失败。逐项确认全部分词结果则避免用只修一个缺词的状态冒充整句已匹配。
- **证据：** 失败 trace 先后证明“请求前 Invalid URL”和 `http://api.localhost:4173/pictograms/search` 被 CSP 阻断；修正 harness 后目标 ESLint通过，desktop/Pixel 5 竖屏/横屏 `3/3 PASS`。每个视口均验证缺词忽略与恢复、一次批量请求、ARASAAC 和 `CC BY-NC-SA 4.0`、全部候选逐项确认、repository 完整来源、整句全部匹配及 reload 后继续复用；production 离线全组 `24/24 PASS`。
- **生效范围：** 覆盖矩阵 #19、CBoard Web/Electron/Cordova 共用缺词维护运行证据与 Playwright 本地 API harness；不修改 production 业务代码、分词、matcher、默认板、图源排序、API 或微信实现。真实公网图源、HTTPS 部署、微信合法域名、物理设备和 AI 模型仍按既有边界待验；未预览、上传、发布、部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5.6），2026-07-27 04:42:16。

## 变动 241：issue #29 修复浏览器历史写入失败误确认

- **意图：** 用真实 production 页面验证患者表达历史保存失败时不会丢现场或假装成功，并修复单元测试此前没有覆盖到的 adapter 断层。
- **决策：** 复用现有 `persistExpressionHistoryEntry`、失败 UI 和 repository，不新增重试状态机。浏览器 KeyValueStore 以 `true/false` 报告写入结果，repository 对明确 `false` 抛错；微信和旧 adapter 的 `undefined` 成功返回保持兼容。Playwright 只让 `cboard_communication_history` 第一次写入抛配额错误，第二次恢复正常，其余 production 代码不替换。
- **理由：** 原 browser adapter 捕获异常后无返回值，repository 无法区分“成功返回 undefined”和“失败被吞掉”，因此真实页面会错误进入已确认。共享安全函数本身正确，修复最窄 adapter/仓库边界即可复用两端既有 UI，避免复制确认逻辑或读回整个历史做昂贵校验。
- **证据：** 修复前 production E2E 直接显示“已确认”，证明问题真实存在；修复后聚焦 `3 suites / 27 tests`、目标 ESLint、production build、全仓 `203 suites / 1405 tests / 72 snapshots` 全通过。desktop/Pixel 5 竖屏/横屏 `3/3` 逐项验证首次失败提示、空历史、输出与候选逐字不变、按钮可重试及第二次成功；完整 production 离线回归 `27/27 PASS`。
- **生效范围：** 覆盖矩阵 #29、CBoard Web/Electron/Cordova 浏览器存储写入、Communication Support repository 与患者表达确认；微信生产代码不变，仍沿用原生同步存储抛错和共享安全函数。不会改变历史 schema、TTS、候选、分词、matcher、账号或 API；未预览、上传、发布、部署、提交或推送，全程未打开、聚焦或置顶窗口。
- **记录：** Codex（GPT-5.6），2026-07-27 05:00:34。

## 变动 242：issue #36 候选句自动播报进入 production 三视口运行门

- **意图：** 证明空闲候选自动播报不是只在定时器单测中成立，而能在真实 CBoard production 页面与患者主动操作、表达调整、照护设置和持久化共同工作。
- **决策：** 复用正式 `candidateAutoplay`、CommunicationPreferences、ExpressionLoopPanel、SpeechProvider 和 production Playwright；BrowserContext 只提供确定性的系统 SpeechSynthesis 边界并记录最终 TTS 调用，不替代计时、取消、候选、设置或 storage。真实选择两张 CBoard 图卡，先用单句朗读取消旧计时，再用“右移”改变表达触发 5 秒重计和全部候选顺序播报，最后从折叠的照护工具进入显示设置关闭自动播报。追踪中发现 Material UI Dialog 标题未关联可访问名称，production 组件补充 `aria-labelledby` 后继续按 `role=dialog` 与“显示与易用性”验收。
- **理由：** 组件回调不能证明真实 DOM 事件、输出签名、React 生命周期、TTS 队列和偏好落盘共同接线，物理系统 TTS 又不适合作为确定性 CI 边界。只替换最外层浏览器能力可保留全部产品逻辑；修复可访问名称比测试使用坐标、强制点击或脆弱 CSS 更符合 AAC 产品要求。
- **证据：** 目标 ESLint、聚焦 `3 suites / 14 tests`、CBoard 全仓 `203 suites / 1405 tests / 72 snapshots` 和 production build 全部通过；自动播报在 desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏 `3/3 PASS`，完整 production 离线回归 `30/30 PASS`。每个视口都验证手动单句后等待超过 5 秒无自动追加、表达变化后按全部候选文字顺序调用 TTS、出现重播状态、关闭偏好保存为 `0`，以及再次改变表达并等待超过 5 秒仍无新调用。
- **生效范围：** 覆盖矩阵 #36、CBoard Web/Electron/Cordova 共用候选自动播报、照护设置和设置 Dialog 无障碍名称；不修改微信生产代码、候选算法、默认 15 秒、TTS 供应商、API、历史、分词或 matcher。真实系统声音、物理触控、后台切换和微信 WechatSI 仍需真机验收；未打开、聚焦或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 05:27:50。

## 变动 243：严格 `.obla` 导出与禁止恢复形成 production 隐私闭环

- **意图：** 让覆盖矩阵中的“匿名研究副本不可恢复”不再只依赖文档和纯函数断言，证明真实 CBoard 页面导出的 `.obla` 确实严格脱敏，并且 Web 与微信共享核心都不会把占位符导回患者历史。
- **决策：** 继续复用 OpenAAC `open-board-log-0.1`、既有 `.obla` builder 和共享 `historyManagement`；导入器在读取任何 session/event 前拒绝根节点 `anonymized=true`，返回零新增、明确错误和原历史。Web production E2E 从正式照护管理页下载文件，检查根/session/event 白名单、九项匿名化、伪 ID、时间平移及 `:fringe-*`，再把同一文件送入真实导入 input 并审计 localStorage。微信管理服务只新增同一核心的集成断言，不复制算法。
- **理由：** `.obla` 的研究占位符不能表达患者原话，允许导回会制造虚假沟通历史并违背不可逆承诺；只靠文件扩展名过滤无法防止改名或其他文件端口。把判定放在共享内容解析层能同时覆盖 CBoard Web/Electron/Cordova 与微信，且比另造日志格式或平台解析器更小、更可靠。
- **证据：** 共享核心聚焦 `12/12`，CBoard 全仓 `203 suites / 1406 tests / 72 snapshots`、production build 通过；新增 `.obla` production E2E 三视口 `3/3 PASS`，完整离线生产回归 `33/33 PASS`。下载文件不存在原句、姓名、地址、内部 ID、真实年份或 `ext_picinterpreter`，导回后明确拒绝且原历史不变。微信 TypeScript、ESLint、`213 app / 32 core` 边界、`76 files / 339 tests`、质量门 `7/7` 和 production build 全通过；主包 `1,249,738 B`，全部分包低于 `1.5 MiB` 建议线。
- **生效范围：** 覆盖矩阵的 OpenAAC 日志互操作、CBoard Web/Electron/Cordova 导入入口、微信管理服务和跨端共享纯核心；不改变私密 `.obl`、`.obla` 导出算法、研究平台上传、外部匿名真实性认证、历史 schema、表达、接收、分词、matcher、图卡、语音、AI、账号或 API。未打开或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-27 05:54:55。

## 变动 244：issue #82 图片去背景完成 CBoard production 三视口闭环

- **意图：** 消除覆盖矩阵 #82 唯一明确的 Web UI 运行缺口，证明照护者在真实 CBoard production 页面中可以安全试用去背景、恢复原图，并把确认后的候选保存为沟通图卡。
- **决策：** 不新增抠图算法或第二套编辑器，继续复用 cboard-api `rembg/remove.bg` provider 契约、CBoard TileEditor、browser-image-resizer 和原媒体保存路径。Playwright 只在 API 边界返回一次 `503` 和随后符合契约的透明 PNG，产品侧仍真实执行登录持久化、默认板解锁、订阅提示关闭、文件上传、隐私确认、对象 URL 替换/恢复、multipart 媒体保存和图卡落板；三种视口使用同一用户流程。
- **理由：** 组件单测与 provider smoke 不能覆盖 Redux Persist 初始化、快速解锁、Material UI Portal、原生 `confirm`、浏览器压缩和异步保存之间的真实组合。保持 production DOM 与状态流不替换，只控制不可重复的外部服务，比坐标点击、强制点击或浏览器自研模型更稳定，也更符合“优先复用现有 CBoard 与开源 provider”的决策。
- **证据：** 去背景 production E2E desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏 `3/3 PASS`；共享认证夹具原有加密 E2E `6/6 PASS`；CBoard `203 suites / 1406 tests / 72 snapshots`、production build 和完整离线 production E2E `36/36 PASS`。断言覆盖 Bearer token、multipart `image`、隐私说明、失败不改原图、透明候选 URL、恢复、`pictogram-no-background.png` 上传和新图卡可见。
- **生效范围：** 覆盖矩阵 #82 的 CBoard Web UI 运行态现标为已验证，并同时覆盖 Electron/Cordova 共用 TileEditor 的代码路径；微信仍维持代码/build 与本地 provider 已验证、真机待验收。受控 API E2E 不替代 fork 后端部署、真实鉴权 HTTP、真实家庭照片边缘质量或物理设备验收；未预览、上传、发布、部署、提交或推送，也未打开、聚焦、抬升或置顶微信开发者工具。
- **记录：** Codex（GPT-5.6），2026-07-27 06:33:22。

## 变动 245：issue #83 图卡排序完成微信官方模拟器闭环

- **意图：** 消除覆盖矩阵 #83 的微信运行态缺口，证明照护者人工排序、患者真实使用计数和常用优先不是只存在于纯函数或构建产物中。
- **决策：** 继续复用共享 `pictogramOrdering`、Taro storage adapter 和现有微信官方 Skill smoke，不复制排序或自动化核心。为同一脚本增加排序专用模式和 ordering storage 隔离；以稳定元素 ID 执行人工下移、患者点选、模式切换与两次 `reLaunch`，并由原 harness 在 `finally` 中恢复完整 storage 快照。
- **理由：** issue #83 同时跨越照护设置页、患者页、分包导航、React 状态、微信 storage 和应用重建，仅靠单元测试与 production build 证据不足；复用现有后台 Skill harness 能用最小胶水取得真实运行证据，并避免坐标点击、窗口抢焦或用户数据残留。
- **证据：** 微信开发者工具 Nightly `2.02.2607252` 后台 E2E PASS：默认叶子顺序“是、不”，人工下移后“不、是”，患者点“是”形成 `1` 次计数，常用优先重新显示“是、不”，导航文件夹始终保持第 3 位；页面重建后常用模式、独立人工顺序、使用计数均保留，切回固定顺序后精确恢复“不、是”并再次通过重建。脚本最终恢复原 19 项 storage；微信 TypeScript、ESLint、`213 app / 32 core` 边界、`76 files / 339 tests`、质量门 `7/7` 和 production build 全通过，主包 `1,249,738 B`。
- **生效范围：** 覆盖矩阵 #83、微信排序运行证据、Skill smoke 确定性隔离和专用 npm 命令；不改变 CBoard Web、排序算法、默认板、matcher、TileDTO、云同步、图卡内容、语音或 API。物理手机触控仍需另验；未预览、上传、发布、部署、提交或推送，全程只在既有运行时后台操作，没有打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5.6），2026-07-27 06:49:04。

## 变动 246：issue #13/#23 会话与照护场景完成微信官方模拟器闭环

- **意图：** 消除新对话和固定照护场景的微信运行态缺口，验证患者表达页、照护接收分包与同一活动 session 在真实小程序运行时不会分叉。
- **决策：** 继续复用共享 `conversationSession`、微信 repository、Taro `showModal` 和原官方 Skill smoke；不新增会话模型、场景表或测试页面。专用场景先通过患者真实确认建立旧历史，再选择/清除/恢复医院场景，重建接收页，分别模拟取消和确认新对话，并再次重建后检查 session、场景、接收输入、患者图片序列和旧历史。
- **理由：** 新 session ID 不是充分证据；必须同时证明旧上下文不可继续进入新会话、场景被清除、当前工作区为空且照护复盘历史不丢失。复用正式页面和 storage 的后台 Skill 自动化比坐标脚本或复制 repository 更接近真实产品行为。
- **证据：** 微信开发者工具 Nightly `2.02.2607252` 后台 E2E PASS：医院场景即时激活并跨 `reLaunch` 恢复，同键清除/重新选择不改变 session；取消确认后 session、场景、历史原样不变；确认后活动 session ID 改变、场景消失、接收输入与患者图片序列为空，旧确认历史仍完整，第二次 `reLaunch` 后继续成立。原 19 项 storage 在 `finally` 中恢复。微信 TypeScript、ESLint、`213 app / 32 core` 边界、`76 files / 339 tests` 和质量门 `7/7` 全通过；production build 沿用同轮成功证据，主包 `1,249,738 B`。
- **生效范围：** 覆盖矩阵 #13/#23、微信会话/场景运行证据、Skill smoke 和专用 npm 命令；不改变 Web、会话/历史 schema、AI payload、matcher、图卡、语音、账号同步或 API。真实登录模型消费场景和物理手机确认框仍需外部验收；未预览、上传、发布、部署、提交或推送，全程只在既有运行时后台操作，没有打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5.6），2026-07-27 06:57:30。

## 变动 247：issue #12 候选反馈草稿恢复与微信运行闭环

- **意图：** 修复候选反馈虽然已写 storage、但表达面板重新建立后按钮状态丢失的问题，并把微信端从代码/build 证据推进到官方模拟器中的完整草稿与历史闭环。
- **决策：** 继续复用 `CandidateFeedback v1` 和现有 repository，不增加平台专用 schema。共享纯核心新增按 `sessionId + outputSignature` 选择最新草稿并按候选句文本重新对齐反馈的函数；CBoard 与 Taro 只加载各自 storage 并传入恢复结果。Web 首次 effect 不再误删刚恢复的草稿。微信官方 Skill smoke 增加 feedback 专用模式和草稿 key 隔离，始终在 `finally` 恢复用户 storage。
- **理由：** 只按候选数组下标恢复会在 AI 候选变化后把评价错贴到另一句话；只证明 storage 中有 JSON 也不能证明患者再次看到正确高亮。把匹配语义放进共享纯核心、平台仅保留 adapter，比在 React DOM 和 Taro 各写一套恢复规则更可靠，也符合复用 CBoard 的技术底座决策。
- **证据：** CBoard 聚焦 `3 suites / 42 tests`，全仓 `203 suites / 1409 tests / 72 snapshots`、标准 production build 和 desktop/Pixel 5 竖屏/横屏离线 E2E `3/3 PASS`；E2E 在确认前 reload 后验证同一草稿和 `aria-pressed=true`。微信 TypeScript、ESLint、`213 app / 32 core` 边界、`76 files / 339 tests`、质量门 `7/7` 和 production build 全通过，main `1,249,738 B`。开发者工具 Nightly `2.02.2607252` 的 background-only E2E PASS，验证草稿创建、同 ID 替换、取消、确认、历史改评、重建及原 19 项 storage 恢复。
- **生效范围：** issue #12、共享候选反馈恢复函数、CBoard Web/Electron/Cordova 共用表达面板、微信患者表达/历史管理和两端自动化；不改变反馈 schema、AI 候选算法、TTS、账号 API 或云同步。模拟器不替代物理手机触控、真实 WechatSI 并行播报或已部署登录同步；未预览、上传、发布、部署、提交或推送，全程没有打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 07:27:25。

## 变动 248：issue #22 历史接收修正完成微信官方模拟器闭环

- **意图：** 消除 #22 在微信端“只有纯核心、组件测试和构建，没有任意旧接收记录真实修正”的证据缺口，证明照护者能在正式历史页修图，同时保留患者当时看到的原始事实。
- **决策：** 不新增历史表、测试页面或微信专用纠错算法，继续复用 CBoard 共享 `ReceiverCorrection v1`、`caregiver_history_review`、微信 repository/storage adapter 和现有 background-only 官方 Skill harness。专用模式注入同一会话的两条已确认接收记录，选择较旧记录，把“不”图卡换成“是”；自动化通过官方 `outerWxml` 按可见按钮内容和 CBoard 图片资源解析 Taro 运行时 ID，再交回官方点击命令。历史不可变基线在 repository 首次规范化与署名补齐后锁定。
- **理由：** 只验证纯函数不能证明 management 分包、Taro 事件、图片目录、React 状态、微信 storage 和 `reLaunch` 共同可用；直接比较注入前 JSON 又会把合法的 schema/署名迁移误判为历史覆盖。官方 Automator 不支持元素索引，Taro 对嵌套节点会生成 `_N*` ID，因此按当前 WXML 可见内容解析运行时 ID 比坐标点击、重复静态 ID或修改业务语义更稳。
- **证据：** 微信开发者工具 Nightly `2.02.2607252` background-only E2E PASS：两条确认接收记录均进入历史，目标旧记录由“不”图替换为“是”图；唯一新增 correction 为 `replace_pictogram + caregiver_history_review`，`pictogramIdBefore/After` 和 `revisionBefore/After` 正确；规范化后的两条原 history 字节语义保持不变，页面显示唯一“已有照护者图片修正”，`reLaunch` 后再次打开目标记录仍显示“是”图片且没有重复审计，最后恢复原 19 项 storage。微信 `76 files / 339 tests`、质量门 `7/7`、TypeScript、ESLint、`213 app / 32 core` 边界和 production build 通过；main `1,249,738 B`，全部单包低于 1.5 MiB，既有 AAC import `295 KiB` 独立告警不变。
- **生效范围：** issue #22 微信官方模拟器运行证据、`test:e2e:weapp:history-review` 专用命令和通用 Skill 测试胶水；不改变历史/纠错 schema、患者原始分词、CBoard Web、AI、TTS、matcher、图卡库、账号同步或 API。模拟器不替代物理真机触控、真实登录同步、弱机重启和多轮连续修订验收；未预览、上传、发布、部署、提交或推送，全程未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 08:16:15。

## 变动 249：issue #29 表达保存失败完成微信官方模拟器闭环

- **意图：** 消除微信端在 storage 异常下可能丢失患者当前表达的运行证据缺口，证明失败后仍可看图、选句并原地重试，而不是把一次单元测试外推为真实 Taro 行为。
- **决策：** 不改 `ExpressionWorkspace`、repository 或 schema，继续复用共享 `persistExpressionHistoryEntry` 和既有 background-only Skill harness。新增 `WEAPP_E2E_STORAGE_FAILURE_ONLY=1` 专用模式；患者先真实点选 CBoard“是”图，再用官方 `automation_wx_api mock` 让 `wx.setStorageSync` 在确认阶段抛出配额错误，核对失败状态后恢复原 API 并点击同一确认按钮重试。
- **理由：** 历史记录是沟通后的附属数据，当前图片和候选才是患者正在使用的沟通现场；若失败时清空或锁死，就会把设备存储问题放大为沟通中断。复用官方 wx mock 能覆盖 Taro adapter、React 状态、repository 异常传播和真实按钮事件，比修改测试 storage、复制页面或用坐标脚本更接近产品运行边界。
- **证据：** 微信开发者工具 Nightly `2.02.2607252` background-only E2E PASS：第一次确认显示“表达已生成，但本地保存失败”，history 仍为 `[]`，一张“是”图、全部候选、首个已选候选和启用的确认按钮均保持；恢复真实 `setStorageSync` 后原地重试写入唯一 `confirmed express` 记录，再次确认显示已确认且 history 仍只有一条；最后恢复原 19 项 storage。同期 `76 files / 339 tests`、质量门 `7/7`、TypeScript、ESLint、`213 app / 32 core` 边界和 production build 通过，main `1,249,738 B`。
- **生效范围：** issue #29 微信官方模拟器运行证据、`test:e2e:weapp:storage-failure` 命令和 Skill mock 隔离；不改变表达/历史 schema、候选、TTS、matcher、图卡、账号同步、API 或 CBoard Web。模拟配额错误不替代物理设备真实低存储、系统清理、文件系统错误和弱机压力验收；未预览、上传、发布、部署、提交或推送，全程未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 08:22:55。

## 变动 250：隐藏板块与患者导航完成 CBoard / 微信双端闭环

- **意图：** 让照护者在图片库维护中隐藏暂时不用的板块后，患者表达页不仅不展示该板块，也不能再通过仍然残留的文件夹图卡误入该板块，同时保留其余可用图卡和原始板块数据。
- **决策：** 不在 Web 和微信各写一套过滤逻辑，继续复用 CBoard 平台无关纯核心；新增 `projectVisibleCommunicationBoards` 统一按 `hiddenBoardIds` 过滤板块，并移除所有指向被隐藏板块的 `loadBoardId/loadBoard` 导航图卡，同时同步 `layout.tileIds` 与旧 `grid.order`。CBoard Communication Support 与微信患者页消费同一投影；全部板块被隐藏时沿用既有安全回退。微信官方 E2E 在刷新前只调用 `cleanCompileCache` 清除目标项目的编译缓存，不清 storage、登录态或用户数据。
- **理由：** 只过滤板块数组会留下孤儿文件夹入口，患者仍可能打开不存在或本应隐藏的分类；平台各自实现又会让 BoardDTO 兼容规则逐渐漂移。官方模拟器曾在 production build 已更新后继续执行旧页面，单独 `simulator_refresh` 不能可靠消除该缓存，因此必须把“源码错误”和“旧编译仍在运行”分开诊断。
- **证据：** CBoard 共享核心与 Web 面板 `2 suites / 29 tests` 通过，标准 production build 成功；微信 TypeScript、ESLint、`214 app / 32 CBoard core` 边界、`77 files / 342 tests`、质量门 `7/7` 和 production build 全通过。微信包体为 main `1,249,738 B`、caregiver `575,827 B`、emergency `96,621 B`、management `524,951 B`、backup `588,014 B`、aac-import `625,556 B`、ocr `66,319 B`，均低于 1.5 MiB 建议线。Nightly `2.02.2607252` background-only E2E PASS：默认文件夹可见，隐藏目标板块后文件夹消失而叶子图卡仍在，`reLaunch` 后状态保持，恢复板块后文件夹重新出现，最终完整恢复原 19 项 storage。
- **生效范围：** CBoard Web/Electron/Cordova 与微信小程序的板块可见性、患者板块列表和跨板块导航投影；不删除原板块或图卡，不改变匹配、分词、TTS、AI、账号同步或 API，全部隐藏的既有回退保持。模拟器证据不替代物理真机；未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 12:09:31。

## 变动 251：跨分类找图位置完成微信官方模拟器运行闭环

- **意图：** 证明跨分类图库搜索只属于家属图片库维护，不会重新堆叠到患者表达页；同时验证该入口不是静态标题，而能查询完整 CBoard 图卡目录。
- **决策：** 不新增测试页面或第二套搜索实现，继续复用 `CommunicationSettingsPanel`、`PersonalImageManager`、正式 backup 分包路由和现有 background-only Skill harness；新增独立 `test:e2e:weapp:library-placement` 运行门，患者页先验证搜索入口与维护文案均不存在，再经照护工具进入图片库维护，检查公开图卡收纳，并用“叉子”执行真实跨分类查询。
- **理由：** 源码字符串测试只能防止明显误放，不能证明 Taro 分包路由、设置入口、完整 44 板/825 图目录和搜索状态在官方运行时共同可用；把维护工具留在患者页会增加认知负担并重现界面堆叠。
- **证据：** 定向放置测试 `1 file / 2 tests`，微信全量 `77 files / 342 tests`、质量门 `7/7`、TypeScript、ESLint、`214 app / 32 CBoard core` 边界和 production build 全通过，全部单包低于 1.5 MiB。Nightly `2.02.2607252` background-only E2E PASS：患者页不存在 `personal-image-library-search` 与“跨分类找图”，照护设置正式进入 `/packages/backup/pages/personal-images/index`，页面显示“公开图卡收纳”和“跨分类找图并收纳”，“叉子”返回真实 CBoard 图卡，原 19 项 storage 完整恢复。
- **生效范围：** 微信患者表达页、照护设置、家属图片库维护、公开图卡收纳和 CBoard 目录查询的运行证据；不改变搜索算法、图卡数据、分词、matcher、AI、账号或 API，不代表物理真机滚动、输入法和触控已验收。未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 12:23:02。

## 变动 252：微信离线状态下双向沟通完成官方模拟器闭环

- **意图：** 把 #65/#66 从“本地图包、storage 和状态文案各自有测试”推进到同一 production 会话，证明平台报告离线时仍能完成患者表达、照护接收、全屏确认和双向历史恢复。
- **决策：** 不新增网络层或离线数据库，继续复用微信 `getNetworkType`、共享离线优先核心、现有 BoardDTO 图包和 repository。新增独立 `test:e2e:weapp:offline`，只通过官方 `automation_wx_api` 把 `getNetworkType` 返回为 `none`；患者首屏验证不显示技术状态，照护工具与接收页验证离线说明，再走完整双向确认和 `reLaunch`。恢复后重新加载页面并确认离线提示消失。通用 `mockWx` 改为仅在官方 mock 成功后登记恢复项。
- **理由：** 网络提示出现不等于沟通仍可用，构建通过也不能证明正式 Taro 页面、图包、repository 与历史共同工作；同时开发者工具明确不允许 mock `onNetworkStatusChange`，继续尝试会制造假性恢复告警。只使用官方支持的初始网络类型边界，比自造事件总线更准确，也保留真实事件监听代码不变。
- **证据：** 网络端口定向 `1 file / 4 tests`、微信全量 `77 files / 342 tests` 与质量门 `7/7` 通过；同一 production 源码的 TypeScript、ESLint、`214 app / 32 CBoard core` 边界和 build 已通过，全部单包低于 1.5 MiB。Nightly `2.02.2607252` background-only E2E PASS：患者首屏无离线技术提示，照护工具和接收页显示离线模式；离线确认一条患者“是”表达和一条“想喝水”接收，隔离全屏保留 3 张图，历史包含 express/receive 两条并在 `reLaunch` 后恢复；真实 wx API 与原 19 项 storage 均恢复。首次不支持的事件 mock 失败也已恢复 storage，失败截图已删除。
- **生效范围：** 微信官方模拟器的初始离线网络状态、患者/照护职责分层、本地双向沟通、历史重建和 E2E mock 恢复；不代表物理真机系统级断网、运行中网络切换、DNS/请求拦截、WechatSI 离线语音或外部 API 超时已验收。未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 12:36:43。

## 变动 253：微信性能门复核并保留成熟 AAC 解析链

- **意图：** 确认继续迁移图语家功能不会突破微信包体与质量边界，同时避免为了普通构建告警自行重写或拆散成熟 AAC 解析器。
- **决策：** 继续复用 Open Board、AsTeRICS、Gridset、AACTools、JSZip、fflate 和 fast-xml-parser，并保持 AAC 独立低频分包；不采用可能被微信审核拒绝的运行时动态加载插件。小程序 production postbuild 继续强制压缩、未使用文件过滤、组件按需注入、插件真实使用、未使用组件、单包和媒体体积；插件下载体积与主包依赖归属仍由官方性能扫描验收。
- **理由：** Taro 官方说明微信端默认动态 import 并不产生真实异步包；当前独立 AAC 分包远低于微信 1.5 MiB 建议线，拆页或自研解析器只会放大维护和格式兼容风险。保留开源成熟实现并强化边界验证更符合“尽量复用，不自行研发”的总体决策。
- **证据：** 开发者工具 Nightly `2.02.2607252` 兼容检查通过；微信质量门 `7/7`、TypeScript、ESLint、`214 app / 32 CBoard core` 边界和 production build 全部通过。未压缩 main `1,249,738 B`、aac-import `625,556 B`，全部七个包低于 1.5 MiB；AAC 分包距建议线余 `947,308 B`，且不嵌入图片或音频。Webpack `295 KiB` 单资源提示仍被如实记录，不冒充微信包体失败。
- **生效范围：** 微信 AAC 导入、生产包体和发布前性能验收；不改变导入结果、患者表达、接收端、图卡、分词、matcher、语音、账号、API 或 CBoard Web。官方性能扫描、物理真机低内存与真实大文件仍待外部验收；未预览、上传、发布、部署、提交或推送，也未打开、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 12:53:13。

## 变动 254：issue #10 同一设备私图跨多个板形成共享核心与微信运行闭环

- **意图：** 补齐 PRD 中“一张图卡可出现在多个图板”的明确遗漏，让家庭熟悉图片和专属录音可以复用，而不要求家属重复上传、重复填写或承担误删媒体的风险。
- **决策：** 继续复用 CBoard `BoardDTO / TileDTO`、设备私图归因、不可变板更新和 Taro 图片库双槽存储，不创建第二套图库模型。共享核心新增复制操作：目标板获得新 Tile ID，图片、录音、communication 元数据和归因 `originalId` 保持相同；目标板已存在同源私图时拒绝重复。微信管理 UI 只增加目标板 Picker 与复制按钮，并在编辑/删除媒体前检查其他 Tile 引用。官方 Skill 增加独立 background-only 场景，以正式按钮验证复制、源删除和重建。
- **理由：** CBoard 成熟板模型已经解决多板布局，缺的是设备私有媒体的跨板引用和生命周期语义；复制二进制会增加手机存储与备份体积，共用 Tile ID 会让不同板的身份和排序互相干扰。新 Tile ID 加共享媒体是最薄、最符合底座的组合，也避免复制完整 CBoard 编辑器或自研关系数据库。
- **证据：** CBoard 聚焦 `1 suite / 9 tests`、ESLint 与 production build 通过；微信定向 `1 file / 7 tests`、全量 `77 files / 343 tests`、质量门 `7/7`、TypeScript、ESLint、`214 app / 32 CBoard core` 边界和 production build 通过，backup `591,710 B`。Nightly `2.02.2607252` background-only E2E PASS：真实家属图片库按钮生成不同 Tile ID、相同图片/声音/`originalId`；删除源卡后共享媒体与目标卡保留；`reLaunch` 后恢复；原 19 项 storage 和图库双槽文件最终精确恢复。首次完整 44 板 MCP 注入返回 `500` 也成功恢复用户数据，改为相同业务所需两板夹具后通过。
- **生效范围：** issue #10、CBoard Web/Electron/Cordova 与微信共用的个人图卡复制纯核心、微信 backup 分包管理 UI、本机媒体生命周期和 E2E；不改变患者主界面、默认板、公开图库、分词、matcher、TTS、AI、账号或 API。模拟器证据不替代物理真机 Picker、相册、录音、大量副本和低存储验收；未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 13:40:58。

## 变动 255：issue #9 个人板持续管理与患者导航完成微信运行闭环

- **意图：** 把分类维护从“代码里有操作”推进为家属可反复进入、患者可实际导航、删除后可完整清理的产品闭环。
- **决策：** 继续复用 CBoard 共享 `boardManagement` 和 BoardDTO/TileDTO，不搬运 React DOM、Material UI 或整套 Web 编辑器。微信图片库中的板块管理入口改为始终可见；页面动作增加稳定 ID；官方 Skill 增加专用模式，用真实首页/快速交流夹具依次完成新建、改名、排序、首页加入文件夹、患者打开、移除入口和删除空板，并由既有 finally 恢复双槽文件与全部 storage。
- **理由：** 首轮 E2E 在创建个人板并回到图片库后发现入口消失，production 源码确认按钮只在没有个人板时显示；若只让测试直接导航，会把同一用户缺陷隐藏起来。保持低频照护入口稳定，同时复用 CBoard 板间导航，是比新增测试页、隐藏手势或第二套分类模型更小且更可靠的修复。
- **证据：** 首轮 E2E 前半链通过、入口处失败且原 19 项 storage/图库文件恢复；修复后聚焦 `2 files / 4 tests`、微信全量 `77 files / 343 tests`、质量门 `7/7`、TypeScript、ESLint、`214 app / 32 CBoard core`、production build 全通过，backup `591,947 B`。Nightly `2.02.2607252` background-only E2E PASS，验证个人板新建/改名/排序、CBoard 文件夹 ID 与目标、患者板标题、入口移除、安全删除、`reLaunch` 清理和原数据恢复。
- **生效范围：** issue #9、微信家属图片库与板块管理分包、患者首页板间导航和官方运行门；CBoard Web/Electron/Cordova 继续使用原生板编辑能力。不会删除内置板，不允许含图卡或跳转的板被误删，不改变分词、matcher、TTS、AI、账号或 API。模拟器不替代物理真机输入法、触控、长列表和性能验收；未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 13:57:22。

## 变动 256：首次引导和视觉可访问性完成微信运行闭环

- **意图：** 把原 MVP 已验证的首次说明、高对比、字号和图卡列数迁移从代码证据推进到微信正式页面、管理分包和重建共同参与的运行证据。
- **决策：** 继续复用 CBoard 共享 `COMMUNICATION_ONBOARDING_CONTENT` 与 `CommunicationPreferences`；微信只补稳定元素 ID和 `WEAPP_E2E_ACCESSIBILITY_ONLY`，不复制内容、偏好 schema、存储或 UI 框架。官方场景从确定性首次状态开始，完成引导，再通过照护设置选择高对比、超大字号和两列网格，重建后重看引导并再次完成。
- **理由：** 独立组件和 store 通过不能证明 Taro management 分包返回、`useDidShow`、患者页 class 和 `reLaunch` 同时正确；正式 UI 加完整 storage 快照比源码断言或测试页面更接近产品，也保持患者与照护者职责分层。
- **证据：** 微信聚焦 `2 files / 2 tests`、全量 `77 files / 343 tests`、质量门 `7/7`、TypeScript、ESLint、`214 app / 32 CBoard core` 边界和 production build 通过；全部包低于 1.5 MiB。Nightly `2.02.2607252` background-only E2E PASS：三步共享引导、首次完成、高对比/超大字号/两列 class、`reLaunch` 持久化、照护重看、视觉偏好保留和第二次完成全部成立，原 19 项 storage 精确恢复。
- **生效范围：** 覆盖矩阵“首次引导”和“高对比/字号/列数”、微信患者页、management 设置分包与官方运行门；CBoard Web 业务不变。模拟器证据不替代系统读屏、WCAG 色彩测量、物理设备字体可读性、触控、安全区或横竖屏验收；未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 14:06:27。

## 变动 257：CBoard 成熟默认体系补齐图语家成人照护核心内容

- **意图：** 解决“完整复用 CBoard 默认板”与“图语家核心成人照护表达”之间最后一段内容差距，使患者无需先钻入分类即可表达最常见需要、求助、疼痛与沟通修正，同时保持全平台单一内容源。
- **决策：** 不替换、不删减 CBoard 原有 44 块成熟默认板；在同一 `boards.json` 中非破坏追加首页和 Quick Chat 高频照护项，并新增隐藏的“核心词”“修正澄清”两块子板。图符优先复用原图语家 `public/seed/pictograms.json` 已审阅 ARASAAC 编号和 CBoard 原有图符；微信只机械生成 BoardDTO、压缩图片与归因，不复制一套词表。新增“要/不要”同时用 `communicationExcludeTokens=要不要` 固化安全边界。
- **理由：** CBoard 的分类、布局、跨平台客户端和图符库是选择该底座的核心价值，重新设计默认板会放弃这些成熟能力；但原首页只有“是/不”和分类文件夹，无法达到图语家 PRD 的低步骤成人照护目标。复用现有板树并增加最薄内容层，比自研图库、独立微信 fixture 或把所有分类摊平更可维护，也避免重现图片堆叠问题。
- **证据：** CBoard 现为 46 板/871 图卡，首页 42 项含 13 个直接表达叶子，核心词 15 项、修正澄清 9 项；新增 23 个已审阅 ARASAAC 源图并可由 provider/originalId 还原许可。CBoard communicationSupport `77 suites / 610 tests`、新增文件 ESLint 零告警和 production build 通过；微信生成 798 张去重图片，`77 files / 344 tests`、质量门 `7/7`、TypeScript、ESLint、`214 app / 32 core` 和 production build 通过，全部单包低于 1.5 MiB。原图语家审阅回放的未匹配 occurrence 从 183 降为 133，未匹配 unique 从 102 降为 96；80 条照护 fixture 未产生 partial 安全回归。
- **生效范围：** 覆盖矩阵中的默认板内容、#15 否定与高风险匹配、CBoard Web/Electron/Cordova 和微信患者/接收共用内容；不改变原分类、账号/API/AI/语音/支付，也不声称物理真机、患者理解或官方性能扫描已经完成。CBoard 构建仍如实保留 vendored AACProcessors 既有警告。未预览、上传、发布、部署、提交或推送，也未打开、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 14:49:20。

## 变动 258：成人照护默认板取得微信正式页面运行证据

- **意图：** 将变动 257 的同源默认内容从代码/测试/build 证明推进到微信正式患者导航、接收匹配、独立展示与来源许可共同参与的运行闭环。
- **决策：** 在既有 background-only 官方 Skill harness 中增加独立成人照护默认板场景；不建立测试页、不复制图板或 matcher。患者端依次验证首页直达项、核心词和修正澄清，照护端用“要不要叫医生”验证排除规则，再用“叫医生”完成可用质量、全屏和 ARASAAC 署名。场景继续保存并恢复全部微信 storage。
- **理由：** 46 板/871 图卡生成成功不能证明 Taro 运行时路由、图片、点击和接收端会消费新内容；高风险否定句更必须在正式 matcher 入口验证。复用现有官方 Skill 与 production UI 比手工坐标、测试专用页面或第二套 fixture 更接近用户路径，也不会破坏 CBoard 作为单一内容源的决策。
- **证据：** Nightly `2.02.2607252` background-only E2E PASS：首页新增照护叶子和两个子板入口可达；核心词 15 项、修正澄清 9 项可见并可选；“要不要叫医生”只生成“请叫医生”，无“要/不要”误图；“叫医生”为 `1/1`，独立全屏显示 ARASAAC 和 `CC BY-NC-SA 4.0`；原 19 项 storage 精确恢复。同期微信 `77 files / 344 tests`、质量门 `7/7`、TypeScript、ESLint、边界与 production build，以及 CBoard `77 suites / 610 tests` 与 production build 均通过。
- **生效范围：** 覆盖矩阵默认内容与 #15 安全匹配的微信运行证据、官方 Skill 专用命令、患者/照护正式页面；不改变数据、API 或平台语义，不代表物理真机触控、读屏、横竖屏、语音或患者理解已完成。未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 14:59:17。

## 变动 259：成人照护默认板取得 CBoard Web production 离线运行证据

- **意图：** 完成变动 257/258 的另一平台运行闭环，证明同一 CBoard 内容源在 Web 与微信都能支撑患者导航、照护接收和公开图符审计。
- **决策：** 不建立跨平台测试专用 UI，不复制微信 BoardDTO fixture；直接复用 CBoard 现有 production offline Playwright、Service Worker、正式 Tile/Router 和 Communication Support。抽取既有 Service Worker 等待 helper 后，新场景在三个视口真实打开首页、核心词、修正澄清，再断网执行高风险接收和全屏署名。
- **理由：** “共享纯核心”只有在各平台正式装配都运行通过时才成立；CBoard build 和微信模拟器不能替代 Web production 路由、Portal 与 Service Worker。复用 CBoard 原有测试体系比引入新框架、复制内容或搭建测试页面更符合成熟底座优先原则。
- **证据：** `communication-support-adult-care-defaults.spec.js` 在 desktop Chrome、Pixel 5 竖屏、Pixel 5 横屏 `3/3 PASS`：42 项首页、11 个新增照护叶子、15 项核心词、9 项修正澄清、唯一医生成功匹配、单图预览、全屏和 ARASAAC/CC BY-NC-SA 4.0 均成立；原完整 production offline spec 在 helper 抽取后另行 `3/3 PASS`。首轮固定示例文字造成测试作用域误报，页面当时已经显示 `1/2`、唯一医生预览和明确未匹配“要不要”；断言收窄到成功匹配行后通过，没有修改业务语义。
- **生效范围：** 覆盖矩阵默认内容、#15 安全匹配和 #65 离线 Web 运行证据，以及 CBoard Web/Electron/Cordova production 测试门；微信继续使用变动 258 的官方 Skill 证据。不替代真实手机浏览器、原生客户端、系统读屏、物理旋转、患者理解或网络部署验收；未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-27 15:09:08。

## 变动 260：恢复原始 12 项目标并完成代码范围逐项审计

- **意图：** 防止长期开发过程中把 GitHub issue 的远期路线、生产部署条件、患者研究和最初要求“补上的功能”混为一谈；重新以用户在建立持续目标前明确列出的 12 项为验收边界，逐项确认当前工作树是否仍有真实代码缺口。
- **决策：** 原始范围按以下 12 项保持不变，并映射到当前实现：
  1. 缺词自动联网补图：由双端缺词队列、CBoard API 的 ARASAAC/OpenSymbols 搜索、来源许可、人工确认和离线复用闭环承接。
  2. AI 辅助重分词：由可编辑原文、可编辑分词、本地结果安全基线和服务端受限 AI 重分词承接。
  3. AI 候选句生成：由本地模板兜底、认证服务端候选、反馈、自动/手动播报和失败降级承接。
  4. 登录与云同步：由 CBoard 账号体系、微信短信登录/找回、轻量 Settings、逐条常用语/确认记录同步，以及两个独立端侧加密私有快照承接；真实部署联调不冒充完成。
  5. 自定义照片和个人偏好图：由 CBoard TileEditor 与微信个人图卡、熟悉照片替换、跨板复制、专属录音和设备私有媒体生命周期承接。
  6. 常用语完整管理：由新增、编辑、删除墓碑、排序、一键播报、载入修改、导入导出和账号同步承接。
  7. 完整历史管理：由会话分组、表达/接收历史、纠错审计、候选反馈、完整本机备份和严格匿名研究副本承接。
  8. 紧急求助面板：由双端独立紧急入口、8 张离线大图和朗读承接。
  9. 最近使用、使用统计、下一词建议：由共享使用计数、常用优先排序、患者最近使用和下一词建议承接；统计不驱动危险的自动重排。
  10. 无障碍与首次引导：由共享动作语义、44px 以上触控、高对比、字号、列数、读屏标签、首次引导和照护者重看入口承接。
  11. 完整板编辑器、OBF 和打印：完整编辑与 PDF 继续直接复用 CBoard Web；OBF/OBZ、GRD、Gridset、Snap、TouchChat 走共享复核管线；微信只承担有界图库维护和本机导入，不复制 React DOM、Material UI 或 PDF 引擎。
  12. 真机完整验收：保留为外部验收门，而不是继续编写一个伪“真机功能”；官方模拟器和用户反馈已有大量证据，但物理旋转、真实断网、系统读屏、低存储、两设备并发、生产供应商和患者理解仍必须在对应环境逐项确认。
- **理由：** 前 11 项是可由代码、测试、构建和运行证据证明的功能组，当前均已有明确实现归属；第 12 项要求真实设备、账号、网络或受试者，不能用更多模拟代码代替。继续把所有开放 issue 都解释成“核心功能未完成”会无限扩张目标，也会诱导重复实现 CBoard 已成熟的编辑、打印、跨平台和 AAC 导入能力。
- **证据：** 本矩阵当前条目及变动 1–259 已逐项记录双端代码、测试、production build、CBoard production 三视口、微信官方 Skill、包体和用户真机反馈；最近一轮微信为 `77 files / 344 tests`、质量门 `7/7`、46 板/871 图卡/798 图片，CBoard Communication Support 为 `77 suites / 610 tests`，两端 production build 与成人照护默认板运行门通过。CBoard 当前源码存在 `PrintBoardButton`、Settings PDF 导出和测试；`docs/prd-cboard-secondary-development.md` 第 11 节又明确把打印列为“可以延后”。新增开源复核记录在 `docs/aac-core-library-survey.md`，没有发现比当前 CBoard 底座更成熟且可低成本替换的候选。
- **生效范围：** 该结论只证明当前本地工作树中原始 11 组代码功能已具备实现与工程证据，并把第 12 项转入诚实的外部验收清单；不宣称生产 API、真实模型/图源凭据、支付、应用商店、物理真机全场景、代表性患者理解研究或公开图库投稿已经完成。远期 issue 继续保留自身状态，不因本次审计被关闭。本轮未修改业务代码，未预览、上传、发布、部署、提交或推送，也未打开、激活、聚焦、抬升或置顶微信开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 15:24:20。

## 变动 261：原始功能范围取得当前工作树的双端新鲜质量证据

- **意图：** 不只依赖变动 1–259 的历史成功记录，而用当前磁盘状态重新验证原始功能组、共享纯核心、微信装配和 CBoard production 构建仍然成立。
- **决策：** 微信执行全量 Vitest、产物质量门、TypeScript、ESLint、平台边界、生成板一致性和 production build；CBoard 使用明确的 `CI=true` 非监听 CRACO 入口执行 Communication Support 全目录测试，再执行标准 production build。首次两个 `npm test` 命令因 npm/CRACO 没把非监听参数传给子进程而在工具时限后保持 watch，不把它们记作测试失败；只结束本轮启动的两个残留进程，其他既有 Node/Jest 进程保持不动。
- **理由：** 原始 11 组代码功能都集中在 Communication Support、共享核心及微信装配，定向全目录比一个误入 watch 且没有结果的全仓命令更可归因；production build 又覆盖真实依赖图、静态资源、Service Worker、Taro 分包和微信产物规则。验证必须同时报告通过项、非阻断警告和未执行的外部验收，不能用旧日志或“没有报错”冒充成功。
- **证据：** 微信 `77 test files / 344 tests`、产物质量门 `7/7`、TypeScript、ESLint、`214 app / 32 CBoard core` 边界、`46 boards / 871 tiles / 798 images` 一致性全部通过；production build 成功，主包 `1,282,746 B`，caregiver `600,813 B`、emergency `97,054 B`、management `550,039 B`、backup `616,887 B`、AAC import `650,496 B`、OCR `66,752 B`，全部低于官方建议的 `1.5 MiB`。CBoard Communication Support 当前 `94 suites / 732 tests / 1 snapshot` 通过，标准 build 成功并生成约 `41.8 MB / 1009 resources` 的 Service Worker。构建仅保留 vendored AACProcessors 既有 lint/动态依赖警告、CBoard 主 bundle 偏大，以及微信 AAC import 单 JS `295 KiB` 的 Webpack 建议；低频 AAC 已在独立分包，官方插件下载体积仍需上传前性能扫描。
- **生效范围：** 当前本地 `cboard` 与 `cboard-wechat-poc` 的原始图语家功能、共享核心、默认板、资源、production 构建和微信包体门。该证据不替代 `cboard-api` 的真实供应商/数据库部署、微信官方性能扫描、物理真机、生产网络、支付或代表性患者研究；本轮没有修改业务代码，没有预览、上传、发布、部署、提交或推送，也没有打开、激活、聚焦、抬升或置顶微信开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 15:44:15。

## 变动 262：cboard-api 完成当前测试审计并让运行验收快速失败

- **意图：** 为原始范围中的登录、Settings、同步、AI、联网补图、私有快照和 AAC 转换补上第三仓当前证据，同时避免本地 API 半死时验收脚本无限等待、掩盖真实环境状态。
- **决策：** 继续复用 Axios 的原生 `timeout` 与 Node 的 `AbortSignal.timeout`，不给 API 另造请求层。Settings 和 receiver-sync verifier 使用独立 10 秒 Axios client；readiness verifier 给原生 fetch 传 10 秒 AbortSignal。生产部署模板继续使用现有 checker。当前 `127.0.0.1:10010` 虽能建立 TCP 连接，但 `/health` 15 秒无响应，因此不终止或重启占用端口的既有进程，也不把 runtime 联调写成通过。
- **理由：** 单元测试证明路由和数据边界，不等于当前本机 Mongo/API 实例健康；反过来，一个无超时的脚本挂住也不等于代码功能失败。直接使用现有 HTTP 客户端的标准超时能力，是比自建轮询、结束未知服务或无限提高工具时限更小、更安全的修复，并让 CI 和人工排障都能在确定时间内得到可诊断结果。
- **证据：** cboard-api 无外部依赖 controller/route 集合 `374 passing`，覆盖账号删除与 auth version、手机号注册/登录/找回、Settings 中性/旧键、常用语和接收记录同步、AI provider/配额/用量、ARASAAC/OpenSymbols/Global Symbols、图片转 PNG、去背景、TTS/方言 ASR、两个端侧加密私有快照、AAC 转换、订阅安全、健康与部署配置；`verify:production-deploy-template` 通过。补丁后 3 个脚本语法、Prettier 和 `git diff --check` 通过，readiness `3 passing`；面对当前无响应服务，Settings、receiver-sync 和 readiness 分别约 12 秒返回 `timeout of 10000ms exceeded` 或 abort timeout，不再拖满 120 秒。全目录 runtime verifier 仍未通过，因为当前本机 API 健康检查无响应。
- **生效范围：** `cboard-api` 的三个本地/CI 运行验收脚本及其 readiness 单测；不改变生产 controller、Swagger、数据库、登录、同步、AI、图源、配额、Blob 或客户端协议。代码实现与离线测试已验证，但真实 Mongo、HTTP、供应商凭据和两端部署联调仍必须在健康 runtime 中执行；没有重启或终止既有 API/Mongo，未部署、提交或推送，也未操作微信开发者工具窗口。
- **记录：** Codex（GPT-5），2026-07-27 15:58:02。

## 变动 263：最新版微信开发者工具完成 background-only 全链运行门

- **意图：** 在更新微信开发者工具并完成当前 production build 后，用官方运行时重新证明核心功能没有只停留在 Vitest、Taro 产物或旧模拟器记录中，同时遵守不置顶、不抢焦、不自动预览上传的用户边界。
- **决策：** 复用现有 `weapp-skill-smoke.mjs`、官方 `wechatide` Skill 和正式患者/照护页面，不新增测试专用业务页面或第二套自动化。脚本只连接已存在项目运行时，后台清编译缓存、刷新模拟器并执行正式 UI/storage 流程；运行前快照全部 storage，结束后清理测试日志、图库备份、本机备份和 AAC 导入媒体，再恢复原 storage。性能质量继续复用项目既有 production 产物门与微信项目配置；官方 Skill 当前未暴露性能扫描命令，不用自研扫描器冒充官方结果。
- **理由：** 官方模拟器能覆盖 Taro 编译、WXML/WXSS、事件、分包、微信文件系统和 storage，强于 jsdom；但它仍不能替代物理手机的麦克风、横竖屏、安全区和真实断网。复用已有全链脚本比手工坐标点击更稳定，也能证明测试没有污染用户数据。包体和配置应由微信官方规则与现有构建门共同约束，而不是另造一套不等价评分。
- **证据：** 微信开发者工具 Nightly `2.02.2607252`、Skill `0.3.4`、登录有效且版本关系 `equal`。background-only E2E 约 610 秒 PASS，覆盖患者表达确认、接收草稿冷恢复、未理解反馈恢复、换图学习、删除墓碑、关闭学习、人工插图、纠错记忆管理、双向历史、私密 `.obl`、严格匿名 `.obla`、设备私有缺词图、个人图片、私图 ZIP 和完整本机 ZIP 恢复、AAC 分包导航、OBF、带图片/声音/导航的 OBZ、带图片/导航的 GRD，以及 Gridset 布局/图片；删除 2 个测试日志、1 个图库备份和 1 个本机备份，原 19 项 storage 全部恢复。项目配置确认 JS/WXSS/WXML 上传压缩、未使用文件过滤、代码质量检查和自动审计开启，应用配置包含 `lazyCodeLoading: requiredComponents`；production build 已证明所有单包低于 1.5 MiB。
- **生效范围：** 当前 `cboard-wechat-poc` production 产物、官方模拟器中的核心双向沟通、历史/纠错、私有数据和 AAC 导入运行证据。该结果不代表官方“性能扫描”面板、插件实际下载体积、物理真机语音/旋转/读屏/断网/低存储、预览包或正式发布已经通过；本轮未打开、激活、聚焦、抬升或置顶开发者工具窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-27 16:11:56。

## 变动 264：隔离 Docker Mongo 完成真实登录、Settings 与接收同步联调

- **意图：** 消除 cboard-api 只具备单元/路由测试、但当前本机 `10010` 半死且没有 Mongo 所造成的真实 HTTP 持久化证据缺口，并在不触碰未知进程和其他 Docker 项目的前提下验证图语家账号后端闭环。
- **决策：** 完整复用仓库现有 `Dockerfile`、`deploy/docker-compose.production.yml`、Mongo 7.0.37、健康检查、索引 readiness、种子脚本和三个 verifier；只增加一个不进仓库的临时 Compose override，将 API 绑定到 `127.0.0.1:10110`，Compose project 固定为 `picinterpreter-local-runtime`，Mongo 只留在内部网络。随机 Mongo/session/JWT 凭据只存在临时 env 文件；仅启动 `mongo + api`，不启动 Caddy。验收结束后按 project 精确删除容器、网络、专用数据卷和临时文件。
- **理由：** 既有 production 容器已经固化非 root、只读文件系统、内部 Mongo、健康检查和真实路由，复用它比安装全局 Mongo、引入内存数据库或模拟 repository 更接近实际部署。独立项目名、端口和卷能避免污染现有 `10010` 进程及其他 Docker 栈；临时随机凭据和验收后销毁又不会把秘密或测试数据写入仓库。
- **证据：** Docker Engine `29.4.0`；production 镜像从当前工作树和 frozen Yarn lock 成功构建。Mongo 与 API 均为 `healthy`，`GET http://127.0.0.1:10110/health` 返回 `200`、`database=connected`、`communicationIndexes=ready`；仓库种子脚本创建本地隔离账号。`verify:communication-readiness` 通过；Settings verifier 通过旧 `tuyujia` 保存/读取与中性 `communicationSupport` 双写读回；receiver-sync verifier 通过认证创建、设备 A 反馈、陈旧设备 canonical conflict、加性反馈重试、结构化墓碑、防陈旧复活和同时反馈冲突重试，最终版本分别为 `4` 和 `3`。清理后按 Compose label 查询为 `NO_ISOLATED_CONTAINERS`，override 与随机 env 文件均不存在。
- **生效范围：** 当前 cboard-api 的真实 production 容器启动、Mongo 连接/索引、账号登录、Settings 兼容持久化和 confirmed receiver record 并发同步路径。该证据不代表公网 HTTPS、Azure 私有 Blob、腾讯云短信、AI/ASR/TTS 凭据、两台物理设备或生产备份已经验收；没有修改生产业务代码、Compose 模板或仓库配置，没有触碰现有 `10010` 进程及其他容器，也未部署、提交、推送、预览、上传或发布。
- **记录：** Codex（GPT-5），2026-07-28 09:12:21。

## 变动 265：最新版官方 Skill 全链通过并补齐可恢复 E2E 数据保护

- **意图：** 在微信开发者工具升级后重新证明图语家核心闭环可运行，同时消除官方 Skill 连接瞬断时测试数据可能停留在模拟器 storage、且下一进程无法恢复的基础设施风险。
- **决策：** 继续复用官方 `wechatide` Skill、现有正式页面和既有全链脚本，不引入 Computer Use、坐标自动化或第二套业务测试页。E2E 在改写任何 storage 前把完整快照写入项目隔离的临时恢复文件，使用 SHA-256 校验并只在精确恢复成功后删除；新增显式 `test:e2e:weapp:restore-storage` 命令。传输重试只覆盖读取、同值输入和 storage 同值写入/删除等幂等操作，点击、文件保存等非幂等操作禁止自动重试。控制台只忽略微信基础库 `routeDone with a webviewId ... is not found` 的精确已知路由竞态，其他错误继续失败；新会话后的历史重建改用等价 `reLaunch`，避免无业务意义的 WebView 往返。
- **理由：** 官方 Skill 的 TLS/Automator 瞬断不应被误判为业务失败，更不能让测试污染模拟器；但全局重试或宽泛忽略错误会掩盖真实缺陷并可能重复点击、重复导出。持久快照、完整性校验、显式恢复和幂等白名单是最小且可审查的安全胶水，保留 CBoard/Taro/微信正式业务代码为唯一被测实现。
- **证据：** 微信开发者工具 Nightly `2.02.2607272` 后台运行。恢复专项场景验证 18 项 storage 完整快照、隔离、恢复和恢复文件删除；两次官方连接故障均保留恢复文件，随后显式恢复 `18/18` 成功。最终完整 background-only E2E 约 721 秒 PASS，覆盖患者表达、接收草稿冷恢复、反馈复核、换图/删图学习与关闭学习、人工插图、纠错记忆、双向历史、新会话、私密 OBL/匿名 OBLA、缺词私图、个人图片、图库 ZIP、整机本地 ZIP、OBF、OBZ、GRD 和 Gridset，清理 2 个日志、1 个图库备份、1 个本机备份并恢复原 18 项 storage。最终 `77 test files / 344 tests`、质量门 `10/10`、TypeScript、ESLint、`214 app / 32 core` 边界和 production build 通过；主包 `1,282,746 B`，全部分包低于 `1.5 MiB` 建议线。
- **生效范围：** 当前 `cboard-wechat-poc` 的官方 Skill E2E 安全层、后台全链运行证据和微信 production 质量门；不改变表达、接收、matcher、图卡、语音、账号、API 或持久化 schema。官方 Skill 没有暴露性能扫描面板，因此插件实际下载体积和官方性能评分仍待开发者工具面板人工执行；物理真机语音、旋转、读屏、真实断网和低存储仍是外部验收门。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶开发者工具窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-28 10:51:36。

## 变动 266：开源源码复用审阅与微信 OCR 官方运行闭环

- **意图：** 按“先核对源码账本、再拉取运行、最后最小适配”的规则复核公共图源与 OCR 候选，补齐图片文字识别此前只有 production 代码和构建、缺少微信官方运行时证据的问题。
- **决策：** 固定并审阅 CBoard、AsTeRICS Grid、OpenAAC、PaddleOCR、PaddleOCR-json 本地源码；AsTeRICS Grid 实际安装、测试和构建后，只复用 provider 分层、分批查询、语言回退和标准化思想，不复制其 UI/WASM/bundle。PaddleOCR 与 PaddleOCR-json 只保留为未来服务端 provider 参考，不引入微信包或当前 API。产品继续复用现有 OCR port、Taro multipart 上传、一次性 intent 和接收端人工修正；只为既有官方 Skill harness 增加 OCR 专项运行门。
- **理由：** 当前 cboard-api 已有比候选更贴合图语家契约的 ARASAAC/OpenSymbols/Global Symbols provider、可信 URL、缓存、并发合并和来源许可；完整 AsTeRICS 产物过重，两个 Paddle 方案又依赖 Python/原生模型进程。真正未被证明的是“识别原图不落盘、文字可改、人工确认前不自动分词找图或写历史”的微信运行契约，而不是缺少另一套 OCR 引擎。
- **证据：** AsTeRICS Grid 固定提交 `ba8afe0f7051d444a4c2b95ba5e0143ff90fa09b` 完成 `6 suites / 53 tests` 与 production build，构建显示主 bundle 约 `1.28 MiB`、WASM 约 `5.07 MiB`；生成产物已精确恢复且五个候选 Git 工作树均干净。PaddleOCR 实际导入失败于缺少 `paddlex`，最小 pytest 在 60 秒内未完成；PaddleOCR-json 的原生可执行文件/模型/AVX/进程边界完成源码审阅但未伪称运行。微信 `77 files / 344 tests`、质量门 `10/10`、TypeScript、ESLint、`214 app / 32 core` 边界和 production build 通过；官方 Skill background-only OCR E2E PASS，使用真实微信临时图片、`wx.getFileInfo`、`wx.uploadFile` 和鉴权 multipart，识别文字 `我想吃苹里` 可改为 `我想吃苹果`，修正前零候选/零历史、显式生成后才建立草稿，18 项原 storage 全部恢复。完整源码依据另见 `docs/picinterpreter-open-source-reuse-review-2026-07-28.md`。
- **生效范围：** 图语家开源复用决策、源码账本待登记项、微信 OCR E2E、本地受控 API 与 npm 验证入口；不修改 production OCR 业务语义，不新增 Python/原生模型运行时，不替代真实 OCR 供应商、HTTPS 合法域名、官方性能扫描或物理真机验收。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶开发者工具窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 11:41:50。

## 变动 267：复用上游包体分析器并以模块证据保留 AAC 导入链

- **意图：** 落实微信小程序性能规则和“先拉源码、运行、测试再复用”的开发原则，判断 AAC 导入页 `295 KiB` 告警是否需要拆包，而不是凭单个构建提示从零自研或破坏成熟解析器。
- **决策：** 固定并运行 `webpack-bundle-analyzer 5.3.1` 源码提交 `97d2ef8706556f871309e63d5d13cefe4ca91d40`；在微信工程只增加开发期、显式启用的 `npm run analyze:weapp`，使用 `analyzerMode: disabled` 与 `openAnalyzer: false` 后台生成被忽略的 stats/JSON。报告证明当前没有跨输出重复模块后，保留 JSZip、Open Board、Gridset、AsTeRICS Grid 和 `fast-xml-parser` 的既有成熟链，不做无证据强拆。微信开发者工具 Skill 同步为内置 `0.3.5`，仍不把离线报告冒充官方性能扫描。
- **理由：** Taro 生产模板本身推荐该上游分析器，Webpack 5 版本与当前工程兼容；模块报告显示 AAC 体积来自真实格式能力而非重复依赖，且独立分包远低于微信 `1.5 MiB` 建议线。显式离线命令可重复、无窗口、不进入运行时，比自制扫描器、动态下载代码或深改 vendored 解析器风险更低。
- **证据：** 上游按锁文件安装成功，纯核心 `4 suites / 63 tests` 和 production build 通过；完整测试如实记录为 `84 passed / 45 failed / 4 skipped`，失败来自刻意未下载 Chrome、沙箱子进程和 Windows CRLF fixture。图语家 `npm run analyze:weapp` 全链成功，生成约 `26.9 MB` stats 与约 `92.7 KB` JSON；AAC 页 parsed `302,330 B`，其中 JSZip `96,952 B`、Gridset `67,351 B`、AsTeRICS `20,913 B`，未发现跨资源相同模块重复。微信 `77 files / 344 tests`、质量门 `10/10`、TypeScript、ESLint、`214 app / 32 core` 边界、production build 全通过；main `1,282,746 B`、AAC 分包 `650,496 B`，全部单包低于 `1.5 MiB`。完整记录见 `docs/wechat-bundle-analysis-reuse-review-2026-07-28.md`。
- **生效范围：** `cboard-wechat-poc` 的开发依赖、Yarn 锁文件、Taro 分析开关、离线报告命令和性能决策；不改变患者/照护页面、分词、匹配、图卡、语音、账号、API 或 AAC 导入结果。官方插件下载体积、官方性能评分、物理真机低内存与大文件仍待外部验收。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶微信开发者工具窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 12:16:07。

## 变动 268：审查原生录音帧候选并拒绝破坏 WechatSI 的伪实时波形

- **意图：** 继续处理微信语音活动反馈延迟，同时遵守“先拉源码、运行和测试，再决定复用”的原则，避免把识别文字更新或随机动画包装成真实音量波形。
- **决策：** 固定并审阅 MIT 许可的 `cnspica/walkie-talkie-miniprogram` 提交 `e9c76bf2368036ec42934861abe592d097974920`；只保留为原生 RecorderManager、帧消费和 Canvas 绘制参考，不接入当前 WechatSI 主识别链。微信继续显示可验证的监听/识别文字活动状态，直到 WechatSI 暴露同一会话音频帧，或产品明确改为单一 RecorderManager + 服务端 ASR。
- **理由：** 微信/Taro 契约明确 RecorderManager 全局唯一，`frameSize` 暂仅支持 MP3；候选却以 PCM 请求帧并独占该管理器。并行启动第二录音链可能覆盖回调、争抢麦克风并破坏用户已确认正常的语音识别。当前识别回调延迟是能力边界，不应通过假波形隐藏。
- **证据：** 候选源码 7 个 JavaScript 文件全部通过 `node --check`，但没有 package、自动化测试或构建脚本；`pages/talk/talk.js` 显示全局 RecorderManager、PCM `frameSize` 和 `Int16Array` 波形路径。当前 Taro recorder 类型记录全局唯一与 MP3 限制；图语家 `ReceiverWorkspace.tsx` 已明确提示“这是监听状态，不是音量波形”。微信全量 `77 test files / 344 tests` 与产物质量门 `10/10` 通过；首次沙箱内 Vitest 因 `spawn EPERM` 未启动，原命令无沙箱重跑通过。完整记录见 `docs/wechat-voice-activity-source-review-2026-07-28.md`。
- **生效范围：** 只更新开源复用证据、语音反馈决策和覆盖矩阵；不修改 CBoard、cboard-api 或微信业务代码，不改变 WechatSI、方言录音后识别、个人图卡录音、TTS、分词、匹配、图卡或历史。本轮未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 12:36:38。

## 变动 269：复用既有图片链补齐 GIF 动图上传而不引入视频体系

- **意图：** 补齐 issue #71 中已经能由现有 CBoard/Taro 图片能力承载的 GIF 动图部分，让家属上传动作图符后不再被静态压缩处理压成单帧，同时避免为尚无证据的短视频扩张 schema、播放器和包体。
- **决策：** 保留 CBoard 已有 MIT `browser-image-resizer 2.4.1` 作为 PNG/JPEG 等静态图片压缩器；GIF 在 `InputImage` 入口按 MIME 或扩展名识别并原样传递，`TileEditor` 继续走原有上传和 `image` 字段，但禁止会破坏动画的裁剪、AI 元数据识别和去背景。微信继续复用 `Taro.chooseMedia`、`getImageInfo`、`compressImage` 与既有私图生命周期：先选择原图，GIF 保留原路径，静态图片才压缩；检测或压缩失败安全回退原图。短视频继续延期。
- **理由：** 上游 `browser-image-resizer` 源码使用 Canvas `drawImage` 与 `toDataURL`，适合静态图片但会只输出 GIF 当前帧；项目现有 DTO、Taro `<Image>`、备份导入和 GIF 文件头识别已经支持同一 `image` 契约，无需复制播放器或媒体模型。AI 图像识别、裁剪和去背景都只输出静态结果，显式禁用比悄悄损坏动画更可理解。
- **证据：** 固定审阅 `ericnograles/browser-image-resizer` 提交 `c6b2c2320d97fa81df92102061a7f846c9c7c695`，`npm ci` 成功，上游没有自动化测试，production webpack build 成功并生成约 `3.49 KiB` bundle。CBoard GIF 定向 `2 suites / 17 tests / 3 snapshots`、最终全仓 `204 suites / 1421 tests / 72 snapshots` 和 production build 通过；微信最终 `77 files / 347 tests`、质量门 `10/10`、TypeScript、ESLint、`214 app / 32 core` 边界、`46 boards / 871 tiles / 798 images` 一致性和 production build 通过。微信主包 `1,282,746 B`，全部分包低于 `1.5 MiB` 建议线；AAC import 单 JS `295 KiB` 与插件下载体积仍保留为官方性能扫描事项。
- **生效范围：** CBoard Web/Electron/Cordova 的家属图卡图片入口、微信“照护设置 → 图片库维护”的个人图片选择与保存、现有图库备份/恢复和共享图片 DTO；不改变患者表达页、分词、matcher、历史、账号、API、语音或媒体 schema。浏览器和物理真机上的真实 GIF 动画、低端设备内存、许可素材和患者可理解性仍待外部验收；短视频、声音同步动作和动画编辑不在本轮范围。本轮未使用 Computer Use，未打开、激活、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 13:10:14。

## 变动 270：补齐成人照护重复中文标签的稳定翻译键

- **意图：** 修复完整 CBoard 回归发现的成人照护新增词与默认板同名时缺少稳定 `labelKey` 的质量门冲突，保证同一概念在翻译、匹配与双端图板生成中沿用既有身份。
- **决策：** 只给 `pi-core-no` 和 `pi-repair-cannot-speak` 补上仓库已经存在的官方键 `symbol.descriptiveState.no` 与 `cboard.symbol.iCantSpeak`；不改文字、发声、图片、ID、布局、匹配元数据或生成规则。微信继续从 CBoard `boards.json` 机械生成，不建立第二套修补表。
- **理由：** 重复可见中文标签若没有稳定键，会被翻译完整性测试识别为碰撞，也可能让后续语言切换和内容审计依赖文本猜测。复用既有键能表达同一概念身份，比改名、删除重复词或放宽质量门更小、更正确。
- **证据：** 首次 CBoard 全仓测试为 `203/204` 套件通过，唯一失败是 `zh-CN.communication.test.js` 报告这两个真实碰撞；补键后该套件 `19/19` 通过，最终全仓 `204/204` 套件、`1421/1421` 测试和 `72/72` 快照通过。重新生成微信资源后仍为 `46 boards / 871 tiles / 798 images`，微信全量 `77 files / 347 tests` 和 production build 通过。
- **生效范围：** CBoard 成人照护默认板的两个既有图卡、中文翻译质量门和微信生成 BoardDTO；不改变用户可见内容、分词、图文匹配、导航、包体语义、API 或持久化。未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 13:10:14。

## 变动 271：复用 Taro 原生视频能力补齐短视频动作图卡双端闭环

- **意图：** 在 GIF 动图完成后继续补齐 issue #71 的短视频部分，让家属能维护最长 10 秒的动作图卡，并使同一媒体语义经过 CBoard、微信、表达、接收和图库备份完整往返。
- **决策：** 固定并运行 Taro 4.2.0 源码，只复用 `<Video>`、`chooseMedia`、`compressVideo` 和本机文件 API；共享 DTO v1 增加可选 `mediaType/video`，图库 ZIP v1 增加可选 `videos/` 而不破坏旧备份。微信入口继续位于“照护设置 → 图片库维护”，视频 10 秒/8 MiB、封面和视频分别持久化，失败回滚；CBoard Web 复用原生 video 和现有认证媒体上传，未登录时禁止 Base64 视频；API 通用 `/media` 增加媒体白名单和 8 MiB 上限。患者板、输出和全屏接收播放，列表只显示封面。
- **理由：** Taro 已提供成熟跨平台封装，重新写播放器、引入 FFmpeg 或把 React DOM 搬进微信都会增加包体和维护成本；可选字段、封面降级与归档兼容能在不破坏图片/GIF/声音/旧数据的前提下补足动作语义。Web 禁止本地大视频又能保护浏览器存储。
- **证据：** Taro 固定提交 `f0e5c39d5f04290db975670411e23c3a396e15f8`，六个包构建和 Video `1 suite / 8 tests / 8 snapshots` 通过。CBoard 聚焦 `7 suites / 51 tests / 2 snapshots`、双向沟通 `94 suites / 737 tests / 1 snapshot` 和 production build 通过；微信 `79 files / 352 tests`、质量门 `10/10`、TypeScript、ESLint、`219 app / 32 core` 边界、默认板一致性和 production build 通过，主包 `1,285,089 B`。API 纯校验 `2/2` 通过，请求级无令牌 `403`、未知类型 `400`，有效图片/视频在本机旧 Blob 配置处同为 `500`，未伪称云存储全链通过。
- **生效范围：** CBoard Web 图卡编辑/显示、共享 DTO/匹配/接收/归档、cboard-api 通用媒体安全边界、微信个人图卡维护/表达/接收/备份；不改变分词、匹配权重、语音、AI、账号同步或支付。浏览器真实上传、生产 Blob、Cordova 视频选择、微信物理真机、官方性能扫描、低端机和患者可理解性仍待验收。本轮未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-28 14:38:43。

## 变动 272：复用 CBoard 原生公共板补齐微信受控整板贡献

- **意图：** 补齐 #10/#11/#19 中个人图卡只能留在本机或导入公共内容、无法由家属主动贡献一块完整沟通板的缺口，同时避免自建第二套公共图库后端。
- **决策：** 直接复用 CBoard 账号、`/media`、`/board` 创建/更新/删除及公共板链接；共享纯核心只发布所选 `device_private_board_` 根板和可达个人子板，拒绝内置/导入/缺失链接，限制为 100 板/5000 图卡并去重媒体。已有公开许可原样保留，个人素材在家属声明权利和署名后使用 CC BY 4.0。微信先创建全部私有草稿、上传媒体，再先子板后根板公开；失败逆序删除。入口只位于“照护设置 → 图片库维护”，要求权利、隐私和最终模态框三重显式确认。本条将表格中 #10/#11/#19 的“公开上传尚未实现”更新为“受控整板公共贡献已有代码/测试/build 闭环；逐图审核型投稿仍未实现”。
- **理由：** CBoard 已有成熟公共板协议和全平台消费能力，薄编排比新增服务、数据库和审核体系更符合底座复用原则；私有草稿与根板最后发布可缩短断链可见窗口，显式授权又能防止患者误触和家庭媒体误上传。整板发布不等于逐图投稿治理，后者继续等待可复用的审核/申诉契约。
- **证据：** 本地源码账本固定 CBoard 参考提交 `e68e47307a29630468257ed94a39a5c0f825eee5`；CBoard 发布纯核心 `1 suite / 5 tests` 通过。微信 port/service/placement 聚焦 `3 files / 8 tests`，最终全量 `82 files / 360 tests`、质量门 `10/10`、TypeScript、ESLint、`226 app / 32 core` 边界和 production build 全通过；主包 `1,285,089 B`，所有分包低于 1.5 MiB。完整决策见 `docs/cboard-public-board-publication-reuse-2026-07-28.md`。
- **生效范围：** CBoard communicationSupport 共享纯核心、微信家属图片库维护、现有 cboard-api 通用板/媒体接口；不进入患者表达页，不新增 API/schema，不自动发布，不改变分词、matcher、语音、AI、历史、私有备份或支付。真实生产 Blob/HTTPS/账号、公网发布、官方性能扫描、物理真机弱网与中断仍待外部验收；逐图审核投稿继续延期。本轮未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 15:28:09。

## 变动 273：公共板贡献补齐账号所有者管理生命周期

- **意图：** 继续收口变动 272，使家属发布后能够找到同一账号的全部公共板，并明确执行取消公开或永久删除，而不是只得到一次性链接后失去管理入口。
- **决策：** 机械复用 CBoard Web “All My Boards” 的公开切换/删除语义和 cboard-api 现有 `byemail/update/delete` 所有者接口；微信按 100 条分页读取账号板并只显示公开项，列表同时覆盖 Web 与微信发布来源。取消公开切换 `isPublic=false`；永久删除使用独立红色确认，提示其他板链接可能断开、本机板和他人下载副本不会被删除。不新增发布记录表、专用 endpoint 或微信私有云索引。
- **理由：** 成熟 CBoard 已经具备账号所有权和可见性生命周期，直接复用能避免双源状态与跨端不一致。取消公开可逆、删除不可逆，分开操作和说明比单一“撤回”按钮更诚实，也不会把逐图审核治理伪装成已完成。
- **证据：** 微信聚焦 `4 files / 13 tests`、最终全量 `83 files / 365 tests`、质量门 `10/10`、TypeScript、ESLint、`228 app / 32 core` 边界与 production build 全通过；backup 分包 `649,483 B`，低于 1.5 MiB。cboard-api 既有板所有权单元测试 `8 passing`；`GET /board/byemail/{email}` 的现有集成测试源码覆盖用户读取自己成功、读取他人 `403`。决策文档已追加 `docs/cboard-public-board-publication-reuse-2026-07-28.md` 变动 4。
- **生效范围：** #10/#11/#19 的受控整板公共贡献生命周期、微信家属图片库维护和现有 CBoard/cboard-api 所有者协议；不进入患者表达页，不修改 API/schema，不远程删除他人副本、本机个人板或未选择的子板，不改变分词、matcher、语音、AI、同步、历史或支付。真实生产公网账号、Blob、弱网中断、官方性能扫描和物理真机仍待验收；逐图审核投稿继续延期。本轮未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 19:03:51。

## 变动 274：离线 ASR 候选完成源码安装实测并维持平台边界

- **意图：** 在变动 131 的静态技术选型基础上，真正拉取、安装、运行 sherpa-onnx，并验证它是否能直接补入 CBoard Web 或微信，而不是把“支持 WebAssembly/移动端”误写成“可直接复用”。
- **决策：** 固定官方 sherpa-onnx 提交 `75e1fc31e747194c546787ec7b40a7e0b390dc4b`，完成 Node 包安装、模块加载、WASM/Android/iOS 源码审阅和模型 HEAD 体积核验。结论仍为：Web/Cordova 保留现有设备内识别端口；微信不集成 sherpa-onnx、Vosk 或空适配器，完全断网语音继续如实标记未实现。
- **理由：** 官方运行时和模型需要独立交付，不能等同于轻量 JS 库。直接塞入 Taro 会突破包体门并引入尚未验证的 Emscripten 文件系统、音频线程、模型下载、校验、缓存和低端机资源问题；自行写原生桥接又违反优先复用成熟实现的原则。
- **证据：** `sherpa-onnx@1.13.4` 安装与 `require` 成功；包共 13 文件/`21,336,771 B`，WASM 单文件 `21,024,877 B`，且无测试脚本。两个官方中英流式模型 HEAD 分别为 `511,274,346 B` 和 `458,187,351 B`。Android 示例明确从 assets 或内部存储加载模型；WebAssembly 构建明确预载模型。完整记录见 `docs/offline-asr-source-review-2026-07-28.md`。
- **生效范围：** 覆盖矩阵 #17、Web/Cordova/微信语音技术边界、源码账本和后续原生 App 进入条件；不修改任何业务代码、依赖、API 或 schema，不声称真机离线识别已经完成。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-28 19:15:05。

## 变动 275：TouchChat 压缩图片与录音候选完成三源运行审查

- **意图：** 继续补齐 TouchChat `.ce` 中尚未恢复的压缩/专有图片和按钮录音，但只在找到可运行、可解释、可合法复用的公开实现时接入，避免从零猜测供应商格式。
- **决策：** 固定并本地运行 Node AACTools、Bravo AAC 和 Python AACTools 三个公开来源；保留现有 `.c4v + Images.c4s` RID 关联和 PNG/JPEG 恢复，不新增压缩载荷 decoder、声音伪适配器或第二套 Python 服务。完整证据见 `docs/touchchat-compressed-media-source-review-2026-07-28.md`。
- **理由：** Node AACTools 当前明确将图片 helper 留空，且没有从真实 `.ce` 恢复音频；Bravo 最新版仍只识别原始 PNG；Python 可选图片工具查询的表和字段不符合真实 `Images.c4s` schema。错误图片匹配会直接改变患者表达含义，不能以猜测实现。
- **证据：** Node AACTools build 成功、TouchChat 定向 `7 suites / 40 tests` 通过；公开 `example.ce` 的 `symbols` 表为 0 行。Python TouchChat 主逻辑 `7 passed`，另有 1 个 Windows 文件句柄未关闭的 teardown 错误。GitHub 对 schema 和 `compressed` 字段组合的主代码检索未找到可运行公开 decoder。
- **生效范围：** 覆盖矩阵中的 TouchChat 媒体边界、源码账本和后续进入条件；不修改 CBoard、cboard-api 或微信业务代码，不影响既有文字、布局、导航、PNG/JPEG 和大型词库导入。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶任何窗口，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 19:40:59。
## 变动 276：cboard-api 标准测试入口跨平台化

- **意图：** 消除 `cboard-api` 标准测试命令在 Windows 上无法解析 POSIX 环境变量写法的真实基线缺口，使图语家选择 CBoard 作为全平台底座的工程验证命令本身也可跨平台运行。
- **决策：** 继续复用仓库现有 Node 与 Mocha，不新增 `cross-env` 或 lockfile 改动；用 `scripts/runControllerTests.js` 在子进程环境设置 `NODE_ENV=test` 并转发退出码。`npm test` 保持完整控制器套件，新增 `npm run test:unit` 作为无需外部服务的快速门。
- **理由：** shell 环境变量语法是平台差异，不是业务失败；把纯单元门和 Mongo/邮件/第三方集成门分开，既能快速验证图语家业务回归，也不会把外部环境缺失误报成代码问题或把单元测试冒充完整联调。
- **证据：** Windows 上启动器成功进入 Mocha，`npm run test:unit` 为 `374 passing`；Node 语法、仓库现有 Prettier 与 `git diff --check` 通过。完整套件已越过旧语法错误并暴露既知 Mongo、邮件和 IPInfo 环境缺失，未伪称全绿。
- **生效范围：** `cboard-api/package.json`、跨平台控制器测试启动器和后续基线验收口径；不改变 API 业务、依赖、lockfile、CBoard Web 或微信代码，也不替代隔离 Mongo 和真实供应商联调。
- **记录：** Codex（GPT-5.6），2026-07-28 20:04:08。

## 变动 277：issue #22 历史复盘完成度重新核验

- **意图：** 核对历史变动中“从历史列表直接编辑任意旧接收记录仍未完成”的旧时点描述，防止已经落地的照护者复盘闭环被重复实现，或因原 issue 的云同步文字误把设备私有纠错审计上传为普通账号明文数据。
- **决策：** 以 issue #22 当前正文、覆盖矩阵顶部主表、当前 Web/微信源码和测试为准；确认会话分组、任意 confirmed receive 的替换/删除/重排/插入、追加式 `receiverCorrections`、原记录只读、表达候选评价切换/取消及后续 AI 上下文消费均已实现。候选反馈继续随既有历史设置同步；原始纠错审计继续保持设备私有，仅在用户显式执行端侧加密完整私有数据备份时迁移，不新增普通明文纠错同步 API。
- **理由：** 历史变动记录描述的是当时状态，不能覆盖后续实现证据；同时 issue 的“纳入下次云同步”早于当前隐私分层决策。纠错日志包含原文、前后图片序列和家庭使用规律，把它放入普通账号事件同步会削弱已经建立的设备私有边界，而现有加密完整快照已提供用户主动的跨设备迁移路径。
- **证据：** GitHub API 在线读取 issue #22 正文和评论；Web `CommunicationManagementDialog`、`receiverLifecycle`、`conversationSession`、`communicationAi` 与 Settings sync 定向 `5 suites / 40 tests` 通过；微信 `historyReceiverReview`、management、AI port 与 cloud sync 定向 `4 files / 25 tests` 通过。源码证明 `buildConversationContext` 从已确认表达的 `candidates[].feedback` 构建 AI 上下文，历史接收修正只追加 `caregiver_history_review` 前后快照且不调用历史覆盖写入。
- **生效范围：** issue #22 的完成度口径、CBoard Web/微信照护历史和隐私同步边界；不改变当前业务代码、普通账号同步、端侧加密快照或患者 UI，不把单元测试冒充真实账号、多设备或物理真机验收。
- **记录：** Codex（GPT-5.6），2026-07-28 20:11:11。

## 变动 278：cboard-ai-engine 重新运行与源码账本收口

- **意图：** 重新验证 CBoard 官方 AI Engine 是否有尚未接入但适合图语家核心链的成熟能力，并用本地运行证据而不是仓库介绍决定复用边界。
- **决策：** 保留本地 AI Engine 的 Global Symbols v2/许可/Core Board 修复成果，继续选择性复用已进入 `cboard-api` 的 ARASAAC 排序、AAC 生图提示和许可策略；整包保持独立 `source_reviewed / not_integrated_reference`，不通过本地 `file:`、复制源码或客户端依赖硬接。只有正式可安装修复版或稳定服务端建板契约出现时，才用薄 adapter 把草稿送入既有 OBF/OBZ 复核门。
- **理由：** 整板主题生成是照护者低频建板能力，不是患者表达、照护者接收、分词或缺词补图的运行依赖；当前引擎仍使用 OpenAI SDK v3 和进程全局配置，直接接入会重复并绕过 API 已有认证、限流、月额度、用量和审核边界。
- **证据：** 本地 `cboard-ai-engine@1.9.0` 实际完成 `6/6` 测试、TypeScript、CJS/ESM/DTS production build；npm registry 确认 latest `1.9.0`，GitHub 公开页面显示公开仓库、189 commits 和 2025-04-09 的 `1.9.0` release。Git fetch 仍被本机 Schannel 凭据阻断，未伪称 refs 已同步。
- **生效范围：** 三仓复用完成度、AI Engine 源码账本和未来建板 adapter 条件；不改变现有 AI/语音/分词/图源业务，不新增依赖、路由、UI、密钥、部署、提交、推送或预览。
- **记录：** Codex（GPT-5.6），2026-07-28 20:15:46。

## 变动 279：Cordova 语音双仓复核并修复 Android 连续播报回调串线

- **意图：** 核对 CBoard 官方/既有 Cordova 语音仓库是否已被真实运行和正确接入，并修复会直接影响图语家多图、候选句和整句连续朗读的原生队列缺陷，而不是为 Web、微信和原生端再写一套语音实现。
- **决策：** 设备内识别继续复用 MIT `cordova-plugin-speechrecognition` fork：Android/iOS 只在系统明确支持时启用设备内模式，微信保持 WechatSI，服务端粤语 ASR 保持 cboard-api。Android TTS 继续复用 GPL `cboard-speech-tts`，但将单一全局 Cordova 回调改为按 `utteranceId` 隔离；取消、停止、关闭和销毁时收口未完成任务，初始化未完成时通过既有错误通道安全失败。`ccboard` 隔离构建器新增本地 TTS 参数，临时移除远程旧声明后安装同级 fork；正式依赖和 lockfile 不改。
- **理由：** 原 TTS 每次 `execute` 都覆盖同一个 `callbackContext`，后一句或引擎查询可能夺走前一句完成事件，使上层依赖 `onend` 的表达队列停住或错序；按 Android 已有 ID 关联是最小修复。Cordova Android/iOS、浏览器、微信和服务端各自已有成熟平台能力，跨平台统一应发生在端口和语义层，而不是把 Android Java 插件搬进 Taro 或后端。
- **证据：** `cboard-speech-recognition` 既有 Node `4/4` 通过，并已有 Cordova 14/API 35 最小 Debug APK 编译证据；`cboard-speech-tts` 原 `npm test` 确认因缺少 `spec/` 不构成有效证据，改为 Node 内置回归后 `4/4` 通过。最小 Cordova 14/API 35 工程成功安装本地 TTS fork，Gradle `:app:compileDebugJavaWithJavac` 明确 `BUILD SUCCESSFUL`；完整离线 APK 组装在 Java 编译后仅因未缓存 `lint-gradle:31.7.3` 停止，未伪称产出。`ccboard` 构建器/包装测试 `10/10` 通过，源码账本已登记并回读两个仓库。
- **生效范围：** CBoard Android Cordova 的原生 TTS 队列、取消/销毁生命周期、设备内识别与无 Firebase 核心调试构建入口；不改变 CBoard Web 浏览器 TTS、微信 WechatSI、cboard-api 服务端 TTS/ASR、分词、matcher、历史、账号或 UI。Android 真机普通话队列/取消、设备内语言包与 iOS 仍待物理设备验收；本轮没有使用 Computer Use，没有打开、聚焦或置顶开发者工具，没有提交、推送、预览、上传、发布或部署。
- **记录：** Codex（GPT-5.6），2026-07-28 21:45:00。

## 变动 280：重新核验匿名数据合并与完整私有数据迁移边界

- **意图：** 纠正 #46 主表仍写“私图显式迁移未决”的旧状态，避免后续重复开发已经存在的账号私有快照，也避免把登录后的普通同步误解为自动上传家庭图片和纠错记录。
- **决策：** 普通账号合并继续只处理既有白名单数据并排除私图、纠错和录音；跨设备完整迁移继续复用已经落地的 `LocalDeviceData v1`、`PictureLibraryArchive v1`、`PIE2EE01` 端侧加密和 cboard-api 独立私有 Blob 契约。上传必须由用户在独立低频入口输入自持密码并显式触发，下载后必须先解密检查并再次确认，才执行事务恢复。
- **理由：** 登录不是敏感数据上传授权；把普通合并和完整私有快照分成两个动作，既能保留低摩擦账号同步，也能让服务端只看见密文并让用户掌握迁移时机。当前实现已经覆盖该边界，继续新增第二套迁移协议只会制造重复状态和隐私歧义。
- **证据：** CBoard Web 已包含 `/communication/private-device-data` API adapter、完整私有数据导出/导入 UI、密码输入及删除入口；微信已包含 `taroPrivateDeviceDataCloudPort`、compact `account-private-snapshot`、上传前内容摘要、下载解密检查和恢复二次确认。CBoard 聚焦测试 `7 suites / 86 tests / 4 snapshots`、微信聚焦测试 `3 files / 31 tests` 全通过；cboard-api 路由测试对独立完整私有数据的元数据、上传、下载和删除为 `4 passing`。微信沙箱内 Vitest 首次因 Windows Vite `spawn EPERM` 未启动，按相同命令在沙箱外重跑通过；CBoard 首次经 npm 转发参数未进入目标测试并等待超时，改用仓库现有 CRACO 的 `--runTestsByPath` 后通过，两者都不记为业务失败。
- **生效范围：** 覆盖矩阵 #46、CBoard Web 与微信的账号私有数据迁移完成度口径；不改变普通账号同步白名单、加密格式、API schema、患者 UI、默认图库、分词、matcher、语音或生产部署。本轮没有使用 Computer Use，没有打开、聚焦、抬升或置顶开发者工具窗口，没有提交、推送、预览、上传、发布或部署。
- **记录：** Codex（GPT-5.6），2026-07-28 21:09:06。

## 变动 281：Gridset ZIP 平台端口与微信 AAC 分包减重

- **意图：** 保留 CBoard 成熟 Gridset 导入能力，同时消除 Web 专用 JSZip 被静态带入微信主包和 AAC 页面约 `295 KiB` 的构建提示，为后续 AAC 格式扩展保留包体余量。
- **决策：** CBoard 共享 `convertGridsetToOpenBoardDocuments` 改为显式接收受限只读 ZIP adapter；Web 继续使用 JSZip，微信复用既有 fflate ZIP 扫描器；vendored AACTools 源码版和兼容版 resolver 只依赖纯 `symbolReference`；微信开启 Taro 官方 `mini.optimizeMainPackage.enable`。不删除 Gridset、不复制解析器、不采用 Taro 中未产生异步块的动态 `import()` 方案。
- **理由：** ZIP 解包是平台能力，Gridset 转 Open Board 才是共享业务核心。依赖注入可以让 Web、微信和未来 Cordova 各用合适实现，同时由一处共享核心执行路径、条目数、单条目和总解压限制；这比删功能、自研 ZIP 或保留隐式 JSZip 更安全、更易维护。
- **证据：** 最终 Bundle Analyzer 为 `jszip=false / 9778=false / fflate=true`；main 从中间异常的 `1,384,051 B` 回落到 `1,285,089 B`，AAC 分包由基线 `652,021 B` 降到 `554,555 B`。CBoard 全量 `205 suites / 1435 tests / 72 snapshots`；微信全量 `83 files / 365 tests`、质量门 `10/10`、TypeScript、ESLint、`229 app / 32 core` 边界和 production build 全通过。fflate `0.8.3` 固定提交 `dcb3714a6c25db3a2748641019c5277413d09714` 的依赖安装和 TypeScript 编译通过；官方全套测试受 Windows POSIX 脚本和外部大样本下载限制未完成，未夸大为通过。
- **生效范围：** CBoard Web Gridset 导入、微信 AAC 导入分包、共享 Gridset 核心和生产包依赖归属；不改变 OBF/OBZ/GRD/Snap/TouchChat 业务语义，不改变患者表达、接收、matcher、分词、语音、账号或 API。插件体积仍待微信官方性能扫描；未使用 Computer Use，未打开、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 22:01:33。详见 `docs/wechat-aac-import-package-optimization-2026-07-28.md`。

## 变动 282：公共图卡逐图投稿完成双上游源码与运行审查

- **意图：** 复核 #10/#11/#19 中“逐图审核型公共图库投稿仍未实现”的原因，优先寻找可直接复用的成熟开源闭环，而不是从零增加上传按钮、数据库和运营后台。
- **决策：** 固定 OpenSymbols 提交 `6469116eb08b654acca7e6a3dfa172d679ada621` 与 ARASAAC Public API 提交 `722c6b2e45e9241b7f8389955abe932dcad24b0d`；继续复用两者的读取、搜索、来源和许可能力，但不调用 OpenSymbols 管理员写接口，不把 ARASAAC 只读图卡 API 或短语纠错报告包装成公众投稿。当前公共贡献仍以已完成的 CBoard 整板受控发布为准，逐图投稿保持主动延期。
- **理由：** OpenSymbols 的符号/仓库写操作要求管理员令牌，requests 控制器为空；ARASAAC v2 图卡与素材接口全部为 GET，v1 唯一相关 POST 是自然语言转换纠错报告。两者均没有可直接复用的贡献者身份、逐图审核、敏感内容处理、申诉和传播副本撤回契约。
- **证据：** OpenSymbols 路由、鉴权、控制器和 MIT 许可源码已审阅；本机没有 Ruby/Bundler，因此未冒充 Rails 运行通过。ARASAAC `npm ci`、TypeScript build 通过；默认测试暴露旧 Mongo 下载器 HTTPS 兼容问题，改用隔离 Mongo 后模型套件通过、控制器因当前路由装配返回 404，最终 `1 passed / 3 failed suites`、`3 passed / 5 failed tests`，临时容器已删除。完整记录见 `docs/public-pictogram-contribution-upstream-source-review-2026-07-28.md`。
- **生效范围：** #10/#11/#19 的完成度口径、公共图库来源策略、源码账本和未来进入条件；不改变 CBoard、cboard-api、微信业务代码，不影响自定义私图、缺词维护、在线候选人工确认、结构化图库或整板公共发布。本轮未使用 Computer Use，未打开、聚焦、抬升或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 22:30:32。

## 变动 283：微信图库备份修复声音与视频恢复额度串线

- **意图：** 补齐 #24/#71 已有图片、录音、短视频恢复闭环中的安全缺陷，防止大量合法单文件录音绕过总量门，也防止视频错误消耗声音额度。
- **决策：** 完整复用 `PictureLibraryArchive v1`、共享 manifest、fflate ZIP 扫描、微信 restore session 和既有 5/20 MiB 声音、8/40 MiB 视频限制；只把声音累计检查移回 `sounds/` 分支，视频继续只检查视频总量。新增真实压缩 ZIP 回归，不新增格式、依赖、API 或 UI。
- **理由：** 原实现把 `totalSoundSize += data.byteLength` 错放在视频分支，导致声音不累计、视频双重累计。已有开放格式和平台端口已经覆盖媒体迁移，修正分支比新增第二套恢复器或媒体库更符合底座复用原则。
- **证据：** 5 段各 `4 MiB + 1 B` 的合法 MP3 在总量超过 20 MiB 时事务拒绝且本机板不变；3 段各 7 MiB 的合法 MP4 在 21 MiB 时成功恢复并保留本机板。聚焦 `1 file / 22 tests`、全量 `83 files / 367 tests`、质量门 `10/10`、TypeScript、修改文件 ESLint、`229 app / 32 core` 边界和 production build 全通过；main `1,285,089 B`、backup `649,483 B`，全部包低于 1.5 MiB。完整记录见 `docs/wechat-picture-library-media-restore-limit-fix-2026-07-28.md`。
- **生效范围：** 微信普通图库 ZIP、完整本机 ZIP、私人图片快照与完整私有数据快照解密后的媒体恢复；不改变导出、单文件上限、CBoard Web、患者表达、matcher、语音、账号或 API。物理双机、低存储和真实云仍待外部验收；本轮未使用 Computer Use，未置顶、聚焦或抬升开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 22:46:55。

## 变动 284：CBoard Web 图库媒体额度与微信安全边界对齐

- **意图：** 补齐 #24/#45/#71 在 Web 端的媒体资源边界，避免同一 `PictureLibraryArchive v1` 在微信有界、在浏览器却可无界解压并转成 Base64。
- **决策：** 继续复用 JSZip、共享 manifest 和既有事务恢复；Web 导出与恢复统一执行图片 `2 MiB`、声音 `5/20 MiB`、视频 `8/40 MiB` 限制，manifest 声明大小必须与真实媒体字节一致。声音和视频使用独立累计器，不改归档版本、UI、依赖或 API。
- **理由：** JSZip 官方明确说明 `async()` 会在内存中保留完整结果，字符串还会扩大内存占用；微信端同一阈值已经形成代码、测试和真实 ZIP 证据。对现有 adapter 做最小有界校验比引入第二套压缩器或 Web 私有格式更符合底座复用原则。
- **证据：** Web 真实 ZIP 回归证明五段各 `4 MiB + 1 B` 的录音在导出和恢复阶段均因超过 20 MiB 被拒绝，三段各 7 MiB 的视频合计 21 MiB 可成功恢复且不占用声音额度；聚焦 `2 suites / 17 tests`、全量 `205 suites / 1438 tests / 72 snapshots`、Prettier 和 production build 全通过，Service Worker 生成约 `41.8 MB / 1010 resources` 预缓存。完整记录见 `docs/cboard-web-picture-library-media-limit-alignment-2026-07-28.md`。
- **生效范围：** CBoard Web 普通图库、完整本机备份和两个端侧加密私有快照生成/解密后的恢复；不改变微信本轮已修复逻辑、患者 UI、matcher、分词、语音、账号或 API。真实低内存浏览器、大图库、系统文件选择和跨设备仍待外部验收；未使用 Computer Use，未打开、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 23:00:22。

## 变动 285：cboard-api 隔离 Mongo 真实 HTTP 主链联调

- **意图：** 将账号、Settings 和接收记录从代码/单元证据推进到真实 Node + Mongo + HTTP 运行证据，确认图语家双向沟通服务端闭环可实际启动和持久化。
- **决策：** 不改仓库默认配置，临时使用预检通过的 `127.0.0.1:19010` 与退出即删除的 `mongo:4.4` 容器 `127.0.0.1:27027`；直接复用仓库 seed、Settings、receiver sync 和 readiness verifier。验证结束后只停止本轮 API PID `10768` 和隔离容器。
- **理由：** 真实 Bearer token、Swagger、Mongo 索引和版本化文档往返比 controller stub 更能证明前后端分离架构可用；隔离端口和数据库又不会污染本机其他服务。默认 `10010` 位于 Windows 动态范围，本轮不把临时端口写回产品配置。
- **证据：** `/health` 为 HTTP 200 且 `database=connected`、`communicationIndexes=ready`，`/docs/` 为 HTTP 200；Settings 通过旧 `tuyujia` 读取和中性/旧键双写回读；receiver sync 通过认证创建、并发冲突、追加反馈、结构化墓碑、防复活和同时反馈重试；readiness 通过。完整 `npm test` 在 604 秒内无终态；旧分组诊断又因并行默认 `10010`、GPT/IPInfo 外部依赖得到 `5 passing / 7 failing`，不冒充全量通过或核心业务失败。完整记录见 `docs/cboard-api-local-runtime-integration-2026-07-28.md`。
- **生效范围：** cboard-api 本地运行证据、CBoard Web/微信共用 Settings 与 receiver-records 服务端闭环；不证明真实 SMTP、短信、AI、IPInfo、Azure、HTTPS、合法域名或两台真机。源码账本仍为 `0 errors / 83 existing warnings`；未使用 Computer Use，未打开、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 23:22:39。

## 变动 286：PictureLibraryArchive v1 完成 Web 与微信双向实现互操作验证

- **意图：** 补齐先前 Web 自往返、微信自往返无法证明两套 ZIP 实现真正互通的证据缺口，确认图语家家庭图库可在 CBoard Web 与微信之间迁移。
- **决策：** 不改归档格式或生产业务；在独立 `tests/interop` 中直接连接 CBoard Web `JSZip 3.10.1` 的真实 build/read adapter 与微信 `fflate 0.8.3` 的生产 build/restore service。Web→微信验证图片、录音、短视频落盘，微信→Web 验证三类媒体恢复为原始字节对应的 data URI；旧“cross-platform”微信自往返用例改为准确名称。
- **理由：** 同实现自导出、自恢复只能证明自身往返，手工 fixture 又可能复制同一个错误。双向调用真实 adapter 能在不把 React DOM、Material UI 或 JSZip 带入微信生产包的前提下，证明共享 manifest、媒体路径、压缩条目和 BoardDTO 恢复契约一致。
- **证据：** 聚焦 `2 files / 24 tests`，微信全量 `84 files / 369 tests`、质量门 `10/10`、TypeScript、应用源码与新增测试 ESLint、`229 app / 32 CBoard core` 边界及 production build 全通过。main `1,285,089 B`、backup `649,483 B`，全部包低于 1.5 MiB；798 张图共 `986,160 B` 只存一份。fflate 源码账本固定提交 `dcb3714a6c25db3a2748641019c5277413d09714`，账本校验 `0 errors / 83 existing warnings`。完整记录见 `docs/picture-library-archive-cross-platform-interoperability-2026-07-28.md`。
- **生效范围：** #24/#45/#71 的 Web/微信离线图库迁移工程证据、微信 Vitest 发现范围和独立互操作测试；不改变归档 v1、媒体额度、冲突策略、UI、API、schema、依赖或生产包。两台物理设备、系统文件选择、低存储、真实云和端侧加密密码迁移仍待外部验收；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 23:38:28。

## 变动 287：PIE2EE01 端侧加密完成 Web 与微信双向 adapter 互操作验证

- **意图：** 补齐两个账号私有快照只在各端自加解密、尚未直接证明 Web Blob 与微信字节 adapter 能互相恢复的证据缺口。
- **决策：** 不改共享密码学或生产代码；在独立 `tests/interop` 中直接连接 Web `encrypt/decryptPrivateArchiveBlob` 与微信 `encrypt/decryptPrivateArchiveData`。两个方向都使用真实 `PIE2EE01`、Noble `scrypt + XChaCha20-Poly1305`、header AAD 和认证解密；确定性随机只用于 fixture。Node 环境按既有 Taro adapter 单测模式 mock 未调用的宿主 `getRandomValues`。
- **理由：** 两端共用纯核心仍不能自动证明 Blob/Uint8Array 类型转换和 wrapper 内容类型没有截断或重编码；私有快照可能由任一端创建并由另一端恢复，双向 adapter 测试比单端自往返更接近真实跨设备迁移，同时避免自研第二种加密格式。
- **证据：** Web 密文由微信恢复、微信密文由 Web 恢复，原始 ZIP 字节完全一致；密文有 `PIE2EE01` 且无 ZIP magic，跨 adapter 错误密码保持 `PRIVATE_ARCHIVE_DECRYPTION_FAILED`。聚焦 `1 file / 3 tests`，最终微信全量 `85 files / 372 tests`、质量门 `10/10`、TypeScript、应用源码与新增测试 ESLint、`229 app / 32 CBoard core` 边界和 production build 全通过。包体不变，main `1,285,089 B`、backup `649,483 B`；源码账本仍为 `0 errors / 83 existing warnings`。完整记录见 `docs/private-archive-encryption-cross-platform-interoperability-2026-07-28.md`。
- **生效范围：** 隐私分层、#46/#47、私人图片与完整私有数据两个账号快照的 Web/微信离线互操作工程证据；不改变密码长度、信封、API/schema、Blob、UI、依赖或生产包。真实 Azure/Mongo/HTTPS、合法域名、两台物理设备和人工密码交互仍待外部验收；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 23:47:42。

## 变动 288：账号完整私有快照完成双向组合链互操作验证

- **意图：** 把 #46/#47 从“ZIP adapter 互通”和“PIE2EE01 adapter 互通”两组分散证据推进到用户实际执行顺序，证明带 LocalDeviceData sidecar 的完整私有快照可跨 Web 与微信迁移。
- **决策：** 完全复用现有 `PictureLibraryArchive v1 custom`、`account-private-snapshot` purpose、LocalDeviceData sidecar、Noble `PIE2EE01`、Web JSZip/Blob adapter 和微信 fflate/Uint8Array service。Web→微信执行 JSZip 生成→Web 加密→微信解密→fflate 事务恢复；微信→Web 执行 fflate 生成→微信加密→Web 解密→JSZip 解析合并。fixture 使用真实常用语 sidecar，不增加测试专用格式或生产分支。
- **理由：** 单独通过归档和加密互操作仍无法排除组合层的内容类型、字节转换、sidecar purpose、身份重绑定与合并差异；完整快照的可信证据必须覆盖真实组合链，而不是由若干局部测试推断。
- **证据：** 聚焦 `1 file / 4 tests`；Web 密文私有快照在微信事务恢复后写入“Web 私有常用语”，微信密文私有快照在 Web 恢复后包含“微信私有常用语”且 `savedPhraseCount=1`。最终微信全量 `85 files / 374 tests`、质量门 `10/10`、TypeScript、应用源码与互操作测试 ESLint、`229 app / 32 CBoard core` 边界和 production build 全通过；main `1,285,089 B`、backup `649,483 B`，生产包体不变。完整记录见 `docs/private-archive-encryption-cross-platform-interoperability-2026-07-28.md` 变动 4。
- **生效范围：** #46/#47、完整私有数据账号快照和 Web/微信离线迁移工程证据；不改变普通账号同步、私人图片独立快照、密码、信封、API/schema、UI、依赖或生产包。真实云、HTTPS、合法域名、两台物理设备、错误密码交互、弱网与并发覆盖仍待外部验收；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-28 23:53:38。

## 变动 289：私人图片账号快照完成双向加密组合链互操作验证

- **意图：** 为 #46/#47 的另一块独立账号私有数据补齐真实组合证据，确认家庭私图并非只恢复元数据，而能携带实际图片字节在 CBoard Web 与微信之间双向迁移。
- **决策：** 完全复用现有 `PictureLibraryArchive v1 custom`、设备私有偏好、`PIE2EE01`、Web JSZip/Blob adapter 和微信 fflate/Uint8Array service。Web→微信与微信→Web 均按生成 ZIP、端侧加密、对端解密、对端恢复/读取的真实顺序执行；归档继续使用既有 `images/custom/`，不新增格式、生产逻辑或依赖。
- **理由：** 上一轮完整私有快照重点证明 LocalDeviceData sidecar，不能替代私人图片独立快照；图像还涉及 data URI、本地文件路径、媒体落盘、attribution 和当前身份重绑定，必须单独验证才能防止“记录存在但图片不可显示”。
- **证据：** 聚焦 `1 file / 6 tests`；Web 私图密文在微信恢复为 `wxfile://restored/images/custom/` 且 PNG 字节逐字节一致，微信私图密文在 Web 读取为 `data:image/png;base64,iVBORw0KGgo=`，两个方向均保持 attribution 和当前身份。最终微信全量 `85 files / 376 tests`、质量门 `10/10`、TypeScript、应用源码与互操作测试 ESLint、`229 app / 32 CBoard core` 边界和 production build 全通过；main `1,285,089 B`、backup `649,483 B`，生产包体不变。完整记录见 `docs/private-archive-encryption-cross-platform-interoperability-2026-07-28.md` 变动 5。
- **生效范围：** #46/#47、私人图片独立账号快照和 Web/微信离线迁移工程证据；不改变普通账号同步、完整私有数据 sidecar、密码、信封、API/schema、UI、依赖或生产包。真实云、HTTPS、合法域名、两台物理设备、低存储和人工密码交互仍待外部验收；未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 00:00:38。

## 变动 290：两个账号私有快照完成真实 API、Mongo 与 Blob 双向跨端联调

- **意图：** 把 #46/#47 从离线 ZIP、加密 adapter 和组合链互操作推进到真实前后端分离路径，确认 CBoard API 能在不接触密码与明文的前提下承载图语家私有快照。
- **决策：** 复用 Web/微信既有 `PIE2EE01`、生产 cloud port、cboard-api 认证路由、Mongo 模型和 Azure Blob helper；使用来源审查通过的官方 Azurite `v3.35.0` 做一次性协议门。修复私有容器创建时误把 SDK 解析值 `off` 作为 `x-ms-blob-public-access` 请求值的问题，改为省略公共访问头并保留 `private, no-store`。新增 `PRIVATE_ARCHIVE_CLOUD_E2E=1` 显式门控的双向真实集成测试，默认离线测试不访问外部服务。
- **理由：** 私有容器的真实认证、multipart、Mongo 元数据、Blob 二进制往返和对端解密不能由 controller stub 推断；Azure REST 规定省略公共访问头即私有，`off` 不是合法公开值。最小修复共用现有 Blob helper，比新增测试专用存储或第二套 API 更符合底座复用原则。
- **证据：** Web 图片快照→API/Mongo/Blob→微信解密与微信设备数据快照→API/Mongo/Blob→Web 解密均逐字节通过，显式集成 `1 file / 2 tests passed`；明文 ZIP 为 400，元数据不含 Blob URL，删除后为 404。API `374 passing`；微信默认全量 `85 files passed / 1 skipped`、`376 tests passed / 2 skipped`，质量门 `10/10`、TypeScript、ESLint、`229 app / 32 CBoard core` 边界和 production build 全通过。完整记录见 `docs/private-archive-cloud-cross-platform-integration-2026-07-29.md`，来源审查见 `docs/azurite-private-snapshot-cloud-interop-source-review-2026-07-29.md`。
- **生效范围：** #46/#47、cboard-api 两个私有归档端点、Web/微信账号私有备份真实云端工程证据和可选集成测试；不改变 `PIE2EE01`、归档 v1、密码、UI 或普通同步。生产 Azure/HTTPS/合法域名、弱网、并发覆盖、两台真机和微信插件体积扫描仍待外部验收；隔离 API、Azurite、Mongo 已清理。未使用 Computer Use，未打开、激活、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 00:37:49。

## 变动 291：私有快照补齐并发覆盖与上传结果未知治理

- **意图：** 消除隐私分层条目中“忘记密码提示、并发覆盖”两项可编码缺口，并修复弱网响应丢失时客户端错误保证云端未改变的真实风险。
- **决策：** 先按当前源码复核双端恢复密码双次输入和不可找回警告，确认无需重复开发；复用既有 cloud port、metadata 读取、cboard-api `findOneAndUpdate`、SHA-256 和 Azure Blob helper，把上传异常改为“本机未变、云端结果未知，请先下载复核”。显式集成门新增两份不同密文并发替换，以及服务器真实提交后测试端丢弃响应、读取 metadata、同密文重试和跨端解密。
- **理由：** 网络异常不能证明服务器未执行，错误确定性会误导照护者；每账号最新快照允许最后写入胜出，但必须保持单一完整密文。现有 Mongo 原子更新、Blob 清理和下载完整性校验已经是成熟底座，无需新增锁服务、队列、协议或第三方依赖。
- **证据：** cloud port 聚焦 `10 passed / 4 external skipped`；真实 Node/API/Mongo 4.4/Azurite 3.35.0 集成 `1 file / 4 tests passed`。两次并发上传均为 HTTP 200，最终 metadata 对应一份完整 231 字节密文并由微信解密；服务端提交后丢响应场景可读取相同 SHA-256、同密文重试 200、下载 236 字节并由 Web 解密。微信全量 `85 files passed / 1 skipped`、`377 tests passed / 4 external skipped`，质量门 `10/10`、TypeScript、ESLint、`229 app / 32 CBoard core` 边界和 production build 全通过。完整记录见 `docs/private-archive-cloud-concurrency-and-uncertain-outcome-2026-07-29.md`。
- **生效范围：** #46/#47、微信两个账号私有快照上传异常文案、真实并发/重试证据和覆盖矩阵；不改变 `PIE2EE01`、归档 v1、API/schema、Web UI、密码或普通同步。生产 Azure/HTTPS、真实网络限速/断线、低内存、两台真机和历史版本仍待外部验收；本轮隔离 API/Azurite/Mongo 已清理。未使用 Computer Use，未打开、聚焦、抬升或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 00:53:31。

## 变动 292：AI Token 月额度补齐真实 Mongo 并发拒绝退款

- **意图：** 继续落实 issue #1 的 Token 月额度，证明现有请求前预留在真实 Mongo 并发下不会让已拒绝、未调用供应商的请求永久占额。
- **决策：** 先核对当前源码并确认预留系统已由变动 163 完成，不重复开发；固定并运行 `rate-limiter-flexible v11.2.0` 上游源码，新增显式 Mongo 集成门。真实失败证明上游 `consume()` 超额时先原子递增再 reject 后，复用同一库的 `reward()` 退回本次拒绝预留；退款失败继续返回 503。
- **理由：** mock limiter 不能代表真实 Mongo；被拒绝请求不应计费。原子退款是上游现成能力，比新建锁、队列、计数模型或第二套配额服务更小且并发安全。
- **证据：** 修复前三个并发 40-token 请求只接受两个但状态为 `120 consumed`；修复后为 `80`，随后 usage 结算、失败释放、有界超额阻断和账号删除均通过。上游 Mongo adapter `32/32`、配额单元 `13/13`、cboard-api 全量 `376 passing`、真实 Mongo `1/1`、Prettier 通过。完整记录见 `docs/ai-token-quota-mongo-concurrency-and-rejection-refund-2026-07-29.md`。
- **生效范围：** issue #1、cboard-api 六类 Chat Completions 月额度拒绝路径和可选 Mongo 验收命令；CBoard Web 与微信继续复用既有 429/503 本地降级，不改协议或 UI。真实 provider usage、生产 Mongo、公网 HTTPS、价格、支付和物理手机仍待外部验收；未使用 Computer Use，未打开或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 01:14:05。

## 变动 293：AI Token 月额度完成真实认证 HTTP、Provider 与 Mongo 用量闭环

- **意图：** 继续落实 issue #1，把局部 limiter 并发证据推进到普通用户真实登录、AI 请求、服务商 usage、Mongo 账本和本人额度查询的完整前后端链路。
- **决策：** 固定并运行实际依赖 `openai-node v4.104.0` 官方源码；新增环境显式门控的 HTTP + 隔离 Mongo + Nock provider 集成测试。真实联调发现 usage Swagger scope 误写为 `admin/admin` 后，最小修复为 `user/admin`，控制器继续只按 `req.user.id` 查询本人。
- **理由：** 原路由 fixture 不执行真实 Bearer 角色校验，无法发现普通用户 403；组合测试才能证明预留、SDK 重试、响应结束结算、失败释放和 provider 前 429 同时成立。假 provider 不发送患者数据、不产生费用，也无需重造协议。
- **证据：** OpenAI 官方 Chat Completions harness `11/11`；修复前普通用户成功调用 AI 后 usage 为 403，修复后依次结算 25 token、provider 两次 500 后释放 40-token 预留、再结算 60 token，累计 85/100 时下一请求在 provider 前返回 429 且最终仍为 85。API 全量单元 `376/376`、底层真实 Mongo `1/1`、HTTP 组合门 `1/1`、Prettier 全通过。完整记录见 `docs/ai-http-quota-provider-usage-integration-2026-07-29.md`。
- **生效范围：** issue #1、普通用户/管理员本人 AI 用量查询权限、cboard-api 可选真实 HTTP/Mongo 验收门；不改变 Web/微信 UI、额度默认值、provider 配置、患者本地闭环或生产部署。真实 provider usage、生产 Mongo、公网 HTTPS、价格、支付和物理手机仍待外部验收；未使用 Computer Use，未打开或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 01:33:49。

## 变动 294：去背景完成官方 rembg 源码、真实 Provider 与普通用户认证 HTTP 闭环

- **意图：** 补齐 issue #82 中“真实鉴权 HTTP 全链”证据，并把此前只有包安装与 smoke 的 rembg 纳入源码账本。
- **决策：** 固定官方 `rembg v2.0.75` 提交 `7b8de60ef9fc225af1768d81aa09da29db22a355`，运行官方 HTTP server 和真实模型；继续复用 cboard-api 既有 provider adapter、Bearer/Swagger、multipart 与透明 PNG 校验。新增环境显式门控的隔离 Mongo + 普通用户 + Nock provider 集成门，不新增算法、协议、依赖或客户端代码。
- **理由：** 单元测试不能证明真实账号角色，直接 provider smoke 又绕过控制器；两条证据必须组合。官方全量测试会下载 15 个模型，不适合作为日常门，一个真实官方 fixture 加轻量认证组合测试更可维护。历史 PyPI `2.0.76` 可解析，但官方 Git 当前没有对应 tag，因此源码审查固定在可追溯 `v2.0.75`。
- **证据：** 官方 server `/openapi.json` 为 200；`u2netp` 处理官方汽车图得到 `480x360 / 82,754 B`、alpha `0-255`。CBoard adapter 直连官方 server 得到 `480x360 / 78,560 B`、SHA-256 `46854ef1a07f8411fef89b2eadff905bc47712c1ded4e997d7f082fb2ffe6302`、约 14 秒且未存原图。真实认证 HTTP/Mongo `2/2`：匿名 403 且 provider 未调用，普通用户 200、原文件名被改为中性名、透明 PNG 字节一致；API 全量 `376/376`、Prettier 通过。完整记录见 `docs/background-removal-authenticated-http-integration-2026-07-29.md`。
- **生效范围：** issue #82 的 cboard-api 普通用户认证链、可选集成门、rembg 来源证据和覆盖矩阵；Web/微信原有授权、预览、保留原图、保存和回退逻辑不变。生产 rembg/remove.bg、公网 HTTPS、微信合法域名、物理真机、家庭照片主体完整度、低端机耗时和生产并发仍待外部验收；未使用 Computer Use，未打开或置顶微信开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 01:53:50。

## 变动 295：手机号注册完成腾讯云官方 SDK、真实 HTTP 与 Mongo 一次性消费闭环

- **意图：** 把 issue #1 的手机号验证从跨端 UI、单元测试和服务端配置推进到官方腾讯云 SDK、Swagger HTTP、Mongo challenge 与 CBoard 邮件激活注册的组合证据。
- **决策：** 固定 npm SMS 包 `4.1.240` 对应官方 Git 提交 `3d3fe1bbd5fd293a938f535619d7246caf7ca870` 并实际构建/运行；新增显式门控的隔离 Mongo 集成测试。Nock 仅替代腾讯云公网响应，TC3 签名、SDK 请求、公开路由、验证码确认、一次性 token 和 `POST /user` 均复用生产代码；不发送真实短信。
- **理由：** fake provider 无法证明官方签名请求和完整注册消费，真实发码又需要套餐、审核与费用。官方 SDK 加本地确定性响应是当前最小且可重复的工程验收边界，不需要自研短信协议或第二套账号系统。
- **证据：** 官方源码 `npm ci` 安装 408 packages、CJS/ES build 通过、SMS 官方测试 `19/19`；组合门连续三次通过，最终 `1 passing` 约 2 秒，观察到 `SendSms`/`2021-01-11`/TC3 签名、E.164 手机、六位码和 challenge context。错误码 400、正确确认后注册 200、重放同一 token 403；Mongo 不保存原始号码/验证码。API 无数据库单元 `376 passing`、Prettier 通过。完整记录见 `docs/phone-verification-authenticated-http-integration-2026-07-29.md`。
- **生效范围：** issue #1 手机号注册验证获得真实 SDK/HTTP/Mongo 的工程级覆盖，但真实腾讯云账号、审核签名/模板、短信投递、物理手机、公网 HTTPS、微信合法域名与生产防轰炸仍待外部验收。Web/微信协议和 UI 不变；未使用 Computer Use，未打开或置顶窗口，未发送短信、产生费用、提交、推送、部署、预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-29 02:23:05。

## 变动 296：豆包 TTS 完成 OpenClaw 源码与真实认证 HTTP 闭环

- **意图：** 继续落实 issue #1“豆包语音后端化”，把已有 provider 单测推进到普通用户认证和真实 HTTP/SSE 组合链。
- **决策：** 固定 OpenClaw `642befa179d377395c1bb927f4bb562a29af9d67` 并运行其 Volcengine 插件测试；新增隔离 Mongo + 本地确定性 SSE provider 门。保留中国区 V3 实现，不机械切换到 OpenClaw 当前 BytePlus 国际端点。
- **理由：** 成熟来源可验证协议与演进，但区域端点不能混用；本地组合门可证明认证、服务端密钥、SSE 拼接和私有 MP3，又不产生费用或上传患者文本。
- **证据：** OpenClaw Volcengine `22/22`；cboard-api HTTP/Mongo `2/2`，匿名 403 且 provider 未调用，普通用户 200 且 MP3/请求头/请求体完整；API 单元 `376/376`、Prettier 通过。详见 `docs/volcengine-tts-authenticated-http-integration-2026-07-29.md`。
- **生效范围：** issue #1 豆包 TTS 获得工程级服务端覆盖；真实凭据、授权、质量、费用、延迟、公网与真机仍待外部验收。Web/微信协议和主链不变；未使用 Computer Use，未提交、推送、部署、预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-29 02:39:11。

## 变动 297：手机号登录与短信找回完成真实认证闭环并修复旧 JWT 撤销

- **意图：** 把 issue #1 已有的手机号登录与短信找回从跨端 UI、端口和单元测试推进到腾讯云官方 SDK、Swagger HTTP、Mongo、密码哈希与 JWT 撤销的组合证据。
- **决策：** 继续复用固定腾讯云 SDK、同一 challenge repository、三种 purpose 和既有账号端点；集成门新增 `login` 与 `password-reset`。真实联调发现认证加载调用公开 `toJSON()` 后丢失 `authVersion`，最小修复为仅在认证内部对象上恢复不可枚举版本字段，不改变 token、Swagger 或公开响应。
- **理由：** 分层单测无法发现公开序列化与内部鉴权之间的组合缺口；只有“手机号登录取得 JWT → 短信找回 → 旧 JWT 再访问”才能证明撤销。不可枚举字段既复用现有设计，又继续保护内部版本。
- **证据：** 修复前旧 JWT 在重置后错误返回 200；修复后旧 JWT 403、旧密码 401、新密码/新 JWT 200，跨 purpose 和 token 重放均被拒绝。HTTP/Mongo `2/2`、API 单元 `376/376`、CBoard `4 suites / 74 tests / 1 snapshot`、微信账号端口 `21/21`、TypeScript、ESLint、production build、`10/10` 产物门和 CBoard 隔离 production build 全通过。完整记录见 `docs/phone-authentication-http-integration-2026-07-29.md`。
- **生效范围：** issue #1 中国大陆普通用户手机号登录、短信找回、旧会话撤销和跨端现有入口；真实腾讯云投递、公网、国际号码、物理手机和生产反轰炸仍是外部门。未使用 Computer Use，未打开或置顶开发者工具，未发送短信、产生费用、提交、推送、部署、预览、上传或发布。
- **记录：** Codex（GPT-5.6），2026-07-29 03:08:53。

## 变动 298：火山引擎粤语 ASR 完成成熟源码实测与认证 HTTP 组合闭环

- **意图：** 把 issue #1/#3/#5 的火山 ASR 从官方协议 adapter 与单元测试推进到普通用户真实登录、multipart 音频、服务端密钥和私密可编辑转写的组合证据。
- **决策：** 固定并运行 MIT `doubao-speech` 提交 `949f2de8ce6dcca36e8d3f4ff55c30ffb5df30db`，复用其认证、错误和测试结构作为成熟来源参考；保留已对齐官方极速 HTTP API 的 Node adapter。新增隔离 Mongo + loopback provider 集成门，为成功转写响应增加 `no-store, private` 与 `nosniff`，并让每次 UUID 作为非敏感 `user.uid`，使 API key 只存在于认证头。
- **理由：** Python/WebSocket 项目不能机械替换当前 Node/Flash HTTP 路径，但可防止从零设计协议和测试；真实认证组合门才能证明匿名请求不会触达供应商、密钥不进入客户端、敏感转写不被缓存。loopback provider 不上传患者录音且不产生费用。
- **证据：** 上游 `uv sync --frozen --dev`、Ruff、mypy 通过，pytest `123 passed / 2 deselected`、覆盖率 `91.46%`；cboard-api HTTP/Mongo `2/2` 明确断言请求体不含 API key，ASR/provider/controller `30/30`、全量单元 `376/376`、Prettier 与差分检查通过。完整记录见 `docs/volcengine-asr-authenticated-http-integration-2026-07-29.md`。
- **生效范围：** issue #1/#3/#5、认证 `/gpt/communication/dialect-asr` 成功响应隐私边界、可选验证命令和来源账本；不改 Web/微信 UI、人工修改、分词、matcher、腾讯云 ASR 或 WechatSI。真实火山凭据、服务开通、费用、粤语质量、公网、微信合法域名、弱网和物理手机仍待外部验收；未使用 Computer Use，未打开或置顶开发者工具，未真实调用供应商、预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 08:19:24。

## 变动 299：腾讯云粤语 ASR 完成官方 SDK TC3 认证组合门并修正编码后上限

- **意图：** 把 issue #1/#3/#5 的腾讯 `16k_yue` 路径从方法级 provider 测试推进到普通用户真实登录、multipart 音频、官方 SDK TC3 签名和私密可编辑结果，并核对官方源码中的请求大小约束。
- **决策：** 复用源码账本已有腾讯官方 SDK 单仓和 cboard-api 锁定的 `tencentcloud-sdk-nodejs-asr@4.1.266`，不重复克隆或自研签名；新增隔离 Mongo + Nock 组合门，Nock 仅替代收费公网响应。按官方 `Data` 字段要求，在腾讯 provider 内增加 Base64 后 3 MiB 预检，不收紧火山路径。
- **理由：** 方法 stub 无法证明 JWT、Swagger multipart、SDK action/version 和 TC3 credential scope；编码前 3 MiB 会膨胀为约 4 MiB，旧校验会产生注定失败的供应商请求。复用官方 SDK 和本地预检比第二套协议更稳定且可维护。
- **证据：** 当前 ASR 包 `4.1.266` 的 Client/SentenceRecognition 运行烟测通过；HTTP/Mongo `2/2` 观察到 `SentenceRecognition`、`2019-06-14` 和 TC3 Authorization，匿名请求 403 且没有 provider mock；编码后超限在 SDK 前 413。聚焦 `31/31`、API 全量 `377/377`、Prettier 与差分检查通过。详见 `docs/tencentcloud-asr-authenticated-http-integration-2026-07-29.md`。
- **生效范围：** issue #1/#3/#5、腾讯云粤语 ASR 服务端请求上限、可选组合验证和来源证据；不改 Web/微信 UI、人工修改、分词、matcher、火山 ASR 或 WechatSI。真实腾讯凭据、服务开通、费用、粤语质量、公网、合法域名、弱网和物理手机仍待外部验收；未使用 Computer Use，未打开或置顶开发者工具，未真实调用供应商、预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 08:35:16。

## 变动 300：视觉 AI 完成官方 SDK、真实认证 HTTP、额度与私密结果组合门

- **意图：** 把 issue #1/#3/#20/#21 的 OCR、个人图卡元数据建议和缺词 AI 图符生成，从分散的 provider/UI 单元证据推进到普通用户登录、官方 SDK、Swagger multipart/JSON、Mongo 用量和私密结果的完整前后端链。
- **决策：** 复用源码账本固定的 `openai-node v4.104.0`、cboard-api 通用 AI provider、JWT、Swagger 和月额度；新增隔离 Mongo + Nock 视觉组合门，Nock 只替代收费公网响应。视觉原图只以内存 Data URL 发送，生成图只返回 300×300 `device-private` PNG，视觉和去背景成功响应统一 `no-store, private` 与 `nosniff`。
- **理由：** helper mock 无法证明认证、multipart、SDK 请求、用量结算和缓存隐私能组合工作；家庭照片、截图和生成图可能包含敏感信息，且模型结果必须继续由照护者编辑确认，不能自动污染 matcher 或图库。
- **证据：** 官方 openai-node Images 测试 `6/6`；视觉 HTTP/Mongo `3/3`，匿名 403 且 provider 未调用，OCR/元数据 Data URL 与输入 JPEG 字节一致且无文件名/密钥，生成请求使用哈希用户和受限 AAC prompt，输出为 300×300 私密 PNG；20+25+32 token 在 Mongo 结算为 77。去背景 HTTP/Mongo `2/2` 同步通过隐私头，聚焦 `59/59`、API 全量 `377/377`。完整记录见 `docs/visual-ai-authenticated-http-integration-2026-07-29.md`。
- **生效范围：** issue #1/#3/#20/#21 的服务端密钥、认证、额度、视觉隐私与组合证据，以及 #82 去背景响应隐私；不改 Web/微信入口、人工编辑/确认、分词、matcher、公共图库或离线兜底。真实模型、公网、合法域名、家庭照片质量、供应商保留、费用、延迟和物理手机仍待外部验收；未使用 Computer Use，未打开或置顶开发者工具，未真实调用模型、预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5.6），2026-07-29 09:02:35。

## 变动 301：微信开发工具 Skill 与生产包体性能门完成复核

- **意图：** 在继续扩展图语家微信功能前，确认 Codex 使用的微信开发者工具 Skill 与本机工具版本一致，并用真实生产产物核对官方 1.5 MiB 预警线、媒体、插件和无用组件等性能边界。
- **决策：** 将本机开发者工具内置 Skill 0.3.6 同步到 Codex，继续只通过 `wechatide` CLI / Skill 后台调用，不使用 Computer Use，不打开、聚焦、抬升或置顶窗口；复用项目既有 `analyze:weapp` 作为本地包体门，官方性能扫描继续保留为每次上传前的外部门禁。
- **理由：** 旧 Skill 0.3.5 与工具内置 0.3.6 存在契约漂移风险；微信官方要求单包 2 MiB 上限并建议超过 1.5 MiB 前分包，同时要求压缩、按需注入和清理未使用资源。现有分析器已经覆盖这些项目边界，重复自研扫描器没有价值；但 Skill 0.3.6 尚未暴露官方性能扫描原子工具，因此不能把本地结果冒充官方评分。
- **证据：** `wechatide -c Codex check_wechatide_status --skill-version 0.3.6` 返回 `equal`、登录未过期且无需 CLI token；配置已启用 JS/WXML/WXSS 压缩、开发/上传无依赖过滤、`lazyCodeLoading: requiredComponents` 和自动审计。生产分析通过：主包 `1,285,089 B`，距 1.5 MiB 预警线尚余 `287,775 B`；照护者、应急、图库管理、备份、AAC 导入和 OCR 分包均低于 1.5 MiB；798 张共享 CBoard 图片合计 `986,160 B` 且只进入主包一次。Obsidian 记录 `Projects/图语家/图语家微信小程序开发工具与包体性能验收（2026-07-29）.md` 已通过 MCP 写入并回读。
- **生效范围：** 微信小程序本机开发工具入口、生产包体质量门、覆盖矩阵和长期决策记录；不改变患者表达、照护者接收、分词、图文匹配、语音、AI、数据 schema、AppID、插件、生产配置或部署状态。插件真实下载体积、官方性能评分、物理真机和低端设备体验仍待上传前/真机验收；本轮未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-29 09:22:14。

## 变动 302：个人图卡完成板内顺序维护与患者显示闭环

- **意图：** 让家属能在图片库维护区调整新建个人图卡的患者显示位置，避免所有新图永久追加在板末尾。
- **决策：** 完全复用 `BoardDTO.layout.tileIds`，共享纯核心只提供设备私有图卡相邻前移/后移；微信页面只做薄适配、store 持久化和维护按钮。默认图卡、导航图卡及非私有图卡不能通过此入口移动。
- **理由：** CBoard 已有唯一顺序契约，无需新增字段或第二份排序状态；维护入口属于家属设置，不应进入患者表达页。只换 layout 顺序也不会复制或删除图片、短视频与录音。
- **证据：** CBoard 定向 `1 suite / 12 tests`；微信相关 `4 files / 18 tests`，全量 `85 files passed / 1 skipped`、`379 tests passed / 4 skipped`；TypeScript、ESLint、边界、图库清单、生产构建与包体分析均通过。main `1,285,089 B`、backup `651,536 B`，全部分包低于 1.5 MiB。详见 `docs/personal-pictogram-board-ordering-2026-07-29.md`。
- **生效范围：** CBoard 共享纯核心、微信家属图片库维护、本机 BoardDTO 顺序和患者后续显示；不改默认图库、媒体文件、云同步、API/schema 或患者入口。未使用 Computer Use，未打开或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-29 09:55:44。

## 变动 305：个人图卡板内顺序完成 Web / 微信双向归档迁移验证

- **意图：** 补齐“当前设备重启保持顺序”到“完整图库跨端迁移仍保持顺序”的证据，避免家属辛苦调整后在恢复或换设备时被重排。
- **决策：** 不改 `PictureLibraryArchive v1`；复用 Web JSZip 与微信 fflate 真实 adapter，以 `tiles` 存储顺序和 `layout.tileIds` 显示顺序不同的 fixture 双向验证。
- **理由：** BoardDTO layout 已是唯一显示顺序，新增 sidecar 会产生双重真相；真实双向 adapter 能直接发现导出、解析、merge 或媒体恢复层的丢序。
- **证据：** 两个方向均保持“第二张个人图卡 / 水 / 第一张个人图卡”；互操作 `1 file / 7 tests`、微信全量 `85 files passed / 1 skipped`、`380 tests passed / 4 skipped`、TypeScript 与测试 ESLint 通过。微信 Skill 0.3.6 状态正常，但单文件编译因缺少当前项目运行环境返回 `getRootFactory Not Define Env`，未记为成功。
- **生效范围：** #10/#24/#25/#46 的个人图卡顺序和完整图库 Web/微信迁移证据；不改生产代码、归档格式、媒体、API/schema、依赖或包体。未打开或置顶开发者工具，未预览、上传、发布、部署、提交或推送。
- **记录：** Codex（GPT-5），2026-07-29 10:07:11。

## 变动 303：CBoard AI Engine 完成实例隔离与现有 Provider 注入契约

- **意图：** 为未来服务端复用整板生成消除多实例配置串用，并避免 `cboard-api` 同时安装 OpenAI v3/v4 两套 SDK。
- **决策：** `initEngine()` 返回实例私有配置，增加中性 `ChatCompletionClient` 注入；旧独立函数仅保留最后初始化实例的兼容语义。当前不通过本地 `file:`、复制源码或官方 npm `1.9.0` 接入 API。
- **理由：** 隔离和 provider 注入是可复用前提，但本地修复尚未形成正式可安装制品；把未发布目录依赖接进 API 会制造不可复现构建并绕过发布审查。
- **证据：** 双实例不同 URL/client 隔离测试通过；AI Engine `8/8` tests、TypeScript、CJS `38.86 KB`、ESM `37.21 KB`、DTS `2.44 KB` 构建通过；README 已记录注入与兼容边界。
- **生效范围：** AI Engine 本地 fork 与未来 adapter 条件；不改变 API 依赖/路由、Web/微信功能、密钥或部署。正式包或可追溯提交形成后再接入导入复核链，不直接写患者板。
- **记录：** Codex（GPT-5），2026-07-29 09:55:44。

## 变动 304：Open Board Logging 验证器完成来源审计并拒绝错误集成

- **意图：** 查明现成工具能否验证 OBL/OBLA 及九步匿名化，避免自研或把普通 schema 校验冒充隐私验证。
- **决策：** OpenAAC `openboardformat`/`obf-ruby` 仅作 OBF/OBZ 参考；OneTalker Rust `open_board_logging 0.1.0` 仅作候选源码参考，不接入运行时。
- **理由：** 官方 validator 不处理 OBL/OBLA；Rust crate 只做结构校验，不验证九步匿名化，且发布时间短、非 OpenAAC 官方，本机测试依赖获取受阻。
- **证据：** 固定并审阅 OpenAAC 提交 `4c23ea7f...`、obf-ruby `9a143b48...`、Rust crate/Codeberg `92bfa375...`；明确记录 Ruby 未安装、Cargo 离线缺 `wasip3`、在线 Schannel `SEC_E_NO_CREDENTIALS`，未冒充测试通过。详见 `docs/open-board-logging-validator-source-review-2026-07-29.md`。
- **生效范围：** 来源账本与后续日志隐私验收门；不改 OBL/OBLA 生产实现、依赖、API、UI 或包体。只有同时验证结构与匿名化语义的成熟来源才可升级为本地试用。
- **记录：** Codex（GPT-5），2026-07-29 09:55:44。
