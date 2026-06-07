# web-service-lp

Webサービス風LPのチーム開発練習リポジトリです。

## 教材

[スクール教材](https://edu.daily-trial.com/lessons/web_site/courses/23a23d20/articles/53973524#tips_0)

コーディング時は必ずデザインカンプを参照してください。

---

## 技術構成

- HTML / CSS / JavaScript
- Sass（FLOCSS構成）
- Gulp（Sass コンパイル・JS 結合・ブラウザ同期）

---

## セットアップ

```bash
# 1. リポジトリをクローン
git clone git@github.com:Beji-1210/web-service-lp.git
cd web-service-lp

# 2. パッケージをインストール
yarn install

# 3. 開発サーバーを起動
yarn dev
```

`yarn dev` を実行すると：

1. ブラウザが自動で立ち上がり `src/index.html` が表示される
2. `src/` 内のファイルを保存するたびにブラウザが自動でリロードされる
3. Sass が自動でコンパイルされ `public/assets/css/style.css` に出力される

あとは `src/` 内のファイルを編集するだけです。**ターミナルは開いたままにしておいてください**（閉じると監視が止まります）。

### コマンド一覧

| コマンド | タイミング | 内容 |
|---|---|---|
| `yarn dev` | 作業開始時に毎回実行 | 開発サーバー起動・ファイル監視・自動リロード |
| `yarn build` | 本番アップ直前のみ | Sass・JS・画像を最適化して `public/` に出力 |

---

## ディレクトリ構成

```
web-service-lp/
├── src/                    # ソースファイル（編集するのはここ）
│   ├── index.html
│   ├── component.html      # コンポーネントプレビュー用
│   └── assets/
│       ├── sass/           # Sass ファイル
│       │   ├── style.scss
│       │   ├── global/     # 変数・mixin・関数
│       │   ├── foundation/ # リセット・ベーススタイル
│       │   ├── layout/     # l- レイアウト
│       │   ├── component/  # c- 再利用コンポーネント
│       │   ├── project/    # p- セクション固有スタイル
│       │   └── utility/    # u- 汎用クラス
│       ├── js/             # JavaScript ファイル
│       └── img/            # 画像ファイル
└── public/                 # Gulp 出力（編集不要・git管理外）
```

---

## 作業ルール

### ブランチ運用

```
main（保護済み・直接プッシュ禁止）
└── feature/担当セクション名
```

1. `main` から `feature/` ブランチを作成して作業する
2. 完成したら PR を出し、レビュー後に `main` へマージする

```bash
# ブランチ作成例
git switch -c feature/p-mv
```

### Sass クラス命名規則

| プレフィックス | 用途 |
|---|---|
| `l-` | レイアウト（ヘッダー・インナー・セクション） |
| `c-` | 再利用コンポーネント（ボタン・タイトル） |
| `p-` | セクション固有スタイル |
| `u-` | 汎用クラス |
| `js-` | JS フックのみ（スタイル定義禁止） |

### Sass 変数の使い方

変数は `global/` にまとめて定義しています。
各ファイル先頭の `@use` を通じて使用します。

```scss
@use "sass:map";
@use "../global" as global;

.p-example {
  color: global.$color-main;
  @include global.mq(md) {
    font-size: 18px;
  }
}
```

### レイアウトクラスの使い方

`l-` クラスは全セクション共通のベーススタイルです。
**直接編集はせず**、セクション固有の変更が必要な場合は担当の `p-` ファイル内で上書きしてください。

#### `l-section`
各セクションに必ず付与するクラスです。セクション共通の上下余白を管理します。

```html
<section id="feature" class="p-feature l-section">
</section>
```

#### `l-inner`
コンテンツの最大幅を制限し、中央揃えにするクラスです。
セクション内のコンテンツを囲む形で使用します。

```html
<section id="feature" class="p-feature l-section">
  <div class="l-inner">
    <!-- コンテンツ -->
  </div>
</section>
```

特定セクションだけ余白や幅を変えたい場合は、`l-inner` や `l-section` を直接変更せず、担当の `p-` ファイルで該当箇所のみ上書きしてください。

```scss
// _p-about.scss
.p-about {
  // l-section の余白をこのセクションだけ変更したい場合
  &.l-section {
    padding-block: 40px;
  }
  // l-inner の幅をこのセクションだけ変更したい場合
  .l-inner {
    max-width: 800px;
  }
}
```

---

### コンポーネントの使い方

`c-` クラスは全セクションで共通して使用する再利用パーツです。
**直接編集はせず**、セクション固有の変更が必要な場合は担当の `p-` ファイル内で上書きしてください。

`component.html` をブラウザで開くとすべてのコンポーネントを確認できます。

#### `c-section-title`
各セクションの見出しに使用します。

```html
<hgroup class="c-section-title">
  <p class="c-section-title__en">Feature</p>
  <h2 class="c-section-title__ja">Ravekの3つの特長</h2>
</hgroup>
```

特定セクションだけ色を変えたい場合は担当の `p-` ファイルで上書きしてください。

```scss
// _p-feature.scss
.p-feature {
  .c-section-title__ja {
    color: global.$color-white;
  }
}
```

#### `c-button`
CTAボタンに使用します。白背景セクションでは `c-button`、色付き背景セクションでは `c-button--white` を使用してください。

```html
<!-- 通常（白テキスト・紫背景） -->
<a href="#" class="c-button">まずは無料で使ってみる</a>

<!-- 反転（紫テキスト・白背景） -->
<a href="#" class="c-button c-button--white">まずは無料で使ってみる</a>
```

---

### ブレークポイント（SP ファースト）

| キー | 幅 |
|---|---|
| `sm` | 600px 以上 |
| `md` | 768px 以上 |
| `lg` | 900px 以上 |
| `xl` | 1160px 以上 |

デフォルトが SP スタイルで、`@include global.mq(md)` 内に PC スタイルを記述します。

---

### 画像の使い方

`src/assets/img/` に **jpg / png** を置いてください。
`yarn dev` / `yarn build` 実行時に Gulp が自動で **WebP に変換**し `public/assets/img/` に出力します。

HTML では変換後の `.webp` を参照してください。`src/` に `.webp` が存在しなくても問題ありません。

```html
<!-- src/assets/img/ に image.jpg を置いた場合 -->
<img src="./assets/img/image.webp" alt="説明" width="800" height="600" loading="lazy" decoding="async">
```

> **注意：** `yarn dev` を起動していない状態ではブラウザに画像が表示されません。必ず `yarn dev` を実行してから作業してください。

---

## セクション担当

| 担当 | セクション |
|---|---|
| はいづか | header / MV / about / footer |
| 山本 | feature / CTA / component |
| ozbone | results / howto |
| りえ | price / faq |
