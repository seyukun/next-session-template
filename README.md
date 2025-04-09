# 開発用セットアップ

このプロジェクトはNext.js App Routerを使ったアプリケーションです。
セッション情報はKeyvを利用しており、開発環境では`Valkey (Redis互換)`を利用できます。

---

## 🚀 開発環境の起動
```bash
# 適宜実行
docker run -it --name valkey -p 6379:6379 -d valkey/valkey
export SESSION_STORE=redis

yarn dev
```
