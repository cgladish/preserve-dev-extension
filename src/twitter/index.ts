import "./index.css";

type SelectedTweet = {
  id: string;
  authorUsername: string;
};

let firstSelectedTweet: SelectedTweet | undefined = undefined;
let lastSelectedTweet: SelectedTweet | undefined = undefined;

const getTweetInfo = (tweetElem: Element): SelectedTweet | undefined => {
  const link = Array.from(tweetElem.getElementsByTagName("a")).find((elem) =>
    elem.getAttribute("href")?.includes("/status/")
  );
  const splitInfo = link?.getAttribute("href")?.split("/status/");
  console.log(link);
  return (
    splitInfo && {
      authorUsername: splitInfo[0].slice(1),
      id: splitInfo[1],
    }
  );
};

const showSelectedTweets = () => {
  if (!firstSelectedTweet) {
    return;
  }
  const tweets = Array.from(document.querySelectorAll("[data-testid=tweet]"));
  const firstSelectedTweetIndex = tweets.findIndex((tweet) => {
    const tweetInfo = getTweetInfo(tweet);
    return (
      tweetInfo?.id === firstSelectedTweet?.id &&
      tweetInfo?.authorUsername === firstSelectedTweet?.authorUsername
    );
  });
  if (firstSelectedTweetIndex === -1) {
    return;
  }
  const lastSelectedTweetIndex =
    lastSelectedTweet &&
    tweets.findIndex((tweet) => {
      const tweetInfo = getTweetInfo(tweet);
      return (
        tweetInfo?.id === lastSelectedTweet?.id &&
        tweetInfo?.authorUsername === lastSelectedTweet?.authorUsername
      );
    });
  if (lastSelectedTweetIndex === -1) {
    return;
  }
  tweets.forEach((tweet, i) => {
    if (
      lastSelectedTweetIndex
        ? i >= firstSelectedTweetIndex && i <= lastSelectedTweetIndex
        : i === firstSelectedTweetIndex
    ) {
      tweet.parentElement?.classList.add("selected-tweet");
    } else {
      tweet.parentElement?.classList.remove("selected-tweet");
    }
  });
};

const observer = new MutationObserver(function (mutations) {
  const tweets = Array.from(document.querySelectorAll("[data-testid=tweet]"));
  tweets.forEach((tweet) => {
    if (
      tweet.parentElement &&
      !tweet.parentElement.getElementsByClassName(
        "create-snippet-btn-container"
      ).length
    ) {
      const buttonContainer = document.createElement("div");
      buttonContainer.setAttribute("class", "create-snippet-btn-container");
      tweet.parentElement.appendChild(buttonContainer);

      const button = document.createElement("button");
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#eee"><path d="M0 0h24v24H0z" fill="none"/><circle cx="6" cy="18" fill="none" r="2"/><circle cx="12" cy="12" fill="none" r=".5"/><circle cx="6" cy="6" fill="none" r="2"/><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg>`;

      const tweetInfo = getTweetInfo(tweet);
      button.onclick = () => {
        firstSelectedTweet = tweetInfo;
        showSelectedTweets();
      };

      buttonContainer.appendChild(button);
    }
  });
  showSelectedTweets();
});
observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true,
});

export {};
