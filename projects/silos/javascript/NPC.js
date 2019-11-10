class NPC{
  constructor(x, y, animations, moving, player){
    this.name = "Test NPC";
    this.specialText = "I am only born to die, there is no other reason for my existance. Every day I spend on this grid is suffering and pain. Please help."
    this.moving = moving;
    this.idleAnimation = animations[0];
    // this.spriteW = this.this.idleAnimation[0].width;
    // this.spriteH = this.this.idleAnimation[0].height;
    this.spriteW = 30;
    this.spriteH = 90;
    this.x = x;
    this.y = y;
    this.xoffset = 0;
    this.yoffset = 0;
    this.previousx = this.x;
    this.previousy = this.y;
    this.player = player;
    this.map = player.map;
    if(this.moving){
      this.walkingAnimation = animations[1];
    }
    this.bottomCollisionPoint = new CollisionPoint(null, null);
    this.rightCollisionPoint = new CollisionPoint(null, null);
    this.leftCollisionPoint = new CollisionPoint(null, null);

    //-----vectors-----
    this.speed = 6;//walking speed force
    this.jumpForce = 10;//jumping force
    this.overallVelocityY = 0;//total force acting on sprite on Y
    this.overallVelocityX = 0;//total force acting on sprite on X
    this.gravity = 0.5;//downward pull
    this.stepsPerFrame = 2;

    this.walkingRight = false;
  }

  showDialogue(){
    
  }

  collisionDetectionSide(){
    let nonBumped = true;
    let tileX = Math.floor(this.rightCollisionPoint.x / this.map.scale);
    let tileY = Math.floor(this.rightCollisionPoint.y / this.map.scale);
    let tilePlayerIsOn = this.map.mapTiles[tileY][tileX];
    if(this.map.airBlocks.includes(tilePlayerIsOn) === false){//right side
      this.x = this.previousX;
      this.walkingRight = false;
      nonBumped = false;
    }
    tileX = Math.floor(this.leftCollisionPoint.x / this.map.scale);
    tileY = Math.floor(this.leftCollisionPoint.y / this.map.scale);
    tilePlayerIsOn = this.map.mapTiles[tileY][tileX];
    if(this.map.airBlocks.includes(tilePlayerIsOn) === false){//left side
      this.x = this.previousX;
      this.walkingRight = true;
      nonBumped = false;
    }
    if(nonBumped){
      this.previousX = this.x;
    }
  }

  collisionDetectionBottom(){
    let nonBumped = true;
    let tileX = Math.floor(this.bottomCollisionPoint.x / this.map.scale);
    let tileY = Math.floor(this.bottomCollisionPoint.y / this.map.scale);
    // console.log(this.bottomCollisionPoint.x, this.bottomCollisionPoint.y, this.map.scale);
    let tilePlayerIsOn = this.map.mapTiles[tileY][tileX];
    if(this.map.airBlocks.includes(tilePlayerIsOn) === false){
      this.y = this.previousY;
      this.overallVelocityY = 0;
      nonBumped = false;
    }
    if(nonBumped){
      this.previousY = this.y;
    }
  }

  collisionPointsUpdate(){
    this.leftCollisionPoint.x = this.x - this.spriteW/2;
    this.leftCollisionPoint.y = this.y;
    this.rightCollisionPoint.x = this.x + this.spriteW/2;
    this.rightCollisionPoint.y = this.y;
    this.bottomCollisionPoint.x = this.x;
    this.bottomCollisionPoint.y = this.y + this.spriteH/2;
    }

  gravityPull(){
    this.overallVelocityY += this.gravity;
  }

  show(){
    // image(this.idleAnimation[0]);
    fill(0);
    rect(this.x-this.spriteW/2 + this.xoffset, this.y-this.spriteH/2 + this.yoffset, this.spriteW, this.spriteH);
    fill(`rgb(0, 255, 0)`);
    rect(this.bottomCollisionPoint.x + this.xoffset, this.bottomCollisionPoint.y + this.yoffset, 1, 1);
    rect(this.rightCollisionPoint.x + this.xoffset, this.rightCollisionPoint.y + this.yoffset, 1, 1);
    rect(this.leftCollisionPoint.x + this.xoffset, this.leftCollisionPoint.y + this.yoffset, 1, 1);
  }

  update(){
    // console.log(this.x, this.y);
    this.gravityPull();
    this.y += this.overallVelocityY;
    this.collisionPointsUpdate();
    this.collisionDetectionBottom();
    this.collisionDetectionSide();
    this.collisionPointsUpdate();
    this.xoffset = this.player.xoffset;
    this.yoffset = this.player.yoffset;
    if(this.walkingRight){
      this.x += 1;
    }
    else{
      this.x -= 1;
    }
  }

  run(){
    this.show();
    this.update();
  }
}
