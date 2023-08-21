import { initCanvas, loremIpsum, sample, shuffle } from "./Utils"

const { StandardMaterial, Texture, Scene } = BABYLON

let pc = 0

/* OLD TEXTURES */

export const coffinMaterial = (scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#f0bd2c'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // TODO: Draw out a coffin


    // Send it
    const material = new StandardMaterial(`coffinMaterial${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`coffinTexture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

export const floorMaterial = (scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#7c644a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#392c20'
    let size = 128
    for(let i = 0; i < 10; i++) {
        ctx.save()
        size = 128 + Math.random() * 60
        ctx.font = `${size}px emoji`
        
        ctx.translate(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.rotate(Math.random() * 2 * Math.PI)
        ctx.fillText(loremIpsum(16), -8 *  size, 0)
        ctx.fillText(loremIpsum(16), -8 *  size, size)
        ctx.fillText(loremIpsum(16), -8 *  size, -1 * size)
        ctx.restore()
    }

    // TODO: Draw out a floor



    // Send it
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

export const columnMaterial = (lines: string[], scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Base Color
    ctx.fillStyle = '#e7c482'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Top and bottom
    ctx.fillStyle = '#2bafbb'
    ctx.fillRect(0, 0, 512, 52)
    ctx.fillRect(0, 512-64, 512, 64)

    // Filler heiroglyphics
    ctx.font = `48px emoji`
    ctx.fillStyle = '#b76324'
    for(let y = 48; y < 512-64; y += 48) {
        ctx.fillText(loremIpsum(32), 0, y)
    }

    // The clue symbol
    const lineHeight = 256
    ctx.font = `${lineHeight}px emoji`
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'top'
    lines.forEach((line, i) => {
        ctx.fillText(line, 64, 64 + i * lineHeight)
    })
    
    // Send it
    const material = new StandardMaterial(`columnMaterial${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`columnTexture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

export const wallMaterial = (lines: string[], scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#f0e2bb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // TODO: Draw out a wall

    // Send it
    const material = new StandardMaterial(`wallMaterial${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`wallTexture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

export const jarboxMaterial = (scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#e7c482'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // TODO: Draw out a jar box


    // Send it
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}


export const infoBillboardMaterial = (lines: string[], scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Base Color
    ctx.fillStyle = '#e7c482'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Top and bottom
    ctx.fillStyle = '#2bafbb'
    ctx.fillRect(0, 0, canvas.width, 52)
    ctx.fillRect(0, canvas.height-64, canvas.width, 64)

    // The lines
    const lineHeight = 118
    ctx.font = `bold ${lineHeight}px serif`
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'top'
    lines.forEach((line, i) => {
        ctx.fillText(line, 128, 64 + i * lineHeight)
    })
    
    // Send it
    const material = new StandardMaterial(`billboardMaterial${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`billboardTexture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

/* NEW TEXTURES */

export const castleMaterial = (windows = true, scene: BABYLON.Scene) => {
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
                ctx.fillRect(x * brickWidth + + canvas.width + startOffset, y * brickHeight, brickWidth - 1, brickHeight - 1)
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

export const grassMaterial = (scene: BABYLON.Scene) => {
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

export const colorMaterial = (color: string, scene: BABYLON.Scene) => {
    const material = new StandardMaterial(`billboardMaterial${++pc}`, scene)
    material.diffuseColor = BABYLON.Color3.FromHexString(color)
    return material
}
