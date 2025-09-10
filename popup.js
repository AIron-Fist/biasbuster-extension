document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("analyze");
  const resultsDiv = document.getElementById("results");
  const biasTableBody = document.querySelector("#biasTable tbody");

  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
    });
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "popupResponse") {
      if (msg.error) {
        alert("Error: " + msg.error);
        return;
      }

      const biases = parseBiasResult(msg.result);
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
    }
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
