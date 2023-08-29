import { Castle } from '@/puzzles/Castle'
import type { InteractiveMesh } from '@/Types'
import { GrassMaterial, CursorMaterial } from './core/textures'
import { Witch } from './puzzles/Witch'
import { FlowerBoxPuzzle } from './puzzles/FlowerBoxPuzzle'
import { AnimationFactory } from './core/Animation'

const { Engine, Scene, MeshBuilder, HemisphericLight, UniversalCamera, Vector3, PointerEventTypes } = BABYLON
const init = async () => {
    document.getElementById('intro')!.style.display = 'none'
    const canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    canvas.style.display = 'block'
    canvas.addEventListener("click", async () => {
        if (document.pointerLockElement === canvas) return
        // @ts-ignore
        await canvas.requestPointerLock({
            unadjustedMovement: true
        })
    })
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    AnimationFactory.Instance.initScene(scene)
    scene.gravity = new Vector3(0, -0.15, 0)
    scene.collisionsEnabled = true
    // scene.debugLayer.show({
    //     embedMode: true
    // })
    engine.displayLoadingUI()

    const camera = new UniversalCamera('MainCamera', new Vector3(0, 1.615, 0), scene)
    camera.inertia = 0
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

    // Camera cursor
    const cursor = BABYLON.MeshBuilder.CreatePlane("cursor", {
        
    }, scene)
    cursor.isPickable = false
    cursor.material = CursorMaterial(scene)
    cursor.setParent(camera)
    cursor.position = new Vector3 (0, 0, 1.1)
    cursor.renderingGroupId = 1
    new HemisphericLight("light", new Vector3(0, 1, 0), scene)

    const ground = MeshBuilder.CreateTiledGround("ground", {
        xmin: -50,
        zmin: -50,
        xmax: 50,
        zmax: 50,
        subdivisions: {
            w: 10,
            h: 10
        }
    })
    ground.material = GrassMaterial(scene)

    ground.checkCollisions = true
    ground.position.y = -0.01
    
    const floor = MeshBuilder.CreateGround("floor", {
        width: 24,
        height: 24,
        subdivisions: 100
    }, scene)
    
    floor.position = new Vector3(-15, 0, 32)
    floor.checkCollisions = true
    
    const pointerPickCenterScreen = () => {
        const pickedInfo = scene.pick(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2)
        // console.log('pickedInfo', pickedInfo)
        let pickedMesh = pickedInfo?.pickedMesh as InteractiveMesh
        while (pickedMesh && !pickedMesh.onPointerPick) {
            pickedMesh = pickedMesh.parent as InteractiveMesh
        }
        if (pickedMesh && pickedMesh.onPointerPick) {
            pickedMesh.onPointerPick()
            // camera.detachControl()
        }
    }
    // Custom pointer events
    scene.onPointerObservable.add((pointerInfo) => {      		
        switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
            // if (!pointerInfo) break
            // if (!pointerInfo.pickInfo) break
            // if (!pointerInfo.pickInfo.pickedMesh) break
            pointerPickCenterScreen()
            break
        case PointerEventTypes.POINTERUP:
            if (!camera.inputs.attachedToElement)
                camera.attachControl(canvas, true)
            break
        }
    })

    // WebXR
    const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [floor]
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
    const castle = new Castle(scene)
    castle.position = new Vector3(3, 0, 40)
    castle.scale = new Vector3(2, 2, 2)
    const modelCastle = castle.model.clone("model-castle", null, false)
    modelCastle!.scaling = new Vector3(0.05, 0.05, 0.05)
    modelCastle!.position = new Vector3(0, 1, 4)

    const witch = new Witch(scene)
    witch.position = new Vector3(0, 2, 2)

    const flowerBoxPuzzle = new FlowerBoxPuzzle(scene)
    flowerBoxPuzzle.position = new Vector3(0, 0, 1)

}

window.addEventListener('DOMContentLoaded', () => {

    // Test 

    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})
