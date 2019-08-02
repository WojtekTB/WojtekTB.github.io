class Shield{
  constructor(x, y, animation){
    this.x = x;
    this.y = y;
    this.scale = 2;
    this.animation = animation;
    this.animationReversed = [];
    for(let i = animation.length-1; i > -1; i--){
      this.animationReversed.push(this.animation[i]);
      // console.log(i);
    }
    this.spriteW = this.animation[0].width * this.scale;
    this.spriteH = this.animation[0].height * this.scale;
    this.state_Opening = false;
    this.state_Open = false;
    this.state_Closing = false;
    this.state_Hidden = true;
    this.frameCount = 0;
    this.frame = 0;
    this.buttonDown = false;
  }

  buttonCheck(){
    if (keyIsDown("X".charCodeAt(0))) {
      this.buttonDown = true;
    }
    else{
      this.buttonDown = false;
    }
    // console.log(this.buttonDown);
  }

  checkState(){
    if(this.buttonDown && this.state_Closing) {
      this.shieldOpening();
    }
    else if(this.buttonDown && this.state_Open){
      this.shieldOpen();
    }
    else if(this.buttonDown && this.state_Hidden){
      this.shieldOpening();
    }
    else if(this.buttonDown && this.state_Opening){
      this.shieldOpening();
    }
    else if(this.state_Closing){
      return;
    }
    else if(this.state_Open){
      this.shieldClosing();
    }
    else{
      this.shieldClosed();
    }
  }
  updatePos(x , y){
    this.x = x - this.spriteW/2;
    this.y = y - this.spriteH/2;
  }

  shieldOpening(){
    this.state_Open = false;
    this.state_Opening = true;
    this.state_Closing = false;
    this.state_Hidden = false;
  }

  shieldOpen(){
    this.state_Open = true;
    this.state_Opening = false;
    this.state_Closing = false;
    this.state_Hidden = false;
  }

  shieldClosed(){
    this.state_Open = false;
    this.state_Opening = false;
    this.state_Closing = false;
    this.state_Hidden = true;
  }
  shieldClosing(){
    this.state_Open = false;
    this.state_Opening = false;
    this.state_Closing = true;
    this.state_Hidden = false;
    }

  playAnimation_Open(){
    let speed = 2;
    if(this.frame > speed){
      this.frame = 0;
      this.frameCount ++;
    }
    if(this.frameCount > this.animation.length-1){
      this.shieldOpen();
      // this.state_Open = true;
      // this.state_Opening = false;
      // this.state_Closing = false;
      // this.state_Hidden = false;
      this.frameCount = 0;
      return this.animation[this.animation.length - 1];
    }
    return this.animation[this.frameCount];
  }
  playAnimation_Close(){
    let speed = 2;
    if(this.frame > speed){
      this.frame = 0;
      this.frameCount ++;
    }
    if(this.frameCount > this.animation.length-1){
      this.shieldClosed();
        // this.state_Open = false;
        // this.state_Opening = false;
        // this.state_Closing = false;
        // this.state_Hidden = true;
      this.frameCount = 0;
      return this.animationReversed[this.animation.length - 1];
    }
    return this.animationReversed[this.frameCount];
  }
  run(x1,y1){
    this.updatePos(x1, y1);
    this.buttonCheck();
    // console.log(this.state_Open, this.state_Hidden, this.state_Closing, this.state_Opening);
    // console.log(this.state_Open, this.state_Opening, this.state_Hidden, this.state_Closing);
    if(this.state_Open){
      image(this.animation[this.animation.length-1], this.x, this.y, this.spriteW, this.spriteH);
    }
    else if(this.state_Opening){
      image(this.playAnimation_Open(), this.x, this.y, this.spriteW, this.spriteH);
      this.frame++;
    }
    else if(this.state_Closing){
      image(this.playAnimation_Close(), this.x, this.y, this.spriteW, this.spriteH);
      this.frame++;
    }
    this.checkState();
  }

}
