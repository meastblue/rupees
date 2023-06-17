import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import rename from "gulp-rename";
import { deleteAsync } from "del";

const sass = gulpSass(dartSass);

const clean = async () => await deleteAsync("dist");
const paths = {
  src: "src",
  sourceFile: "purple.scss",
  dist: "dist",
};

const compile = () =>
  gulp
    .src(`${paths.src}/${paths.sourceFile}`)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist));

const copy = () =>
  gulp
    .src([`${paths.src}/**`, "package.json", "README.md", "LICENSE"])
    .pipe(gulp.dest(paths.dist));

export default gulp.series(clean, gulp.parallel(compile, copy));
