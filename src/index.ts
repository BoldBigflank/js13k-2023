import { SlideTilePuzzle } from '@/puzzles/SlideTilePuzzle'
import { JarPuzzle } from '@/puzzles/JarPuzzle'
import { InfoBubble } from '@/puzzles/InfoBubble'
import type { InteractiveMesh } from '@/Types'
import { columnMaterial, wallMaterial, floorMaterial } from './core/textures'
import { jarHeads } from './core/Utils'
import { Mesh } from 'babylonjs'

const { Engine, Scene, MeshBuilder, HemisphericLight, UniversalCamera, Vector3, Color4, PointerEventTypes } = BABYLON
const init = async () => {
    document.getElementById('intro')!.style.display = 'none'
    const canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    canvas.style.display = 'block'
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const infoBubbles: InfoBubble[] = []
    scene.gravity = new Vector3(0, -0.15, 0)
    scene.collisionsEnabled = true
    scene.debugLayer.show({
        embedMode: true
    })
    engine.displayLoadingUI()

    const camera = new UniversalCamera('MainCamera', new Vector3(0, 1.615, 0), scene)
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
    ground.position.y = -0.01
    const floor = MeshBuilder.CreateGround("floor", {
        width: 12,
        height: 8,
        subdivisions: 100
    }, scene)
    floor.material = floorMaterial(scene)
    floor.position = new Vector3(0, 0, 3)
    floor.checkCollisions = true
    const ceiling = floor.clone('ceiling')
    ceiling.position.y = 3.14
    ceiling.rotate(Vector3.Right(), Math.PI, BABYLON.Space.WORLD)

    // Walls
    const walls = [
        { x: 0, z: -1.5, width: 12, depth: 1 },
        { x: 0, z: 7.5, width: 12, depth: 1 },
        { x: -6.5, z: 3, width: 1, depth: 8 },
        { x: 6.5, z: 3, width: 1, depth: 8 }
    ]
    walls.forEach((wall, i) => {
        const wallMesh = MeshBuilder.CreateBox(`wall${i}`, {
            width: wall.width,
            depth: wall.depth,
            height: 3.14
        }, scene)
        wallMesh.checkCollisions = true
        wallMesh.position = new Vector3(wall.x, 1.57, wall.z)
        wallMesh.material = wallMaterial([], scene)
    })

    // Pillars
    const pillars = [
        { x: 4.5, z: 0.5, rotation: Math.PI },
        { x: -4.5, z: 0.5, rotation: Math.PI * 3 / 2 },
        { x: -4.5, z: 5.5, rotation: 0 },
        { x: 4.5, z: 5.5, rotation: Math.PI / 2 }
    ]
    pillars.forEach((opts, i) => {
        const mesh = MeshBuilder.CreateCylinder(`column${i}`, {
            diameter: 1,
            height: 3.14
        })
        mesh.checkCollisions = true
        mesh.position = new Vector3(opts.x, 1.5, opts.z)
        mesh.material = columnMaterial([jarHeads[i]], scene)
        mesh.rotation = new Vector3(0, opts.rotation, 0)
    })

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
                infoBubbles.forEach((bubble) => {
                    bubble.blur()
                })
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
    const jarPuzzle = new JarPuzzle(scene)
    jarPuzzle.position = new Vector3(3, 0, 3)
    const slideTile = new SlideTilePuzzle(scene)
    slideTile.position = new Vector3(0, 0, 4)

    const infoBubblesOpts = [
        {
            x: 0,
            y: 2,
            z: 3,
            angle: 0,
            lines: [
                'Tut\'s tomb was not actually',
                'this big, it was roughly half',
                'the length, width, and height',
                'of what you see. This token',
                'marks the halfway point.'
            ]
        },
        {
            x: 3.6,
            y: .7,
            z: 2.7,
            angle: Math.PI / 2,
            lines: [
                'Four canopic jars hold Tut\'s',
                'stomach, intestines, lungs,',
                'and liver. These were',
                'considered necessary for the',
                'afterlife, and preserved here.'
            ]
        },
        {
            x: 5.6,
            y: 2,
            z: 5,
            angle: Math.PI / 2,
            lines: [
                'This wall lead to the Treasury',
                'where Tut\'s canopic jars were',
                'actually kept. It also held a',
                'statue of Anubis on a golden',
                'shrine, keeping guard.'
            ]
        },
        {
            x: 0,
            y: 1,
            z: 5,
            angle: 0,
            lines: [
                'Scarabs are a symbol of new',
                'life. Funerary workers place',
                'a scarab over the mummy\'s',
                'chest to provide protection',
                'and guidance being reborn',
                'in the afterlife'
            ]
        }
        
    ]
    
    infoBubblesOpts.forEach((opts) => {
        const infoBubble = new InfoBubble(opts.lines, scene)
        console.log('placing bubble at ', opts.x, opts.y, opts.z)
        infoBubble.position = new Vector3(opts.x, opts.y, opts.z)
        infoBubble.rotation = new Vector3(0, opts.angle, 0)
        infoBubbles.push(infoBubble)
    })


}

window.addEventListener('DOMContentLoaded', () => {

    // Test 

    const b = document.getElementById('playButton') as HTMLButtonElement
    b.onclick = init
})
