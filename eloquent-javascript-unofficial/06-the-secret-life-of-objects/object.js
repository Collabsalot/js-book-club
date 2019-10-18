function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`)
}
const whiteRabbit = { type: 'white', speak }
const hungryRabbit = { type: 'hungry', speak }

const Rabbit = class Rabbit {
  constructor(type) {
    this.type = type
  }

  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`)
  }
}

const killerRabbit = new Rabbit('killer')
const blackRabbit = new Rabbit('black')

Rabbit.prototype.toString = function() {
  return `a ${this.type} rabbit`
}

const toStringSymbol = Symbol('toString')

const Matrix = class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width
    this.height = height
    this.content = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y)
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x]
  }

  set(x, y, value) {
    this.content[y * this.width + x] = value
  }
}

const MatrixIterator = class MatrixIterator {
  constructor(matrix) {
    this.x = 0
    this.y = 0
    this.matrix = matrix
  }

  next() {
    if (this.y === this.matrix.height) return { done: true }

    const value = {
      x: this.x,
      y: this.y,
      value: this.matrix.get(this.x, this.y),
    }
    this.x++
    if (this.x === this.matrix.width) {
      this.x = 0
      this.y++
    }
    return { value, done: false }
  }
}

Matrix.prototype[Symbol.iterator] = function() {
  return new MatrixIterator(this)
}

const SymmetricMatrix = class SymmetricMatrix extends Matrix {
  constructor(size, element = (x, y) => undefined) {
    super(size, size, (x, y) => {
      if (x < y) return element(y, x)
      else return element(x, y)
    })
  }

  set(x, y, value) {
    super.set(x, y, value)
    if (x !== y) {
      super.set(y, x, value)
    }
  }
}

const matrix = new SymmetricMatrix(5, (x, y) => `${x},${y}`)
