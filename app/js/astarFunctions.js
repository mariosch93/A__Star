// Initialize grid

function initializeGrid() {
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  // Recalculate cell width and height
  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid); // Add neighbors based on diagonal toggle
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet = [start];
  closedSet = [];
  path = [];

  gridInitialized = true; // Mark the grid as initialized
  endSelected = false; // Ensure end point is not selected after reset

  loop(); // Restart the A* algorithm when grid is reset
}

// Mouse pressed function to set end point
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);

  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    let clickedSpot = grid[i][j];

    if (!clickedSpot.wall) {
      end = clickedSpot;
      endSelected = true;
      openSet = [];
      closedSet = [];
      path = [];
      openSet.push(start);
      loop();
    }
  }
}

// Helper function to remove an item from an array
function removeFromArray(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function setup() {
  createCanvas(720, 550); // Initial canvas size
  frameRate(5);
  w = width / cols;
  h = height / rows;
  initializeGrid();

  // Add event listener for wall slider after p5.js setup
  document.getElementById("wallSlider").addEventListener("input", function () {
    wallPercentage = this.value / 100; // Convert slider value to percentage
    document.getElementById("wallPercentageValue").innerText = `${this.value}%`; // Update displayed value
    initializeGrid(); // Reinitialize grid with new wall percentage
  });

  // Event listener for initializing the grid
  document
    .getElementById("initializeButton")
    .addEventListener("click", initializeGrid);

  // Diagonal toggle
  const diagonalToggle = document.getElementById("diagonalToggle");
  diagonalToggle.addEventListener("change", () => {
    allowDiagonal = diagonalToggle.checked; // Toggle diagonal movement
    initializeGrid(); // Reinitialize grid to apply changes
  });
}

// Draw function for A* visualization
function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  if (end) {
    end.show(color(0, 255, 255)); // Cyan for the end point
  }

  // If the end point is not selected, stop the algorithm
  if (!endSelected) {
    fill(255, 255, 0);
    return; // Stop execution until the end point is selected
  }

  // A* algorithm starts here if the end point is selected and grid is initialized
  if (gridInitialized && openSet.length > 0) {
    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    if (current === end) {
      noLoop();
      console.log("Done!");
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + 1;

        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    console.log("No solution");
    noLoop();
    return;
  }

  // Show visited and path points
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
}

// Heuristic function for A* algorithm
function heuristic(a, b) {
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}
