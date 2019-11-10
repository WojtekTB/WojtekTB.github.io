function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



class Building{
  constructor(x, y, color, winColor){
    const permutations = {
      builType: 1,
      roofType: 3,
      winType: 3,
      winLitFreq: 1,
      builAtt: 2,
      mainAcc1: 1,
      mainAcc2: 1,
      attAcc1: 1,
      attAcc2: 1
    }
    this.x = x;
    this.y = y;
    this.width = getRandomInt(90, 130);
    this.height = getRandomInt(200, 300);
    this.color = [5, 20, 27];
    this.winColor = [10, 40, 48];
    this.seed = [
                getRandomInt(1, permutations.builType),
                getRandomInt(1, permutations.roofType),
                getRandomInt(1, permutations.winType),
                getRandomInt(1, permutations.winLitFreq),
                getRandomInt(1, permutations.builAtt),
                getRandomInt(1, permutations.mainAcc1),
                getRandomInt(1, permutations.mainAcc2),
                getRandomInt(1, permutations.attAcc1),
                getRandomInt(1, permutations.attAcc2)
                ];
    //type of windows, frequency of lit up windows, building attatchments, accessories1, accessories2, attatchment building accessories1, attatchment building accessories2
  }

  draw(){
    this.drawBuilding();
    this.drawRoof();
    this.drawWindows();
    this.drawBuildingAttatchments();
  }

  drawBuilding(){
    if(this.seed[0] == 1){//if building type 0, simple rectangle
      fill(this.color[0], this.color[1], this.color[2]);
      rect(this.x, this.y - this.height, this.width, this.height);
    }
  }
  drawRoof(){
    if(this.seed[1] == 2){//roof with a roof exit door
      //skip to 2 because 1 is just flat roof
      fill(this.color[0], this.color[1], this.color[2]);
      rect(this.x + getRandomInt(0, (this.width * 2)/3), this.y - this.height - 20, this.width/3, 20);
    }
    else if(this.seed[1] == 3){//railing
      fill(this.color[0], this.color[1], this.color[2]);
      rect(this.x, this.y - this.height - 6, this.width, 2);

      let railSpacing = 3;
      let railWidth = 2
      let numOfRails = this.width/(railWidth+railSpacing)
      for(let i = 0; i < numOfRails-1; i++){
        rect(this.x + ((railSpacing+railWidth)*i), this.y - this.height, railWidth, -6);
      }
      rect(this.x + this.width - railWidth, this.y - this.height, railWidth, -6);
    }
  }
  drawWindows(){
    this.drawAttWindows(this.x, this.y, this.width, this.height, 8);
  }

  drawBuildingAttatchments(){
    if(this.seed[4] == 2){//square to the right
      //skip to 2 because 1 is not attatchments
      let attHeight = (this.height*2)/3;
      let attWidth = getRandomInt((this.width * 5)/3, this.width*2) ;
      let attX = this.x;
      let attY = this.y;
      fill(this.color[0], this.color[1], this.color[2]);
      rect(attX, attY, attWidth, -attHeight);
      this.drawAttWindows(attX, attY, attWidth, attHeight, 5);
    }
  }

  drawAttWindows(inputX, inputY, inputWidth, inputHeight, topPadd){
    if(this.seed[2] == 1){//standard square evenly spaced windows but with windows split in two
      fill(this.winColor[0], this.winColor[1], this.winColor[2]);
      let winWidth = 10;
      let padding = 8;
      let spacing = 3;
      let numbOfWinPerRow = (inputWidth - (padding*2))/(winWidth+spacing+1);
      let numbOfWinPerCol = (inputHeight - (padding*2))/(winWidth+spacing) - 2;
      for(let j = 0; j < numbOfWinPerCol; j++){
        for(let i = 0; i < numbOfWinPerRow; i++){
          rect(inputX + padding + (i*(winWidth+spacing)), (inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, winWidth, winWidth);
        }
      }
    }
    else if(this.seed[2] == 2){//standard square evenly spaced windows but with windows split in two horizontally
      fill(this.winColor[0], this.winColor[1], this.winColor[2]);
      let winWidth = 15;
      let padding = 10;
      let spacing = 5;
      let numbOfWinPerRow = (inputWidth - (padding*2))/(winWidth+spacing+1);
      let numbOfWinPerCol = (inputHeight - (padding*2))/(winWidth+spacing) - 2;
      for(let j = 0; j < numbOfWinPerCol; j++){
        for(let i = 0; i < numbOfWinPerRow; i++){
          rect(inputX + padding + (i*(winWidth+spacing)),( inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, ((winWidth - 4)/2), winWidth);
          rect((inputX + padding + (i*(winWidth+spacing))) + ((winWidth - 4)/2) + 2, (inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, ((winWidth - 4)/2), winWidth);
        }
      }
    }
    else if(this.seed[2] == 3){//standard square evenly spaced windows but with windows split in two vertically
      fill(this.winColor[0], this.winColor[1], this.winColor[2]);
      let winWidth = 15;
      let padding = 10;
      let spacing = 5;
      let numbOfWinPerRow = (inputWidth - (padding*2))/(winWidth+spacing);
      let numbOfWinPerCol = (inputHeight - (padding*2))/(winWidth+spacing) - 2;
      for(let j = 0; j < numbOfWinPerCol; j++){
        for(let i = 0; i < numbOfWinPerRow; i++){
          rect(inputX + padding + (i*(winWidth+spacing)), (inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, winWidth-1, (winWidth - 4)/2);
          rect(inputX + padding + (i*(winWidth+spacing)), (inputY + (j*(winWidth+spacing)) + ((winWidth - 4)/2) - inputHeight + 2 ) + topPadd, winWidth -1, (winWidth - 4)/2);
        }
      }
    }
  }

}

const colorScheme = {
  fbColor: [121, 142, 176],
  fbWinColor: [122, 155, 189],
  bbColor: [158,136,158],
  bbWinColor: [165,143,165]
}

class FrontBuilding{
  constructor(x, y){
    let maxHeight = 20;
    let minHeight = 13;
    let maxWidth = 6;
    let minWidth = 3;
    this.scale = 10;
    this.x = x;
    this.y = y;
    this.colorScheme = colorScheme;
    this.buildingHeight = getRandomInt(minHeight, maxHeight) * this.scale;
    this.buildingWidth = getRandomInt(minWidth, maxWidth) * this.scale;
    this.roofGlow = getRandomInt(0, 4);

    this.windowPadding = (this.scale/5);
    this.windowWandH = this.scale - (this.windowPadding * 2);
    this.windows = [];
    for(let y = 0; y < (Math.floor((this.buildingHeight - (2 * this.scale))/this.scale)); y++){
      for(let x = 0; x < Math.floor((this.buildingWidth-this.scale)/this.scale); x++){
        this.windows.push([(((this.windowPadding * 2) * y) + (this.windowWandH * y) + this.windowPadding),
          (this.windowPadding * 3.5) + (this.windowWandH * x) + (2 * this.windowPadding * x), getRandomInt(0, 150)]);
      }
    }
    // console.log(this.windows[0][2]);
    // console.log({x: this.x, y: this.y, w: this.buildingWidth, h: this.buildingHeight, WandH: this.windowWandH});
  }

  changeColor(){
    let opasityOfDay;
    if(currentTime < 12){
      opasityOfDay = Math.floor(backgroundCanvas.map(currentTime, 0, 12, -60, 10));
    }
    else{
      opasityOfDay = Math.floor(backgroundCanvas.map(currentTime, 12, 24, 10, -60));
    }
    this.currentBuildingColor = [];
    this.currentWindowColor = [];
    for(let i = 0; i < 3; i++){
      this.currentBuildingColor[i] = this.colorScheme.fbColor[i] + opasityOfDay;
    }
    for(let i = 0; i < 3; i++){
      this.currentWindowColor[i] = this.colorScheme.fbWinColor[i] + opasityOfDay;
    }
    // console.log(opasityOfDay);
  }

  show(){
    this.changeColor();
    backgroundCanvas.noStroke();
    backgroundCanvas.fill(this.currentBuildingColor);
    backgroundCanvas.rect(this.x, this.y - this.buildingHeight, this.buildingWidth, this.buildingHeight);
    if(this.buildingWidth > 3 * this.scale){
      if(this.roofGlow === 0){
        backgroundCanvas.fill(this.currentBuildingColor);
        backgroundCanvas.rect(this.x + backgroundCanvas.random(10, 2*this.scale), this.y - this.buildingHeight+1, 2, -5);
      }
      backgroundCanvas.fill(this.currentBuildingColor);
      backgroundCanvas.rect(this.x + 5, this.y - this.buildingHeight+1, this.buildingWidth - 10, -3);
    }
    for(let i = 0; i < this.windows.length; i++){
      if(this.windows[i][2] === 0){
        backgroundCanvas.fill(179,196,161);
      }
      else if(this.windows[i][2] === 1){
        backgroundCanvas.fill(153,206,251);
      }
      // else if(this.windows[i][2] === 3){
      //   fill(this.colorScheme.fbColor);
      // }
      else{
        backgroundCanvas.fill(this.currentWindowColor);
      }
      backgroundCanvas.rect(this.windows[i][1] + this.x, this.windows[i][0] + this.y - this.buildingHeight + this.windowPadding, this.windowWandH, this.windowWandH);
    }
  }

  update(){}
}

class BackBuilding{
  constructor(x, y){
    let maxHeight = 40;
    let minHeight = 23;
    let maxWidth = 6;
    let minWidth = 3;
    this.scale = 10;
    this.x = x;
    this.y = y;
    this.colorScheme = colorScheme;
    this.buildingHeight = getRandomInt(minHeight, maxHeight) * this.scale;
    this.buildingWidth = getRandomInt(minWidth, maxWidth) * this.scale;

    this.windowPadding = (this.scale/5);
    this.windowWandH = this.scale - (this.windowPadding * 2);
    this.windows = [];
    for(let y = 0; y < (Math.floor((this.buildingHeight - (2 * this.scale))/this.scale)); y++){
      for(let x = 0; x < Math.floor((this.buildingWidth-this.scale)/this.scale); x++){
        this.windows.push([(((this.windowPadding * 2) * y) + (this.windowWandH * y) + this.windowPadding),
          (this.windowPadding * 3.5) + (this.windowWandH * x) + (2 * this.windowPadding * x)]);
      }
    }
    this.changeColor();
    // console.log(this.windows[0][2]);
    // console.log({x: this.x, y: this.y, w: this.buildingWidth, h: this.buildingHeight, WandH: this.windowWandH});
  }

  changeColor(){
    let opasityOfDay;
    if(currentTime < 12){
      opasityOfDay = Math.floor(backgroundCanvas.map(currentTime, 0, 12, -60, 10));
    }
    else{
      opasityOfDay = Math.floor(backgroundCanvas.map(currentTime, 12, 24, 10, -60));
    }
    this.currentBuildingColor = [];
    this.currentWindowColor = [];
    for(let i = 0; i < 3; i++){
      this.currentBuildingColor[i] = this.colorScheme.bbColor[i] + opasityOfDay;
    }
    for(let i = 0; i < 3; i++){
      this.currentWindowColor[i] = this.colorScheme.bbWinColor[i] + opasityOfDay;
    }
    // console.log(opasityOfDay);
  }

  show(){
    this.changeColor();
    backgroundCanvas.noStroke();
    // console.log(this.colorScheme.bbColor);
    // console.log(this.currentBuildingColor);
    backgroundCanvas.fill(this.currentBuildingColor);
    backgroundCanvas.rect(this.x, this.y - this.buildingHeight, this.buildingWidth, this.buildingHeight);
    for(let i = 0; i < this.windows.length; i++){
      backgroundCanvas.fill(this.currentWindowColor);
      // console.log(this.windows[i][2]);
      backgroundCanvas.rect(this.windows[i][1] + this.x, this.windows[i][0] + this.y - this.buildingHeight + this.windowPadding, this.windowWandH, this.windowWandH);
    }
  }


}

let starColors = {
  c1: [217,148,184],
  c2: [246,246,246],
  c3: [217,148,128],
}

class Stars{
  constructor(){
    this.numberOfStars = 100;
    this.stars = [];
    for(let i = 0; i < this.numberOfStars; i++){
      this.stars.push([backgroundCanvas.random((screenX)/30, (screenX*29)/30), backgroundCanvas.random((screenY)/30, (screenY * 29)/30 - totalYoffset*2), Math.floor(backgroundCanvas.random(1, 4))]);//x, y, color
    }
  }

  show(time){
    // console.log(time);
    if(time <= 7 || time >= 19){
      for(let i = 0; i < this.numberOfStars; i++){
        backgroundCanvas.noStroke();
        if(this.stars[i][2] === 1){
          backgroundCanvas.fill(starColors.c1);
        }
        else if(this.stars[i][2] === 2){
          backgroundCanvas.fill(starColors.c2);
        }
        else if(this.stars[i][2] === 3){
          backgroundCanvas.fill(starColors.c3);
        }
        backgroundCanvas.rect(this.stars[i][0], this.stars[i][1], 2, 4);
      }
    }
  }
}
//
// class Clouds{
//   constructor(cloudimg, show){
//     this.cloudimg = cloudimg;
//     this.show = show;
//     this.heaviness = 4;//number of formations
//     this.bulk = 4;//number of clouds per formation
//   }
//   show(){
//     image(this.cloudimg, mouseX, mouseY, 200, 200);
//   }
// }

class Sun{
  show(hours, sunimg){
    let size;
    let height;
    let tintValue;
    if(hours < 12){
      size = backgroundCanvas.map(hours, 0, 12, screenX/4, screenX/2);
      height = backgroundCanvas.map(hours, 0, 12, screenY*1.3, screenY/2 - 400);
      tintValue = backgroundCanvas.map(hours, 0, 12, 100, 255);
    }
    else{
      let calculatedTime = 24 - hours;
      size = backgroundCanvas.map(calculatedTime, 0, 12, screenX/4, screenX/2);
      height = backgroundCanvas.map(calculatedTime, 0, 12, screenY*1.3, screenY/2 - 400);
      tintValue = backgroundCanvas.map(calculatedTime, 0, 12, 100, 255);
    }
    // backgroundCanvas.tint(255, tintValue);
    backgroundCanvas.image(sunimg, height, height, size, size);
    console.log(height);
  }
}

class Road{
  constructor(){
    let totalYoffset = (screenY * 1.2)/10;
    this.x = 0;
    this.y = screenY - totalYoffset;
    this.w = 25;//50
    this.h = 12;//12
    this.perspectiveOffset = 15;
    this.sidewalkY1 = this.y;
    this.sidewalkY2 = this.y + ((screenY * 1.2)/10) - this.h;
    this.howDark = 255;
  }

  changeTint(){
    let opasityOfDay;
    if(currentTime < 12){
      opasityOfDay = Math.floor(backgroundCanvas.map(currentTime, 12, 24, 45, 0));
    }
    else{
      opasityOfDay = Math.floor(backgroundCanvas.map(currentTime, 0, 12, 0, 45));
    }9
    this.howDark = opasityOfDay;
  }

  showSidewalk(yOffset){
    // strokeWeight(1);
    // stroke(10);
    backgroundCanvas.fill(156, 156, 168);
    for(let i = 0; i < screenX/this.w + 1; i++){
      backgroundCanvas.quad(this.x - (this.w/2) + ((this.w + 2) * i), this.y + yOffset,
        this.x - (this.w/2) + this.w + ((this.w + 2) * i), this.y + yOffset,
        this.x - (this.w/2) + this.w + this.perspectiveOffset + ((this.w + 2) * i), this.y + this.h + yOffset,
        this.x - (this.w/2) + this.perspectiveOffset + ((this.w + 2) * i), this.y + this.h + yOffset);
    }
  }
  showRoad(yOffset){
    backgroundCanvas.fill(113, 97, 97);
    backgroundCanvas.quad(this.x, this.y+this.h,
      this.x + screenX, this.y+this.h,
      this.x + screenX, screenY - this.h,
      this.x, screenY - this.h);
    backgroundCanvas.fill(255, 229, 229);
    for(let i = 0; i < screenX/this.w + 1; i++){
      backgroundCanvas.quad(this.x - (this.w/2) + ((this.w + 100) * i), screenY - ((screenY - this.y)/2) - this.h/2,
        this.x - (this.w/2) + this.w*2 + ((this.w + 100) * i), screenY - ((screenY - this.y)/2) - this.h/2,
        this.x - (this.w/2) + this.w*2 + this.perspectiveOffset + ((this.w + 100) * i), screenY - ((screenY - this.y)/2) + this.h/2,
        this.x - (this.w/2) + this.perspectiveOffset + ((this.w + 100) * i), screenY - ((screenY - this.y)/2) + this.h/2);
    }
  }

  showCrossWalk(){
    let crossWalkX = 200;
    let crossWalkW = 100;
    // backgroundCanvas.fill(113, 97, 97);
    backgroundCanvas.fill(113, 97, 97);
    backgroundCanvas.quad(crossWalkX - (crossWalkW/2) + ((crossWalkW + 100) ), this.y+this.h,
      crossWalkX - (crossWalkW/2) + crossWalkW*2 + ((crossWalkW + 100) ), this.y+this.h,
      crossWalkX - (crossWalkW/2) + crossWalkW*2 + (this.perspectiveOffset * 7.3) + ((crossWalkW + 100) ), screenY - this.h,
      crossWalkX - (crossWalkW/2) + (this.perspectiveOffset * 7.3) + ((crossWalkW + 100) ), screenY - this.h);

    backgroundCanvas.fill(255, 229, 229);
    for(let i = 0; i < ((screenY - this.h) - (this.y+this.h))/(this.h + 5) - 1; i++){
      backgroundCanvas.quad(crossWalkX + crossWalkW/2 + ((this.w + 100)) + (i * this.w), this.y+this.h + 5 + (i * (this.h + 5)),
        crossWalkX + crossWalkW/2 + this.w*2 + ((this.w + 100)) + crossWalkW + (i * this.w), this.y+this.h + 5 + (i * (this.h + 5)),
        crossWalkX + crossWalkW/2 + this.w*2 + this.perspectiveOffset + ((this.w + 100))+ crossWalkW + (i * this.w), this.y+(this.h * 2) + 5 + (i * (this.h + 5)),
        crossWalkX + crossWalkW/2 + this.perspectiveOffset + ((this.w + 100)) + (i * this.w), this.y+(this.h * 2) + 5 + (i * (this.h + 5)));
    }

  }

  show(){
    this.changeTint();
    backgroundCanvas.fill(147,112,190);
    backgroundCanvas.rect(0, this.y, screenX, screenY/3);
    this.showSidewalk(0);
    this.showRoad();
    this.showSidewalk(((screenY * 1.2)/10) - this.h);
    this.showCrossWalk();
    backgroundCanvas.fill(0, 0, 0, this.howDark);
    backgroundCanvas.rect(-1, this.y, screenX, screenY - this.y);
  }
}
//
// class CrossWalk{
//   constructor(){
//     this.x;
//     this.y;
//   }
// }

class BusStop{
  constructor(x, y, busStopImage){
    this.x = x;
    this.y = y;
    this.busStopImage = busStopImage;
    this.imgH = this.busStopImage.height * 1.5;
    this.imgW = this.busStopImage.width * 1.5;
  }

  draw(){
    // foregroundCanvas.fill(0);
    // foregroundCanvas.rect(this.x, this.y, 10, 10);
    foregroundCanvas.image(this.busStopImage, this.x, this.y - this.busStopImage.height + 2);
  }

  // drawpeopleImWInd(inputX, inputY, inputWidth, inputHeight, topPadd, pplWid){
  //   if(this.seed[2] == 1){//standard square evenly spaced windows but with windows split in two
  //     fill(this.winColor[0], this.winColor[1], this.winColor[2]);
  //     let winWidth = 10;
  //     let padding = 8;
  //     let spacing = 3;
  //     let numbOfWinPerRow = (inputWidth - (padding*2))/(winWidth+spacing+1);
  //     let numbOfWinPerCol = (inputHeight - (padding*2))/(winWidth+spacing) - 2;
  //     for(let j = 0; j < numbOfWinPerCol; j++){
  //       for(let i = 0; i < numbOfWinPerRow; i++){
  //         rect(inputX + padding + (i*(winWidth+spacing)), (inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, winWidth, winWidth);
  //       }
  //     }
  //   }
  //   else if(this.seed[2] == 2){//standard square evenly spaced windows but with windows split in two horizontally
  //     fill(this.winColor[0], this.winColor[1], this.winColor[2]);
  //     let winWidth = 15;
  //     let padding = 10;
  //     let spacing = 5;
  //     let numbOfWinPerRow = (inputWidth - (padding*2))/(winWidth+spacing+1);
  //     let numbOfWinPerCol = (inputHeight - (padding*2))/(winWidth+spacing) - 2;
  //     for(let j = 0; j < numbOfWinPerCol; j++){
  //       for(let i = 0; i < numbOfWinPerRow; i++){
  //         rect(inputX + padding + (i*(winWidth+spacing)),( inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, ((winWidth - 4)/2), winWidth);
  //         rect((inputX + padding + (i*(winWidth+spacing))) + ((winWidth - 4)/2) + 2, (inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, ((winWidth - 4)/2), winWidth);
  //       }
  //     }
  //   }
  //   else if(this.seed[2] == 3){//standard square evenly spaced windows but with windows split in two vertically
  //     fill(this.winColor[0], this.winColor[1], this.winColor[2]);
  //     let winWidth = 15;
  //     let padding = 10;
  //     let spacing = 5;
  //     let numbOfWinPerRow = (inputWidth - (padding*2))/(winWidth+spacing);
  //     let numbOfWinPerCol = (inputHeight - (padding*2))/(winWidth+spacing) - 2;
  //     for(let j = 0; j < numbOfWinPerCol; j++){
  //       for(let i = 0; i < numbOfWinPerRow; i++){
  //         rect(inputX + padding + (i*(winWidth+spacing)), (inputY + (j*(winWidth+spacing)) - inputHeight) + topPadd, winWidth-1, (winWidth - 4)/2);
  //         rect(inputX + padding + (i*(winWidth+spacing)), (inputY + (j*(winWidth+spacing)) + ((winWidth - 4)/2) - inputHeight + 2 ) + topPadd, winWidth -1, (winWidth - 4)/2);
  //       }
  //     }
  //   }
}

class Car{
  constructor(image, right){
    // this.x;

    let totalYoffset = (screenY * 1.2)/10;
    this.x = -image.width * foregroundCanvas.random(1, 5);
    this.y = screenY - totalYoffset;
    this.image = image;
    this.scale = (22.5 * 4)/this.image.height;
    this.height = this.scale * this.image.height;
    this.speed = foregroundCanvas.random(1, 3);
    if(right){
      this.y = ((screenY - ((screenY * 1.2)/10)) + 3) - this.height/2;
    }
    else{
      this.y = (screenY - 12) - this.height;
    }

    this.roadLength = foregroundCanvas.random(2,4);
    this.movingRight = right;
    this.howDark = 255;
    console.log(this.scale);
  }

  // drawCarShape(impx, impy, scale){
  //   // fill(70);
  //   // beginShape();
  //   // // console.log(impx-(4 * scale), (impy+(4 * scale)));
  //   // vertex(impx+(4 * scale), (impy-(4 * scale)));
  //   // vertex(impx+(4 * scale), (impy-(0 * scale)));
  //   // vertex(impx-(5 * scale), (impy-(0 * scale)));
  //   // vertex(impx-(5 * scale), (impy-(2 * scale)));
  //   // vertex(impx-(2 * scale), (impy-(2 * scale)));
  //   // vertex(impx-(2 * scale), (impy-(4 * scale)));
  //   // vertex(impx+(4 * scale), (impy-(4 * scale)));
  //   // endShape(CLOSE);
  // }

  changeTint(){
    let opasityOfDay;
    if(currentTime < 12){
      opasityOfDay = Math.floor(foregroundCanvas.map(currentTime, 0, 12, 200, 255));
    }
    else{
      opasityOfDay = Math.floor(foregroundCanvas.map(currentTime, 12, 24, 255, 200));
    }
    this.howDark = opasityOfDay;
  }

  show(){
    this.changeTint();
    // foregroundCanvas.tint(this.howDark, 240)
    if(this.movingRight){
      foregroundCanvas.image(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);
      this.x += this.speed;
      if(this.x > screenX*this.roadLength){
        this.x = -this.image.width
        this.roadLength = foregroundCanvas.random(2,4);
        this.speed = foregroundCanvas.random(1, 3);
      }
    }
    else{
      foregroundCanvas.scale(-1, 1);
      foregroundCanvas.image(this.image, this.x - screenX, this.y, this.image.width * this.scale, this.image.height * this.scale);
      this.x += this.speed;
      if(this.x > screenX*this.roadLength){
        this.x = -this.image.width
        this.roadLength = foregroundCanvas.random(2,4);
        this.speed = foregroundCanvas.random(1, 3);
      }
        foregroundCanvas.scale(-1, 1);
    }
  }
}

// class Lamp{
//
// }

const skinColorsHex = [
  "#FFDFC4", "#F0D5BE", "#EECEB3",
  "#E1B899", "#E5C298", "#FFDCB2",
  "#E5B887", "#E79E6D",
  "#DB9065", "#CE967C", "#C67856",
  "#BA6C49", "#A57257", "#F0C8C9",
  "#DDA8A0", "#B97C6D", "#A8756C",
  "#AD6452"
]

const skinColors = [
  [255, 223, 196], [240, 213, 190], [238, 206, 179],
  [225, 184, 153], [229, 194, 152], [255, 220, 178],
  [229, 184, 135], [231, 158, 109], [219, 144, 101],
  [206, 150, 124], [198, 120, 86], [186, 108, 73],
  [165, 114, 87], [240, 200, 201], [221, 168, 160],
  [185, 124, 109], [168, 117, 108], [173, 100, 82]
]

const shirtColorsHex = [
  "#FF6AD5", "#C774E8", "#AD8CFF",
  "#8795E8", "#94D0FF"
]

const shirtColors = [
  [255, 106, 213], [199, 116, 232], [173, 140, 255],
  [135, 149, 232], [148, 208, 255]
]

class StreetLamp{
  constructor(x, y, time, lampImg, lightImg){
    this.x = x;
    this.y = y;

    if(time >= 19 || time <= 7){
      this.isOn = true;
    }
    else{
      this.isOn = false;
    }
    // console.log(this.isOn);
    let scale = (22.5 * 2)/lightImg.height;
    this.lightImg = lightImg;
    this.lightWidth = lightImg.width/2;
    this.lightHeight = lightImg.height/2;
    this.lampImg = lampImg;
    this.height = lampImg.height * scale;
    this.width = lampImg.width * scale;
    this.updateTime(currentTime);
  }

  updateTime(time){
    if(time >= 19 || time <= 7){
      this.isOn = true;
    }
    else{
      this.isOn = false;
    }
  }

  draw(){
    foregroundCanvas.image(this.lampImg, this.x - this.width, this.y - this.height, this.width, this.height);
  }

  drawLight(){
    if(this.isOn){
      foregroundCanvas.image(this.lightImg, (this.x - (this.lightWidth/2)) - this.width/2, (this.y - (this.lightHeight/2)) - (this.height * 4)/5, this.lightWidth, this.lightHeight);
    }
  }
}


class Person{
  constructor(startX, maxY, floorY){
    this.x = startX;
    this.y = foregroundCanvas.random(floorY, maxY);
    this.direction = Math.floor(foregroundCanvas.random(0, 180));//direction person faces on spawn
    this.movementSpeed = 1;//how fast person moves around
    this.floorY = floorY;//floor for the person/lowest point it can go to
    this.shirtnum = Math.floor(foregroundCanvas.random(0, shirtColors.length));
    this.skinnum = Math.floor(foregroundCanvas.random(0, skinColors.length));
    this.shirtColor = [];
    this.skinColor = [];
    // let placeholder = shirtColors[this.shirtnum];
    // placeholder[0] -= 3;
    // placeholder[1] -= 3;
    // placeholder[2] -= 3;
    // this.shirtColor = placeholder;//pick skin and shirt colors
    this.skinColor = skinColors[this.skinnum];
    // console.log(this.skinColor);
    this.changeTint();

    this.timing = Math.floor(foregroundCanvas.random(5, 9));

    this.personMovingXList = {
      movingRight: true,
      movingLeft: false,
    }
    this.personMovingYList = {
      movingUp: true,
      movingDown: false,
    }
    this.personMovingX;
    // this.personMovingY;
    this.movementX;
    // this.movementY;
    this.changeAction();
  }

  changeTint(){
    let opasityOfDay = 0;
    if(currentTime < 12){
      opasityOfDay = Math.floor(foregroundCanvas.map(currentTime, 0, 12, 5, 0));
    }
    else{
      opasityOfDay = Math.floor(foregroundCanvas.map(currentTime, 12, 24, 0, 5));
    }
    for(let i = 0; i < 3; i++){
      // console.log(this.skinColor[i] === skinColors[this.skinnum][i]);
      // console.log(this.skinColor[i] - (opasityOfDay/2) === skinColors[this.skinnum][i] - (opasityOfDay/2));
      // console.log(opasityOfDay);
      this.skinColor[i] = skinColors[this.skinnum][i];
    }
    for(let i = 0; i < 3; i++){
      this.shirtColor[i] = (shirtColors[this.shirtnum])[i];
    }
    // for(let i = 0; i < 3; i++){
    //   console.log(skinColors[this.skinnum][i]);
    //   this.skinColor[i] = skinColors[this.skinnum][i];
    //   // console.log(skinColors);
    //   console.log(i);
    // }
    // for(let i = 0; i < 3; i++){
    //   this.shirtColor[i] = shirtColors[this.shirtnum][i];
    // }

  }

  changeAction(){
    let placeholderX = Math.floor(foregroundCanvas.random(0, 1.99));
    if(placeholderX === 0){
      this.personMovingX = this.personMovingXList.movingLeft;
    }
    else{
      this.personMovingX = this.personMovingXList.movingRight;
    }

    // let placeholderY = Math.floor(random(0, 1.99));
    // if(placeholderY === 0){
    //   this.personMovingY = this.personMovingYList.movingDown;
    // }
    // else{
    //   this.personMovingY = this.personMovingYList.movingUp;
    // }
    let placeholder = Math.floor(foregroundCanvas.random(0, 1.99));
    if(placeholder === 0){
      this.movementX = false;
    }
    else{
      this.movementX = true;
    }
  //   placeholder = Math.floor(random(0, 1.99));
  //   if(placeholder === 0){
  //     this.movementY = false;
  //   }
  //   else{
  //     this.movementY = true;
  //   }
  //   console.log(this.movementX);
  //   console.log(this.movementY);
  }

  drawPerson(x, y){
    foregroundCanvas.noStroke();
    let myScale = 0.75;
    foregroundCanvas.fill(this.skinColor);
    foregroundCanvas.rect(x, y - (myScale*(30)), 10 * myScale, 10 * myScale);
    let opasityOfDay = 0;
    if(currentTime < 12){
      opasityOfDay = Math.floor(foregroundCanvas.map(currentTime, 0, 12, 120, 0));
    }
    else{
      opasityOfDay = Math.floor(foregroundCanvas.map(currentTime, 12, 24, 0, 120));
    }
    foregroundCanvas.fill(this.shirtColor[0] - opasityOfDay, this.shirtColor[1] - opasityOfDay, this.shirtColor[2] - opasityOfDay);
    // console.log(this.shirtColor[0] - opasityOfDay, this.shirtColor[1] - opasityOfDay, this.shirtColor[2] - opasityOfDay);
    foregroundCanvas.rect(x - (2 * myScale), y + (10 * myScale)- (myScale*(30)), 14 * myScale, 20 * myScale);

    // console.log((20 * myScale) + (10 * myScale));
    // fill(0, 0, 0, opasityOfDay);
    // rect(x - (2 * myScale), y + (10 * myScale)- (myScale*(30)), 14 * myScale, 20 * myScale);
  }

  draw(){
    this.drawPerson(this.x, this.y);
    if((foregroundCanvas.second()%this.timing === 0) === false){
      if(this.movementX === true){
        if(this.personMovingX === this.personMovingXList.movingLeft){
          this.x -= this.movementSpeed;
        }
        else if(this.personMovingX === this.personMovingXList.movingRight){
          this.x += this.movementSpeed;
        }
      }
    }
    if(foregroundCanvas.second()%this.timing === 0){
      this.changeAction();
    }
  }
}
