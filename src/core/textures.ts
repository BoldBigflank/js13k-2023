import {
    BLACK,
    BLUE,
    BRICK1,
    BRICK2,
    BRICK3,
    BRICK4,
    BRICK5,
    DIRT1,
    DIRT2,
    GRASS1,
    GRASS2,
    GRASS3,
    GRASS4,
    GRASS5,
    GRAVEL0,
    GRAVEL1,
    GRAVEL2,
    GRAVEL3,
    GRAVEL4,
    GRAVEL5,
    LIGHT_GREEN,
    MID_GREY,
    ORANGE,
    SPANISH_BLUE,
    WHITE } from "./Colors"
import { initCanvas, sample, shuffle } from "./Utils"

const { StandardMaterial, Texture} = BABYLON

let pc = 0

/* NEW TEXTURES */
const textures: Record<string,BABYLON.Material> = {}

export const CursorMaterial = (scene: BABYLON.Scene) => {
    const key = 'cursor'
    if (textures[key]) return textures[key]
    // Setup
    const [canvas, ctx] = initCanvas(512)
    ctx.imageSmoothingEnabled = false
    // TODO: Draw out a cursor
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(256 - 6, 256) // Horiz
    ctx.lineTo(256 + 6, 256)
    ctx.moveTo(256, 256 - 6) // Vert
    ctx.lineTo(256, 256 + 6)
    // Outer
    ctx.lineWidth = 2
    ctx.strokeStyle = BLACK
    ctx.stroke()
    // Inner
    ctx.lineWidth = 1.5
    ctx.strokeStyle = WHITE
    ctx.stroke()

    const material = CanvasMaterial(canvas, scene)
    material.disableLighting = true
    material.emissiveColor = BABYLON.Color3.White()
    material.diffuseTexture!.hasAlpha = true
    textures[key] = material
    return material
}


export const CastleMaterial = (windows = true, scale: number, scene: BABYLON.Scene) => {
    const key = `castle${scale}`
    if (textures[key]) return textures[key]
    // Setup
    const [canvas,ctx] = initCanvas(512)

    ctx.fillStyle = '#c5a296'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Horizontal lines
    const brickHeight = 16 / scale
    const brickWidth = 32 / scale
    ctx.save()
    ctx.strokeStyle = BLACK
    ctx.lineWidth = 4

    const brickColors = [
        BRICK1,
        BRICK2,
        BRICK3,
        BRICK4,
        BRICK5
    ]


    // TODO: Brick size based on orig

    for (let y = 0; y * brickHeight < canvas.height; y++) {
        for (let x = 0; x * brickWidth < canvas.width; x++) {
            ctx.fillStyle = sample(brickColors)
            const startOffset = (y % 2) ? 0 : -0.5 * brickWidth
            ctx.fillRect(x * brickWidth + startOffset, y * brickHeight, brickWidth - 1, brickHeight - 1)
            if (x === 0) {
                ctx.fillRect(
                    x * brickWidth + canvas.width + startOffset,
                    y * brickHeight,
                    brickWidth - 1,
                    brickHeight - 1
                )
            }
        }
    }
    ctx.restore()

    // Window
    if (windows) {
        ctx.fillStyle = MID_GREY
        ctx.fillRect(192, 128, 128, 256)
        ctx.strokeStyle = WHITE
        ctx.lineWidth = 16
        ctx.strokeRect(192,128,128, 256)
        ctx.beginPath()
        ctx.moveTo(256, 128) // vertical line
        ctx.lineTo(256, 384)
        ctx.moveTo(192, 224) // horizontal line
        ctx.lineTo(320, 224)
        ctx.stroke()
    }
    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}

export const GrassMaterial = (scene: BABYLON.Scene) => {
    const key = 'grass'
    if (textures[key]) return textures[key]
    // Setup
    const [canvas, ctx] = initCanvas(512)
    const [tempCanvas, tempCtx] = initCanvas(canvas.width * 2)

    const GRASS_COUNT = 32
    const GRASS_SIZE = canvas.width / GRASS_COUNT

    // Horizontal lines
    tempCtx.save()

    const grassColors = [
        GRASS1,
        GRASS2,
        GRASS3,
        GRASS4,
        GRASS5
    ]

    // Take all positions
    const positions = []
    for (let y = 0; y < GRASS_COUNT; y++) {
        for (let x = 0; x < GRASS_COUNT; x++) {
            positions.push({x, y})
        }
    }
    const shuffledPositions = shuffle(positions)
    tempCtx.translate(0.25 * tempCanvas.width, 0.25 * tempCanvas.height)
    shuffledPositions.forEach((position) => {
        const { x, y } = position
        tempCtx.save()
        tempCtx.fillStyle = sample(grassColors)
        tempCtx.translate(x * GRASS_SIZE, y * GRASS_SIZE)
        const scale = 1 * Math.random() + 1
        const rotation = Math.random() * Math.PI
        tempCtx.save()
        tempCtx.scale(scale, scale)
        tempCtx.rotate(rotation) // half circle bc it's the same as 2pi
        // Seamless repeating
        tempCtx.fillRect(-0.5 * GRASS_SIZE, -0.5 * GRASS_SIZE, GRASS_SIZE, GRASS_SIZE)
        tempCtx.restore()

        if (x == 0) {
            tempCtx.save()
            tempCtx.translate(0.5 * tempCanvas.width, 0)
            tempCtx.save()
            tempCtx.scale(scale, scale)
            tempCtx.rotate(rotation) // half circle bc it's the same as 2pi
            // Seamless repeating
            tempCtx.fillRect(-0.5 * GRASS_SIZE, -0.5 * GRASS_SIZE, GRASS_SIZE, GRASS_SIZE)
            tempCtx.restore()
            tempCtx.restore()
        }
        if (y == 0) {
            tempCtx.save()
            tempCtx.translate(0, 0.5 * tempCanvas.height)
            tempCtx.save()
            tempCtx.scale(scale, scale)
            tempCtx.rotate(rotation) // half circle bc it's the same as 2pi
            // Seamless repeating
            tempCtx.fillRect(-0.5 * GRASS_SIZE, -0.5 * GRASS_SIZE, GRASS_SIZE, GRASS_SIZE)
            tempCtx.restore()
            tempCtx.restore()
        }
        tempCtx.restore()
    })

    tempCtx.restore()

    // Paste the middle to the canvas
    // ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(
        tempCanvas,
        tempCanvas.width * 0.25,
        tempCanvas.height * 0.25,
        tempCanvas.width * 0.5,
        tempCanvas.height * 0.5,
        0,
        0,
        canvas.width,
        canvas.height
    )
    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}

/* HELPERS */

export const ColorMaterial = (color: string, scene: BABYLON.Scene) => {
    const key = `color${color}`
    if (textures[key]) return textures[key]
    const material = new StandardMaterial(`billboardMaterial${++pc}`, scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    // material.emissiveColor = BABYLON.Color3.FromHexString(color)
    textures[key] = material
    return material
}

export const ColorTextureMaterial = (color: string, scene: BABYLON.Scene) => {
    const key = `colortexture${color}`
    if (textures[key]) return textures[key]
    const material = new StandardMaterial(`billboardMaterial${++pc}`, scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    const canvas = PerlinNoise()
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    material.diffuseTexture = texture
    textures[key] = material
    return material
}

export const CanvasMaterial = (canvas: HTMLCanvasElement, scene: BABYLON.Scene) => {
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    texture.hasAlpha = true
    material.diffuseTexture = texture
    return material
}

// Used for Flower Puzzles
export const GridMaterial = (color1: string, color2: string, rows: number, columns: number, scene: BABYLON.Scene) => {
    const key = `grid-${color1}-${color2}-${rows}-${columns}`
    if (textures[key]) return textures[key]
    const canvasSize = 512
    const [canvas, ctx] = initCanvas(canvasSize)
    ctx.imageSmoothingEnabled = false
    const tileWidth = canvasSize / rows
    const tileHeight = canvasSize / columns
    ctx.fillStyle = color1
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = color2
    for (let y = 0; y < columns; y++) {
        for (let x = 0; x < rows; x++) {
            if ((x + y) % 2) continue
            ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
        }
    }

    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    textures[key] = material
    return material
}

export const DirtMaterial = (scene: BABYLON.Scene) => {
    const key = 'dirt'
    if (textures[key]) return textures[key]
    const [canvas, ctx] = initCanvas(256)
    ctx.fillStyle = DIRT1
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = DIRT2
    const speckSize = 12
    for (let i = 0; i < 12; i++) {
        const x = Math.random() * (canvas.width - speckSize)
        const y = Math.random() * (canvas.height - speckSize)
        ctx.fillRect(x, y, speckSize, speckSize)
    }
    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}

export const GravelMaterial = (scene: BABYLON.Scene) => {
    const key = 'gravel'
    if (textures[key]) return textures[key]
    // Setup
    const [canvas,ctx] = initCanvas(512)

    ctx.fillStyle = '#c5a296'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Horizontal lines
    ctx.save()
    ctx.strokeStyle = BLACK
    ctx.lineWidth = 4

    const colors = [
        GRAVEL1, GRAVEL2, GRAVEL3, GRAVEL4, GRAVEL5
    ]

    ctx.fillStyle = GRAVEL0
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    colors.forEach((hex) => {
        ctx.fillStyle = hex
        for (let i = 0; i < 128; i++) {
            const x = Math.random() * (canvas.width - 16) + 8
            const y = Math.random() * (canvas.height - 16) + 8
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.arc(x, y, 8, 0, 2 * Math.PI)
            ctx.fill()
        }
    })

    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}

export const DialMaterial = (alphabet: string[], scene: BABYLON.Scene) => {
    const key = `dial-${alphabet}`
    if (textures[key]) return textures[key]
    const [canvas, ctx] = initCanvas(512)
    ctx.fillStyle = ORANGE
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = BLACK
    const tileWidth = canvas.width / alphabet.length
    ctx.font = `${tileWidth}px Helvetica`
    ctx.scale(1.0, canvas.height / tileWidth)
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"
    alphabet.forEach((char, index) => {
        ctx.strokeStyle = MID_GREY
        ctx.strokeRect(index * tileWidth, 0, (index+1) * tileWidth, tileWidth)
        ctx.fillText(`${char}`, index * tileWidth + 0.5 * tileWidth, 0.5 * tileWidth)
    })
    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}

export const TextMaterial = (lines: string[], scene: BABYLON.Scene) => {
    const key = `text-${lines.join("")}`
    if (textures[key]) return textures[key]
    const [canvas, ctx] = initCanvas(512)
    ctx.fillStyle = ORANGE
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = BLACK
    
    ctx.font = `64px Helvetica`
    ctx.scale(1.0, 3) // The only infobillboard I'm using is 3:1
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    if (lines.length > 0) {
        const m = ctx.measureText(lines[0])
        const fontSize = 64 * (512-64) / m.width
        ctx.font = `${fontSize}px Helvetica`
    }
    lines.forEach((line, index) => {
        ctx.fillText(`${line}`, 32, 32 + 72 * index)
    })
    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}


export const SymbolMaterial = (scene: BABYLON.Scene) => {
    const key = 'symbol'
    if (textures[key]) return textures[key]
    const [canvas, ctx] = initCanvas(512)

    ctx.fillStyle = SPANISH_BLUE
    ctx.fillRect(128, 0, 256, 512)

    ctx.fillStyle = ORANGE
    ctx.fillRect(256 - 64, 128 - 64, 128, 128)
    ctx.beginPath()
    ctx.moveTo(256, 256)
    ctx.arc(256, 256, 64, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(256, 320)
    ctx.lineTo(256 + 64, 320 + 111)
    ctx.lineTo(256 - 64, 320 + 111)
    ctx.fill()
    const material = CanvasMaterial(canvas, scene)
    textures[key] = material
    return material
}

export const PerlinNoise = () => {
    const size = 512
    const [noiseCanvas, noiseCtx] = initCanvas(size)
    const imageData = noiseCtx.getImageData(0, 0, noiseCanvas.width, noiseCanvas.height)
    const pixels = imageData.data
    const n = pixels.length
    const alpha = 255
    for (let i = 0; i < n; i += 4) {
        pixels[i] = pixels [i+1] = pixels[i+2] = (Math.random() * 256) | 0
        pixels[i+3] = alpha
    }
    noiseCtx.putImageData(imageData, 0, 0)

    const [canvas, ctx] = initCanvas(size)
    ctx.save()
    for (let size = 4; size <= noiseCanvas.width; size *= 2) {
        const x = (Math.random() * (noiseCanvas.width - size)) | 0
        const y = (Math.random() * (noiseCanvas.height - size)) | 0
        ctx.globalAlpha = 4 / size
        ctx.drawImage(noiseCanvas, x, y, size, size, 0, 0, canvas.width, canvas.height)
    }

    ctx.restore()

    return canvas
}