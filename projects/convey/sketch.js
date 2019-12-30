//constants
var RIGHT = 0;
var UP = 1;
var LEFT = 2;
var DOWN = 3;
var animationFrames_conveyor = [];
var gridScale = 50;
var test_item_image;

var mapOffsetX = -gridScale;
var mapOffsetY = -gridScale;

var mapGrid;
var items = [];

function preload() {
  animationFrames_conveyor.push(
    loadImage("./animation-conveyor/conveyor-frame-0.png")
  );
  animationFrames_conveyor.push(
    loadImage("./animation-conveyor/conveyor-frame-1.png")
  );
  animationFrames_conveyor.push(
    loadImage("./animation-conveyor/conveyor-frame-2.png")
  );
  animationFrames_conveyor.push(
    loadImage("./animation-conveyor/conveyor-frame-3.png")
  );
  test_item_image = loadImage("./apple.png");
}

function setup() {
  let myCanvas = createCanvas(innerWidth, innerHeight);
  myCanvas.parent("mainSketch");
  background(0);
  mapGrid = new Grid(gridScale);
  mapGrid.populate(200, 200);
  //   item = new Item_Test(0, 0, mapGrid);
}

function draw() {
  background(0);
  debugGrid(gridScale);
  mapGrid.show(mapOffsetX, mapOffsetY);
  for (item of items) {
    item.show();
    item.run();
  }
  fill(255);
  text("WASD - place conveyors \nQ - place item \nE - empty the space", 10, 20);
}

function debugGrid(scale) {
  noFill();
  strokeWeight(1);
  stroke(200, 50, 200, 100);
  for (let j = 0; j < mapGrid.h; j++) {
    for (let i = 0; i < mapGrid.w; i++) {
      rect(i * scale, j * scale, scale, scale);
    }
  }
}

function keyPressed() {
  if (keyCode == 87) {
    mapGrid.place_Conveyor(mouseX - mapOffsetX, mouseY - mapOffsetY, UP, 0.2);
  }
  if (keyCode == 65) {
    mapGrid.place_Conveyor(mouseX - mapOffsetX, mouseY - mapOffsetY, LEFT, 0.2);
  }
  if (keyCode == 83) {
    mapGrid.place_Conveyor(mouseX - mapOffsetX, mouseY - mapOffsetY, DOWN, 0.2);
  }
  if (keyCode == 68) {
    mapGrid.place_Conveyor(
      mouseX - mapOffsetX,
      mouseY - mapOffsetY,
      RIGHT,
      0.2
    );
  }
  if (keyCode == 69) {
    mapGrid.place_Empty(mouseX - mapOffsetX, mouseY - mapOffsetY);
  }
  if (keyCode == 67) {
    items = [];
  }
  if (keyCode == 81) {
    items.push(
      new Item_Test(mouseX - mapOffsetX, mouseY - mapOffsetY, mapGrid)
    );
  }
}

class Grid {
  constructor(scale) {
    this.grid = [];
    this.scale = scale;
    this.removeQueue = [];
    this.w = 0;
    this.h = 0;
  }

  show(startX, startY) {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[0].length; x++) {
        this.grid[y][x].show(
          x * this.scale + startX,
          y * this.scale + startY,
          this.scale
        );
      }
    }
  }

  populate(width, height) {
    this.w = width;
    this.h = height;
    let numOfSquaresW = width + 2;
    let numOfSquaresH = height + 2;
    /*
          [ [], [], [], [], [] ],
          [ [], [], [], [], [] ],
          [ [], [], [], [], [] ],
          [ [], [], [], [], [] ],
          [ [], [], [], [], [] ]
    */
    for (let j = 0; j < numOfSquaresH; j++) {
      let row = [];
      for (let i = 0; i < numOfSquaresW; i++) {
        row.push(new Cell_Empty());
      }
      this.grid.push(row.slice());
    }
  }

  place_Conveyor(x, y, direction, speed) {
    let gridX = Math.floor(x / this.scale);
    let gridY = Math.floor(y / this.scale);
    let newCell = new Cell_Conveyor(direction, speed);
    this.grid[gridY][gridX] = newCell;
    // console.log(newCell);
  }

  place_Empty(x, y) {
    let gridX = Math.floor(x / this.scale);
    let gridY = Math.floor(y / this.scale);
    this.grid[gridY][gridX] = new Cell_Empty();
  }
}
