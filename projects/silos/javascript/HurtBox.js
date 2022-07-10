class HurtBox{
    constructor(x, y, w, h, life){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.life = life;
    }

    overlaps(box){
        //check for collisions of two boxes
        if(this.x > box.x + box.w || this.x + this.w < box.x){
            return false;
        }
        if(this.y > box.y + box.h || this.y + this.h < box.y){
            return false;
        }
        return true;
    }

    show(xoffset, yoffset){
        noStroke();
        fill(255, 0, 0);
        rect(this.x + xoffset, this.y + yoffset, this.w, this.h);
        // image(animations.attack[0], this.x + xoffset, this.y + yoffset, this.w, this.h);
    }

    update(){
        this.life--;
    }

}