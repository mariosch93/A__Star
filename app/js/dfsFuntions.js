// Initialize grid
function initializeGrid() {
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid); // Neighbors respect allowDiagonal
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  stack = [start];
  visited = [];
  path = [];
  dfsFinished = false;
  endSelected = false;

  w = width / cols;
  h = height / rows;

  loop();
}

// Iterative DFS
function dfsIterative() {
  if (stack.length > 0 && !dfsFinished) {
    let current = stack.pop();
    visited.push(current);

    if (current === end) {
      dfsFinished = true;
      addText("Algorithm completed successfully!");
      reconstructPath();
      noLoop();
    }

    current.show(color(0, 255, 0));

    for (let neighbor of current.neighbors) {
      if (!visited.includes(neighbor) && !neighbor.wall) {
        stack.push(neighbor);
        neighbor.previous = current;
      }
    }
  } else {
    noLoop();
    if (!dfsFinished) {
      addText("No solution!");
    }
  }
}

// Mouse pressed function to select end point
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);

  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    let clickedSpot = grid[i][j];

    if (!clickedSpot.wall) {
      // Reset the DFS and path search when a new endpoint is selected
      end = clickedSpot;
      endSelected = true;
      stack = [start];
      visited = [];
      path = [];
      dfsFinished = false;
      loop(); // Restart the visualization
    }
  }
}

// Draw function
function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  if (endSelected) {
    end.show(color(0, 255, 255)); // Cyan for end point
    dfsIterative();
  }
}

// Reconstruct path
function reconstructPath() {
  path = [];
  let temp = end;
  while (temp) {
    path.push(temp);
    temp = temp.previous;
  }
  for (let p of path) {
    p.show(color(0, 0, 255)); // Blue for path
  }
}

// Setup function
function setup() {
  createCanvas(720, 550);
  frameRate(5);
  w = width / cols;
  h = height / rows;
  initializeGrid();

  // Wall percentage slider
  document.getElementById("wallSlider").addEventListener("input", (e) => {
    wallPercentage = e.target.value / 100;
    document.getElementById(
      "wallPercentageValue"
    ).textContent = `${e.target.value}%`;
    initializeGrid();
  });

  // Reinitialize grid button
  document
    .getElementById("initializeButton")
    .addEventListener("click", initializeGrid);

  // Diagonal toggle
  const diagonalToggleElement = document.getElementById("diagonalToggle");
  diagonalToggleElement.addEventListener("change", (e) => {
    allowDiagonal = e.target.checked;
    initializeGrid(); // Reinitialize grid to update neighbors
  });
}
function addText(result) {
  window.parent.postMessage({ action: "updateSummary", text: result }, "*");
}
