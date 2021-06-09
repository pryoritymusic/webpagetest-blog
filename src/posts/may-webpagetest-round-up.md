---
title: May WebPageTest Round-Up
date: 2021-06-09T16:57:11.143Z
tags: []
category: Product News
author: Tim Kadlec
---
*Things can move pretty quickly around here, so in addition to the new [change log](https://docs.webpagetest.org/change-log/), we're going to start publishing monthly summaries of some of the highlights of features and changes made to WebPageTest in the last month.*

## Improvements to the Plot Full Results Page

The Plot Full Results page (one of [Matt Hobb's personal favorites](https://nooshu.github.io/blog/2021/04/13/how-to-use-webpagetests-graph-page-data-view/)) got a few helpful improvements.

The Plot Full Results page is used to let you see the results of each individual run of a test (or several tests) so that you can more easily spot outliers and see the variability in your results.

To help make sharing and comparing easier, you can now force each chart to start at zero for the y-axis, to make it easier to share and compare results. Before, the charts would auto-scale the y-axes which worked well if you were viewing one chart in isolation, but not if you wanted to compare and contrast charts from different tests.

If you're graphing the results of multiple tests, we also now provide a summary table of the results for each of the tests you're plotting.

![A screenshot from the plot full results page, showing a table summarizing the test results and comparing a no font version of the page to the standard version. Below that, a graph shows the results for each test.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258076/may-roundup-plot-results.png)

## A New Way to Diagnose Core Web Vitals Issues

As companies ramp up their efforts around Core Web Vitals, we wanted to arm folks with the tools and information they need to more easily identify *why* a particular vital metric may be slow and how to fix it. Frankly, Pat and I got tired of digging through the raw JSON of each test result so we made a page to start surfacing helpful diagnostic information.

The page is actively being worked on, but already this month we've added a bunch of information and visuals to help.

### Largest Contentful Paint

For Largest Contentful Paint, we provide the screenshots from the filmstrip of when the LCP event fired, as well as a before and after screenshot to help visualize what is triggering LCP.

![A screenshot showing three thumbnails of a page loading. The middle thumbnail has an image (the LCP element) highlighted in green.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258075/may-roundup-lcp-highlight.png)

We also provide a summary of the LCP event itself, including the outer HTML and, if it's an image, the image src.

![An image of a table of information for the LCP event, including information about the LCP element, outer HTML, size, and more.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258075/may-roundup-lcp-summary.png)

Finally, we also provide a truncated version of the waterfall, cut off at the moment LCP occurs so you can focus just on the resources that may be delaying it. If an image is what triggers LCP, we  automatically highlight the request in the waterfall so that you can very quickly zero in on when it's being loaded. We also display the image itself at full size, below the waterfall.

![A screenshot of a WebPageTest Waterfall, with the 6th request highlighted, indicating it's the image that triggers LCP.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258075/may-roundup-lcp-waterfall.png)

### Cumulative Layout Shift

For any layout shifts, you're able to hover over a screenshot to see an animation of what shifted on the page.

![An animated GIF showing how a page shifts when a thumbnail is hovered over.](https://res.cloudinary.com/psaulitis/video/upload/f_auto,q_auto/v1623258076/may-roundup-cls-animation.gif)

### Total Blocking Time

Under Total Blocking Time, we provide a version of the waterfall that focuses specifically on requests that trigger JavaScript execution.

![A screenshot showing a WebPageTest waterfall, only displaying requests that trigger JS execution.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258076/may-roundup-tbt-waterfall.png)

Below that, we also provide a quick link to the Chrome Developer Tools Performance Panel from the test, as well as a breakdown of the main thread blocking time by script origin.

![A screenshot showing a table providing a breakdown of total blocking time by script origin](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258076/may-roundup-tbt-origin.png)

Watch for more information about this page, as well as further improvements. We've got a few nifty (yeah, I said nifty) ideas for what we want to do here to make it even easier to troubleshoot vitals issues in the future.

## Exposing the Accessibility Tree With Custom Metrics

We can now capture the Chromium Accessibility Tree with a custom metric (`$WPT_ACCESSIBILITY_TREE`), making it possibly to analyze and opening the door for future accessibility checks. [Learn more in the documentation](https://docs.webpagetest.org/custom-metrics/#accessing-requests-data-(chrome-only)).

## WebPageTest for Slack

Thanks to the work of [Abdul Suhail](https://twitter.com/abdul_suhaill), we now have a Slack bot for WebPageTest!

The bot uses the [WebPageTest API](https://product.webpagetest.org/api) to enable you to trigger WebPageTest tests from within Slack, and get the results automatically posted back to the appropriate Slack channel. As more companies use Slack as a hub for alerting and debugging, bringing WebPageTest results into that process makes it easier for teams to quickly diagnose problems.

![A screenshot from showing WebPageTest results being posted in Slack by the WebPageTest bot.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623258076/may-roundup-slack.png)

You can learn more about the Slack bot in the [detailed documentation found in GitHub](https://github.com/WebPageTest/webpagetest-slack).

## New Origin Variable Substitution and Documentation

WebPageTest supports a few variable substitutions in our custom scripting, but they were undocumented. Thanks to the work of [Anthony Ricaud](https://ricaud.me/blog/), there's now [documentation for each variable supported](https://docs.webpagetest.org/scripting/#variable-substitutions).

Anthony also added a [brand new variable (`%ORIGIN%`)](https://docs.webpagetest.org/scripting/#%25origin%25) which can be used to substitute the origin of the URL being tested.

```jsx
URL: https://wpt.example/hello
input: setCookie  %ORIGIN% foo=bar
output: setCookie https://wpt.example foo=bar
```

## More Accurate CPU Emulation

Pat recalibrated the CPU throttling for mobile emulation, to make the results more accurate and inline with how the actual mobile devices perform. For most devices, this required about twice as much throttling. Any mobile emulated tests should now be much more accurate.

## Updated Wappalyzer Engine

WebPageTest runs [Wappalyzer](https://www.wappalyzer.com/) on each test run to help identify what technologies are used on a given page. We updated to the latest version of the engine which provides support for a bunch of new technologies, as well as improved detection for others.