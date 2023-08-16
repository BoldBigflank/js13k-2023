import { loremIpsum, sample } from "./Utils"

const { StandardMaterial, Texture, Scene } = BABYLON

let pc = 0

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

export const castleMaterial = (scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

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

    for (let y = 0; y * brickHeight < canvas.height; y++) {
        for (let x = (y % 2) ? 0 : -1; x * brickWidth < canvas.width; x++) {
            ctx.fillStyle = sample(brickColors)
            const startOffset = (y % 2) ? 0 : 0.5 * brickWidth
            ctx.fillRect(x * brickWidth + startOffset, y * brickHeight, brickWidth - 1, brickHeight - 1)
        }
    }
    ctx.restore()
    
    

    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#392c20'
    

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
