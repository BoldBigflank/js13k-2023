import { GravelMaterial } from '@/core/textures'
import { FlowerBoxPuzzle } from './FlowerBoxPuzzle'
import { Tree, TreeOpts } from './Tree'
import { DialPuzzle } from './DialPuzzle'
const { MeshBuilder, TransformNode, Vector3 } = BABYLON

export class Entrance {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    floors: BABYLON.Mesh[]
    puzzles: DialPuzzle[]
    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        this.puzzles = []
        this.floors = []
        // Parent position
        this.parent = new TransformNode('Entrance', this.scene)
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
        if (this.solved) return true
        this.solved = 
            this.puzzles.length > 0 &&
            this.puzzles.every((puzzle) => puzzle.solved)
        // if solved, Play Solved SFX
        // TODO: When solved, open the gate to the garden
        return this.solved
    }

    reset() {
        this.floors = []
        // *** DRIVEWAY ***
        const driveway = MeshBuilder.CreateTiledGround("ground", {
            xmin: -10,
            xmax: 12,
            zmin: -20,
            zmax: 12,
            subdivisions: {
                w: 11,
                h: 16
            }
        })
        driveway.setParent(this.parent)
        driveway.material = GravelMaterial(this.scene)
        driveway.position.y = -0.01
        driveway.position = new Vector3(0, 0.01, 0)
        
        // *** TREES ***
        const trees = [
            {shape:'box', count:3},
            {shape:'sphere', count:5},
            {shape:'triangle', count:4}
        ] as TreeOpts[]
        trees.forEach((opts, i) => {
            const tree = new Tree(opts, this.scene)
            tree.model.setParent(this.parent)
            tree.position = new Vector3(0, 0, -4 * i + 4)
        })

            
        // *** DIAL ***
        const dialPuzzle = new DialPuzzle({
            code: trees.map((tree) => tree.count).join(''),
            alphabet: "012345"
        }, this.scene)
        dialPuzzle.model.position = new Vector3(-6, 1, 41)
        dialPuzzle.model.rotation = new Vector3(0, Math.PI / 4, 0)
        this.puzzles.push(dialPuzzle)

    
        this.floors.push(driveway)

        
        this.solved = false
    }
}
