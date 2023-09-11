import { InteractiveMesh } from '@/Types'
import { AnimationFactory } from '@/core/Animation'
import { ColorMaterial, ColorTextureMaterial, GridMaterial } from '@/core/textures'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, Vector3 } = BABYLON
export class DripTimingPuzzle {
    // 3 Columns of 3 segments of pipe
    // Each pipe segment is a different shape
    // Periodically, a drop of water falls from the top
    // The drop animates along the pipe, then falls into a couldron
    // Try to get each to drop at the same time
    parent: BABYLON.TransformNode

    scene: BABYLON.Scene
    constructor(scene: BABYLON.Scene) {
        this.scene = scene
        this.parent = new TransformNode('DripTimingPuzzle', this.scene)
    }

    
    get model() {
        return this.parent
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    set scale(s: BABYLON.Vector3) {
        this.parent.scaling = s
    }


}