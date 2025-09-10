chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "analyze") {
    (async () => {
      try {
        const status = await LanguageModel.availability();
        console.log("Model status:", status);

        if (status !== "available") {
          sendResponse({ error: "Model not available yet" });
          return;
        }

        const session = await LanguageModel.create({
          initialPrompts: [
            {
              role: "system",
              content: "You are a bias detection assistant. Identify cognitive biases in user text. Format each result as: Bias - Evaluation - Comment"
            }
          ]
        });

        const result = await session.prompt(`Analyze this for cognitive bias: ${msg.text}`);
        console.log("Model result:", result);
        sendResponse({ result });
      } catch (err) {
        console.error("Model error:", err);
        sendResponse({ error: err.message });
      }
    })();

    return true;
  }
});
