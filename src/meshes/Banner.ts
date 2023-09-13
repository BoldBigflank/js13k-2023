import { ColorMaterial, SymbolMaterial } from '@/core/textures'
import { debug } from '@/core/Utils'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, 
    MeshBuilder,
    Vector3
} = BABYLON
let pc = 0

export const Banner = (scene: BABYLON.Scene) => {
    const parent = new TransformNode(`Banner${++pc}`, scene)

    // *** DOOR SYMBOLS ***
    const symbols = MeshBuilder.CreateGround('symbols', {
        width: 4,
        height: 4,
        subdivisions: 12,
        updatable: true,

    }, scene)
    symbols.setParent(parent)
    symbols.position = new Vector3(0, 2, 0)
    symbols.rotation.x = 3 * Math.PI / 2
    symbols.material = SymbolMaterial(scene)

    let timer = 0
    symbols.registerBeforeRender((mesh) => {
        timer += scene.getEngine().getDeltaTime()
        // Wave the flag
        const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
        if (!positions) return
        for (let i = 0; i < positions?.length; i += 3) {
            positions[i + 1] = 0.1 * (positions[i+2] - 2) * Math.sin(0.8 * timer / 100 + positions[i + 2])
        }
        mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions)
        
    })

    return parent
}
