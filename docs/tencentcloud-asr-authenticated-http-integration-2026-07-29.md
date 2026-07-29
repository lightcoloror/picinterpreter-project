# 腾讯云粤语 ASR 官方 SDK 认证 HTTP 集成验收

- **记录时间：** 2026-07-29 08:35:16
- **执行者：** Codex（GPT-5.6）
- **关联需求：** PicInterpreter issue #1、#3、#5

## 意图

证明图语家的腾讯云粤语录音路径真实复用了 CBoard 账号和官方 SDK，而不是只在测试里模拟 `SentenceRecognition`；同时核对官方源码约束并修复会导致接近上限音频在供应商端失败的组合缺口。

## 决策

1. 优先复用源码账本已有腾讯官方 SDK 单仓提交 `3d3fe1bbd5fd293a938f535619d7246caf7ca870`，以及 cboard-api 锁定的 `tencentcloud-sdk-nodejs-asr@4.1.266`，不重复克隆或自研 TC3。
2. 新增隔离 Mongo + 官方 SDK + Nock 组合门。Nock 仅返回确定性腾讯响应，真实执行 SDK 的 HTTPS 请求构造、TC3 签名、生产 JWT、Swagger multipart、provider 和私密响应。
3. 根据官方 `SentenceRecognitionRequest.Data` 约束，在 SDK 调用前校验 Base64 数据不超过 3 MiB；该检查只属于腾讯 provider，不修改火山引擎路径。
4. 保持“识别原文可修改 → 可选粤语规范化 → 人工确认 → 手动生成图卡”顺序，ASR 成功不得自动调用 matcher。

## 理由

- 单元方法 stub 无法证明官方签名、action、version、认证角色和 multipart 组合链。
- Base64 会把字节数放大约三分之一。编码前 3 MiB 的旧上限不能满足腾讯对编码后数据的限制，应在产生外部请求前稳定拒绝。
- 同一官方 SDK 单仓已经因腾讯短信链完成拉取、安装、构建和测试，继续复用比再次下载同类实现更可维护。
- 本地确定性响应不会上传患者录音、消耗识别额度或制造账单，但仍能验证官方 SDK 网络边界。

## 证据

- 官方 SDK：<https://github.com/TencentCloud/tencentcloud-sdk-nodejs>
- 本地源码：`D:\used-by-codex\source-reviews\picinterpreter-phone-verification-http-20260729\tencentcloud-sdk-nodejs`
- 固定提交：`3d3fe1bbd5fd293a938f535619d7246caf7ca870`
- 当前 ASR 包运行烟测：版本 `4.1.266`，`Client` 和 `SentenceRecognition` 均可实例化。
- 官方编译源码明确包含 `16k_yue`、60 秒、3 MB、MP3/WAV/PCM/OGG Opus/M4A/AAC/AMR 和 TC3 v3 要求。
- HTTP/Mongo 组合门 `2/2`：匿名 403 且未创建 provider mock；普通用户 200，真实 SDK 请求匹配 `SentenceRecognition`、`2019-06-14` 与 TC3 Credential，响应私密且不返回 RequestId/凭据。
- 编码后 3 MiB 超限测试在 SDK 前返回 413，provider 调用数为 0。
- 聚焦 `31/31`，cboard-api 全量单元 `377/377`；隔离 Mongo 已按精确名称停止。

## 生效范围

- 覆盖 issue #1/#3/#5、腾讯云 `16k_yue` 服务端路径、编码后大小安全边界、验证命令和来源证据。
- 不改变 Web/微信入口、录音格式、人工修改、分词、matcher、火山 ASR、WechatSI、图卡或历史。
- 真实腾讯账号、权限、粤语语料、准确率、延迟、费用、公网、微信合法域名、弱网和物理手机仍待外部验收。
- 未使用 Computer Use，未打开或置顶开发者工具，未真实调用腾讯云、预览、上传、发布、部署、提交或推送。
