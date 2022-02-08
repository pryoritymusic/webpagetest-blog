---
title: A Backstage Tour of WebPageTest's New UI
guest: false
date: 2022-02-08T17:53:29.061Z
description: A tour of the goals and design decisions behind WebPageTest's new UI.
featured_image: ""
category: How We Built It
author: Scott Jehl
related_post:
  post: unveiling-the-new-wpt-ui
---
It's been a little over a week since we [introduced WebPageTest's new redesigned and reorganized UI](https://blog.webpagetest.org/posts/unveiling-the-new-wpt-ui/), and we've been thrilled with the warm reception from our community. In particular, we have greatly appreciated all who have offered considerate feedback, as some of that feedback has *already* made its way into improving the product! 

While in many ways, this release is just another refinement in our ongoing product iteration, it also involved some relatively *big* changes. In fact, enough has changed around here that perhaps it's helpful to first acknowledge what *has not*: **our content, features, and functionality.**

Still, things do *look* a bit different! So in this post, I'll aim to detail many of the goals and design decisions behind what's changed, and even share a little about where we're headed next. If you're a longtime WebPageTest user, we hope this post reorients you to your favorite features, and if you're new here, welcome aboard! 

## A Power tool, for everyone

WebPageTest is a long-lived (*and loved!*) power tool with a complex set of features that have provided accurate and credible performance data to users around the world and to businesses of all shapes and sizes. Through its years of innovation and iteration, WebPageTest has built a knowledgeable and generous community around its toolset, and many of the most respected voices in web performance use and endorse our product. 

Being WebPageTest users ourselves, our team is keenly aware that supporting our existing users *well* requires keeping WebPageTest's powerful features at close reach. But we're also aware that as a power tool, WebPageTest could be a little intimidating to folks encountering it for the first time.

With some big, exciting additions planned for the coming season, we wanted to first reevaluate the organization, information density, and reach of our existing features, knowing that it would also better set us up for what's to come. 

## It starts at home

Take our (now former) homepage design for example, which offered an invitation to enter a URL and start an advanced test. 

![screenshot of old wpt homepage](https://res.cloudinary.com/webpagetest/image/upload/v1644332106/ui-tour/152834181-1c6526f3-782b-455c-904f-3def66fac921_bnti45.png "Wide:")

For folks who already knew *why* they're on our site and *what* that form will do, that alone was enough to get to work, and we don't want to get in their way! But our team wants to reach folks who aren't yet familiar with the benefits of WebPageTest too.  From designers to content strategists to marketers to executives, many members of an organization make decisions that directly impact the performance of their services, and we want WebPageTest to help inform and empower anyone who is curious about their product's performance bottlenecks and opportunities.

Further, while being able to do technical work *right* from the homepage like this is neat, it's also unusual. Often, powerful tools like ours are surrounded by introductory content to help orient and set expectations for newcomers. When you first visit Netlify or Figma for example, you're still a few steps from actually *doing* any work, and those steps can be very helpful. While we didn't want to add *unnecessary* steps, we did want to consider ways to make what we have already more explanatory and inclusive.

## Home improvements

![screenshot of new wpt homepage](https://res.cloudinary.com/webpagetest/image/upload/v1644332107/ui-tour/152810210-b699f5fd-00bf-4338-8852-b90aa0ba4d71_n2vq2v.png "Wide:")

Our refreshed homepage above is our first attempt to satisfy these goals. To start, we've introduced content to briefly explain what WebPageTest does, as well as a screenshot of our results page to set expectations around what will happen if you hit that start button. From a design perspective, we also brought in a new complementary color to draw interest and expand our existing palette just a bit.

![screenshot of top section of homepage. "Test optimize repeat!"](https://res.cloudinary.com/webpagetest/image/upload/v1644332107/ui-tour/152851943-09310b39-a9a7-49f0-a1ae-d957197996e8_zdzdkk.png "Wide:")

In addition, we wanted to make our test categories more inviting. This started with converting our tabbed navigation into a more "conversational" menu to introduce the kinds of tests we offer:

**Before:**

![screenshot of prior homepage tabs](https://res.cloudinary.com/webpagetest/image/upload/v1644332106/ui-tour/152852601-4281c9a8-a239-4632-9759-1923b17c3084_kwtzms.png "Wide:")

**After:**

![screenshot of new homepage menu navigation](https://res.cloudinary.com/webpagetest/image/upload/v1644332105/ui-tour/152810461-058ce6d7-6be3-4e81-b8dd-d701189e06c0_bdomul.png)

In a similar aim, we made our "Simple Testing" configuration the new default. This gives us a place to suggest presets for several common and interesting combinations: 

![screenshot of homepage radio preset options](https://res.cloudinary.com/webpagetest/image/upload/v1644332106/ui-tour/152810637-0fbb176a-7ee3-4a01-9484-1a0fd11a4b7a_qbmuux.png "Wide:")

This also allows us to highlight one of WebPageTest's most unique advantages: its diverse testing environments! New users will quickly see that you can use WebPageTest to see how your page performs not *just* in Chrome in the USA, but perhaps also in India on a mobile device running Chrome browser with a 3G connection, or in Germany on Firefox, or in Edge from Toronto! Given our mission of broadening access through better performance, we're very proud to highlight and encourage these options prominently.

These are just some initial defaults, but the advanced settings we've had all along are still right at your fingertips, just beneath the defaults in the advanced settings section. 

![homepage advanced settings screenshot](https://res.cloudinary.com/webpagetest/image/upload/v1644332106/ui-tour/152810749-579fc423-b3e5-462b-8e23-40d56ca3cafd_sqbj55.png)

For example, using the example of locations above, the Advanced Configuration section allows you to select from over 30 locations worldwide, including mainland China, or the Brave browser.

## Results-Driven

The goals of this UI refresh were much more than just a homepage rethink... in fact, the initial driver for this project was to  improve the user experience of the *results* you receive after you run a test. 

As you may recall, up until a week ago, the results page looked like this:

![screenshot of old results page](https://res.cloudinary.com/webpagetest/image/upload/v1644332107/ui-tour/152872690-ed63793a-05f7-4127-843f-132bdd38833a_ilq1yf.png)

That same test result in the site today now looks like this:

![screenshot of new results page](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152872818-5f5f69d7-2401-44a3-b3fc-0d66a5c14db1_fmav5s.png "Wide:")

Again, all of the information you expect in a WebPageTest result is still here, but a lot of it does *look* different, and we've also moved some things around in an effort to better present our findings to professionals and newcomers alike. 

## Head-first!

All test result pages now share a common header containing the important information about the test that was run, such as the URL, the date, the browser, the device category or test name, the testing environment, and customizations that were made. 

![screenshot of new results page header bar](https://res.cloudinary.com/webpagetest/image/upload/v1644332106/ui-tour/152855424-0e8fa718-5d4d-4b5c-85ab-7f38fee178e9_hydhch.png "Wide:")

In that strip of meta data, you can find many details about the test, including some pieces of information that were formerly found in other parts of the results pages. For example, if was a scripted test, or a test using custom metrics, you'll find all of that here:

![](https://res.cloudinary.com/webpagetest/image/upload/v1644340821/ui-tour/152595764-53ba6f05-e6bf-4ca6-bb1a-1891cf4b58f0_uflabi.png)

We also added a screenshot from the test run you're viewing, which will of course show how the site looks at the viewport dimensions of the device you tested. For example, a mobile run will be portrait style:

![screenshot of the header with a nytimes mobile test](https://res.cloudinary.com/webpagetest/image/upload/v1644332107/ui-tour/152871104-bc6ed35c-0058-4555-b20b-b23b0368d2da_xen4my.png "Wide:")

Lastly in the header, we've changed the result pages' navigation to use a menu instead of the long list of horizontal tabs. This was done mostly to play more nicely across different screen sizes, but it should be a little easier to parse as a list as well. New in this menu, you'll find links to external services that are tied to your test, such as Lighthouse, Image Analysis, Security Score, What Does My Site Cost, and RequestMap!

![screenshot of results page nav menu](https://res.cloudinary.com/webpagetest/image/upload/v1644332107/ui-tour/152857425-348129ff-7c9d-4808-8519-91829b524220_emy3r8.png)

## Pages, explained

Atop the content of each results page, and on some more than others, you'll now see a little information about the contents you should expect to find on that page. For example, the Results Summary page sets up what you should (and should not) expect to see in its metrics tables, depending on your test environment. Some browsers won't expose Core Web Vital metrics like LCP, so when you test in those browsers, you won't see those metrics. 


![screenshot of summary paragraphs at the top of each result page](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152877045-bfa8d883-a3ab-40ec-9842-e034bb42b5d0_qrvzjp.png "Wide:")

Just like it says in the page, we encourage testing in many environments to broaden your understanding of your site's actual resilience! 

## Some Grades, downgraded

One of the bigger *moves* we made in this redesign had to do with the letter grades that used to live on the summary page. These grades are still useful, but they've long been presented as a more comprehensive "score" than we felt was accurate, per a test's results. For example, since these grades dealt with mostly delivery optimizations, a site that took ages to be visually usable could sometimes still get all A's. Beyond that misleading presentation, these grades served as deep-links to sections of another results page that listed file optimizations, now called the Optimization page. We decided to move the grades to the top of that page where they can continue in that role, and let our results metrics take center stage on the results summary.

![screenshot of grades, now in the optimization page](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152875750-b4d1a834-da2c-4e63-b5a5-8f23d4ef659f_gaozt0.png "Wide:")

## A new metric system

Our metrics tables do a *lot* of work, such as highlighting multiple steps, runs, and even repeat views, so we didn't change their underlying markup *very much*. That said, we did update their typography to better highlight the metrics we feel matter  most, and we deprecated some metrics that are less important than others (document-complete metrics for example), but you can still find them in subsequent pages. as for the colors, web vitals metric results that are rated poor, okay, or good are now shown in corresponding colored text.

![screenshot of metrics numbers](https://res.cloudinary.com/webpagetest/image/upload/v1644332106/ui-tour/152856797-6751d50d-787b-4b3b-af9c-be8841210bf4_eoa4n3.png "Wide:")

## Filmstrips front and center!

Some of the most interesting and useful features in WebPageTest have long been relatively hard to discover, unless you already know where to look. Filmstrips in particular are one of those features, so now each run (or step) in the summary has a filmstrip paired with it as well.

![screenshot of metrics with filmstrips beneath them](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152873185-9a214bc3-6bb5-409d-bc0a-f41f92d0a69d_tty2kq.png "Wide:")

Those filmstrips are linked to the filmstrip comparison page, and in multi-run tests, you'll also find links to compare and plot your runs:

![Buttons for comparing runs in filmstrip view](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152887243-d3226c74-b3c3-45b0-960c-38a100819d0c_payyer.png)

## Speaking of filmstrips...

While we mention it, the filmstrip page itself became a first-class results template in this redesign. That means you can find a link to the filmstrips page in the results menu of any test, and it also includes the new common test header when you're viewing runs from the same test

![screenshot of a filmstrip comparison with runs of a wikipedia test](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152873971-e0b44edc-6986-4c40-87fa-cac5329a7a84_qbyvuc.png "Wide:")

This also really helps navigate *away* from a filmstrip to other results pages in a test. However, if you are using the filmstrip comparison page to compare runs from *different* tests, the header will drop away, since the sites no longer share test conditions. In those cases, you can still access their tests via links in each filmstrip row:

![screenshot of a link in the filmstrips to return to a test run](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152887107-523a4db7-934e-4827-9a90-3e5a18a43222_mtvlve.png)

## More details on the details... page

The details page has always been the place to see a particular run's results, but until this redesign, it didn't offer any way to switch to other runs' details. To address this, the details page now has a link list for all of your runs and repeat views, when applicable. Also, the details page metrics table has more, well, numbers than the summary page, so you can find additional metrics and custom metrics there!

![screenshot of the details page with many more metrics to display](https://res.cloudinary.com/webpagetest/image/upload/v1644332108/ui-tour/152874815-df1c3e6e-b848-41be-b231-4a8251b0baf5_r0j0p5.png "Wide:")

## Vitals, revitalized

While much has changed, many of the results pages' content didn't change much at all. That said, most of them got at least a minor typography retouch. Take the Core Web Vitals page, for example.

![screenshot of large core web vitals numbers](https://res.cloudinary.com/webpagetest/image/upload/v1644332107/ui-tour/152875343-a8deb2fe-a09d-46bb-ab36-a1a8e11518b0_i2fu0j.png "Wide:")

## Mobile flow

One last note on the designs is that all of these views were retouched with an eye towards improving our usability across screen sizes, particularly smaller ones. Last fall, we released a mobile-friendly update that allowed our pages to be usable on small screens for the first time, and with this update we've continued to prioritize that.

One helpful details you may see on smaller screens that I'm particularly fond of happens when very-wide features such as our filmstrips and metrics tables become wider than the available screen size, they will scroll internally. This scrolling isn't entirely new, but we did add some affordance to show when there's more to see, shown with these shadows below:

![screenshot of overflow areas with shadow affordance](https://res.cloudinary.com/webpagetest/image/upload/v1644332109/ui-tour/152879265-b861cbcd-7aa3-419d-a21f-9e84a85a0822_z7iazg.png)

## Looking Ahead...

In the near future, our goals for the site design are to continue to find ways to improve the reach and power of our product by making the UI more intuitive, descriptive, and nuanced. We've got some really exciting stuff coming soon that we think will make WebPageTest more useful to you than ever before, and we're real happy to have an improved place for hosting them when they arrive!

## Feedback, bugs, etc!

Thanks for reading along. As always, if you have feedback on features or bugs, [the best place to reach us is our issue tracker](https://github.com/WPO-Foundation/webpagetest/issues), where we'll have room to discuss changes and track progress as well.