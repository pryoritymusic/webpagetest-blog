---
title: August WebPageTest Roundup
guest: false
date: 2021-09-08T14:19:19.011Z
description: Check out a summary of the features and changes to WebPageTest in
  the month of August.
featured_image: https://res.cloudinary.com/webpagetest/image/upload/v1631111634/august-roundup_plhjt4.png
tags:
  - API
  - Render-Blocking
  - NodeJS
  - Documentation
category: Product News
author: Tim Kadlec
---
*Things can move pretty quickly around here. In addition to the [change log](https://docs.webpagetest.org/change-log/), we're publishing monthly summaries of some of the highlights of features and changes made to WebPageTest in the last month.*

## Making it easier to Experiment

Third-party performance problems are incredibly common, and one of those issues that folks frequently find themselves wanting to better understand. WebPageTest provides a few helpful options for gauging their impact and this month we made it easier to use them with the new "Experiments" feature.

The SPOF test lets folks see how a site performs when a third-party resource that blocks the initial rendering of the page suddenly hangs (the provider has issues, etc). And WebPageTest also makes it possible to block individual resources from loading, or to block all resources from a given domain, using either the Advanced Settings > Block tab on the test home page, or the `block` and `blockDomains` [scripting commands](https://docs.webpagetest.org/scripting/#request-manipulation).

In the past, running either test required you to go back to the test form and manually enter the URL's and domains you wanted to test.

The new Experiments feature lets you run those tests directly from the waterfall instead, making it much easier to quickly run experiments and test your hypothesis.

If you click on a request on the waterfall, you'll find a new "Experiments" tab in the dialog box that appears.

![The new "experiment" tab from the request details view lets you select URLs and domains to block, or run a SPOF test.](https://res.cloudinary.com/webpagetest/image/upload/v1631110959/experiment-tab_w40cev.png)

The tab will provide three possible experiments right now:

* Run a SPOF test (only shown if the resource is render blocking)
* Block Request URL
* Block Request Domain

You can add any number of URLs  and domains to block, enter a label to make it easier to find your results later on in your test history, and then run the test all without every leaving the waterfall.

![The new experiments box, showing a list of the URL's that will be blocked, a list of the domains to block, a label field and a button to "run experiment"](https://res.cloudinary.com/webpagetest/image/upload/v1631110959/experiments-box_vtj55r.png)

The ability to run your URL through different scenario's to see how performance is impacted is one of the more powerful and important WebPageTest features. Expect more experiments to be added in the future to make this even easier.

## Cleaning up the command bar

There are a number of different artifacts produced for each test you run on WebPageTest: 

* A JSON file containing all the metrics and test data (this is identical to what you can get from the API)
* A test log that shows you information about how long it took WebPageTest to run the test and, if there's a failure, where in the testing process it cut out
* A [HAR file for additional analysis](https://en.wikipedia.org/wiki/HAR_(file_format)).
* A Lighthouse test log (if a Lighthouse test was run) detailing how long it took Lighthouse to run and, if there's a failure, where it cut out.
* A zip file containing all the response bodies for any text based responses (CSS, JS, HTML, etc) if "Save Response Bodies" was selected.

Some of these artifacts were spread out, and it wasn't always clear what you could download or access directly, so we cleaned things up a bit to make it easier to get at the information you want.

![The Export Files menu list, expanded, showing links to view JSON, View Test Log, View Lighthouse Log, Download JSON, Download HAR, Download Test Log and Download Lighthouse Log](https://res.cloudinary.com/webpagetest/image/upload/v1631111763/command-bar2_ynfp8i.png)

## API endpoint for checking available test runs

Checking your remaining API run balance was only possible in the past by logging into your account and looking at the details of your Subscription Plan (yeah...we know...we're sorry).

In August, we added a new endpoint to the API so that you can programmatically check your remaining balance for the current billing period by passing along your API key.

```jsx
https://webpagetest.org/testBalance.php?{your_api_key}
```

If the API key is valid, you will get a small JSON object indicating how many runs you have left:

```json
{
    "data": {
        "remaining": 1175
    }
}
```

You can find more information in the [documentation](https://docs.webpagetest.org/api/reference/#checking-remaining-test-balance).

## A new NodeJS wrapper version

We were super excited to [work with Marcel Duran to bring his popular API wrapper for NodeJS officially in-house](https://blog.webpagetest.org/posts/announcing-official-support-the-webpagetest-api-wrapper-for-nodejs/). The wrapper he's built has become the most popular way for folks to use the WebPageTest API, and this makes it much easier for the entire WebPageTest team to keep on top of bugs, feature requests and more.

We put out a [new version of the wrapper this month](https://github.com/WebPageTest/webpagetest-api/releases/tag/v0.5.0) that included some bug fixes and added support for a bunch of missing API parameters as well.

## Adding search to the docs

Thanks to Algolia's build plugin for Netlify, we added [search to our documentation](https://docs.webpagetest.org/) site to make it easier to find what you're after.

Selfishly, this is also *super* helpful for us, as it helps us to see what folks are searching for to help us prioritize which documentation gaps to fill first. For example, we saw that "Lighthouse" was being searched pretty often, so we bumped that to the top of our list and published some information about [how WebPageTest runs Lighthouse](https://docs.webpagetest.org/running-lighthouse/).

![A screenshot of the new search on docs, with the query "lighth" entered and a number of options, including a "Running Lighthouse" result, displayed](https://res.cloudinary.com/webpagetest/image/upload/v1631111228/docs-search_e8qj1e.png)

## Static IP's are here

A lot of folks want to be able to run tests on internal sites (for example, pre-production environments) that are tucked away behind a firewall. We also see a lot of folks trying to work around overly aggressive bot protection services that may block the WebPageTest agents.

To make it a little easier to get around these issues, we've moved all of our EC2 instances to use static IP addresses, making it possible for folks to enable traffic from those specific IP's only so that they can more easily test with WebPageTest.

You can find a full list of test locations [and their IP's on the site](https://www.webpagetest.org/addresses.php).