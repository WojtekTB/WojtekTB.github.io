var colisionMargin = 3;

class Player {
  constructor(startingX, startingY, map) {
    this.map = map;

    this.animations = [];
    this.currentAnimation = [];
    this.animationCounter = 0;
    this.animationSpeed = 1;
    this.spriteWidth = this.map.scale * 1.5;
    this.spriteHeight = this.map.scale * 2;
    this.facingRight = true;
    this.animationState = ''
    //where to show the character on the screen
    this.showX = screenX / 2 - this.spriteWidth / 2;
    this.showY = screenY * (2 / 3) - this.spriteHeight;
    //movement and physics vars
    this.x = startingX;
    this.y = startingY;
    this.prevX = this.x;
    this.prevY = this.y;
    this.vx = 0;
    this.vy = 0;
    this.decayRate = 0.9;
    this.movementSpeed = 1;
    this.gravity = 0.7;
    this.jumpMagnitude = 20;
    //colision vars
    this.colisionPointsWidth = 2 + Math.floor(this.spriteWidth / this.map.scale);//how many collision points you need on bottom and top
    this.colisionPointsHeight = 2 + Math.floor(this.spriteHeight / this.map.scale);//how many collision points you need on left and right
    //player states
    this.state_canJump = false;
    this.state_inAir = false;
    this.state_crouch = false;
    this.attackCooldown = 0;

    //multiplayer stuff
    this.id = "";
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  initiateAllAnimations(arrayOfAnimationObjects) {
    for (let anim of arrayOfAnimationObjects) {
      this.addAnimation(anim.key, anim.frames, anim.speed);
    }
  }

  addAnimation(key, animationArray, animationSpeed) {
    this.animations.push({ key: key, animationArray: animationArray, speed: animationSpeed });
  }

  setAnimation(key) {
    if (this.animationState == key) {
      return;
    }
    this.animationState = key;
    for (let i = 0; i < this.animations.length; i++) {
      let animation = this.animations[i];
      if (animation.key === key) {
        this.currentAnimation = animation.animationArray;
        this.animationSpeed = animation.speed;
        this.animationCounter = 0;
        return;
      }
    }
    throw `Didn't find animation with key "${key}"`
  }

  addVelUp(mag) {
    this.vy -= mag;
  }
  addVelDown(mag) {
    this.vy += mag;
  }
  addVelLeft(mag) {
    this.vx -= mag;
  }
  addVelRight(mag) {
    this.vx += mag;
  }

  velDecay() {
    this.vx *= this.decayRate;
    this.vy *= this.decayRate;
  }

  movementControlls() {
    if (!this.state_crouch) {
      if (keyIsDown(LEFT_ARROW)) {
        this.addVelLeft(this.movementSpeed);
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.addVelRight(this.movementSpeed);
      }
      if (keyIsDown(UP_ARROW)) {
        if (this.state_canJump) {
          this.jump();
        }
      }
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.setAnimation("crouching");
      this.state_crouch = true;
    } else {
      this.state_crouch = false;
    }
    if (keyIsDown("A".charCodeAt())) {
      this.attack();
    }
  }

  jump() {
    this.addVelUp(this.jumpMagnitude);
    if (Math.floor(Math.abs(this.vx)) != 0) {
      if (this.vx > 0) {
        this.addVelRight(this.movementSpeed * 5);
      } else {
        this.addVelLeft(this.movementSpeed * 5);
      }
    }
    this.state_canJump = false;
  }

  update() {
    this.animationCounter++;
    this.attackCooldown--;
    if (this.state_inAir) {
      if (this.vy > this.gravity * 5) {
        this.setAnimation("jumping_down");
      } else if (this.vy < -this.gravity * 5) {
        this.setAnimation("jumping_up");
      } else {
        this.setAnimation("jumping_mid");

      }
    }
    else if (Math.floor(Math.abs(this.vx)) != 0) {
      this.setAnimation("walking")
    } else {
      this.setAnimation("standing")
    }
    //update position
    this.movementControlls();
    //gravity
    this.addVelDown(this.gravity);
    this.velDecay();
    this.checkForCollision();
    this.map.setXOffset(-this.x + this.showX)
    this.map.setYOffset(-this.y + this.showY)
  }

  show() {
    this.update();
    if (this.vx < 0) {
      this.facingRight = false;
      scale(-1, 1);
      image(this.currentAnimation[Math.floor((this.animationCounter * this.animationSpeed) % this.currentAnimation.length)], -this.showX, this.showY + colisionMargin * 2, -this.spriteWidth, this.spriteHeight);
    }
    else if (this.vx > 0) {
      this.facingRight = true;
      image(this.currentAnimation[Math.floor((this.animationCounter * this.animationSpeed) % this.currentAnimation.length)], this.showX, this.showY + colisionMargin * 2, this.spriteWidth, this.spriteHeight);
      // scale(-1, 1);
    } else {
      if (this.facingRight) {
        image(this.currentAnimation[Math.floor((this.animationCounter * this.animationSpeed) % this.currentAnimation.length)], this.showX, this.showY + colisionMargin * 2, this.spriteWidth, this.spriteHeight);
      } else {
        scale(-1, 1);
        image(this.currentAnimation[Math.floor((this.animationCounter * this.animationSpeed) % this.currentAnimation.length)], -this.showX, this.showY + colisionMargin * 2, -this.spriteWidth, this.spriteHeight);
        scale(-1, 1);
      }
    }
    if (this.vx < 0) {
      scale(-1, 1);
    }
  }

  checkForCollision() {
    noStroke()
    for (let j = 0; j < 4; j++) {
      this.prevX = this.x;
      this.prevY = this.y;
      this.x += this.vx / 4;
      this.y += this.vy / 4;

      let touchedWall = false;

      //the idea is to only check colision on the side were the velocity points because it cannot colide with walls if it is not moving in that direction
      let margin = colisionMargin;
      let xCheckCord = -margin;
      let yCheckCord = -margin;
      if (this.vx > 0) {
        xCheckCord = this.spriteWidth + (margin * 2);
      }
      if (this.vy > 0) {
        yCheckCord = this.spriteHeight + (margin * 2);
      }
      // fill(255, 0, 0);
      for (let i = 0; i < this.colisionPointsHeight + 1; i++) {
        // rect(this.showX + xCheckCord, this.showY + i * (this.spriteHeight/this.colisionPointsHeight), 5, 5);
        if (this.map.checkIfSolidBlock(this.x + xCheckCord, this.y + i * (this.spriteHeight / this.colisionPointsHeight))) {
          this.x = this.prevX;
          this.vx = 0;
          touchedWall = true;
          break;
        }
      }
      // fill(0, 0, 255);
      for (let i = 0; i < this.colisionPointsWidth + 1; i++) {
        // rect(this.showX + i * (this.spriteWidth/this.colisionPointsWidth), this.showY + yCheckCord, 5, 5);
        if (this.map.checkIfSolidBlock(this.x + i * (this.spriteWidth / this.colisionPointsWidth), this.y + yCheckCord)) {
          this.y = this.prevY;
          this.vy = 0;
          this.state_canJump = true;
          touchedWall = true;
          break;
        }
      }
      if (touchedWall) {
        this.state_inAir = false;
        this.x += (4 - j) * this.vx / 4;
        this.y += (4 - j) * this.vy / 4;
        break;
      } else {
        this.state_inAir = true;
      }
    }
  }

  attack() {
    if (this.attackCooldown > 0) {
      return;
    } else {
      let attackWidth = 100;
      let attackHeight = this.spriteHeight;
      let attackX;
      let attackY = this.y;
      if (this.facingRight) {
        attackX = this.x + this.spriteWidth;
      } else {
        attackX = this.x - attackWidth;
      }
      this.map.addHurtBox(attackX, attackY, attackWidth, attackHeight, 10);
      this.attackCooldown = 20;
    }
  }
}
