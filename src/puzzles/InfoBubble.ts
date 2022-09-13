import { infoBillboardMaterial } from '@/core/textures'
import { zzfx } from 'zzfx'
import type { InteractiveMesh } from '@/Types'

const { TransformNode, Engine, Scene, MeshBuilder, HemisphericLight, FreeCamera, Vector3, PointerEventTypes, PointerInfo, StandardMaterial } = BABYLON

export class InfoBubble {
    // Puzzle Settings
    scene: BABYLON.Scene
    lines: string[] = []
    parent: BABYLON.TransformNode
    bubbleMesh: InteractiveMesh
    billboardMesh: InteractiveMesh
    lookAtPos: BABYLON.Vector3
    billboardOpenScale: BABYLON.Vector3 = new Vector3(0.125, 0.125, 0.125)
    billboardClosedScale: BABYLON.Vector3 = new Vector3(0.0125, 0.0125, 0.0125)

    // Meta
    open = false

    constructor(lines: string[], scene: BABYLON.Scene) {
        this.scene = scene
        this.lines = lines
        // Parent position
        this.parent = new TransformNode('InfoBubble', this.scene)
        this.lookAtPos = new Vector3(0, 0, 0)
        this.bubbleMesh = MeshBuilder.CreateCylinder(`bubble${this.lines[0]}`, {
            diameter: 0.25,
            height: 0.06
        }, this.scene)
        this.bubbleMesh.rotation = new Vector3(Math.PI / 2, 0, 0)
        this.bubbleMesh.setParent(this.parent)
        this.billboardMesh = MeshBuilder.CreatePlane(`billboard${this.lines[0].replace(/\s/, '')}`, {
            width: 1.6,
            height: .9,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        })
        this.billboardMesh.setEnabled(false)
        // this.billboardMesh.renderingGroupId = 1
    
        // this.billboardMesh.setPivotPoint(new Vector3(1, 0.75))
        this.billboardMesh.position = new Vector3(0, 0.45, 0)
        this.billboardMesh.setParent(this.parent)
        this.reset()
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    set rotation(rot: BABYLON.Vector3) {
        this.parent.rotation = rot
    }

    blur() {
        this.open = false
        this.billboardMesh.setEnabled(false)
        this.bubbleMesh.setEnabled(true)
    }

    reset() {
        this.open = false
        this.bubbleMesh.registerBeforeRender((m) => {
            this.bubbleMesh.rotate(Vector3.Up(), Math.PI / 180, BABYLON.Space.WORLD)
        })
        this.bubbleMesh.onPointerPick = (pointerInfo: BABYLON.PointerInfo) => {
            console.log('clicked!', this.open)
            this.billboardMesh.setEnabled(true)
            this.bubbleMesh.setEnabled(false)
            this.open = true
            zzfx(...[1.01,,275,.01,.01,.15,1,1.03,-3.7,,-93,.07,,,,-0.1,,.5,.04,.09]); // Pickup 121 - Mutation 2
        }
        
        // Create a Billboard
        this.billboardMesh.material = infoBillboardMaterial(this.lines, this.scene)
    }
}