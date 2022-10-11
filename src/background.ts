chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        url: changeInfo.url,
      });
    } catch (err) {}
  }
});

export {};
