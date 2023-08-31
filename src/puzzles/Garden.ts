import { DirtMaterial } from '@/core/textures'
import { FlowerBoxPuzzle } from './FlowerBoxPuzzle'
const { TransformNode, Vector3 } = BABYLON

export class Garden {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    puzzles: FlowerBoxPuzzle[]
    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        this.puzzles = []
        // Parent position
        this.parent = new TransformNode('Garden', this.scene)
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
        return this.solved
    }

    reset() {
        const ground = BABYLON.MeshBuilder.CreateTiledGround("Garden-ground", {
            xmin: -18,
            xmax: 18,
            zmin: -6,
            zmax: 10,
            // precision: {
            //     h: 2,
            //     w: 2
            // },
            subdivisions: {
                h: 12,
                w: 24
            }
        }, this.scene)
        ground.material = DirtMaterial(this.scene)
        ground.setParent(this.parent)
        ground.position = new Vector3(0, 0.01, 0)

        
        const flowerBoxBoardOne = [
            ["R", "Y"],
            ["B", "B"]
        ]
    
        const flowerBoxPuzzle = new FlowerBoxPuzzle(flowerBoxBoardOne, this.scene)
        flowerBoxPuzzle.model.setParent(this.parent)
        flowerBoxPuzzle.position = new Vector3(-15, 0, 5)
        this.puzzles.push(flowerBoxPuzzle)

        const flowerBoxBoardTwo = [
            ["W", "B", "W"],
            ["B", "W", "W"],
            ["W", "B", "W"]
        ]

        const flowerBoxPuzzleTwo = new FlowerBoxPuzzle(flowerBoxBoardTwo, this.scene)
        flowerBoxPuzzleTwo.model.setParent(this.parent)
        flowerBoxPuzzleTwo.position = new Vector3(-9, 0, -1)
        this.puzzles.push(flowerBoxPuzzleTwo)
        
        this.solved = false
    }
}
