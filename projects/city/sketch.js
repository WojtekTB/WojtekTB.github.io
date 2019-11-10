var screenX = window.innerWidth, screenY = window.innerHeight;
var ambSound;
var frontBuildings = [];
var backBuildings = [];
var stars;
var road;
var totalYoffse;
var clouds;
var carimage;
var cloudimage;
var lampimage;
var lightimage;
var car1;
var car2;//adding another car to move the other way
var peopleOnTopSidewalk = [];
var peopleOnBottomSidewalk = [];
var lampsOnTopSidewalk = [];
var lampsOnBottomSidewalk = [];
var sunImage;
var sun;

var defaultScreenPixels = [];

var testBuild;

var testBusStop;
var stopImage;
var currentTime = 10;

// function changeTime(time){
  // currentTime = time;
//   drawBackground();
// }

// function setupBackgroundSketch(){
//   // testBuild = new Building(500, 500, 0);
//   // testBuild.draw();
// }

// function drawBackgroundSketch(){
//
// }

var backgroundSketch = function(p){
  p.preload = function(){
    carimage = p.loadImage("./images/bus.png");
    cloudimage = p.loadImage("./images/cloud.png");
    sunImage = p.loadImage("./images/sun.png");
    ambSound = p.loadSound("./sounds/traffic.mp3");
  }
  p.setup = function(){
    currentTime = p.hour();
    ambSound.setVolume(0.19);
    ambSound.play();
    p.drawBackground();
    p.drawLayer1();
    p.drawLayer2();
  }

  // p.draw = function(){
  //   savePixels();
  //   if (p.mouseIsPressed) {
  //         if (mouseButton === LEFT) {
  //
  //           }
  //         }
  //       if (ambSound.isPlaying() === false){
  //         ambSound.play();
  //       }
  //     }

      p.changeTime = function(time){
        currentTime = time;
        p.drawBackground();
        for(let i = 0; i < screenX/300; i++){
          lampsOnTopSidewalk[i].updateTime(currentTime);
        }
        for(let i = 0; i < screenX/300; i++){
          lampsOnBottomSidewalk[i].updateTime(currentTime);
        }
      }

      p.createBuildings = function(){
        totalYoffset = (screenY * 1.2)/10;
        let bby = screenY - totalYoffset;
        let fby = screenY - totalYoffset;
        backBuildings = [];
        frontBuildings = [];
        let myCanvas = p.createCanvas(window.innerWidth, window.innerHeight);
        myCanvas.parent("backCanvas");
        backBuildings.push(new BackBuilding(0, bby));
        for(let i = 0; i < (screenX / ((6+3)/2)); i++){
          backBuildings.push(new BackBuilding(backBuildings[i].x + backBuildings[i].buildingWidth + p.random(-5, 5), bby));
        }
        frontBuildings.push(new FrontBuilding(0, fby));
        for(let i = 0; i < (screenX / ((6+3)/2)); i++){
          frontBuildings.push(new FrontBuilding(frontBuildings[i].x + frontBuildings[i].buildingWidth + p.random(-5, 5), fby));
        }
      }

      p.drawBackground = function(){
        p.createBuildings();
        setGradient(0, 0, screenX, screenY, backgroundCanvas.color(184,125,138), backgroundCanvas.color(138,116,165), 1);
        let opasityOfNight = 0;
        if(currentTime > 20 && currentTime < 25){
          opasityOfNight = backgroundCanvas.map(currentTime, 20, 24, 0, 255);
        }
        else if(currentTime > -1 && currentTime < 7){
          opasityOfNight = backgroundCanvas.map(currentTime, 0, 7, 255, 0);
        }
        // console.log("night op: " + opasityOfNight);
        backgroundCanvas.fill(20, 24, 82, opasityOfNight);
        backgroundCanvas.rect(-1, -1, screenX, screenY);
        stars = new Stars();
        stars.show(currentTime);
        let opasityOfDay;
        if(currentTime > 6 && currentTime < 13){
          opasityOfDay = backgroundCanvas.map(currentTime, 6, 13, 0, 255);
          // console.log(opasityOfDay);
        }
        else if(currentTime > 12 && currentTime < 21){
          opasityOfDay = backgroundCanvas.map(currentTime, 13, 21, 255, 0);
        }
        else{
          opasityOfDay = 0;
        }
        // console.log("day op: " + opasityOfDay);
        backgroundCanvas.fill(95, 166, 195, opasityOfDay);
        backgroundCanvas.rect(-1, -1, screenX, screenY);
        // clouds = new Clouds(cloudimage, true);
        // setGradient(0, 0, screenX, screenY, color(135-40,206-40,235-40, opasityOfDay), color(135-40,206-40,250-40, opasityOfDay), 1);
        sun = new Sun();
        sun.show(currentTime, sunImage);
        for(let i = 0; i < frontBuildings.length; i++){
          backBuildings[i].show();
        }
        for(let i = 0; i < frontBuildings.length; i++){
          frontBuildings[i].show();
        }
        road = new Road();
        road.show();
        // image(sunImage, 0, 0, 1000, 1000);
        // let millisecond = millis();
        // fill(0);
        // let curHour = hour();
        // let curMinutes = minute();
        // text(`${curHour}:${curMinutes}`, 0, 0, 200, 200);
      }

      p.drawLayer1 = function(){
        // for(let i = 0; i < frontBuildings.length; i++){
          //   backBuildings[i].simpleShow();
          // }
          // for(let i = 0; i < frontBuildings.length; i++){
            //   frontBuildings[i].simpleShow();
            // }
          }

          p.drawLayer2 = function(){
            road.show();
          }

        }

var backgroundCanvas = new p5(backgroundSketch);



var foregroundSketch = function(p){
  p.preload = function(){
    lampimage = p.loadImage("./images/lamp.png");
    lightimage = p.loadImage("./images/light.png");
    stopImage = p.loadImage("./images/bus_station.png");
  }

  p.setup = function(){
    currentTime = p.hour();
    let myCanvas = p.createCanvas(screenX, screenY);
    myCanvas.parent("frontCanvas");
    car1 = new Car(carimage, true);
    car2 = new Car(carimage, false);
    peopleOnTopSidewalk = [];
    peopleOnBottomSidewalk = [];
    let numOfPeople = 20;
    if(currentTime <= 12){
      numOfPeople = foregroundCanvas.map(currentTime, 0, 12, 3, 20);
    }
    else if(currentTime > 12){
      numOfPeople = foregroundCanvas.map(currentTime, 13, 24, 20, 3);
    }


    road = new Road();

    for(let i = 0; i < numOfPeople; i++){
      peopleOnTopSidewalk.push(new Person(foregroundCanvas.random(0, screenX), road.sidewalkY1 + 5, road.sidewalkY1 + road.h));
    }
    for(let i = 0; i < numOfPeople; i++){
      peopleOnBottomSidewalk.push(new Person(foregroundCanvas.random(0, screenX), road.sidewalkY2 + 5, road.sidewalkY2 + road.h));
    }
    // console.log(road.y);



    for(let i = 0; i < screenX/300; i++){
      lampsOnTopSidewalk.push(new StreetLamp( (300 * i) + getRandomInt(-10, 10), ((screenY - ((screenY * 1.2)/10)) + 2), currentTime, lampimage, lightimage));
    }
    for(let i = 0; i < screenX/300; i++){
      lampsOnBottomSidewalk.push(new StreetLamp( (300 * i) + getRandomInt(-10, 10), screenY - 9, currentTime, lampimage, lightimage));
    }
    for(let i = 0; i < screenX/300; i++){
      lampsOnTopSidewalk[i].updateTime(currentTime);
    }
    for(let i = 0; i < screenX/300; i++){
      lampsOnBottomSidewalk[i].updateTime(currentTime);
    }

    testBusStop = new BusStop(foregroundCanvas.random(200, screenX - 200), road.y, stopImage);
    // testlamp = new StreetLamp(400, 400, currentTime lampimage, lightimage);
  }

  p.draw = function(){
    p.clear();
    p.drawLayer3();
    p.drawLayer4();
    p.drawLayer5();
    // testlamp.draw();
    // testlamp.drawLight();
  }
  p.drawLayer3 = function(){
    for(let i = 0; i < lampsOnTopSidewalk.length; i++){
      lampsOnTopSidewalk[i].draw();
      testBusStop.draw();
    }

    for(let i = 0; i < peopleOnTopSidewalk.length; i++){
      peopleOnTopSidewalk[i].draw();
    }
    for(let i = 0; i < lampsOnTopSidewalk.length; i++){
      lampsOnTopSidewalk[i].drawLight();
    }
  }

  p.drawLayer4 = function(){
    car1.show();
    car2.show();
  }

  p.drawLayer5 = function(){
    for(let i = 0; i < lampsOnBottomSidewalk.length; i++){
      lampsOnBottomSidewalk[i].draw();
    }
    for(let i = 0; i < peopleOnBottomSidewalk.length; i++){
      peopleOnBottomSidewalk[i].draw();
    }

    let fps = p.frameRate();
    p.fill(255);
    // stroke(0);
    p.text("FPS: " + fps.toFixed(2), 5, p.height - 10);
    for(let i = 0; i < lampsOnBottomSidewalk.length; i++){
      lampsOnBottomSidewalk[i].drawLight();
    }
  }
}



// function preloadBackgroundSketch(){
  // }

  var foregroundCanvas = new p5(foregroundSketch);


// function drawForegroundSketch(){
//   drawLayer3();
//   drawLayer4();
//   drawLayer5();
// }

function savePixels(){
  for(let i = 0; i < screenY; i++){
    defaultScreenPixels[i] = [];
    for(let j = 0; j < screenX; j++){
      defaultScreenPixels[i].push(get(j, i));
    }
    console.log("did 1 row, " + (screenY - i) +" rows to go");
  }
}


function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// function drawLayer1(){
//   for(let i = 0; i < frontBuildings.length; i++){
//     backBuildings[i].simpleShow();
//   }
//   for(let i = 0; i < frontBuildings.length; i++){
//     frontBuildings[i].simpleShow();
//   }
// }
//
// function drawLayer2(){
//   road.show();
// }

// function drawLayer3(){
//   for(let i = 0; i < peopleOnTopSidewalk.length; i++){
//     peopleOnTopSidewalk[i].draw();
//   }
// }
//
// function drawLayer4(){
//   car1.show();
//   car2.show();
// }
//
// function drawLayer5(){
//   for(let i = 0; i < peopleOnBottomSidewalk.length; i++){
//     peopleOnBottomSidewalk[i].draw();
//   }
//
//   let fps = frameRate();
//   fill(255);
//   // stroke(0);
//   text("FPS: " + fps.toFixed(2), 5, height - 10);
// }



// function drawBackground(){
//   createBuildings();
//   setGradient(0, 0, screenX, screenY, color(184,125,138), color(138,116,165), 1);
//   let opasityOfNight = 0;
//   if(currentTime > 20 && currentTime < 25){
//     opasityOfNight = map(currentTime, 20, 24, 0, 255);
//   }
//   else if(currentTime > -1 && currentTime < 7){
//     opasityOfNight = map(currentTime, 0, 7, 255, 0);
//   }
//   // console.log("night op: " + opasityOfNight);
//   fill(20, 24, 82, opasityOfNight);
//   rect(-1, -1, screenX, screenY);
//   stars = new Stars();
//   stars.show(currentTime);
//   let opasityOfDay;
//   if(currentTime > 6 && currentTime < 13){
//     opasityOfDay = map(currentTime, 6, 13, 0, 255);
//     // console.log(opasityOfDay);
//   }
//   else if(currentTime > 12 && currentTime < 21){
//     opasityOfDay = map(currentTime, 13, 21, 255, 0);
//   }
//   else{
//     opasityOfDay = 0;
//   }
//   // console.log("day op: " + opasityOfDay);
//   fill(95, 166, 195, opasityOfDay);
//   rect(-1, -1, screenX, screenY);
//   // clouds = new Clouds(cloudimage, true);
//   // setGradient(0, 0, screenX, screenY, color(135-40,206-40,235-40, opasityOfDay), color(135-40,206-40,250-40, opasityOfDay), 1);
//   sun = new Sun();
//   sun.show(currentTime, sunImage);
//   for(let i = 0; i < frontBuildings.length; i++){
//     backBuildings[i].show();
//   }
//   for(let i = 0; i < frontBuildings.length; i++){
//     frontBuildings[i].show();
//   }
//   road = new Road();
//   road.show();
//   car1 = new Car(carimage, true);
//   car2 = new Car(carimage, false);
//   peopleOnTopSidewalk = [];
//   peopleOnBottomSidewalk = [];
//   if(currentTime <= 12){
//     numOfPeople = map(currentTime, 0, 12, 3, 20);
//   }
//   else if(currentTime > 12){
//     numOfPeople = map(currentTime, 13, 24, 20, 3);
//   }
//
//   for(let i = 0; i < numOfPeople; i++){
//     peopleOnTopSidewalk.push(new Person(random(0, screenX), road.sidewalkY1 + 5, road.sidewalkY1 + road.h));
//   }
//   for(let i = 0; i < numOfPeople; i++){
//     peopleOnBottomSidewalk.push(new Person(random(0, screenX), road.sidewalkY2 + 5, road.sidewalkY2 + road.h));
//   }
//   // image(sunImage, 0, 0, 1000, 1000);
//   // let millisecond = millis();
//   // fill(0);
//   // let curHour = hour();
//   // let curMinutes = minute();
//   // text(`${curHour}:${curMinutes}`, 0, 0, 200, 200);
// }

// function createBuildings(){
//   totalYoffset = (screenY * 1.2)/10;
//   let bby = screenY - totalYoffset;
//   let fby = screenY - totalYoffset;
//   backBuildings = [];
//   frontBuildings = [];
//   createCanvas(window.innerWidth, window.innerHeight);
//   backBuildings.push(new BackBuilding(0, bby));
//   for(let i = 0; i < (screenX / ((6+3)/2)); i++){
//     backBuildings.push(new BackBuilding(backBuildings[i].x + backBuildings[i].buildingWidth + random(-5, 5), bby));
//   }
//   frontBuildings.push(new FrontBuilding(0, fby));
//   for(let i = 0; i < (screenX / ((6+3)/2)); i++){
//     frontBuildings.push(new FrontBuilding(frontBuildings[i].x + frontBuildings[i].buildingWidth + random(-5, 5), fby));
//   }
// }

function setGradient(x, y, w, h, c1, c2, axis) {
  backgroundCanvas.noFill();

  if (axis === 1) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = backgroundCanvas.map(i, y, y + h, 0, 1);
      let c = backgroundCanvas.lerpColor(c1, c2, inter);
      backgroundCanvas.stroke(c);
      backgroundCanvas.line(x, i, x + w, i);
    }
  } else if (axis === 2) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = backgroundCanvas.map(i, x, x + w, 0, 1);
      let c = backgroundCanvas.lerpColor(c1, c2, inter);
      backgroundCanvas.stroke(c);
      backgroundCanvas.line(i, y, i, y + h);
    }
  }
}
