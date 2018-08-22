'use strict';

// dependencies -----------------------------------------------------------

    var gulp = require('gulp'),
        changed = require('gulp-changed'),
        sass = require('gulp-sass'),
        csso = require('gulp-csso'),
        autoprefixer = require('gulp-autoprefixer'),
        browserify = require('browserify'),
        watchify = require('watchify'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        babelify = require('babelify'),
        terser = require('gulp-terser'),
        del = require('del'),
        notify = require('gulp-notify'),
        browserSync = require('browser-sync'),
        sourcemaps = require('gulp-sourcemaps'),
        reload = browserSync.reload;

// project config ---------------------------------------------------------

    var p = {
        html:           './index.html',
        jsx:            './src/scripts/index.jsx',
        scss:           './src/sass/**/*.scss',
        scssmain:       './src/sass/main.scss',
        assets:         './src/assets/*',
        fonts:          './src/sass/fonts/*',
        bundle:         'app.min.js',

        dist:           'dist',
        distCss:        'dist/css',
        distAssets:     'dist/assets',
        distFonts:      'dist/fonts'
    };

// primary tasks ----------------------------------------------------------

    gulp.task('build', ['clean'], function() {
        process.env.NODE_ENV = 'production';
        gulp.start(['styles', 'copy', 'buildApp']);
    });

    gulp.task('watch', [], function() {
        gulp.start(['watchStyles', 'watchApp', 'styles', 'copy', 'browserSync']);
    });

    gulp.task('default',['watch'], function() {
        console.log('Running"');
    });

// tasks ------------------------------------------------------------------

    // clean before build
    gulp.task('clean', function(cb) {
          del(['dist']).then(() => cb());
    });

    // server and sync changes
    gulp.task('browserSync', function() {
        browserSync.init({
            server: './',
            port: 9876
        });
    });

    // copy
    gulp.task('copy', function () {
        gulp.src(p.html).pipe(gulp.dest(''));
        gulp.src(p.assets).pipe(gulp.dest(p.distAssets));
        gulp.src(p.fonts).pipe(gulp.dest(p.distFonts));
    });

    // watch for changes
    gulp.task('watchApp', function() {
        var bundler = watchify(browserify(p.jsx, watchify.args));
        function rebundle() {
            return bundler
                .bundle()
                .on('error', notify.onError())
                .pipe(source(p.bundle))
                .pipe(gulp.dest(p.dist))
                .pipe(reload({stream: true}));
        }
        bundler.transform(babelify).on('update', rebundle);
        return rebundle();
    });

    // bundle js
    gulp.task('buildApp', function() {
        browserify(p.jsx)
            .transform(babelify)
            .bundle()
            .pipe(source(p.bundle))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(terser())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(p.dist));
    });

    // compile & minify scss
    gulp.task('styles', function() {
        return gulp.src(p.scssmain)
            .pipe(changed(p.distCss))
            .pipe(sass({errLogToConsole: true}))
            .on('error', notify.onError())
            // .pipe(csso())
            .pipe(gulp.dest(p.distCss))
            .pipe(reload({stream: true}));
    });

    // watch styles
    gulp.task('watchStyles', function() {
        gulp.watch(p.scssmain, ['styles']);
        gulp.watch(p.scss, ['styles']);
    });
