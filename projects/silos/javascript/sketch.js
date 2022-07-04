var screenX = innerWidth;
var screenY = innerHeight;
var paused = false;

var player;
var mainMap;
var mapScale = 50;
var animations = {};
var chatBox;

var debugMode;

var blockImages = {
  brick: null,
  grass1: null,
  grass2: null,
  grassLeft: null,
  grassRight: null,
  grassFull: null,
  candle: null
};

//socket.io script
var multiplayer = true;
var socket;
var uniqueUserId;
var playerList = [
  // {
  //   id: "qwerty",
  //   x: 500,
  //   y: 500,
  //   animationState: "standing",
  //   facingRight: false
  // }
];
var allAnimations = [];

var defaultKeyPressed = () => {
  if (key == "Enter") {
    chatBox.makeActive();
  }
  if (key == "z") {
    testNPC = new NPC(player.x, player.y - 10, [], [], player);
  }
  if (key == "p") {
    debugMode = !debugMode;

  }
}

var mapTiles = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, -1, 6, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];


function preload() {
  blockImages.brick = { image: loadImage('assets/blocks/brick.png'), solid: true, lightStrength: 0 };
  blockImages.grass1 = { image: loadImage('assets/blocks/grass1.png'), solid: false, lightStrength: 0 };
  blockImages.grass2 = { image: loadImage('assets/blocks/grass2.png'), solid: false, lightStrength: 0 };
  blockImages.grassLeft = { image: loadImage('assets/blocks/grassLeft.png'), solid: false, lightStrength: 0 };
  blockImages.grassRight = { image: loadImage('assets/blocks/grassRight.png'), solid: false, lightStrength: 0 };
  blockImages.grassFull = { image: loadImage('assets/blocks/grassFull.png'), solid: false, lightStrength: 0 };
  blockImages.schoolDesk = { image: loadImage('assets/blocks/chair.png'), solid: false, lightStrength: 0 };
  blockImages.candle = { image: loadImage('assets/blocks/candle.png'), solid: false, lightStrength: 5 };

  animations.standing = [];
  animations.walking = [];
  animations.crouching = [];
  animations.jumping_up = [];
  animations.jumping_mid = [];
  animations.jumping_down = [];
  animations.attack = [];
  for (let i = 0; i < 11; i++) {//load idle anim
    if (i > 9) {
      animations.standing.push(loadImage("assets/idle.sprite/idle" + i + ".png"));
    }
    else {
      animations.standing.push(loadImage("assets/idle.sprite/idle0" + i + ".png"));
    }
  }
  for (let i = 0; i < 16; i++) {//load walking anim
    if (i > 9) {
      animations.walking.push(loadImage("assets/walk.sprite/walking" + i + ".png"));
    }
    else {
      animations.walking.push(loadImage("assets/walk.sprite/walking0" + i + ".png"));
    }
  }
  animations.crouching = [loadImage("assets/crouch.sprite/crouch.png")];
  animations.jumping_up = [loadImage("assets/jump.sprite/jump_up.png")];
  animations.jumping_mid = [loadImage("assets/jump.sprite/jump_middle.png")];
  animations.jumping_down = [loadImage("assets/jump.sprite/jump_down.png")];
  animations.attack = [loadImage("assets/basic_attack.sprite/basic_attack.png")];

}

function setup() {
  debugMode = false;
  createCanvas(screenX, screenY);
  mainMap = new Map(mapTiles, blockImages, mapScale);
  player = new Player(mainMap.scale, mainMap.scale * 12, mainMap);
  chatBox = new Chat();
  createAnimation("standing", animations.standing, 0.3);
  createAnimation("walking", animations.walking, 0.5);
  createAnimation("crouching", animations.crouching, 1);
  createAnimation("jumping_up", animations.jumping_up, 1);
  createAnimation("jumping_mid", animations.jumping_mid, 1);
  createAnimation("jumping_down", animations.jumping_down, 1);
  player.initiateAllAnimations(allAnimations);
  player.setAnimation("standing");

  keyPressed = defaultKeyPressed;

  if (multiplayer) {
    //socket.io code
    uniqueUserId = Math.random().toString(36).substring(7);//generate a 7 character random id
    socket = io.connect("https://" + window.location.host, { secure: true });
    socket.emit("newPlayer", {
      id: uniqueUserId,
      x: player.x,
      y: player.y,
      animationState: player.animationState,
      facingRight: player.facingRight
    });//making the server aware that a new player has connected
    window.onbeforeunload = tellServerYouDisconnected;//set a disconnect function to page unloading
    socket.on("playerList", (data) => { playerList = data.playerList });//recieve a new player list
    socket.on("removePlayer", (data) => {//remove a player that disconnected from the server from this local list
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id === data.id) {
          playerList.splice(i, 1);
        }
      }
    });
    socket.on("newMessage", (data) => {
      if (data.newMessage === chatBox.chatLog.slice(0, -1)) {
        return;
      } else {
        chatBox.addEntry(data.id, data.newMessage);
      }
    });
  }

}

function draw() {
  background(70);
  mainMap.show();
  if (multiplayer) {
    for (let player of playerList) {
      if (player.id === uniqueUserId) {
        continue;
      }
      // fill(255, 0, 0);
      // rect(player.x + map2.xoffset, player.y + map2.yoffset, 100, 100);
      showPlayer(player);
    }
  }
  player.show();
  mainMap.showEffects();
  chatBox.show();
  if (debugMode) {
    showDebug();
  }
  if (multiplayer) {
    sendStateToServer();
  }
}

function showDebug() {
  textAlign(RIGHT);
  stroke(0);
  fill(255, 255, 255);
  text(`
  X: ${player.x}
  Y: ${player.y}
  VX: ${player.vx}
  VY: ${player.vy}
  Animation: ${player.animationState}
  Blocks shown: ${mainMap.numOfBlocksShow}
  User id: ${uniqueUserId}
  `, screenX - 5, 0);
  // rect(0, 0, 200, 200);
}

function createAnimation(key, frames, speed) {
  allAnimations.push({ key: key, frames: frames, speed: speed });
}

//show other players
function showPlayer(otherUser) {
  let playerAnimation;
  for (let anim of allAnimations) {
    if (anim.key === otherUser.animationState) {
      playerAnimation = anim.frames;
    }
  }

  if (playerAnimation === null) {
    throw `Animation with key ${otherUser.animationState} was not found`;
  }
  let translateToX = otherUser.x + mainMap.xoffset;
  let translateToY = otherUser.y + mainMap.yoffset;

  let spriteW = player.spriteWidth;
  let spriteH = player.spriteHeight;

  fill(255);
  textAlign(CENTER);

  translate(translateToX, translateToY);
  if (otherUser.facingRight) {
    image(playerAnimation[0], 0, colisionMargin * 2, spriteW, spriteH);
    text(otherUser.id, spriteW / 2, 0);
  } else {
    scale(-1, 1);
    image(playerAnimation[0], -spriteW, colisionMargin * 2, spriteW, spriteH);
    text(otherUser.id, -spriteW / 2, 0);
    scale(-1, 1);
  }


  translate(-translateToX, -translateToY);
}

//communication with server functions
function sendStateToServer() {
  let data = {
    id: uniqueUserId,
    x: player.x,
    y: player.y,
    animationState: player.animationState,
    facingRight: player.facingRight
  }
  socket.emit("playerUpdate", data);
}

function tellServerYouDisconnected(e) {
  // Tell server you are disconnecting before closing the page
  noLoop();
  e.returnValue = " ";
  socket.emit("disconnectPlayer", { id: uniqueUserId });
}

