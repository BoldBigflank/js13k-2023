import { DirtMaterial } from '@/core/textures'
import { FlowerBoxPuzzle } from './FlowerBoxPuzzle'
const { TransformNode, Vector3 } = BABYLON

export class Garden {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    floors: BABYLON.Mesh[]
    puzzles: FlowerBoxPuzzle[]
    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        this.puzzles = []
        this.floors = []
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
        this.floors = []
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
        this.floors.push(ground)

        const flowerBoxBoards = [ // count{123}, Color{RYBWED}, shape{CST}
            [ // Color - Red and yellow cannot be adjacent
                ["1RT", "1YT"],
                ["2BT", "2BT"]
            ],
            [ // Shape - Squares must be four corners
                ["0ET", "1WS", "0ET", "0ET", "1WS"],
                ["2RC", "0ET", "1WS", "2RC", "0ET"],
                ["0ET", "1WS", "0ET", "0ET", "0ET"],
                ["2RC", "0ET", "2RC", "0ET", "1WS"],
                ["0ET", "1WS", "0ET", "0ET", "0ET"]
            ],
            [ // The number must be within 1 of adj
                ["3RT"],
                ["1RT"],
                ["1RT"],
                ["2RT"],
                ["2RT"]
            ],
            [ // All three rules together
                ["1EC", "1EC", "1RC", "1EC", "1EC"],
                ["1EC", "1RC", "1RC", "1RC", "1EC"],
                ["1RC", "1RC", "1RC", "1RC", "1RC"],
                ["1EC", "1RC", "1RC", "1RC", "1EC"],
                ["1EC", "1EC", "1RC", "1EC", "1EC"]
            ]
        ]

        const flowerBoxPositions = [
            new Vector3(-15, 0, 6),
            new Vector3(-9, 0, 2),
            new Vector3(3, 0, 2),
            new Vector3(8, 0, 5)
        ]
        
        for (let i = 0; i < flowerBoxBoards.length; i++) {
            const board = flowerBoxBoards[i]
            const position = flowerBoxPositions[i]
            const puzzle = new FlowerBoxPuzzle(board, this.scene)
            puzzle.model.setParent(this.parent)
            puzzle.position = position
            this.puzzles.push(puzzle)
        }

        this.solved = false
    }
}
