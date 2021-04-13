---
title: Diving Into the new Cumulative Layout Shift
date: 2021-04-12T15:17:00.409Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1618332203/New_CLS_Cover_Image-01_i2hhff.png
featured_image_caption: ""
category: Perf Data
author: Tim Kadlec
---
The Chrome team experimented with ways to make a more level playing field, and [just announced](https://web.dev/evolving-cls/) that based on their analysis, they're going to be changing the way the Cumulative Layout Shift (CLS) metric will be reported. 

Up to this point, CLS has been the sum of all individual layout shifts (that weren't preceded by user interaction) during the time the metric was being recorded (page load, entire page session, etc). Going forward, however, they will instead break that session up into "windows" of shifts and then report the maximum score of each of those windows as the CLS score.

Each window is a period of time that has a maximum duration of 5 seconds. The first window starts at the moment the first layout shift occurs and lasts until the first of two criteria are met. Either:

* There is a 1 second or greater gap where there are no layout shifts.
* The window size meets that 5 second maximum threshold.

After either criteria gets met, the window is closed and the next shift window starts when the next layout shift occurs. The new CLS metric will look at all those shift windows and report the score of the maximum window.

The goal here is to help put pages with long-sessions (single-page applications where the browser has no concept of next navigation, pages with infinite scrolling, etc) on even footing in the [Chrome User Experience Report (CrUX) dataset](https://developers.google.com/web/tools/chrome-user-experience-report). CrUX data is collected until the page's visibility state changes (the tab/window is closed, a navigation occurs, etc). In pages with short sessions, that period of time could be relatively short, meaning less time for shifts to occur. In those long-lived sessions, however, the time window can be very large, and all those shifts start to pile up, pushing the metric higher and higher. By taking a windowed approach, they level the playing field a bit from a comparison standpoint.

I'm the kind of person that has to play with something like this to fully understand it, so I decided to fire up a few tests in WebPageTest to dig in and see the impact of the change.

## Setting up the tests

WebPageTest reports the (now) old version of Cumulative Layout Shift. In their post, the Chrome team helpfully shared a few [JavaScript snippets]([https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver#max-session-gap1s-limit5s](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver#max-session-gap1s-limit5s)) for each of the various ways they experimented with measuring CLS. Here's the snippet for the new implementation:

```js
{
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
      console.log('Current MAX-session-gap1s-limit5s value:', max, entry);
    }
  }).observe({type: 'layout-shift', buffered: true});
}
```

WebPageTest lets you collect custom metrics by running snippets of JavaScript after the work associated with testing the page is done, so with a little massage work (removing the `console.log` and wrapping this in a promise) we can use this to collect the new CLS score:

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

That snippet will now tell WebPageTest to run that code, returning the maximum window score as a custom metric called `newCLS`. You can submit this via the API using the `custom` parameter, or you can drop it into placed in the "Custom" tab on [WebPageTest.org](http://webpagetest.org) if you want to run the tests manually.

## Exploring a Few Examples

In their blog post, Annie and Hongbo mentioned that in their analysis, 55% of origins didn't see a change in CLS at the 75% percentile. The remaining 45% that did see a change all got better (which makes complete sense, since CLS is no longer reporting all shifts...more on that in a minute).

That lines up pretty well with what the tests showed.

### Gardeners Category Page

For example, one [page I tested](https://www.webpagetest.org/result/210409_BiDc3Y_2093c2f01093bc6f7749b883019966d3/2/details/#waterfall_view_step1) comes from [Gardeners.com](http://gardeners.com) (look—gardening season is right around the corner so I spend a lot of time on this site, ok?).

The original CLS value is .595. The new CLS score is...also .595.

If we look at the waterfall, we can see why.

![A screenshot from a WebPageTest waterfall, showing a series of orange checkered lines all right next to each other.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1618240962/gardeners-shifts.png "Wide:")

The checkered orange vertical lines tell us when a layout shift occurred. In this case, all of the shifts occur in one little clump. We capture detailed layout shift information in the JSON results for every test, so we can get the exact time stamps and scores for each shift reported by Chrome (excluding layout shifts that are basically rounding errors):

| Timestamp (ms) | Shift Window | Shift Score | Window Score | Total Score |
| -------------- | ------------ | ----------- | ------------ | ----------- |
| 4233           | 1            | .547        | .547         | .547        |
| 4342           | 1            | .022        | .569         | .569        |
| 4660           | 1            | .007        | .576         | .576        |
| 4747           | 1            | .001        | .577         | .577        |
| 4918           | 1            | .017        | .594         | .594        |



In this case, there are five shifts, all of them occurring within a time span of 686ms. That means they all fit within a single shift window (since there's no 1 second gap between any of them and the total window from start to finish is well under 5 seconds) so all shifts still get reported.

(As an aside, note how there's one large shift that accounts for the bulk of the score—it's a pattern we see a lot and one of the reasons why we expect this change in metrics may be only impacting a subset of origins.)

### CNN Article

Another [test that *does* show a little change between the old and new CLS metric](https://www.webpagetest.org/result/210409_BiDcXC_2cd95fe10ccc4f7acb33803536ba1f6a/2/details/#waterfall_view_step1) was for a CNN article page. In this case, their original CLS score was .449 and the new CLS score is .296.

Once again, the waterfall helps us see why the score changes. I've highlighted each individual shift window to make it easier to see the impact the new way of measuring has.

![Annotated screenshot of a WebPageTest waterfall, showing 4 blue boxes that show the 4 distinct layout shift windows.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1618245229/cnn-windows-wpt-blue.png "Wide:")

| Timestamp (ms) | Shift Window | Shift Score | Window Score | Total Score |
| -------------- | ------------ | ----------- | ------------ | ----------- |
| 3853           | 1            | .005        | .005         | .005        |
| 4070           | 1            | .064        | .069         | .069        |
| 4209           | 1            | .207        | .276         | .276        |
| 4481           | 1            | .020        | .296         | .296        |
| 6837           | 2            | .024        | .024         | .320        |
| 10434          | 3            | .120        | .120         | .440        |
| 11564          | 4            | .010        | .010         | .450        |



For CNN, we see a clump of layout shifts early on with four of them occurring between 3.85s-4.48s in the page load process. After that, theres a 2.4s gap between shifts so the first shift window closes and we start counting our next window. In this case, there's only one shift in the second window—we get a big 3.2s gap after which triggers the end of our second shift window.

We get our third shift window when a layout shift occurs around 10.4s into the page load process followed by a 1.1s gap which once again triggers the closing of a shift window.

Finally, we get our last shift window when the final shift occurs 11.6s into the page load process.

This example shows the effect of the new windowing approach. The total amount of all shifts (the original CLS calculation) is .449, but the new score only reports the maximum window .296 resulting in a 34% reduction.

## Scrolling through a Target Category Page

So far we've seen two examples of measuring CLS through the loading of a page, one with no difference between the two versions of the metric and one with a significant improvement. But the biggest improvements will be seen by long-lived sessions, long scrolling pages and single-page applications, so let's look at one of those. 

If you load a category page on Target, the initial view is pretty darn polished—[running these same tests on Target revealed a CLS score of only 0.011](https://www.webpagetest.org/result/210412_BiDcPC_14615cf589963fd90529d8e2eec31c8a/2/details/#waterfall_view_step1). However, looking at the CrUX data that WebPageTest now embeds in each test run provides some useful context. In this case we can see that the desktop CLS score reported at the 75th percentile by CrUX for that same page is 0.72—a significant difference from our own test.

![An image of two bar charts, next to each other, representing the CrUX data for this test. The left shows the First Contentful Paint values (with a p75 of 1383), the right shows the Cumulative Layout Shift (with a p75 of .72)](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1618246246/target-crux.png)

There are likely a few different reasons for this, but one could certainly be the scrolling behavior. When you scroll through a category page on Target, it's not *exactly* infinite scroll, but the behavior is very similar: more sections and types of products appear as you scroll down the page. CrUX keeps counting CLS until a user either navigates away from the page or closes the tab/window, so any shifts that are triggered during this scroll will accumulate, pushing the CLS score higher.

We can test the scrolling behavior by injecting some JavaScript into our tests (using the "Inject Script" functionality) to run after the page has finished loading. In a recent conversation in the Web Performance Slack Group, [Andy Davies](https://andydavies.me/) posted a snippet that should work well here:

```js
window.addEventListener("load", async function () {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let pages = document.body.scrollHeight / window.innerHeight;
    for(let page = 0; page < pages; page++) {
        window.scrollBy(0, window.innerHeight);
        await sleep(200);
    }
})
```

That snippet will scroll through the page, triggering some of that lazy-loaded content so we can see the effects on the layout shift.

[Running that test](https://webpagetest.org/result/210412_AiDcE9_b3057a7c4263ceb49f6951778301bccc/1/details/#waterfall_view_step1) reports an old CLS score of 1.453 and a new CLS score of 0.415—a much better stress test than our initial load. 

![Annotated screenshot of a WebPageTest waterfall, showing 7 blue boxes that show the 7 distinct layout shift windows.](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1618245725/target-windows-wpt-blue.png "Wide:")

| Timestamp (ms) | Shift Window | Shift Score | Window Score | Total Score |
| -------------- | ------------ | ----------- | ------------ | ----------- |
| 6925           | 1            | .010        | .010         | .010        |
| 11569          | 2            | .005        | .005         | .015        |
| 12648          | 3            | .098        | .098         | .113        |
| 13972          | 4            | .057        | .057         | .170        |
| 14393          | 4            | .020        | .077         | .190        |
| 14945          | 4            | .258        | .335         | .448        |
| 15608          | 4            | .020        | .355         | .468        |
| 16412          | 4            | .059        | .414         | .527        |
| 17709          | 5            | .258        | .258         | .785        |
| 18807          | 6            | .258        | .258         | 1.043       |
| 18935          | 6            | .146        | .404         | 1.189       |
| 21039          | 7            | .261        | .261         | 1.450       |



This test shows pretty clearly the significant impact the new metric can have on pages with infinite scrolling (or similar bursts of shifting that isn't triggered by an active user action). Looking at the shift data, we see 7 different windows. Our initial window (during page load) is once again very small. But as we scroll through, we start to see some larger windows including our maximum window, window #4. While the new score still ends up in the "poor" category (as defined by Google), this is easily the biggest difference we've seen yet between the two versions of the metric—a 71% reduction from the old to the new.

## Say goodbye to the old CLS?

These examples make it a bit easier to see how the new way of reporting on CLS works and can impact your scores. They also highlight some of the reasons why tracking layout shifts may have gotten a little bit more complex.

For the two examples that saw a significant boost in their CLS score, it's important to note that the metric improved, but the *actual experience didn't change at all.* All those shifts are still there, they're just no longer surfaced by the metric. We've lost some data in the shift.

This makes some sense from the perspective of Google and CrUX. Since Google is using CrUX as its method of determining if you get the performance boost in the search algorithm, they have to try to make the comparison between one site and another as fair as possible. The fact that one site chooses to use infinite scroll and another has more traditional navigation can't impact the scores (unless Google would suddenly decide to get *very* opinionated about architectural decisions).

The change makes less sense for the organizations themselves, however. If you want to improve performance because it provides a better overall experience for your users and better metrics for your business, you still want to watch out for all those shifts because they still matter.

In addition to tracking both the new and old CLS scores, some teams might find value in keeping an eye on their second highest window. The Target example is a good one. The maximum window is .415, but the next highest window isn't far behind at .405.

If Target made a concerted push to improve the shifts in their current max window, they might expect to see their new CLS score show noticeable improvements. However, if the improvements to those shifts didn't also improve the shifts in their second highest window, then they would only see a negligible impact as the second highest window would take the place of the first.

## So...not so cumulative after all?

Then there's the whole "naming" thing, which just got even more important to sort out than it was already.

[Ben Schwarz had already suggested that CLS as reported by Lighthouse](https://github.com/GoogleChrome/lighthouse/issues/12314) (which measures initial page load) should be renamed to "Initial Layout Shift" to help differentiate between CLS as reported by RUM and CrUX. It's a great point—there is a lot of confusion around CLS and why what you get synthetically differs from your own RUM data which also differs from your CrUX data.

I think there's an argument to rename the new version of the metric as well. As we saw, the new calculation is no longer cumulative—it's based on a maximum window. To me, it makes more sense to keep the original definition as the "Cumulative Layout Shift" and then perhaps add in something like "Maximum Layout Shift Window" for the new metric (yeah, I know, it doesn't exactly roll off the tongue) in addition to renaming or clarifying the layout shift that gets reported during initial load only. (As Pat mentioned to me, we do risk getting to a point where we're recording *LS before too long).

## Moving forward

The change the Chrome team was a necessary step in helping to provide a more consistent baseline for comparing sites across the CrUX data set. But as organizations move forward, it's important not to completely dismiss the older style of reporting—even if scores improve, that doesn't mean the experience has. 

We'll be reporting the new version of the CLS metric in our test runs, but we'll also be providing the total shift score, as well as providing all the detailed Layout Shift timing and node information so organizations can keep tabs on each shift and shift window.