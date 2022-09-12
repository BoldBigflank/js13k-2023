const { StandardMaterial, Texture, Scene } = BABYLON

let pc = 0

export const coffinMaterial = (scene: BABYLON.Scene) => {
    // Setup
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // TODO: Draw out a coffin


    // Send it
    const material = new StandardMaterial(`coffinMaterial${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`coffinTexture${++pc}`, canvas.toDataURL(), scene)
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

    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // TODO: Draw out a column
    const lineHeight = 256
    ctx.font = `${lineHeight}px emoji`
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'top'
    lines.forEach((line, i) => {
        ctx.fillText(line, 64, i * lineHeight)
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

    ctx.fillStyle = 'blue'
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

    ctx.fillStyle = 'yellow'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // TODO: Draw out a jar box


    // Send it
    const material = new StandardMaterial(`material${++pc}`, scene)
    const texture = Texture.LoadFromDataString(`texture${++pc}`, canvas.toDataURL(), scene)
    material.diffuseTexture = texture
    return material
}

