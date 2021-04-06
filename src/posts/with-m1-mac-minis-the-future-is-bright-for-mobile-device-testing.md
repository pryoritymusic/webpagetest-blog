---
title: With M1 Mac Minis, The Future is Bright for Mobile Device Testing
date: 2021-01-28T21:59:17.447Z
featured_image: https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1617657017/M1_Mac_Mini_Cover_wkcaof.png
tags:
  - M1 Mac Mini
  - Mobile Testing
  - Safari
category: Product News
author: Tim Kadlec
related_post:
  post: automatic-webpagetest-results-for-every-docs-deploy
  highlight: New Article
---
[WebPageTest](http://webpagetest.org/?__hstc=176883706.5eff1ae379776f547a1ff32a0f148c10.1594067722813.1617227833988.1617656500180.435&__hssc=176883706.1.1617656500180&__hsfp=3146337546) tries to use real browsers and devices for testing whenever possible, but doing that at scale has some serious challenges, particularly when it comes to testing mobile browsers. There are a lot of different moving pieces, from the device itself to everything that needs to be in place for traffic shaping.

The phones themselves pose significant reliability challenges. Batteries tend to swell and become a fire hazard after a couple of years, SD cards wear out and USB connections become unstable. On top of that, each phone you’ve placed in a datacenter for testing must be manually updated whenever a new version of the operating system is released.

With all these issues, it’s no surprise that many testing platforms default to using Chrome to emulate different browsers.

While Chrome emulation can do things like resize the visual viewport and, more importantly, apply throttling to the network and CPU to simulate different powered devices, it’s still running Chrome under the hood, which means any differences in browser support or optimizations specific to a particular browser will not be reflected in testing.

For example, Chrome has taken a very granular approach to apply loading and network priorities to different resource types depending on how those resources are loaded. Safari and Firefox, on the other hand, each have very different strategies around resource prioritization, causing a very different loading experience from Chrome (and each other).

Chrome has a two-phase loading process that limits the number of body resources requested at a time until it has finished parsing the head of the document, while Safari and Firefox will send all requests as soon as they’re discovered. Notice how in the image below, Chrome’s waterfall (left) has a stair-step appearance with the resources in the head of the document are requested first, while Safari’s waterfall (below) shows each resource being requested around the same time, regardless of it lives in the head of the document or the body.

![](https://res.cloudinary.com/psaulitis/image/upload/c_fill,g_auto,h_250,w_970/b_rgb:000000,e_gradient_fade,y_-0.50/c_scale,co_rgb:ffffff,fl_relative,l_text:montserrat_25_style_light_align_center:Shop%20Now,w_0.5,y_0.18/f_auto,q_auto/v1617656580/M1_Waterfall_xomw6m.png)

These behaviors, as well as many other differences, mean that whenever we test performance on an emulated browser using a different browser engine, we’re not getting an accurate reflection of how other browsers perform. When we do all of our performance testing on one given browser engine, we risk creating a web performance monoculture.

Those of you with a keen eye may have noticed that the Dulles location on [WebPageTest.org](http://webpagetest.org/?__hstc=176883706.5eff1ae379776f547a1ff32a0f148c10.1594067722813.1617227833988.1617656500180.435&__hssc=176883706.1.1617656500180&__hsfp=3146337546) now offers up Mac Mini’s (with the new M1 chip) for testing, using the iOS simulator. Thanks to the new M1 chipset, these new devices are a bit of a game-changer when it comes to testing performance.

A lot has been made about the M1’s impressive impact on native performance, but for our purposes, what’s most appealing is that now the iPhone, iPad, and new Mac devices all run on the same Arm-based, Apple Silicon chips, bringing a common underlying architecture across the different device types.

There was still a lot of work that needed to happen to get the testing results to be as accurate as possible (watch for a post from Patrick Meenan about that in the near future), but the end result is that we can set up new M1 Minis in data centers and use the iOS simulator to enable us to test on different form factors without having to rely on browser emulation. Instead of running Chrome’s engine in the background, all of the tests get to use Safari, meaning different browser behaviors, and how they impact performance, are readily surfaced. The M1 Minis also avoid much of the problems we mentioned around deploying mobile devices to data centers:

* The operating system can be manually updated
* We don’t have to worry at all about SD cards failing
* We no longer have to worry about maintaining batteries
* A single Mac Mini can test the form factors of a wide variety of devices
* We avoid the issue with mobile devices becoming unreachable over USB altogether
* Traffic-shaping is self-contained to the Mac Mini, making it much simpler than on iPhones (which require a separate bridge and WiFi connectivity)

The most notable caveat here is that there are limitations in terms of the CPU accuracy for an M1 Mini and older iPhone and iPad devices. We used the Octane v2 CPU benchmark to run a series of 20 tests on an iPhone Pro Max 12 and an M1 Mac Mini that was deployed to the WebPageTest network. The median result for the iPhone was 57,491 compared to 60,063 for the Mac Mini. It’s not 100% identical, but it’s impressively close.

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1617656807/Octane_Scores_vl1rx9.png)

That being said, that gap does start to widen as you go back a few generations. Running Octane v2 on an iPhone 11 Pro, for example, returned a median score of 49,029. iPhone CPU’s have held a significant advantage over the alternatives for awhile now in terms of performance—just how much of the web is CPU-constrained on iPhones remains to be seen (and sounds like a darn good follow-up post).

Still, being able to quickly scale up M1 Minis to avoid browser emulation and instead make it easier to test on Safari is something we’re really excited about and an important step in ensuring when we test performance on the web, we really mean “on the web”, not on just a single browser engine.

The new devices are available at Dulles, VA, and Los Angeles, CA, with more locations coming soon.

![](https://res.cloudinary.com/psaulitis/image/upload/f_auto,q_auto/v1617656876/M1_Mini_ict7ft.gif)

Take them for a spin on [WebPageTest](http://www.webpagetest.org/?__hstc=176883706.5eff1ae379776f547a1ff32a0f148c10.1594067722813.1617227833988.1617656500180.435&__hssc=176883706.1.1617656500180&__hsfp=3146337546) and let us know what you find!
