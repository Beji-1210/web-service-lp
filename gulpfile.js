const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssSorter = require("css-declaration-sorter");
const mmq = require("gulp-merge-media-queries");
const cleanCss = require("gulp-clean-css");
const terser = require("gulp-terser");
const concat = require("gulp-concat");
const webp = require("gulp-webp").default;
const rename = require("gulp-rename");
const htmlBeautify = require("gulp-html-beautify");
const browserSync = require("browser-sync").create();
const del = require("del");
const path = require("path");

// Sass コンパイル
function compileSass() {
  return gulp
    .src(["./src/assets/sass/**/*.scss", "!./src/assets/sass/**/_*.scss"])
    .pipe(
      sass().on("error", function (err) {
        console.error("Sass コンパイルエラー:", err.message);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer(), cssSorter()]))
    .pipe(mmq())
    .pipe(gulp.dest("./public/assets/css"))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./public/assets/css"));
}

// JavaScript 結合・圧縮
function minJs() {
  return gulp
    .src("./src/assets/js/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./public/assets/js"))
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./public/assets/js"));
}

// 画像コピー
function copyImage() {
  return gulp
    .src("./src/assets/img/**/*", { buffer: false })
    .pipe(gulp.dest("./public/assets/img/"));
}

// WebP 変換
function convertWebp() {
  return gulp
    .src("./src/assets/img/**/*.{jpg,jpeg,png}")
    .pipe(webp())
    .pipe(gulp.dest("./public/assets/img/"));
}

// HTML 整形・コピー
function formatHtml() {
  return gulp
    .src("./src/**/*.html")
    .pipe(htmlBeautify({ indent_size: 2, indent_with_tabs: true }))
    .pipe(gulp.dest("./public"));
}

// ファイル削除（対応ファイルを public から削除）
function deleteCorrespondingFile(filePath, srcBase, destBase) {
  const relativePath = path.relative(srcBase, filePath);
  const destPath = path.join(destBase, relativePath);
  const minPath = destPath
    .replace(/\.js$/, ".min.js")
    .replace(/\.css$/, ".min.css");
  return del([destPath, minPath], { force: true });
}

// ブラウザリロード
function browserReload(done) {
  browserSync.reload();
  done();
}

// ローカルサーバー起動
function browserInit(done) {
  browserSync.init({ server: { baseDir: "./public/" } });
  done();
}

// ファイル監視
function watch() {
  const sassWatcher = gulp.watch(
    "./src/assets/sass/**/*.scss",
    gulp.series(compileSass, browserReload)
  );
  sassWatcher.on("unlink", (filePath) => {
    deleteCorrespondingFile(filePath, "src/assets/sass", "public/assets/css");
  });

  const jsWatcher = gulp.watch(
    "./src/assets/js/**/*.js",
    gulp.series(minJs, browserReload)
  );
  jsWatcher.on("unlink", gulp.series(minJs, browserReload));

  const imgWatcher = gulp.watch(
    "./src/assets/img/**/*",
    gulp.series(copyImage, convertWebp, browserReload)
  );
  imgWatcher.on("unlink", (filePath) => {
    deleteCorrespondingFile(filePath, "src/assets/img", "public/assets/img");
    const relativePath = path.relative("src/assets/img", filePath);
    const webpPath = path
      .join("public/assets/img", relativePath)
      .replace(/\.(jpg|jpeg|png)$/i, ".webp");
    del([webpPath], { force: true });
  });

  const htmlWatcher = gulp.watch(
    "./src/**/*.html",
    gulp.series(formatHtml, browserReload)
  );
  htmlWatcher.on("unlink", (filePath) => {
    deleteCorrespondingFile(filePath, "src", "public");
  });
}

exports.compileSass = compileSass;
exports.minJs = minJs;
exports.copyImage = copyImage;
exports.convertWebp = convertWebp;
exports.formatHtml = formatHtml;
exports.browserInit = browserInit;
exports.watch = watch;
exports.dev = gulp.parallel(browserInit, watch);
exports.build = gulp.parallel(formatHtml, minJs, compileSass, copyImage, convertWebp);
exports.default = exports.dev;
