module.exports = function (url) {
  if (url) {
    const expression = /(\/v(\d+)\/)(.+)/;
    const urlArray = url.match(expression);
    return urlArray.pop();
  }
  return "";
};
