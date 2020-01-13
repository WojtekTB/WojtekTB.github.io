//constants
const RIGHT = 0;
const UP = 1;
const LEFT = 2;
const DOWN = 3;
var currentDirection = RIGHT;

var gridScale = 50;
var test_item_image;

var mapOffsetX = -gridScale;
var mapOffsetY = -gridScale;

var animationFrames_empty = [];
var animationFrames_conveyor = [];
var animationFrames_collector = [];

var mapGrid;
var mainToolbar;

var workTiles = [];

/**
 * TODO:
 * - Make a ghost tile that shows you which direction the tile you are placing will be in
 * - probably think of more tile types
 */



function preload() {
  animationFrames_conveyor.push(
    loadImage("./images/animation-conveyor/conveyor-frame-0.png")
  );
  animationFrames_conveyor.push(
    loadImage("./images/animation-conveyor/conveyor-frame-1.png")
  );
  animationFrames_conveyor.push(
    loadImage("./images/animation-conveyor/conveyor-frame-2.png")
  );
  animationFrames_conveyor.push(
    loadImage("./images/animation-conveyor/conveyor-frame-3.png")
  );
  animationFrames_collector.push(
    loadImage("./images/animation-collector/collector-frame-1.png")
  );
  animationFrames_empty.push(
    loadImage("./images/empty.png")
  );
  test_item_image = loadImage("./apple.png");
}

function setup() {
  let myCanvas = createCanvas(innerWidth, innerHeight);
  myCanvas.parent("mainSketch");
  background(0);
  mapGrid = new Grid(gridScale, workTiles);
  mapGrid.populate(innerWidth, innerHeight);
  //   item = new Item_Test(0, 0, mapGrid);
  mapGrid.show(mapOffsetX, mapOffsetY);
  mainToolbar = new Toolbar(mapGrid);
  mainToolbar.makeItem(animationFrames_conveyor[0], function(x, y, speed, direction, grid){
    mapGrid.place_Conveyor(x, y, speed, direction, grid);
  }, "Conveyor belt (press R to rotate before placing)");
  mainToolbar.makeItem(animationFrames_collector[0],function(x, y, speed, direction, grid){
     mapGrid.place_Collector(x, y, speed, direction, grid);
    }, "Collector (press R to rotate before placing)");
  mainToolbar.makeItem(animationFrames_empty[0], function(x, y, speed, direction, grid){
    mapGrid.place_Empty(x, y, speed, direction, grid);
  }, "An empty space (use to clear tiles)");
  debugGrid(gridScale);
}

function draw() {
  // background(0);
  mapGrid.show(mapOffsetX, mapOffsetY, workTiles);
  
  mainToolbar.show();
  // let fps = frameRate();
  // fill(255);
  // stroke(0);
  // // text("FPS: " + fps.toFixed(2), 10, height - 10);
}

function changeSpeed(){
  let e = parseInt( document.getElementById("slider").value);
  console.log(e);
  globalConvSpeed = parseInt(e)/10;
}

function rotateDirection(){
  currentDirection--;
  if(currentDirection < 0){
    currentDirection = 3;
  }
}

function debugGrid() {
  let scale = mapGrid.scale;
  noFill();
  strokeWeight(1);
  stroke(160, 10, 160);
  for (let j = 0; j < mapGrid.h + 2; j++) {
    for (let i = 0; i < mapGrid.w + 2; i++) {
      rect((i * scale) + mapOffsetX, (j * scale) + mapOffsetY, scale, scale);
    }
  }
}

function mouseWheel(event) {
  print(event.delta);
  if(event.delta > 0){
    mainToolbar.prev();
  }else if(event.delta < 0){
    mainToolbar.next();
  }
}

function mousePressed(){
  mainToolbar.place(mouseX - mapOffsetX, mouseY - mapOffsetY, 0.2, currentDirection, mapGrid);
}

function keyPressed() {
  if (keyCode == 82) {
    rotateDirection();
  }
  if (keyCode == 67) {
    mapGrid.items = [];
    // debugGrid();
  }
  if (keyCode == 81) {
    mapGrid.createItem(mouseX - mapOffsetX, mouseY - mapOffsetY, mapGrid, test_item_image);
  }
}