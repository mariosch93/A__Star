function mousePressed() {
  // Calculate the grid position of the mouse click
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);

  // Ensure the indices are within the grid bounds
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    let clickedSpot = grid[i][j];

    // Check if the clicked spot is not a wall
    if (!clickedSpot.wall) {
      // Update the end point
      end = clickedSpot;

      // Clear previous path, openSet, and closedSet for the new calculation
      openSet = [];
      closedSet = [];
      path = [];
      openSet.push(start);

      loop(); // Restart the A* visualization
    }
  }
}

function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

let cols = 50;
let rows = 50;
let grid = new Array(cols);

let openSet = []; //εδώ μπαίνουν οι πιθανές επιλογές αναζήτησης
let closedSet = []; //εδώ μπαίνουν οι επιλογές όπου έχουν ήδη εξεταστεί
let start;
let end;
let w, h;
let path = [];
let endSelected = false; // Flag to track if the end point is chosen

// Βασισμ΄ένοι στην εξίσωση f(x) = g(x) + h(x)
function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.25) {
    this.wall = true;
  }

  this.show = function (col) {
    fill(col);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    // ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
    rect(this.i * w, this.j * h, w - 1, h - 1);
  };

  this.addNeighbors = function (grid) {
    let i = this.i;
    let j = this.j;
    if (i < cols - 1) {
      // Βλέπουμε αν το i είναι στη γωνία
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    // Για διαφώνια κίνηση
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}

// Δημιουργία του Canvas
function setup() {
  createCanvas(600, 600);
  frameRate(5); // Adjust this value for slower or faster updates

  w = width / cols;
  h = height / rows;

  // Φτιάχνουμε ένα 2D Array
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
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

// Η function draw κάνει loop ενος animation
function draw() {
  background(0);

  // Draw the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  if (endSelected && end) {
    end.show(color(0, 255, 255)); // Cyan for end point
  }
  // If end point is not selected, prompt user
  if (!endSelected) {
    fill(255, 255, 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Click to select the end point", width / 2, height / 2);
    return; // Stop execution until end is selected
  }

  // A* algorithm starts here if the end point is selected
  if (openSet.length > 0) {
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

function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);

  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    let clickedSpot = grid[i][j];

    if (!clickedSpot.wall) {
      end = clickedSpot;
      endSelected = true; // End point is now selected
      openSet = [];
      closedSet = [];
      path = [];
      openSet.push(start);
      loop(); // Restart visualization
    }
  }
}
