import { ColorMaterial } from '@/core/textures'
import { zzfx } from 'zzfx'
import { waterNME } from '@/shaders/waterNME'
import type { InteractiveMesh } from '@/Types'

const { TransformNode, 
    Quaternion, 
    Scene,
    MeshBuilder,
    HemisphericLight,
    FreeCamera,
    Vector3,
    PointerEventTypes,
    PointerInfo,
    StandardMaterial,
    Color4
} = BABYLON
let pc = 0

export class Witch {
    // Puzzle Settings
    scene: BABYLON.Scene
    lines: string[] = []
    parent: BABYLON.TransformNode
    headMesh: InteractiveMesh
    lookAtPos: BABYLON.Quaternion[] = []

    billboardOpenScale: BABYLON.Vector3 = new Vector3(0.125, 0.125, 0.125)
    billboardClosedScale: BABYLON.Vector3 = new Vector3(0.0125, 0.0125, 0.0125)

    // Meta
    attention = false

    constructor(scene: BABYLON.Scene) {
        this.scene = scene
        // Parent position
        this.parent = new TransformNode(`InfoBubble${++pc}`, this.scene)
        this.lookAtPos = []
        this.headMesh = MeshBuilder.CreateBox(`witch${++pc}`, {
            size: 0.25
        }, this.scene)
        
        this.headMesh.material = ColorMaterial('#00ff00', this.scene)
        this.headMesh.setParent(this.parent)

        // TODO: Give a hat

        // TODO: Give a face

        this.reset()
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    set rotation(rot: BABYLON.Vector3) {
        this.parent.rotation = rot
    }

    blur() {
        this.attention = false
        this.headMesh.setEnabled(true)
    }

    reset() {
        this.attention = false
        this.headMesh.registerBeforeRender((m) => {
            if (!this.scene.activeCamera) return
            if (this.attention) {
                this.headMesh.lookAt(this.scene.activeCamera.position)
            } else {
                // TODO: Rotate 180deg on the Y axis
                this.lookAtPos.push(this.scene.activeCamera.absoluteRotation.clone())
                if (this.lookAtPos.length > 60) {
                    const q = this.lookAtPos.shift()
                    if (!q) return
                    this.headMesh.rotationQuaternion = q
                }
            }

        })
        this.headMesh.onPointerPick = () => {
            console.log('clicked!', this.attention)
            this.attention = true
            zzfx(...[1.01,,275,.01,.01,.15,1,1.03,-3.7,,-93,.07,,,,-0.1,,.5,.04,.09]); // Pickup 121 - Mutation 2
        }
        
    }
}