document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("astarIframe");
  const colsInput = document.getElementById("cols");
  const rowsInput = document.getElementById("rows");
  const updateButton = document.getElementById("updateGrid");

  const wallPercentageSlider = document.getElementById("wall-percentage");
  const wallPercentageValue = document.getElementById("wall-percentage-value");
  const applyWallPercentageButton = document.getElementById(
    "apply-wall-percentage"
  );

  // Update wall percentage value display when slider is changed
  wallPercentageSlider.addEventListener("input", () => {
    const value = wallPercentageSlider.value;
    wallPercentageValue.textContent = `${value}%`;
  });

  // When the Apply button is clicked, send updated wall percentage to iframe
  applyWallPercentageButton.addEventListener("click", () => {
    const wallPercentage = wallPercentageSlider.value / 100; // Convert to percentage
    console.log(`Wall percentage set to ${wallPercentage * 100}%`);

    // Send wall percentage update to the iframe
    iframe.contentWindow.postMessage(
      { action: "updateWallPercentage", value: wallPercentage },
      "*"
    );
  });

  // When the Update Grid button is clicked, send updated grid size to iframe
  updateButton.addEventListener("click", () => {
    const cols = parseInt(colsInput.value, 10);
    const rows = parseInt(rowsInput.value, 10);

    if (iframe && iframe.contentWindow) {
      // Post the message to the iframe
      iframe.contentWindow.postMessage(
        { action: "updateGridSize", cols, rows },
        "*"
      );
    } else {
      console.error("Iframe not found or not loaded");
    }
  });
});
