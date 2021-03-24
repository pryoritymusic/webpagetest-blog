---
title: Automatic WebPageTest Results for Every Docs Deploy
date: 2021-03-24T14:39:43.262Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1616597869/auto-wpt-deploy-example.png
category: How We Built
author: Tim Kadlec
related_post:
  post: how-to-use
  highlight: Placeholder
---
You may have noticed that the WebPageTest documentation got a facelift. The docs used to be served directly from [their GitHub repo](https://github.com/WPO-Foundation/webpagetest) without any design on top of it. For the new version, we're still using GitHub to house the source (and make it easy for folks to contribute to the documentation if they want), but we're now using the wonderful [Eleventy](https://www.11ty.dev/) to generate a static site, and [Netlify](https://www.netlify.com/) to handle the deployment and hosting.

Naturally when you're building out the documentation for a tool like WebPageTest, you want to make sure things are fast. The choice of tech stack give us a very good start there. The static site just makes sense for something like documentation and also means the server doesn't have any complex queries or processes to run before responding to requests. Eleventy defaults to shipping no client-side JavaScript whatsoever, giving us a great performance baseline on the browser as well.

Still, we want to keep ourselves honest, and have a little fun while doing so. So we thought, what better way to hold ourselves accountable than to be completely transparent and provide a link to WebPageTest results in our footer for each and every deploy.

## Step 1: Automatically test  in WebPageTest whenever a deploy succeeds

With the Github + Eleventy + Netlify approach, whenever we push a change to GitHub, Netlify sees the change and automatically rebuilds the site with Eleventy and then deploys to their edge network.

So our first step was to make sure that whenever a deploy was successful, we kick off a WebPageTest automatically to measure the new version of the site. 

For this, we used [Netlify functions](https://www.netlify.com/products/functions/)—little serverless functions that you can deploy on their network and then trigger similar to any API endpoint. While you can create all sorts of custom functions (more on that in a bit) that you can call directly, Netlify also makes it pretty easy to create functions that are automatically triggered when [certain Netlify events occur](https://docs.netlify.com/functions/trigger-on-events/).

That means, to have a function that automatically gets triggered when Netlify fires a 'deploy-succeeded' event, all we have to do is create a function named `deploy-succeeded.js`. Netlify will see the function, match it to the event name, and fire it whenever that event is triggered—perfect for kicking off our WebPageTest run.

The first thing we need this function to do is run a test. For that, we'll need a few environment variables from Netlify and the [WebPageTest Node API wrapper](https://github.com/marcelduran/webpagetest-api).

```js
const WebPageTest = require("webpagetest");
const { WPT_API_KEY, COMMIT_REF, URL } = process.env;

exports.handler = function (event, context) {
  const wpt = new WebPageTest("https://www.webpagetest.org", WPT_API_KEY);

  let opts = {
    firstViewOnly: true,
    runs: 3,
    location: "Dulles:Chrome",
    label: "Netlify Deploy " + COMMIT_REF,
  };

  wpt.runTest(URL, opts, (err, result) => {
    if (result && result.data) {
      //looking good, let's get our test URL
      let testURL = result.data.userUrl;

      //we'll talk about what comes next in a minute
    }
  });
};
```

After including the WebPageTest module (line #1), we pull in our environment variables. `COMMIT_REF` and `URL` are environment variables that Netilfy provides by default, telling us the commit that triggered the deploy as well as the URL of the site. 

To run a test using the WebPageTest API, we need to pass along an API key. We created an environmental variable in Netlify named `WPT_API_KEY` and dropped our key in there.

![A screenshot from Netlify's dashboard, showing their Environment Variables section with an environment variable of WPT_API_KEY set, and the key itself blurred out.](https://res.cloudinary.com/psaulitis/image/upload/v1616597007/auto-wpt-deploy-env-variable.png)

Now we're able to access it alongside the core environmental variables Netlify provides.

Every function has to export a handler method (line #4) so we wrap up our WebPageTest-related code inside the handler. There's not a *ton* going on after that. We setup our WebPageTest API instance (line #5), define a few options (lines #7-12) and then submit our test (line #14). (We'll get into what happens next in a minute.)

Now, whenever we deploy, Netlify will trigger our function, which will automatically trigger a WebPageTest run in the background.

## Step 2: Storing the Test URL

Normally when using the WebPageTest API, we would need to either keep pinging the API endpoint at a regular cadence to see when the test is complete or [request a pingback](https://docs.webpagetest.org/api/#running-a-test). In our case, we're not after the detailed information in each test run at this point—we simply want the test URL so that we can send visitors to it if they want to keep tabs on us.

```json
...

wpt.runTest(URL, opts, (err, result) => {
  if (result && result.data) {
    //looking good, let's get our test URL
    let testURL = result.data.userUrl;

    //we'll talk about what comes next in a minute
  }
});
```

So instead of pinging the API endpoint, we first check to make sure we have a result object (line #3) and then grab the test URL (line #5). This has the benefit of adding virtually no time to our Netlify deploy process—since we don't have to wait for the test to run, we can grab our URL and move on almost instantly.

Now we need somewhere to store the test URL so that we can reference it later on. There isn't (yet) a standard storage system for Netlify functions, but we can rig this together using [Netlify forms](https://docs.netlify.com/forms/setup/).

To use a form, we need to set it a form up *somewhere* in our site, and then apply the `netlify` attribute. The nice part of this is we don't actually need a publicly linked page or anything like that—as Netlify builds the site if it sees the form during that build process, it'll set up the Netlify form regardless of whether we link to it in anyway. So while using a form for this feels a *little* hacky, we can keep it entirely out of the way of the rest of our site.

Here's what our markup looks like for that:

```html
<!-- hidden form, non-indexed page for our Netlify bot friends -->
<form name="webpagetest-test" netlify netlify-honeypot="bot-field" hidden>
  <input type="text" name="testURL" />
</form>
```

This gives us a form (named "webpagetest-test" using Netlify's honeypot to weed out any bots that happen to stumble on the form. The form will contain only one field, named `testURL`. Now we can have our function dynamically submit a form entry, saving the WebPageTest URL for later.

```js
wpt.runTest(URL, opts, (err, result) => {
  if (result && result.data) {
    //looking good, let's get our test URL
    let testURL = result.data.userUrl;
    console.log("Test URL: " + testURL);

    let payload = {
      "form-name": "webpagetest-test",
      testURL: testURL,
    };

    request.post(
      { url: URL, formData: payload },
      function (err) {
        let msg;

        if (err) {
          msg = "Submission failed: " + err;
          console.log(msg);
        } else {
          msg = "Submission Succeeded";
          console.log(msg);
        }
      }
    );

    return console.log("Complete");
  } else {
    return console.log("Test Failed to Submit");
  }
});
```

Here we're wrapping up our payload (line #7-10) that specifies the form name and provides our URL value, submitting that to our form (line #12-21) and using `console.log` to log the results so that it's easier for us to debug our Netlify build logs if something goes wrong.

## 3. Linking to the latest run from the site

Alright. So far, here's what we have:

1. When we push a change to GitHub, Netlify sees it and kicks off a deploy
2. When the deploy succeeds, Netlify automatically submits a test to WebPageTest using the WebPageTest API
3. We grab the test URL and store it for later using Netlify Forms.

The last thing we have to do is link to that URL. If this were a dynamic site, we could pull in the latest form submission on the fly, but this is a static site—injecting the URL in our markup isn't an option unless we want to kickoff a whole new build, which would kick off another deploy and test which would kickoff a whole new build which....you get the idea.

We're going to turn to another function, oh-so-creatively called `get-webpagetest-url.js`, that will run on Netlify's edge servers (a better place for JavaScript to run, typically).

```js
const { ACCESS_TOKEN, SITE_ID } = process.env;
const NetlifyAPI = require('netlify');

exports.handler = async function(event, context) {
    // get latest testId
    const client = new NetlifyAPI(ACCESS_TOKEN);
    //fetch forms
    const forms = await client.listFormSubmissions({
        formId: '60380a33f2d23100079de7ef'
    })
    console.log('FORMS: ' + forms);
    console.log('Latest test: ' + forms[0].data.testURL);

    return {
        statusCode: 302,
        headers: {
            Location: forms[0].data.testURL
        }
    }

}
```

Again, the function itself ends up being fairly short and sweet. We're going to pull in a couple of environmental variables (line #1) that we'll need to grab the form submissions from Netlify using their API.

Inside of our handler method, we setup an instance of the Netlify API (line #6) with our [access token](https://docs.netlify.com/api/get-started/#authentication), and then fetch the latest form submission from our form, using the form's unique ID.

With the WebPageTest URL in hand, we'll now return a 302 redirect rerouting anyone who happens to hit that function to the WebPageTest results.

## 4. Tidying things up with a redirect

Almost there! In fact, we could leave it as is right now and things would be ok. If we provided a link off to the function directly, anyone who clicks it would be routed to the latest run and all would be fun. Pointing off to the function itself feels a bit unseemly (docs.webpagetest.org/.netlify/functions/get-speedtest-url isn't exactly easy on the eyes), so we decided to setup a redirect in our `netlify.toml` file.

```json
[[redirects]]
    from = "/latest-webpagetest-run"
    to = "/.netlify/functions/get-webpagetest-url"
    status = 200
```

And there we have it. With that in place, each deploy of our documentation results in a new test being run, and each time someone goes to [docs.webpagetest.org/latest-test](http://docs.webpagetest.org/latest-test) they get routed to the results of that test so that can dig in.