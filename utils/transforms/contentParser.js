const jsdom = require("@tbranyen/jsdom");
const { JSDOM } = jsdom;
const slugify = require("slugify");
const getPathFromUrl = require("../getPathFromUrl.js");
const config = require("../../src/_data/config.json");

function setClass(element, list) {
  if (list) {
    list.map((item) => element.classList.add(item));
  }
}

module.exports = function (value, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    /**
     * Create the document model
     */
    const DOM = new JSDOM(value);
    const document = DOM.window.document;

    /**
     * Get all the headings inside the post
     */
    const articleHeadings = [...document.querySelectorAll("article h2")];
    if (articleHeadings.length) {
      /**
       * Create an anchor element inside each post heading
       * to link to the section
       */
      articleHeadings.forEach((heading) => {
        // Create the anchor element
        const anchor = document.createElement("a");
        // Create the anchor slug
        const headingSlug = slugify(heading.textContent.toLowerCase());
        // Set the anchor href based on the generated slug
        anchor.setAttribute("href", `#${headingSlug}`);
        anchor.setAttribute("aria-describedby", `${headingSlug}`);
        // Add class and content to the anchor
        setClass(anchor, ["post__heading-anchor"]);
        anchor.innerHTML =
          "<span aria-hidden='true'>#</span><span class='screenreader'>anchor</span>";
        // Set the ID attribute with the slug
        heading.setAttribute("id", `${headingSlug}`);
        setClass(heading, ["post__heading--anchor"]);
        heading.prepend(anchor);
      });
    }

    /**
     * Get all the iframes inside the article
     * and wrap them inside a class
     */
    const articleEmbeds = [...document.querySelectorAll("main article iframe")];
    if (articleEmbeds.length) {
      articleEmbeds.forEach((embed) => {
        const wrapper = document.createElement("div");
        embed.setAttribute("loading", "lazy");
        wrapper.appendChild(embed.cloneNode(true));
        embed.replaceWith(wrapper);
      });
    }

    /**
     * Get all the images inside the article,
     * apply cloudinary transforms for perf,
     * optionally display as figure if caption provided via title attribute.
     */
    const images = [...document.querySelectorAll(".rte img")];
    if (images.length) {
      images.forEach((image) => {
        let src = image.getAttribute("src");
        const alt = image.getAttribute("alt");
        const path = getPathFromUrl(src);
        const multipliers = [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2];
        let rawTitle = image.getAttribute("title");
        let title = rawTitle ? rawTitle.replace("Wide:", "").trim() : null;
        let width = 640;
        let sizes = "(min-width: 44em) 40re,, 90vw";
        let className = "";

        // The image is wide!
        if (rawTitle && rawTitle.includes("Wide:")) {
          width = 900;
          sizes = "(min-width: 60em) 56.25rem, (min-width: 40em) 95vw, 90vw";
          className = "post__image--wide";
        }

        // Image is a cloudinary image, build this up, otherwise let this pass through untransformed
        let srcSetArray = [];
        if (path) {
          multipliers.forEach((multiplier) => {
            let currentWidth = Math.round(multiplier * width);
            srcSetArray.push(
              `https://res.cloudinary.com/${config.cloudinaryName}/image/upload/f_auto,q_auto,w_${currentWidth}/${path} ${currentWidth}w`
            );
          });
          src = `https://res.cloudinary.com/${config.cloudinaryName}/image/upload/f_auto,q_auto,w_${width}/${path}`;
        }
        let newImage = document.createElement("img");
        newImage.setAttribute("class", className);
        newImage.setAttribute("src", src);
        if (srcSetArray.length > 0) {
          newImage.setAttribute("srcset", srcSetArray.join(", "));
        }
        newImage.setAttribute("alt", alt);
        newImage.setAttribute("loading", "lazy");
        newImage.setAttribute("sizes", sizes);
        let markup = newImage;

        // Image has a caption, wrap in figure
        if (title) {
          let figure = document.createElement("figure");
          let figcaption = document.createElement("figcaption");
          figure.setAttribute("class", className);
          figcaption.innerHTML = title;
          figure.appendChild(newImage);
          figure.appendChild(figcaption);
          markup = figure;
        }

        image.parentNode.replaceWith(markup);
      });
    }

    return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
  }
  return value;
};
