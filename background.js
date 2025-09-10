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

        const cleanedText = msg.text
          .replace(/\s+/g, " ")
          .replace(/[^a-zA-Z0-9.,;:'"\s\-()]/g, "")
          .slice(0, 3000);


        const session = await LanguageModel.create({
          outputLanguage: "en",
          initialPrompts: [
            {
              role: "system",
              content: "Read this and list any cognitive biases you find. Use short labels and explanations."
            }
          ]
        });

        const result = await session.prompt('Input text:' + cleanedText);
        console.log("Model result:", result);

        if (!result || result.trim() === "") {
          console.warn("⚠️ Model returned empty result");
        }

        sendResponse({ result });
      } catch (err) {
        console.error("Model error:", err);
        sendResponse({ error: err.message });
      }
    })();

    return true;
  }
});
