var gulp = require('gulp'),
    browserify = require('browserify'),
    exorcist = require('exorcist'),
    mold=require('mold-source-map'),
    source = require('vinyl-source-stream'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    flatten = require('gulp-flatten'),
    connect=require('gulp-connect'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    jshint = require('gulp-jshint'),
    plato = require('gulp-plato'),
    bower = require('gulp-bower'),
    babelify = require('babelify'),
    babel = require('gulp-babel'),
    gulpCopy = require('gulp-copy');


    /**
     * Gulp Task to process only the index file.
     */
    gulp.task('index',function(){
       return gulp.src('./app/index.jade')
           .pipe(jade({pretty:true}))
           .pipe(gulp.dest('./dist'))
           .pipe(connect.reload());
    });
    gulp.task('html',['index'],function(){
       return gulp.src(['./app/**/*.jade','!./app/index.jade'])
           .pipe(jade({pretty:true}))
           .pipe(flatten())
           .pipe(gulp.dest('./dist/views'))
           .pipe(connect.reload());
    });

    gulp.task('css',function(){
       return gulp.src('./app/**/*.less')
           .pipe(less())
           .pipe(rename('app.min.css'))
           .pipe(gulp.dest('./dist/styles'))
           .pipe(connect.reload());
    });

    gulp.task('bundle-vendors',function() {
        return browserify('./app/core-dependencies.js',{debug:false, transform:['debowerify','uglifyify']})
            .bundle()
            .pipe(source('vendors.js'))
            .pipe(gulp.dest('./dist/scripts'))
            .pipe(connect.reload());
    });

    gulp.task('static', function() {
        return gulp.src("static/*")
            .pipe(gulpCopy("dist/"));
    });

    gulp.task('js',function(){
       return browserify('./app/app.js',{debug:true, transform:['babelify', 'debowerify', 'uglifyify']})
           .bundle()
           .pipe(mold.transformSourcesRelativeTo('./app'))
           .pipe(exorcist('./dist/scripts/app.bundle.js.map'))
           .pipe(source('app.bundle.js'))
           .pipe(gulp.dest('./dist/scripts'))
           .pipe(connect.reload());
    });

    gulp.task('bower', function() {
      return bower()
        .pipe(gulp.dest('./dist/lib/'))
    });

    gulp.task('serve',function(){
        connect.server({
            root:'./dist',
            livereload:true,
            port:3000
        })
    });

    gulp.task('watch',function(){
        gulp.watch('./app/**/*.jade', ['html']);
        gulp.watch('./app/**/*.less', ['css']);
        gulp.watch('./app/**/*.js', ['lint-js','unit-test','js']);
    });

    gulp.task('unit-test',function(cb){
        gulp.src(['./app/**/*.js','!./app/**/*_test.js'])
            .pipe(babel())
            .pipe(istanbul())
            .pipe(istanbul.hookRequire())
            .on('finish', function () {
                gulp.src(['./app/**/*_test.js'])
                    .pipe(mocha({reporter:'nyan'}))
                    .pipe(istanbul.writeReports())
                    .on('end', cb);
            });
    });

    gulp.task('lint-js',function(){
        return gulp.src('./app/**/*.js')
            .pipe(babel())
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'));
    });

    gulp.task('report-complexity',function(cb){
        return gulp.src('./app/**/*.js')
            .pipe(babel())
            .pipe(plato('complexity-report',{title:'app complexity',jshint:{browserify:true,
                quotmark:"single",
                camelcase:true,
                node:true,
                globals:{
                    require : true
                }}}))
    });

    gulp.task('analyze',['lint-js','report-complexity','unit-test']);

    gulp.task('default',['html','css','js','unit-test', "bundle-vendors", "static", "bower", 'serve','watch']);
