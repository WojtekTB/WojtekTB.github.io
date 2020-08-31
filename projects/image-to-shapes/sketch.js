var canvas;

// var imagePath = "./mona-lisa-original.jpg";
var paintingsList = [
  "whisperings-of-love-adolphe.jpg",
  "Toshusai_Sharaku.jpg",
  "nighthawks.jpeg",
  "mona-lisa-original.jpg",
  "le-lever.jpg",
  "girl-with-a-pearl-earing.jpg"
]

var imagePath = "./girl-with-a-pearl-earing.jpg";

var imageToGuess;
var imagePixels;
var population;


var imageWidth, imageHeight;
var myChart;
function preload() {
  imagePath = "./sample-paintings/" + paintingsList[Math.floor(Math.random() * paintingsList.length)];
  imageToGuess = loadImage(imagePath);
}

function setupWithLimit() {

  let factor = 200 / imageToGuess.width;
  imageToGuess.resize(200, imageToGuess.height * factor);
  imageWidth = imageToGuess.width;
  imageHeight = imageToGuess.height;
  imageToGuess.loadPixels();
  imagePixels = imageToGuess.pixels;
  canvas = createCanvas(imageWidth, imageHeight);
  // console.log(imageWidth, imageHeight);
  canvas.parent("myCanvas");
  pixelDensity(1); //as it turns out you need this for some displays such as mac book pro for pixels array to work properly
  background(0);
  population = new Population(imageWidth, imageHeight);
  // frameRate(1);
  drawChart(population.fitnessHistory);

  let imageElement = document.getElementById("actualImage");
  imageElement.src = imagePath;
}

function setup() {
  //100 = w * x
  frameRate(99999);
  let factor = 200 / imageToGuess.width;
  imageToGuess.resize(200, Math.floor(imageToGuess.height * factor));
  console.log(200, Math.floor(imageToGuess.height * factor));
  imageWidth = imageToGuess.width;
  imageHeight = imageToGuess.height;
  imageToGuess.loadPixels();
  imagePixels = imageToGuess.pixels;
  canvas = createCanvas(imageWidth, imageHeight);
  // console.log(imageWidth, imageHeight);
  canvas.parent("myCanvas");
  pixelDensity(1); //as it turns out you need this for some displays such as mac book pro for pixels array to work properly
  background(0);
  population = new Population(imageWidth, imageHeight);
  // frameRate(1);
  drawChart(population.fitnessHistory);

  let imageElement = document.getElementById("actualImage");
  imageElement.src = imagePath;
  // noLoop();
}

function begin() {
  loop();
}

function stop() {
  noLoop();
}

function draw() {
  takeStep();
  if (frameCount % 5000 === 0 && saveCanvasIteration) {
    population.best.show();
    saveCanvas("Generation_" + population.genNumber, "png");
  }
}

function takeStep() {
  population.nextGen();
  myChart.update();
  let genNumLabel = document.getElementById("generationNum");
  genNumLabel.innerHTML = population.genNumber;
  let improvNumLabel = document.getElementById("improvNum");
  improvNumLabel.innerHTML = population.numberOfImprovements;
  let bestFitLabel = document.getElementById("bestFit");
  bestFitLabel.innerHTML = population.best.fitness;
  let mutFitLabel = document.getElementById("mutationFit");
  mutFitLabel.innerHTML = population.mutated.fitness;
}
function loadNewPicture() {
  const selectedFile = document.getElementById('imageToEmulate').files[0];
  console.log(selectedFile);
  const imageElement = document.getElementById("actualImage");
  let placeholderImage = new Image();
  let imageSrc = URL.createObjectURL(selectedFile);
  imageToGuess = loadImage(imageSrc, () => {
    let newW;
    let newH;
    if (imageToGuess.width < imageToGuess.height) {
      newH = Math.floor((200 / imageToGuess.width) * imageToGuess.height);
      newW = 200;
    } else {
      newW = Math.floor((200 / imageToGuess.height) * imageToGuess.width);
      newH = 200;
    }
    imageToGuess.resize(newW, newH);
    imageToGuess.loadPixels();
    imagePixels = imageToGuess.pixels
    resizeCanvas(newW, newH);
    population = new Population(newW, newH);
    drawChart(population.fitnessHistory);

  })
  placeholderImage.src = imageSrc;
  placeholderImage.onload = function () {
    let imageWidth = this.width;
    let imageHeight = this.height;
    let newImageWidth;
    let newImageHeight;
    // console.log(imageWidth, imageHeight);
    if (imageWidth < imageHeight) {
      newImageWidth = `200px`;
      newImageHeight = `${Math.floor((200 / imageWidth) * imageHeight)}px`;
      imageHeight = (200 / imageWidth) * imageHeight;
      imageWidth = 200;
    } else {
      newImageHeight = `200px`;
      newImageWidth = `${Math.floor((200 / imageHeight) * imageWidth)}px`;
      imageWidth = (200 / imageHeight) * imageWidth;
      imageHeight = 200;
    }
    imageElement.style.width = newImageWidth;
    imageElement.style.height = newImageHeight;
    imageElement.src = imageSrc;
  }

}