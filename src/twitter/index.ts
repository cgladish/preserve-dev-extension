import "./index.css";

const body = document.getElementsByTagName("body")[0];

const button = document.createElement("button");
button.setAttribute("class", "create-snippet-btn");
button.innerText = "Create Snippet";

body?.appendChild(button);

const observer = new MutationObserver(function (mutations) {
  const tweets = Array.from(document.querySelectorAll("[data-testid=tweet]"));
  tweets.forEach((tweet) => {});
});
observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true,
});

export {};
