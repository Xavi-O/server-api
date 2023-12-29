/*const express = require('express')
const test = require("node:test");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

// Optional: If you'd like to use the legacy headless mode. "new" is the default.
chromium.setHeadlessMode = true;

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

// Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
await chromium.font(
  "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
);

test("Check the page title of example.com", async (t) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto("https://example.com");
  const pageTitle = await page.title();
  await browser.close();

  assert.strictEqual(pageTitle, "Example Domain");
}); 

const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
*/

const express = require('express')
const mombasa = require('./ke/mbs/mbs');
const nrk = require('./ke/nrk/nrk');
const app = express()

let cities = [mombasa, nrk]
for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    city;

    app.all('/', (req, res) => {
        res.send(mombasa.product.concat(nrk.product))
    })


}

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port!`))
