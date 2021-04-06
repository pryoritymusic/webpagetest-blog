---
title: The WebPageTest API Has Gone Public
date: 2021-04-06T11:52:16.818Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/v1617681595/Blog_Cover_x8fqjx.png
tags:
  - API
  - GitHub Actions
  - NodeJS
category: Product News
author: Patrick Meenan
related_post:
  post: automatic-webpagetest-results-for-every-docs-deploy
  highlight: Integration
---
WebPageTest Community,

We’re excited to announce the general availability of the enhanced, professionally supported [WebPageTest (WPT) API](https://product.webpagetest.org/api?utm_source=blog&utm_medium=post&utm_campaign=api&utm_content=launch), complete with new developer-focused integrations.

Previously, the WPT API was unsupported and keys were only available to a small number of users who had to test queues.

Now, our entire community of developers and performance investigators can automate testing from WPT’s global infrastructure (expanding through Catchpoint’s synthetic network) and integrate front-end performance metrics into their development workflow and optimization initiatives.

## **Scaling Performance Audits**

WebPageTest’s optimization grades, in-depth metrics, and visual comparisons have been invaluable to performance analysis for many years but have predominantly been done manually and on an ad hoc basis.

Automating WPT tests enables performance engineers to scale and enhance performance audits and investigations by testing multiple URLs, performing regression analysis, and creating visualizations.

There are several [community-built integrations](docs.webpagetest.org/api/integrations/#community-built-integrations.) that you can access today with an API key: 

* [WebPageTest Bulk Tester](https://github.com/andydavies/WPT-Bulk-Tester) (built by Andy Davies) uses Google Sheets to test multiple URLs using WebPageTest using configurable test settings.
* [AutoWebPerf](https://github.com/GoogleChromeLabs/AutoWebPerf) (built by the Google Chrome Team) provides a flexible and scalable framework for running web performance audits.
* [Request Map](https://requestmap.webperf.tools/) (built by Simon Hearne) lets you build a node map of all the requests on a page to identify what third-parties are on your site, where your transmitted bytes are coming from and how slow your domains are.

## **Integrating with CI/CD tools**

Pulling WPT tests into pull requests lets developers integrate performance budgets into their release processes.

We’ve built the following officially supported CI/CD integrations to bring performance into the development conversation and enable developers to continuously deliver faster web pages.

### **WebPageTest GitHub Action**

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1617683975/integrations-github-action_exx7mc.png)

WebPageTest's GitHub Action lets you automatically run tests against WebPageTest on code changes. You can set and enforce performance budgets and have performance data automatically added to your pull request to move the performance conversation directly into your existing development workflow.

Features:

* Automatically run WebPageTest against code changes
* Set and enforce budgets for any metric WebPageTest can surface (spoiler alert: there are a lot)
* Complete control over WebPageTest test settings (authentication, custom metrics, scripting, etc)
* Automatically create comments on new pull requests with key metrics, waterfall and more.

### **WebPageTest API Wrapper for NodeJS**

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1617684072/integration-api-wrapper_gsgnvb.png)

WebPageTest API Wrapper is an NPM package that wraps WebPageTest API for NodeJS as a module and a command-line tool. It provides some syntactic sugar over the raw API, enabling easier integration into your existing workflows, including built in polling for results, pingback support and more.

Features:

* Built in performance budget testing
* Convenient CLI to simplify integrating with your existing CI/CD tooling
* Polling and pingback functionality to make it easier to get test results as soon as tests are completed

We can’t wait to see the new integrations our community cooks up!

 Get started with the [WebPageTest API](https://product.webpagetest.org/api) and explore our [API Documentation](docs.webpagetest.org/api).