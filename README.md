# kyopro share

[https://kyopro-share.onrender.com/](https://kyopro-share.onrender.com/)
競技プログラミングの良問を共有するためのWebサービス

## 環境構築

Node.js のインストール

```shell
git clone git@github.com:bvv-1/kyopro-share.git
```

```shell
cd kyopro-share
```

```shell
npm ci
```

```shell
npm run setup:env
```

`.env.local` ファイルに `VUE_APP_VITE_SUPABASE_URL="データベースのURL"` `VUE_APP_VITE_ANON_KEY="データベースのANON_KEY" となるように書く。

```shell
npm run setup
```

## Compiles and hot-reloads for development

```shell
npm run serve
```

ブラウザで [`http://localhost:8080`](http://localhost:8080) にアクセスすると、表示されるはずです。

## Compiles and minifies for production

```
npm run build
```

## Lints and Prettier

```
npm run fix
```
