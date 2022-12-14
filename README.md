**WebScrapingExample**\
Basic project set up to allow for web scraping practices to take place on some Airbnb urls.

Dev: Ryan Smith\
Version: 1.0\
Date: 29/08/2022\
Time Spent: 4 hours


**Project Scope**\
Please write some code that scrapes property name, property type (e.g Apartment), number of bedrooms, bathrooms and list of the amenities for the following 3 properties.

**Design choice**\
After researching some frameworks for web scraping (Axios/Cheerio, JSDOM) I decided to go with Puppeteer, which acts as a headless browser through the use of Chromium. It allows for the manipulation of the browser programmatically and looks to have good documentation for easy integrations.

Not my normal/ most comfortable stack as thats primarily Microsoft based (C# - MVC/Webforms, with JS/JQuery for front end) but I decided to try and implement the solution using Node js and Javascript as that is one of the TravelNest stacks and this ties in nicely with the use of Puppeteer.

I decided to include the ESLint npm package to stick to good coding practices when designing my solution and to keep the code tidy and readable.

**To run project**
1) Make sure node (https://nodejs.org/en/) and npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) are installed
2) Pull main branch from the repository
3) Open up IDE (VS Code is what I use), with command line capabilities. 
4) First run npm install, to install all the relevant packages for the project.
5) Secondly, run node webscraping.js. This will start the project and you should see some console messages indicating that it is running.
6) Finally, once the command has finished running, you should see console output detailing the required Airbnb information or some helpful information about any errors caught or how the project ran.

**Time limitations**\
Without spending too much time on this task there is a list of features that i would like to add to make it more complete
1) Unit testing - perhaps using something like Cypress, Testim.io or WebdriverIO just to ensure that all code meets quality standards before it's deployed.
2) Puppeteer, can make use of click events, on Airbnb the full list of amenities is shown on a modal popup that isnt visible in the DOM on load of the url. Puppeteer can manipulate the dom to click the button that triggers the modal and from there I could attempt to get a more substantial list of amenities, rather than just the key ones.
3) Data is currently just being logged to the console, but it could be exported to a nicer format, perhaps csv.
