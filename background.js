let session;

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "analyze") {
    if (typeof LanguageModel === "undefined") {
      console.error("LanguageModel API not available");
      sendResponse({ error: "LanguageModel API not available" });
      return;
    }

    const status = await LanguageModel.availability();
    console.log("Model status:", status);

    if (status !== "available") {
      sendResponse({ error: "Model not available yet" });
      return;
    }

    session = await LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: "You are a bias detection assistant. Identify cognitive biases in user text."
        }
      ]
    });

    const result = await session.prompt(`Analyze this for cognitive bias: ${msg.text}`);
    sendResponse({ result });
  }

  return true; // Keep the message channel open for async response
});
