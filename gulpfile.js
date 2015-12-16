var gulp      = require( 'gulp' );
var uglify    = require( 'gulp-uglify' );
var minifyCss = require( 'gulp-minify-css' );
var usemin    = require( 'gulp-usemin' );
var gutil = require('gulp-util');
var rimraf    = require( 'rimraf' );
var tsd = require('gulp-tsd');
var bower = require('gulp-bower');
var runSequence = require('run-sequence');
var typescript = require('gulp-tsc');

gulp.task('default', function(callback){
    return runSequence(
        ['tsd', 'bower'],
        ['tsc'],
        ['html'],
        callback);
});

gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './src/tsd.json'
    }, callback);
});

gulp.task('bower', function() {
    return bower({ directory: './src/bower_components', cwd: './' });
});

gulp.task('tsc', function(){
    var config = {
        src: [
            '!./src/bower_components/**', // node_modulesは対象外
            '!./src/typings/**', // node_modulesは対象外
            './src/**/*.ts'       // プロジェクトのルート以下すべてのディレクトリの.tsファイルを対象とする
        ],
        dst: './',
        options: { target: 'ES5', module: 'commonjs' }
    };

    return gulp.src(config.src)
        .pipe(typescript({ sourceMap: true, outDir: '.' }))
        .pipe(gulp.dest('./src'))
});

gulp.task( 'html', function() {
    return gulp.src( 'src/*.html' )
        .pipe( usemin( {
            css: [ minifyCss() ],
            js:[ uglify() ],
            dependency:[ uglify() ],
        } ) )
        .pipe( gulp.dest( 'dist' ) );
} );


