const config = require("../src/_data/config");

module.exports = (collection) => {
  const categoryList = require("./categories")(collection);
  const postList = require("./posts")(collection);

  const maxPostsPerPage = config.maxPostsPerPage;
  const pagedPosts = [];

  categoryList.forEach((category) => {
    const sortedPosts = postList.filter((post) => {
      return post.data.category === category.data.name;
    });

    const numberOfPages = Math.ceil(sortedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        category: category.data.name,
        number: pageNum,
        posts: sortedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages,
      });
    }
  });

  return pagedPosts;
};
