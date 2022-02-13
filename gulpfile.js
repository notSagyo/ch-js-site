// Gulp packages ------------------------------------------------------------ //
let gulp = require('gulp');
let postcss = require('gulp-postcss');
let sass = require('gulp-sass')(require('sass'));
let rename = require('gulp-rename');
let purgecss = require('gulp-purgecss');
let sourcemaps = require('gulp-sourcemaps');

// PostCSS packages
let cssnano = require('cssnano');
let presetEnv = require('postcss-preset-env');
let lost = require('lost');

// Variables ---------------------------------------------------------------- //
// Processors
let postCssProcessors = [
	lost(),
	presetEnv()
];
let postCssProdProcessors = postCssProcessors.concat([cssnano()]);

//URLs
let paths = {
	cssSource: 'src/**',
	cssDest: 'dist/css',
	purgeCss: ['dist/**/*.html', 'dist/**/*.js'],
	excludeVendor: '!src/**/vendor/**'
};

// Tasks -------------------------------------------------------------------- //
const buildCss = function() {
	return gulp.src([paths.cssSource + '/*.css', paths.excludeVendor])
		.pipe(postcss(postCssProcessors))
		.pipe(rename({dirname:''}))
		.pipe(gulp.dest(paths.cssDest));
};
gulp.task('buildcss', buildCss);
gulp.task('buildCss', buildCss);

const buildCssProd = function() {
	return gulp.src([paths.cssSource + '/*.css', paths.excludeVendor])
		.pipe(postcss(postCssProdProcessors))
		.pipe(purgecss({ content: paths.purgeCss }))
		.pipe(rename({dirname:''}))
		.pipe(gulp.dest(paths.cssDest));
};
gulp.task('buildcssprod', buildCssProd);
gulp.task('buildCssProd', buildCssProd);

const buildSass = function() {
	return gulp.src([paths.cssSource + '/*.scss', paths.excludeVendor])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(postCssProcessors))
		.pipe(sourcemaps.write())
		.pipe(rename({dirname:''}))
		.pipe(gulp.dest(paths.cssDest));
};
gulp.task('buildSass', buildSass);
gulp.task('buildsass', buildSass);

const buildSassProd = function() {
	return gulp.src([paths.cssSource + '/*.scss', paths.excludeVendor])
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(postCssProdProcessors))
		.pipe(purgecss({ content: paths.purgeCss }))
		.pipe(rename({dirname:''}))
		.pipe(gulp.dest(paths.cssDest));
};
gulp.task('buildSassProd', buildSassProd);
gulp.task('buildsassprod', buildSassProd);

// Watch -------------------------------------------------------------------- //
const watchCss = function() {
	gulp.watch(paths.cssSource + '/*.css', gulp.series(['buildCss']));
};
gulp.task('watchCss', watchCss);
gulp.task('watchcss', watchCss);

const watchSass = function() {
	gulp.watch(paths.cssSource + '/*.scss', gulp.series(['buildSass']));
};
gulp.task('watchSass', watchSass);
gulp.task('watchsass', watchSass);

// Default ------------------------------------------------------------------ //
function defaultTask() { watchSass(); }

exports.default = defaultTask;
