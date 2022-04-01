const puppeteer = require("puppeteer");
const path = require("path");
const fs = require('fs');

let chromeExtensionPage;
const cwd = process.env.cwd;
const packageJSON = require(path.resolve(cwd, 'package.json'));
const name = packageJSON.name;

const init = async () => {
  const StayFocusd = path.resolve(cwd, "./dist");

  if (!fs.existsSync(StayFocusd)) {
    setTimeout(init, 1000)
    return
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: [`--disable-extensions-except=${StayFocusd}`, `--load-extension=${StayFocusd}`, "--enable-automation"],
  });

  chromeExtensionPage = await browser.newPage();
  await chromeExtensionPage.goto("chrome://extensions/");
  await chromeExtensionPage.evaluate(() => {
    // open development mode
    document.querySelector("body > extensions-manager").shadowRoot.querySelector("extensions-toolbar").shadowRoot.querySelector("#devMode").click();
  });

  chromeExtensionPage.on('console', async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });
}

init();

const reload = () => {
  if (!chromeExtensionPage) return;

  return chromeExtensionPage.evaluate(async (name) => {
    const extensionsConfig = await window.chrome.management.getAll();
    const target = extensionsConfig.find((item) => item.name === name);

    if (target) {
      document
        .querySelector("extensions-manager")
        .shadowRoot.querySelector("extensions-item-list")
        .shadowRoot.querySelector(`extensions-item[id="${target.id}"]`)
        .shadowRoot.querySelector("cr-icon-button")
        .click();
    } else {
      console.error("plugin is not found");
    }
  }, name);
};

module.exports = {
  reload
}
