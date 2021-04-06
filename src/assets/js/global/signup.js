export function signup() {
  function init() {
    const forms = document.querySelectorAll("[data-signup]");
    forms.forEach((form) => {
      form.addEventListener("submit", handleSubmit);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        const hide = form.querySelector("[data-form-hide]");
        const message = form.querySelector("[data-signup-message]");
        if (hide) hide.setAttribute("aria-hidden", true);
        message.innerText = message.getAttribute("data-success");
        message.removeAttribute("data-hidden");
        setTimeout(() => {
          message.focus();
        }, 0);
      })
      .catch((error) => console.log(error));
  }
  init();
}
