# 图语家离线语音识别开源复用审查

> 记录：Codex（GPT-5），2026-07-28 19:15:05。

## 结论

图语家当前不把 sherpa-onnx 或 Vosk 直接集成进微信小程序，也不新增一个没有真实识别能力的占位适配器。

- CBoard Web 继续复用浏览器原生的设备内 Web Speech 能力。
- CBoard Cordova Android/iOS 继续复用已经接线的原生设备内识别端口。
- 微信小程序继续使用 WechatSI、可编辑识别文字、可编辑分词和文字输入离线底线。
- sherpa-onnx 保留为未来独立原生 App、模型按需下载与完整校验链的首选参考，不进入当前 Taro 包。

这不是“离线语音已经完成”，而是一次有源码、有本地运行、有包体证据的暂不集成决定。微信在完全断网时仍不能执行语音转文字。

## 变动 1：固定并运行 sherpa-onnx 官方源码

- **意图：** 验证 sherpa-onnx 是否能作为 CBoard Web、Cordova 或微信小程序的成熟离线语音模块直接复用，而不是只依据仓库介绍做判断。
- **决策：** 将官方仓库固定到提交 `75e1fc31e747194c546787ec7b40a7e0b390dc4b`，安装其官方 Node 示例依赖，并执行模块加载与产物体积检查；同时审阅 WebAssembly、Android 和 iOS 的识别装配方式。
- **理由：** 图语家要求先查源码账本、拉取源码、安装并运行，再决定是否复用。只看“支持 WebAssembly/Android/iOS”无法判断微信运行环境、模型交付方式和真实体积。
- **证据：** 本地路径为 `D:\used-by-codex\source-reviews\picinterpreter-offline-asr-20260728\sherpa-onnx`；`sherpa-onnx@1.13.4` 安装成功，`require('sherpa-onnx')` 能加载识别 API。安装包共 13 个文件、`21,336,771 B`，其中 `sherpa-onnx-wasm-nodejs.wasm` 为 `21,024,877 B`。该包没有自动化测试脚本；仓库源码包含真实 C++/Emscripten、Kotlin/Android 和 Swift/iOS 接线，不是轻量 API 包装。
- **生效范围：** 只形成离线 ASR 候选源码与运行证据，不修改 CBoard、cboard-api 或微信业务代码，不新增运行依赖。

## 变动 2：拒绝把 sherpa-onnx 或 Vosk 直接放入微信小程序

- **意图：** 保护微信小程序包体、启动速度和低端设备稳定性，避免为了“完全离线”引入一个实际上无法发布或无法可靠运行的方案。
- **决策：** 当前微信端不集成 sherpa-onnx、Vosk 或 `vosk-browser`。不复制其 Web Worker、DOM 音频、Emscripten 文件系统或模型文件，也不通过动态代码下载规避微信代码包规则。
- **理由：** sherpa-onnx 官方 Node/WASM 运行时本身约 `20.35 MiB`，还不含语音模型；本次 HEAD 实测两个中英流式模型压缩包分别为 `511,274,346 B` 和 `458,187,351 B`。Vosk 官方中文小模型仍为约 `42 MB`，官方说明小模型运行时通常需要约 `300 MB` 内存。`vosk-browser` 又依赖 Web Worker、`AudioContext` 和 `navigator.mediaDevices`，与微信原生录音及 Taro 运行时不是可直接复用关系。上述体积远超项目当前单包 `1.5 MiB` 性能门，并缺少已验证的模型下载、断点续传、哈希校验、缓存淘汰和低端机基线。
- **证据：** sherpa-onnx 的 `wasm/asr/CMakeLists.txt` 会把模型 assets 预载入 Emscripten 文件系统，`wasm/asr/assets/README.md` 要求先下载 ONNX 模型；Android 示例通过 `AssetManager` 或复制到内部存储后初始化原生 recognizer。官方资料见 [sherpa-onnx 仓库](https://github.com/k2-fsa/sherpa-onnx)、[WebAssembly 构建说明](https://k2-fsa.github.io/sherpa/onnx/wasm/build.html)、[在线模型清单](https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-transducer/index.html)和 [Vosk 模型清单](https://alphacephei.com/vosk/models)。
- **生效范围：** 微信小程序完全离线语音继续标记为未实现；不影响已授权 WechatSI、文字输入、人工修正、TTS、语音活动提示或其他双向沟通功能。

## 变动 3：保留 CBoard 已有设备内识别路径

- **意图：** 在不增加大型模型与第二套语音状态机的前提下，继续复用 CBoard 已经实现的跨平台能力。
- **决策：** Web 保持 `SpeechRecognition.available/install/processLocally` 渐进增强；Cordova 保持原生插件 `onDevice` 路径，并在设备内能力不可用时明确失败，不静默退回在线识别。当前不为 sherpa-onnx 新建 Cordova 插件，因为没有找到可直接复用、维护成熟且契约匹配的现成插件。
- **理由：** 现有 CBoard 端口已经覆盖语言包检查、安装、状态提示、显式本机偏好与失败边界，且已有测试和构建证据。自行编写 JNI/Swift/Cordova 桥接、模型管理和音频管线属于新的大型原生子项目，会重复成熟平台能力并显著提高维护成本。
- **证据：** `src/common/communicationSupport/browserSpeech.js` 使用 `available/install/processLocally`；`cordovaSpeech.js` 使用设备内可用性检查和 `onDevice` 参数；两者都有回归测试。sherpa-onnx 官方 Android/iOS 示例证明未来原生集成可行，但其模型和资产生命周期必须作为独立工程完成。
- **生效范围：** CBoard Web/Electron/Cordova 的语音端口与接收端 UI；不改变微信、API、图卡、分词、matcher、历史和账号数据。

## 变动 4：明确后续进入条件

- **意图：** 为未来真正完成“完全断网语音识别”留下可验收入口，而不是无限期保留模糊 TODO。
- **决策：** 只有同时满足以下条件时，才重新评估 sherpa-onnx 集成：存在独立原生 App 壳或经官方验证的小程序模型承载方式；中文模型可按需下载；具备版本、哈希、断点续传、空间检查、缓存淘汰和删除能力；中低端真机完成实时率、峰值内存、耗电、热量和离线准确率基线；失败时仍保留可编辑文字输入。
- **理由：** 离线 ASR 的难点不只是调用 recognizer，而是模型供应链、设备资源、安全校验、更新恢复和用户可理解的降级。没有这些条件时接入只会制造“代码存在但核心功能不可用”的假完成。
- **证据：** 当前 CBoard 已提供平台原生设备内能力，微信已提供在线 WechatSI 和人工修正；本轮实测证明直接内嵌通用模型不符合微信包体边界。
- **生效范围：** issue #17 的后续技术门、源码复用优先级和真实设备验收标准；不构成发布承诺，不代表任何真机离线识别已经通过。

## 本轮未做事项

- 未修改业务代码、依赖、API 或 schema。
- 未启动、聚焦、置顶或操作微信开发者工具窗口。
- 未使用 Computer Use。
- 未预览、上传、发布、部署、提交或推送。

