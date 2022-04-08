const chalk = require('chalk');

module.exports = (log) => {
  // if (process.env.debug) {
  //   console.log(log)
  //   return;
  // }

  if (log.indexOf('chrome-extensions-cli') !== -1) return;

  if (process.env.NODE_ENV === 'development') {
    if (log.indexOf('compiled successfully') !== -1) {
      const intercept = log.match(/compiled\ssuccessfully\sin\s\d+\sms/)[0]
      console.log(chalk.blue(`[${new Date().toLocaleString()}] ${intercept}`));
    } else {
      if (log.indexOf('Error') === -1) {
        console.log(chalk.blue(`[${new Date().toLocaleString()}] ${log}`));
      } else {
        console.log(chalk.red(`[${new Date().toLocaleString()}] ${log}`));
      }
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.log('✨  Compilation complete')
  }
}

