module.exports = function (url) {
  if (url) {
    const expression = /(\/v(\d+)\/)(.+)/;
    if (expression.test(url) === false) return false;
    const urlArray = url.match(expression);
    return urlArray.pop();
  }
  return false;
};
