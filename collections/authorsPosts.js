const config = require("../src/_data/config");

module.exports = (collection) => {
  const authorList = require("./authors")(collection);
  const postList = require("./posts")(collection);

  const authorsPosts = [];

  authorList.forEach((author) => {
    const sortedPosts = postList.filter((post) => {
      return post.data.author === author.data.name;
    });

    authorsPosts.push({
      author: author,
      posts: sortedPosts,
    });
  });
  return authorsPosts;
};
