const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: ["--force-device-scale-factor=0.5"],
    userDataDir: "./whatsapp-session", //store the user data
  });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36');

  await page.goto("https://web.whatsapp.com/", {
    waitUntil: "domcontentloaded",
  });
  /*
  await page.waitForSelector("div._3rDmx > div > span", {
    visible: true, timeout: 0
  });

  const [linkWithNumber] = await page.$$("div._3rDmx > div > span");

  if (linkWithNumber) {
    await linkWithNumber.click();
  }

  let numInput =
    "div.tvf2evcx.m0h2a7mj.lb5m6g5c.j7l1k36l.ktfrpxia.nu7pwgvd.dnb887gk.gjuq5ydh.i2cterl7.r2u2pyhj > div > div > div > form > input";

  await page.waitForSelector(numInput, { visible: true });

  await page.click(numInput, { clickCount: 3 });

  await page.keyboard.type("+254797333765");

  let nextBtn =
    "div.tvf2evcx.m0h2a7mj.lb5m6g5c.j7l1k36l.ktfrpxia.nu7pwgvd.dnb887gk.o2es7gts.i2cterl7.iyjcf3gk > button";

  await page.click(nextBtn, { waitUntil: "domcontentloaded" });

  await page.waitForSelector("div._2I5ox > div > div > div");
  let element = await page.$("div._2I5ox > div > div > div");
  let value = await page.evaluate((el) => el.textContent, element);

  console.log("Please Enter the code: " + value);
*/
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.waitForSelector("div._21S-L > span", {
    visible: true,
    timeout: 0,
  });

  const [linkHandler] = await page.$x("//span[contains(., '...')]");

  if (linkHandler) {
    await linkHandler.click();
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await timeout(5 * 1000);

  await page.keyboard.type("Hello, This is an automation test", {
    waitUntil: "domcontentloaded",
  });

  await page.keyboard.press("Enter");

  await timeout(15 * 1000);

  console.log("Success!");

  await browser.close();
})();
