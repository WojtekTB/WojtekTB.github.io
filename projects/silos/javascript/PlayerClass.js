class Player{
  constructor(startingX, startingY, map, images, animationsAndInstructions){//initialize object
    this.MaxHP = 100;
    this.CurrentHP = this.MaxHP;
    this.MaxMP = 100;
    this.CurrentMP = this.MaxMP;
    //-----sprite-----
    this.spriteScale = 0.7;
    this.spriteHeight = (animationsAndInstructions[0][0].height * this.spriteScale);
    this.spriteWidth = (animationsAndInstructions[0][0].width * this.spriteScale);
    this.image = images;
    //-----position-----
    this.context = this;
    this.x = startingX + (animationsAndInstructions[0][0].width * this.spriteScale * 4)/20;
    this.y = startingY;
    this.previousX = this.x;
    this.previousY = this.y;
    this.xoffset = 0;
    this.yoffset = 0;
    this.displayX = this.x + this.xoffset;
    //-----vectors-----
    this.speed = 6;//walking speed force
    this.jumpForce = 10;//jumping force
    this.overallVelocityY = 0;//total force acting on sprite on Y
    this.overallVelocityX = 0;//total force acting on sprite on X
    this.gravity = 0.5;//downward pull
    this.stepsPerFrame = 5;
    //-------player frictions------
    this.floorFriction = 1;
    this.airFriction = 0.5;
    //-----player-statuses-----
    this.slime = false;//[0 = standing; 1 = crouching] => start off standing
    this.inTheAir = false;
    this.inTheAirChannel = [0, 0, 0];
    this.maxJumps = 2;//constant max number of jumps to reset to
    this.jumpNumber = this.maxJumps;//number of jumps before having to touch the ground again
    this.onWall = true;
    this.onRightWall = true;
    this.crouching = false;
    //-----map value-----
    this.map = map;//get the map the player is currently running around in
    this.airBlocks = map.airBlocks;
    this.mapScale = map.scale;
    this.mapTiles = map.mapTiles;
    //-----player collision values-----
    this.numberOfCollisionPointsOnSide = 10;
    this.collisionPointSidePadding = 3;
    this.playerCollisionPointsTop = [];
    this.playerCollisionPointsBottom = [];
    this.playerCollisionPointsSideR = [];
    this.playerCollisionPointsSideL = [];
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){
      this.playerCollisionPointsTop.push(new CollisionPoint(null, null));
      this.playerCollisionPointsBottom.push(new CollisionPoint(null, null));
      this.playerCollisionPointsSideR.push(new CollisionPoint(null, null));
      this.playerCollisionPointsSideL.push(new CollisionPoint(null, null));
    }
    //-----special collision points-------
    this.isNextToL = false;
    this.isNextToR = false;
    this.isNextToT = false;
    this.isNextToB = false;

    this.playerCheckerPointsTop = [];
    this.playerCheckerPointsBottom = [];
    this.playerCheckerPointsSideR = [];
    this.playerCheckerPointsSideL = [];
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){
      this.playerCheckerPointsTop.push(new CollisionPoint(null, null));
      this.playerCheckerPointsBottom.push(new CollisionPoint(null, null));
      this.playerCheckerPointsSideR.push(new CollisionPoint(null, null));
      this.playerCheckerPointsSideL.push(new CollisionPoint(null, null));
    }

    //player animation statuses
    this.playerStateAnimationIdle = true;
    this.playerStateAnimationWalking = false;
    this.playerAnimationRight = true;
    this.playerAnimationLeft = false;
    //animations and animationsAndInstructions
    this.playerAnimationIdle = animationsAndInstructions[0];
    this.playerAnimationWalk = animationsAndInstructions[1];
    this.playerAnimationCrouch = animationsAndInstructions[2];
    this.currentAnimation = [];
    this.onWhatFrame = 0;
    this.frameCount = 0;
    this.framekeeper = 0;
    // this.timer = 0;

    //----other projects------
    this.dialogueBox = new PlayerDialogueBox(animationsAndInstructions[4]);

    //-------player abilities -------

    this.shield = new Shield(this.x + this.xoffset, this.y + this.yoffset, animationsAndInstructions[3]);
  }

  //slime

  //normal

  inspectBlock(){
    let tileX;
    let tileY;
    if(this.crouching){
      if(this.playerAnimationRight){
        tileX = Math.floor((this.x + this.mapScale) / this.mapScale);
        tileY = Math.floor((this.y) / this.mapScale);
        // fill(255, 250, 0);
        // rect((this.x + this.mapScale)+this.xoffset, (this.y - this.spriteHeight/2)+this.yoffset, 5, 5);
      }
      else{
        tileX = Math.floor((this.x - this.mapScale) / this.mapScale);
        tileY = Math.floor((this.y) / this.mapScale);
      }
    }
    else{
      if(this.playerAnimationRight){
        tileX = Math.floor((this.x + this.mapScale) / this.mapScale);
        tileY = Math.floor((this.y - this.spriteHeight/2) / this.mapScale);
        // fill(255, 250, 0);
        // rect((this.x + this.mapScale)+this.xoffset, (this.y - this.spriteHeight/2)+this.yoffset, 5, 5);
      }
      else{
        tileX = Math.floor((this.x - this.mapScale) / this.mapScale);
        tileY = Math.floor((this.y - this.spriteHeight/2) / this.mapScale);
      }
    }
    if(this.mapTiles[tileY][tileX] === 0){
      let textForBox = "Nothing to see here.";
      this.dialogueBox.open(textForBox);
    }
    else if(this.mapTiles[tileY][tileX] === 7){
      let textForBox = "It's a lit wax candle. It looks like it have been here for a while... I wonder who lit it?";
      this.dialogueBox.open(textForBox);
    }
    else if(this.mapTiles[tileY][tileX] === 1){
      let textForBox = "Wow a stone brick... another one. I sometimes wonder if I am forever trapped in this prison... or maybe developers just forgot to draw other textures for the map.";
      this.dialogueBox.open(textForBox);
    }
  }

  moveToClick(){
    this.x = mouseX;
    this.y = mouseY;
    console.log(this.x, this.y);
    // this.overallVelocityY = 0;
    this.inTheAir = 1;
  }

  transition(){
    if(this.slime)
    {
      this.slime = false;//change to standing if was crouching
      this.y -= (this.spriteHeight*50)/2
      this.spriteHeight = this.spriteHeight*50;
      console.log("Standing!");
    }
    else{
      this.slime = true;//change to crouching if was standing
      this.spriteHeight = this.spriteHeight/50;
      this.y += (this.spriteHeight/50);
      console.log("Slime!");
    }
  }
  controlMovement(){//check for key pressed and move if so
    if (keyIsDown("S".charCodeAt(0))) {
      this.crouching = true;
    }
    else{
      this.crouching = false;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown("A".charCodeAt(0))){
      if(this.crouching){
        this.playerAnimationLeft = true;
        this.playerAnimationRight = false;
        return;
      }
      this.overallVelocityX -= this.speed/4;
      if(this.overallVelocityX < -this.speed){
        this.overallVelocityX = -this.speed;
      }
      this.playerAnimationLeft = true;
      this.playerAnimationRight = false;
      this.playerStateAnimationWalking = true;
      this.playerStateAnimationIdle = false;
    }
    else if (keyIsDown(RIGHT_ARROW) || keyIsDown("D".charCodeAt(0))) {
      if(this.crouching){
        this.playerAnimationLeft = false;
        this.playerAnimationRight = true;
        return;
      }
      this.overallVelocityX += this.speed/4;
      if(this.overallVelocityX > this.speed){
        this.overallVelocityX = this.speed;
      }
      this.playerAnimationLeft = false;
      this.playerAnimationRight = true;
      this.playerStateAnimationWalking = true;
      this.playerStateAnimationIdle = false;
    }
    else if (keyIsDown("L".charCodeAt(0))) {
      console.table({top: this.isNextToT, bottom: this.isNextToB, left: this.isNextToL, right: this.isNextToR});
    }
  }

  inspection(){
    if (keyIsDown("C".charCodeAt(0))) {
      this.inspectBlock();
    }
    else{
    this.playerStateAnimationWalking = false;
    this.playerStateAnimationIdle = true;
    }
  }

  jump(){//adds upwards force to whatever the value was before
    // setTimeout(function(){player.timer++;}, 1000);
    if(this.jumpNumber != 0)
    {
      if(this.isNextToB === false && this.isNextToT === false && this.isNextToL === false && this.isNextToR === true){//if on right wall
        this.wallJump(true);
      }
      else if(this.isNextToB === false && this.isNextToT === false && this.isNextToL === true && this.isNextToR === false){//if on right wall
        this.wallJump(false);
      }
      else{
        this.normalJump();
      }
      this.jumpNumber--;
    }
  }

  normalJump(){
      // this.y -= 20;
      this.overallVelocityY = 0;
      this.overallVelocityY -= this.jumpForce;
    // console.log(this.jumpNumber);
  }

  wallJump(right){
    this.overallVelocityX = 0;
    this.overallVelocityY = 0;
    this.overallVelocityY -= this.jumpForce*1.3;
    if(right){
      this.overallVelocityX -= this.speed*1.3;
      this.playerAnimationRight = false;
      this.playerAnimationLeft = true;
    }
    else{
      this.overallVelocityX += this.speed*1.3;
      this.playerAnimationRight = true;
      this.playerAnimationLeft = false;
    }
  }

  gravityPull(){
      this.overallVelocityY += this.gravity;
  }


  collisionDetectionSide(){
    let nonBumped = true;
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){//right
      let tileX = Math.floor(this.playerCollisionPointsSideR[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCollisionPointsSideR[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(this.airBlocks.includes(tilePlayerIsOn) === false){
        if(this.slime === false){
          this.x = this.previousX;
          // console.log("tile to the right side!");
          // this.overallVelocityY -= 0.4
          this.jumpNumber = 1;
          nonBumped = true;
          this.overallVelocityX = 0;
          this.onWall = true;
          this.onRightWall = true;
          // this.inTheAir = false;
          break;
        }
      }
    }

    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){//left
      let tileX = Math.floor(this.playerCollisionPointsSideL[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCollisionPointsSideL[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(this.airBlocks.includes(tilePlayerIsOn) === false){
        if(this.slime === false){
          this.x = this.previousX;
          // console.log("tile to the left side!");
          this.jumpNumber = 1;
          nonBumped = true;
          this.overallVelocityX = 0;
          this.onWall = true;
          this.onRightWall = false;
          // this.inTheAir = false;
          this.inTheAirChannel[0] = 1;
          break;
        }
      }
    }
    if(nonBumped){
      // console.log("ree");
      this.inTheAirChannel[0] = 0;
      this.previousX = this.x;
    }
  }

  collisionDetectionTop(){
    let nonBumped = true;
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){
      let tileX = Math.floor(this.playerCollisionPointsTop[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCollisionPointsTop[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(this.airBlocks.includes(tilePlayerIsOn) === false){
        this.y = this.previousY;
        this.overallVelocityY = this.gravity;
        // console.log("tile Top!");
        nonBumped = false;
        // this.inTheAir = false;
        this.inTheAirChannel[1] = 1;
        break;
      }
    }
    if(nonBumped){
      this.inTheAirChannel[1] = 0;
      this.previousY = this.y;
    }
  }

  collisionDetectionBottom(){
    let nonBumped = true;
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){
      let tileX = Math.floor(this.playerCollisionPointsBottom[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCollisionPointsBottom[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(this.airBlocks.includes(tilePlayerIsOn) === false){
        this.y = this.previousY;
        this.overallVelocityY = 0;
        this.jumpNumber = this.maxJumps;
        // console.log("tile Under!");
        nonBumped = false;
        // this.inTheAir = false;
        this.onWall = false;
        this.inTheAirChannel[2] = 1;
          // console.log(this.inTheAirChannel);
        break;
      }
    }
    if(nonBumped){
      this.inTheAirChannel[2] = 0;
        // console.log(this.inTheAirChannel);
      this.previousY = this.y;
    }
  }

  collisionPointsUpdate(){
    this.playerCollisionPointsSideR[0].x = this.x + this.spriteWidth/2 + this.collisionPointSidePadding - (animationsAndInstructions[0][0].width * this.spriteScale*3)/20;
    this.playerCollisionPointsSideR[0].y = (this.y - this.spriteHeight/2) + this.collisionPointSidePadding;//right

    this.playerCollisionPointsSideL[0].x = (this.x - this.spriteWidth/2 - this.collisionPointSidePadding) + (animationsAndInstructions[0][0].width * this.spriteScale*3)/20;
    this.playerCollisionPointsSideL[0].y = (this.y - this.spriteHeight/2) + this.collisionPointSidePadding;//left

    this.playerCollisionPointsTop[0].x = (this.x - this.spriteWidth/2) + this.spriteWidth*3/20;
    this.playerCollisionPointsTop[0].y = this.y - this.spriteHeight/2;

    this.playerCollisionPointsBottom[0].x = (this.x - this.spriteWidth/2) + this.spriteWidth*3/20;
    this.playerCollisionPointsBottom[0].y = this.y + this.spriteHeight/2;
    for(let i = 1; i < this.numberOfCollisionPointsOnSide; i++){
      this.playerCollisionPointsSideR[i].x = (this.x + this.spriteWidth/2 + this.collisionPointSidePadding) - (animationsAndInstructions[0][0].width * this.spriteScale*3)/20;
      this.playerCollisionPointsSideR[i].y = ((this.y - this.spriteHeight/2 + this.collisionPointSidePadding) + i * ((this.spriteHeight-(this.collisionPointSidePadding*2))/(this.numberOfCollisionPointsOnSide-1)));

      this.playerCollisionPointsSideL[i].x = (this.x - this.spriteWidth/2 - this.collisionPointSidePadding) + (animationsAndInstructions[0][0].width * this.spriteScale*3)/20;
      this.playerCollisionPointsSideL[i].y = ((this.y - this.spriteHeight/2 + this.collisionPointSidePadding) + i * ((this.spriteHeight-(this.collisionPointSidePadding*2))/(this.numberOfCollisionPointsOnSide-1)));

      this.playerCollisionPointsTop[i].x = ((this.x - this.spriteWidth/2) + this.spriteWidth*3/20) + ((i) * (this.spriteWidth - this.spriteWidth*6/20)/(this.numberOfCollisionPointsOnSide-1));
      this.playerCollisionPointsTop[i].y = this.y - this.spriteHeight/2;

      this.playerCollisionPointsBottom[i].x = ((this.x - this.spriteWidth/2) + this.spriteWidth*3/20) + ((i) * (this.spriteWidth - this.spriteWidth*6/20)/(this.numberOfCollisionPointsOnSide-1));;
      this.playerCollisionPointsBottom[i].y = (this.y + this.spriteHeight/2);
    }
  }

  checkerDetectionSide(){
    let nonBumpedL = true;
    let nonBumpedR = true;
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){//right
      let tileX = Math.floor(this.playerCheckerPointsSideR[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCheckerPointsSideR[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(tilePlayerIsOn != 0){
        //your code
        this.isNextToR = true;
        nonBumpedR = false;
        break;
      }
    }

    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){//left
      let tileX = Math.floor(this.playerCheckerPointsSideL[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCheckerPointsSideL[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(tilePlayerIsOn != 0){
        //your code
        this.isNextToL = true;
        nonBumpedL = false;
        break;
      }
    }
    if(nonBumpedR){
      //else
      this.isNextToR = false;
    }
    if(nonBumpedL){
      //else
      this.isNextToL = false;
    }
  }

  checkerDetectionTop(){
    let nonBumped = true;
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){
      let tileX = Math.floor(this.playerCheckerPointsTop[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCheckerPointsTop[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(tilePlayerIsOn != 0){
        //if hit
        this.isNextToT = true;
        nonBumped = false;
        break;
      }
    }
    if(nonBumped){
      //if not hit
      this.isNextToT = false;
    }
  }

  checkerDetectionBottom(){
    let nonBumped = true;
    for(let i = 0; i < this.numberOfCollisionPointsOnSide; i++){
      let tileX = Math.floor(this.playerCheckerPointsBottom[i].x / this.mapScale);
      let tileY = Math.floor(this.playerCheckerPointsBottom[i].y / this.mapScale);
      let tilePlayerIsOn = this.mapTiles[tileY][tileX];
      if(tilePlayerIsOn != 0){
      //your code
      this.isNextToB = true;
        nonBumped = false;
        break;
      }
    }
    if(nonBumped){
      //else
      this.isNextToB = false;
    }
  }

  checkerPointsUpdate(){
    let extraPadding = -4;
    this.playerCheckerPointsSideR[0].x = this.x + this.spriteWidth/2 + this.collisionPointSidePadding + extraPadding;
    this.playerCheckerPointsSideR[0].y = (this.y - this.spriteHeight/2) + (this.collisionPointSidePadding * 5);//right

    this.playerCheckerPointsSideL[0].x = this.x - this.spriteWidth/2 - this.collisionPointSidePadding - extraPadding;
    this.playerCheckerPointsSideL[0].y = (this.y - this.spriteHeight/2) + (this.collisionPointSidePadding * 5);//left

    this.playerCheckerPointsTop[0].x = (this.x - this.spriteWidth/2) + (this.collisionPointSidePadding * 5);
    this.playerCheckerPointsTop[0].y = this.y - this.spriteHeight/2 - extraPadding;

    this.playerCheckerPointsBottom[0].x = (this.x - this.spriteWidth/2) + (this.collisionPointSidePadding * 5);
    this.playerCheckerPointsBottom[0].y = this.y + this.spriteHeight/2 - extraPadding;
    for(let i = 1; i < this.numberOfCollisionPointsOnSide; i++){
      this.playerCheckerPointsTop[i].x = ((this.x - this.spriteWidth/2 + this.collisionPointSidePadding) + i * ((this.spriteWidth-(this.collisionPointSidePadding*5))/(this.numberOfCollisionPointsOnSide-1)));
      this.playerCheckerPointsTop[i].y = this.y - this.spriteHeight/2 - extraPadding;

      this.playerCheckerPointsBottom[i].x = ((this.x - this.spriteWidth/2 + this.collisionPointSidePadding) + i * ((this.spriteWidth-(this.collisionPointSidePadding*5))/(this.numberOfCollisionPointsOnSide-1)));
      this.playerCheckerPointsBottom[i].y = this.y + this.spriteHeight/2 - extraPadding;

      this.playerCheckerPointsSideR[i].x = this.x + this.spriteWidth/2 + this.collisionPointSidePadding + extraPadding;
      this.playerCheckerPointsSideR[i].y = ((this.y - this.spriteHeight/2 + this.collisionPointSidePadding) + i * ((this.spriteHeight-(this.collisionPointSidePadding*5))/(this.numberOfCollisionPointsOnSide-1)));

      this.playerCheckerPointsSideL[i].x = this.x - this.spriteWidth/2 - this.collisionPointSidePadding - extraPadding;
      this.playerCheckerPointsSideL[i].y = ((this.y - this.spriteHeight/2 + this.collisionPointSidePadding) + i * ((this.spriteHeight-(this.collisionPointSidePadding*5))/(this.numberOfCollisionPointsOnSide-1)));
    }

  }

  translate(x, y){
  this.xoffset += x;
  this.yoffset += y;
}
  translateScreen(x, y){
  this.map.translate(x, y);
  this.translate(x, y);
}

  applyFriction(){
  if(this.inTheAir){
    if(this.overallVelocityX < 0){//left
      this.overallVelocityX += this.airFriction;
      if(this.overallVelocityX > 0){
        this.overallVelocityX = 0;
      }
    }
    else if(this.overallVelocityX > 0){//right
      this.overallVelocityX -= this.airFriction;
      if(this.overallVelocityX < 0){
        this.overallVelocityX = 0;
      }
    }
  }
  else{
    if(this.overallVelocityX < 0){//left
      this.overallVelocityX += this.floorFriction;
      if(this.overallVelocityX > 0){
        this.overallVelocityX = 0;
      }
    }
    else if(this.overallVelocityX > 0){//right
      this.overallVelocityX -= this.floorFriction;
      if(this.overallVelocityX < 0){
        this.overallVelocityX = 0;
      }
    }
  }
}
  checkIfInAir(){
    if(this.isNextToB === false && this.isNextToT === false && this.isNextToL === false && this.isNextToR === false){
    this.inTheAir = true;
  }
  else{
    // console.log("false");
    this.inTheAir = false;
  }
}


  centerOnPlayerY(){
    let centerYoffset = -100;
    this.map.setYOffset(-(this.y - (screenY/2) + centerYoffset));
    this.yoffset = -(this.y - (screenY/2) + centerYoffset);
  }
  centerOnPlayerX(){
    let centerXoffset = 0;
    this.map.setXOffset(-(this.x - (screenX/2) + centerXoffset));
    this.xoffset = -(this.x - (screenX/2) + centerXoffset);
  }

  changeAnimation(){
    if(this.playerStateAnimationIdle){
      if(this.currentAnimation != this.playerAnimationIdle){
        this.onWhatFrame = 0;
        this.currentAnimation = this.playerAnimationIdle;
      }
    }
    else if(this.playerStateAnimationWalking && this.overallVelocityX != 0 && this.isNextToB){
      if(this.currentAnimation != this.playerAnimationWalk){
        this.onWhatFrame = 0;
        this.currentAnimation = this.playerAnimationWalk;
      }
    }
    else{
      if(this.currentAnimation != this.playerAnimationIdle){
        this.onWhatFrame = 0;
        this.currentAnimation = this.playerAnimationIdle;
      }
    }
  }
  playAnimation(frame){
    let speed = 3;
    if(this.currentAnimation[0] === this.playerAnimationWalk[0]){
      speed = 1;
    }
    else if(this.currentAnimation[0] === this.playerAnimationIdle[0]){
      speed = 3;
    }
    if(frame > speed)
    {
      this.frameCount = 0;
      if(this.onWhatFrame === this.currentAnimation.length -1 ){
        this.onWhatFrame = 0;
      }
      else{
        this.onWhatFrame++;
      }
      return this.currentAnimation[this.onWhatFrame];
    }
    else{
      return this.currentAnimation[this.onWhatFrame];
    }
  }

  interact(){//incomplete
    let lengthInFront;
    if(this.playerAnimationRight){
      lengthInFront = 20;
    }
    else{
      lengthInFront = 20;
    }
  }

  dash(right){
    console.log("dash");
    if(right){
      this.overallVelocityX = this.speed * 2;
    }
    else{
      this.overallVelocityX = -this.speed * 2;
    }
  }

  update(){//update values
    this.controlMovement();
    this.gravityPull();
    this.applyFriction();
    for(let i = 0; i < this.stepsPerFrame; i++){
      this.y += this.overallVelocityY/this.stepsPerFrame;
      this.x += this.overallVelocityX/this.stepsPerFrame;
      this.collisionPointsUpdate();
      this.collisionDetectionBottom();
      this.collisionDetectionTop();
      this.collisionDetectionSide();

      this.checkerPointsUpdate();
      this.checkerDetectionBottom();
      this.checkerDetectionTop();
      this.checkerDetectionSide();
    }
    this.displayX = this.x + this.xoffset;
    this.checkIfInAir();
    this.centerOnPlayerX();
    this.centerOnPlayerY();
  }

  show(){//render
    // console.log(this.x + this.xoffset, this.y + this.yoffset);
    // console.log("^player^");
    fill(255);
    this.changeAnimation();
    let offsetThis = 0;
    if(this.playerAnimationRight){
      if(this.crouching){
        image(this.playerAnimationCrouch, (this.x - (this.spriteWidth / 2)) + this.xoffset + offsetThis, (this.y - (this.spriteHeight / 2)) + this.yoffset, this.spriteWidth, this.spriteHeight);
        this.frameCount = 0;
      }
      else{
        image(this.playAnimation(this.frameCount), (this.x - (this.spriteWidth / 2)) + this.xoffset + offsetThis, (this.y - (this.spriteHeight / 2)) + this.yoffset, this.spriteWidth, this.spriteHeight);
      }
    }
    else if(this.playerAnimationLeft){
      scale(-1, 1);
      offsetThis = -screenX;
      if(this.crouching){
        image(this.playerAnimationCrouch, (this.x - (this.spriteWidth / 2)) + this.xoffset + offsetThis, (this.y - (this.spriteHeight / 2)) + this.yoffset, this.spriteWidth, this.spriteHeight);
        this.frameCount = 0;
      }
      else{
        image(this.playAnimation(this.frameCount), (this.x - (this.spriteWidth / 2)) + this.xoffset + offsetThis, (this.y - (this.spriteHeight / 2)) + this.yoffset, this.spriteWidth, this.spriteHeight);
      }
      scale(-1, 1);
    }
    this.frameCount++;
    // console.log(this.frameCount);
    if(this.playerAnimationRight){
      this.shield.run(this.x + this.xoffset + (this.spriteWidth*3)/4, this.y + this.yoffset);
    }
    else{
      scale(-1, 1);
      this.shield.run(this.x + this.xoffset + (this.spriteWidth*3)/4 - screenX, this.y + this.yoffset);
      scale(-1, 1);
    }
  }
}
