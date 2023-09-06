import { GravelMaterial, SymbolMaterial } from '@/core/textures'
import { FlowerBoxPuzzle } from './FlowerBoxPuzzle'
import { Tree, TreeOpts } from './Tree'
import { DialPuzzle } from './DialPuzzle'
import { Door } from './Door'
import { Banner } from './Banner'
import { Bush } from './Bush'
import { AnimationFactory } from '@/core/Animation'
const { MeshBuilder, TransformNode, Vector3 } = BABYLON

export class Entrance {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    floors: BABYLON.Mesh[]
    bushes: BABYLON.TransformNode[]
    puzzles: DialPuzzle[]
    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        this.puzzles = []
        this.floors = []
        this.bushes = []
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
        // between 12.5 and 28.5 z
        this.bushes.forEach((bush, i) => {
            if (bush.position.z < -14 || bush.position.z > -12) return
            // if (i < 6 || i > 7) return
            AnimationFactory.Instance.animateTransform({
                mesh: bush,
                end: {
                    position: bush.position.add(new Vector3(0, 3, 0))
                },
                duration: 5000,
                delay: 100
            })
        })
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
            alphabet: "012345",
            solvedEvent: () => {
                this.isSolved()
            }
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

        const bush = Bush(this.scene)
        for (let i = 0; i < 16; i++) {
            const newBush = bush.clone(`Bush${i}`, this.parent, false)
            if (!newBush) continue
            newBush.position = new Vector3(12.5, 0, -19.5 + i)
            this.bushes.push(newBush)
        }
        bush.dispose()


        
        this.solved = false
    }
}
