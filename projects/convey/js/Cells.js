var globalConvSpeed = 5/10;

/*
 * Note to future self:
 
   - Don't change any show, or constructor arguements, they are fine as they are, and grid's place functions already take care of formating for them
   - Quit doing that shit, I get confused every time I change them and it is very dificult to fix
 */

class Cell_Empty {
  constructor(x, y, grid) {
    this.grid = grid;
  }

  update(x, y){
    this.show(x, y);
  }

  show(x, y) {
    let scale = this.grid.scale;
    strokeWeight(1);
    stroke(160, 10, 160);
    fill(0);
    translate(x, y);
    rect(0, 0, scale, scale);
    translate(-x, -y);
    noStroke();

  }
  item_action(item) {
    return;
  }
}

class Cell_Conveyor {
  constructor(x, y, direction, speed, grid) {
    //direction of the conveyor belt that would be on the cell if any at all
    this.direction_right = false;
    this.direction_up = false;
    this.direction_left = false;
    this.direction_down = false;
    if (direction == RIGHT) {
      this.direction_right = true;
    } else if (direction == UP) {
      this.direction_up = true;
    } else if (direction == LEFT) {
      this.direction_left = true;
    } else if (direction == DOWN) {
      this.direction_down = true;
    }
    
    this.grid = grid;
    this.animationFrames = animationFrames_conveyor;
    this.innerFrameCounter = 0;
    this.maxFrames = animationFrames_conveyor.length - 1;
    this.speed = speed;

  }

  update(x, y){
    this.show(x, y);
  }

  show(x, y) {
    let scale = this.grid.scale;
    // if(this.grid.itemGrid[Math.floor(y/this.grid.scale)][Math.floor(x/this.grid.scale)].length < 1){
    //   console.log(Math.floor(y/this.grid.scale), Math.floor(x/this.grid.scale));
    //   return;
    // }
    /*
     *if there is a conveyor placed here then draw something
     * otherwise just skip it all together, no need to render it
     */
    
    translate(x, y);
    if (this.direction_up) {
      image(
        // this.animationFrames[Math.floor((frameCount * (globalConvSpeed/1.7)) % this.maxFrames)],
        this.animationFrames[Math.floor(this.innerFrameCounter)],
        0,
        0,
        scale,
        scale
      );
    } else if (this.direction_right) {
      rotate(PI / 2);
      image(
        // this.animationFrames[Math.floor((frameCount * (globalConvSpeed/1.7)) % this.maxFrames)],
        this.animationFrames[Math.floor(this.innerFrameCounter)],
        0,
        -scale,
        scale,
        scale
      );
      rotate(-PI / 2);
    } else if (this.direction_left) {
      rotate((PI * 3) / 2);
      image(
        // this.animationFrames[Math.floor((frameCount * (globalConvSpeed/1.7)) % this.maxFrames)],
        this.animationFrames[Math.floor(this.innerFrameCounter)],
        -scale,
        0,
        scale,
        scale
      );
      rotate(-(PI * 3) / 2);
    } else if (this.direction_down) {
      rotate(PI);
      image(
        // this.animationFrames[Math.floor((frameCount * (globalConvSpeed/1.7)) % this.maxFrames)],
        this.animationFrames[Math.floor(this.innerFrameCounter)],
        -scale,
        -scale,
        scale,
        scale
      );
      rotate(PI);
    }
    translate(-x, -y);
  }

  item_action(item) {
    if (this.direction_right) {
        // item.vx += this.speed;
        item.vx += globalConvSpeed;
      // item.vx += this.speed * (5 * random(0.2, 1));
    } else if (this.direction_up) {
        // item.vy -= this.speed;
        item.vy -= globalConvSpeed;
      // item.vy -= this.speed * (5 * random(0.2, 1));
    } else if (this.direction_left) {
        // item.vx -= this.speed;
        item.vx -= globalConvSpeed;
      // item.vx -= this.speed * (5 * random(0.2, 1));
    } else if (this.direction_down) {
        // item.vy += this.speed;
        item.vy += globalConvSpeed;
      // item.vy += this.speed * (5 * random(0.2, 1));
    }

    this.innerFrameCounter += globalConvSpeed;
    if (this.innerFrameCounter > this.maxFrames) {
      this.innerFrameCounter = 0;
    }
    // console.log(Math.floor(item.y/grid.scale),
    // Math.floor(item.x/grid.scale));
    
    // grid.grid[Math.floor(item.y/grid.scale)][Math.floor(item.x/grid.scale)].show(
    //   Math.floor(item.y/grid.scale),
    //   Math.floor(item.x/grid.scale),
    //   grid.scale
    // );
  }
}

class Cell_Collector {
  constructor(gridX, gridY, direction, grid) {
    this.direction_right = false;
    this.direction_up = false;
    this.direction_left = false;
    this.direction_down = false;
    if (direction == RIGHT) {
      this.direction_right = true;
    } else if (direction == UP) {
      this.direction_up = true;
    } else if (direction == LEFT) {
      this.direction_left = true;
    } else if (direction == DOWN) {
      this.direction_down = true;
    }
    this.grid = grid;
    this.x = gridX;
    this.y = gridY;
    this.animationFrames = animationFrames_collector;
    this.show(
      this.x * this.grid.scale + mapOffsetX,
      this.y * this.grid.scale + mapOffsetY
    );
  }

  update(x, y){
    this.show(x, y);
    console.log("updated");
  }

  show(x, y) {
    let scale = this.grid.scale;
    translate(x, y);
    if (this.direction_up) {
      image(this.animationFrames[0], 0, 0, scale, scale);
    } else if (this.direction_right) {
      rotate(PI / 2);
      image(this.animationFrames[0], 0, -scale, scale, scale);
      rotate(-PI / 2);
    } else if (this.direction_left) {
      rotate((PI * 3) / 2);
      image(this.animationFrames[0], -scale, 0, scale, scale);
      rotate(-(PI * 3) / 2);
    } else if (this.direction_down) {
      rotate(PI);
      image(this.animationFrames[0], -scale, -scale, scale, scale);
      rotate(PI);
    }
    translate(-x, -y);
  }
  item_action(item) {
    //basically make collision for the box, making it solid so items can't go inside of it
    if (Math.abs(item.vx) > Math.abs(item.vy)) {
      if (item.vx > 0) {
        item.vx = 0;
        item.x = this.x * this.grid.scale - 0.0001;
      } else if (item.vx < 0) {
        item.vx = 0;
        item.x = (this.x + 1) * this.grid.scale;
      }
    } else {
      if (item.vy > 0) {
        item.vy = 0;
        item.y = this.y * this.grid.scale - 0.0001;
      } else if (item.vy < 0) {
        item.vy = 0;
        item.y = (this.y + 1) * this.grid.scale;
      }
    }
  }
}