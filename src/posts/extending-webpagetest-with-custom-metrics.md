---
title: Extending WebPageTest with Custom Metrics
date: 2021-04-26T15:20:09.301Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1619465337/BlogBannerCustom-01_copy-min_n2i4yd.png
tags:
  - custom metrics
  - accessibility
  - api
  - lazy loading
category: Product News
author: Tim Kadlec
related_post:
  post: the-webpagetest-api-has-gone-public
---
There are a lot of things I really like about WebPageTest, and [custom metrics](https://docs.webpagetest.org/custom-metrics/?utm_source=blog&utm_medium=social&utm_campaign=docs&utm_content=custom%20metrics) have to be right up there near the top of the list.

I'm not talking about the [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) (which is frequently referred to as custom metrics) though WebPageTest supports all of that too, but custom metrics that you expose in your test data by telling WebPageTest to run some arbitrary JavaScript after the page loads.

For example, when I wanted to test out the [new version of the Cumulative Layout Shift metric](https://blog.webpagetest.org/posts/understanding-the-new-cumulative-layout-shift/) before we implemented it, custom metrics provided a relatively low-friction way to test it out. I was able to collect a new metric (called `newCLS`) and tell WebPageTest what JavaScript to run to return the value.

```js
[newCLS]
return new Promise((resolve) => { 
	let max = 0, curr = 0, firstTs = Number.NEGATIVE_INFINITY, prevTs = Number.NEGATIVE_INFINITY;

  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.hadRecentInput) continue;
      if (entry.startTime - firstTs > 5000 || entry.startTime - prevTs > 1000) {
        firstTs = entry.startTime;
        curr = 0;
      }
      prevTs = entry.startTime;
      curr += entry.value;
      max = Math.max(max, curr);
    }
    resolve(max);
  }).observe({type: 'layout-shift', buffered: true});
});
```

That custom metric gets dropped into the textarea under the Advanced > Custom tab if you're doing manual testing, or [added to your API call](https://product.webpagetest.org/api?utm_source=blog&utm_medium=social&utm_campaign=docs&utm_content=custom%20metrics) using the `custom` parameter.

After the test runs, the testing agent runs that bit of JavaScript and grabs the returned value, storing it as a `newCLS` metric. The metric is then exposed in the JSON data, as well as in the [Custom Metrics section](https://www.webpagetest.org/custom_metrics.php?test=210409_BiDc3Y_2093c2f01093bc6f7749b883019966d3&run=2&cached=0&utm_source=blog&utm_medium=social&ut) of the test results page in the UI.

Custom metrics are a great way to play around with experimental API's like this, and that's a pretty common reason I reach for them. But they're also really useful for expanding on what WebPageTest reports by default.

For example, we run a few custom metrics each time a test is run on WebPageTest to expose things like color depth, dpi, a JSON object of all the images on a page, and the screen resolution. 

[The HTTP Archive](https://httparchive.org/) also uses a [lot of custom metrics](https://github.com/HTTPArchive/legacy.httparchive.org/tree/master/custom_metrics) to collect a variety of interesting information for their reports, as well as for the [annual Web Almanac](https://almanac.httparchive.org/en/2020/). Like this one, to calculate the byte size of all inline CSS:

```js
[inline-css]
return Array.from(document.querySelectorAll("style")).reduce(
  (total, style) => (total += style.innerHTML.length), 0
);
```

Or here's one that you could run that returns an JSON object of all the images that have `loading=lazy` applied but are inside the initial viewport (which could cause them to arrive a bit later than ideal).

```js
[lazy-in-viewport]
let images = document.querySelectorAll('img[loading=lazy]');
let lazyImages = [];
images.forEach( img => {
 if (img.getBoundingClientRect().top < window.innerHeight) {
    lazyImages.push(img.src);
 }
});
return JSON.stringify(lazyImages);
```

Or you could branch out into metrics that deal with other aspects of site quality, like accessibility.  Here's a custom metric that counts all the images on a page that don't have an `alt` attribute applied:

```js
[images-no-alt]
return document.querySelectorAll('img:not([alt])').length
```

Not only do you have access to the DOM of the page, but you also have access to all the raw response details and even the response bodies using string substitution ($WPT_REQUESTS to access an array of all the request data except for response bodies, and $WPT_BODIES to access the same array, but with all the response bodies included as well).

I've [written about this before on my own site](https://timkadlec.com/remembers/2020-04-16-webpagetest-custom-metrics-with-request-data/), but this is *super* cool because it lets you go even deeper with your custom metrics. For example, here's one that looks at the response bodies for all the CSS resources to see if any of them include stylesheets using `@import`, which can be a massive hit on your initial paint metrics:

```js
[css-imports]
let requests = $WPT_BODIES;
let cssBodies = requests.filter(request => request.type == "Stylesheet");
let re = /@import/g;
let importCount = 0;
cssBodies.forEach((file) => {
        importCount += ((file.response_body || '').match(re) || []).length;
    }
)
return importCount;
```

We've started collecting a [few different recipes of custom metrics](https://docs.webpagetest.org/custom-metrics/examples/?utm_source=blog&utm_medium=social&utm_campaign=docs&utm_content=custom%20metrics) in our documentation to help you get started. We'll keep adding to it, but we would also love to hear from all of you. If you've got a cool use for custom metrics, [let us know](https://github.com/WPO-Foundation/webpagetest-docs/issues/new?title=New%20Custom%20Metric:) so we can help share it with the community and help folks get the most out of their WebPageTest tests.