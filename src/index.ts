import { SlideTilePuzzle } from '@/puzzles/SlideTilePuzzle'
import { waterNME } from '@/shaders/waterNME'
import type { Tile, InteractiveMesh } from '@/Types'

const { Engine, Scene, MeshBuilder, HemisphericLight, UniversalCamera, Vector3, PointerEventTypes } = BABYLON
const init = async () => {
    document.getElementById('intro')!.style.display = 'none'
    const canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    canvas.style.display = 'block'
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    scene.gravity = new Vector3(0, -0.15, 0)
    scene.collisionsEnabled = true
    // scene.debugLayer.show({
    //     embedMode: true
    // })
    engine.displayLoadingUI()

    const camera = new UniversalCamera('MainCamera', new Vector3(0, 1.615, -6), scene)
    camera.inertia = 0.5
    camera.speed = 1
    camera.keysUp.push(87);    		// W
    camera.keysDown.push(83)   		// D
    camera.keysLeft.push(65);  		// A
    camera.keysRight.push(68); 		// S
    camera.keysUpward.push(69);		// E
    camera.keysDownward.push(81);     // Q

    camera.attachControl(canvas, true)
    // camera.speed = 0.1
    camera.angularSensibility = 500
    camera.applyGravity = true
    camera.ellipsoid = new Vector3(0.4, 0.8, 0.4)
    camera.checkCollisions = true
    camera.minZ = 0.5
    
    new HemisphericLight("light", new Vector3(0, 1, 0), scene)

    const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100, subdivisions: 100}, scene)
    ground.checkCollisions = true
    // MeshBuilder.CreateBox("box", {}, scene)
    MeshBuilder.CreateSphere("center", {diameter: 0.1}, scene)

    // Test water cube
    const waterBox = MeshBuilder.CreateBox("box", {}, scene)
    waterBox.position = new Vector3(-3, 2, -2)
    const waterMat = waterNME()
    waterBox.material = waterMat

    // Custom pointer events
    scene.onPointerObservable.add((pointerInfo) => {      		
        switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
            if (
                pointerInfo && 
                pointerInfo.pickInfo &&
                pointerInfo.pickInfo.pickedMesh) {
                const pickedMesh = pointerInfo.pickInfo.pickedMesh as InteractiveMesh
                if (pickedMesh.onPointerPick) {
                    pickedMesh.onPointerPick(pointerInfo)
                    camera.detachControl()
                }
            }
            break
        case PointerEventTypes.POINTERUP:
            if (!camera.inputs.attachedToElement)
                camera.attachControl(canvas, true)
            break
        }
    })

    // WebXR
    const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [ground],
    });

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
    slideTile.position = new Vector3(0, 2, 0)
}

window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})
