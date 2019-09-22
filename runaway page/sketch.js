var myCanvas;

var grid = {
  width: 30,
  height: 50,
  scale: 20
};

var distanceSlider;
var volumeSlider;

var skybox;
var song;
var amplitude;

function preload() {
  skybox = loadImage("./skybox.jpg");
  song = loadSound("./song.mp3");
}

function setup() {
  alert("please click the screen to begin the song");
  myCanvas = createCanvas(innerWidth, innerHeight, WEBGL);
  myCanvas.parent("mainSketch");
  distanceSlider = createSlider(0, grid.height * 10, grid.height);
  distanceSlider.position(10, 10);

  volumeSlider = createSlider(0, 5, 1);
  volumeSlider.position(10, 30);

  userStartAudio().then(function() {
    song.play();
    myDiv.remove();
  });
  amplitude = new p5.Amplitude();
}
var rotation = 0;

var cameraZoom = 0;
var begin = true;
var travel = 0;

function draw() {
  //   if (song.isPlaying()) {
  //     // .isPlaying() returns a boolean
  //     song.play();
  //   }
  background(0);
  grid.height = distanceSlider.value();
  let zoomOut = grid.scale * (grid.height - 1);

  translate(0, -400, -1000);
  noStroke();
  texture(skybox);
  plane(width * 2.5, height * 2.5);
  translate(0, 400, 1000);

  translate(0, 0, 600);

  //   image(skybox, -width / 2, -height / 2, width, height);

  let mountRange = 1;
  let minRange = 10;
  let step = 0.2;
  let diff = 10;

  //   blendMode(SCREEN);
  if (begin) {
    if (cameraZoom > zoomOut) {
      begin = false;
    } else {
      cameraZoom += 30;
    }
  } else {
    cameraZoom = zoomOut;
    travel -= step;
  }
  translate(-(grid.width * 10), 50, -cameraZoom); //move to top left
  //   noFill();
  let fillColor = map(amplitude.getLevel(), 0, 1, 0, 255);
  let rANDb = map(amplitude.getLevel(), 0, 1, 0, 75);
  let g = map(amplitude.getLevel(), 0, 1, 0, 255);

  //   fill(fillColor, 0, fillColor);
  fill(0);
  stroke(fillColor + 100, 0, fillColor + 100);
  strokeWeight(0.5);
  rotateX(PI / 2 - 0.02);
  for (let y = 0; y < grid.height; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < grid.width; x++) {
      if (
        (x > grid.width * ((diff / 2 - 2) / diff)) &
        (x < grid.width * ((diff / 2 + 2) / diff))
      ) {
        mountRange = 30;
      } else {
        if (x < grid.width * ((diff / 2 - 2) / diff)) {
          mountRange = map(
            x,
            0,
            grid.width * ((diff / 2 - 2) / diff),
            250,
            20 + minRange
          );
        } else {
          mountRange = map(
            x,
            grid.width * ((diff / 2 + 2) / diff),
            grid.width,
            50 + minRange,
            250
          );
        }
        // mountRange = 100;
      }
      vertex(
        x * grid.scale + grid.scale,
        y * grid.scale + grid.scale,
        map(
          noise((x + 1) * step, (y + 1) * step + travel),
          0,
          1,
          minRange,
          mountRange
        )
      );
      vertex(
        x * grid.scale,
        y * grid.scale + grid.scale,
        map(
          noise(x * step, (y + 1) * step + travel),
          0,
          1,
          minRange,
          mountRange
        )
      );
      vertex(
        x * grid.scale,
        y * grid.scale,
        map(noise(x * step, y * step + travel), 0, 1, minRange, mountRange)
      );
      vertex(
        x * grid.scale + grid.scale,
        y * grid.scale,
        map(
          noise((x + 1) * step, y * step + travel),
          0,
          1,
          minRange,
          mountRange
        )
      );
      vertex(
        x * grid.scale + grid.scale,
        y * grid.scale + grid.scale,
        map(
          noise((x + 1) * step, (y + 1) * step + travel),
          0,
          1,
          minRange,
          mountRange
        )
      );
    }
    endShape();
  }
}
