---
title: Announcing Official Support the WebPageTest API Wrapper for NodeJS
guest: false
date: 2021-08-12T17:51:05.461Z
description: We're super excited to announce that as of today, WebPageTest is
  officially supporting and maintaining the WebPageTest API Wrapper for NodeJS.
featured_image: https://res.cloudinary.com/webpagetest/image/upload/v1628791766/npm-wrapper-hero_kmt537.png
tags:
  - API
  - NodeJS
category: Product News
author: Tim Kadlec
related_post:
  post: vscode
---
We're super excited to announce that as of today, WebPageTest is officially supporting and maintaining the [WebPageTest API Wrapper for NodeJS](https://www.npmjs.com/package/webpagetest).

I remember reading about the wrapper when [Marcel Duran](https://github.com/marcelduran) announced it [back in 2012 as part of the Web Performance Advent Calendar](https://calendar.perfplanet.com/2012/xmas-gift-webpagetest-api-swiss-army-knife/) (an annual highlight in my RSS feeds every December), but I don't remember doing anything with it until two years later, when I built a little Grunt plugin to enforce performance budgets. I think by that time it had already become the primary way that folks interacted with the API.

And it's stayed that way. The NodeJS wrapper has been downloaded over 1.5 million times. It's what drives the integrations our own team has building (like the [Slack Bot](https://github.com/WebPageTest/webpagetest-slack), the [GitHub Action](https://github.com/WPO-Foundation/webpagetest-github-action), and the [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=WebPageTest.wpt-vscode-extension)), and it's what powers so many of the great [community-built integrations](https://docs.webpagetest.org/api/integrations/#community-built-integrations) as well.

It also exposes a CLI that is how people primarily integrate WebPageTest with build systems like Travis CI and Jenkins.

All this time, Marcel has been maintaining this on his own. Naturally, we started helping out, providing "unofficial official" support. Now, thanks to Marcel's help, the [source lives under the WebPageTest GitHub organization](https://github.com/WebPageTest/webpagetest-api/releases/tag/v0.5.0), making it much easier for our growing team here to actively stay on top of issues, provide new features, and put out new releases.

Speaking of which, we put out a [new version of the wrapper](https://github.com/WebPageTest/webpagetest-api/releases/tag/v0.5.0) this morning. The new version addresses a few lingering bugs an also adds 12 parameters for the API that had been missing from the wrapper itself.

We'll be working through the issues to clean up other outstanding bugs, getting on a regular release cycle, and we've also got a few ideas for things we would like to add to the wrapper. If you have any issues our suggestions, please [file an issue so we can plan accordingly](https://github.com/WebPageTest/webpagetest-api/issues/new).

And, as always, if you use the API to build anything, [let us know](https://twitter.com/realwebpagetest)! We're always excited to see what you all are building, and how we can help you out along the way.