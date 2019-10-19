class PlayerHud{
  constructor(playerObject){
    this.mainImageHud = loadImage("/assets/hud/hud.png");
    this.player = playerObject;
    this.playerHP = [this.player.MaxHP, this.player.CurrentHP];
    this.playerMP = [this.player.MaxMP, this.player.CurrentMP];
    this.hpX = 0;
    this.hpY = 0;
    this.mpX = 0;
    this.mpY = 0;
  }

  show(){
    fill(`rgb(255, 0, 0)`);
    rect(this.hpX, this.hpY, 400 * (this.playerHP[1]/this.playerHP[0]), 25);
    fill(`rgb(0, 0, 255)`);
    rect(this.mpX, this.mpY + 25, 400 * (this.playerMP[1]/this.playerMP[0]), 25);
    image(this.mainImageHud, 0, 0, 400, 50);
  }
  update(){
    this.playerHP = [this.player.MaxHP, this.player.CurrentHP];
    this.playerMP = [this.player.MaxMP, this.player.CurrentMP];
  }
}
