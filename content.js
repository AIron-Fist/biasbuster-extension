console.log("Content script loaded");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "analyze") {
    const pageText = document.body.innerText.slice(0, 5000);

    chrome.runtime.sendMessage({ action: "analyze", text: pageText }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError.message);
        return;
      }

      chrome.runtime.sendMessage({ action: "popupResponse", result: response?.result || "", error: response?.error || "" });
    });
  }
});
