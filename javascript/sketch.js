var screenX = window.innerWidth;
var screenY = window.innerHeight - 20;
var paused = false;

var player;
var playerHud;
var map1;
var map2;
var mapScale = screenY;
var animationsAndInstructions = [[], []];
var testNPC;
var stageBuilder;
// var shield;
var shieldAnimation = [];
var playerDialogueBoxImage;
var StageBuilderMode = false;


var images = {
  brick: null,
  grass1: null,
  grass2: null,
  grassLeft: null,
  grassRight: null,
  grassFull: null,
  candle: null
};

var mapTiles = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];


function preload(){
  images.brick = loadImage('assets/blocks/brick.png');
  images.grass1 = loadImage('assets/blocks/grass1.png');
  images.grass2 = loadImage('assets/blocks/grass2.png');
  images.grassLeft = loadImage('assets/blocks/grassLeft.png');
  images.grassRight = loadImage('assets/blocks/grassRight.png');
  images.grassFull = loadImage('assets/blocks/grassFull.png');
  images.schoolDesk = loadImage('assets/blocks/unnamed.png');
  images.candle = loadImage('assets/blocks/candle.png');
  for(let i = 1;  i < 12; i++){//load idle anim
    if(i > 9){
      animationsAndInstructions[0].push(loadImage("assets/idle.sprite/idle00" + i + ".png"));
    }
    else{
      animationsAndInstructions[0].push(loadImage("assets/idle.sprite/idle000" + i + ".png"));
    }
  }
  for(let i = 1;  i < 17; i++){//load walking anim
    if(i > 9){
      animationsAndInstructions[1].push(loadImage("assets/walk.sprite/walking00" + i + ".png"));
    }
    else{
      animationsAndInstructions[1].push(loadImage("assets/walk.sprite/walking000" + i + ".png"));
    }
  }
  animationsAndInstructions[2] = loadImage("assets/crouch.sprite/crouch.png");

  for(let i = 1;  i < 10; i++){//load walking anim
      shieldAnimation.push(loadImage("assets/shield.sprite/shieldO000" + i + ".png"));
  }
  animationsAndInstructions[3] = shieldAnimation;
  animationsAndInstructions[4] = loadImage("assets/textboxes/textbox_main.png");

}

function setup() {
  createCanvas(screenX, screenY);
  // map1 = new Map(mapTiles, images, mapScale);
  map2 = new Map(mapTiles, images, mapScale);
  player = new Player(map2.scale*2, 400, map2, images.player, animationsAndInstructions);
  playerHud = new PlayerHud(player);
  if(StageBuilderMode){
    stageBuilder = new StageBuilder(map2);
  }
  // shield = new Shield(mouseX, mouseY, shieldAnimation);
  // frameRate(60);
}

function draw(){
  // put drawing code here
  if(paused === false){
    background(100);
    noStroke();
    if(StageBuilderMode){
      stageBuilder.show();
    }
    else{
      player.update();
      player.show();
      map2.show();
      noStroke();
      playerHud.show();
      playerHud.update();
      if(testNPC != null){
        testNPC.run();
      }
      player.inspection();
      let fps = frameRate();
  fill(255);
  // stroke(0);
  text("FPS: " + fps.toFixed(2), 5, height - 10);
    }
  }
  // showDebug();
  // shield.run();
}


function keyPressed(){
  if (key == ' '){
    player.jump();
  }
  // if (key == 's' || keyCode == DOWN_ARROW){
  //   player.transition();
  // }
  if(key == 'z')
  {
    // console.log(player.x + player.xoffset, player.y + player.yoffset);
    testNPC = new NPC(player.x, player.y-10, [], [], player);
  }
  if(key == 'p')
  {
    player.translate(-100, 0);
    map1.translate(-100, 0);
  }
  else if(key == 'o')
  {
    player.translate(100, 0);
    map1.translate(100, 0);
  }
}

function showDebug(){
  for(let i = 0; i < player.numberOfCollisionPointsOnSide; i++){
    fill(`rgb(255, 0, 0)`);
    rect(player.playerCollisionPointsBottom[i].x + player.xoffset, player.playerCollisionPointsBottom[i].y + player.yoffset, 2, 2);
    fill(`rgb(30, 30, 255)`);
    rect(player.playerCollisionPointsTop[i].x + player.xoffset, player.playerCollisionPointsTop[i].y + player.yoffset, 2, 2);
    fill(`rgb(255, 0, 255)`);
    rect(player.playerCollisionPointsSideR[i].x + player.xoffset, player.playerCollisionPointsSideR[i].y + player.yoffset, 2, 2);
    fill(`rgb(0, 255, 0)`);
    rect(player.playerCollisionPointsSideL[i].x + player.xoffset, player.playerCollisionPointsSideL[i].y + player.yoffset, 2, 2);
  }
  for(let i = 0; i < player.numberOfCollisionPointsOnSide; i++){
    fill(`rgb(255, 0, 0)`);
    rect(player.playerCheckerPointsBottom[i].x + player.xoffset, player.playerCheckerPointsBottom[i].y + player.yoffset, 2, 2);
    fill(`rgb(30, 30, 255)`);
    rect(player.playerCheckerPointsTop[i].x + player.xoffset, player.playerCheckerPointsTop[i].y + player.yoffset, 2, 2);
    fill(`rgb(255, 0, 255)`);
    rect(player.playerCheckerPointsSideR[i].x + player.xoffset, player.playerCheckerPointsSideR[i].y + player.yoffset, 2, 2);
    fill(`rgb(0, 255, 0)`);
    rect(player.playerCheckerPointsSideL[i].x + player.xoffset, player.playerCheckerPointsSideL[i].y + player.yoffset, 2, 2);
  }
}
