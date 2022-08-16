import { SlideTilePuzzle } from '@/puzzles/SlideTilePuzzle'
import type { Tile, InteractiveMesh } from '@/Types'
const init = async () => {
    document.getElementById('intro')!.style.display = 'none'
    const canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    canvas.style.display = 'block'
    const engine = new BABYLON.Engine(canvas, true)
    const scene = new BABYLON.Scene(engine)
    engine.displayLoadingUI()

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true)
    
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
    
    // BABYLON.MeshBuilder.CreateBox("box", {}, scene)
    BABYLON.MeshBuilder.CreateSphere("center", {diameter: 0.1}, scene)

    // Custom pointer events
    scene.onPointerObservable.add((pointerInfo) => {      		
        switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
            if (
                pointerInfo && 
                pointerInfo.pickInfo &&
                pointerInfo.pickInfo.pickedMesh) {
                const pickedMesh = pointerInfo.pickInfo.pickedMesh as InteractiveMesh
                if (pickedMesh.onPointerPick) {
                    pickedMesh.onPointerPick(pointerInfo)
                }
            }
            break
        }
    })

    engine.hideLoadingUI()

    // run the render loop
    engine.runRenderLoop(() => {
        scene.render()
    })

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
        engine.resize()
    })
    const slideTile = new SlideTilePuzzle(scene)
}

window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})