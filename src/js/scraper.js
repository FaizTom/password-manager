const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://safeweb.norton.com/report/show?url=" + url);

    await page.waitForSelector('.community-text label')
    let element = await page.$('.community-text label')
    let value = await page.evaluate(el => el.textContent, element)

    return value;

    browser.close();
}

const fs = require('fs');
const readline = require('readline');
var websiteRank = [];
async function processLineByLine() {
    const fileStream = fs.createReadStream('website.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        var rating = await scrapeProduct(line);
        websiteRank.push({ "website": line, "rating": rating });
        console.log(websiteRank);
    }
    const json = JSON.stringify(websiteRank);
    fs.writeFile('website.json', json, 'utf8', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("OK");
        }
    });
}

processLineByLine();