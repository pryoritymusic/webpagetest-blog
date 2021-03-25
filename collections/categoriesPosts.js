const config = require("../src/_data/config");

module.exports = (collection) => {
  const postList = require("./posts")(collection);
  const categoriesPosts = {};

  postList.forEach((post) => {
    if (!categoriesPosts[post.data.category]) {
      categoriesPosts[post.data.category] = [];
    }
    categoriesPosts[post.data.category].push(post);
  });

  return categoriesPosts;
};
