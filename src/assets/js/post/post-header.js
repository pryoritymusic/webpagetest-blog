export function postHeader() {
  function init() {
    const postHeader = document.querySelector("[data-post-header]");
    if (
      postHeader &&
      window.matchMedia("(min-height: 42em)").matches &&
      "IntersectionObserver" in window &&
      window.requestAnimationFrame
    ) {
      const observer = new IntersectionObserver(
        function (entries) {
          if (entries[0].intersectionRatio === 0) {
            postHeader.setAttribute("aria-hidden", true);
          } else if (entries[0].intersectionRatio > 0) {
            postHeader.removeAttribute("aria-hidden");
          }
        },
        { rootMargin: "0px 0px -600px 0px" }
      );

      observer.observe(document.querySelector("[data-post-layout]"));
    }
  }
  init();
}
