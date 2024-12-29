function initializeGrid() {
  grid = new Array(cols).fill().map(() => new Array(rows));
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

  loop();
}
