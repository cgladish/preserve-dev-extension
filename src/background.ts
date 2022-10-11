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
    console.log("HEY LISTEN", msg.tweets);
    chrome.tabs.create({ url: "https://www.google.com" });
  }
});

export {};
