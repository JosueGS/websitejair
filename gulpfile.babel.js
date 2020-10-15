//HTML
import htmlmin from 'gulp-htmlmin'

//CSS
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'


// JAVASCRIPT
import gulp, { task } from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';

//PUG
import pug from 'gulp-pug'

//SASS
import sass from 'gulp-sass'

//PURGECSS
import clean from 'gulp-purgecss'

//cache bust
import cacheBust from 'gulp-cache-bust'

//optimizacion images
import imagemin from 'gulp-imagemin'

//browser sync
import {init as server, string, reload, stream} from 'browser-sync'

//plumber
import plumber from 'gulp-plumber'

//Common
import concat from 'gulp-concat'

//variables / constantes
const cssPlugins = [
  cssnano(),
  autoprefixer()
]

const production = true

gulp.task('html-min',()=>{
  
  return gulp
    .src('./src/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      collapseWhitespace:true,
      removeComments:true
    }))
    .pipe(gulp.dest('./public'))
})

gulp.task('styles',()=>{
  
  return gulp
    .src('./src/css/*.css')
    .pipe(plumber())
    .pipe(concat('styles-min.css'))
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest('./public/css'))
    .pipe(stream())
})

gulp.task('babel',()=>{
  
    return gulp
      .src('./src/js/*.js')
      .pipe(plumber())
      .pipe(concat('scripts-min.js'))
      .pipe(babel())
      .pipe(terser())
      .pipe(gulp.dest('./public/js'))
})

gulp.task('views', ()=>{
    return gulp.src('./src/views/pages/*.pug')
      .pipe(plumber())
      .pipe(pug({
        pretty: production ? false : true
      }))
      .pipe(cacheBust({
        type : 'timestamp'
      }))
      .pipe(gulp.dest('./public'))
})

gulp.task('sass', ()=>{
    return gulp.src('./src/scss/styles.scss')
      .pipe(plumber())
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(gulp.dest('./public/css'))
      .pipe(stream())
})

gulp.task('clean', ()=>{
    return gulp.src('./public/css/styles.css')
      .pipe(plumber())
      .pipe(clean({
        content : ['./public/*.html']
      }))
      .pipe(gulp.dest('./public/css'))
})

gulp-task('imgmin', ()=>{

  return gulp.src('./src/images/*')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced:true }),
      imagemin.mozjpeg({ quality :30, progressive:true }),
      imagemin.optipng({ optimizationLevel: 1 })
    ]))
    .pipe(gulp.dest('./public/images'))
})

gulp.task('default', ()=>{

  server({
    server:'./public'
  })
  // gulp.watch('./src/*.html', gulp.series('html-min'))
  // gulp.watch('./src/css/*.css', gulp.series('styles'))
  gulp.watch('./src/views/**/*.pug', gulp.series('views')).on('change', reload)
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload)
})