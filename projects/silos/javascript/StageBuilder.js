class StageBuilder{
  constructor(map){
    this.map = map;
    let assets = this.map.assets;

//--------map stuff -------
    this.columns = prompt("Input number of columns(X)");;//get number of columns that map makes up
    this.rows = prompt("Input number of rows(Y)");;//get number of rows in the map

    this.mapTiles = [];
    for(let i = 0; i < this.rows; i++){
      let placeholder1 = [];
      for(let j = 0; j < this.columns; j++){
        placeholder1.push(0);
      }
      this.mapTiles.push(placeholder1);
    }
    console.log(this.mapTiles);

    this.brickTexture = [assets.brick, 1, "brick: 1"];//get the brick texture from the
    this.grass1Texture = [assets.grass1, 2, "grass1: 2"];
    this.grass2Texture = [assets.grass2, 3, "grass2: 3"];
    this.grassLeftTexture = [assets.grassLeft, 4, "grassLeft: 4"];
    this.grassRightTexture = [assets.grassRight, 5, "grassRight: 5"];
    this.grassFullTexture = [assets.grassFull, 6, "grassFull: 6"];
    this.candle = [assets.candle, 7, "candle: 7"];

    this.airBlocks = [this.grass1Texture[1],
    this.grass2Texture[1],
     this.grassLeftTexture[1],
      this.grassRightTexture[1],
       this.grassFullTexture[1],
        this.candle[1],
         0];

    this.allBlocks = [];

    let assetsToArray = Object.values(assets);
    for(let i = 0; i < assetsToArray.length+1; i++){
      this.allBlocks[i] = [assetsToArray[i], i];
    }
    console.log(assets);
    console.log(this.allBlocks);

    this.scale = 50;
    this.y = 0;
    this.x = 0;
    this.previousX = this.x;
    this.previousY = this.y;
    this.xoffset = 0;
    this.yoffset = 0;
    this.displayX = this.x + this.xoffset;

    let placeholderBrush = prompt("What brush do you want, choose ID from list:" + this.allBlocks);
    console.log(this.allBlocks[placeholderBrush]);
    this.currentBrush = this.allBlocks[placeholderBrush][1];
  }


  controlMovement(){//check for key pressed and move if so
    if(keyIsDown("W".charCodeAt(0))){
      this.yoffset += this.scale;
    }
    else if (keyIsDown("A".charCodeAt(0))){
      this.xoffset += this.scale;
    }
    else if (keyIsDown("S".charCodeAt(0))){
      this.yoffset -= this.scale;
    }
    else if (keyIsDown("D".charCodeAt(0))){
      this.xoffset -= this.scale;
    }
    else if (keyIsDown("R".charCodeAt(0))){//reset
      this.xoffset = 0;
      this.yoffset = 0;
    }
    else if (keyIsDown("F".charCodeAt(0))){//reset
      this.switchBrush();
    }
    else if (keyIsDown(" ".charCodeAt(0))){
        this.useBrush();
    }
  }

  drawBrush(){
    let displayX = Math.floor(((mouseX) / this.scale));
    let displayY = Math.floor(((mouseY) / this.scale));
    noFill();
    stroke(255, 0, 0);
    strokeWeight(5);
    rect(displayX*this.scale, displayY*this.scale, this.scale, this.scale);
  }
  useBrush(){
    let tileX = Math.floor(((mouseX) / this.scale) - (this.xoffset/this.scale));
    let tileY = Math.floor(((mouseY) / this.scale) - (this.yoffset/this.scale));
    console.log(tileY,tileX);
    // console.log(this.currentBrush);
    // console.log(this.mapTiles[tileY][tileX]);
    // console.log(tileY > -1, tileY < this.columns);
    if(tileY > -1 && tileY < this.columns){
      this.mapTiles[tileY][tileX] = this.currentBrush;
    }
    else{
      return;
    }
  }
  switchBrush(){
    let placeholderBrush = prompt("What brush do you want, choose ID from list: \n" + this.allBlocks);
    // console.log(this.allBlocks[placeholderBrush]);
    this.currentBrush = this.allBlocks[placeholderBrush][1];
  }

  show(){
    this.controlMovement();
    fill(150);
    rect(this.xoffset, this.yoffset, this.columns*this.scale, this.rows*this.scale);
    for(let columnNumber = 0; columnNumber < this.rows; columnNumber++){
      for(let rowPosition = 0; rowPosition < this.columns; rowPosition++){
        let drawnX = rowPosition*this.scale + this.xoffset;
        let drawnY = columnNumber*this.scale + this.yoffset;
        if(this.mapTiles[columnNumber][rowPosition] === this.brickTexture[1]){
          if(drawnX < screenX && drawnX > -this.scale){
            if(drawnY < screenY && drawnY > -this.scale){
              image(this.brickTexture[0], drawnX, drawnY, this.scale, this.scale);
            }
          }
        }
        if(this.mapTiles[columnNumber][rowPosition] === this.grass1Texture[1]){
          if(drawnX < screenX && drawnX > -this.scale){
            if(drawnY < screenY && drawnY > -this.scale){
              image(this.grass1Texture[0], drawnX, drawnY, this.scale, this.scale);
            }
          }
        }
        if(this.mapTiles[columnNumber][rowPosition] === this.grass2Texture[1]){
          if(drawnX < screenX && drawnX > -this.scale){
            if(drawnY < screenY && drawnY > -this.scale){
              image(this.grass2Texture[0], drawnX, drawnY, this.scale, this.scale);
            }
          }
        }
        if(this.mapTiles[columnNumber][rowPosition] === this.grassLeftTexture[1]){
          if(drawnX < screenX && drawnX > -this.scale){
            if(drawnY < screenY && drawnY > -this.scale){
              image(this.grassLeftTexture[0], drawnX, drawnY, this.scale, this.scale);
            }
          }
        }
        if(this.mapTiles[columnNumber][rowPosition] === this.grassRightTexture[1]){
          if(drawnX < screenX && drawnX > -this.scale){
            if(drawnY < screenY && drawnY > -this.scale){
              image(this.grassRightTexture[0], drawnX, drawnY, this.scale, this.scale);
            }
          }
        }
        if(this.mapTiles[columnNumber][rowPosition] === this.candle[1]){
          if(drawnX < screenX && drawnX > -this.scale){
            if(drawnY < screenY && drawnY > -this.scale){
              image(this.candle[0], drawnX, drawnY, this.scale, this.scale);
            }
          }
          this.map.drawLightParticle(drawnX + this.scale/2, drawnY + this.scale/2, 10, 10);
        }
        this.displayX = this.x + this.xoffset;
      }
    }
    this.drawBrush();
    fill(255);
    noStroke();
    text("block in hand: " + this.currentBrush, 0, 0, 300, 100);
    text("WASD to move camera around \nR to reset to origin \nF to change the block in hand \nSpace to draw", 0, 30, 100, 100);

  }
}
