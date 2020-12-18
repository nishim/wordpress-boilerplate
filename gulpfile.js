'use strict'

const THEME_NAME = 'YOUR THEME NAME';

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');

const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');

const img_src   = 'assets/images/**/*';
const img_dest  = 'wp-content/themes/' + THEME_NAME + '/images/';
const scss_src  = 'assets/scss/**/*.scss';
const scss_dest = 'wp-content/themes/' + THEME_NAME + '/';

const scss = () => {
  return gulp.src(scss_src)
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      grid: 'autoplace'
    }))
    .pipe(gulp.dest(scss_dest));
};

const imgmin = () => {
  return gulp.src(img_src)
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(imagemin([
      pngquant({
        quality: [0.65, 0.8], speed: 1
      }),
      mozjpeg({
        quality: 90
      }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest(img_dest));
};

exports.default = gulp.series(
  scss,
  imgmin
);

exports.watch = () => {
	gulp.watch(scss_src, scss);
};

exports.imagemin = imgmin;
