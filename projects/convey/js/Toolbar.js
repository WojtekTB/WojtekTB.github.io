class Toolbar{
    constructor(grid){
        this.items = [];
        this.grid = grid;
        this.selected = 0;
    }

    //add another item to the toolbar
    makeItem(image, creationFunction, description){
        this.items.push({image: image, creationFunction: creationFunction, description, description});
    }

    //display all items that are in the toolbar
    show(){
        let scale = innerWidth/30;
        let frame = scale/20;
        let x = (innerWidth/2) - ((this.items.length/2) * scale);
        stroke(0);
        for(let i = 0; i < this.items.length; i++){
            if(this.selected == i){
                fill(255, 0, 0);
            }else{
                fill(0, 0, 0);
            }
            rect(x - frame + ((scale + frame*2) * i), innerHeight - scale - (frame * 2), scale + (frame * 2), scale + (frame * 2));
            image(this.items[i].image, x + (i * (scale + (frame * 2))), innerHeight - scale - frame, scale, scale);
        }
        fill(200);
        rect(innerWidth/2 - scale*3, innerHeight - (scale * 1.5) - (frame * 2), scale*6, scale /2);
        fill(0);
        textAlign(CENTER);
        text(this.items[this.selected].description, innerWidth/2, innerHeight - (scale * 1.5) + 8);
    }

    //choose next item on toolbar
    next(){
        this.selected++;
        if(this.selected > this.items.length - 1){
            this.selected = 0;
        }
    }

    //choose previous item on toolbar
    prev(){
        this.selected--;
        if(this.selected < 0){
            this.selected = this.items.length - 1;
        }
    }

    //place an item that is selected on the x, y
    place(x, y,  speed, direction, grid){
        this.items[this.selected].creationFunction(x, y, speed, direction, grid);
    }
}