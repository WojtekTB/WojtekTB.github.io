var myCanvas;
var mainGrid;
var color1Element;
var color2Element;
var downloadButton;
var centerCanvasButton;

var gridX = 0;
var gridY = 0;

var undoArray = [];
var pallete = [];

var mainX = 0;
var mainY = 0;
var scaleOfDraw = 30;

var userPreferences = {
  borderOn: true,
  invertedScroll: false
};

var color1 = {
  r: 0,
  g: 0,
  b: 0
};
var color2 = {
  r: 255,
  g: 255,
  b: 255
};

var CTRL_DOWN = false;
var Z_DOWN = false;
var SPACE_DOWN = false;

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

  populatePalleteDivider();

  document.getElementById("drawBorder").addEventListener("click", () => {
    mainGrid.drawGrid = document.getElementById("drawBorder").checked;
    mainGrid.show(scaleOfDraw, mainX, mainY);
  });
}

function setTool_Line() {
  //so the idea is that you press somewhere the first time, and it marks the beginning,
  //then you click the second one and it marks the end, then it just path finds to it
  let startX;
  let startY;
  let linePart1 = function() {
    let cord = mainGrid.cordToCell(mouseX, mouseY);
    startX = cord.x;
    startY = cord.y;
    myCanvas.mousePressed(linePart2);
    myCanvas.mouseReleased(() => {
      undoArray.push(JSON.parse(JSON.stringify(mainGrid.gridCells)));
      //a weird hack, change if find a better way please
      populatePalleteDivider();
    });
  };
  let linePart2 = function() {
    let cord = mainGrid.cordToCell(mouseX, mouseY);
    let path = findPath(startX, startY, cord.x, cord.y);
    // console.log(path);
    let newColor1 = formatRGB(color1Element.style.backgroundColor);
    color1.r = newColor1.r;
    color1.g = newColor1.g;
    color1.b = newColor1.b;
    color1.alpha = newColor1.alpha;
    for (cell of path) {
      let newCell = mainGrid.makeCell(color1.r, color1.g, color1.b);
      mainGrid.changeCellAt(newCell, cell.x, cell.y);
    }
    mainGrid.show(scaleOfDraw, mainX, mainY);
    myCanvas.mousePressed(linePart1);

    myCanvas.mouseReleased(function() {
      populatePalleteDivider();
    });
  };
  myCanvas.mousePressed(linePart1);
  mouseDragged = function() {};
  myCanvas.mouseReleased(function() {
    populatePalleteDivider();
  });
}

function setTool_Eracer() {
  myCanvas.mousePressed(() => {
    let cordOfCell = mainGrid.cordToCell(mouseX, mouseY);
    let newCell = mainGrid.makeInvisibleCell(color.r, color.g, color.b);
    mainGrid.changeCellAt(newCell, cordOfCell.x, cordOfCell.y);
    mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
  });

  myCanvas.mouseReleased(() => {
    undoArray.push(JSON.parse(JSON.stringify(mainGrid.gridCells)));
    //a weird hack, change if find a better way please
  });
  mouseDragged = function() {
    let cordOfCell = mainGrid.cordToCell(mouseX, mouseY);
    let newCell = mainGrid.makeInvisibleCell(color.r, color.g, color.b);
    mainGrid.changeCellAt(newCell, cordOfCell.x, cordOfCell.y);
    mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
  };
}

function setTool_BucketFill() {
  tool_brush = true;
  myCanvas.mousePressed(() => {
    let newColor1 = formatRGB(color1Element.style.backgroundColor);
    color1.r = newColor1.r;
    color1.g = newColor1.g;
    color1.b = newColor1.b;
    color1.alpha = newColor1.alpha;
    let newColor2 = formatRGB(color2Element.style.backgroundColor);
    color2.r = newColor2.r;
    color2.g = newColor2.g;
    color2.b = newColor2.b;
    color2.alpha = newColor2.alpha;
    let cord = mainGrid.cordToCell(mouseX, mouseY);
    let startCell = mainGrid.getCellAt(cord.x, cord.y);
    let initColor = {
      r: startCell.r,
      g: startCell.g,
      b: startCell.b
    };
    if (mouseButton === LEFT) {
      // let cord = mainGrid.cordToCell(mouseX, mouseY);
      try {
        floodFill(initColor, color1, cord.x, cord.y);
      } catch {
        mainGrid.show(scaleOfDraw, mainX, mainY);
      }
    }
    if (mouseButton === RIGHT) {
      // let cord = mainGrid.cordToCell(mouseX, mouseY);
      try {
        floodFill(initColor, color2, cord.x, cord.y);
      } catch {
        mainGrid.show(scaleOfDraw, mainX, mainY);
      }
    }
    mainGrid.show(scaleOfDraw, mainX, mainY);
  });
  myCanvas.mouseReleased(() => {
    undoArray.push(JSON.parse(JSON.stringify(mainGrid.gridCells)));
    //a weird hack, change if find a better way please
    populatePalleteDivider();
  });
  mouseDragged = function() {
    return;
  };
}

function setTool_Brush() {
  tool_brush = true;
  myCanvas.mousePressed(() => {
    if (mouseButton === LEFT) {
      let newColor1 = formatRGB(color1Element.style.backgroundColor);
      color1.r = newColor1.r;
      color1.g = newColor1.g;
      color1.b = newColor1.b;
      color1.alpha = newColor1.alpha;
      mainGrid.brushUsedAt(color1, mouseX, mouseY);
      // console.log("LEFT");
    }
    if (mouseButton === RIGHT) {
      let newColor2 = formatRGB(color2Element.style.backgroundColor);
      color2.r = newColor2.r;
      color2.g = newColor2.g;
      color2.b = newColor2.b;
      color2.alpha = newColor2.alpha;
      mainGrid.brushUsedAt(color2, mouseX, mouseY);
      // console.log("RIGHT");
    }
    mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
  });
  myCanvas.mouseReleased(() => {
    undoArray.push(JSON.parse(JSON.stringify(mainGrid.gridCells)));
    //a weird hack, change if find a better way please
    populatePalleteDivider();
  });

  mouseDragged = function() {
    if (mouseButton === LEFT) {
      mainGrid.brushUsedAt(color1, mouseX, mouseY);
    }
    if (mouseButton === RIGHT) {
      mainGrid.brushUsedAt(color2, mouseX, mouseY);
    }
    mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
  };
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
  // if (fileName === null) {
  //   fileName = "drawing";
  // }
  if (fileName === null) {
    return;
  } else {
    let img = createImage(mainGrid.w, mainGrid.h);
    img.loadPixels();
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let cellColor = mainGrid.getCellAt(x, y);
        img.set(
          x,
          y,
          color(cellColor.r, cellColor.g, cellColor.b, cellColor.alpha)
        );
      }
    }
    img.updatePixels();
    img.save(fileName, "png");
  }
}

function findPath(x1, y1, x2, y2) {
  let findInBetween = function(startX, startY, endX, endY) {
    //should return an array of x y cordinates
    let pathCells = [];
    if (startX === endX && startY === endY) {
      // pathCells.push({ x: startX, y: startY });
      return pathCells;
    }

    let initX = startX;
    let initY = startY;
    let min = {
      x: initX,
      y: initY
    };
    if (startX > endX) {
      if (startY > endY) {
        min = {
          x: initX - 1,
          y: initY - 1
        };
      } else if (startY < endY) {
        min = {
          x: initX - 1,
          y: initY + 1
        };
      } else {
        min = {
          x: initX - 1,
          y: initY
        };
      }
    } else if (startX < endX) {
      if (startY > endY) {
        min = {
          x: initX + 1,
          y: initY - 1
        };
      } else if (startY < endY) {
        min = {
          x: initX + 1,
          y: initY + 1
        };
      } else {
        min = {
          x: initX + 1,
          y: initY
        };
      }
    } else {
      if (startY > endY) {
        min = {
          x: initX,
          y: initY - 1
        };
      } else if (startY < endY) {
        min = {
          x: initX,
          y: initY + 1
        };
      }
    }
    pathCells.push({ x: min.x, y: min.y });
    pathCells = pathCells.concat(findInBetween(min.x, min.y, endX, endY));
    return pathCells;
  };
  let output = [];
  output.push({ x: x1, y: y1 });
  let otherCells = findInBetween(x1, y1, x2, y2);
  output = output.concat(otherCells);
  console.log(otherCells);
  return output;
}

function floodFill(colorToBeReplaced, color, x, y) {
  let thisCell = mainGrid.getCellAt(x, y);
  if (thisCell === undefined || thisCell === null) {
    //if an invalid cell
    return;
  }
  if (
    thisCell.r === colorToBeReplaced.r &&
    thisCell.g === colorToBeReplaced.g &&
    thisCell.b === colorToBeReplaced.b
  ) {
    //if the cell is of the color we are trying to replace
    mainGrid.changeCellAt(color, x, y);
    floodFill(colorToBeReplaced, color, x + 1, y);
    floodFill(colorToBeReplaced, color, x, y + 1);
    floodFill(colorToBeReplaced, color, x - 1, y);
    floodFill(colorToBeReplaced, color, x, y - 1);
  } else {
    //if it is not of the color we are trying to replace
    return;
  }
}
function centerCanvas() {
  mainX = width / 2 - (mainGrid.w / 2) * mainGrid.scale;
  mainY = height / 2 - (mainGrid.h / 2) * mainGrid.scale;
  mainGrid.show(scaleOfDraw, mainX, mainY);
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

  // if (keyCode === SPACE) {
  //   SPACE_DOWN = true;
  // }
}

function keyReleased() {
  if (keyCode === CONTROL) {
    CTRL_DOWN = false;
  }
  if (key === `z`) {
    Z_DOWN = false;
  }
  // if (keyCode === SPACE) {
  //   SPACE_DOWN = true;
  // }
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

function mouseDragged() {
  if (mouseButton === LEFT) {
    mainGrid.brushUsedAt(color1, mouseX, mouseY);
  }
  if (mouseButton === RIGHT) {
    mainGrid.brushUsedAt(color2, mouseX, mouseY);
  }
  mainGrid.showCell(scaleOfDraw, mainX, mainY, mouseX, mouseY);
}

function formatRGB(str) {
  let numbers = str.substring(4, str.length - 1);
  let arrayOfNumbers = numbers.split(", ");
  return {
    r: parseInt(arrayOfNumbers[0]),
    g: parseInt(arrayOfNumbers[1]),
    b: parseInt(arrayOfNumbers[2]),
    alpha: 255
  };
}

function updatePallete() {
  pallete = [];
  for (let x = 0; x < mainGrid.w; x++) {
    for (let y = 0; y < mainGrid.h; y++) {
      let curCell = mainGrid.getCellAt(x, y);
      let colors = rgbToHex(curCell.r, curCell.g, curCell.b);
      if (!pallete.includes(colors)) {
        pallete.push(colors);
      }
    }
  }
}

function populatePalleteDivider() {
  let div = document.getElementById("pallete");
  updatePallete();
  div.innerHTML = "";

  for (colors of pallete) {
    let btn = document.createElement("BUTTON"); // Create a <button> element
    // btn.innerHTML = "bruh";
    btn.id = `id-${colors}`;
    btn.style = `background-color: ${colors}; width: 30px; height: 30px;`;
    btn.addEventListener("click", function() {
      setColorFromPallet(btn.style.backgroundColor);
    });
    // btn.onclick = "";
    div.appendChild(btn); // Append <button> to <body>
  }
}

function setColorFromPallet(color) {
  // console.log(color1Element);
  let newColor = formatRGB(color);
  color1Element.style.backgroundColor = rgbToHex(
    newColor.r,
    newColor.g,
    newColor.b
  );
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
          b: 255,
          alpha: 255
        })
      );
    }
    // console.log(this.gridCells);
  }

  brushUsedAt(color, x, y) {
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
    if (cell.alpha == 0) {
      noStroke();
      fill(230);
      rect(
        cellCord.x * scale_ + x_,
        cellCord.y * scale_ + y_,
        scale_ / 2,
        scale_ / 2
      );
      rect(
        cellCord.x * scale_ + x_ + scale_ / 2,
        cellCord.y * scale_ + y_ + scale_ / 2,
        scale_ / 2,
        scale_ / 2
      );
      fill(250);
      rect(
        cellCord.x * scale_ + x_,
        cellCord.y * scale_ + y_ + scale_ / 2,
        scale_ / 2,
        scale_ / 2
      );
      rect(
        cellCord.x * scale_ + x_ + scale_ / 2,
        cellCord.y * scale_ + y_,
        scale_ / 2,
        scale_ / 2
      );
      if (this.drawGrid) {
        stroke(0);
      } else {
        noStroke();
      }
    } else {
      fill(cell.r, cell.g, cell.b, cell.alpha);
      rect(cellCord.x * scale_ + x_, cellCord.y * scale_ + y_, scale_, scale_);
    }
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
    // let cellCord = this.cordToCell(cellX, cellY);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let cell = this.getCellAt(x, y);
        if (cell.alpha == 0) {
          noStroke();
          fill(230);
          rect(x * scale_ + mainX, y * scale_ + mainY, scale_ / 2, scale_ / 2);
          rect(
            x * scale_ + mainX + scale_ / 2,
            y * scale_ + mainY + scale_ / 2,
            scale_ / 2,
            scale_ / 2
          );
          fill(250);
          rect(
            x * scale_ + mainX,
            y * scale_ + mainY + scale_ / 2,
            scale_ / 2,
            scale_ / 2
          );
          rect(
            x * scale_ + mainX + scale_ / 2,
            y * scale_ + mainY,
            scale_ / 2,
            scale_ / 2
          );
          if (this.drawGrid) {
            stroke(0);
          } else {
            noStroke();
          }
        } else {
          fill(cell.r, cell.g, cell.b, cell.alpha);
          rect(x * scale_ + x_, y * scale_ + y_, scale_, scale_);
        }
      }
    }
  }

  makeCell(r_, g_, b_) {
    return {
      r: r_,
      g: g_,
      b: b_,
      alpha: 255
    };
  }
  makeInvisibleCell() {
    return {
      r: 0,
      g: 0,
      b: 0,
      alpha: 0
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
