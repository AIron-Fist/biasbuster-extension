chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "analyze") {
    const pageText = document.body.innerText.slice(0, 5000);

    chrome.runtime.sendMessage({ action: "analyze", text: pageText }, (response) => {
      if (response.error) {
        alert("Error: " + response.error);
      } else {
        alert("Bias analysis result:\n" + response.result);
      }
    });
  }
});
