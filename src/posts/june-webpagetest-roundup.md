---
title: June WebPageTest Roundup
date: 2021-07-08T13:04:21.185Z
category: Product News
author: Tim Kadlec
---
*Things can move pretty quickly around here. In addition to the [change log](https://docs.webpagetest.org/change-log/), we're publishing monthly summaries of some of the highlights of features and changes made to WebPageTest in the last month.*

## Compare all test runs

The visual comparison test page—with the combination of the filmstrip and waterfall—is one of the most popular ways of looking at WebPageTest results.

To make it easier to dive into any variability in your test results, we now provide a "Compare All Runs" button on the page. When clicked, the comparison page will reload with results for all individual runs of a test so that you can zero in on what bottlenecks might be causing intermittent performance issues and introducing instability in your metrics.

![June%20Round-Up%206c638f90b7c742abb6d1e19016de259e/f4b5c156ddff5470f5132a154501ac45.gif](June%20Round-Up%206c638f90b7c742abb6d1e19016de259e/f4b5c156ddff5470f5132a154501ac45.gif)

## Support for Edge Beta

WebPageTest now supports testing on Edge's Beta version meaning all versions of Microsoft Edge—stable, Beta (updated every 6 weeks), Dev (updated weekly) and Canary (updated daily) are now supported.

## New Core Web Vitals Test Type

Last month we did a lot of work on the new core web vitals diagnostic page, and this month we've made it easier for folks to dive right in by providing a new [Core Web Vitals test](https://www.webpagetest.org/webvitals).

The new test form makes it super quick to fire off a test, providing a simplified interface requiring only two inputs: the URL to test, and whether to test on Mobile or Desktop.

![June%20Round-Up%206c638f90b7c742abb6d1e19016de259e/Screen_Shot_2021-07-07_at_3.13.28_PM.png](June%20Round-Up%206c638f90b7c742abb6d1e19016de259e/Screen_Shot_2021-07-07_at_3.13.28_PM.png)

When the test completes, you'll land directly on the Core Web Vitals diagnostics page so you zero in on these key metrics right away.

![]()

It's worth noting: all the usual deep data and visualizations you would expect from WebPageTest are still there. Rather than strip out potentially useful information, we opted to make the test submission process easier and still arm you with all the information you need to make meaningful conclusions about the performance of your site.

## Support for Chrome's `keypress` and `type` commands

WebPageTest's custom scripting unlocks a *ton* of possibilities for advanced tests, and we're constantly working on making it even more powerful.

We've added two new commands to help you simulate keyboard keypresses in Chrome:

`type` lets you simulate keyboard keypresses for each character in a given string.

```jsx
type Hello World
```

`keypress`AndWait lets you simulate a keyboard keypress for a specific key

```jsx
keypress Backspace
```

You can read more about both commands in the [custom scripting documentation](https://docs.webpagetest.org/scripting/).

## Improvements to the Test History Page

We've got a bunch of stuff we're working on for the Test History page to make it easier to find the tests you're looking for so you can compare and analyze. This past month we made the test results open in a new tab so that you don't lose your place in the search results.

Previously, searching only searched the URL's you tested, but we've expanded it to now also search the labels, helping you find the exact version of the test you're looking for.

We're not done with this page at all, so stay tuned for more improvements to make it even easier to drill into your results and filter out tests you may no longer want to keep around.