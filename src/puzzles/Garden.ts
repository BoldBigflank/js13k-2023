import { GardenHeightMap, grassMaterial } from '@/core/textures'

const { TransformNode, Vector3 } = BABYLON

export class Garden {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode

    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        // Parent position
        this.parent = new TransformNode('Castle', this.scene)
        this.reset()
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

    isSolved() {
        // if (this.solved) return true
        // this.solved = this.jars.every((jar, index) => {
        //     return jar.orientation === index
        // })
        // // Solved sfx
        // if (this.solved) zzfx(...[2.07,0,130.81,.01,.26,.47,3,1.15,,.1,,,.05,,,,.14,.26,.15,.02]) // Music 112 - Mutation 2
        return this.solved
    }

    reset() {
        // this.solved = false
        // this.jars = []

        // x, y, z, w, h, d
        const boxes = [
            [-11.5,3,5      ,5,6,6]

        ]
        
        const gardenHeightMap = GardenHeightMap()
        console.log('garden heightmap', gardenHeightMap)
        const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("garden", gardenHeightMap,
            {
                subdivisions: 256,
                minHeight:0,
                onReady: () => {
                    console.log("READY")
                }
            }, this.scene)
        ground.position = new Vector3(0, 0, 0)
        // ground.material = colorMaterial("#ff00ff", this.scene)
        ground.material = grassMaterial(this.scene)
        ground.setParent(this.parent)

        
        // Slanted roofs

        // Chimneys

    }
}
