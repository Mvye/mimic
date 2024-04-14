// Using ES Modules import statements
import gulp from 'gulp';
import ts from 'gulp-typescript';

const tsProject = ts.createProject('tsconfig.json');

export function build() {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
}

// Export tasks for CLI access
export default build;
