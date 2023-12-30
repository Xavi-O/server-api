const express = require('express');
const { Cluster } = require('puppeteer-cluster');
const fs = require('fs').promises;
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

// Optional: If you'd like to use the legacy headless mode. "new" is the default.
chromium.setHeadlessMode = "new";

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

let product = [];
const mombasa = (async () => {
    let addresses = ["./ke/mbs/mbs-cbd.json", "./ke/mbs/nyali-rd.json"];

    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];

        // Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
        await chromium.font(
            "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
        );
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 2,
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        await cluster.task(async ({ page, data: url }) => {

            //Prevent from loading images, styles and fonts
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                    req.abort();
                }
                else {
                    req.continue();
                }
            });

            //Load cookies
            const cookiesString = await fs.readFile(`${address}`);
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);

            await page.goto(url, { waitUntil: 'networkidle0' }); //Go to the search link of the first product

            //Extract the title name of the product and its price
            try {
                const productHandles = await page.$$('.store__body__dynamic-content');
                for (const productHandle of productHandles) {
                    const locationHandles = await page.waitForXPath('//*[@id="user-address"]');
                    location = await page.evaluate
                        (el => el.querySelector('#user-address > div > div')
                            .textContent, locationHandles)

                    title = await page.evaluate
                        (el => el.querySelector('.product-row__content > div > div.product-row__name')
                            .textContent, productHandle)

                    price = await page.evaluate
                        (el => el.querySelector('.product-price__effective.product-price__effective--new-card')
                            .textContent, productHandle)

                    product.push({ "city": "MBS", "address": location, "title": title, "price": price })
                    //console.log({ "city": "MBS", "address": location, "title": title, "price": price })
                }
            } catch (error) {
                product.push({ "city": "MBS", "address": location, "title": url.split("=").pop() + ' Not Found', "price": '-' });
                //console.log({ "city": "MBS", "address": location, "title": url.split("=").pop() + ' Not Found', "price": '-' });
            }

            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            await browser.close();

        });

        cluster.queue('https://glovoapp.com/ke/en/mombasa/kfc-mombasa?search=Rice Bliss');

        // List of product search pages

        await cluster.idle();
        await cluster.close();
    }
})();

const app = express()

module.exports = { mombasa, product };
