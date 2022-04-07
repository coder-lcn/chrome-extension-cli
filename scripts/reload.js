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
  chromeExtensionPage.on('console', async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  await chromeExtensionPage.goto("chrome://extensions/");
  await chromeExtensionPage.evaluate(() => {
    // open development mode
    document.querySelector("body > extensions-manager").shadowRoot.querySelector("extensions-toolbar").shadowRoot.querySelector("#devMode").click();
  });
}

init();

const reportError = () => {
  const error = document.querySelector('extensions-manager')
    .shadowRoot.querySelector('#viewManager')
    .shadowRoot.querySelector('extensions-error-page')
    .shadowRoot.querySelector('.error-message').textContent;
  window.console.log(error);
}

const reload = () => {
  if (!chromeExtensionPage) return;

  return chromeExtensionPage.evaluate(async (name) => {
    const extensionsConfig = await window.chrome.management.getAll();
    const target = extensionsConfig.find((item) => item.name === name);

    if (target) {
      const card = document
        .querySelector("extensions-manager")
        .shadowRoot.querySelector("extensions-item-list")
        .shadowRoot.querySelector(`extensions-item[id="${target.id}"]`);

      card.shadowRoot.querySelector('cr-icon-button[id="dev-reload-button"]')
        .click();

      const buttonContainer = card.shadowRoot.querySelector('#button-strip > div:first-child');

      if (buttonContainer) {
        new MutationObserver(() => {
          if (buttonContainer.childElementCount >= 3) {
            buttonContainer.children[2].click();
            // reportError();
          }
        }).observe(buttonContainer, { childList: true });
      } else {
        console.error("buttonContainer is not found");
      }
    } else {
      console.error("plugin is not found");
    }
  }, name);
};

module.exports = {
  reload
}
