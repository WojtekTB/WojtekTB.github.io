let grid;

function setup() {
  grid = new Grid(20, 20);
  grid.setCellAt(1, 5, 5);
  console.log(grid.getCellAt(5, 5));
}

function draw() {}

class Grid {
  constructor(w, h) {
    this.grid = [];
    this.w = w;
    this.h = h;
    for (let i = 0; i < this.w * this.h; i++) {
      this.grid.push({
        value: 0, //0 empty, 1, wall
        x: 0,
        y: 0
      });
    }
  }

  getCellAt(x, y) {
    return this.grid[y * this.w + x];
  }
  setCellAt(value, x, y) {
    this.grid[y * this.w + x].value = value;
    return this.grid[y * this.w + x];
  }
  printCells() {
    for (let j = 0; j < this.h; j++) {
      let row = [];
      for (let i = 0; i < this.w; i++) {
        row.push(this.grid[i + j * this.w].value);
      }
      console.log(row);
    }
  }
}
