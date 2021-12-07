---
title: Versantus' Process-Driven Approach to Performance
guest: true
date: 2021-12-07T21:14:52.709Z
category: Optimizations
author: Tim Kadlec
---
After Google’s Core Web Vitals announcement, performance became an important metric to our client’s—one that they knew they had to stay ahead of the curve on. As an agency, we help businesses solve technical problems with intelligent digital solutions, so we’ve always built websites that perform well. However, the Core Web Vitals updates have meant every detail, millisecond and image are now under the microscope. 

Some of our clients, who were working with marketing agencies, received site recommendations to implement for improved performance metrics. For many others, performance simply moved up the agenda because of Core Web Vitals’ impact on search engine rankings. To give our client’s the best chance of high performance scoring, we knew we had to take a process-driven approach.

## Process in progress

We know a thing or two about performance, however, up to this point our processes hadn’t been fully fleshed out. Typically, performance tuning had been micro rather than macro: we would look at the worst performing individual pages and tweak them. One. At. A. Time.

This process was painful, inefficient, and almost an infinitely frustrating ongoing task. We needed a set of replicable steps that would allow us to: 

* identify the areas needing most improvement
* roll out improvements that would affect individual pages, sets of pages, and the whole site in one fell swoop

After much process-refinement, experimenting and coffee-drinking, we settled on a process that works well. Most notably for us, it addresses the common issues faced by all developers who are taking a holistic approach to improve a “whole” website. 

## Our process

Rather than focusing on just the homepage, we created a method that provides a bird’s eye view of complete sites. 

*Cue plugging every URL we know about into Google PageSpeed Insights* (definitely not)

So how do we gather individual Core Web Vitals/PageSpeed scores for all URLs on a site? 

We turn to our trusted crawling tool, Screaming Frog. It has a rather nifty API integration with Google’s PageSpeed Tool. In a matter of minutes we have a full exported list of site URLs and Core Web Vitals data on a page-by-page level. 

![An image of a Google Sheets file, showing page-by-page level analysis of Core Web Vital data, with good scores highlighted in green and bad scores in red.](https://res.cloudinary.com/webpagetest/image/upload/v1638912065/versantus-spreadsheet_jpspsg.png "wide:")

Once we review this information and have an idea of the overall site performance, we then review performance scoring on a granular level, picking out pages which are lagging behind. To identify quick performance wins, we take a look at pages with shared common elements for a site-wide impact.

### Refining our hit list with Google Analytics usage data

Now that we know which pages are our worst performers, we want to add some business logic to inform where we focus our attention. We do this by layering Google Analytics usage data over the information we’ve already gathered.

What we’re ideally looking for is pages important to the business (e.g landing pages, high SEO value pages, pages important to the conversion path) that are performing poorly against Core Web Vitals metrics. To get a full picture, we also consider important pages with a high bounce rate, assuming that poor bounce rate is caused by poor UX. 

![A screenshot from Screamingfrog showing key search metrics for a number of pages on the Versantus site](https://res.cloudinary.com/webpagetest/image/upload/v1638912187/versantus-screaming_chvqrf.png "wide:")

### Tools, glorious tools

Alongside Screaming Frog and Google Analytics, we use Google Search Console (GSC) to uncover poor-scoring pages. On top of the previously mentioned tools, GSC provides additional insight into which specific Core Web Vital metric needs looking into. For example, a site-wide CLS issue could be attributed to a common element across all pages. 

Despite the multiple tools we use to unravel where performance problems might be hiding, the key is that they all help to build an in-depth picture of site-wide and page-level performance scoring. With comprehensive insights into what and where, we can then tackle the why and how (to fix it). 

## WebPageTest to the rescue

Armed with a list of pages that need analysing, we take them straight to our trusted tool: WebPageTest. The aim of using WebPageTest is to obtain as much detail as possible around why the pages are performing poorly. We’ve used plenty of tools in the past, but WebPageTest has been a standout option for our team: 

“Plenty of tools tells you what’s wrong, but they lack the ability to forensically uncover where the problems are. For example, gaining insight through the waterfall graphs, so we can see exactly where LCP arrives; plus the content layout shift film strips, thumbnails and gifs are invaluable” - Matt Gilbert, Software Development Manager 

As WebPageTest’s own Core Web Vitals guide explains, the reason for the update is to answer three core questions that scrutinise the quality of user’s experiences on your site. However, sometimes we have to go deep under the hood of the well-oiled car to find where the problem is; WebPageTest allows us to pinpoint exactly what’s gone wrong and where. 

Features like the CLS gifs, a slowed-down version of a page load, helps us see exactly what’s shifting and when; the waterfall metrics provide an element-by-element breakdown of the site loading, so our developers can visually understand what’s causing a backlog for the rest of the page; low-bandwidth speed simulator helps us identify the real issues a mobile user with a 3G connection would experience; browser simulator ensures the changes we made will improve the experience of all users, regardless of the browser they’re accessing our sites from.

### Evaluating the impact of our changes in a controlled environment

To accurately measure the Core Web Vitals score improvements we influence, we benchmark performance for our sites on staging and on live before any changes are made. 

With benchmark scores noted, we apply iterative fixes based on the insights we obtain from WebPageTest. The only thing left to do at this point is start tracking the scoring on staging and live after the improvements have been made. 

This approach gives us comprehensive data that can be reviewed and unpacked to uncover what’s working and what isn’t. Measuring improvements this way has been particularly useful, as some changes we’ve previously made actually reduced certain Core Web Vitals scores (hold your gasps). 

As an example, we fully expected lazy loading images to have a wholly positive effect on pages with hero banners. However, the negative impact on Largest Contentful Paint by lazy loading the hero image mitigated these benefits. Having data on hand to back up this unexpected effect had a lasting impact on our process going forwards: we now only lazy load images below the initial view port.

## What’s on the horizon?

Despite our new-found process, we’re always on the lookout for ways to further streamline what we do. We’re currently extending our processes to integrate other WebPageTest features, such as: 

* Slack integrations & automation - receiving alerts when a site’s WebPageTest score drops
* Automation API - automating multi-step tests with custom metrics for tailored measuring 
* DevOps integrations - getting an instant WebPageTest score once a site is deployed to staging, so we can make improvements before it even hits live

As we've settled on a more permanent process for performance monitoring and optimisation, we've used it to support multiple clients, including an award-winning organisation that designs and manufactures eco buildings, an international HR and Payroll software provider, and a leading IT software solutions business that support companies through the entirety of their data's lifecycle. Our process has helped our clients give their users engaging, memorable web experiences, whilst avoiding surprises in the wild. 

Like with all things performance, we're constantly refining our process to make sure that we stay on top of algorithm changes and best practices. One thing we know for sure, though, is that WebPage Test is a tool that we'll be taking along with us for the ride. 

We can’t wait to see what’s on the horizon for WebPageTest as a tool, and we’re even more excited to integrate it into our ever-evolving processes for a robust approach to performance optimisation. Let those Core Web Vitals scores soar!