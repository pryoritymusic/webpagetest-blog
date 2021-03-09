const config = require("../src/_data/config");
const pathConfig = require("../src/_data/paths.json");

module.exports = (collection) => {
  const categoryList = require("./categories")(collection);
  const postList = require("./posts")(collection);

  const maxPostsPerPage = config.maxPostsPerPage;
  const pagedPosts = [];

  categoryList.forEach((category) => {
    const categorizedPosts = postList.filter((post) => {
      return post.data.category === category.data.name;
    });

    const numberOfPages = Math.ceil(categorizedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        category: category.data.name,
        number: pageNum,
        posts: categorizedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages,
      });
    }
  });

  return pagedPosts;
};
