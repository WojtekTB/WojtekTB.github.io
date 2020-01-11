var globalConvSpeed = 5/10;

class Cell_Empty {
  show(x, y, grid) {
    let scale = grid.scale;
    strokeWeight(1);
    stroke(200, 50, 200, 100);
    fill(0);
    translate(x, y);
    rect(0, 0, scale, scale);
    translate(-x, -y);
    noStroke();

  }
  item_action(item) {
    return { x: item.x, y: item.y };
  }
}

class Cell_Conveyor {
  constructor(direction, speed) {
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
    this.animationFrames = animationFrames_conveyor;
    this.innerFrameCounter = 0;
    this.maxFrames = animationFrames_conveyor.length - 1;
    this.speed = speed;
  }
  show(x, y, grid) {
    let scale = grid.scale;
    /*
     *if there is a conveyor placed here then draw something
     * otherwise just skip it all together, no need to render it
     */
    translate(x, y);
    if (this.direction_up) {
      image(
        this.animationFrames[Math.floor((frameCount * 0.2) % this.maxFrames)],
        0,
        0,
        scale,
        scale
      );
    } else if (this.direction_right) {
      rotate(PI / 2);
      image(
        this.animationFrames[Math.floor((frameCount * 0.2) % this.maxFrames)],
        0,
        -scale,
        scale,
        scale
      );
      rotate(-PI / 2);
    } else if (this.direction_left) {
      rotate((PI * 3) / 2);
      image(
        this.animationFrames[Math.floor((frameCount * 0.2) % this.maxFrames)],
        -scale,
        0,
        scale,
        scale
      );
      rotate(-(PI * 3) / 2);
    } else if (this.direction_down) {
      rotate(PI);
      image(
        this.animationFrames[Math.floor((frameCount * 0.2) % this.maxFrames)],
        -scale,
        -scale,
        scale,
        scale
      );
      rotate(PI);
    }
    this.innerFrameCounter += globalConvSpeed;
    if (this.innerFrameCounter > this.maxFrames) {
      this.innerFrameCounter = 0;
    }
    translate(-x, -y);
  }

  item_action(item) {
    if (this.direction_right) {
        // item.vx += this.speed;
        item.vx += this.speed + globalConvSpeed;
      // item.vx += this.speed * (5 * random(0.2, 1));
    } else if (this.direction_up) {
        // item.vy -= this.speed;
        item.vy -= this.speed + globalConvSpeed;
      // item.vy -= this.speed * (5 * random(0.2, 1));
    } else if (this.direction_left) {
        // item.vx -= this.speed;
        item.vx -= this.speed + globalConvSpeed;
      // item.vx -= this.speed * (5 * random(0.2, 1));
    } else if (this.direction_down) {
        // item.vy += this.speed;
        item.vy += this.speed + globalConvSpeed;
      // item.vy += this.speed * (5 * random(0.2, 1));
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

class Cell_Collector{
  
}