class CollisionPoint{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  getValues(){
    let output = {
      x: this.x,
      y: this.y
    }
    return output;
  }
}
