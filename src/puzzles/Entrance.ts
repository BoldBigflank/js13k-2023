import { GravelMaterial, SymbolMaterial } from '@/core/textures'
import { FlowerBoxPuzzle } from './FlowerBoxPuzzle'
import { Tree, TreeOpts } from './Tree'
import { DialPuzzle } from './DialPuzzle'
import { Door } from './Door'
import { Banner } from './Banner'
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
        dialPuzzle.model.setParent(this.parent)
        dialPuzzle.model.position = new Vector3(11.5, 0.5, 7.5)
        dialPuzzle.model.rotation = new Vector3(0, Math.PI / 4, 0)
        this.puzzles.push(dialPuzzle)
        

        // ** DOOR ***
        const door = Door(this.scene)
        door.setParent(this.parent)
        door.position = new Vector3(9.5, 0, 9.5)
        door.rotation = new Vector3(0, Math.PI / 4, 0)
        
        const banner = Banner(this.scene)
        banner.setParent(this.parent)
        banner.position = new Vector3(-5, 8, 11.5)

        const banner2 = Banner(this.scene)
        banner2.setParent(this.parent)
        banner2.position = new Vector3(11.6, 8, 0)
        banner2.rotation = new Vector3(0, Math.PI / 2, 0)

        this.floors.push(driveway)

        
        this.solved = false
    }
}
