module.exports = function (url) {
  const expression = /(\/v(\d+)\/)(.+)/;
  const urlArray = url.match(expression);
  return urlArray.pop();
};
