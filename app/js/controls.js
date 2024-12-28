document.addEventListener("DOMContentLoaded", () => {
  const astarIframe = document.getElementById("astarFrame"); // Correct ID
  const dfsIframe = document.getElementById("dfsFrame"); // Correct ID

  const colsInput = document.getElementById("cols");
  const rowsInput = document.getElementById("rows");
  const updateButton = document.getElementById("updateGrid");
  const diagonalToggle = document.getElementById("diagonalToggle");

  // Set default state for diagonal toggle
  const allowDiagonalDefault = false; // Ensure diagonal is off by default
  diagonalToggle.checked = allowDiagonalDefault;

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

  // Toggle diagonal movement
  diagonalToggle.addEventListener("change", () => {
    const allowDiagonal = diagonalToggle.checked;

    sendMessageToIframe(astarIframe, {
      action: "toggleDiagonal",
      allowDiagonal,
    });
    sendMessageToIframe(dfsIframe, { action: "toggleDiagonal", allowDiagonal }); // Corrected

    console.log("Diagonal movement set to:", allowDiagonal);
  });

  // Initialize the diagonal toggle state
  sendMessageToIframe(astarIframe, {
    action: "toggleDiagonal",
    allowDiagonal: allowDiagonalDefault,
  });
  sendMessageToIframe(dfsIframe, {
    action: "toggleDiagonal",
    allowDiagonal: allowDiagonalDefault,
  });
});
