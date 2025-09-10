document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("analyze");
  const resultsDiv = document.getElementById("results");
  const biasTableBody = document.querySelector("#biasTable tbody");

  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => document.body.innerText.slice(0, 5000)
      }, async (results) => {
        const pageText = results[0].result;

        chrome.runtime.sendMessage({ action: "analyze", text: pageText }, (response) => {
          if (chrome.runtime.lastError) {
            alert("Error: " + chrome.runtime.lastError.message);
            return;
          }

          if (!response || response.error) {
            alert("Error: " + (response?.error || "No response received"));
            return;
          }

          const biases = parseBiasResult(response.result);
          biasTableBody.innerHTML = "";

          biases.forEach(({ bias, evaluation, comment }) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${bias}</td>
              <td>${evaluation}</td>
              <td>${comment}</td>
            `;
            biasTableBody.appendChild(row);
          });

          resultsDiv.style.display = "block";
        });
      });
    });
  });

  function parseBiasResult(text) {
    const lines = text.split("\n").filter(line => line.trim());
    const biases = [];

    lines.forEach(line => {
      const parts = line.split(" - ");
      if (parts.length === 3) {
        biases.push({
          bias: parts[0].trim(),
          evaluation: parts[1].trim(),
          comment: parts[2].trim()
        });
      }
    });

    return biases;
  }
});
