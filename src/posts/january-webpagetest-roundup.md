---
title: January WebPageTest Roundup
guest: false
date: 2022-02-17T17:02:18.329Z
tags:
  - API
  - Core-Web-Vitals
  - Largest-Contentful-Paint
  - JavaScript
category: Product News
author: Tim Kadlec
---
*Things can move pretty quickly around here. In addition to the [change log](https://docs.webpagetest.org/change-log/), we're publishing monthly summaries of some of the highlights of features and changes made to WebPageTest in the last month.*

## An updated UI

This past month, WebPageTest got a redesigned and reorganized UI. WebPageTest has always been right at home with power users, but with more folks than ever paying attention to performance today, it’s critical that we make WebPageTest easier for everyone.

![A screenshot of the new UI for the performance summary page.](https://res.cloudinary.com/webpagetest/image/upload/v1645117546/jan-roundup-ui_zzmpvc.png "Wide:")

We’ve [written](https://blog.webpagetest.org/posts/unveiling-the-new-wpt-ui/) [quite a bit](https://blog.webpagetest.org/posts/a-backstage-tour-of-webpagetests-new-ui/) already about the new UI (so we’ll keep it brief here) but we’ve been very happy with the feedback we’ve seen from the community. We’ve also seen that a lot of the little powerful features and pages that were a bit hidden in the past have gotten more traffic and attention since the update—a definite goal for us.

There have also been a lot of helpful folks providing feedback and filing issues, and we’ve already made a bunch of adjustments since the new UI launched to refine things further. We’re *always* game for helpful feedback and input, so feel free to [file issues on GitHub](https://github.com/WPO-Foundation/webpagetest/issues/new/choose)—it’s the best way for us to keep track of feature requests and potential bugs.

And stay tuned—this design update lays the groundwork for some big improvements that will be coming soon—we’re far from done.

## Microsoft Edge Testing

Alongside the new UI, we also released official support for performance testing on Microsoft Edge, meaning we now support testing in Chrome, Brave, Safari, Edge and Firefox.

![A screenshot of the test details header, showing the Microsoft Edge logo, the version (97), location (Toronto Canada) and device type (Desktop)](https://res.cloudinary.com/webpagetest/image/upload/v1645117546/jan-roundup-edge_dx0i3u.png)

You can choose Edge from any of the EC2 locations, and we’ve also provided a new simple configuration default that uses Edge in Canada to encourage testing in Edge. Because Edge is Chromium based, a lot of the advanced testing functionality that you can do with Chrome, as well as helpful information like the render-blocking indicator will all be available to you in Edge tests as well.

Cross-browser testing is a *very* important focus for us, and we feel we have a responsibility to make it as easy as possible to get meaningful performance insights from all major browsers. We’ve been working with the various browser vendors and it’s safe to say there will be a lot more happening throughout the year to make testing your site’s performance in all the major browsers much easier.

## Wappalyzer is Optional

WebPageTest run’s Wappalyzer on each and every test run to detect what applications and libraries are used on any given page. We did some profiling of our test agents and discovered that Wappalyzer was one of the slowest parts of the testing process. That makes sense: Wappalyzer has to run quite a few checks to get accurate information. But given that not everyone needs that data, we decided to introduce a new parameter to the API to optionally disable the Wappalyzer check for faster test results.

The new `wappalyzer` param defaults to `1` to avoid breaking any existing usage of the detected technology information, but if you pass `0` for that parameter, the Wappalyzer detection will be skipped.

The performance results won’t be impacted either way—Wappalyzer runs safely after the page’s performance metrics have been gathered—but disabling Wappalyzer should make your tests a hair faster and also reduce the resulting JSON size a little.

## Largest Contentful Paint Comparison Endpoint

When we ask about people’s favorite WebPageTest features, the [filmstrip view](https://www.webpagetest.org/video/compare.php?tests=220210_AiDcG1_MDB-r:1-c:0-e:filmstrip) comes up a lot. Being able to see the visual progression alongside the waterfall so you can see exactly what was being loaded while the page changes is a powerful tool in analyzing your loading performance.

The filmstrip also allows for you to change the comparison endpoint, so the waterfall and filmstrip will truncate at a specific milestone, like Visually Complete or Last Change.

Now (thanks to some good community feedback) we’ve added Largest Contentful Paint as a comparison endpoint.

![A screenshot showing the comparison endpoint options, including Visually Complete, Largest Contentful Paint, Last Change, Document Complete and Fully Loaded](https://res.cloudinary.com/webpagetest/image/upload/v1645117546/jan-roundup-lcp_xq3i7o.png)

We already do this, by default, on the Web Vitals page, and it makes a lot of sense to have it as an option on the filmstrip view as well. Truncating the waterfall helps you to zero in on just the requests and activity that happen before this key milestone, making it easier to spot the bottlenecks and ignore all the other activity that will have no impact on your LCP metric.

## New `waitFor` Custom Script Command

Sometimes when testing performance, particularly for sites with a large amount of dynamic content or behavior triggered by user action, you may want to to run a test until a specific criteria is met: a table is populated with new data, a dynamic bit of content on a page is displayed, etc.

To help with these situations, WebPageTest now offers a new `waitFor` command that you can use in a custom scripted test. 

The `waitFor` command takes a JavaScript snippet that WebPageTest will evaluate periodically and will wait to finish the test until the script evaluates to `true`.

```json
waitFor	document.getElementById('results-with-statistics') && document.getElementById('results-with-statistics').innerText.length > 0
```

By default, to minimize overhead, WebPageTest will evaluate the script using a 5 second interval. You can adjust that interval by using the new `waitForInterval` command like so:

```json
# Set a 2 second interval
waitInterval 2
waitFor	document.getElementById('results-with-statistics') && document.getElementById('results-with-statistics').innerText.length > 0
```

You can find full information on the new parameters in the [API reference documentation](https://docs.webpagetest.org/api/reference/). 

We think this command will end up being very helpful for testing more dynamic pages, single-page applications and other sites with a lot of interactivity and JavaScript-driven behavior. If you take it for a spin, definitely let us know how you’re using it!

## New Metadata Parameter

Sometimes, when running a test, you may want to provide some contextual information about the test itself: notes to yourself about the environment, test conditions, servers, etc. We now provide a `metadata` parameter in the API that let’s you do exactly that, and more, by providing an open-ended field for you to add custom information to.

The `metadata` parameter takes a string that can be up to 10kb (to keep your JSON response size somewhat reasonable) in size. That value will then be stored with the test result and echoed back as “metadata” in the resulting API results.

If the string is encoded JSON, then the decoded JSON data will be used instead of the raw string. More documentation is available in our [API reference docs](https://docs.webpagetest.org/api/reference/).

We’re really interested in seeing how folks use this field and whether there are patterns that we see that hint that perhaps we should be providing some other types of dedicated fields in the long-term. As always, definitely let us know if you’re finding it useful or if you have feedback on something else that would be useful to provide in the API or the resulting response.