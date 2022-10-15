import retry from "async-retry";

let API_URL: string;
let APP_URL: string;
chrome.management.get(chrome.runtime.id, function (extensionInfo) {
  if (extensionInfo.installType === "development") {
    API_URL = "http://localhost:8000";
    APP_URL = "http://localhost:3000";
  } else {
    API_URL = "https://api.preserve.dev";
    APP_URL = "https://www.preserve.dev";
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        url: changeInfo.url,
      });
    } catch (err) {}
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CREATE_SNIPPET") {
    (async () => {
      try {
        const { id } = await retry(
          async () => {
            const response = await fetch(`${API_URL}/snippets/twitter`, {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tweetIds: msg.tweetIds }),
            });
            if (response.status !== 201) {
              throw new Error(response.statusText);
            }
            return await response.json();
          },
          { retries: 3 }
        );
        chrome.tabs.create({ url: `${APP_URL}/p/${id}` });
      } catch (err) {
        console.error(err);
      }
      sendResponse();
    })();
    return true;
  }
});

export {};
