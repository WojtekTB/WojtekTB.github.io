class Element {
  constructor(width, height, data) {
    this.data = [];
    this.imageWidth = width;
    this.imageHeight = height;
    if (data === undefined) {
      //if data not given, randomize data
      // let maxNumberOfShapes = 10;
      // let numberOfShapes = Math.floor(Math.random() * maxNumberOfShapes) + 3;
      console.log("data not given");
      // for (let i = 0; i < numberOfShapes; i++) {
      this.data = this.data.concat(this.makeRandomShape());
      // }
    } else {
      this.data = data;
    }
    this.fitness = 0;
  }

  getFitness() {
    return this.fitness;
  }

  calculateFitness() {
    this.show();
    //load pixels of canvas to pixels[] array
    loadPixels();
    let maximumError = 255 * 3 * (this.imageWidth * this.imageHeight);
    let difference = 0;

    for (let i = 0; i < imagePixels.length; i += 4) {
      let r = i;
      let g = i + 1;
      let b = i + 2;

      let deltaR = Math.abs(pixels[r] - imagePixels[r]);
      let deltaG = Math.abs(pixels[g] - imagePixels[g]);
      let deltaB = Math.abs(pixels[b] - imagePixels[b]);
      difference += deltaR + deltaG + deltaB;
    }

    let fitness = 1 - (difference / maximumError); //normalize it between 0 and 1
    // let polyNum = 40;
    // if (this.data.length / 8 > polyNum) {
    //   fitness -= 0.0001 * (this.data.length / 8 - polyNum);
    // }
    this.fitness = fitness; //I decided to square fitness because I want to emphesize the small imprevements
  }

  show() {
    background(0);
    // clear();
    noStroke();
    for (let i = 0; i < this.data.length; i += 9) {
      let shape = {
        shapeType: this.data[i],
        magnitude: this.data[i + 1],
        x: this.data[i + 2],
        y: this.data[i + 3],
        rotation: this.data[i + 4],
        R: this.data[i + 5],
        G: this.data[i + 6],
        B: this.data[i + 7],
        A: this.data[i + 8]
      };
      // console.log(shape);

      fill(shape.R, shape.G, shape.B, shape.A);
      translate(shape.x, shape.y);
      rotate(shape.rotation * (3.14 / 180)); //convert degrees to radiants
      if (shape.shapeType == 0) {
        rect(0, 0, shape.magnitude, shape.magnitude);
      } else if (shape.shapeType == 1) {
        triangle(
          0,
          0,
          -shape.magnitude,
          shape.magnitude,
          shape.magnitude,
          shape.magnitude
        );
      } else if (shape.shapeType == 2) {
        circle(0, 0, shape.magnitude);
      }
      rotate(-shape.rotation * (3.14 / 180));
      translate(-shape.x, -shape.y);
    }
    // image(imageToGuess, this.imageWidth, 0, this.imageWidth, this.imageHeight);
    // image(imageToGuess, 0, 0, this.imageWidth, this.imageHeight);
  }

  outlineShapes() {
    noFill();
    stroke(255, 0, 0);
    for (let i = 0; i < this.data.length; i += 9) {
      let shape = {
        shapeType: this.data[i],
        magnitude: this.data[i + 1],
        x: this.data[i + 2],
        y: this.data[i + 3],
        rotation: this.data[i + 4],
        R: this.data[i + 5],
        G: this.data[i + 6],
        B: this.data[i + 7],
        A: this.data[i + 8]
      };
      fill(shape.R, shape.G, shape.B, shape.A);
      translate(shape.x, shape.y);
      rotate(shape.rotation * (3.14 / 180)); //convert degrees to radiants
      if (shape.shapeType == 0) {
        rect(0, 0, shape.magnitude, shape.magnitude);
      } else if (shape.shapeType == 1) {
        triangle(
          0,
          0,
          -shape.magnitude,
          shape.magnitude,
          shape.magnitude,
          shape.magnitude
        );
      } else if (shape.shapeType == 2) {
        circle(0, 0, shape.magnitude);
      }
      rotate(-shape.rotation * (3.14 / 180));
      translate(-shape.x, -shape.y);
    }
    image(imageToGuess, this.imageWidth, 0, this.imageWidth, this.imageHeight);
  }

  makeRandomShape() {
    /**
     * 3 types of different shapes 0: rectangle, 1: triangle, 2:circle
     * Then magnitude of shape (how big it is) from 1 to 50(? max magnitude to be determined)
     * Then X, then Y of shape
     * then rotation of the shape
     * then R,G,B of the shape
     *
     * thus DNA will come in a set of 8 numbers
     */
    // let newShape = {
    //   shapeType: Math.floor(Math.random() * 3),
    //   magnitude: Math.floor(Math.random() * 50) + 1,
    //   x: Math.floor(Math.random() * this.imageWidth),
    //   y: Math.floor(Math.random() * this.imageHeight),
    //   rotation: Math.floor(Math.random() * 359),
    //   R: Math.floor(Math.random() * 255),
    //   G: Math.floor(Math.random() * 255),
    //   B: Math.floor(Math.random() * 255),
    //   A: Math.floor(Math.random() * 255)
    // };
    return [
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * this.imageWidth) + 1,
      Math.floor(Math.random() * this.imageWidth),
      Math.floor(Math.random() * this.imageHeight),
      Math.floor(Math.random() * 359),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ];
  }

  mutate() {
    let r = Math.random();

    if (r < 0.33 && this.data.length > 2 * 9) {
      let mutationId = Math.floor(Math.random() * (this.data.length / 9));
      this.data.splice(mutationId * 9, 9);
      // console.log("tried removing");
    } else if (r < 0.66) {
      this.data = this.data.concat(this.makeRandomShape());
    } else {
      let mutationId = Math.floor(Math.random() * (this.data.length / 9));
      let newshape = this.makeRandomShape();
      this.data[mutationId] = newshape[0];
      this.data[mutationId + 1] = newshape[1];
      this.data[mutationId + 2] = newshape[2];
      this.data[mutationId + 3] = newshape[3];
      this.data[mutationId + 4] = newshape[4];
      this.data[mutationId + 5] = newshape[5];
      this.data[mutationId + 6] = newshape[6];
      this.data[mutationId + 7] = newshape[7];
      this.data[mutationId + 8] = newshape[8];
    }
  }
}
