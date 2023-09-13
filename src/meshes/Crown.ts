import { BLACK, BLUE, MID_GREY, ORANGE, RED, SPANISH_BLUE, YELLOW } from '@/core/Colors'
import { ColorMaterial } from '@/core/textures'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'
import { waterNME } from '@/shaders/waterNME'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export const Crown = (scene: BABYLON.Scene) => {
    const parent = new TransformNode(`Crown${++pc}`, scene)

    // CrownShape
    const archShape = [
        new Vector3(0.4, 0, 0),
        new Vector3(0.4, 0.1, 0),
        new Vector3(-0.4, 0.1, 0),
        new Vector3(-0.4, 0, 0)
    ]
    // CrownPath
    const archPath = [
        new Vector3( 3, 2, 0),
        new Vector3( 3, 4, 0),
        new Vector3( 2, 5, 0),
        new Vector3( 0, 5, 0),
        new Vector3( -2, 5, 0),
        new Vector3( -3, 4, 0),
        new Vector3( -3, 2, 0),
    ]

    const baseShape = [
        new Vector3(3.4, 0, 0),
        new Vector3(3.4, 2, 0),
        new Vector3(3, 2, 0),
        new Vector3(3, 0, 0)
    ]

    const arch = MeshBuilder.ExtrudeShape("arch", {
        shape: archShape,
        path: archPath,
        closeShape: true,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene)
    arch.material = ColorMaterial(YELLOW, scene)
    arch.setParent(parent)

    const arch2 = arch.clone('arch2')
    arch2.rotateAround(Vector3.Zero(), Vector3.Up(), Math.PI / 2)

    // cloth
    const cloth = BABYLON.MeshBuilder.CreateLathe('cloth', {
        shape: archPath,
        radius: 0,
        arc: 0.5,
        closed: false,
        tessellation: 12,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene)
    // cloth.material = ColorMaterial(RED, scene)
    cloth.material = TexturedMeshNME({
        color1: RED,
        color2: BLACK,
        scale:2
    })
    cloth.setParent(parent)
    cloth.scaling = new Vector3(0.95, 0.95, 0.95)

    // cross/ball
    const ball = BABYLON.MeshBuilder.CreateSphere('crown-ball', {
        diameter: 1
    }, scene)
    ball.material = ColorMaterial(YELLOW, scene)
    ball.setParent(parent)
    ball.position.y = 5.5


    // base
    const base = BABYLON.MeshBuilder.CreateLathe('cloth', {
        shape: baseShape,
        radius: 0,
        closed: true,
        tessellation: 12,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene)
    base.material = ColorMaterial(YELLOW, scene)
    base.setParent(parent)

    
    parent.scaling = new Vector3(0.25, 0.25, 0.25)
    parent.getChildMeshes().forEach((mesh) => {
        mesh.renderingGroupId = 1
    })

    return parent

    // BaseShape


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

    const arrowShape = [
        new Vector3( 1, 0.5, 0),
        new Vector3( 0, 0.5, 0),
        new Vector3( 0, 1, 0),
        new Vector3( -1, 0, 0),
        new Vector3( 0, -1, 0),
        new Vector3( 0, -0.5, 0),
        new Vector3( 1, -0.5, 0)

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

    // *** ARROW
    
    const arrow = MeshBuilder.ExtrudeShape("door", {
        shape: arrowShape,
        path: doorPath,
        closeShape: true,
        cap: BABYLON.Mesh.CAP_ALL
    }, scene)
    arrow.setParent(parent)
    arrow.position = new Vector3(0, 1, -1)
    arrow.material = waterNME({
        baseColor: SPANISH_BLUE,
        rippleColor: ORANGE
    })
    arrow.rotateAround(new Vector3(0, 0, -1), Vector3.Up(), Math.PI / 4)
    arrow.rotateAround(new Vector3(0, 0, 1), Vector3.Right(), Math.PI / 2)
    

    return parent
}
