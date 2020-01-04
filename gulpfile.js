"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var server = require("browser-sync").create();
var del = require("del"); // модуль для удаления
var rename = require("gulp-rename"); // модуль для переименования
var svgstore = require("gulp-svgstore"); // модуль для создания векторного спрайта
var imagemin = require("gulp-imagemin"); // модуль для оптимизации изображений
var webp = require("gulp-webp"); // модуль для создания WebP
var posthtml = require("gulp-posthtml"); // модуль обработки html
var include = require("posthtml-include"); // модуль вставки в html
var htmlmin = require('gulp-htmlmin'); // модуль минифицирует html
var uglify = require('gulp-uglify'); // модуль минифицирует js


// Удаление файлов из build
gulp.task("clean", function () {
  return del("build");
});

// Копируем исходные файлы в build
gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/favicon/*"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso()) // минифицирует CSS
    .pipe(rename("style.min.css")) // переименовываем в min.файл
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// Оптимизация изображений
gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo({plugins: [{removeViewBox: false}]})
    ]))
    .pipe(gulp.dest("build/img"));
});

// Создаем WebP изображения
gulp.task("webp", function () {
  return gulp.src("build/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

// Создаем SVG спрайт
gulp.task("sprite", function () {
  return gulp.src("build/img/sprite-*.svg") // выбрать определенные svg
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// Минифицирует JS
gulp.task('js', function () {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
});

// Созданание HTML
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ])) // вставка спрайта
    .pipe(htmlmin({ collapseWhitespace: true })) // минифицирует html
    .pipe(gulp.dest("build"));
});

// Запускаем билд
gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "images",
  "webp",
  "sprite",
  "js",
  "html"
));

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/img/sprite-*.svg", gulp.series("sprite", "html", "refresh")); // добавил перезагрузку
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

// Добавил перезагрузку сервера
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series("build", "server"));
