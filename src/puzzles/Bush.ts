import { ColorMaterial } from '@/core/textures'
import { debug } from '@/core/Utils'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export const Bush = (scene: BABYLON.Scene) => {
    const parent = new TransformNode(`Door${++pc}`, scene)
    
    const bush = MeshBuilder.CreateBox(`Bush${++pc}`, {
        width: 0.95,
        depth: 0.95,
        height: 3
    }, scene)
    bush.setParent(parent)
    bush.position = new Vector3(0, 1.5, 0)
    bush.material = TexturedMeshNME({
        color1: "#00ff00",
        color2: "#ff00ff",
        scale: 60
    })
    bush.checkCollisions = true

    return parent
}
