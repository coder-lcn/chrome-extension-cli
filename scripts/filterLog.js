module.exports = (log) => {
  if (log.indexOf('chrome-extension-cli') !== -1) return;

  if (process.env.NODE_ENV === 'development') {
    if (log.indexOf('compiled successfully') !== -1) {
      const intercept = log.match(/compiled\ssuccessfully\sin\s\d+\sms/)[0]
      console.log(`[${new Date().toLocaleString()}] ${intercept}`);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.log('✨  Compilation complete')
  }
}
