import { ColorMaterial, SymbolMaterial, TextMaterial } from '@/core/textures'
import { debug } from '@/core/Utils'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export class InfoBillboard {
    scene: BABYLON.Scene
    parent: BABYLON.TransformNode
    billboard: BABYLON.Mesh

    constructor(scene: BABYLON.Scene) {
        this.scene = scene
        this.parent = new TransformNode(`InfoBillboard${++pc}`, scene)
        this.billboard = MeshBuilder.CreatePlane('billboard', {
            width: 3,
            height: 1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene)

        // this.billboard.material = TextMaterial(lines, scene)
        this.billboard.setParent(this.parent)
        this.billboard.position = new Vector3(0, 0.6, 0)
        this.billboard.rotation.x = Math.PI / 4
    }

    setLines = (lines: string[]) => {
        this.billboard.material = TextMaterial(lines, this.scene)
    }

    setEndgame = () => {
        this.billboard.material = TextMaterial(["Thanks for playing!"], this.scene)
        this.billboard.rotation = Vector3.Zero()
        this.billboard.renderingGroupId = 1
    }
    
    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    set rotation(rot: BABYLON.Vector3) {
        this.billboard.rotation = rot
    }


    get model() {
        return this.parent
    }
} 

// (lines: string[], scene: BABYLON.Scene) => {
//     const parent = new TransformNode(`InfoBillboard${++pc}`, scene)
//     const background = MeshBuilder.CreatePlane('billboard', {
//         width: 3,
//         height: 1,
//         sideOrientation: BABYLON.Mesh.DOUBLESIDE
//     }, scene)
//     // background.material = ColorMaterial("#ff00ff", scene)
//     background.material = TextMaterial(lines, scene)
//     background.setParent(parent)
//     background.position = new Vector3(0, 0.6, 0)
//     background.rotation.x = Math.PI / 4
//     return parent

// }
