import { ColorMaterial } from '@/core/textures'
import type { InteractiveMesh } from '@/Types'
import { debug } from '@/core/Utils'
import { PickupSFX } from '@/core/Sounds'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export const Witch = (scene: BABYLON.Scene) => {
    // Puzzle Settings
    const parent = new TransformNode(`Witch${++pc}`, scene) as InteractiveMesh
    parent.metadata = { attention: false }
    const lookAtPos: BABYLON.Quaternion[] = []

    // Meta
    let attention = false

    // Parent position
    const headMesh = MeshBuilder.CreateBox(`witch${++pc}`, {
        size: 0.25
    }, scene)
    
    headMesh.material = ColorMaterial('#00ff00', scene)
    headMesh.setParent(parent)

    // TODO: Give a hat

    // TODO: Give a face
    const eye = MeshBuilder.CreateBox('eye1', {
        size: 0.08
    })
    eye.setParent(headMesh)
    eye.position = new Vector3(-0.06, 0, 0.125)

    const eye2 = eye.clone()
    eye2.position.x = -1 * eye2.position.x

    attention = false
    headMesh.registerBeforeRender(() => {
        if (!scene.activeCamera) return
        if (attention) {
            parent.lookAt(scene.activeCamera.position)
        } else {
            // TODO: Rotate 180deg on the Y axis
            lookAtPos.push(scene.activeCamera.absoluteRotation.clone())
            if (lookAtPos.length > 60) {
                const q = lookAtPos.shift()
                if (!q) return
                parent.rotationQuaternion = q
            }
        }

    })
    parent.onPointerPick = () => {
        parent.metadata = { attention: !parent.metadata.attention }
        PickupSFX()
    }
    return parent
}