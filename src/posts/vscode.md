---
title: Building Visual Studio Code Extension For WebPageTest
date: 2021-07-21T19:11:20.237Z
tags:
  - VS Code
  - API Integration
category: How We Built It
author: Abdul Suhail
related_post:
  post: automatic-webpagetest-results-for-every-docs-deploy
---
According to the [Stack Overflow 2019 Developer Survey](https://insights.stackoverflow.com/survey/2019#development-environments-and-tools), Visual Studio Code was ranked the most popular developer environment tool, with 50.7% of 87,317 reporting that they use it.

Our primary reason for building this extension was to help developers improve the performance of their website while they are coding, isn’t it easier to fix issues the earlier we discover them?

Usually, developers writing code on VS Code need to get out of their code editor to check the performance of their developed frontend code, so we asked ourselves

How about testing performance inside VS Code? Where they cook their code?

Hmm, seems a nice idea, but how?

Well, hop on and let us see how we did it.

## Step 1: Generating Basic Boilerplate for the extension

VS Code eases the process of building an extension by providing boilerplate code, to generate one we need to have Node.js installed, then we can install [Yeoman](https://www.npmjs.com/package/yo) and ,[VS Code Extension Generator](https://www.npmjs.com/package/generator-code) by running:  

`npm install -g yo generator-code`

The VS Code Extension Generator scaffolds a TypeScript or JavaScript project ready for development. Now let us run the generator and fill out a few fields for the Project:   

`yo code`

![](https://res.cloudinary.com/psaulitis/image/upload/v1626961439/vscode-yo.png)

Just to note we are generating JavaScript Extension. Okay, great we now have an extension up let us all our WebPageTest functionalities.

![](https://res.cloudinary.com/psaulitis/image/upload/v1626961439/vscode-extensionjs.png)

## Step 2: Adding Settings

Did you know, Visual Studio Code is built using web technologies (HTML, CSS, JavaScript) on top of Github's Electron?

This makes it easier to configure Visual Studio Code to your liking through its various settings. Nearly every part of VS Code's editor, user interface, and functional behavior has options you can modify. 

 We are going to need a few properties to run our tests, so it makes sense to accept those as settings for easy configuration. Let us accept an API Key, location, URL, etc.. to trigger the tests. Below is an example object from settings.json

```json
// Your WebPageTest API key. REQUIRED
"wpt_extension.apiKey": "YOUR_API_KEY",

// The URL to test. If left out of settings.json, the extension will prompt you for a URL when run.
"wpt_extension.urlToTest": null,

// The location to test from. The location is comprised of the location of the testing agent, the browser to test on, and the connectivity in the following format: location:browser.connectivity.
"wpt_extension.location": "Dulles:Chrome.Cable",

// The number of tests to run
"wpt_extension.runs": 1,

// The interval (in seconds) to poll the API for test results
"wpt_extension.pollResults": 5,

// The maximum time (in seconds) to wait for test results
"wpt_extension.timeout": 240,
```

You can add all the options that [WebPageTest Node API wrapper](https://github.com/marcelduran/webpagetest-api) supports. Above is just a basic one. 

## Step 3: Building Webview 

The webview API allows extension to create fully customizable views within Visual Studio Code. Think of a webview as an iframe within VS Code that your extension controls. A webview can render almost any HTML content in this frame, and it communicates with extensions using message passing.

For us we want the webview to provide details of the test like metrics, screenshot, and waterfall.

We have 5 types of responses displayed when a test is run:  

* **Successful Test Submission** – When a test is successfully submitted 
* **No URL** – When there is no URL added 
* **Error** – If there is any error caused while running the test 
* **Chrome Based Test** – When test is chrome specific and contains chrome web vitals 
* **Non-Chrome Based Test** – When test is non-chrome specific  

Let us see each one in detail.

### **3.1 Successful Test Submission** 

Below is an example HTML which is displayed after successful test submission, where we display the URL being tested. 

```javascript
exports.getContentForTestSubmission = (url) =>{
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebPageTest Results</title>
        <style>
          h1 {text-align: center;}
          h3 {text-align: center;}
        </style>
    </head>
    <body>
          <h1>WebPageTest Results</h1>
          <h3>Test Submitted for <a href="${url}">${url}</a></h3>
          <h3>Please wait until we fetch your results....</h3>
      </body>
    </html>`
}
```

### **3.2 NO URL** 

Below is an example HTML which is displayed if no URL is provided for test submission, where we display the message providing information on how it can be added. 

```javascript
exports.getContentForNoUrl = ()=>{

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebPageTest Results</title>
        <style>
          h1 {text-align: center;}
          h3 {text-align: center;}
          h4 {text-align: center;}
        </style>
    </head>
    <body>
          <h1>WebPageTest Results</h1>
          <h3>Please enter a URL to test</h3>
          <h4>You can add URL in settings.json file for vscode or enter it in the input field</h4>
      </body>
    </html>`
}
```

### **3.3 Error**  

Below is an example HTML which is displayed if there is an error caused while running the test, here we display the status message sent by WebPageTest. An example could be if the api_key provided is invalid. 

```javascript
exports.getContentForError = (wptResponse)=>{

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebPageTest Results</title>
        <style>
          h1 {text-align: center;}
          h3 {text-align: center;}
          h4 {text-align: center;}
        </style>
    </head>
    <body>
          <h1>WebPageTest Results</h1>
          <h3>${wptResponse.statusText}</h3>
      </body>
    </html>`
}
```

### **3.4 Chrome Based Test Result** 

 Below is an example HTML which is displayed for chrome-based test. 

```javascript
exports.getContentForChromeBasedSubmission = (wptResponse) =>{

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebPageTest Results</title>
        <style>
        //Lets see this later
        </style>
    </head>
    <body>
          <h1>WebPageTest Results</h1>
          <h3>Test result for <a href="${wptResponse.result.data.url}">${wptResponse.result.data.url}</a></h3>
          <h3>Find detailed results at <a href="${wptResponse.result.data.summary}">${wptResponse.result.data.summary}</a></h3>
          <h4><b>From :</b> ${wptResponse.result.data.from} </h4>
          
          <div>
              <table>
                  <tbody>
                      <tr>
                            <th colspan="4" class="bordernone"></th>
                          <th colspan="3">Web Vitals</th>
                          <th colspan="3">Document Complete</th>
                          <th colspan="4">Fully Loaded</th>  
                      </tr>
                      <tr>
                          <th>First Byte</th>
                          <th>Start Render</th>
                          <th>First Contentful Page</th>
                          <th>Speed Index</th>
                          <th>Largest Contentful Paint</th>
                          <th>Cumulative Layout Shift</th>
                          <th>Total Blocking Time</th>
                          <th>Time</th>
                          <th>Requests</th>
                          <th>Bytes In</th>
                          <th>Time</th>
                          <th>Requests</th>
                          <th>Bytes In</th>  
                      </tr>
                      <tr>
                            <td>${wptResponse.result.data.median.firstView.TTFB/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.render/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.firstContentfulPaint/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.SpeedIndex/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.chromeUserTiming.LargestContentfulPaint/1000}s</td>
                          <td>${wptResponse.result.data.median.firstView.chromeUserTiming.CumulativeLayoutShift}</th>
                          <td>>= ${wptResponse.result.data.median.firstView.TotalBlockingTime/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.docTime/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.requestsDoc}</th>
                          <td>${Math.round(wptResponse.result.data.median.firstView.bytesInDoc/1024)}KB</th>
                          <td>${wptResponse.result.data.median.firstView.fullyLoaded/1000}s</th>
                          <td>${wptResponse.result.data.median.firstView.requestsFull}</th>
                          <td>${Math.round(wptResponse.result.data.median.firstView.bytesIn/1024)}KB</th>  
                      </tr>
                  </tbody>
              </table>
          </div>
  
          <div class="row" align="center">
              <div class="column">
                  <h4>Waterfall</h4>
                    <img src="${wptResponse.result.data.median.firstView.images.waterfall}"/>
              </div>
              <div class="column">
                  <h4>Screenshot</h4>
                    <img src="${wptResponse.result.data.median.firstView.images.screenShot}"/>
              </div>
          </div>
      
      </body>
    </html>`;
  
}
```

### **3.5 Non-Chrome Based Test Result** 

Below is an example HTML which is displayed for non-chrome based test. 

```javascript
exports.getContentForNonChromeBasedSubmission = (wptResponse) =>{

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WebPageTest Results</title>
            <style>
              // Hang on, lets see this in a bit
            </style>
        </head>
        <body>
              <h1>WebPageTest Results</h1>
              <h3>Test result for <a href="${wptResponse.result.data.url}">${wptResponse.result.data.url}</a></h3>
              <h3>Find detailed results at <a href="${wptResponse.result.data.summary}">${wptResponse.result.data.summary}</a></h3>
              <h4><b>From :</b> ${wptResponse.result.data.from} </h4>
              
              <div>
                  <table>
                      <tbody>
                          <tr>
                                <th colspan="4" class="bordernone"></th>
                              <th colspan="1">Web Vitals</th>
                              <th colspan="3">Document Complete</th>
                              <th colspan="4">Fully Loaded</th>  
                          </tr>
                          <tr>
                              <th>First Byte</th>
                              <th>Start Render</th>
                              <th>First Contentful Page</th>
                              <th>Speed Index</th>
                              <th>Total Blocking Time</th>
                              <th>Time</th>
                              <th>Requests</th>
                              <th>Bytes In</th>
                              <th>Time</th>
                              <th>Requests</th>
                              <th>Bytes In</th>  
                          </tr>
                          <tr>
                                <td>${wptResponse.result.data.median.firstView.TTFB/1000}s</th>
                              <td>${wptResponse.result.data.median.firstView.render/1000}s</th>
                              <td>${wptResponse.result.data.median.firstView.firstContentfulPaint/1000}s</th>
                              <td>${wptResponse.result.data.median.firstView.SpeedIndex/1000}s</th>
                              <td>>= ${wptResponse.result.data.median.firstView.TotalBlockingTime/1000}s</th>
                              <td>${wptResponse.result.data.median.firstView.docTime/1000}s</th>
                              <td>${wptResponse.result.data.median.firstView.requestsDoc}</th>
                              <td>${Math.round(wptResponse.result.data.median.firstView.bytesInDoc/1024)}KB</th>
                              <td>${wptResponse.result.data.median.firstView.fullyLoaded/1000}s</th>
                              <td>${wptResponse.result.data.median.firstView.requestsFull}</th>
                              <td>${Math.round(wptResponse.result.data.median.firstView.bytesIn/1024)}KB</th>  
                          </tr>
                      </tbody>
                  </table>
              </div>
      
              <div class="row" align="center">
                  <div class="column">
                      <h4>Waterfall</h4>
                        <img src="${wptResponse.result.data.median.firstView.images.waterfall}"/>
                  </div>
                  <div class="column">
                      <h4>Screenshot</h4>
                        <img src="${wptResponse.result.data.median.firstView.images.screenShot}"/>
                  </div>
              </div>
          
          </body>
        </html>`;
      
}
```

**Style Tag for Chrome and Non-Chrome based test result:**

```html
<style>
              h1 {text-align: center;}
              h2 {text-align: center;}
              .row {
                  display: flex;
                }
                
                .column {
                  flex: 33.33%;
                  padding: 5px;
                }
                table {
                  font-family: arial, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                }
                td, th {
                  border: 1px solid silver;
                  padding: 8px;	
                  text-align: center;
                }
                .bordernone{
                    border: none;
                }	
 </style>
```

## Step 4: Wrapping The WebPageTest Method 

It is always recommended to keep the code modular for easy maintainability. Below we have wrapped the runTest method provided by the [WebPageTest Node API wrapper](https://github.com/marcelduran/webpagetest-api)  which is a callback based method and converted it to be as a promise-based method. 

```javascript
exports.runTest = (wpt, url, options) => {

    const tempOptions = JSON.parse(JSON.stringify(options));
    return new Promise((resolve, reject) => {
        wpt.runTest(url, tempOptions, async(err, result) => {
            try {
                if (result) {
                    return resolve({'result':result,'err':err});
                } else {
                    return reject(err);
                }
            } catch (e) {
                console.info(e);
            }
        })
    });
}
```

## Step 5: Constructing The Extension 

Ufff, pretty long, but now we have all the pre-requisites to construct the extension. Let us finally build it  

####  Extension Anatomy 

The WebPageTest extension does 3 things: 

* Registers the [onCommand](https://code.visualstudio.com/api/references/activation-events#onCommand) [Activation Event](https://code.visualstudio.com/api/references/activation-events): onCommand:extension.webpagetest.wpt so the extension becomes activated when user runs the WebPageTest command. 
* Uses the [contributes.commands](https://code.visualstudio.com/api/references/contribution-points#contributes.commands) [Contribution Point](https://code.visualstudio.com/api/references/contribution-points) to make the command WebPageTest available in the Command Palette and bind it to a command ID extension.webpagetest. 
* Uses the [commands.registerCommand](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand) [VS Code API](https://code.visualstudio.com/api/references/vscode-api) to bind a function to the registered command ID extension.webpagetest. 

Understanding these three concepts is crucial to writing extensions in VS Code: 

* [Activation Events](https://code.visualstudio.com/api/references/activation-events): events upon which your extension becomes active. 
* [Contribution Points](https://code.visualstudio.com/api/references/contribution-points): static declarations that you make in the package.json [Extension Manifest](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-manifest) to extend VS Code. 
* [VS Code API](https://code.visualstudio.com/api/references/vscode-api): a set of JavaScript APIs that you can invoke in your extension code. 

In the below code we are including the WebPageTest, VS Code modules (line #1 and #2) and helper methods built earlier (line #3 and line #4) 

1. **wpt-helpers** - WebPageTest wrapped and converted as a Promise 
2. **web-views** - HTML content to be displayed as result. 

After registering the command and fetching the configurations added earlier (line #18, #22), we setup an instance of WebPageTest by passing the api_key (line #24). 

 If there is no URL passed in the configuration(settings.json), we are using the VS Code API (vscode.window.showInputBox) to fetch it (line #27). This is the final call to board your URL. 

 All the necessary configuration is set if not added in the settings.json (line #29 – line #33) 

```
const vscode = require('vscode'); //line #1
const WebPageTest = require("webpagetest"); //line #2
const wptHelpers = require('./wpt-helpers'); //line #3
const webViews = require('./utils/web-views'); //line #4
let options = {
	"firstViewOnly": true,
	"runs": 1,
	"location": 'Dulles:Chrome.Cable',
	"pollResults": 5,
	"timeout": 240
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	let disposable = vscode.commands.registerCommand('webpagetest.wpt', async function () {  //line #18

		try {

			const wpt_extension_config = JSON.parse(JSON.stringify(vscode.workspace.getConfiguration('wpt_extension')))  //line #22
			const WPT_API_KEY = wpt_extension_config.apiKey;
			const wpt = new WebPageTest('www.webpagetest.org', WPT_API_KEY); //line #24
			let url = wpt_extension_config['urlToTest'];
			if (!url)
				url = await vscode.window.showInputBox({"prompt": "Enter the URL you want to test."}) //line #27
			
			wpt_extension_config['firstViewOnly'] = wpt_extension_config['firstViewOnly'] === false ? false : options['firstViewOnly']; //line #29
			wpt_extension_config['location'] = wpt_extension_config['location'] || options['location'];
			wpt_extension_config['pollResults'] = wpt_extension_config['pollResults'] || options['pollResults'];
			wpt_extension_config['timeout'] = wpt_extension_config['timeout'] || options['timeout'];
			wpt_extension_config['runs'] = wpt_extension_config['runs'] || options['runs'];  //line #33

			var panel = vscode.window.createWebviewPanel(
				'webpagetest',
				'WebPageTest',
				vscode.ViewColumn.One
			);

			if (!url) {
				panel.webview.html = webViews.getContentForNoUrl();
				return;
			}
```

In the below image vscode.window.createWebviewPanel function creates and shows a webview in the editor (line #1). 

If you have not added the URL in the final call, contentForNoURL webview is displayed (line #8) and if added there are 2 different webviews generated for final result: 

1. **Chrome Based** (line #24)
2. **Non-Chrome Based** (line #27) 

```javascript
			var panel = vscode.window.createWebviewPanel(
				'webpagetest',
				'WebPageTest',
				vscode.ViewColumn.One
			);

			if (!url) {
				panel.webview.html = webViews.getContentForNoUrl();
				return;
			}
			panel.webview.html = webViews.getContentForTestSubmission(url);
			const wptResponse = await wptHelpers.runTest(wpt, url.toString(), wpt_extension_config);
			const chromeUserTiming = wptResponse.result.data.median.firstView.chromeUserTiming;
			if (chromeUserTiming) {
				for (let i = 0; i < chromeUserTiming.length; i++) {
					if (chromeUserTiming[i].name == 'firstContentfulPaint')
						wptResponse.result.data.median.firstView.firstContentfulPaint = chromeUserTiming[i].time;
					if (chromeUserTiming[i].name == 'LargestContentfulPaint')
						wptResponse.result.data.median.firstView.chromeUserTiming.LargestContentfulPaint = chromeUserTiming[i].time;
					if (chromeUserTiming[i].name == 'CumulativeLayoutShift')
						wptResponse.result.data.median.firstView.chromeUserTiming.CumulativeLayoutShift = chromeUserTiming[i].value.toFixed(3);
				}

				panel.webview.html = webViews.getContentForChromeBasedSubmission(wptResponse);
			}
			else {
				panel.webview.html = webViews.getContentForNonChromeBasedSubmission(wptResponse);
			}
```

[Full Code for reference can be found here](https://github.com/WebPageTest/wpt-vscode-extension)

## Step 4: Running The Extension

Was a long ride, wasn't it? Let us run the extension now. 

The steps below are used to run the extension in the debugger mode: 

4.1 Press F5 to trigger the debugger. This opens one more VS Code window where our command has been registered.

4.2 Open the Command Palette (⇧⌘P) and start typing WebPageTest.

![](https://res.cloudinary.com/psaulitis/image/upload/v1626961439/vscode-run.png)

4.3 Run the command, and if you had not entered the URL before in the settings.json you get an option to enter it (the final call which we were talking about earlier). Once the test is submitted following response is displayed:

![](https://res.cloudinary.com/psaulitis/image/upload/v1626961439/vscode-running.png)

Below is an example of how the results on the Webview looks: 

![](https://res.cloudinary.com/psaulitis/image/upload/v1626961439/vscode-final.png)

Still here with me (reading)? We are also releasing this extension on the [VS Code extension marketplace](https://marketplace.visualstudio.com/items?itemName=WebPageTest.wpt-vscode-extension), so you can just plug and play.

As always, we value your feedback and help in improving this experience for you and millions of developers around the world. You can always help us improve by raising [PRs on the repository](https://github.com/WebPageTest/wpt-vscode-extension).