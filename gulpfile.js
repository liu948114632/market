var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    del = require('del'),
    fs = require('fs'),
    livereload = require('gulp-livereload');

var version = require('./package.json').version;
var baseDir = '.';

gulp.task('css', function() {
    try {
        return gulp.src('css/styles.less')      //压缩的文件
            .pipe(concat('all.css'))           //合并
            .pipe(less())                 //执行压缩
            .pipe(minifycss())                 //执行压缩
            .pipe(gulp.dest(`${baseDir}/build/${version}`));         //输出文件夹
    }catch (e){
        return null;
    }
});

gulp.task('js', function() {
    return gulp.src('js/lib/react*.min.js')      //压缩的文件
        .pipe(gulp.dest(`${baseDir}/build`));         //输出文件夹
});

gulp.task('img', function() {
    return gulp.src('images/**')      // 图片
        .pipe(gulp.dest(`${baseDir}/build/images`))
});

gulp.task('version', function() {
    //var fs = require('fs');
    //
    //function updateVersion(file, target) {
    //    fs.readFile(file, 'utf-8', function(err, data){
    //        var newData = data.replace(/\{version}/g, version);
    //        fs.writeFile(target, newData);
    //    });
    //}
    //
    //updateVersion('index-production.html', 'app/index.html');
    //updateVersion('wx-register-production.html', 'app/wx-register.html');
    //updateVersion('wx-login-production.html', 'app/wx-login.html');
});

gulp.task('package', function() {
    baseDir = './app';
    gulp.start('css', 'version');
});

gulp.task('watch', function () {
    gulp.watch('css/**/*.*', function () {
        gulp.start('css');
    });
    var server = livereload();
    gulp.watch('build/**/*.*', function (file) {
        server.changed(file.path);
    });
    gulp.watch('*.html', function (file) {
        server.changed(file.path);
    });
});

gulp.task('default', function() {
    gulp.start('js', 'css', 'img', 'watch');
});
