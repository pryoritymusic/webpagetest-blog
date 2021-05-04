---
title: Why First Contentful Paint Doesn't Work As a Cross-Browser Metric
date: 2021-05-04T16:12:41.043Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1620138866/FCP-Blog-min_ypvz1v.png
tags:
  - First Contentful Paint
  - Core Web Vitals
  - Safari
  - Chrome
  - Firefox
category: Perf Data
author: Tim Kadlec
---
With Safari 14.1 officially out, thanks to the [work of the Wikimedia team](https://techblog.wikimedia.org/2020/06/24/how-we-contributed-paint-timing-api-to-webkit/) and [Noam Rosenthal](https://twitter.com/nomsternom) in particular, First Contentful Paint just became one of the first "modern" performance metrics to be available in all major browsers: Chrome, Edge, Firefox and Safari all support it.

This is pretty massive news for performance on the web.

Over the past several years, we've seen a flurry of new performance metrics that seek to do a better job of reporting on performance from a user-centric perspective. We have metrics around layout instability (Cumulative Layout Shift), interactivity (Long Tasks, First Input Delay, etc) and visual feedback (First Paint, First Contentful Paint, Largest Contentful Paint, etc).

But as great as many of these metrics sound, and as much emphasis has been placed on a few of those with Google's Core Web Vitals initiative, there's been one glaring issue: they were mostly Chrome-only metrics.

* The Layout Stability API necessary for reporting Cumulative Layout Shift? [Blink-based browsers](https://caniuse.com/mdn-api_layoutshift) (Chrome, Edge, Opera, etc) only.
* The PerformanceLongTaskTiming API for reporting long running tasks in the main thread of the browser? [Blink only](https://caniuse.com/mdn-api_performancelongtasktiming).
* The Largest Contentful Paint API? [Blink only](https://caniuse.com/mdn-api_largestcontentfulpaint).
* The Paint Timing API necessary for providing First Paint and First Contentful Paint? [Blink and Gecko](https://caniuse.com/mdn-api_performancepainttiming) (the engine behind Firefox).

Now we can add [WebKit to the list of browsers supporting the Paint Timing API](https://firt.dev/ios-14.5/#paint-timing-api) (at least partially as they opted not to support the First Paint metric) *finally* giving us a modern, user-centered metric that we have cross-browser support for.

But there's an important caveat: First Contentful Paint isn't *exactly* apples-to-apples from one browser to the next.

## Noticing differences in WebPageTest Filmstrips

I wanted to double-check our support for First Contentful Paint in Safari 14.1 and after a minor change to our testing agents to account for the fact that Safari doesn't support the [Navigation Timing API Level 2](https://bugs.webkit.org/show_bug.cgi?id=184363), sure enough First Contentful Paint was showing up in Safari tests, but not exactly as expected.

One of the first tests I ran to double-check First Contentful Paint in Safari [was on my own site](https://www.webpagetest.org/result/210429_BiDcEP_fbb4dc3d38fed8cf13691aa4927e0f8b/2/details/#waterfall_view_step1) (I'm not self-absorbed, I swear) on a 3G Fast network. At the time, I was testing First Contentful Paint in a custom metric while the necessary changes rolled out to our testing agents, hence why you'll see a `custom-fcp` metric instead of a top-level First Contentful Paint.

First Contentful Paint came back, reported as 1.386 seconds. Great! Except for one thing: nothing was on the screen at the time.

WebPageTest's video capture records the screen of the browser as a test is run, capturing every moment alongside the timing information. It's an *incredibly* useful feature. Since it records exactly what is on the screen at the time (and doesn't rely on any internal state or any simulation, etc) it makes for a great source of truth to validate any visual related metrics. The video capture feature is also what enables the filmstrip view, and it's how WebPageTest calculates its Start Render metric (the moment something first gets displayed on the screen).

Here's what [the filmstrip](https://www.webpagetest.org/video/compare.php?tests=210429_BiDcEP_fbb4dc3d38fed8cf13691aa4927e0f8b-r%3A1-c%3A0&sticky=1&thumbSize=600&ival=16.67&end=visual) showed when First Contentful Paint fired on my page:

![A screenshot of the WebPageTest filmstrip view, showing that at the time First Contentful Paint fired, the screen was empty..nothing was actually visibly painted yet.](https://res.cloudinary.com/psaulitis/image/upload/v1619811188/fcp-tkcom-filmstrip.png.png "Wide:")

There was nothing there. In fact, Start Render didn't occur until 1.5s—about 130ms later.

I decided to test a few other sites, and sure enough, the pattern was pretty consistent. Each URL was run 9 times, capturing video at 60fps so we could be pretty precise with our Start Render time. A negative number means First Contentful Paint fired before anything appeared on the screen.

| Page                                                                                                    | Median Difference Between FCP and Start Render |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Wal-Mart](https://www.webpagetest.org/result/210504_BiDcX9_2db6e9154b3af93adeaa457afa6fa5d5/)          | \-170ms                                        |
| [CNN](https://www.webpagetest.org/result/210504_BiDc4M_fd3d4e0130edc958ff7ad57220e17ead/)               | \-128ms                                        |
| [Amazon](https://www.webpagetest.org/result/210504_AiDcW2_0fc161642616a749a78f13cc06f17172/)            | \-229ms                                        |
| [Smashing Magazine](https://www.webpagetest.org/result/210504_BiDcXM_014cb06cb887abc0563aa6ee9346ad86/) | \-238ms                                        |
| [WebPageTest](https://www.webpagetest.org/result/210504_BiDc95_f2a9cd12d9b2d9b77cd5e90bebecd203/)       | \-195ms                                        |
| [The Guardian](https://www.webpagetest.org/result/210504_AiDcYW_c4d9d352a978493e193fa0a33d284ae3/)      | \-123ms                                        |

In each of the tests, First Contentful Paint fired before anything was actually painted to the screen, and frequently by a pretty significant margin.

Ok. So next up, let's see what happens in Chrome and Firefox and how any gaps between First Contentful Paint and Start Render compare to what we see in Safari.

Keep in mind the video for each test was recorded at 60fps. This means that each frame itself is *just* under 17ms. So any difference between First Contentful Paint and Start Render that falls under that 17ms threshold is beyond the limit of measurement, as well as beyond the limit of us being able to see any visual difference.

| Page                  | Difference between FCP and Start Render, Safari | Difference between FCP and Start Render, Firefox | Difference between FCP and Start Render, Chrome (G4) |
| --------------------- | ----------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Wal-Mart              | \-170ms                                         | \-35ms                                           | +1ms                                                 |
| CNN                   | \-128ms                                         | \-34ms                                           | +1ms                                                 |
| Amazon                | \-229ms                                         | \-23ms                                           | \-12ms                                               |
| Smashing Magazine     | \-238ms                                         | \-51ms                                           | \-12ms                                               |
| WebPageTest           | \-195ms                                         | \-16ms                                           | \-13ms                                               |
| The Guardian          | \-123ms                                         | \-19ms                                           | +5ms                                                 |
| **Median Difference** | **\-181ms**                                     | **\-30ms**                                       | **\-5ms**                                            |

There's a gap in all browsers, and for most of these sites, the First Contentful Paint fires before we see something on the screen. What differs is the size of that gap. Chrome fires First Contentful Paint *very* close to when the paint actually happens—they're under that 17ms threshold which makes their metric as accurate as we could possibly ask for. 

Firefox has bit larger gap, and Safari has (comparatively) a very large gap.

Another way of looking at it is to look at a scatter plot of the First Contentful Paint gap across the 6 different URL's. From the chart below, we can get a good sense of how significant the difference is between the Safari results and the Firefox and Chrome results. We can also see that the gap in Safari varies from test to test (though the metric is pretty consistently within at least a 300ms window).

![A scatterplot chart of the FCP gaps for all tests. Chrome and Firefox tests are all clumped pretty close together, within ~150ms range. Safari tests are scattered below, with most lying between 100 and 300ms.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1620143642/FCP-scatterplot.png "Wide:")

## Mind the Gap

I chatted with Noam (who added First Contentful Paint to Webkit) about it, and the fact that First Contentful Paint fires before Start Render actually makes perfect sense if you look at the [changes made to the HTML specification](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering) in order for Safari to implement it.

The Paint Timing [specification also notes that](https://w3c.github.io/paint-timing/#paint):

> ...the user agent has performed a "paint" (or "render") when it has converted the render tree to pixels on the screen.

Ok, so far so good. But when handling the WebKit implementation, Noam and the folks that were involved from Safari felt that "pixels on the screen" wasn't possible to make cross-browser interoperable. There is some additional context in the spec now that makes it clear that "pixels on screen" isn't exactly super precise, or even potentially feasible to measure, for all browsers, and gives guidance on how browsers should implement (emphasis mine):

> NOTE: The rendering pipeline is very complex, and the timestamp should be the latest timestamp the user agent is able to note in this pipeline (best effort). Typically the *time at which the frame is submitted to the OS for display is recommended for this API*.

So, we're not necessarily measuring the moment at which that contentful paint actually occurs. Instead, the specification now defines it as measuring the point at which the frame is submitted for display (or, as close to that point as possible).

It's a small distinction but an important one: as specified, this means First Contentful Paint is going to fire before that content ever reaches the screen.

That explains why we see First Contentful Paint frequently firing before we see content, but why is the gap so much more pronounced in Safari? It turns out just how *much* earlier First Contentful Paint will fire depends on the browser engine and their implementation.

As Noam mentioned to me, lot of rendering in Safari is done at the operating system level and the browser doesn't know when that rendering exactly occurs. This means Safari has a limit to how precise it can be with the timestamp.

Chrome, on the other hand tries hard to provide a timestamp of when the paint actually does occur. As a result, the gap between when First Contentful Paint is fired and that content is visually displayed is significantly smaller in Chrome (and Firefox) than in Safari.

This appears to largely be a side-effect of the difference between interoperability in practice and in reality. The specification tries to provide a consistent playing field, but the reality is that different browser architectures have different restrictions on when they can fire the necessary timestamps to report First Contentful (or if not restrictions, then perhaps how important it is for them to try to work around those restrictions to get more accurate timings). It's one of those "specs in the real world" moments.

This distinction and the difference in how browser rendering engines work means First Contentful Paint is pretty unreliable for cross-browser comparison.

## So....what does this mean for me?

With the gap between First Contentful Paint firing and when the actual pixels arrive on the screen being so much larger in Safari, First Contentful Paint *should not* be used to compare performance across different browsers—there simply isn't enough consistency to enable a solid comparison. Differences of up to several hundred milliseconds seem likely, and only if the difference between browsers grows above that threshold should like likely spend much time on it.

Even then, this is a *great* example of why you need to pair your real-user data with solid synthetic data. If you *are* seeing what looks like a substantial difference, you'll want to use your synthetic data to validate the issue. Using something like the filmstrip view to compare the point at which First Contentful Paint fires to the point those pixels appear on the screen can help you to identify if it's something that warrants additional development effort on your part or not.

If you want to look at First Contentful Paint in the context of a single browser, you're more or less ok. For example, if you want to improve First Contentful Paint in Safari, then by all means, watch how the metric changes when you make changes. Just keep in mind that, particularly in the case of Safari, it's quite likely there's a gap between what the metric is reporting and when your visitors are actually seeing that content. (The gap does seem particularly large, so I'm hoping that eventually the gap could be tightened up a bit with some more exploration. It's absolutely possible there's more going on here than *just* a heftier rendering process.)