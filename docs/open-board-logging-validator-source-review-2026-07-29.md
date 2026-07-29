# Open Board Logging 第三方验证器来源审计（2026-07-29）

## 状态

- 状态：来源已审阅，不接入运行时
- 执行工具 / 模型：Codex（GPT-5）
- 时间：2026-07-29 09:55:44

## 意图

确认是否存在成熟开源工具，可以直接验证图语家导出的 Open Board Logging 记录及 OBLA 九步匿名化，而不是自行发明验证器或把结构校验误当成隐私证明。

## 决策

保留 OpenAAC `openboardformat` 与 `obf-ruby` 作为 OBF/OBZ 规范和板文件验证参考，不用于 OBL/OBLA；保留 OneTalker `open_board_logging 0.1.0` 为候选源码参考，但不接入 CBoard、API 或微信，也不声称其能验证匿名化。

## 理由

OpenAAC 官方站点的 validator 面向 OBF/OBZ，不提供 OBL/OBLA 上传验证服务。Rust crate 只检查格式、ID 唯一性、时间戳和 action 前缀，没有验证九步匿名化；它发布仅两天、不是 OpenAAC 官方项目，本机测试还受 Cargo 依赖和 Windows Schannel 凭据阻断。接入它会增加依赖，却不能证明最关键的隐私要求。

## 证据

- `openboardformat` 固定提交 `4c23ea7f6421732654de8822354b90ca3946e78c`，源码显示规范与站点资料边界。
- `obf-ruby` 固定提交 `9a143b485904293c995fcc8c28d7bbf6a018c2b5`，validator 目标为 OBF/OBZ；本机没有 Ruby，因此未冒充运行其测试。
- `open_board_logging 0.1.0` 固定 Codeberg 提交 `92bfa37598cc4c129d6e38c28ec3607357be7bb8` 并检查 crate 源码；`cargo test --locked --offline` 缺少 `wasip3`，在线重试受 `SEC_E_NO_CREDENTIALS` 阻断，未宣称通过。

## 生效范围

生效于来源账本、日志验证工具选择和后续隐私验收边界。不改变当前 OBL/OBLA 导出、匿名化实现、Web/微信 UI、API、依赖或生产包；以后如出现官方或成熟工具，必须同时证明结构验证与九步匿名化语义，才能进入本地试用。
