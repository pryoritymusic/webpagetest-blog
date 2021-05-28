---
title: From Android App Vitals to Core Web Vitals - 3 lessons learned along the way
date: 2021-05-27T12:13:53.234Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1622129473/Web_Vitals_Blog_Title_1_fov3jb.png
tags:
  - Core Web Vitals
  - First Contentful Paint
  - Cumulative Layout Shift
  - First Input Delay
category: Perf Data
author: Jeena James
related_post:
  post: understanding-the-new-cumulative-layout-shift
  highlight: More on Web Vitals
---
It’s May 2017. Google has just [announced Android vitals at I/O 2017](https://android-developers.googleblog.com/2017/05/whats-new-in-google-play-at-io-2017.html), an initiative to provide relevant app performance metrics to Android developers with respect to stability, battery and rendering on Android devices. I am on the Google Play team managing product and partnerships strategy for companies and Android app developers to build and distribute their apps on the Google Play Store.  

The news was received with somewhat mixed reactions among the Android app developer teams managed by my team. Most developers loved that Google Play was sharing performance data on their apps, to analyze bad app behaviors and improve performance. After all, no one wants to drain a user’s battery or crash on user’s devices. Also, no other app distribution platform was offering these kind of performance metrics. Some developers were skeptical - because the data was being collected only from a cohort of users who have opted in to automatically share usage and diagnostic data.

But what made Android vitals gain importance with developer teams and the business teams was that Google announced that these metrics (and more that were going to be added later) would soon impact an app’s Google Play Store discoverability (a.k.a Google Play Store Search rankings).

#### That got everyone to sit up and pay attention to their user experience on Android.

Shortly after, developers noticed that making the relevant improvements started bringing in almost immediate results. 

The Starbucks Android app developer team was able to [isolate a common ANR](https://youtu.be/dx6LBaFqEHU?t=265) (application not responding) to a 3rd party library. Which led to Starbucks app’s ANR rate being reduced by 70% and crash rate by 85% within a week. This is directly tied to their revenue given their focus on mobile ordering. If you like purchasing the Starbucks Nitro cold brew or your favorite coffee on your mobile device like I do, then you know how frustrating it is if the app fails on you during checkout and you end up holding up a line.  

Fast forward to May 2021. I'm now at Catchpoint driving our [WebPageTest](http://webpagetest.org/) business with Patrick Meenan, Tim Kadlec along with many more team members, and coincidentally find myself having similar discussions with the same companies. Only this time, they are with front-end web development teams, performance engineering, business, and marketing leaders all concerned about a set of web performance metrics for on-page experience called Core Web Vitals.  

![Core Web Vitals Breakdown](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1622117884/CWV_dizvd6.jpg)

#### And just like with Android vitals, Google announced that these performance metrics will be included in the Google Search ranking signals, rolling out from mid-June 2021. 

At a whopping [64.47% of market share](https://gs.statcounter.com/browser-market-share) of all browsers, Chrome is the primary browser for global internet users and Google Search takes the lion share of total search traffic. It’s safe to say that this search ranking update will impact any and every website who cares about SEO. While we can have different schools of thoughts around what should be measured, and why should one company get to dictate how user experience should be measured, everyone agrees that the user experience on digital channels needs to be flawless. Especially in this digital age, where we all have multiple options to shop, eat, read, consume utilities etc. from different companies all vying for the same user attention.

*What's the impact of improving these performance metrics for my users and business?*  

Whatever your business is, whether selling a product or a service, you are really in the business of people. People love delightful digital experiences and they run out of patience for poor performing ones, thereby directly impacting the health of your business.  

> A Google study of over millions of page impressions found that when a site meets the recommended thresholds for the Core Web Vitals metrics, users are at least 24% less likely to abandon a page before it finishes loading.
>
> [Google Study, 2020](https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html)  

Web developer teams are seeing significant improvements already, and here are some examples from companies who have been prioritizing speed and performance:  

![Poor digital experience is tied to user engagement and business outcomes](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1622118836/CWV_Stats_lmutui.png)

[More examples of business impact](https://web.dev/vitals-business-impact/)

I want to share with you the 3 lessons I took away from my experience working with Android app developers when we launched Android vitals in Google Play and how they apply today to teams who are working on improving their Core Web Vitals:  

## Lesson 1: User experience really matters, but pay attention to the right metrics 

If you’ve been paying attention to all the studies and literature coming out around web vitals, you’ll see there's a lot of noise out there on which tools and metrics matter.  

This is where something like Google’s Core Web Vitals provides guidance in terms of the metrics that are now being universally reviewed and monitored by not just front-end developers, but also by product, business and marketing teams. Developers can use the [tools provided by Google](https://web.dev/vitals/) that measure the 3 core metrics – [Largest Contentful Paint](https://web.dev/lcp/), [First Input Delay](https://web.dev/fid/) and [Cumulative Layout Shift](https://web.dev/cls/). As a side nore,if you are looking at simulated environments without a real user, then Total Blocking Time (TBT) is an excellent proxy for First Input Delay (FID). If you improve TBT in synthetic testing environments, you should see an improvement in FID too.  

And if you’re keen to grab in-depth performance data on real browsers around the world with a combination of Google Core Web Vitals with TBT and URL-specific field data from Chrome User Experience Report, then [WebPageTest](http://webpagetest.org/) offers all that in one clean report. As well as a dedicated diagnostics page for the same for every test result.

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1622118968/CWV_Gif_u9ddhb.gif)

## Lesson 2: Start with one, but apply to others where possible 

Don’t focus on these performance metrics only because Google says you have to improve your Core Web Vitals on Chrome. Do it because all your users are going to have a much better experience and come back to your website again. On Google Play, our Android developers took many of the issues on Android that impacted user experience, and applied it to their iOS apps as well. Had they not considered their broader audience, a whole subset of their users would have had a worse experience. Learnings from one platform can and should be applied to others. The same thing holds true for browsers. 

Using a new format like AVIF, for example, in browsers that support it (Chrome and Firefox in this case) could help reduce your overall page weight and potentially improve your Largest Contentful Paint (LCP). This is particularly beneficial for Media and Ecommerce sites where LCP is likely a hero image. However, Safari doesn't support AVIF yet so it wouldn't get any benefits out of the box. So, you'd want to make sure that whatever your strategy for images, you make sure you're also trying to find the best possible format to use for your Safari-based traffic so that users on Safari can also benefit.  

Be careful of cross-browser measurements though. Review if they are indeed ‘apples to apples’. Recently, the [First Contentful Paint](https://web.dev/fcp/) metric moved away from being solely a Chrome-only metric and became one of the first performance metrics to be available across Chrome, Edge, and Safari. 

[Tim Kadlec](https://twitter.com/tkadlec), Performance Engineering Fellow at Catchpoint and a well regarded advocate for web performance standards, did a [comprehensive analysis recently](https://blog.webpagetest.org/posts/why-first-contentful-paint-doesnt-work-as-a-cross-browser-metric/) to dig into the FCP metric on Safari and outlined a few areas where it’s not really apples to ‘Apple’. Tim goes on to explain how this is a good example where developers can optimize FCP   for a specific browser and see how the metric improves when they make changes, however, be careful of comparing the performance metrics between browsers. This exercise also stresses the fact that developers need to pair their real user data with solid synthetic data, and not just look at one or the other. 

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1622119084/CWV_Chart_dq1aph.png "There's a gap in all browsers, and for most of these sites, the First Contentful Paint fires before we see something on the screen. What differs is the size of that gap [[Blog post](https://blog.webpagetest.org/posts/why-first-contentful-paint-doesnt-work-as-a-cross-browser-metric/)] ")

## Lesson 3: Build a culture of performance monitoring - not a one-time effort for one team

Look carefully at what exactly the Core Web Vitals metrics offer or for that matter any of the performance metrics the Google Chrome team has been talking about. They all distill down to measuring core user experiences, gathering relevant insights and reporting issues that front end developers in any company large or small have been optimizing for, for years. Nothing really new. But this is a great step in the right direction where Google is providing a more unified approach to guide companies with signals for quality that can help them deliver stellar user experiences across the web. So it’s not just for the front end developers to care about these experiences, but also for the product, other engineering teams, marketing, business.  

Here are some best practices I hear from our customers about how their developer and performance engineering teams are integrating Core Web Vitals into their day-to-day workflows as well as into the top-level reporting.  

1. **Running tests for code changes** where performance data is automatically added to their pull requests, thereby moving the performance conversations directly into their workflows.  
2. **Building performance dashboards on Grafana, PowerBi or a visualization tool of their choice** to further augment the performance tests they run. Be it for monitoring all their brands and pages in different markets, or to compare to other peers in their industry. These dashboards are shared with the wider organization so that everyone has visibility around core digital user experience.  
3. **Setting alerts based on performance budgets at both pre-release and post production checkpoints**, so that relevant teams can be informed in a timely manner and prevent escalation of user experience issues and avoid the [high cost of post-production bugs](https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf).  

You can set these up too. Check [our supported API Integrations](https://docs.webpagetest.org/api/integrations) for more information.   

Going back to Google Play for a quick second. What started out with 3 metrics on Google Android vitals for stability, battery and rendering quickly [expanded to other metrics](https://support.google.com/googleplay/android-developer/answer/9844486?hl=en) including supporting ones like excessive background Wi-Fi scans and permission denials. It is very likely the Chrome team will expand Core Web Vitals and maybe even update them over the next few months, like [they did for CLS](https://web.dev/evolving-cls/) in April 2021. This is not a one time effort for Google Chrome, then it cannot be a one time effort for your teams too. 

To quote a line from a book I’m currently reading:  

> *If you want better results, then forget about setting goals. Focus on your system instead.*
>
> *\- Atomic Habits, James Clear*

**Core Web Vitals should not be a one-time effort for all teams leading up to the mid-June rollout of Core Web Vitals impacting search engine ranking.** But rather these and other metrics should be imbibed into a culture of performance and systems that need to be established of measuring performance for your user experiences across all stages of development among your teams.  

Our teams at Catchpoint have solid experience in helping companies and teams set up these systems across diverse use cases and can help you with laying the foundation and building an interoperable system to measure and monitor web performance.  

A lot of progress has taken place over the years around pushing the bar on performance and it’s more holistic just making your sites and apps faster. With Android vitals, it was about not inadvertently taxing the users and their Android devices in such a way they end up leaving poor reviews and uninstalling the apps. With Core Web Vitals, it is to look at the optimal signals to improve on-page experience so that users find what they are looking for, consume the content, complete the purchase and continue to engage with the brand. It's great to see companies of all shapes and sizes talking about performance. Let’s continue to include performance measurement and monitoring into our conversations and decision making.  

*Where can I learn more?*  

Here are some resources to get you going!  

* Core Web Vitals from the Google Chrome team - [Overview, definitions, and best practices](https://web.dev/learn-web-vitals/) 
* [Science behind Web Vitals](https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html) 
* Run performance tests, access web vitals, and advanced metrics on [WebPageTest](https://webpagetest.org/) 

I look forward to many more such conversations where we can work with developer teams to stay ahead of the performance curve be it Core Web Vitals and more!