import { GravelMaterial } from '@/core/textures'
import { Tree, TreeOpts } from '../meshes/Tree'
import { DialPuzzle } from './DialPuzzle'
import { Door } from '../meshes/Door'
import { Banner } from '../meshes/Banner'
import { Bush } from '../meshes/Bush'
import { AnimationFactory } from '@/core/Animation'
import { debug } from '@/core/Utils'
const { MeshBuilder, TransformNode, Vector3 } = BABYLON

export class Entrance {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    floors: BABYLON.Mesh[]
    bushes: BABYLON.TransformNode[]
    door?: BABYLON.TransformNode
    puzzles: DialPuzzle[]
    trees: BABYLON.TransformNode[]
    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        this.puzzles = []
        this.floors = []
        this.bushes = []
        this.trees = []
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
        if (this.solved) {
            this.bushes.forEach((bush, i) => {
                if (bush.position.z < -14 || bush.position.z > -12) return
                // if (i < 6 || i > 7) return
                AnimationFactory.Instance.animateTransform({
                    mesh: bush,
                    end: {
                        position: bush.position.add(new Vector3(0, 3, 0))
                    },
                    duration: 4000,
                    delay: 3000
                })
            })
            if (this.door) {
                AnimationFactory.Instance.animateTransform({
                    mesh: this.door,
                    end: {
                        rotation: this.door.rotation.add(new Vector3(- 1 * Math.PI / 2, 0, 0))
                    },
                    duration: 5000
                })
            }
        }
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
            const tree = Tree(opts, this.scene)
            if (!tree) return
            tree.setParent(this.parent)
            tree.position = new Vector3(0, 0, -4 * i + 4)
            this.trees.push(tree)
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
        dialPuzzle.model.position = new Vector3(7.5, 0.5, 11.5)
        dialPuzzle.model.rotation = new Vector3(0, Math.PI / 4, 0)
        this.puzzles.push(dialPuzzle)
        

        // ** DOOR ***
        const door = Door(this.scene)
        door.setParent(this.parent)
        door.position = new Vector3(9.5, 0, 9.5)
        door.rotation = new Vector3(0, Math.PI / 4, 0)
        this.door = door
        
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
            if (debug) newBush.setEnabled(false)
        }
        bush.dispose()


        
        this.solved = false
    }
}
