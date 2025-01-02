document.addEventListener("DOMContentLoaded", () => {
  const astarIframe = document.getElementById("astarFrame");
  const dfsIframe = document.getElementById("dfsFrame");
  const colsInput = document.getElementById("cols");
  const rowsInput = document.getElementById("rows");
  const updateButton = document.getElementById("updateGrid");

  // Function to send a message to the iframe
  function sendMessageToIframe(iframe, message) {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, "*");
    }
  }

  // Update grid size when the Update Grid button is clicked
  updateButton.addEventListener("click", () => {
    const cols = parseInt(colsInput.value, 10);
    const rows = parseInt(rowsInput.value, 10);

    sendMessageToIframe(astarIframe, { action: "updateGridSize", cols, rows });
    sendMessageToIframe(dfsIframe, { action: "updateGridSize", cols, rows });
  });

  // Listen for messages from iframe
  window.addEventListener("message", function (event) {
    const data = event.data;

    if (data.action === "updateSummary") {
      const summary = document.getElementById("summary");
      summary.value = ""; // Clear the textarea
      summary.value += data.text + "\n"; // Add the new message
    }
  });
});
