const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlMinTransform = require("./utils/transforms/htmlmin.js");
const markdownIt = require("markdown-it");
const contentParser = require("./utils/transforms/contentParser.js");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const util = require("util");
const readingTime = require("eleventy-plugin-reading-time");
const { findBySlug } = require('./utils/findBySlug');

/**
 * Import site configuration
 */
const pathConfig = require("./src/_data/paths.json");

module.exports = function (eleventyConfig) {
  /**
   * Removed renaming Passthrough file copy due to issues with incremental
   * https://github.com/11ty/eleventy/issues/1299
   */
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ static: "static" });
  eleventyConfig.addPassthroughCopy("src/admin");

  /**
   * Create custom data collections
   * for blog and feed
   * Code from https://github.com/hankchizljaw/hylia
   */
  eleventyConfig.addCollection("posts", require("./collections/posts"));
  eleventyConfig.addCollection(
    "categories",
    require("./collections/categories")
  );
  eleventyConfig.addCollection(
    "categoriesPaged",
    require("./collections/categoriesPaged")
  );
  eleventyConfig.addCollection("authors", require('./collections/authors'));
  eleventyConfig.addCollection("authorsPaged", require('./collections/authorsPaged'));
  eleventyConfig.addCollection("tagList", require('./collections/tagList'));
  eleventyConfig.addCollection("tagsPaged", require('./collections/tagsPaged'));
  eleventyConfig.addCollection("memoized", require('./collections/memoized'));

  eleventyConfig.addNunjucksFilter("limit", (arr, limit) =>
    arr.slice(0, limit)
  );

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  dayjs.extend(customParseFormat);

  eleventyConfig.addFilter("monthDayYear", function (date) {
    return dayjs(date).format("MMM. DD, YYYY");
  });
  // robot friendly date format for crawlers
  eleventyConfig.addFilter("htmlDate", function (date) {
    return dayjs(date).format();
  });

  eleventyConfig.addFilter("console", function (value) {
    return util.inspect(value);
  });

  eleventyConfig.addFilter('findBySlug', function (slug) {
    return findBySlug(slug);
  })


  const mdRender = new markdownIt({});
  eleventyConfig.addFilter("markdown", function (value) {
    return mdRender.render(value);
  });
  /**
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  if (process.env.ELEVENTY_ENV === "production") {
    // Minify HTML when building for production
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);
  }
  // Parse the page HTML content and perform some manipulation
  eleventyConfig.addTransform("contentParser", contentParser);

  /**
   * Add Plugins
   * @link https://github.com/11ty/eleventy-plugin-rss
   * @link https://github.com/11ty/eleventy-plugin-syntaxhighlight
   * @link https://github.com/okitavera/eleventy-plugin-pwa
   */
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlightPlugin);
  eleventyConfig.addPlugin(readingTime);

  /**
   * Cloudinary Shortcodes
   */
  eleventyConfig.cloudinaryCloudName = "nicchan";
  eleventyConfig.addShortcode("cloudinaryImage", function (
    path,
    alt,
    width,
    height,
    sizes,
    loading,
    className,
    transforms,
    attributes
  ) {
    const multipliers = [
      0.25,
      0.35,
      0.5,
      0.65,
      0.75,
      0.85,
      1,
      1.1,
      1.25,
      1.5,
      1.75,
      2,
    ];
    let srcSetArray = [];
    multipliers.forEach((multiplier) => {
      let currentWidth = Math.round(multiplier * width);
      srcSetArray.push(
        `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/upload/f_auto,q_auto,c_limit,w_${currentWidth}/${path} ${currentWidth}w`
      );
    });
    return `<img ${className ? 'class="' + className + '"' : ""}
        src="https://res.cloudinary.com/${
          eleventyConfig.cloudinaryCloudName
        }/image/upload/f_auto,q_auto,c_limit${
      transforms ? "," + transforms : ""
    }/${path}"
        srcset="${srcSetArray.join(", ")}"
        alt="${alt}"
        ${loading ? "loading='" + loading + "'" : ""}
        width="${width}"
        height="${height}"
        sizes="${sizes}"
        ${attributes ? attributes : ""}>`;
  });
  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: false,
    open: true,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        },
      },
    },
    // Set local server 404 fallback
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {
            "Content-Type": "text/html",
          });
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  /*
   * Disable use gitignore for avoiding ignoring of /bundle folder during watch
   * https://www.11ty.dev/docs/ignores/#opt-out-of-using-.gitignore
   */
  eleventyConfig.setUseGitIgnore(false);

  /**
   * Eleventy configuration object
   */
  return {
    dir: {
      input: pathConfig.src,
      includes: pathConfig.includes,
      layouts: `${pathConfig.includes}/layouts`,
      output: pathConfig.output,
    },
    passthroughFileCopy: true,
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
