class Asteroid {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.points = [];
      let numberOfPoints = 12; //12 points that asteroid is drawn from
      this.overallSize = random(1, 5);
      this.killRadius = 20 + this.overallSize * 4;
      for (let i = 0; i < numberOfPoints; i++) {
        let distance = random(
          this.killRadius/2,
          this.killRadius
        );
        let angle = random(
          (360 / numberOfPoints) * i,
          (360 / numberOfPoints) * (i + 1)
        );
        this.points.push({
          x: distance * Math.cos(toRadians(angle)),
          y: distance * Math.sin(toRadians(angle))
        });
      }
      this.previousGridX = this.getGridX();
      this.previousGridY = this.getGridY();
      asteroidGrid.grid[this.previousGridY][this.previousGridX].push(this);
    }
  
    getGridX(){
      return Math.floor((this.x)/gridSize);
    }
    getGridY(){
      return Math.floor((this.y)/gridSize);
    }
  
    run() {
      this.render();
      this.move();
      // console.log(this.getGridX() + " " + this.getGridY())
    }
  
    render() {
      // noFill();
      fill(0);
      stroke(255);
      beginShape();
      for (let i = 0; i < this.points.length; i++) {
        vertex(this.points[i].x + this.x, this.points[i].y + this.y);
      }
      vertex(this.points[0].x + this.x, this.points[0].y + this.y);
      endShape();
    }
  
    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x > innerWidth) {
        this.x = 0;
      } else if (this.x < 0) {
        this.x = innerWidth;
      }
      if (this.y > innerHeight) {
        this.y = 0;
      } else if (this.y < 0) {
        this.y = innerHeight;
      }
    }
  }