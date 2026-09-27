# 足球经理总监

可直接打开的单文件游戏：

- [打开游戏](./index.html)
- [EA FC26 全量导入器源码](./src/data/import-eafc26.js)
- [IndexedDB 存储模块](./src/storage/indexeddb.js)
- [EA FC26 数据源说明](./data/EAFC26-SOURCE.md)

`index.html` 默认从公开 CSV 数据源按原始行导入 IndexedDB，保留每条记录的 `raw` 全字段，不按评分筛选。游戏包含仪表盘、阵容、比赛、叙事发布会、更衣室对话、承诺账本、财政和存档页面。

> 第三方数据的授权、版权和再分发责任由使用者自行确认。
