# 数据导入与 IndexedDB 存储模块

本目录包含导入 EA FC26（或其他来源）球员数据的导入器说明与初始脚本。注意：本仓库**不**包含任何受版权保护的 EA 原始数据；导入器会从用户上传或公开数据源拉取并写入 IndexedDB。

使用说明（简要）
1. 如果你有 Kaggle 上的 EAFC26 数据集并愿意授权，请在设置中提供你的 Kaggle API token（`~/.kaggle/kaggle.json` 或直接粘贴 token）。导入器会用 Kaggle CLI/API 下载并解析。  
2. 如果你已有 CSV/JSON 文件，可在仓库 Releases 上传或通过 Web UI 上传到页面并用导入器导入。  
3. 我也会尝试扫描公开 GitHub/Kaggle 链接并下载可用公开数据（你已授权）。

接下来我会实现：
- 分片解析 CSV/JSON 并逐块写入 IndexedDB（避免内存峰值）
- 支持 LZ-string 压缩备用字段（可选）
- 支持 File System Access API 导出/备份（当浏览器支持时）

安全与合规：请确认你有权使用导入的数据。对于任何第三方数据（Kaggle/公开 CSV），请自行承担授权责任。
