let spacePressed = false;

class PlayerDialogueBox{
  constructor(image){
    this.image = image;
    this.w = this.image.width;
    this.h = this.image.height;

    //descriptions
  }
  open(text_){
    // while(spacePressed === false){
      let originText = text_;
      let textLength = originText.length;
      // paused = true
      console.log("waiting");
      image(this.image, screenX/4, screenY/4, (screenX * 2)/4, (this.h*((screenX*2)/4))/this.w);
      fill(255);
      text(originText, screenX/4 + screenX/18, (screenY/4) + 10 , ((screenX * 2)/4)-screenX/15, (this.h*((screenX*2)/4))/this.w);
      // paused = false;
      if (keyIsDown("Y".charCodeAt(0))) {
        spacePressed = true;
        console.log(spacePressed);
      }
      else{
        spacePressed = false;
      }
    // }
  }
}
