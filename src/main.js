
const HEIGHT = 700;
const WIDTH = 700;

const SIZE = 70;

let cols, rows;

let raster = undefined;

function setup () {
  createCanvas(HEIGHT, WIDTH);

  cols = floor(WIDTH/SIZE);
  rows =  floor(WIDTH/SIZE);

  raster = new Raster(cols, rows);
  raster.putPixel(3, 0);
}

function draw() {
  background(255);

  raster.show();
}

class Pixel {
  constructor (i, j) {
    this.i = i;
    this.j = j;
    this.filled = false;
  }

  show () {
    const x = this.i * SIZE;
    const y = this.j * SIZE;

    stroke(0);

    if (this.filled) fill(0);
    else noFill();

    rect(x, y, SIZE, SIZE);
  }
}

class Raster {
  constructor (rows, cols) {
    this.matrix = new Array(cols);

    for (let i = 0; i < rows; i++) {
      this.matrix[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        this.matrix[i][j] = new Pixel(i, j);
      }
    }
  }

  show () {
    this.matrix.forEach(line => {
      line.forEach(pixel => {
        pixel.show();
      })
    })
  }

  putPixel (i, j) {
    this.matrix[j][i].filled = true;
  }
}
