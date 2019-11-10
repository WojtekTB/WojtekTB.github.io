var myCanvas;
var GRAVITATIONAL_CONSTANT = 6.674 * (10 ^ -11);
var MAX_SPEED = 2;

var planets = [];

function setup() {
  myCanvas = createCanvas(innerWidth, innerHeight);
  myCanvas.parent("resumeSketch");
  planets.push(new Planet(150, innerWidth / 2, innerHeight / 2, true));
  // planets.push(new Planet(40, 800, 400));
  // frameRate(1);
}

function draw() {
  background(0);
  for (planet of planets) {
    planet.run();
  }
}
function mousePressed() {
  planets.push(new Planet(20, mouseX, mouseY, false));
  planets[planets.length - 1].addVel(random(0, 10), random(0, 360));
}

function calculateMagnitude(m1, m2, r) {
  /*
  F = G ((m1*m2)/r^2)
  confusingly enough, r is the destance between 2 masses, and nothing to do with radius seemingly?
  although in some equations it seems to stand for radius of Earth?
  who really knows lol
  */
  return GRAVITATIONAL_CONSTANT * ((m1 * m2) / (r * r));
}

class Planet {
  constructor(size, x, y, isStatic) {
    this.isStatic = isStatic;
    this.planetColor = {
      r: random(0, 255),
      g: random(0, 255),
      b: random(0, 255)
    };
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size; //actually is the radius
    this.mass = ((3 / 4) * PI * size) ^ 3; //volume of sphere
    // this.mass = PI * (size * size);
    if (isStatic) {
      this.mass *= 2;
    }
  }

  draw() {
    noStroke();
    fill(this.planetColor.r, this.planetColor.g, this.planetColor.b);
    circle(this.x, this.y, this.size);
    // stroke(255);
    // strokeWeight(2);
    // fill(0);
    // circle(this.x, this.y, this.size);
  }

  runNoMove() {
    this.draw();
  }

  run() {
    if (!this.isStatic) {
      this.x += this.vx;
      this.y += this.vy;
      for (planet of planets) {
        if (planet.isStatic) {
          let deltaX = planet.x - this.x;
          let deltaY = planet.y - this.y;
          let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          if (distance > 20) {
            let mag = calculateMagnitude(this.mass, planet.mass, distance);
            let angle = this.radToDeg(
              Math.atan((planet.y - this.y) / (planet.x - this.x))
            );

            angle = Math.abs(angle);
            if ((deltaX > 0 && deltaY > 0) || (deltaX === 0 && deltaY > 0)) {
              // console.log("bottom right");
              angle += 90;
              // console.log(angle);
            } else if (
              (deltaX > 0 && deltaY < 0) ||
              (deltaY === 0 && deltaX < 0)
            ) {
              // console.log("top right");
              angle += 180;
              // console.log(angle);
            } else if (
              (deltaX < 0 && deltaY < 0) ||
              (deltaX === 0 && deltaY < 0)
            ) {
              // console.log("top left");
              angle += 270;
              // console.log(angle);
            }
            if (mag < MAX_SPEED) {
              mag = -MAX_SPEED;
            }

            // console.log(deltaX, deltaY);
            // console.log(mag, angle);
            this.addVel(mag, angle);
          }
        }
      }
    }
    this.draw();
  }

  addVel(magnitude, angle) {
    /* 
    The angle is actually in degrees because I am a degenerate who doesn't like to use radiants.
    I am not sorry nor will I ever change.
    Suck it people who like radiants, I refuse to change the error of my ways.

    P.S. The angle begins from the right.
    */
    angle = angle % 360; //277
    let xMag = magnitude * Math.cos(this.degToRad(angle % 90));
    let yMag = magnitude * Math.sin(this.degToRad(angle % 90));
    let xSign = 0;
    let ySign = 0;
    // console.log(angle);
    if (angle > 0 && angle < 90) {
      xSign = 1;
      ySign = -1;
    } else if (angle > 90 && angle < 180) {
      xSign = -1;
      ySign = -1;
    } else if (angle > 180 && angle < 270) {
      xSign = -1;
      ySign = 1;
    } else if (angle > 270 && angle < 360) {
      xSign = 1;
      ySign = 1;
    } else if (angle === 0) {
      xSign = 1;
    } else if (angle === 90) {
      ySign = -1;
    } else if (angle === 180) {
      xSign = 1;
    } else if (angle === 270) {
      ySign = -1;
    }
    this.vx += xMag * xSign;
    this.vy += yMag * ySign;
  }

  degToRad(deg) {
    /*
    Yes I would rather make a function to convert degrees to radiants than to actually use radiants.
    Don't judge me.
    */
    return deg * (PI / 180);
  }
  radToDeg(rad) {
    return rad * (180 / PI);
  }
}
