// Spot constructor
function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0; //used for a* f(x) = g(x) + h(x)
  this.g = 0; //used for a* f(x) = g(x) + h(x)
  this.h = 0; //used for a* f(x) = g(x) + h(x)
  this.neighbors = [];
  this.previous = undefined;
  this.wall = random(1) < wallPercentage;

  this.show = function (col) {
    fill(col);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(this.i * w + 1, this.j * h + 1, w - 1.5, h - 1.5);
  };

  this.addNeighbors = function (grid) {
    let i = this.i;
    let j = this.j;

    // Add orthogonal neighbors
    if (i < cols - 1) this.neighbors.push(grid[i + 1][j]);
    if (i > 0) this.neighbors.push(grid[i - 1][j]);
    if (j < rows - 1) this.neighbors.push(grid[i][j + 1]);
    if (j > 0) this.neighbors.push(grid[i][j - 1]);

    // Add diagonal neighbors if diagonal movement is allowed
    if (allowDiagonal) {
      if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1]);
      if (i < cols - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1]);
      if (i > 0 && j < rows - 1) this.neighbors.push(grid[i - 1][j + 1]);
      if (i < cols - 1 && j < rows - 1) this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}
