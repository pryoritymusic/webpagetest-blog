---
title: "Full Throttle: Comparing packet-level and dev tools throttling"
guest: false
date: 2021-09-22T15:59:07.064Z
featured_image: https://res.cloudinary.com/webpagetest/image/upload/v1632408014/full-throttle-header_v7uyfb.png
tags:
  - Render-Blocking
  - Throttling
category: Perf Data
author: Tim Kadlec
---
When you're doing performance testing, one of the most important variables to consider is the connection type. The web is built on a set of a very chatty protocols—there's a lot of back and forth between the browser and the server throughout the browsing experience. Each trip from the server to the browser, and vice versa, is subject to the limitations of the network in use: how much bandwidth is available, how high is the latency, how much packet loss is there, etc.

Test results are only as good as the accuracy of the throttling being applied to the network—use throttling that is too optimistic, or has fundamental limitations of accuracy, and you could find yourself drawing the wrong conclusions about potential bottlenecks and their impact.

WebPageTest uses something called *packet-level* network throttling. In other words, the additional latency is applied for each individual packet. In terms of approaches to throttling goes, packet level throttling is the gold standard in accuracy.

Recently, we added support for optionally running tests using Dev Tools throttling instead. We don't recommend using it, except for scientific purposes, but it does make it easy to compare and contrast the two approaches and see how they impact your results.

## Differences in Throttling Approaches

DevTools throttling applies at the request level and operates between the renderer and the networking stack of the browser. This means that there are some things that are out of reach for DevTools throttling. DevTools throttling won't have any effect on things like:

* TCP slow-start
* DNS resolutions
* TCP connection times
* Packet-loss simulation
* TLS handshake
* Redirects

On top of all of that, because it sits between the network layer and renderer, dev tools throttling means any network-level HTTP/2 prioritization won't be applied either.

{% note %}
There's also something called *simulated throttling* which is what Lighthouse uses. Simulated throttling doesn't actually apply throttling at all. Instead, Lighthouse runs a test without any throttling applied, then uses some adjustment factors to simulate how that page load would have looked over a slow connection. To learn more Lighthouse's simulated throttling approach, the Lighthouse team has written up [some interesting analysis where they compare and contrast the simulated throttling with dev tools throttling and WebPageTest's network throttling](https://docs.google.com/document/d/1BqtL-nG53rxWOI5RO0pItSRPowZVnYJ_gBEQCJ5EeUE/edit).
{% endnote %}

On the other hand, since packet-level throttling applies to the underlying network, the impact of packet-level throttling can be felt on each of those processes, while also maintaining any network-level HTTP/2 prioritization. The result is that packet-level throttling is a much more accurate representation of real network conditions.

Applying packet-level network throttling requires being able to affect the entire operating systems's network connectivity, which is why it's not an option for dev tools, but is for something like WebPageTest where the testing agent runs on a dedicated machine.

The impact might sound academic, but let's dive into some specific examples where the type of throttling may lead you to very different conclusions.

## Minimizing the Impact of Third-Party Domains

It's pretty common to find render blocking requests that are loaded from a third-party domain. We load JavaScript libraries, CSS files, client-side A/B testing solutions, tag management, ads, and more from third-party domains and many of those are loaded in a way that those resources sit in directly in the critical path—the page can't display until those resources have been requested and downloaded.

One frequent bit of advice, particularly since HTTP/2 came along, has been to try to self-host those resources whenever you can. If you can't self-host them, then proxy them using a solution like Fastly's Compute@Edge, [Cloudflare Workers](https://workers.cloudflare.com/), or [Akamai EdgeWorkers](https://developer.akamai.com/akamai-edgeworkers-overview) so that the time to connect to those other domains is handled at the CDN level, where it can likely happen much faster.

But just how big is the impact, really?

The following screenshot of a page loaded on an emulated Moto G4 over a 4G connection, shows three different third-party domains, all serving up render-blocking resources.

![A screenshot from WebPageTest, showing three requests to third-party resources. The connection times are all very, very small and the requests complete by .6 seconds.](https://res.cloudinary.com/webpagetest/image/upload/v1632326492/blocking-3rd-party-dt-throttle.png "Wide:")

In this case, we've applied DevTools throttling. Notice how the connection cost (TCP + TLS + SSL) for these resources doesn't seem particularly high:

* cdn.shopify.com: 18ms
* use.typekit.net: 37ms
* hello.myfonts.net: 18ms

Here are the same requests with the same settings, only this time we've applied WebPageTest's default packet-level throttling.

![A screenshot from WebPageTest, showing three requests to third-party resources. The connection times are much longer now and the requests complete by 2.6 seconds.](https://res.cloudinary.com/webpagetest/image/upload/v1632326492/blocking-3rd-party-wpt-throttle.png "Wide:")

The connection costs are much more expensive:

* cdn.shopify.com: 550ms
* use.typekit.net: 549ms
* hello.myfonts.net: 545ms

If we were looking at the results with DevTools throttling applied, we might conclude the cost of the third-party domain is pretty light (what's 20-40ms, after all?) and, as a result, that any efforts to self-host those resources could be more work than it's worth.

With packet-level throttling, however, we see the reality: those connection costs are an order of magnitude more expensive, costing us around 550ms. Self-hosting here makes a lot more sense—an improvement of half a second or more in page load time is likely very worth the time and energy it would take to fix it.

{% note %}
Just to re-emphasize the point, notice how if we exclude the connection costs, the actual download times for these requests are pretty close. For example, without the connection costs, the CSS requested from Shopify takes 185ms to retrieve with packet-level throttling and 176ms to retrieve with dev tools throttling. That's because dev tools throttling is able to be applied at that stage of the request, so we're seeing that throttling in action.
{% endnote %}

## Masking the cost of redirects

[Unpkg](https://unpkg.com/) is a popular CDN for node modules ([HTTP Archive data](https://httparchive.org/) currently discovers it on 129,324 sites). If you want to pull in a library (like React for example), you pass the package name, version number and file like so:

```jsx
unpkg.com/react@16.7.0/umd/react.production.min.js
```

Alternatively, you can opt not to omit the version entirely, or use a semver range or tag. When that happens, unpkg will redirect the request to the latest matching version of the file.

For example, given the following address:

```jsx
https://unpkg.com/react@15/dist/react.min.js
```

Unpkg will respond with a 302 redirect to:

```jsx
https://unpkg.com/react@15.7.0/dist/react.min.js
```

That redirect is a handy way to pull in the latest version of a library automatically, but it's also expensive. It means the browser has to first issue the request, wait for the response, process the redirect and then issue a new request.

With dev tools throttling, the impact looks minimal.

In the following screenshot of a truncated waterfall, the first group of requests (#12-14) all result in 302 redirects which trigger the actual requests (requests #27-29).

![A screenshot from WebPageTest, showing three requests all returning a 302 redirect (and all taking less than 17ms), followed by three requests returning the actual resource.](https://res.cloudinary.com/webpagetest/image/upload/v1632326492/302-redirect-dt-throttle.png "Wide:")

While this isn't ideal, the time it takes for those redirects looks pretty minimal—they all take under 20ms. Dev tools throttling isn't applying any throttle to those redirects, since they occur at the network level, so things don't look so bad. Based on what we see here, we might decide that eliminating the redirect is, at best, a minor improvement.

Here are the same requests on the same browser and network setting, but with packet-level throttling applied instead of dev tools throttling.

![A screenshot from WebPageTest, showing three requests all returning a 302 redirect (taking between 612 and 1434ms), followed by three requests returning the actual resource.](https://res.cloudinary.com/webpagetest/image/upload/v1632326492/302-redirect-wpt-throttle.png "Wide:")

Now the redirects look *much* more expensive—instead of 17ms for the longest redirect, we're spending 1.4s! ch

The request order also changes. With the packet level throttling more accurately showing the impact on connection costs, downloads for requests with connection costs associated start at different times than before, meaning even the request order is different.

## Summing it up

Accurate network throttling is so important when doing synthetic performance analysis, and a ton of work goes into getting it right. Dev tools throttling tends to use more aggressive throttling factors to account for the fact that's it's a little over-optimistic, and Lighthouse's simulated throttling has also been carefully calibrated against network-level throttling to try to get results to be as accurate as possible.

You don't need to be an expert in network throttling approaches to improve your sites performance, but some basic understanding of how they work, and where dev tools throttling in particular falls a bit short can help you to understand the differences in results across tools and, more importantly, help you to avoid drawing the wrong conclusions about potential optimizations.