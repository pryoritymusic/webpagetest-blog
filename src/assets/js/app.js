import { postHeader } from "./post/post-header";
import { signup } from "./global/signup";

document.addEventListener(
  "DOMContentLoaded",
  function () {
    signup();
    postHeader();
  },
  false
);
