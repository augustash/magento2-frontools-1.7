'use strict';
module.exports = function (gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme       = config.themes["YOUR-THEME-ID"],
    srcBase         = plugins.path.join(config.projectPath, theme.src),
    sassLintConfig  = require('../helper/config-loader')('stylelint.yml', plugins, config),
    scss            = require('postcss-scss');

  return gulp.src(file || plugins.globby.sync(srcBase + '/styles/**/*.scss'))
    .pipe(plugins.if(
      !plugins.util.env.ci,
      plugins.plumber({
        errorHandler: plugins.notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(plugins.postcss([
      plugins.stylelint({
        config: sassLintConfig
      }),
      plugins.reporter({
        clearReportedMessages: true,
        throwError: plugins.util.env.ci || false
      })
    ], { syntax: scss }))
    .pipe(plugins.logger({
      display: 'name',
      beforeEach: 'Theme: ' + name + ' ' + 'File: ',
      afterEach: ' - Ash Lint finished.'
    }))
};
