var GlobalId = 0;

class Item_Test {
  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.85;
    this.grid = grid;
  }

  show() {
    // fill(255, 0, 0);

    let gridX = Math.floor(this.x / this.grid.scale);
    let gridY = Math.floor(this.y / this.grid.scale);

    // console.log(gridX, gridY)
    let cell = this.grid.grid[gridY][gridX];
    if(cell instanceof Cell_Empty){
      cell.show(gridX * this.grid.scale + mapOffsetX, gridY * this.grid.scale + mapOffsetY, this.grid);
    }

    let width = 20;
    image(
      test_item_image,
      this.x - width / 2 + mapOffsetX,
      this.y - width / 2 + mapOffsetY,
      width,
      width
    );
    // rect(this.x, this.y, 10, 10);
  }
  run() {
    let gridX = Math.floor(this.x / this.grid.scale);
    let gridY = Math.floor(this.y / this.grid.scale);
    this.grid.grid[gridY][gridX].item_action(this);
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;
  }
}

class Item {
  constructor(x, y, grid, item_image) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.85;
    this.grid = grid;
    this.item_image = item_image;
    this.ID = GlobalId;
    GlobalId++;
    this.gridX = Math.floor(this.x/this.grid.scale);
    this.gridY = Math.floor(this.y/this.grid.scale);
  }

  show() {
    // fill(255, 0, 0);

    // let gridX = Math.floor(this.x / this.grid.scale);
    // let gridY = Math.floor(this.y / this.grid.scale);

    // // console.log(gridX, gridY)
    // let cell = this.grid.grid[gridY][gridX];
    // if(cell instanceof Cell_Empty){
    //   cell.show(gridX * this.grid.scale + mapOffsetX, gridY * this.grid.scale + mapOffsetY, this.grid);
    // }

    let width = 20;
    image(
      this.item_image,
      this.x - width / 2 + mapOffsetX,
      this.y - width / 2 + mapOffsetY,
      width,
      width
    );
    // rect(this.x, this.y, 10, 10);
  }
  run() {
    this.grid.grid[this.gridY][this.gridX].item_action(this);

    let newGridX = Math.floor((this.x+this.vx)/this.grid.scale);
    let newGridY = Math.floor((this.y+this.vy)/this.grid.scale);

    let x_different = newGridX != this.gridX;
    let y_different = newGridY != this.gridY;
    if(x_different || y_different){
      this.grid.removeItemFrom(this.gridX, this.gridY, this);
      if(x_different){
        this.gridX = newGridX;
      }
      if(y_different){
        this.gridY = newGridY;
      }
      this.grid.addItemTo(this.gridX, this.gridY, this);
    }
    
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;
    // if(Math.abs(this.vx) < 0.05){
    //   this.vx = 0;
    // }
    // if(Math.abs(this.vy) < 0.05){
    //   this.vy = 0;
    // }
    this.grid.addToUpdateQueue(this.gridX, this.gridY);
    // if(this.vx == 0 & this.vy == 0){
    //   this.grid.addToUpdateQueue(this.gridX - 1, this.gridY);
    //   this.grid.addToUpdateQueue(this.gridX + 1, this.gridY);
    //   this.grid.addToUpdateQueue(this.gridX, this.gridY - 1);
    //   this.grid.addToUpdateQueue(this.gridX, this.gridY + 1);
    // }else{
    //   if(this.vx != 0){
    //     this.grid.addToUpdateQueue(this.gridX - 1, this.gridY);
    //     this.grid.addToUpdateQueue(this.gridX + 1, this.gridY);
    //   }
    //   if(this.vy != 0){
  
    //     this.grid.addToUpdateQueue(this.gridX, this.gridY - 1);
    //     this.grid.addToUpdateQueue(this.gridX, this.gridY + 1);
    //   }
    // }
      this.grid.addToUpdateQueue(this.gridX - 1, this.gridY);
      this.grid.addToUpdateQueue(this.gridX + 1, this.gridY);
      this.grid.addToUpdateQueue(this.gridX, this.gridY - 1);
      this.grid.addToUpdateQueue(this.gridX, this.gridY + 1);
    
  }
}