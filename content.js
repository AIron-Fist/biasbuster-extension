chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.action === "analyze") {
    const text = document.body.innerText;
    console.log("Analyzing text:", text);
    // Later: Send to Prompt API for bias detection
  }
});

async function checkModelAvailability() {
  const status = await LanguageModel.availability();
  console.log("Model status:", status);
  return status;
}

async function createSession() {
  const session = await LanguageModel.create({
    initialPrompts: [
      {
        role: "system",
        content: "You are a bias detection assistant. Identify cognitive biases in user text."
      }
    ]
  });
  return session;
}

async function analyzeBias(text) {
  const available = await checkModelAvailability();
  if (available === "available") {
    const session = await createSession();
    const result = await session.prompt(`Analyze this for cognitive bias: ${text}`);
    console.log("Bias analysis result:", result);
    alert(result);
  } else {
    alert("Model not available or still downloading.");
  }
}

// Trigger analysis when user clicks the extension button
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "analyze") {
    const pageText = document.body.innerText.slice(0, 5000); // Limit input size
    analyzeBias(pageText);
  }
});

