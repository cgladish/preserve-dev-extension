import "./index.css";

type SelectedTweet = {
  id: string;
  authorUsername: string;
};

let prevFirstSelectedTweetIndex: number | undefined = undefined;
let firstSelectedTweet: SelectedTweet | undefined = undefined;

let prevLastSelectedTweetIndex: number | undefined = undefined;
let lastSelectedTweet: SelectedTweet | undefined = undefined;

const allSelectedTweets: { [id: string]: SelectedTweet } = {};

let snippetConfirmCancel: Element | undefined = undefined;

const getTweetInfo = (tweetElem: Element): SelectedTweet | undefined => {
  const link = Array.from(tweetElem.getElementsByTagName("a")).find((elem) =>
    elem.getAttribute("href")?.includes("/status/")
  );
  const splitInfo = link?.getAttribute("href")?.split("/status/");
  return (
    splitInfo && {
      authorUsername: splitInfo[0].slice(1),
      id: splitInfo[1],
    }
  );
};

const svgRemove =
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 48 48"><path d="M10 25.5v-3h28v3Z"/></svg>';
const svgAdd =
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 48 48"><path d="M22.5 38V25.5H10v-3h12.5V10h3v12.5H38v3H25.5V38Z"/></svg>';
const addChangeSelectionButtons = (
  tweetElem: Element,
  first: boolean,
  showUpButton: boolean,
  showDownButton: boolean,
  onClickUp: () => void,
  onClickDown: () => void
): void => {
  const containerClass = first
    ? "change-snippet-selection-container-first"
    : "change-snippet-selection-container-last";
  const selectedButtonContainer = document.createElement("div");
  selectedButtonContainer.setAttribute(
    "class",
    `change-snippet-selection-container ${containerClass}`
  );
  tweetElem.parentElement?.appendChild(selectedButtonContainer);

  if (showUpButton) {
    const button = document.createElement("button");
    button.setAttribute("class", "change-snippet-selection-button-up");
    button.innerHTML = first ? svgAdd : svgRemove;
    button.onclick = () => {
      onClickUp();
      rerender();
    };
    selectedButtonContainer.appendChild(button);
  }
  if (showDownButton) {
    const button = document.createElement("button");
    button.setAttribute("class", "change-snippet-selection-button-down");
    button.innerHTML = first ? svgRemove : svgAdd;
    button.onclick = () => {
      onClickDown();
      rerender();
    };
    selectedButtonContainer.appendChild(button);
  }
};

const rerender = () => {
  const tweets = Array.from(document.querySelectorAll("[data-testid=tweet]"));
  const firstSelectedTweetIndex = tweets.findIndex((tweet) => {
    const tweetInfo = getTweetInfo(tweet);
    return tweetInfo?.id === firstSelectedTweet?.id;
  });
  const lastSelectedTweetIndex = tweets.findIndex((tweet) => {
    const tweetInfo = getTweetInfo(tweet);
    return tweetInfo?.id === lastSelectedTweet?.id;
  });
  if (
    prevFirstSelectedTweetIndex !== firstSelectedTweetIndex ||
    prevLastSelectedTweetIndex !== lastSelectedTweetIndex
  ) {
    tweets.forEach((tweet) => {
      if (tweet.parentElement) {
        Array.from(
          tweet.parentElement.getElementsByClassName(
            "change-snippet-selection-container"
          )
        ).forEach((buttonContainer) => buttonContainer.remove());
      }
    });
  }
  prevFirstSelectedTweetIndex = firstSelectedTweetIndex;
  prevLastSelectedTweetIndex = lastSelectedTweetIndex;

  if (!firstSelectedTweet || !lastSelectedTweet) {
    snippetConfirmCancel?.remove();
    snippetConfirmCancel = undefined;
    tweets.forEach((tweet) => {
      if (tweet.parentElement) {
        tweet.parentElement.classList.remove("selected-tweet");
        if (
          !tweet.parentElement?.getElementsByClassName(
            "create-snippet-btn-container"
          ).length
        ) {
          const buttonContainer = document.createElement("div");
          buttonContainer.setAttribute("class", "create-snippet-btn-container");
          tweet.parentElement?.appendChild(buttonContainer);

          const button = document.createElement("button");
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#eee"><path d="M0 0h24v24H0z" fill="none"/><circle cx="6" cy="18" fill="none" r="2"/><circle cx="12" cy="12" fill="none" r=".5"/><circle cx="6" cy="6" fill="none" r="2"/><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg>`;

          const tweetInfo = getTweetInfo(tweet);
          button.onclick = () => {
            firstSelectedTweet = tweetInfo;
            lastSelectedTweet = tweetInfo;
            rerender();
          };

          buttonContainer.appendChild(button);
        }
      }
    });
  } else {
    if (!snippetConfirmCancel) {
      snippetConfirmCancel = document.createElement("div");
      snippetConfirmCancel.setAttribute("class", "snippet-confirm-cancel");

      const confirmButton = document.createElement("button");
      confirmButton.setAttribute("class", "snippet-confirm-button");
      confirmButton.innerHTML = "PRESERVE IT!";
      snippetConfirmCancel.appendChild(confirmButton);

      const cancelButton = document.createElement("button");
      cancelButton.setAttribute("class", "snippet-cancel-button");
      cancelButton.innerHTML = "CANCEL";
      cancelButton.onclick = () => {
        firstSelectedTweet = undefined;
        lastSelectedTweet = undefined;
        rerender();
      };
      snippetConfirmCancel.appendChild(cancelButton);

      const bodyElem = document.getElementsByTagName("body")[0];
      bodyElem?.appendChild(snippetConfirmCancel);
    }
    tweets.forEach((tweet, i) => {
      if (tweet.parentElement) {
        const buttonContainerElem = tweet.parentElement.getElementsByClassName(
          "create-snippet-btn-container"
        )[0];
        if (buttonContainerElem) {
          buttonContainerElem.remove();
        }
        const tweetInfo = getTweetInfo(tweet);
        if (
          (i >= firstSelectedTweetIndex ||
            (firstSelectedTweetIndex === -1 &&
              lastSelectedTweetIndex !== -1)) &&
          (i <= lastSelectedTweetIndex ||
            (lastSelectedTweetIndex === -1 && firstSelectedTweetIndex !== -1))
        ) {
          tweet.parentElement.classList.add("selected-tweet");
          if (tweetInfo) {
            allSelectedTweets[tweetInfo.id] = tweetInfo;
          }
        } else {
          tweet.parentElement.classList.remove("selected-tweet");
          if (tweetInfo) {
            delete allSelectedTweets[tweetInfo.id];
          }
        }
      }
    });

    console.log(allSelectedTweets);

    if (
      firstSelectedTweetIndex !== -1 &&
      !tweets[firstSelectedTweetIndex].parentElement?.getElementsByClassName(
        "change-snippet-selection-container-first"
      ).length
    ) {
      addChangeSelectionButtons(
        tweets[firstSelectedTweetIndex],
        true,
        firstSelectedTweetIndex > 0,
        firstSelectedTweetIndex < lastSelectedTweetIndex,
        () => {
          firstSelectedTweet = getTweetInfo(
            tweets[firstSelectedTweetIndex - 1]
          );
        },
        () => {
          firstSelectedTweet = getTweetInfo(
            tweets[firstSelectedTweetIndex + 1]
          );
        }
      );
    }
    if (
      lastSelectedTweetIndex !== -1 &&
      !tweets[lastSelectedTweetIndex].parentElement?.getElementsByClassName(
        "change-snippet-selection-container-last"
      ).length
    ) {
      addChangeSelectionButtons(
        tweets[lastSelectedTweetIndex],
        false,
        lastSelectedTweetIndex > firstSelectedTweetIndex,
        lastSelectedTweetIndex < tweets.length - 1,
        () => {
          lastSelectedTweet = getTweetInfo(tweets[lastSelectedTweetIndex - 1]);
        },
        () => {
          lastSelectedTweet = getTweetInfo(tweets[lastSelectedTweetIndex + 1]);
        }
      );
    }
  }
};

const observer = new MutationObserver(() => rerender());
observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true,
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.url) {
    firstSelectedTweet = undefined;
    lastSelectedTweet = undefined;
    rerender();
  }
});

export {};
