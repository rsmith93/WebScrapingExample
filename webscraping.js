const puppeteer = require("puppeteer");

// set up global constants required by webscraping method
const urls = ["https://www.airbnb.co.uk/rooms/20669368",
              "https://www.airbnb.co.uk/rooms/50633275",
              "https://www.airbnb.co.uk/rooms/33571268"];
const header = `#site-content > div > div:nth-child(1) > div:nth-child(1) > 
                div:nth-child(1) > div > div > div > div > section >
                div._b8stb0 > span > h1`;
const type = `#site-content > div > div:nth-child(1) > div:nth-child(3) > 
              div > div._16e70jgn > div > div:nth-child(1) > div > div 
              > section > div > div > div > div._tqmy57 > div > h2`;

// async function for scraping url and storing wanted details
// Into a js object
// details required: Name, Type, Size info and Amenities
async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();    
    const infoArr = [];
    const ammenitiesArr = [];
    const errLog = [];
    let infoFound = true;
    let propertyName = "";
    let propertyType = "";

    // if url is not found or valid then log error
    // set info found variable to false so that the 
    // remaining calls to puppeteer do not execute/hang
    try {
        await page.goto(url);
    } catch (ex) {
        infoFound = false;
        console.log("Page could not load, please check url and try again");
    }

    // Get the header/ name of the property
    // if it cant be found then the page is not 
    // the correct format for the sacraping exercise 
    // so should be skipped
    try {
        const headerElem = await page.waitForSelector(header);
        if (headerElem !== null && headerElem !== undefined) {
            propertyName = await page.evaluate((headerElem) =>
                headerElem.textContent, headerElem);
            if (propertyName == null || propertyName == undefined) {
                infoFound = false;
            }
        } else {
            infoFound = false;
        }
    } catch (ex) {
        infoFound = false;
        console.log("Error getting property: Name - on " + url);
    }

    // If it found the name of the property then the DOM is correct
    // Get the property type (apartment, house etc)
    if (infoFound) {
        try {
            const typeElem = await page.waitForSelector(type);
            propertyType = await page.evaluate((typeElem) =>
                typeElem.textContent, typeElem);
            if (propertyType.indexOf("hosted by") > -1) {
                const idx = propertyType.indexOf("hosted by");
                propertyType = propertyType.substring(0, idx).trim();
            }
        } catch (ex) {
            errLog.push("Error getting property: Type - on " + url);
        }

        // Get the property info relating to size and rooms
        try {
            infoArr.length = 0;
            const propertyInfoLength = (await page.$$(`#site-content > div > div > div > div > div._16e70jgn >
                                                       div > div > div > div > section > div > div > div > 
                                                       div._tqmy57 > ol > li`)).length;
            for (i = 2; i <= propertyInfoLength; i++) {
                const infoElem = await page.waitForSelector(`#site-content > div > div > div > div > 
                                                             div._16e70jgn > div > div > div > div > 
                                                             section > div > div > div > div._tqmy57
                                                             > ol > li:nth-child(` + i + `) > 
                                                             span:nth-child(2)`);
                const infoElemText = await page.evaluate((infoElem) => infoElem.textContent, infoElem);
                if (!infoArr.includes(infoElemText)) {
                    infoArr.push(infoElemText);
                }
            }
        } catch (ex) {
            errLog.push("Error getting property: Info - on " + url);
        }

        // Get the property amenities list
        // First obtain the length, so we can loop through efficiently
        // Then obtain text and add to array
        try {
            ammenitiesArr.length = 0;
            await page.waitForSelector(`#site-content > div > div > div > div >
                                        div._16e70jgn > div > div > div > div >
                                        section > div._1byskwn > div`);
            const amenitiesLength = (await page.$$(`#site-content > div > div > div
                                                    > div > div._16e70jgn > div > div
                                                    > div > div > section >
                                                    div._1byskwn > div`)).length;            

            for (let a = 1; a <= amenitiesLength; a++) {
                const amenityElem = await page.waitForSelector(`#site-content > div > div > div > div > div._16e70jgn
                                                                > div > div > div > div > section > div._1byskwn >
                                                                div:nth-child(` + a + `) > div > div:nth-child(1)`);
                if(amenityElem !== null && amenityElem !== undefined){
                    const amenityElemText = await page.evaluate((amenityElem) => amenityElem.textContent, amenityElem);
                    if (!ammenitiesArr.includes(amenityElemText)) {
                        ammenitiesArr.push(amenityElemText);
                    }
                }                
            }
        } catch (ex) {
            errLog.push("Error getting property: Ammenity - on " + url);
        }

        await browser.close();
        const obj = {title:propertyName, type:propertyType, info:infoArr, amenities:ammenitiesArr, errors:errLog};
        return obj;
    }

    await browser.close();
    return null;
}

(async () => {
    const objArr = [];
    for (const url in urls) {
        if (url !== null && url !== undefined && url !== "") {
            console.log("Start web scraping on " + urls[url]);
            const result = await scrape(urls[url]);
            if (result !== null && result !== undefined) {
                objArr.push(result);
            }
            console.log("Finished web scraping on " + urls[url]);
        } else {
            console.log("Url not valid, please check and try again");
        }
    }
    console.log(objArr);
})();
