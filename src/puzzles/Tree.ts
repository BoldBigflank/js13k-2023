import { ColorMaterial } from '@/core/textures'
import { zzfx } from 'zzfx'
import type { InteractiveMesh } from '@/Types'
import { debug } from '@/core/Utils'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export type TreeOpts = {
    shape?: 'box'|'triangle'|'sphere'
    count?: number
}

export class Tree {
    // Puzzle Settings
    scene: BABYLON.Scene
    lines: string[] = []
    parent: BABYLON.TransformNode
    lookAtPos: BABYLON.Quaternion[] = []

    billboardOpenScale: BABYLON.Vector3 = new Vector3(0.125, 0.125, 0.125)
    billboardClosedScale: BABYLON.Vector3 = new Vector3(0.0125, 0.0125, 0.0125)

    // Meta
    attention = false

    constructor(opts: TreeOpts, scene: BABYLON.Scene) {
        this.scene = scene
        // Parent position
        this.parent = new TransformNode(`Tree${++pc}`, this.scene)
        
        const count = opts.count || 3
        const shape = opts.shape || 'box'
        const trunk = MeshBuilder.CreateCylinder(`trunk${++pc}`, {
            diameter: 0.5,
            height: 3,
            tessellation: 6
        })
        trunk.material = TexturedMeshNME({
            color1: "#332211",
            color2: "#593b1d",
            scale: 5
        })
        trunk.setParent(this.parent)
        trunk.position = new Vector3(0, 1.5, 0)

        for (let i = 0; i < count; i++) {
            let shapeMesh
            switch (shape) {
            case 'box':
                shapeMesh = MeshBuilder.CreateBox(`shape${++pc}`, {
                    size: 1.5
                }, scene)
                break
            case 'triangle':
                shapeMesh = MeshBuilder.CreateCylinder(`shape${++pc}`, {
                    diameterTop: 0,
                    diameterBottom: 4,
                    tessellation: 3
                }, scene)
                break
            case 'sphere':
                shapeMesh = MeshBuilder.CreateSphere(`shape${++pc}`, {
                    diameter: 2
                }, scene)
                break
            default:
                break
            }
            if (!shapeMesh) return
            shapeMesh.material = TexturedMeshNME({
                color1: "#00ff00",
                color2: "#332211",
                scale: 25
            })
            shapeMesh.setParent(trunk)
            shapeMesh.position.y = 0.75 * i + 0.5
            shapeMesh.position.x = 0.25 * (count - i)
            shapeMesh.rotation = new Vector3(
                Math.random() * 2 * Math.PI,
                Math.random() * 2 * Math.PI,
                Math.random() * 2 * Math.PI
            )
            shapeMesh.rotateAround(Vector3.Zero(), Vector3.Up(), Math.random() * 2 * Math.PI)
        }

        this.reset()
    }

    get model() {
        return this.parent
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    set rotation(rot: BABYLON.Vector3) {
        this.parent.rotation = rot
    }

    reset() {
       
    }
}