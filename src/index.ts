import { Castle } from '@/puzzles/Castle'
import type { InteractiveMesh } from '@/Types'
import { GrassMaterial, CursorMaterial, GravelMaterial } from './core/textures'
import { Witch } from './puzzles/Witch'
import { AnimationFactory } from './core/Animation'
import { debug } from './core/Utils'
import { Garden } from './puzzles/Garden'
import { DialPuzzle } from './puzzles/DialPuzzle'


const { Engine, Scene, MeshBuilder, HemisphericLight, UniversalCamera, Vector3, PointerEventTypes } = BABYLON
const init = async () => {
    let inXRMode = false
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
    // DEBUG
    if (debug) {
        scene.debugLayer.show({
            embedMode: true
        })
    }
    engine.displayLoadingUI()

    // *** CAMERA ***
    const camera = new UniversalCamera('MainCamera', new Vector3(-23, 1.615, 13.5), scene)
    camera.inertia = 0
    camera.speed = 3
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
    camera.minZ = 0.1

    const pointerPickCenterScreen = () => {
        return scene.pick(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2)
    }
    // Custom pointerdown event for Mouse/keyboard
    scene.onPointerObservable.add((pointerInfo) => {      		
        if (pointerInfo.type !== PointerEventTypes.POINTERDOWN) return
        if (!scene) return
        if (!inXRMode && pointerInfo.event.button !== 0) return // Only left mouse click
        const pickedInfo = (inXRMode) ? pointerInfo.pickInfo : pointerPickCenterScreen()
        let pickedMesh = pickedInfo?.pickedMesh as InteractiveMesh
        while (pickedMesh && !pickedMesh.onPointerPick) {
            pickedMesh = pickedMesh.parent as InteractiveMesh
        }
        if (pickedMesh && pickedMesh.onPointerPick) {
            pickedMesh.onPointerPick()
        }
    })
    // run the render loop
    engine.runRenderLoop(() => {
        scene.render()
    })

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
        engine.resize()
    })
    
    // *** CAMERA CURSOR ***
    const cursor = BABYLON.MeshBuilder.CreatePlane("cursor", {
        
    }, scene)
    cursor.isPickable = false
    cursor.material = CursorMaterial(scene)
    cursor.setParent(camera)
    cursor.position = new Vector3 (0, 0, 1.1)
    cursor.renderingGroupId = 1

    // *** SUN ***
    new HemisphericLight("light", new Vector3(0, 1, 0), scene)

    // *** GROUND ***
    const ground = MeshBuilder.CreateTiledGround("ground", {
        xmin: -50,
        xmax: 100,
        zmin: -20,
        zmax: 80,
        subdivisions: {
            w: 20,
            h: 10
        }
    })
    ground.material = GrassMaterial(scene)
    ground.checkCollisions = true
    ground.position.y = -0.01
    
    // *** DRIVEWAY ***
    const driveway = MeshBuilder.CreateTiledGround("ground", {
        xmin: -10,
        xmax: 12,
        zmin: -20,
        zmax: 12,
        subdivisions: {
            w: 11,
            h: 16
        }
    })
    driveway.material = GravelMaterial(scene)
    driveway.position.y = -0.01
    driveway.position = new Vector3(-15, 0.01, 32)
    
    // *** DIAL ***
    const dialPuzzle = new DialPuzzle({}, scene)
    dialPuzzle.model.position = new Vector3(-6, 1, 41)
    dialPuzzle.model.rotation = new Vector3(0, Math.PI / 4, 0)

    // *** CASTLE ***
    const castle = new Castle(scene)
    castle.position = new Vector3(3, 0, 40)
    castle.scale = new Vector3(2, 2, 2)
    camera.setTarget(new Vector3(-1, 10, 43))
    

    // *** MODEL CASTLE ***
    const modelCastle = castle.model.clone("model-castle", null, false)
    modelCastle!.scaling = new Vector3(0.05, 0.05, 0.05)
    modelCastle!.position = new Vector3(0, 1, 4)

    // *** WITCH ***
    const witch = new Witch(scene)
    witch.position = new Vector3(0, 2, 2)

    // *** GARDEN ***
    const garden = new Garden(scene)
    garden.position = new Vector3(15, 0, 18)
    
    // *** BOUNDING BOX ***
    const bounds = MeshBuilder.CreateBox('bounds', {
        width: 58,
        height: 5,
        depth: 32,
        sideOrientation: BABYLON.Mesh.BACKSIDE
    }, scene)
    bounds.position = new Vector3(4, 0, 28)
    bounds.checkCollisions = true
    bounds.visibility = 0

    // Done loading meshes
    engine.hideLoadingUI()

    // WebXR
    const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [driveway, ...garden.floors]
    })
    const xrHelper = await BABYLON.WebXRExperienceHelper.CreateAsync(scene)
    xrHelper.onStateChangedObservable.add((state) => {
        inXRMode = state === BABYLON.WebXRState.IN_XR
        cursor.isEnabled(!inXRMode)
        // Inventory transform parent
    })
}

window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})
