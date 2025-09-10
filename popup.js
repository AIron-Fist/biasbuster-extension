document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("analyze");
  const loadingDiv = document.getElementById("loading");
  const resultDiv = document.getElementById("result");

  button.addEventListener("click", () => {
    resultDiv.style.display = "none";
    resultDiv.innerHTML = "";
    loadingDiv.style.display = "block";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const article = document.querySelector("article") || document.querySelector("main") || document.body;
          const rawText = article.innerText;
          return rawText
            .split(/\n+/)
            .map(p => p.trim())
            .filter(p => p.length > 50)
            .slice(0, 10); // limit to 10 paragraphs
        }
      }, async (results) => {
        const paragraphs = results[0].result;
        resultDiv.style.display = "block";

        const status = await LanguageModel.availability();
        if (status !== "available") {
          loadingDiv.style.display = "none";
          resultDiv.textContent = "Model not available.";
          return;
        }

        const session = await LanguageModel.create({
          initialPrompts: [
            {
              role: "system",
              content: "You are a bias detection assistant. Read each paragraph and list any cognitive biases you notice. Format each bias as: Bias Name - Explanation"
            }
          ]
        });

        const tasks = paragraphs.map(async (para) => {
          try {
            const result = await session.prompt(para);
            const lines = result.split("\n").filter(line => line.includes(" - "));
            lines.forEach(line => {
              const [bias, explanation] = line.split(" - ");
              const block = document.createElement("div");
              block.style.marginBottom = "10px";
              block.innerHTML = `<strong>${bias.trim()}</strong>: ${explanation.trim()}`;
              resultDiv.appendChild(block);
            });
          } catch (err) {
            const errorBlock = document.createElement("div");
            errorBlock.style.color = "red";
            errorBlock.textContent = "Error: " + err.message;
            resultDiv.appendChild(errorBlock);
          }
        });

        await Promise.allSettled(tasks);
        loadingDiv.style.display = "none";
      });
    });
  });
});
