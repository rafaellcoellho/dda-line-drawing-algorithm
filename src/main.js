
const HEIGHT = 700;
const WIDTH = 700;

const SIZE = 35;

let cols, rows;
let raster;

function generate_fragment (x, y) {
  const xm = floor(x);
  const ym = floor(y);
  raster.putPixel(xm, ym);
}

function dda (x1, y1, x2, y2) {
  let x = x1;
  let y = y1;
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const m = deltaY / deltaX;
  const b = y - (m * x);

  generate_fragment(x, y);

  if (abs(deltaX) > abs(deltaY)) {
    while (x < x2) {
      x = x + 1;
      y = (m * x) + b;
  
      generate_fragment(x, y);
    }
  } else {
    while (y < y2) {
      y = y + 1;
      x = (y - b) / m;
      
      generate_fragment(x, y);
    }
  }
}

function setup () {
  createCanvas(HEIGHT, WIDTH);

  cols = floor(WIDTH/SIZE);
  rows =  floor(WIDTH/SIZE);

  raster = new Raster(cols, rows);
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
