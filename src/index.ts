import { SlideTilePuzzle } from '@/puzzles/SlideTilePuzzle'
import { JarPuzzle } from '@/puzzles/JarPuzzle'
import { waterNME } from '@/shaders/waterNME'
import type { Tile, InteractiveMesh } from '@/Types'

const { Engine, Scene, MeshBuilder, HemisphericLight, UniversalCamera, Vector3, Vector4, PointerEventTypes } = BABYLON
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
    camera.keysUp.push(87)    		// W
    camera.keysDown.push(83)   		// D
    camera.keysLeft.push(65)  		// A
    camera.keysRight.push(68) 		// S
    camera.keysUpward.push(69)		// E
    camera.keysDownward.push(81)     // Q

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

    // // Test water cube
    // const waterBox = MeshBuilder.CreateBox("box", {}, scene)
    // waterBox.position = new Vector3(-3, 2, -2)
    // const waterMat = waterNME()
    // waterBox.material = waterMat

    // // Test 
    // const mat = new BABYLON.StandardMaterial("mat", scene)
    // const tex = new BABYLON.Texture('./checker.png', scene)
    // mat.diffuseTexture = tex
    
    // const testBox = MeshBuilder.CreateBox("box", {}, scene)
    // testBox.position = new Vector3(-1, 1, 0)
    // testBox.material = mat
    
    // // The width is w = 1
    // // The height is h = 2w
    // // The circumference is c = PI*w
    // // The uv height is 2/PI
    // const testCylinder = MeshBuilder.CreateCylinder('cylinder', {
    //     height: 3.14,
    //     subdivisions: 2,
    //     enclose: true,
    //     faceUV: [
    //         new Vector4(0,0,1,1), // bottom cap
    //         new Vector4(1,0,0,1), // center
    //         new Vector4(0,0,1,1) // top cap
    //     ]
    // }, scene)
    // testCylinder.position = new Vector3(0, 3.14/4, 0)
    // testCylinder.scaling = new Vector3(0.5, 0.5, 0.5)
    // testCylinder.material = mat

    // const testSphere = MeshBuilder.CreateSphere('sphere', {}, scene)
    // testSphere.position = new Vector3(1, 1, 0)
    // testSphere.material = mat

    // const testCapsule = MeshBuilder.CreateCapsule('capsule', {
    //     radiusTop: .3
    // }, scene)
    // testCapsule.position = new Vector3(2, 1, 0)
    // testCapsule.material = mat


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
        floorMeshes: [ground]
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
    const jarPuzzle = new JarPuzzle(scene)
    jarPuzzle.position = new Vector3(-2, 1, 2)
    const slideTile = new SlideTilePuzzle(scene)
    slideTile.position = new Vector3(0, 2, 4)
}

window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})
