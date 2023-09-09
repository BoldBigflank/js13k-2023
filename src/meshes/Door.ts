import { ColorMaterial } from '@/core/textures'
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
        new Vector3( 0, 4, 0), // Just to the top
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
        new Vector3(0.51, -0.1, 0),
        new Vector3(0.51, 0, 0),
        new Vector3(-0.51, 0, 0),
        new Vector3(-0.51, -0.1, 0)
    ]

    const doorMiddle = [
        new Vector3(0, 0, 0),
        new Vector3(0, 4, 0)
    ]

    const handleShape = [
        new Vector3(.1, 0, 0),
        new Vector3(.2, 0, 0),
        new Vector3(.2, 0.05, 0),
        new Vector3(.1, 0.05, 0)
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

    const middle = MeshBuilder.ExtrudeShape("frame", {
        shape: frameOutline,
        path: doorMiddle,
        closeShape: true,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene)
    middle.material = ColorMaterial("#000000", scene)
    middle.setParent(parent)

    const handle = BABYLON.MeshBuilder.CreateLathe('handle', {
        shape: handleShape,
        radius: 1,
        closed: true,
        tessellation: 12, sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene)
    handle.material = ColorMaterial("#000000", scene)
    handle.setParent(parent)
    handle.rotation.x = Math.PI / 2
    handle.position = new Vector3(-0.5, 1, -0.55)

    const handle2 = handle.clone("handle2")
    handle2.position.x *= -1

    return parent
}
