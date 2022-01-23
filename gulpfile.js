//Gulp packages ------------------------------------------------------------ //
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass')(require('sass'));
var rename = require('gulp-rename')
//PostCSS packages
var cssnano = require('cssnano');
var presetEnv = require('postcss-preset-env');
var lost = require('lost');

//Variables ---------------------------------------------------------------- //
//Processors
var processors = [
	lost(),
	presetEnv()
];
var distProcessors = processors.concat([(cssnano())]);

//URLs
var paths = {
	src: 'src/**',
	dest: 'public/css'
};

//Tasks -------------------------------------------------------------------- //
const buildCss = function() {
    return gulp.src([srcPath + '/*.css'])
        .pipe(postcss(processors))
        .pipe(rename({dirname:''}))
        .pipe(gulp.dest(paths.src));
};
gulp.task('buildcss', buildCss);
gulp.task('buildCss', buildCss);

const buildCssDist = function() {
    return gulp.src([srcPath + '/*.css'])
        .pipe(postcss(distProcessors))
        .pipe(rename({dirname:''}))
        .pipe(gulp.dest(paths.dest));
};
gulp.task('buildcssdist', buildCssDist);
gulp.task('buildCssDist', buildCssDist);

const buildSass = function() {
    return gulp.src([paths.src + '/*.scss'])
		.pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(rename({dirname:''}))
        .pipe(gulp.dest(paths.dest))
};
gulp.task('buildSass', buildSass);
gulp.task('buildsass', buildSass);

const buildSassDist = function() {
    return gulp.src([paths.src + '/*.scss'])
		.pipe(sass().on('error', sass.logError))
        .pipe(postcss(distProcessors))
        .pipe(rename({dirname:''}))
        .pipe(gulp.dest(paths.dest))
};
gulp.task('buildSassDist', buildSassDist);
gulp.task('buildsassdist', buildSassDist);

//Watch ----------------------------------------------------------  ---------- //
const watchCss = function(){
    gulp.watch(paths.src + '/*.css', gulp.series(['buildCSS']))
};
gulp.task('watchCss', watchCss);
gulp.task('watchcss', watchCss);

const watchSass = function(){
    gulp.watch(paths.src + '/*.scss', gulp.series(['buildSASS']))
};
gulp.task('watchSass', watchSass);
gulp.task('watchsass', watchSass);
