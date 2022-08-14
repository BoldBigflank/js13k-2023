
const init = async () => {
    console.log('init started')
    document.getElementById('intro')!.style.display = 'none'
    const canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    canvas.style.display = 'block'
    const engine = new BABYLON.Engine(canvas, true)
    const scene = new BABYLON.Scene(engine)
    engine.displayLoadingUI()

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true)
    
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
    
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene)

    engine.hideLoadingUI()

    // run the render loop
    engine.runRenderLoop(() => {
        scene.render()
    })

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
        engine.resize()
    })
    console.log('init ended')
    
}

window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})