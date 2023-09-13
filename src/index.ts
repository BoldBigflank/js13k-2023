import { Castle } from '@/puzzles/Castle'
import type { InteractiveMesh } from '@/Types'
import { GrassMaterial, CursorMaterial, ColorMaterial } from './core/textures'
import { AnimationFactory } from './core/Animation'
import { debug } from './core/Utils'
import { Garden } from './puzzles/Garden'
import { Entrance } from './puzzles/Entrance'
import { TexturedMeshNME } from './shaders/TexturedMeshNME'
import { GREEN, SPANISH_BLUE, WHITE } from './core/Colors'
import { Crown } from './meshes/Crown'


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
    
    // *** Inventory Parent
    const inventoryParent = new BABYLON.TransformNode('inventory-parent', scene)
    inventoryParent.setParent(scene.activeCamera)
    inventoryParent.position = new Vector3(-.5, 0, 2)

    // *** CAMERA CURSOR ***
    const cursor = BABYLON.MeshBuilder.CreatePlane("cursor", {
        
    }, scene)
    cursor.isPickable = false
    cursor.material = CursorMaterial(scene)
    cursor.setParent(camera)
    cursor.position = new Vector3 (0, 0, 1.1)
    cursor.renderingGroupId = 1

    // *** SUN ***
    new HemisphericLight("light", new Vector3(-0.5, 1, 0), scene)
    const light2 = new HemisphericLight("light", new Vector3(0.5, -1, 0), scene)
    
    // *** SKYBOX
    const skybox = BABYLON.MeshBuilder.CreateSphere('skybox', {
        diameter: 200,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene)
    const skyboxMaterial = TexturedMeshNME({
        color1: SPANISH_BLUE,
        color2: WHITE,
        scale: 0.1
    })
    skybox.material = skyboxMaterial
    skybox.infiniteDistance = true
    light2.includedOnlyMeshes.push(skybox)
    // skybox.light

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
    
    // *** ENTRANCE PUZZLE ***
    const entrance = new Entrance(scene)
    entrance.position = new Vector3(-15, 0, 32)

    // // Outside Forest
    // entrance.trees.forEach((tree) => {
    //     const treeArray: BABYLON.Matrix[] = []
    //     for (let i = 0; i < 1; i++) {
    //         const x = Math.random() * 8 - 4
    //         const z = Math.random() * 8 - 4
    //         const matrix = BABYLON.Matrix.Translation(x, 0, z)
    //         treeArray.push(matrix)
    //     }
    //     const treeChildren = tree.getChildMeshes()
    //     for (let i = 0; i < treeChildren.length; i++) {
    //         console.log('child', treeChildren[i])
    //         const mesh = treeChildren[i].clone(`clone${i}`, entrance.model)
    //         if (mesh instanceof BABYLON.Mesh) {
    //             console.log('is a mesh', mesh)
    //             mesh.material = ColorMaterial(GREEN, scene)
    //             mesh.thinInstanceAdd(treeArray)
    //         } else {
    //             console.log('not a mesh', mesh)
    //         }
    //     }
        
    // })

    // *** CASTLE ***
    const castle = new Castle(scene)
    castle.position = new Vector3(3, 0, 40)
    castle.scale = new Vector3(2, 2, 2)
    camera.setTarget(new Vector3(-1, 10, 43))
    

    // // *** MODEL CASTLE ***
    // const modelCastle = castle.model.clone("model-castle", null, false)
    // modelCastle!.scaling = new Vector3(0.05, 0.05, 0.05)
    // modelCastle!.position = new Vector3(0, 1, 4)

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
        floorMeshes: [...entrance.floors, ...garden.floors]
    })
    xr.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            motionController.onModelLoadedObservable.add((model) => {
                inventoryParent.setParent(model.rootMesh)
                inventoryParent.position = new Vector3(0, 0.1, 0.1)
                inventoryParent.rotation = Vector3.Zero()
            })
        })
    })
    xr.input.onControllerRemovedObservable.add((xrInput, state) => {
        inventoryParent.setParent(scene.activeCamera)
        inventoryParent.position = new Vector3(-.5, 0, 2)
        inventoryParent.rotation = Vector3.Zero()
    })
    // xr.input.controllers.forEach((controller) => {
    // })
    xr.baseExperience.onStateChangedObservable.add((state) => {
        inXRMode = state === BABYLON.WebXRState.IN_XR
        cursor.isEnabled(!inXRMode)
        if (debug) console.log('inXRMode', inXRMode, xr.input.controllers)
        if (inXRMode) {
            
        } else {
            inventoryParent.setParent(scene.activeCamera)
            inventoryParent.position = new Vector3(-.5, 0, 2)
            inventoryParent.rotation = Vector3.Zero()
        }
        
    })
}

window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})
