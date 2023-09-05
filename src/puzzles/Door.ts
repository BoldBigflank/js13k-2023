import { ColorMaterial } from '@/core/textures'
import { debug } from '@/core/Utils'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export const Door = (scene: BABYLON.Scene) => {
    const parent = new TransformNode(`Door${++pc}`, scene)
    //  *** Door shape ***
    const doorOutline = [
        new Vector3( 2, 0, 0),
        new Vector3( 2, 2, 0),
        new Vector3( 1.74, 3, 0),
        new Vector3( 1, 3.74, 0),
        new Vector3( 0, 4, 0),
        new Vector3( -1, 3.74, 0),
        new Vector3( -1.74, 3, 0),
        new Vector3( -2, 2, 0),
        new Vector3( -2, 0, 0)
    ]

    const doorPath = [
        new Vector3(0, 0, 0.5),
        new Vector3(0, 0, -0.5)
    ]

    const frameOutline = [
        new Vector3(0.55, -0.1, 0),
        new Vector3(0.55, 0, 0),
        new Vector3(-0.55, 0, 0),
        new Vector3(-0.55, -0.1, 0)
    ]

    const door = MeshBuilder.ExtrudeShape("door", {
        shape: doorOutline,
        path: doorPath,
        closeShape: true,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene)
    
    door.material = TexturedMeshNME({
        color1: "#332211",
        color2: "#593b1d",
        scale: 5
    })
    door.setParent(parent)

    const frame = MeshBuilder.ExtrudeShape("frame", {
        shape: frameOutline,
        path: doorOutline,
        closeShape: true,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene)
    frame.material = ColorMaterial("#888888", scene)
    frame.setParent(parent)
    return parent
}
