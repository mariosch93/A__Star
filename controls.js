const iframe = document.getElementById("astarIframe");
const colsInput = document.getElementById("cols");
const rowsInput = document.getElementById("rows");
const updateButton = document.getElementById("updateGrid");

// Send updated columns and rows to the iframe
updateButton.addEventListener("click", () => {
  const cols = parseInt(colsInput.value, 10);
  const rows = parseInt(rowsInput.value, 10);

  // Post the message to the iframe
  iframe.contentWindow.postMessage({ cols, rows }, "*");
});
