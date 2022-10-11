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

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "CREATE_SNIPPET") {
    const response = await fetch(`${API_URL}/snippets/twitter`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweetIds: msg.tweetIds }),
    });
    if (response.status === 201) {
      const { id } = await response.json();
      chrome.tabs.create({ url: `${APP_URL}/p/${id}` });
    } else {
      console.error(response.statusText);
    }
  }
});

export {};
