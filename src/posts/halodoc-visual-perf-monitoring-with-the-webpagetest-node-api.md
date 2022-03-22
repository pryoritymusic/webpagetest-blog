---
title: "Halodoc: Staying Ahead of the Curve with Visual Perf Monitoring with
  WebPageTest API"
guest: true
date: 2022-03-22T16:44:52.724Z
featured_image: https://res.cloudinary.com/webpagetest/image/upload/v1647903963/Frame_1_1_dqtcfv.png
tags: []
category: Use Cases
author: Bivesh Kumar
related_post:
  post: the-webpagetest-api-has-gone-public
  highlight: "Want to integrate the API yourself? Check out our guide! "
---
WebPageTest would not be unfamiliar to you if you have ever tried exploring web performance. It’s an incredible open-source tool to measure web page performance. It is loaded with a growing list of configurable options and is available via multiple interfaces for its users including manual testing via the [website](https://www.webpagetest.org/), [CLI](https://github.com/WebPageTest/webpagetest-api#command-line-1), and the [WebPageTest API](https://github.com/WebPageTest/webpagetest-api) with a NodeJS wrapper. 

[Halodoc](https://www.halodoc.com) is a health-tech startup that simplifies healthcare access by connecting millions of patients with licensed doctors, insurance providers, labs, and pharmacies all on one platform. 

In this article, I will be mainly talking about how we at Halodoc have been using the WebPageTest API to build great user experiences that is powered by our culture of measuring and monitoring web performance. 

> Over the past four years, our monthly active users (MAU) have grown by around 100x. Performance quickly became very important for our user experience and competitiveness on the web.

We could go ahead and fix all the immediately identifiable performance-related issues, but that wouldn’t be enough on its own. With the next deployment, performance may deteriorate & we wouldn’t know unless we manually run the performance analysis again. 

## Automating & monitoring performance with Grafana and InfluxDB

In order to keep a constant eye on the Core Web Vitals & a few other important performance metrics, we built a web performance monitoring system using the WebPageTest API wrapper for NodeJS, Grafana & InfluxDB. With a quick and easy setup, we’re able to  run performance tests for around 45 pages on a daily basis and monitor their results via the Grafana dashboard.

![WebPageTest, Grafana, and InfluxDB Flow Chart](https://res.cloudinary.com/webpagetest/image/upload/v1647462978/Picture1_fd6dhm.png "Wide:")

Things have only improved since our first iteration with the WebPageTest API wrapper for NodeJS. For more details on how we did it, please check out [this article](https://blogs.halodoc.io/performance-monitoring-webapps/).

Last year, WebPageTest by Catchpoint [officially announced](https://blog.webpagetest.org/posts/the-webpagetest-api-has-gone-public/) the availability of the enhanced, professionally supported [WebPageTest API](https://docs.webpagetest.org/api/integrations/). They have dedicated staff and resources to ensure the platform is always up-to-date with the latest browser versions and metrics the WebPerf community needs. So if you are thinking of using it, be assured, it’s well supported.

## Automated vs manual testing

Depending on the requirements, one may opt for manual testing, or automate the process via API. 

> We needed to perform location-based testing for multiple pages at regular intervals, which would not be an easy thing to do with manual testing, as it would involve lots of time and resources on a regular basis. 

So, we went ahead and automated the whole process using:

* **WebPageTest node API** for triggering tests and fetching JSON-formatted results. The APIs are pretty straightforward to consume. 
* **InfluxDB** for storing the test results
* **Grafana** for visualizing  the performance metrics data by creating dashboards
* **Jenkins** for triggering the API at regular intervals

![Grafana display of Halodoc's key metrics, fetched via WebPageTest API](https://res.cloudinary.com/webpagetest/image/upload/v1647462977/Picture2_boxjd4.png "Wide:")

*Above: Grafana display of Halodoc's key metrics, fetched via WebPageTest API*

Some of the key benefits of automated testing:

* One time effort is needed to write the script & set up the system. Thereafter, no human intervention is needed to run the tests or to update the dashboard
* More tests can be done in a lesser amount of time
* Easy to visualize key metrics on the dashboard
* Easily scale to test and monitor any number of pages

***Why does it matter?***

> Good performance is an asset. Bad performance is a liability.

We all know what it feels like to wait for a web page to load. The traffic for a website can come from all around the globe, from different types of devices and visitors with different network speeds. So, it becomes important for an organization to understand how its website is performing for these different scenarios. For a user, it may just be an annoyingly slow website and they may go to a competitor who offers a similar product/service, but for an organization it’s a loss of revenue.

This is where WebPageTest can come in very handy. With the WebPageTest API, we can automate the performance tests for different types of ***real devices*** with ***different network speeds*** and ***different locations***.

***What’s next…?***

Web performance is important not only from a user experience point of view, but it also plays a significant role in SEO and contributes to organic traffic. In the past few years with our continuous monitoring, we have been easily able to catch performance degradation at the earliest. 

We are always looking out for something more which can help us in serving our customers in a better way. Currently, we are also looking into enabling alert notifications via Grafana and also parallelly exploring WebPageTest’s [Slack integration](https://github.com/WebPageTest/webpagetest-slack). Eagerly waiting to see what’s next in the WebPageTest pipeline as a tool.