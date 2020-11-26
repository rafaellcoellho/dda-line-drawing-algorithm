/* Constantes */
const HEIGHT = 500;
const WIDTH = 500;

const SIDE_LEN = 5;

/* Variáveis Globais */
let cols, rows;
let raster;
let main;
let resetButton;

/* Utilitários */

function initRasterAndMain () {
  cols = floor(WIDTH/SIDE_LEN);
  rows =  floor(WIDTH/SIDE_LEN);
  raster = new Raster(cols, rows, SIDE_LEN);
  main = new Main();
}

/* Algoritmo DDA */
function generateFragment (x, y) {
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

  generateFragment(x, y);

  if (abs(deltaX) > abs(deltaY)) {
    while (x < x2) {
      x = x + 1;
      y = (m * x) + b;
  
      generateFragment(x, y);
    }
  } else {
    while (y < y2) {
      y = y + 1;
      x = (y - b) / m;
      
      generateFragment(x, y);
    }
  }
}

/* P5 */
function mousePressed () {
  raster.propagateClick(mouseX, mouseY);
}

function setup () {
  createCanvas(HEIGHT, WIDTH);

  initRasterAndMain();

  resetButton = createButton('reseta');
  resetButton.position(WIDTH + 50, 10);
  resetButton.mousePressed(initRasterAndMain);
}

function draw() {
  background(255);

  raster.show();
}

/* Objetos */
class Pixel {
  constructor (i, j, sideLen) {
    // Index no Raster
    this.i = i;
    this.j = j;

    // Valor de x e y no canvas
    this.x = i * sideLen;
    this.y = j * sideLen;

    this.filled = false;
    this.sideLen = sideLen;
  }

  show () {
    stroke(0);

    if (this.filled) fill(0);
    else noFill();

    rect(this.x, this.y, this.sideLen, this.sideLen);
  }

  checkClicked (px, py) {
    const xLimit = this.x + this.sideLen;
    const yLimit = this.y + this.sideLen;
    const xAxis = (px > this.x) && (px < xLimit);
    const yAxis = (py > this.y) && (py < yLimit);

    if (xAxis && yAxis) {
      this.onClick();
    }
  }

  onClick () {
    if (main.alreadyRunAlgorithm) return;
    this.filled = true;
    main.fillPoints(this.i, this.j);
  }
}

class Raster {
  constructor (rows, cols, sideLen) {
    this.matrix = this.getMatrix(rows, cols, sideLen);
  }

  getMatrix (rows, cols, sideLen) {
    const arr = new Array(cols);

    for (let i = 0; i < rows; i++) {
      arr[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        arr[i][j] = new Pixel(i, j, sideLen);
      }
    }

    return arr;
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

  propagateClick (px, py) {
    this.matrix.forEach(line => {
      line.forEach(pixel => {
        pixel.checkClicked(px, py);
      })
    })
  }
}

class Main {
  constructor () {
    this.start = undefined;
    this.end = undefined;
    this.alreadyRunAlgorithm = false;
  }

  fillPoints (i, j) {
    if (!this.start) this.start = { x: j, y: i };
    else if (!this.end) {
      this.end = { x: j, y: i };
      this.runAlgorithm();
    }
  }

  runAlgorithm () {
    dda(this.start.x, this.start.y, this.end.x, this.end.y);
    dda(this.end.x, this.end.y, this.start.x, this.start.y);
    this.alreadyRunAlgorithm = true;
  }
}
