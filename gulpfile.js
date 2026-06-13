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
    .src(["./assets/sass/**/*.scss", "!./assets/sass/**/_*.scss"])
    .pipe(
      sass().on("error", function (err) {
        console.error("Sass コンパイルエラー:", err.message);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer(), cssSorter()]))
    .pipe(mmq())
    .pipe(gulp.dest("./assets/css"))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./assets/css"));
}

// JavaScript 結合・圧縮
function minJs() {
  return gulp
    .src("./assets/js/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./assets/js"))
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./assets/js"));
}

// 画像コピー
function copyImage() {
  return gulp
    .src("./assets/img/**/*", { buffer: false })
    .pipe(gulp.dest("./assets/img/"));
}

// WebP 変換
function convertWebp() {
  return gulp
    .src("./assets/img/**/*.{jpg,jpeg,png}")
    .pipe(webp())
    .pipe(gulp.dest("./assets/img/"));
}

// HTML 整形・コピー
function formatHtml() {
  return gulp
    .src(["./*.html"])
    .pipe(htmlBeautify({ indent_size: 2, indent_with_tabs: true }))
    .pipe(gulp.dest("./"));
}

// ファイル削除（対応ファイルを削除）
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
  browserSync.init({ server: { baseDir: "./" } });
  done();
}

// ファイル監視
function watch() {
  const sassWatcher = gulp.watch(
    "./assets/sass/**/*.scss",
    gulp.series(compileSass, browserReload)
  );
  sassWatcher.on("unlink", (filePath) => {
    deleteCorrespondingFile(filePath, "assets/sass", "assets/css");
  });

  const jsWatcher = gulp.watch(
    "./assets/js/**/*.js",
    gulp.series(minJs, browserReload)
  );
  jsWatcher.on("unlink", gulp.series(minJs, browserReload));

  const imgWatcher = gulp.watch(
    "./assets/img/**/*",
    gulp.series(copyImage, convertWebp, browserReload)
  );
  imgWatcher.on("unlink", (filePath) => {
    deleteCorrespondingFile(filePath, "assets/img", "assets/img");
    const relativePath = path.relative("assets/img", filePath);
    const webpPath = path
      .join("assets/img", relativePath)
      .replace(/\.(jpg|jpeg|png)$/i, ".webp");
    del([webpPath], { force: true });
  });

  const htmlWatcher = gulp.watch(
    "./*.html",
    gulp.series(formatHtml, browserReload)
  );
  htmlWatcher.on("unlink", (filePath) => {
    deleteCorrespondingFile(filePath, ".", ".");
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
