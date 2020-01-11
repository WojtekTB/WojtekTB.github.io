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
