class Grid {
  constructor(scale, workTiles) {
    this.grid = [];
    this.itemGrid = [];
    this.scale = scale;
    this.w = 0;
    this.h = 0;
    this.workTiles = workTiles;
    this.items = [];
    this.updateQueue = [];
    this.offsetX = 0;
    this.offsetY = 0;
  }

  addToUpdateQueue(gridX, gridY) {
      for(let i = 0; i < this.updateQueue.length; i++){
          if(this.updateQueue[i].x == gridX){
            if(this.updateQueue[i].y == gridY){
              return;  
             }
          }
      }
    this.updateQueue.push({ gridX: gridX, gridY: gridY });
  }

  //on initial item creation add item to the queue as appropriate
  createItem(x, y, grid, item_image) {
    let newItem = new Item(x, y, grid, item_image);
    this.items.push(newItem);
    this.addItemTo(newItem.gridX, newItem.gridY, newItem);
  }

  //add item to the item grid in an appropriate cell
  addItemTo(gridX, gridY, item) {
    this.itemGrid[gridY][gridX].push({ item: item, ID: item.ID });
  }

  //remove the item from the item grid
  removeItemFrom(gridX, gridY, item) {
    let cellArray = this.itemGrid[gridY][gridX];
    for (let i = 0; i < cellArray.length; i++) {
      if (cellArray[i].ID == item.ID) {
        cellArray.splice(i, 1);
        return;
      }
    }
  }

  //draw the tiles
  show(startX, startY) {
      this.offsetX = startX;
      this.offsetY = startY;
    this.updateFromQueue(startX, startY);

    for (let i = 0; i < this.items.length; i++) {
        this.items[i].show(this);
        this.items[i].run();
      }
  }

  updateFromQueue(startX, startY){
    for (let i = 0; i < this.updateQueue.length; i++) {
      this.grid[this.updateQueue[i].gridY][this.updateQueue[i].gridX].update(
        this.updateQueue[i].gridX * this.scale + startX,
        this.updateQueue[i].gridY * this.scale + startY
        );
    }
    this.updateQueue = [];
  }

  //populate grid with rows and columns
  populate(width, height) {
    this.w = Math.floor(width / this.scale);
    this.h = Math.floor(height / this.scale);
    let numOfSquaresW = this.w + 2;
    let numOfSquaresH = this.h + 2;
    console.log(numOfSquaresW, numOfSquaresH);
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
        row.push(new Cell_Empty(i, j, this));
      }
      this.grid.push(row);
    }
    for (let j = 0; j < numOfSquaresH; j++) {
      let row = [];
      for (let i = 0; i < numOfSquaresW; i++) {
        row.push([]);
      }
      this.itemGrid.push(row.slice());
    }
  }

  place_Collector(x, y,  speed, direction, grid) {
    let gridX = Math.floor(x / this.scale);
    let gridY = Math.floor(y / this.scale);
    let newCell = new Cell_Collector(gridX, gridY, direction, mapGrid);
    this.grid[gridY][gridX] = newCell;
    this.grid[gridY][gridX].show(x * grid.scale + this.offsetX, y * grid.scale + this.offsetY);
  }

  place_Conveyor(x, y,  speed, direction, grid) {
    let gridX = Math.floor(x / this.scale);
    let gridY = Math.floor(y / this.scale);
    let newCell = new Cell_Conveyor(gridX, gridY, direction, speed, mapGrid);
    this.grid[gridY][gridX] = newCell;
    this.grid[gridY][gridX].show(gridX * grid.scale + this.offsetX, gridY * grid.scale + this.offsetY);
    // console.log(newCell);
  }

  place_Empty(x, y,  speed, direction, grid) {
    let gridX = Math.floor(x / this.scale);
    let gridY = Math.floor(y / this.scale);
    this.grid[gridY][gridX] = new Cell_Empty(x, y, grid);
    this.grid[gridY][gridX].show(gridX * grid.scale + this.offsetX, gridY * grid.scale + this.offsetY);
  }
}
