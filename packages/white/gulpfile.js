import _ from "lodash";
import consolidate from "gulp-consolidate";
import iconfont from "gulp-iconfont";
import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import rename from "gulp-rename";
import svgmin from "gulp-svgmin";
import { deleteAsync } from "del";

const sass = gulpSass(dartSass);
const paths = {
  scss: "scss",
  svg: "svg",
  fonts: "fonts",
  icons: "icons",
  sourceFile: "icons.scss",
  dist: "dist",
};

const clean = async () => await deleteAsync(["fonts", "icons", "scss", "dist"]);

const minifySvg = () =>
  gulp.src("svg/*.svg").pipe(svgmin()).pipe(gulp.dest("icons"));

const createFont = () =>
  gulp
    .src("icons/*.svg")
    .pipe(
      iconfont({
        fontName: "icon-lib",
        formats: ["ttf", "eot", "woff", "woff2"],
        prependUnicode: true,
        normalize: true,
        fontHeight: 1001,
        timestamp: Math.round(Date.now() / 1000),
      })
    )
    .on("glyphs", function (glyphs) {
      console.log(glyphs);
      createScss(glyphs);
    })
    .pipe(gulp.dest("fonts"));

const createScss = (glyphs) =>
  gulp
    .src("templates/scssTemplate.scss")
    .pipe(
      consolidate("lodash", {
        glyphs: glyphs.map((glyph) => ({
          name: glyph.name,
          unicode: glyph.unicode[0].codePointAt(0).toString(16),
        })),
        fontName: "icon-lib",
        fontPath: "../fonts/",
        className: "cm",
      })
    )
    .pipe(rename(paths.sourceFile))
    .pipe(gulp.dest("scss"));

const createDist = () =>
  gulp
    .src([`${paths.fonts}/**/*`, `${paths.icons}/**/*`], { base: "." })
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.src(`${paths.scss}/${paths.sourceFile}`))
    .pipe(gulp.dest(paths.dist))
    .pipe(sass())
    .pipe(gulp.dest(paths.dist))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist));

export default gulp.series(clean, minifySvg, createFont, createDist);
