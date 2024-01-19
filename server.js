const express = require("express");
const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");
const schedule = require("node-schedule");
const fs = require("fs").promises;
const app = express();

let stores = [];

const job = schedule.scheduleJob("*/1 * * * *", () => {
  (async () => {
    //live status of various cities
    let cities = [/*"Kisumu", */ "Thika"];
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];

      // Launch the browser and open a new blank page
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--force-device-scale-factor=0.5"],
      });
      const page = await browser.newPage();

      //Prevent from loading images, styles and fonts
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

      // Navigate the page to a URL
      await page.goto(
        "https://glovoapp.com/ke/en/" + `${city}` + "/restaurants_394/"
      );

      try {
        let isBtnDisabled = false;
        while (!isBtnDisabled) {
          await page.waitForSelector(".store-card");
          const storeNames = await page.$$(".store-card");

          for (const storeName of storeNames) {
            let title = "Null";
            let tag = "Open";

            try {
              title = await page.evaluate(
                (el) =>
                  el.querySelector(".store-card__footer__title").textContent,
                storeName
              );
            } catch (error) {}
            try {
              tag = await page.evaluate(
                (el) =>
                  el.querySelector(
                    ".store-card__long-text-prevention > div > div"
                  ).textContent,
                storeName
              );
            } catch (error) {}
            const now = new Date();
            const currentDateTime = now.toLocaleTimeString();

            stores.push({
              city: `${city}`,
              storename: title,
              storestatus: tag,
              time: currentDateTime,
            });
          }
          await page.waitForSelector(".next-page-link", {
            visible: true,
            timeout: 5000,
          });

          const is_disabled =
            (await page.$(".next-page-link--disabled")) !== null;

          isBtnDisabled = is_disabled;

          if (!is_disabled) {
            await page.click(".next-page-link");
            await page.waitForNavigation();
          }
        }
        //console.log(stores.length)
      } catch (error) {}

      await browser.close();
    }

    app.get("/stores", (req, res) => {
      const KFC = stores.filter(
        (a) => a.storename === "\n          KFC\n        "
      );

      const kfcData = fs.writeFile(
        "./JSONadmindata-api/kfc-products.json",
        JSON.stringify(KFC, null, 2)
      );

      res.send(kfcData);
    });
  })();
});
