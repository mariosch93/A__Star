function resetGrid() {
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
