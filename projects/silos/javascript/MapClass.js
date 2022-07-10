class Map{
  constructor(mapLayout, tileImages, scale){
    this.mapLayout = mapLayout;
    this.columns = this.mapLayout[0].length;//get number of columns that map makes up
    this.rows = this.mapLayout.length;//get number of rows in the map
    this.tileImages = tileImages;
    this.scale = scale;
    this.map = [];
    this.numOfBlocksShow = 0;
    
    this.hurtboxes = [];

    let tileKeys = Object.keys(tileImages);
    for(let y = 0; y < this.rows; y++){
      let row = [];
      for(let x = 0; x < this.columns; x++){
        let tileLayoutId = this.mapLayout[y][x];
        if(tileLayoutId >= 0){
          row.push(this.tileImages[tileKeys[tileLayoutId]]);
        }else{
          row.push(-1);
        }
      } 
      this.map.push(row);
    }
    // console.log(this.map);

    this.xoffset = 0;
    this.yoffset = 0;
  }
  
  show(){
    this.numOfBlocksShow = 0;
    for(let y = 0; y < this.rows; y++){
      for(let x = 0; x < this.columns; x++){
        let tile = this.map[y][x];
        // console.log(tile, x, y)
        if(tile === -1){
          //if air
          continue;
        }else{
          let drawX = this.xoffset + (x * this.scale);
          let drawY = this.yoffset + (y * this.scale);
          if((drawX + this.scale > 0 && drawX < screenX) && drawY + this.scale > 0 && drawY < screenY){
            //if can be seen on screen
            image(tile.image, drawX, drawY, this.scale, this.scale);
            this.numOfBlocksShow++
          }
        }
      }
    }
    for(let i = 0; i < this.hurtboxes.length; i++){
      this.hurtboxes[i].update();
      if(this.hurtboxes[i].life < 1){
        this.hurtboxes.splice(i, 1);
      }else{
        this.hurtboxes[i].show(this.xoffset, this.yoffset);
      }

    }
  }

  showEffects(){
    for(let y = 0; y < this.rows; y++){
      for(let x = 0; x < this.columns; x++){
        let tile = this.map[y][x];
        if(tile.lightStrength > 0){
          this.drawLightParticle(x *  this.scale + this.xoffset + this.scale/2, y *  this.scale + this.yoffset + this.scale/2, this.scale/2, tile.lightStrength);
          // this.drawLightParticle(innerWidth/2, innerHeight/2, this.scale, tile.lightStrength);
        }
      }
    }

  }

  translate(xoffset, yoffset){
    this.xoffset += xoffset;
    this.yoffset += yoffset;
  }

  setXOffset(x){
    this.xoffset = x;
  }

  setYOffset(y){
    this.yoffset = y;
  }

  adjustTo(x, y){
    this.x = x- screenX/4;
    this.y = y - screenY/4;
  }

  drawLightParticle(x, y, r, strength){
    for(let i = 1; i < strength; i++){
      fill(255, 255, 102, 15-(i* (20/strength)));
      circle(x, y, r + (i * r*5));
    }
  }
  checkIfSolidBlock(x, y){
    let tileX = Math.floor(x/this.scale);
    let tileY = Math.floor(y/this.scale);
    if(this.map[tileY][tileX] == -1){
      return false;
    }else{
      return this.map[tileY][tileX].solid;
    }
  }

  addHurtBox(x, y, w, h, life){
    this.hurtboxes.push(new HurtBox(x, y, w, h, life));
  }
}

// class Map{
//   constructor(tileMap, tileMapInfo){

//   }
// }
