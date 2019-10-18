const Picture = class Picture {
  constructor(width, height, pixels) {
    this.width = width
    this.height = height
    this.pixels = pixels
  }

  static empty(width, height, color) {
    const pixels = new Array(width * height).fill(color)
    return new Picture(width, height, pixels)
  }

  pixel(x, y) {
    return this.pixels[x + y * this.width]
  }

  draw(pixels) {
    const copy = this.pixels.slice()
    for (const { x, y, color } of pixels) {
      copy[x + y * this.width] = color
    }
    return new Picture(this.width, this.height, copy)
  }
}

const updateState = (state, action) => Object.assign({}, state, action)

const elt = (type, props, ...children) => {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  return dom
}

const scale = 10

const drawPicture = (picture, canvas, scale) => {
  canvas.width = picture.width * scale
  canvas.height = picture.height * scale
  const cx = canvas.getContext('2d')

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y)
      cx.fillRect(x * scale, y * scale, scale, scale)
    }
  }
}

const PictureCanvas = class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt('canvas', {
      onmousedown: (event) => this.mouse(event, pointerDown),
      ontouchstart: (event) => this.touch(event, pointerDown),
    })
    this.syncState(picture)
  }

  syncState(picture) {
    if (this.picture === picture) return
    this.picture = picture
    drawPicture(this.picture, this.dom, scale)
  }
}

const pointerPosition = (pos, domNode) => {
  const rect = domNode.getBoundingClientRect()
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  }
}

PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button !== 0) return
  let pos = pointerPosition(downEvent, this.dom)
  const onMove = onDown(pos)
  if (!onMove) return
  const move = (moveEvent) => {
    if (moveEvent.buttons === 0) {
      this.dom.removeEventListener('mousemove', move)
    } else {
      const newPos = pointerPosition(moveEvent, this.dom)
      if (newPos.x === pos.x && newPos.y === pos.y) return
      pos = newPos
      onMove(newPos)
    }
  }
  this.dom.addEventListener('mousemove', move)
}

PictureCanvas.prototype.touch = function(startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom)
  const onMove = onDown(pos)
  startEvent.preventDefault()
  if (!onMove) return
  const move = (moveEvent) => {
    const newPos = pointerPosition(moveEvent.touches[0], this.dom)
    if (newPos.x === pos.x && newPos.y === pos.y) return
    pos = newPos
    onMove(newPos)
  }
  const end = () => {
    this.dom.removeEventListener('touchmove', move)
    this.dom.removeEventListener('touchend', end)
  }
  this.dom.addEventListener('touchmove', move)
  this.dom.addEventListener('touchend', end)
}

const PixelEditor = class PixelEditor {
  constructor(state, config) {
    const { tools, controls, dispatch } = config
    this.state = state

    this.canvas = new PictureCanvas(state.picture, (pos) => {
      const tool = tools[this.state.tool]
      const onMove = tool(pos, this.state, dispatch)
      if (onMove) return (pos) => onMove(pos, this.state)
    })
    this.controls = controls.map((Control) => new Control(state, config))
    this.dom = elt(
      'div',
      {},
      this.canvas.dom,
      elt('br'),
      ...this.controls.reduce((a, c) => a.concat(' ', c.dom), []),
    )
  }

  syncState(state) {
    this.state = state
    this.canvas.syncState(state.picture)
    for (const ctrl of this.controls) ctrl.syncState(state)
  }
}

const ToolSelect = class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt(
      'select',
      {
        onchange: () => dispatch({ tool: this.select.value }),
      },
      ...Object.keys(tools).map((name) =>
        elt(
          'option',
          {
            selected: name === state.tool,
          },
          name,
        ),
      ),
    )
    this.dom = elt('label', null, '🖌 Tool: ', this.select)
  }

  syncState(state) {
    this.select.value = state.tool
  }
}

const ColorSelect = class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt('input', {
      type: 'color',
      value: state.color,
      onchange: () => dispatch({ color: this.input.value }),
    })
    this.dom = elt('label', null, '🎨 Color: ', this.input)
  }

  syncState(state) {
    this.input.value = state.color
  }
}

const draw = (pos, state, dispatch) => {
  const drawPixel = ({ x, y }, state) => {
    const drawn = { x, y, color: state.color }
    dispatch({ picture: state.picture.draw([drawn]) })
  }
  drawPixel(pos, state)
  return drawPixel
}

const rectangle = (start, state, dispatch) => {
  const drawRectangle = (pos) => {
    const xStart = Math.min(start.x, pos.x)
    const yStart = Math.min(start.y, pos.y)
    const xEnd = Math.max(start.x, pos.x)
    const yEnd = Math.max(start.y, pos.y)
    const drawn = []
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color })
      }
    }
    dispatch({ picture: state.picture.draw(drawn) })
  }
  drawRectangle(start)
  return drawRectangle
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
]

const fill = ({ x, y }, state, dispatch) => {
  const targetColor = state.picture.pixel(x, y)
  const drawn = [{ x, y, color: state.color }]
  for (let done = 0; done < drawn.length; done++) {
    for (const { dx, dy } of around) {
      const x = drawn[done].x + dx
      const y = drawn[done].y + dy
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) === targetColor &&
        !drawn.some((p) => p.x === x && p.y === y)
      ) {
        drawn.push({ x, y, color: state.color })
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) })
}

const pick = (pos, state, dispatch) => {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) })
}

const SaveButton = class SaveButton {
  constructor(state) {
    this.picture = state.picture
    this.dom = elt(
      'button',
      {
        onclick: () => this.save(),
      },
      '💾 Save',
    )
  }

  save() {
    const canvas = elt('canvas')
    drawPicture(this.picture, canvas, 1)
    const link = elt('a', {
      href: canvas.toDataURL(),
      download: 'pixelart.png',
    })
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  syncState(state) {
    this.picture = state.picture
  }
}

const startLoad = (dispatch) => {
  const input = elt('input', {
    type: 'file',
    onchange: () => finishLoad(input.files[0], dispatch),
  })
  document.body.appendChild(input)
  input.click()
  input.remove()
}

const LoadButton = class LoadButton {
  constructor(_, { dispatch }) {
    this.dom = elt(
      'button',
      {
        onclick: () => startLoad(dispatch),
      },
      '📁 Load',
    )
  }

  syncState() {}
}

const pictureFromImage = (image) => {
  const width = Math.min(100, image.width)
  const height = Math.min(100, image.height)
  const canvas = elt('canvas', { width, height })
  const cx = canvas.getContext('2d')
  cx.drawImage(image, 0, 0)
  const pixels = []
  const { data } = cx.getImageData(0, 0, width, height)

  const hex = (n) => n.toString(16).padStart(2, '0')
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = data.slice(i, i + 3)
    pixels.push('#' + hex(r) + hex(g) + hex(b))
  }
  return new Picture(width, height, pixels)
}

const finishLoad = (file, dispatch) => {
  if (file == null) return
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    const image = elt('img', {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    })
  })
  reader.readAsDataURL(file)
}

const historyUpdateState = (state, action) => {
  if (action.undo === true) {
    if (state.done.length === 0) return state
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    })
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
    })
  } else {
    return Object.assign({}, state, action)
  }
}

const UndoButton = class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt(
      'button',
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length === 0,
      },
      '⮪ Undo',
    )
  }

  syncState(state) {
    this.dom.disabled = state.done.length === 0
  }
}

const startState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0,
}

const baseTools = { draw, fill, rectangle, pick }

const baseControls = [
  ToolSelect,
  ColorSelect,
  SaveButton,
  LoadButton,
  UndoButton,
]

const startPixelEditor = ({
  state = startState,
  tools = baseTools,
  controls = baseControls,
}) => {
  const app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action)
      app.syncState(state)
    },
  })
  return app.dom
}

module.exports = { updateState, startPixelEditor }
