import { initCanvas, sample, shuffle } from "./Utils"

const { StandardMaterial, Texture} = BABYLON

let pc = 0

/* NEW TEXTURES */


export const CursorMaterial = (scene: BABYLON.Scene) => {
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
    ctx.strokeStyle = "#000000"
    ctx.stroke()
    // Inner
    ctx.lineWidth = 1.5
    ctx.strokeStyle = "#ffffff"
    ctx.stroke()

    // Send it
    const material = new StandardMaterial(`cursorMaterial${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`cursorTexture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    material.disableLighting = true
    material.emissiveColor = BABYLON.Color3.White()
    texture.hasAlpha = true
    return material
}


export const CastleMaterial = (windows = true, scene: BABYLON.Scene) => {
    // Setup
    const [canvas,ctx] = initCanvas(512)

    ctx.fillStyle = '#c5a296'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Horizontal lines
    const brickHeight = 16
    const brickWidth = 32
    ctx.save()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 4

    const brickColors = [
        "#dd7d7d",
        "#cb6b6b",
        "#b65454",
        "#9e3333",
        "#842020"
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
        ctx.fillStyle = '#666666'
        ctx.fillRect(192, 128, 128, 256)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 16
        ctx.strokeRect(192,128,128, 256)
        ctx.beginPath()
        ctx.moveTo(256, 128) // vertical line
        ctx.lineTo(256, 384)
        ctx.moveTo(192, 224) // horizontal line
        ctx.lineTo(320, 224)
        ctx.stroke()
        // ctx.strokeRect(192, 128, 64, 64)
        // ctx.strokeRect(256, 128, 64, 64)
    }
    
    

    // Send it
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

export const GrassMaterial = (scene: BABYLON.Scene) => {
    // Setup
    const [canvas, ctx] = initCanvas(512)
    const [tempCanvas, tempCtx] = initCanvas(canvas.width * 2)

    const GRASS_COUNT = 32
    const GRASS_SIZE = canvas.width / GRASS_COUNT

    // Horizontal lines
    tempCtx.save()

    const grassColors = [
        "#abb348",
        "#7ca244",
        "#426d38",
        "#799c45",
        "#a7af48"
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

    // Send it
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

export const GardenHeightMap = () => {
    const [canvas,ctx] = initCanvas(512)
    // ctx.fillStyle = "#000000"
    // ctx.fillRect(0, 0, 512, 512)


    // const canvas = document.getElementById('canvas')
    // const ctx = canvas.getContext('2d')
    
    // x, y, w, h, stroke, fill
    const WHITE = "#ffffff" as string
    const GREEN = "#444444" as string
    const BROWN = "#333333" as string
    const BLACK = "#000000" as string
    
    const shapes = [
        [8, 8, 400, 128, WHITE, null],// Border
        [4, 4, 416, 8, null, BLACK],
      
        [24, 24, 64, 16, GREEN, BROWN],
        [48, 56, 16, 16, GREEN, BROWN],
        [24, 88, 64, 16, GREEN, BROWN],
        [120, 24, 16, 16, GREEN, BROWN],
        [96, 56, 16, 16, GREEN, BROWN],
        [144, 56, 16, 16, GREEN, BROWN],
        [120, 88, 16, 16, GREEN, BROWN],
        [176, 24, 32, 32, GREEN, BROWN],
        [176, 72, 32, 32, GREEN, BROWN],
        [256, 24, 32, 32, GREEN, BROWN],
        [256, 72, 32, 32, GREEN, BROWN],
        [336, 24, 16, 16, GREEN, BROWN],
        [312, 56, 16, 16, GREEN, BROWN],
        [360, 56, 16, 16, GREEN, BROWN],
        [336, 88, 16, 16, GREEN, BROWN]
    ]
    ctx.lineWidth = 8
    ctx.strokeStyle = GREEN
    ctx.fillStyle = "#00ff00"
    
    shapes.forEach((shape) => {
        const [x, y, w, h, stroke, fill] = shape
        if (fill) {
            ctx.fillStyle = fill as string
            ctx.fillRect(x as number, y as number, w as number, h as number)
        }
        if (stroke) {
            ctx.strokeStyle = stroke as string
            ctx.strokeRect(x as number, y as number, w as number, h as number)
        }
    })

    return canvas.toDataURL('image/png')
}

/* HELPERS */

export const ColorMaterial = (color: string, scene: BABYLON.Scene) => {
    const material = new StandardMaterial(`billboardMaterial${++pc}`, scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    return material
}

export const ColorTextureMaterial = (color: string, scene: BABYLON.Scene) => {
    const material = new StandardMaterial(`billboardMaterial${++pc}`, scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    const canvas = PerlinNoise()
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    material.diffuseTexture = texture
    return material
}

export const CanvasMaterial = (canvas: HTMLCanvasElement, scene: BABYLON.Scene) => {
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

// Used for Flower Puzzles
export const GridMaterial = (color1: string, color2: string, rows: number, columns: number, scene: BABYLON.Scene) => {
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
    return material
}

export const DirtMaterial = (scene: BABYLON.Scene) => {
    const [canvas, ctx] = initCanvas(256)
    ctx.fillStyle = "#6d4d41"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#49332b"
    const speckSize = 12
    for (let i = 0; i < 12; i++) {
        const x = Math.random() * (canvas.width - speckSize)
        const y = Math.random() * (canvas.height - speckSize)
        ctx.fillRect(x, y, speckSize, speckSize)
    }
    return CanvasMaterial(canvas, scene)
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
/* Following canvas-based Perlin generation code originates from
 * iron_wallaby's code at: http://www.ozoneasylum.com/30982
 */
/*
function randomNoise(canvas, x, y, width, height, alpha) {
    x = x || 0;
    y = y || 0;
    width = width || canvas.width;
    height = height || canvas.height;
    alpha = alpha || 255;
    var g = canvas.getContext("2d"),
        imageData = g.getImageData(x, y, width, height),
        random = Math.random,
        pixels = imageData.data,
        n = pixels.length,
        i = 0;
    while (i < n) {
        pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
        pixels[i++] = alpha;
    }
    g.putImageData(imageData, x, y);
    return canvas;
}
 */

/* 
function perlinNoise(canvas, noise) {
    noise = noise || randomNoise(createCanvas(canvas.width, canvas.height));
    var g = canvas.getContext("2d");
    g.save();
    
    // Scale random iterations onto the canvas to generate Perlin noise.
    for (var size = 4; size <= noise.width; size *= 2) {
        var x = (Math.random() * (noise.width - size)) | 0,
            y = (Math.random() * (noise.height - size)) | 0;
        g.globalAlpha = 4 / size;
        g.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
    }

    g.restore();
    return canvas;
} 
*/