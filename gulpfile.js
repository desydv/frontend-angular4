var gulp        = require('gulp');
var runSequence = require('run-sequence');
var shell       = require('gulp-shell');

// default gulp task
gulp.task('default', function(callback) {
  runSequence(
    'build-modernizr',
    callback
  );
});

gulp.task('build-modernizr', shell.task([
    'node ./node_modules/modernizr/bin/modernizr -c ./modernizr-config.json -d ./src/assets/js/modernizr.js'
]));
