var myCanvas;
var mainGrid;
var color1Element;
var color2Element;
var downloadButton;
var centerCanvasButton;

var gridX = 0;
var gridY = 0;

var undoArray = [];

var mainX = 0;
var mainY = 0;
var scaleOfDraw = 30;

var userPreferences = {
  borderOn: true,
  invertedScroll: false
};

var color1 = {
  r: 255,
  g: 0,
  b: 0
};
var color2 = {
  r: 255,
  g: 0,
  b: 0
};

var CTRL_DOWN = false;
var Z_DOWN = false;

//tools
// var tool_cur = ;
var tool_brush = false;
var tool_bucket = false;

function setup() {
  myCanvas = createCanvas(innerWidth - 140, innerHeight);
  myCanvas.parent("mainSketch");
  background(34, 53, 61);

  gridX = parseInt(prompt("Enter width of the grid", "16"));
  gridY = parseInt(prompt("Enter height of the grid", "16"));

  mainGrid = new drawGrid(gridX, gridY);
  mainX = width / 2 - (mainGrid.w / 2) * mainGrid.scale;
  mainY = height / 2 - (mainGrid.h / 2) * mainGrid.scale;

  setTool_Brush();

  undoArray.push(JSON.parse(JSON.stringify(mainGrid.gridCells)));
  mainGrid.show(scaleOfDraw, mainX, mainY);

  color1Element = document.getElementById("mainColor1");
  color2Element = document.getElementById("mainColor2");

  document.getElementById("drawBorder").addEventListener("click", () => {
    mainGrid.drawGrid = document.getElementById("drawBorder").checked;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  });

  downloadButton = createButton("Download");
  downloadButton.mousePressed(downloadImage);
  downloadButton.position(
    width + downloadButton.width,
    height - downloadButton.height - 3
  );
  centerCanvasButton = createButton("Center Canvas");
  centerCanvasButton.mousePressed(() => {
    mainX = width / 2 - (mainGrid.w / 2) * mainGrid.scale;
    mainY = height / 2 - (mainGrid.h / 2) * mainGrid.scale;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  });
  centerCanvasButton.position(
    width + downloadButton.width - centerCanvasButton.width - 3,
    height - centerCanvasButton.height - 3
  );

  // document.getElementById("brushButton").mousePressed(() => {
  //   setTool_Brush();
  // });
  // document.getElementById("bucketFillButton").mousePressed(() => {
  //   setTool_BucketFill();
  // });
}

function setTool_BucketFill() {
  tool_brush = true;
  myCanvas.mousePressed(() => {
    let newColor1 = formatRGB(color1Element.style.backgroundColor);
    color1.r = newColor1.r;
    color1.g = newColor1.g;
    color1.b = newColor1.b;
    let newColor2 = formatRGB(color2Element.style.backgroundColor);
    color2.r = newColor2.r;
    color2.g = newColor2.g;
    color2.b = newColor2.b;
    if (mouseButton === LEFT) {
      let cord = mainGrid.cordToCell(mouseX, mouseY);
      floodFill(color1, cord.x, cord.y);
    }
    if (mouseButton === RIGHT) {
      let cord = mainGrid.cordToCell(mouseX, mouseY);
      floodFill(color2, cord.x, cord.y);
    }
    mainGrid.show(scaleOfDraw, mainX, mainY);
  });
}

function setTool_Brush() {
  tool_brush = true;
  myCanvas.mousePressed(() => {
    if (mouseButton === LEFT) {
      let newColor1 = formatRGB(color1Element.style.backgroundColor);
      color1.r = newColor1.r;
      color1.g = newColor1.g;
      color1.b = newColor1.b;
      mainGrid.mousePressAt(color1, mouseX, mouseY);
      // console.log("LEFT");
    }
    if (mouseButton === RIGHT) {
      let newColor2 = formatRGB(color2Element.style.backgroundColor);
      color2.r = newColor2.r;
      color2.g = newColor2.g;
      color2.b = newColor2.b;
      mainGrid.mousePressAt(color2, mouseX, mouseY);
      // console.log("RIGHT");
    }
    mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
  });
  myCanvas.mouseReleased(() => {
    undoArray.push(JSON.parse(JSON.stringify(mainGrid.gridCells)));
    // console.log(undoArray);
  });
}

function mouseWheel(event) {
  if (CTRL_DOWN) {
    scaleOfDraw += event.delta * 0.5;
    if (scaleOfDraw < 4) {
      scaleOfDraw = 4;
    }
  } else {
    mainX -= event.deltaX;
    mainY -= event.deltaY;
  }
  // console.log(event);
  mainGrid.show(scaleOfDraw, mainX, mainY);
}

function downloadImage() {
  let fileName = prompt("Please enter name of the file", "drawing");
  if (fileName === null) {
    fileName = "drawing";
  }
  let img = createImage(mainGrid.w, mainGrid.h);
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let cellColor = mainGrid.getCellAt(x, y);
      img.set(x, y, color(cellColor.r, cellColor.g, cellColor.b));
    }
  }
  img.updatePixels();
  img.save(fileName, "png");
}

function floodFill(color, x, y) {
  //color should come as object {r:,g:,b:}
  let startCell = mainGrid.getCellAt(x, y);
  if (startCell === undefined || startCell === null) {
    // console.log(startCell);
    return;
  }
  if (
    startCell.r === color.r &&
    startCell.g === color.g &&
    startCell.b === color.b
  ) {
    // console.log(startCell);
    //if the same color
    return;
  }
  // console.log(startCell);
  let replacementCell = mainGrid.makeCell(color.r, color.g, color.b);
  mainGrid.changeCellAt(replacementCell, x, y);
  floodFill(color, x + 1, y);
  floodFill(color, x, y + 1);
  floodFill(color, x - 1, y);
  floodFill(color, x, y - 1);
}

function keyPressed() {
  if (keyCode === CONTROL) {
    CTRL_DOWN = true;
  }
  if (key === `z`) {
    Z_DOWN = true;
    if (CTRL_DOWN) {
      undo();
    }
  }

  if (keyCode === UP_ARROW) {
    mainY += scaleOfDraw;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  }
  if (keyCode === DOWN_ARROW) {
    mainY -= scaleOfDraw;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  }
  if (keyCode === LEFT_ARROW) {
    mainX += scaleOfDraw;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  }
  if (keyCode === RIGHT_ARROW) {
    mainX -= scaleOfDraw;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  }
}

function keyReleased() {
  if (keyCode === CONTROL) {
    CTRL_DOWN = false;
  }
  if (key === `z`) {
    Z_DOWN = false;
  }
}

function undo() {
  // 0, cur
  if (undoArray.length === 1) {
    // console.log("1");
    return;
  }
  mainGrid.gridCells = JSON.parse(
    JSON.stringify(undoArray[undoArray.length - 2])
  );
  mainGrid.show(mainGrid.scale, mainX, mainY);
  undoArray.pop();
}

// function mousePressed() {
//   if (mouseButton === LEFT) {
//     let newColor1 = formatRGB(color1Element.style.backgroundColor);
//     color1.r = newColor1.r;
//     color1.g = newColor1.g;
//     color1.b = newColor1.b;
//     mainGrid.mousePressAt(color1, mouseX, mouseY);
//     // console.log("LEFT");
//   }
//   if (mouseButton === RIGHT) {
//     let newColor2 = formatRGB(color2Element.style.backgroundColor);
//     color2.r = newColor2.r;
//     color2.g = newColor2.g;
//     color2.b = newColor2.b;
//     mainGrid.mousePressAt(color2, mouseX, mouseY);
//     // console.log("RIGHT");
//   }
//   mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
// }
function mouseDragged() {
  if (mouseButton === LEFT) {
    mainGrid.mousePressAt(color1, mouseX, mouseY);
  }
  if (mouseButton === RIGHT) {
    mainGrid.mousePressAt(color2, mouseX, mouseY);
  }
  mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
}

function formatRGB(str) {
  let numbers = str.substring(4, str.length - 1);
  let arrayOfNumbers = numbers.split(", ");
  return {
    r: parseInt(arrayOfNumbers[0]),
    g: parseInt(arrayOfNumbers[1]),
    b: parseInt(arrayOfNumbers[2])
  };
}

class drawGrid {
  constructor(w, h) {
    this.drawGrid = true;
    this.gridCells = [];
    this.w = w;
    this.h = h;
    this.xOffset = 0;
    this.yOffset = 0;
    this.scale = scaleOfDraw;
    for (let i = 0; i < this.h; i++) {
      this.gridCells.push(
        new Array(this.w).fill({
          r: 255,
          g: 255,
          b: 255
        })
      );
    }
    // console.log(this.gridCells);
  }

  mousePressAt(color, x, y) {
    let cordOfCell = this.cordToCell(x, y);
    let newCell = this.makeCell(color.r, color.g, color.b);
    this.changeCellAt(newCell, cordOfCell.x, cordOfCell.y);
  }

  cordToCell(x, y) {
    //converts screen cordinates to cell x and y
    let correctedX = x - this.xOffset - ((x - this.xOffset) % this.scale);
    let correctedY = y - this.yOffset - ((y - this.yOffset) % this.scale);
    // console.log(this.xOffset, this.yOffset);

    let cellX = correctedX / this.scale;
    let cellY = correctedY / this.scale;
    // console.log(correctedX, correctedY);
    return {
      x: cellX,
      y: cellY
    };
  }

  showCell(scale_, x_, y_, cellX, cellY) {
    this.xOffset = x_;
    this.yOffset = y_;
    this.scale = scale_;
    if (this.drawGrid) {
      stroke(0);
    } else {
      noStroke();
    }

    let cellCord = this.cordToCell(cellX, cellY);
    let cell = this.getCellAt(cellCord.x, cellCord.y);
    if (cellCord.x > this.w - 1 || cellCord.x < 0) {
      return;
    }
    if (cellCord.y > this.h - 1 || cellCord.y < 0) {
      return;
    }
    // console.log(cellCord.y, this.h - 1);
    fill(cell.r, cell.g, cell.b);
    rect(cellCord.x * scale_ + x_, cellCord.y * scale_ + y_, scale_, scale_);
  }

  show(scale_, x_, y_) {
    //shows grid at x_ and y_

    background(34, 53, 61);
    this.xOffset = x_;
    this.yOffset = y_;
    this.scale = scale_;
    if (this.drawGrid) {
      stroke(0);
    } else {
      noStroke();
    }
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let cell = this.getCellAt(x, y);
        fill(cell.r, cell.g, cell.b);
        rect(x * scale_ + x_, y * scale_ + y_, scale_, scale_);
      }
    }
  }

  makeCell(r_, g_, b_) {
    return {
      r: r_,
      g: g_,
      b: b_
    };
  }

  getCellAt(x, y) {
    if (x > this.w || x < 0) {
      return null;
    }
    if (y > this.h - 1 || y < 0) {
      return null;
    }
    return this.gridCells[y][x];
  }

  changeCellAt(newCell, x, y) {
    if (x > this.w || x < 0) {
      return;
    }
    if (y > this.h - 1 || y < 0) {
      return;
    }
    this.gridCells[y][x] = newCell;
  }
}

function rgbToHex(r, g, b) {
  function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}
