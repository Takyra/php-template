'use strict';

const gulp        = require('gulp'),
      watch       = require('gulp-watch'), //Наблюдение за изменениями в файлах
      browserSync = require("browser-sync"), //Локальный сервер
      prefixer    = require('gulp-autoprefixer'), //Добавить префексы для свойств стилей
      uglify      = require('gulp-uglify'), //Минифицирование скриптов
      babel       = require('gulp-babel'), //Компиляция современного стандарта JavaScript для поддержки в старых версиях браузера
      sass        = require('gulp-sass'), //Компиляция sass в css
      groupMedia  = require('gulp-group-css-media-queries'), //Собрать все media запросы в конец файла
      cssbeautify = require('gulp-cssbeautify'), //Визуально улучшить структуру кода
      notify      = require('gulp-notify'), //Всплывающее сообщение об обшибке
      concat      = require('gulp-concat'), //Объединене файлов
      include     = require("gulp-include"), //Возможность включать содержимое одних файлов в другие
      cssnano     = require('gulp-cssnano'), //Минифицирование стилей
      // rename      = require('gulp-rename'), //Переименовать файл
      // replace     = require('gulp-replace'), //Замена кода в файле
      imagemin    = require('gulp-tinypng'), //Оптимизация изображений
      // encoding    = require('gulp-convert-encoding'), //Изменить кодировку файла
      del         = require('del');

let path = {
    src: {
      root: 'src/',
      php:  'src/**/*.php',
      libsCss: [
        "src/libs/slick-carousel/slick/slick.css",
        "src/libs/fancybox/dist/jquery.fancybox.css"
      ],
      libsJs: [
        'src/libs/jquery/dist/jquery.js',
        'src/libs/slick-carousel/slick/slick.js',
        'src/libs/fancybox/dist/jquery.fancybox.js'
      ],
      css:      'src/css/',
      style:    'src/styles/style.scss',
      jsInput:  'src/scripts/common.js',
      jsOutput: 'src/js/',
      img:      'src/images/**/*.*',
      fonts:    'src/fonts/**/*.*'
    },
    dist: {
      root:  'dist/',
      css:   'dist/css/',
      js:    'dist/js/',
      img:   'dist/images/',
      fonts: 'dist/fonts/'
    },
    watch: {
      php:   'src/**/*.php',
      style: 'src/styles/**/*.scss',
      js:    'src/scripts/**/*.js',
      img:   'src/images/**/*.*',
      fonts: 'src/fonts/**/*.*'
    }
  },
  config = {
    proxy:     '', //Папка проекта на Open Server
    host:      '', //Адрес проекта
    open:      'external',
    port:      8080,
    tunnel:    false,
    notify:    false,
    logPrefix: 'browserSync'
  };

/* Сборка для разработки */
gulp.task('libs-css:dev', gulp.series(function () {
  return gulp.src(path.src.libsCss)
             .pipe(concat('libs.min.css'))
             .pipe(gulp.dest(path.src.css));
}));

gulp.task('libs-js:dev', gulp.series(function () {
  return gulp.src(path.src.libsJs)
             .pipe(concat('libs.min.js'))
             .pipe(gulp.dest(path.src.jsOutput));
}));

gulp.task('style:dev', gulp.series(function () {
  return gulp.src(path.src.style)
             .pipe(sass({outputStyle: 'open'}))
             .on("error", notify.onError({
                message: "Error: <%= error.message %>",
                title: "Error running something"
             }))
             .pipe(prefixer())
             .pipe(gulp.dest(path.src.css))
             .pipe(browserSync.stream());
}));

gulp.task('js:dev', gulp.series(function () {
  return gulp.src(path.src.jsInput)
             .pipe(include())
             .pipe(babel({
                presets: ['@babel/env']
             }))
             .on("error", notify.onError({
                message: "Error: <%= error.message %>",
                title: "Error running something"
             }))
             .pipe(gulp.dest(path.src.jsOutput))
             .pipe(browserSync.stream());
}));

gulp.task('clean:dev', gulp.series(function () {
  return del([
    path.src.jsOutput,
    'src/template_styles.css'
  ]);
}));

gulp.task('dev', gulp.series(
  'libs-css:dev',
  'libs-js:dev',
  'style:dev',
  'js:dev'
));

gulp.task('watch', gulp.series(function () {
  watch([path.watch.php], browserSync.reload);

  watch([path.watch.style], function() {
    gulp.start('style:dev');
  });

  watch([path.watch.js], function() {
    gulp.start('js:dev');
  });

  watch([path.watch.img], browserSync.reload);
  watch([path.watch.fonts], browserSync.reload);
}));

gulp.task('webserver', gulp.series(function () {
  browserSync(config);
}));

gulp.task('default', gulp.series('clean:dev', 'dev', 'webserver', 'watch'));

/* Сборка на производство */
gulp.task('php:build', gulp.series(function () {
  return gulp.src(path.src.php)
             // .pipe(replace('images/', '/img/')) Изменить путь к изображениям
             // .pipe(encoding({to: 'win1251'}))   Изменить кодировку
             .pipe(gulp.dest(path.dist.root));
}));

gulp.task('libs-css:build', gulp.series(function () {
  return gulp.src(path.src.libsCss)
             .pipe(cssnano())
             .pipe(concat('libs.min.css'))
             .pipe(gulp.dest(path.dist.css));
}));

gulp.task('libs-js:build', gulp.series(function () {
  return gulp.src(path.src.libsJs)
             .pipe(concat('libs.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest(path.dist.js));
}));

gulp.task('style:build', gulp.series(function () {
  return gulp.src(path.src.style)
             .pipe(sass())
             .pipe(prefixer())
             .pipe(groupMedia())
             .pipe(cssbeautify())
             // .pipe(rename('template_styles.css')) Переименовать файл
             .pipe(gulp.dest(path.dist.css));
}));

gulp.task('js:build', gulp.series(function () {
  return gulp.src(path.src.jsInput)
             .pipe(include())
             .pipe(babel({
                presets: ['@babel/env']
             }))
             .pipe(gulp.dest(path.dist.js));
}));

gulp.task('image:build', gulp.series(function () {
  return gulp.src(path.src.img)
             .pipe(imagemin('78rEl05Qy2ETiR0rnbJoMWJLQnORk0ip'))
             .pipe(gulp.dest(path.dist.img));
}));

gulp.task('fonts:build', gulp.series(function () {
  return gulp.src(path.src.fonts)
             .pipe(gulp.dest(path.dist.fonts));
}));

gulp.task('clear:production', gulp.series(function () {
  return del(path.dist.root);
}));

gulp.task('production', gulp.series(
  'clear:production',
  'php:build',
  'libs-css:build',
  'libs-js:build',
  'style:build',
  'js:build',
  'image:build',
  'fonts:build'
));