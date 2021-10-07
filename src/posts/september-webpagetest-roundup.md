---
title: September WebPageTest Roundup
guest: false
date: 2021-10-07T17:28:43.644Z
description: Check out a summary of the features and changes to WebPageTest in
  the month of August.
tags:
  - API
  - Metrics
  - Chrome
  - TTFB
  - ElementTiming
category: Product News
author: Tim Kadlec
---
*Things can move pretty quickly around here. In addition to the [change log](https://docs.webpagetest.org/change-log/), we're publishing monthly summaries of some of the highlights of features and changes made to WebPageTest in the last month.*

## Custom waterfall redesign and dynamic adjustments

One of the (many) features that is a little tucked away in WebPageTest is the ability to customize the waterfall by choosing what metrics and information to hide or display, truncating the waterfall to a given duration and even zooming in on individual requests.

It's a handy way to zero in on a subset of the waterfall when you're trying to demonstrate a particular issue or document what needs to happen for a particular optimization.

This month, the page got a significant facelift, making it much easier to quickly update the waterfall and improving the overall accessibility and usability of the page.

![A screenshot of the Custom Waterfall page, showing a blue dialog box to the right of the screen where you can change the display of the performance waterfall, displayed to the left.](https://res.cloudinary.com/webpagetest/image/upload/v1633627819/roundup-custom-waterfall_k5s42r.png "Wide:")

## Chrome Dev Tools Priorities

Browsers apply different priorities to resources depending on what type they are, when they're requested and how. This helps them to properly prioritize resources to make sure the most important ones are dealt with first.

Chrome's has 5 priority levels, but the names of those priorities varies depending on which part of the browser stack is involved. There are priority names in Blink, in the Net Stack, and then the priority names used in Dev Tools.

WebPageTest has historically reported the underlying names exposed via Blink and the Net Stack, but we will now use the Dev Tools priority names.[](https://www.notion.so/3cf5302db4e0461d9b7700093a2bcab8)

| **DevTools Priority** | **Highest** | **High** | **Medium** | **Low** | **Lowest** |
| --------------------- | ----------- | -------- | ---------- | ------- | ---------- |
| Net Priority          | Highest     | Medium   | Low        | Lowest  | Idle       |
| Blink Priority        | VeryHigh    | High     | Medium     | Low     | VeryLow    |

This doesn't change or mask underlying information in anyway, but with significant work happening in Chrome around priorities in general (with some major preload improvements and their experimentation around priority hints), it makes sense to unify around one set of names to make that experimentation and discussion much more cohesive.

## Element Timing API

One of the more exciting developments in performance metrics in the past few years has been the introduction of API's that allow folks to start tracking very customized metrics, based on what matters most in their sites or applications. One of the latest of these is the Element Timing API, which lets you measure when a particular image or text node is displayed on the screen by adding an `elementTiming` attribute to the element in your markup.

```python
<img src="image.jpg" elementtiming="big-image">
```

While the Element Timing API has been supported in Blink-based browsers (Chrome, Opera, Samsung Internet, Edge) for awhile now, there weren't any trace events reported to ensure the most accurate data in a synthetic test. We asked the Chrome team if they could add those, and they [quickly jumped on it](https://bugs.chromium.org/p/chromium/issues/detail?id=1244086#c_ts1630332320), enabling us to now expose Element Timing information in your WebPageTest results!

Now, if you use Element Timing on your page, those metrics will be reported in the JSON results for the test, as well as the metric summary for the test runs.

![A screenshot of a portion of the metrics summary, with two Element Timing metrics (post-hero and post-title) circled. The time for each metric is displayed below.](https://res.cloudinary.com/webpagetest/image/upload/v1633627818/element-timing-highlight_qejxwf.png)

You can also optionally expose them on the waterfall from the Custom Waterfall page.

![A screenshot of a performance waterfall, with dark purple lines indicating when the element timing marks were fired](https://res.cloudinary.com/webpagetest/image/upload/v1633627818/roundup-element-timing-waterfall_jlarsb.png "Wide:")

## Filter locations endpoint by specific location

The [locations endpoint](https://webpagetest.org/getLocations.php?k=A&f=json) for the API lets you check what test locations are available, what browsers are at each location, and what the overall status is for each.

A few folks had let us know they wanted to be able to query for a single location instead, so we added an optional `location` parameter to the endpoint so that you can grab the status of a single location at a time.

```python
# This will return the status of the ec2-us-east-1 location only
https://webpagetest.org/getLocations.php?k=A&f=json&location=ec2-us-east-1
```

## First-Byte Warning

During one of our [WebPageTest Live Twitch streams](https://www.youtube.com/watch?v=4Qe5JL4WEnU), we ran into a situation where the Time to First Byte for one of the tests was *very* high, coming in a whopping 9.237s! Eventually, we discovered that it was due to a bot mitigation tool that was identifying our test agents as a bot, and artificially delaying the Time to First Byte as a result. WebPageTest's Preserve User Original User Agent String feature strips out the WebPageTest specific information in the UA String and avoids the issue, giving you accurate results, but it took us a bit to realize what was going on.

To make that process easier for everyone (including us!), we added a warning to test results with abnormally long Time to First Byte's suggesting to re-run the test with the original User Agent string preserved.

![A screenshot of a warning noting that the test had an unusually-high first byte time, and offering a checkbox to re-run the test with the original user agent string preserved.](https://res.cloudinary.com/webpagetest/image/upload/v1633627818/roundup-first-byte-time_qp7kod.png "Wide:")

To minimize the risk of over aggressively warning, the warning is only displayed if the Time to First Byte for all runs of the test is over 3 seconds. 

Accuracy of your test results is *very* important to us, and our hope is that this addition helps folks avoid spending time digging into issues that aren't actually there.