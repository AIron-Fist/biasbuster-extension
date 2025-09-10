chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.action === "analyze") {
    const text = document.body.innerText;
    console.log("Analyzing text:", text);
    // Later: Send to Prompt API for bias detection
  }
});
