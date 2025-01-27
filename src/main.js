/* Constantes */
const HEIGHT = 500;
const WIDTH = 500;

const INITIAL_SIDE_LEN = 35;

/* Variáveis Globais */
let cols, rows;
let raster;
let main;

let sideSlider;
let sliderLastValue = 7;

let resolutionDisplay;

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

/* Utilitários */
function initRasterAndMain (sideLen) {
  cols = floor(WIDTH/sideLen);
  rows =  floor(HEIGHT/sideLen);
  raster = new Raster(cols, rows, sideLen);
  main = new Main();
}

function checkSlider () {
  const actualValue = sideSlider.value();
  if (sliderLastValue !== actualValue) {
    const newSideLen = actualValue * 5;
    initRasterAndMain(newSideLen);

    sliderLastValue = actualValue;
    updateResolutionDisplay();
  }
}

function updateResolutionDisplay () {
  const rows = floor(WIDTH/(sliderLastValue*5));
  const height = floor(HEIGHT/(sliderLastValue*5));

  resolutionDisplay.html(`resolução: ${rows} / ${height}`);
}

/* P5 */
function mousePressed () {
  raster.propagateClick(mouseX, mouseY);
}

function setup () {
  createCanvas(HEIGHT, WIDTH);

  initRasterAndMain(INITIAL_SIDE_LEN);

  sideSlider = createSlider(2, 10, sliderLastValue);
  sideSlider.position(WIDTH + 50, 10);

  resolutionDisplay = createSpan(`resolução: 0 / 0`);
  resolutionDisplay.position(sideSlider.x + sideSlider.width + 10, sideSlider.y);
  updateResolutionDisplay();

  const resetButton = createButton('reseta');
  resetButton.position(WIDTH + 50, sideSlider.y + sideSlider.height + 10);
  resetButton.mousePressed(() => {
    initRasterAndMain(sliderLastValue * 5);
  });

  const firstResolutionButton = createButton('resolução 10/10');
  firstResolutionButton.position(WIDTH + 50, resetButton.y + resetButton.height + 10);
  firstResolutionButton.mousePressed(() => {
    initRasterAndMain(sliderLastValue * 5);
    sideSlider.value(10);
    setTimeout(() => {
      raster.propagateClick(29, 61);
      raster.propagateClick(474, 419);
    }, 100);
  });

  const secondResolutionButton = createButton('resolução 33/33');
  secondResolutionButton.position(WIDTH + 50, firstResolutionButton.y + firstResolutionButton.height + 10);
  secondResolutionButton.mousePressed(() => {
    initRasterAndMain(sliderLastValue * 5);
    sideSlider.value(3);
    setTimeout(() => {
      raster.propagateClick(7, 19);
      raster.propagateClick(488, 472);
    }, 100);
  });

  const thirdResolutionButton = createButton('resolução 50/50');
  thirdResolutionButton.position(WIDTH + 50, secondResolutionButton.y + secondResolutionButton.height + 10);
  thirdResolutionButton.mousePressed(() => {
    initRasterAndMain(sliderLastValue * 5);
    sideSlider.value(2);
    setTimeout(() => {
      raster.propagateClick(7, 14);
      raster.propagateClick(496, 484);
    }, 100);
  });

  const verticalLineButton = createButton('linha vertical');
  verticalLineButton.position(WIDTH + 50, thirdResolutionButton.y + thirdResolutionButton.height + 10);
  verticalLineButton.mousePressed(() => {
    initRasterAndMain(sliderLastValue * 5);
    sideSlider.value(2);
    setTimeout(() => {
      raster.propagateClick(2, 2);
      raster.propagateClick(136, 496);
    }, 100);
  });

  const horizontalLineButton = createButton('linha horizontal');
  horizontalLineButton.position(WIDTH + 50, verticalLineButton.y + verticalLineButton.height + 10);
  horizontalLineButton.mousePressed(() => {
    initRasterAndMain(sliderLastValue * 5);
    sideSlider.value(2);
    setTimeout(() => {
      raster.propagateClick(8, 2);
      raster.propagateClick(494, 77);
    }, 100);
  });
}

function draw() {
  background(255);

  checkSlider();
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
    console.log(px, py);
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
