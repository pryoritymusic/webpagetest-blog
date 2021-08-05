---
title: July WebPageTest Roundup
guest: false
date: 2021-08-05T14:11:19.549Z
description: Check out a summary of the features and changes to WebPageTest in
  the month of July.
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1628174388/July_Roundup_b2j1il.png
tags:
  - VS Code
  - Render-Blocking
  - CSS
  - JavaScript
  - Critical Path
category: Product News
author: Tim Kadlec
related_post:
  post: vscode
---
*Things can move pretty quickly around here. In addition to the [change log](https://docs.webpagetest.org/change-log/), we're publishing monthly summaries of some of the highlights of features and changes made to WebPageTest in the last month.*

## Render Blocking Icon and Other Waterfall Updates

The waterfall is the heart of front-end performance analysis—there's an incredible amount of information in that visual that is critical to understanding your site's performance. WebPageTest has always tried to find ways to make the waterfall more insightful: highlighting JavaScript execution, drawing indicators when key performance metrics fire, aligning the waterfall with screen shots so you can see what impacts visual change, and more.

This past month, we made a few more improvements to our waterfalls to help make it easier to glean some meaningful insights from them.

### HTTPS First

The WebPagetest waterfall has always shown a lock indicator next to requests when those requests were made over a HTTPS connection. Requests made over a HTTP connection had no indicator.

This made sense when HTTPS was less common, but with the HTTP Archive [now showing that 91% of all requests are over HTTPS](https://httparchive.org/reports/state-of-the-web#pctHttps), it just leads to a cluttered waterfall and makes it harder to identify insecure requests that need to be cleaned up.

We flipped that around this month. Now, waterfalls will show no indicator for HTTPS requests. Instead, we show an insecure icon for HTTP requests. It's a simple tweak, but it cleans up the waterfall and makes it much easier to spot insecure requests.

![A before and after shot comparing WebPageTest waterfalls. The before shows a waterfall cluttered with secure icons on almost every line. The after shows a waterfall with no secure icons, but instead just a few insecure icons (a bright red warning icon)](https://res.cloudinary.com/psaulitis/image/upload/v1628173034/secure-icon_rznzev.png)

### Render Blocking Indicator

One of the most common performance bottlenecks are render-blocking requests: requests that block the display of the page.

While it was possible to try and programmatically infer whether a resource was render-blocking, the only source that knew for sure was the browser. Thankfully, the Chrome Developer Tools Protocol just started to provide a new `renderBlocking` indicator in their trace events telling us if a request is render blocking, parser blocking and even potentially blocking.

If we see a request is `renderBlocking` we're now showing an orange warning icon next to the request, making it immediately apparent which of your resources are blocking the display of the page.

![Part of a WebPageTest waterfall, showing an orange warning icon next to each request indicating those requests are render blocking](https://res.cloudinary.com/psaulitis/image/upload/v1626795180/render-blocking-icon-waterfall_gejlat.png)

We're also providing the raw `renderBlocking` value for each request in the request overlay that appears when you click on a request.

![An image of the request overlay for a request, showing a bunch of information. Of note here is the "render blocking" indicator (circled in pink) that shows the request is "blocking"](https://res.cloudinary.com/psaulitis/image/upload/v1626795180/status-in-dialog_p2sho8.png)

We've written a [post about the new indicator and what it can tell you](https://blog.webpagetest.org/posts/new-render-blocking-indicator-in-chrome-and-webpagetest/), if you want to dig in deeper.

### More Robust Legend

While we were making the waterfall change, we realized that there were a few things the waterfall showed you that didn't appear in the legend. For example, every request that doesn't belong to the main document (triggered from an iframe, for example) is colored blue but very few folks knew that.

So we fleshed out the waterfall legend a little bit. We also added the legend to our [Custom Waterfall page](https://www.webpagetest.org/customWaterfall.php?test=210726_BiDcVT_563eaf437daa79ec18be4b3dd4e3a706&run=1&width=930), where you can customize the waterfall image by zeroing in on only a certain time period, or only specific requests.

![A screenshot of the Waterfall legend, showing how WebPageTest indicates key metrics, insecure requests, render blocking requests, redirects and more.](https://res.cloudinary.com/psaulitis/image/upload/v1628173314/new-waterfall-legend_gzjseg.png)


## WebPageTest Visual Studio Extension

Pretty much everyone here uses Visual Studio Code—it's such a great tool and *very* customizable with its plethora of extensions. We're also big proponents of testing performance as early as possible in your development process, ideally as you're writing the code.

So, to help make that a bit easier, we built a [Visual Studio Code extension for WebPageTest](https://marketplace.visualstudio.com/items?itemName=WebPageTest.wpt-vscode-extension).

![An image of Visual Studio Code's command bar, showing that as you start typing "webpagetest", the WebPageTest extension command shows up.](https://res.cloudinary.com/psaulitis/image/upload/v1626961438/vscode-run.png)

The extension makes it possible to run WebPageTest ([using the API](https://product.webpagetest.org/api)) tests directly from within your editor. Once the tests complete, the results are posted back in Visual Studio Code.

![An image of Visual Studio Code, showing the results of a WebPageTest test appearing right in the editor, in a new panel](https://res.cloudinary.com/psaulitis/image/upload/v1626961439/vscode-final.png)

What's exciting (to us!) about this is how it enables quick testing of local code as you're making changes. For example, you could use something like `localtunnel` or `ngrok` to expose a publicly accessible address, and [then run tests right in your editor](https://twitter.com/tkadlec/status/1421100407493906434).

If you want to learn more, [Abdul](https://twitter.com/abdul_suhaill) has written a [post talking about the extension](https://blog.webpagetest.org/posts/vscode/), why he built it, and how.

## Option for Chrome's Built-In Traffic Shaping

WebPageTest uses packet-level traffic shaping for our network throttling. We take the accuracy of our test results *very* seriously, and packet-level shaping is pretty much the gold-standard for network throttling.

This month we added an option for Chrome's built-in traffic shaping. We don't recommend using it for your standard testing—because of the way it works, it doesn't do any accurate shaping for things like redirects, connection setup costs and more—but we had a few requests for making it available. 

We're working on a post explaining some of the interesting differences between the two approaches, but for now, treat this one more as a "for scientific purposes" option.