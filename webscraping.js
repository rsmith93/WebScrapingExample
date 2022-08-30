const puppeteer = require('puppeteer');

//set up global constants required by webscraping method
const urls = ["https://www.airbnb.co.uk/rooms/20669368", "https://www.airbnb.co.uk/rooms/50633275","https://www.airbnb.co.uk/rooms/33571268"] 
const errLog = [];
const objArr = [];

//object created for returning the required info
class AirBnBObj {
    constructor(title, type, info, amenities, errors) {
        this.title = title;
        this.type = type;
        this.info = info;
        this.amenities = amenities
        this.errors = errors
    }
}
  
const header = "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._b8stb0 > span > h1";
const type = "#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(1) > div > div > section > div > div > div > div._tqmy57 > div > h2";

const infoArr = [];
const ammenitiesArr = [];

//async function for scraping url and storing wanted details
//Into a js object array
//details required: Name, Type, Size info and Amenities
async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let infoFound = true;
    let propertyName = "";    
    
    //if url is not found or valid then log error
    try{
        await page.goto(url);
    }
    catch(ex){
        infoFound = false;
        console.log("Page could not load, please check url and try again")
    }    
    
    try{
        var headerElem = await page.waitForSelector(header);      
        if(headerElem !== null && headerElem !== undefined){  
            propertyName = await page.evaluate(headerElem => headerElem.textContent, headerElem);
            if(propertyName == null || propertyName == undefined){
                infoFound = false;
            }
        }
        else{
            infoFound = false;
        }
    }
    catch(ex){
        infoFound = false;
        console.log("Error getting property: Name - on " + url);
    }

    if(infoFound){  
    
        try{
            var typeElem = await page.waitForSelector(type);
            var propertyType = await page.evaluate(typeElem => typeElem.textContent, typeElem);
            if(propertyType.indexOf("hosted by") > -1){
                var idx = propertyType.indexOf("hosted by")
                propertyType = propertyType.substring(0, idx).trim();
            }
        }
        catch(ex){
            errLog.push("Error getting property: Type - on " + url);
        }       
    
        try{
            this.infoArr = [];
            var propertyInfoLength = (await page.$$('#site-content > div > div > div > div > div._16e70jgn > div > div > div > div > section > div > div > div > div._tqmy57 > ol > li')).length;                    
            for(i = 2; i <= propertyInfoLength; i++){
                var infoElem = await page.waitForSelector("#site-content > div > div > div > div > div._16e70jgn > div > div > div > div > section > div > div > div > div._tqmy57 > ol > li:nth-child(" + i + ") > span:nth-child(2)")
                var infoElemText = await page.evaluate(infoElem => infoElem.textContent, infoElem)
                if(!infoArr.includes(infoElemText)){
                    infoArr.push(infoElemText);
                }
            }
        }
        catch(ex){
            errLog.push("Error getting property: Info - on " + url);
        }
    
        try{
            this.ammenitiesArr = [];
            var amenitiesLength = (await page.$$("#site-content > div > div > div > div > div._16e70jgn > div > div > div > div > section > div._1byskwn > div")).length;
            
            for(var a = 1; a <= amenitiesLength; a++){
                var amenityElem = await page.waitForSelector("#site-content > div > div > div > div > div._16e70jgn > div > div > div > div > section > div._1byskwn > div:nth-child(" + a + ") > div > div:nth-child(1)")            
                var amenityElemText = await page.evaluate(amenityElem => amenityElem.textContent, amenityElem);
                if(!ammenitiesArr.includes(amenityElemText)){
                    ammenitiesArr.push(amenityElemText);
                }
            }
        }
        catch(ex){
            errLog.push("Error getting property: Ammenity - on " + url);
        }
    
        var obj = new AirBnBObj(propertyName, propertyType, infoArr, ammenitiesArr, errLog);
        objArr.push(obj); 
    }
     
    await browser.close()
}

(async () => {
    for(var u = 0; u < urls.length; u++){
        await scrape(urls[u]);
    }
    console.log(objArr);
})();
     

    
  
