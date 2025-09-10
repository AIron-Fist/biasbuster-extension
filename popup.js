document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("analyze");
  if (button) {
    button.addEventListener("click", () => {
      console.log("Analyze button clicked");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("Sending message to tab:", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
      });
    });
  } else {
    console.error("Button not found");
  }
});
