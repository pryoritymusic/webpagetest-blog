const config = require("../src/_data/config");

module.exports = (collection) => {
  const authorList = require("./authors")(collection);

  return authorList.filter((author) => {
    return author.data.is_staff;
  });
};
