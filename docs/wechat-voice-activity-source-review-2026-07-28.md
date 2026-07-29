# 微信语音活动反馈开源复用审查（2026-07-28）

- 审查时间：`2026-07-28 12:36:38`
- 执行工具 / 模型：`Codex（GPT-5.6）`
- 审查对象：`cnspica/walkie-talkie-miniprogram`
- 固定提交：`e9c76bf2368036ec42934861abe592d097974920`
- 本地源码：`D:\used-by-codex\source-reviews\picinterpreter-wechat-waveform-20260728\walkie-talkie-miniprogram`
- 许可：`MIT`
- 结论：`仅作架构参考，当前不接入 WechatSI 主识别链`

## 变动 1：拉取并实际检查原生录音帧实现

- **意图：** 为微信同声传译识别期间的声音活动反馈寻找可直接复用的成熟实现，避免继续依赖识别文字回调造成较高延迟，也避免从零自研波形。
- **决策：** 从当前候选中选择仍在维护且具有 MIT 许可的 `walkie-talkie-miniprogram`，固定源码提交后检查录音、帧回调、波形绘制和生命周期代码；不复制它的对讲、FSK、WebSocket、页面或频道模型。
- **理由：** `noconfuse/wx-audio` 停止更新于 2018 年且未声明许可证，`shixu-zz-an/SpeechNote` 也未声明许可证；`walkie-talkie-miniprogram` 的更新和许可边界更适合作为可审查参考。
- **证据：** 本地源码包含 `wx.getRecorderManager()`、`onFrameRecorded`、`frameSize`、`Int16Array` 采样和 Canvas 波形绘制；全部 7 个 JavaScript 文件通过 `node --check`。仓库没有 `package.json`、自动化测试或独立构建脚本，因此不把语法检查冒充运行时验证。
- **生效范围：** 只建立源码审查证据和本地参考副本；不改变 CBoard、cboard-api、微信小程序、WechatSI 插件、麦克风权限、语音识别或 UI。

## 变动 2：拒绝与 WechatSI 并行启动第二条录音链

- **意图：** 防止为了视觉上的“实时波形”破坏已经恢复正常的微信语音输入。
- **决策：** 当前不把候选的 RecorderManager 波形代码接入图语家主识别链；微信继续把反馈明确表述为“识别文字活动”，并提示“不是音量波形”。只有满足以下任一条件时再评估接入：WechatSI 官方暴露同一识别流的真实音频帧；或产品明确改为单一 RecorderManager 录音并由服务端完成识别。
- **理由：** Taro 随附的微信 API 类型明确 `wx.getRecorderManager()` 返回“全局唯一”的录音管理器，且 `frameSize` 暂仅支持 MP3。候选在同一个全局 RecorderManager 上以 PCM 请求帧回调，与当前 WechatSI 实时识别并行时存在录音器、回调和麦克风资源冲突；把识别文字回调伪装成音量又会误导患者和照护者。
- **证据：** 当前工程 `node_modules/@tarojs/taro/types/api/media/recorder.d.ts` 第 70–71、153、165–169、284 行记录了 MP3 限制、帧事件和全局唯一语义；候选 `pages/talk/talk.js` 第 41–44、249–256、289–296、317–345 行显示其独占 RecorderManager 并以 PCM 消费帧。图语家 `ReceiverWorkspace.tsx` 已在监听反馈中明确显示“这是监听状态，不是音量波形”。当前微信全量回归为 `77 test files / 344 tests`，产物质量门 `10/10`；首次沙箱内运行因 Vite 子进程 `spawn EPERM` 无法启动，按原命令在无沙箱环境重跑通过，不记为业务失败。
- **生效范围：** 微信照护者语音输入保持 WechatSI 主链、人工可修改原文和分词，以及识别片段活动提示；不影响已有独立方言录音后识别或个人图卡录音，因为这些路径不会与 WechatSI 同时启动。Web 继续使用浏览器真实时域样本驱动的 RMS 音量反馈。

## 后续触发条件

1. 微信官方提供 WechatSI 同一识别会话的原始音频帧或可信音量事件。
2. 经过产品决策，接受从“边说边出字”切换为“录音结束后服务端识别”，并具备稳定 HTTPS、合法域名、ASR 凭据和隐私告知。
3. 新候选能够证明单一录音管理器、真实 PCM/解码、静音门限、资源释放、自动化测试和物理真机兼容，而不是仅显示随机动画。

## 更新记录

- `2026-07-28 12:36:38`｜Codex（GPT-5.6）：建立源码固定、运行边界、拒绝接入依据与重新评估条件。
