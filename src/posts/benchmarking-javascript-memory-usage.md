---
title: Benchmarking JavaScript Memory Usage
date: 2021-06-15T18:04:00.898Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1623793022/MemoryBlogImage_uflo0b.psd
tags:
  - javascript
category: Perf Data
author: Tim Kadlec
---
One of the things that is so challenging about the conversation around memory usage on the web right now is the sheer number of unknowns.

We haven't historically had ways of accurately determining how much memory a page is using in the real world, which means we haven't been able to draw a connection between memory usage and business or user engagement metrics to be able to determine what "good" looks like. So at the moment, we have no idea how problematic memory is, other than anecdotal stories that crop up here and there.

We also haven't seen much in the way of at-scale synthetic testing to at least give us a comparison point to see how our pages might stack up with the web as a whole. This means we have no goal posts, no way to tell if the amount of memory we use is even ok when compared to the broader web. To quote [Michael Hablich of the v8 team](https://www.youtube.com/watch?v=1Ndu7IphEgU): "There is no clear communication for web developers what to shoot for."

Because we don't have data about the business impact, nor do we have data for benchmarking, we don't have minimal interest in memory from the broader web development community. And, because we don't have that broader interest, browsers have very little incentive to focus on leveling up memory tooling and metrics on the web the same way they have around other performance-related areas. (Though we are seeing a [few here and there](https://developer.chrome.com/blog/memory-inspector/).)

And because we don't have better tooling or metrics...well, you can probably see the circular logic here. It's a [chicken or the egg problem](https://en.wikipedia.org/wiki/Chicken_or_the_egg).

The first issue, not knowing the business impact, is gonna require a lot of individual sites doing the work of adding memory tracking to their RUM data and connecting the dots. The second problem, not having benchmarks, is something we can start to fix.

## measureUserAgentSpecificMemory

Chrome introduced a new API for collecting memory related information using a Performance Observer, [called `measureUserAgentSpecificMemory`](https://web.dev/monitor-total-page-memory-usage/). (At the moment, there's been no forward momentum from Safari on adoption this, and Mozilla was still [fine tuning some details in the proposed specification](https://github.com/mozilla/standards-positions/issues/281)).

The `measureUserAgentSpecificMemory` API returns a breakdown of how many bytes the page consumes for memory *related to JavaScript and DOM elements only*. 

According to [research from the v8 team](https://docs.google.com/presentation/d/14uV5jrJ0aPs0Hd0Ehu3JPV8IBGc3U8gU6daLAqj6NrM/edit#slide=id.g381566e71b_0_0), \~35% of memory allocation on the web is JavaScript related, and 10% is for representing DOM elements in memory. The remaining 55% is images, browser features, and all the other stuff that gets put in memory. So while this API is limited to JS and DOM related information at the moment, that does comprise a large portion (\~45%) of the actual memory usage of a page.

An [article by Ulan, who spearheaded a lot of the work for the API](https://web.dev/monitor-total-page-memory-usage/) provides a sample return object.

```json
{
  bytes: 60_000_000,
  breakdown: [
    {
      bytes: 40_000_000,
      attribution: [
        {
          url: "https://foo.com",
          scope: "Window",
        },
      ]
      types: ["JS"]
    },
    {
      bytes: 0,
      attribution: [],
      types: []
    },
    {
      bytes: 20_000_000,
      attribution: [
        {
          url: "https://foo.com/iframe",
          container: {
            id: "iframe-id-attribute",
            src: "redirect.html?target=iframe.html",
          },
        },
      ],
      types: ["JS"]
    },
  ]
}
```

The response provides a top-level `bytes` property, which contains the total JS and DOM related memory usage of the page, and a `breakdown` object that lets you see where that memory allocation comes from.

With this information, not only can we see the total JS and DOM related memory usage of a page, but we can also see how much of that memory is from first-party frames vs third-party frames and how much of that is globally shared.

That's pretty darn interesting information, so I wanted to run some tests and see if we could start to help establishing some benchmarks around memory usage.

## Setting up the tests

The `measureUserAgentSpecificMemory` API is a promise-based API, and obtaining the result is fairly straightforward.

```jsx
if (performance.measureUserAgentSpecificMemory) {
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException &&
        error.name === "SecurityError") {
      console.log("The context is not secure.");
    } else {
      throw error;
    }
  }
  console.log(result);
}
```

Unfortunately, using it in production is challenging due to necessary [security considerations](https://web.dev/monitor-total-page-memory-usage/#feature-detection). Synthetically, we can get around that though.

The first thing we need to do is pass a pair of Chrome flags to bypass the security restrictions, specifically, the ominously named `--disable-web-security` flag, as well as the `--no-site-isolation` flag to accurately catch cross-origin memory usage. We can pass those through with WebPageTest so all we need now is a custom metric to return the `measureUserAgentSpecificMemory` breakdown.

```jsx
[memoryBreakdown]
return new Promise((resolve) => {
  performance.measureUserAgentSpecificMemory().then((value) => {
    resolve(JSON.stringify(value));
  });
});
```

That snippet will setup a promise to wait for `measureUserAgentSpecificMemory` to return a result (it currently has a 20 second timeout), then grab the full result, convert it to a string, and return it back so we can dig in.

To try to come up with some benchmarks, we setup the test with that metric and the Chrome flags, and then ran it on the top 10,000 URL's (based on the Chrome User Experience Report's popularity rank) on Chrome for desktop and again on an emulated Moto G4. Some tests didn't complete due to sites being down, or blocking the test agents, so we ended up with 9,548 test results for mobile and 9,533 desktop results.

Let's dig in!

## How much JS & DOM Memory Does the Web Use?

Let's start with by looking at memory usage of the top 10k URL's by percentile.

| Percentile | Memory Usage (kb), Desktop | Memory Usage (kb), Mobile |
| ---------- | -------------------------- | ------------------------- |
| 10th       | 2,391.7kb                  | 2,368.5kb                 |
| 25th       | 4,949.4kb                  | 4,784.3kb                 |
| 50th       | 10,236.6kb                 | 9,848.3kb                 |
| 75th       | 19,874.3kb                 | 19,033.0kb                |
| 90th       | 31,814.5kb                 | 29,064.5kb                |
| 95th       | 40,477.2kb                 | 37,546.1kb                |

I don't know exactly what I expected to see, but I know they weren't numbers of this size.

At the median, sites are using \~10MB for JavaScript and DOM related memory for desktop URL's, and \~9.6MB for mobile. By the 75th percentile, that jumps to ~19.4MB on desktop and 18.6MB on mobile. The long-tail data from there is...well, a bit frightening.

To put this in context, remember that Chrome research puts JavaScript and DOM related memory at \~45% of memory usage on the web. We can use that to come to a super rough estimate of \~22.2MB of total memory for a single page on desktop and \~21.4MB for mobile at the median, and an even rougher estimate of \~43.1MB of total memory for a single page on desktop and ~41.3MB for mobile at the 75th percentile. That's a lot of memory for a single page within a single window of a single application on a machine that has to juggle memory constraints of numerous simultaneously running applications and processes.

It's well worth noting, again, that without context around the business impact, it's a bit hard to definitively say how much is too much here.

It's also unclear to me exactly how much memory is available for JS related work in the first place. The legacy API ([`performance.memory`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)) provides a `jsHeapSizeLimit` value that is supposedly the maximum size of the JS heap available to the browsing context (not just a single page), but that those values are proprietary and poorly specified, so it doesn't look like we could rely on that to find our upper-bound.

Still, we can still use the results from our tests as rough benchmarks for now, similar to what has been done for other metrics where we don't have good field data to help us judge the impact. Adopting the good/needs improvement/bad levels that Google has popularized around core web vitals, we'd get something like the following:

| Bucket            | Desktop         | Mobile          |
| ----------------- | --------------- | --------------- |
| Good              | < 4.8MB         | <4.7MB          |
| Needs Improvement | 4.8MB <> 19.4MB | 4.7MB <> 18.6MB |
| Poor              | \> 19.4MB       | \> 18.6MB       |

That itself feels like a helpful gauge, but I'm a big believer that the closer you look at a thing, the more interesting it becomes. So let's dig deeper and see if we can get a bit more context about memory usage.

## Correlation between memory and other perf metrics

As we noted early, measuring memory in the wild is pretty tough to pull off right now. There are a lot of security mechanisms that need to be in place to be able to accurately collect the data, which means not all sites would be able to get meaningful data today. That's a big challenge, as performance data *always* becomes more interesting if we can put it in the context of what the impact is on the business and overall user experience.

In lieu of this, I was curious how memory usage correlated to other performance metrics to see if any of them could serve as a reasonable proxy. Probably unsurprisingly given that we're focused on JavaScript and DOM related memory only, the correlation between any paint related metrics or traditional load metrics. It does, however, correlate strongly with the amount of JavaScript you send and with the Total Blocking Time. (The closer the correlation efficient is to 1, the stronger the correlation.)

| Metric                   | Pearson Correlation Coefficient, Desktop | Pearson Correlation Coefficient, Mobile |
| ------------------------ | ---------------------------------------- | --------------------------------------- |
| Start Render             | .073                                     | .097                                    |
| Largest Contentful Paint | .168                                     | .218                                    |
| Total Blocking Time      | .663                                     | .709                                    |
| Load Time                | .365                                     | .463                                    |
| JavaScript Bytes         | .758                                     | .769                                    |
| DOM Elements             | .216                                     | .234                                    |

It seems pretty obvious I guess, but if you're passing a lot of JavaScript, expect to be using a large up a lot of memory as a result. And, if you're total blocking time is high, it's reasonable to expect that you're likely consuming a high-amount of JavaScript related memory.

## Where does it all come from?

Next up, let's take a closer look of what that memory itself is comprised of.

In the memory breakdown, there's an allocation property that we can use to determine if the memory is related to first-party content, cross-origin content or a shared or global memory pool.

Any cross-origin memory will have a `scope` of `cross-origin-aggregated`. Any memory allocation that has no scope designated is shared or global memory. Finally, any bytes that don't have a scope other than cross-origin-aggregated is first-party memory usage.

It's worth stressing—attribution is based on frame (iframes, etc), *not* by URL of the JavaScript file or anything like that. So first-party memory usage here could still be impacted by third-party resources.

If we breakdown byte usage by where it's attributed, we see that 83.9% of that memory is attributed to first-party frames, 8.2% is attributed to cross-origin frames, and 7.9% is shared or global for desktop.

Mobile is very similar with 84.6% of memory attributed to first-party frames, 7.5% attributed to cross-origin frames and 7.9% being shared or global memory.

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623789699/js_mem_usage_attribution.png "Wide:")

## What does memory usage look like across frameworks?

I hesitated on this, but I feel like we kind of *have* to look at what memory usage looks like when popular frameworks are being used. The big caveat here is that this doesn't mean all that memory is for the framework itself—there are a lot more variables in play here.

We have to look though because many frameworks maintain their own virtual DOM. The virtual DOM is quite literally an *in memory* representation of an interface that is used by frameworks to sync up with the real DOM to handle changes. 

So naturally, we'd expect memory usage to be higher when a framework that uses this concept is in place. And, unsurprisingly, that's exactly what we see.

| Framework         | 10th      | 25th       | 50th       | 75th       | 90th       | 95th       |
| ----------------- | --------- | ---------- | ---------- | ---------- | ---------- | ---------- |
| All URLs          | 2,368.5kb | 4,784.3kb  | 9,848.3kb  | 19,033.0kb | 29,064.5kb | 37,546.1kb |
| URLs with Vue     | 6,208.5kb | 9,393.4kb  | 16,842.1kb | 24,773.6kb | 35,563.0kb | 42,508.5kb |
| URLs with React   | 8,183.6kb | 11,331.7kb | 18,539.0kb | 29,268.3kb | 39,106.3kb | 47,404.3kb |
| URLs with jQuery  | 2,549.5kb | 4,627.0kb  | 9,763.4kb  | 19,221.0kb | 28,476.2kb | 36,738.2kb |
| URLs with Angular | 4,137.8kb | 5,946.5kb  | 12,700.5kb | 21,448.7kb | 31,917.4kb | 47,724.4kb |

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1623783902/js-mem-usage-framework.png "Wide:")

There's a risk of looking at that table and immediately deciding that using React, for example, is terrible for memory while ignoring the other things we know. We know that memory usage is *highly* correlated to the amount of JavaScript on a page, and we also know that [sites that use frameworks ship more JavaScript](https://timkadlec.com/remembers/2020-04-21-the-cost-of-javascript-frameworks/#javascript-bytes). So the dramatic increase in memory usage could be more due to the fact that React sites tend to ship a lot of code rather than any inefficiency in the framework.

Accurately zeroing in on the actual memory efficiency of a framework is a bit tougher because there's a fair amount of noise involved. One gauge that could be interesting as a rough indication of memory efficiency is too look at the ratio of bytes in memory compared to JavaScript bytes shipped. DOM elements do factor in to memory use, but given the weak correlation between DOM elements and memory usage and the high correlation between JavaScript bytes and memory usage, I think this gives us a rough, but relatively useful, benchmark. A lower ratio indicates better overall efficiency (less memory bytes per JavaScript byte shipped).

| Framework               | Memory Ratio |
| ----------------------- | ------------ |
| All URLs                | 5.3          |
| URLs with Vue           | 5.4          |
| URLs with React (701)   | 4.7          |
| URLs with jQuery (5026) | 5.5          |
| URLs with Angular (141) | 4.9          |

I'll be the first to admit: these results surprised me. React appears to have a lower memory to JS bytes ratio than the other comparison points. Of course, React also tends to result in a lot more JavaScript being shipped than the others (other than Angular) which is part of the reason why we see such high memory usage, even in the best case scenario. As always, the big advice here is whether you're using a framework or not, keep the total amount of JavaScript as small as possible.

There's another big caveat here—this data is memory usage based on the initial page load. While that's interesting in and of itself, it doesn't really tell us anything about potential memory leaks. Running a few one-off tests, memory leaks were *very* common in single-page applications (throw a dart at a group of them and odds are you'll land on one with a leak)—but that's a topic for another post.

## Summing it up

Memory is still a largely unexplored area of web performance, but that probably needs to change. As we ship ever-increasing amounts of JavaScript, memory usage creeps up as well.

We still need more information to round-out the full picture. How much memory is actually available to the browsing context at any point in time? How does memory correlate to key business and user engagement metrics? What about memory usage that *isn't* related to JavaScript and DOM complexity?

But at least these results let us start to form some level of understanding about how much JS related memory gets used so that we can start to consider how our own sites stack up.