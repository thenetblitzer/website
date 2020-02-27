import React, { Component } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import simplex from 'simplex-noise'


class FlowField {
  constructor () {
    this.currentWidth = 0
    this.currentHeight = 0
    this.currentField = {}

    this.generatedWidth = 0
    this.generatedHeight = 0
    this.noise = new simplex()
  }

  generateField = (width, height) => {

    if  (this.generatedWidth > 0) {
      // Fill in the space around the field.
      //  Left side
      for (let i = -Math.ceil(width / 2); i < Math.ceil(this.generatedWidth / 2); i++) {
        this.currentField[i] = {}
        for (let j = -Math.ceil(height / 2); j < Math.floor(height / 2); j++) {
          const val = (this.noise.noise2D(i / 800, j / 800) + 1) * Math.PI * 2
          this.currentField[i][j] = val
        }
      }
      //  Right side
      for (let i = Math.floor(this.generatedWidth / 2); i < Math.floor(width / 2); i++) {
        this.currentField[i] = {}
        for (let j = -Math.ceil(height / 2); j < Math.floor(height / 2); j++) {
          const val = (this.noise.noise2D(i / 800, j / 800) + 1) * Math.PI * 2
          this.currentField[i][j] = val
        }
      }
      // Top side
      for (let i = -Math.ceil(this.generatedWidth / 2); i < Math.floor(this.generatedWidth / 2); i++) {
        for (let j = -Math.ceil(height / 2); j < Math.ceil(this.generatedHeight / 2); j++) {
          const val = (this.noise.noise2D(i / 800, j / 800) + 1) * Math.PI * 2
          this.currentField[i][j] = val
        }
      }
      //  Bottom side
      for (let i = -Math.ceil(this.generatedWidth / 2); i < Math.floor(this.generatedWidth / 2); i++) {
        for (let j = Math.floor(this.generatedHeight / 2); j < Math.floor(height / 2); j++) {
          const val = (this.noise.noise2D(i / 800, j / 800) + 1) * Math.PI * 2
          this.currentField[i][j] = val
        }
      }
    }
    else {
      for (let i = -Math.ceil(width / 2); i < Math.floor(width / 2); i++) {
        this.currentField[i] = {}
        for (let j = -Math.ceil(height / 2); j < Math.floor(height / 2); j++) {
          const val = (this.noise.noise2D(i / 800, j / 800) + 1) * Math.PI * 2
          this.currentField[i][j] = val
        }
      }
    }

    this.generatedWidth = width
    this.generatedHeight = height

    this.currentWidth = width
    this.currentHeight = height
  }

  displayField = (context, width, height) => {
    const image = context.createImageData(width, height)
    const data = image.data

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const iP = i - Math.ceil(width / 2)
        const jP = j - Math.ceil(height / 2)
        const cellStart = (i + j * width) * 4
        const val = this.currentField[iP][jP] * 30

        for (let k = 0; k < 3; k++) {
          data[cellStart + k] = Math.floor(val)
        }
        data[cellStart + 3] = 255
      }
    }

    context.putImageData(image, 0, 0)
  }

}

class SplashPoint {
  constructor(index, count) {
    this.forces = {
      x: 0,
      y: 0,
    }
    const ang = (index / count) * Math.PI * 2
    this.velocity = {
      x: 0,
      y: 0,
    }
    this.position = {
      x: 0,
      y: 0,
    }
    this.prevPosition = {
      x: 0,
      y: 0,
    }
    this.flippedX = false
    this.flippedY = false

    const hue = ang * 3 / Math.PI, sat = 1, val = 1
    const chroma = sat * val
    const x = chroma * (1 - Math.abs((hue % 2) - 1))
    let r = 0, g = 0, b = 0
    if (hue >= 0 && hue <= 1) {
      g = x
      r = chroma
    } else if (hue > 1 && hue <= 2) {
      r = x
      g = chroma
    } else if (hue > 2 && hue <= 3) {
      b = x
      g = chroma
    } else if (hue > 3 && hue <= 4) {
      g = x
      b = chroma
    } else if (hue > 4 && hue <= 5) {
      r = x
      b = chroma
    } else if (hue > 5 && hue <= 6) {
      b = x
      r = chroma
    }
    const m = val - chroma
    this.color = {
      r: (r + m) * 255,
      g: (g + m) * 255,
      b: (b + m) * 255,
    }
  }

  setPosition = (x, y) => {
    this.position = {
      x,
      y,
    }
  }

  setVelocity = (x, y) => {
    this.velocity = {
      x,
      y,
    }
  }
  
  calculateFlowForce = (flowField, forceMod, slowDown) => {
    const flowPos = {
      x: Math.floor(this.position.x) % Math.floor(flowField.currentWidth / 2),
      y: Math.floor(this.position.y) % Math.floor(flowField.currentHeight / 2),
    }

    if (forceMod > 0) {
      this.forces.x = Math.cos(flowField.currentField[flowPos.x][flowPos.y]) * 75 * forceMod
      this.forces.y = Math.sin(flowField.currentField[flowPos.x][flowPos.y]) * 75 * forceMod
    }

    if (slowDown > 0) {
      this.forces.x -= this.velocity.x * slowDown
      this.forces.y -= this.velocity.y * slowDown
    }
  }

  update = (deltaTime, width, height) => {
    this.velocity.x += this.forces.x * (deltaTime / 1000)
    this.velocity.y += this.forces.y * (deltaTime / 1000)

    const maxVelocity = 100
    const mag = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)

    if (mag > 0.01) {
      const velMod = (mag >= maxVelocity) ? maxVelocity : mag
      this.velocity.x *= velMod / mag
      this.velocity.y *= velMod / mag
    }
    else {
      this.velocity.x = 0
      this.velocity.y = 0
    }
    
    this.prevPosition = {
      x: this.position.x,
      y: this.position.y,
    }

    this.position.x += this.velocity.x * (deltaTime / 1000)
    this.position.y += this.velocity.y * (deltaTime / 1000)

    if (this.position.x > width / 2) {
      this.position.x -= width
      this.flippedX = !this.flippedX
    }
    else if (this.position.x < -width / 2) {
      this.position.x += width
      this.flippedX = !this.flippedX
    }

    if (this.position.y > height / 2) {
      this.position.y -= height
      this.flippedY = !this.flippedY
    }
    else if (this.position.y < -height / 2) {
      this.position.y += height
      this.flippedY = !this.flippedY
    }

    this.forces.x = 0
    this.forces.y = 0
  }

  drawPoint = (context, neighbor, width, height) => {
    context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
    context.fillRect(this.position.x + width / 2, this.position.y + height / 2, 1, 1)

    if (neighbor) {
      let broken = false
      const adjustedPos = {
        x: this.position.x,
        y: this.position.y,
      }
      const adjustedNeighborPos = {
        x: neighbor.position.x,
        y: neighbor.position.y,
      }
      if (this.flippedX !== neighbor.flippedX) {
        const xDir = (this.position.x < neighbor.position.x) ? 1 : -1
        adjustedPos.x = this.position.x + (width * xDir)
        adjustedNeighborPos.x = neighbor.position.x + (width * -xDir)
        broken = true
      }
      if (this.flippedY !== neighbor.flippedY) {
        const yDir = (this.position.y < neighbor.position.y) ? 1 : -1
        adjustedPos.y = this.position.y + (width * yDir)
        adjustedNeighborPos.y = neighbor.position.y + (width * -yDir)
        broken = true
      }

      context.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
      context.beginPath()
      if (broken) {
        context.moveTo(this.position.x + width / 2, this.position.y + height / 2)
        context.lineTo(adjustedNeighborPos.x + width / 2, adjustedNeighborPos.y + height / 2)
        context.moveTo(adjustedPos.x + width / 2, adjustedPos.y + height / 2)
        context.lineTo(neighbor.position.x + width / 2, neighbor.position.y + height / 2)
        context.stroke()
      }
      else {
        context.moveTo(this.position.x + width / 2, this.position.y + height / 2)
        context.lineTo(neighbor.position.x + width / 2, neighbor.position.y + height / 2)
        context.stroke()
      }
    }
  }
}

class SplashArt extends Component {

  state = {
    currentCanvas: null,
    currentContext: null,
    width: 0,
    height: 0,
    cycleStage: 0,
    cycleCounter: 0,
    prevTime: -1,
    pointList: [],
    flowField: null,
  }

  componentDidMount = () => {
    const currentCanvas = this.refs.splashCanvas
    const currentContext = currentCanvas.getContext("2d")

    const flowField = new FlowField()

    this.setState({
      currentCanvas,
      currentContext,
      flowField,
    })

    requestAnimationFrame(this.mainAnimationCycle)
  }

  mainAnimationCycle = () => {
    const { width, height, currentContext, cycleStage, cycleCounter, prevTime, pointList, flowField } = this.state

    // Variables for updating between animation frames. Split so we don't repeatedly call setState.
    let updatedCycleStage = cycleStage, updatedCycleCounter = cycleCounter, updatedPrevTime = prevTime

    // Time updating.
    let deltaTime = 0
    const curTime = Date.now()

    if (prevTime > 0) {
      deltaTime = curTime - prevTime
    }
    updatedPrevTime = curTime

    // Variables used for responsive rendering.
    const largeFontSize = (width > 600) ? "4rem" : "2.5rem"
    const smallFontSize = (width > 600) ? "1.7rem" : "1.25rem"

    switch (cycleStage) {
      default:
      case 0: 
        {
          updatedCycleCounter += deltaTime
          const opacity = updatedCycleCounter / 2000

          // Draw the background.
          currentContext.clearRect(0, 0, width, height)
          currentContext.globalAlpha = opacity
          currentContext.fillStyle = "#000"
          currentContext.fillRect(0, 0, width, height)

          // Background loaded in, draw a solid white background.
          if (opacity > 1) {
            updatedCycleStage = 1
            updatedCycleCounter = 0
          }
        }
        break
      case 1:
        {
          updatedCycleCounter += deltaTime
          let opacity = updatedCycleCounter / 1000
          
          // Clear the canvas and draw background.
          currentContext.clearRect(0, 0, width, height)
          currentContext.globalAlpha = 1
          currentContext.fillStyle = "#000"
          currentContext.fillRect(0, 0, width, height)

          // Draw name text.
          currentContext.globalAlpha = opacity
          currentContext.fillStyle = "#eaeaea"
          currentContext.font = `300 ${largeFontSize} Lato`
          currentContext.textAlign = "center"
          currentContext.fillText("Luke Miller", width / 2, height / 2 - 20)

          // Draw occupation text.
          if (updatedCycleCounter > 500) {
            opacity = (updatedCycleCounter - 500) / 1000
            currentContext.globalAlpha = opacity
            currentContext.fillStyle = "#aaa"
            currentContext.font = `300 ${smallFontSize} Lato`
            currentContext.fillText("Game Developer | Web Developer", width / 2.015, height / 2 + 15)
          }

          if (updatedCycleCounter > 1500) {
            updatedCycleStage = 2
            updatedCycleCounter = 0
          }
        }
        break
      case 2:
        {
          updatedCycleCounter += deltaTime
          
          // Clear the canvas and draw background.
          //currentContext.clearRect(0, 0, width, height)
          currentContext.fillStyle = "#000"
          currentContext.globalAlpha = 0.02// Math.max(0.02, (1 - (updatedCycleCounter / 15000)) * 0.02)
          currentContext.fillRect(0, 0, width, height)
          currentContext.globalAlpha = 1

          // Draw name text.
          currentContext.fillStyle = "#eaeaea"
          currentContext.font = `300 ${largeFontSize} Lato`
          currentContext.textAlign = "center"
          currentContext.fillText("Luke Miller", width / 2, height / 2 - 20)

          // Draw occupation text.
          currentContext.fillStyle = "#aaa"
          currentContext.font = `300 ${smallFontSize} Lato`
          currentContext.fillText("Game Developer | Web Developer", width / 2.015, height / 2 + 15)

          const forceMod = Math.max(0, 1 - (updatedCycleCounter / 5000))
          const slowMod = Math.max(0, Math.min(0.8, (updatedCycleCounter / 5000) - 1))
          currentContext.globalAlpha = Math.max(0, (1 - (updatedCycleCounter / 11000)) * 0.5)
          currentContext.lineWidth = 1

          for (let i = 0; i < pointList.length; i++) {
            pointList[i].calculateFlowForce(flowField, forceMod, slowMod)
            pointList[i].update(deltaTime, width, height)
            if (i < pointList.length - 1) {
              pointList[i].drawPoint(currentContext, pointList[(i + 1) % pointList.length], width, height)
            }
          }

          currentContext.globalAlpha = 1

          if (updatedCycleCounter > 10200) {
            updatedCycleStage = 3
            updatedCycleCounter = 0
          }

          //flowField.displayField(currentContext, width, height)
          
          /* currentContext.font = `300 ${smallFontSize} Lato`
          currentContext.fillStyle = "#fff"
          currentContext.fillRect(0, 0, 80, 80)
          currentContext.fillStyle = "#444"
          currentContext.fillText(`${Math.round(1000 / deltaTime)}`, 40, 40) */
        }
        break
      case 3:
        // Empty case.
    }
    
    if (updatedCycleStage !== 3) {
      requestAnimationFrame(this.mainAnimationCycle)
    }

    this.setState({
      cycleStage: updatedCycleStage,
      cycleCounter: updatedCycleCounter,
      prevTime: updatedPrevTime,
    })
  }

  onResize = (w, h) => {
    const { width, currentContext, pointList, flowField } = this.state

    const pointCount = (w > 720) ? w : 500
    if (width === 0) {
      for (let i = 0; i < pointCount; i++) {
        const newPoint = new SplashPoint(i, pointCount)
        newPoint.setPosition(-w / 2 + (w * i / pointCount), 0)
        pointList[i] = newPoint
      }
    }

    currentContext.width = w
    currentContext.height = h

    flowField.generateField(w, h)

    this.setState({
      width: w,
      height: h,
      pointList,
    })
  }

  render = () => {
    const { width, height } = this.state

    return (
      <div className="splash-container">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
          <canvas ref="splashCanvas" style={{width: `${width}px`, height: `${height}px`}} >
            Please update your browser to get full benefits from this site.
          </canvas>
        </ReactResizeDetector>
      </div>
    )
  }
}

export default SplashArt