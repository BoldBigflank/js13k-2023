import { DirtMaterial } from '@/core/textures'
import { FlowerBoxPuzzle } from './FlowerBoxPuzzle'
import { waterNME } from '@/shaders/waterNME'
import { Engine, Scene } from 'babylonjs'
const { TransformNode, Vector3, MeshBuilder } = BABYLON

export class Garden {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    floors: BABYLON.Mesh[]
    puzzles: FlowerBoxPuzzle[]
    // Meta
    solved = false
    solvedCount = 0

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
        this.solvedCount = 0
        for (let i = 0; i < this.puzzles.length; i++) {
            if (this.puzzles[i].solved)
                this.solvedCount += 1
        }
        this.solved = this.puzzles.length > 0 && this.solvedCount === this.puzzles.length
        // For each puzzle, spin the sculpture on a new axis
        // When all puzzles are solved, show a portal to the end

        return this.solved
    }

    reset() {
        this.floors = []
        // *** GROUND ***
        const ground = MeshBuilder.CreateTiledGround("Garden-ground", {
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

        // *** Water feature
        const fountainWall = MeshBuilder.CreateTorus('fountain-edge', {
            diameter: 4,
            thickness: 1,
            tessellation: 32
        }, this.scene)
        fountainWall.setParent(this.parent)
        const water = MeshBuilder.CreateCylinder('fountain-water', {
            diameter: 4,
            height: 1,
            tessellation: 32
        }, )
        water.material = waterNME({})
        water.checkCollisions = true
        water.setParent(this.parent)

        const statue = MeshBuilder.CreateTorusKnot('fountain-statue', {
            tube: 0.1,
            radialSegments: 128,
            p: 5,
            q: 2
        }, this.scene)
        statue.setParent(this.parent)
        const center =  new Vector3(0, 1.5, 0)
        statue.position = center
        statue.rotation.x = Math.PI / 2
        statue.scaling = new Vector3(0.5, 0.5, 1.5)
        statue.registerBeforeRender((mesh) => {
            if (this.solvedCount > 0) {
                mesh.rotateAround(center, Vector3.Up(), Math.PI / 1700 * this.scene.getEngine().getDeltaTime())
            }
            if (this.solvedCount > 1) {
                mesh.rotateAround(center, Vector3.Right(), Math.PI / 800 * this.scene.getEngine().getDeltaTime())
            }
            if (this.solvedCount > 2) {
                mesh.rotateAround(center, Vector3.Forward(), Math.PI / 500 * this.scene.getEngine().getDeltaTime())
            }
        })

        // *** Flower Box Puzzles ***

        const flowerBoxBoards = [ // count{123}, Color{RYBWED}, shape{CST}
            [ // Color - Red cannot be adjacent to itself
                ["1RT", "1RT"],
                ["2BT", "2BT"]
            ],
            [ // Shape - Squares must be four corners
                ["0ET", "1BS", "0ET", "0ET", "1BS"],
                ["2RC", "0ET", "1BS", "2RC", "0ET"],
                ["0ET", "1BS", "0ET", "0ET", "0ET"],
                ["2RC", "0ET", "2RC", "0ET", "1BS"],
                ["0ET", "1BS", "0ET", "0ET", "0ET"]
            ],
            [ // Count - The number must be within 1 of adj
                ["3YT"],
                ["1YT"],
                ["1YT"],
                ["2YT"],
                ["2YT"]
            ],
            [ // All three rules together
                ["0ET", "0ET", "3BS", "0ET", "0ET"],
                ["0ET", "2RS", "3BC", "3BS", "0ET"],
                ["2RC", "2BS", "1RC", "3BC", "1BS"],
                ["0ET", "1RS", "3BS", "1BC", "0ET"],
                ["0ET", "0ET", "2BS", "0ET", "0ET"]
            ]
        ]

        const flowerBoxPositions = [
            new Vector3(-15, 0, 6),
            new Vector3(-9, 0, 2),
            new Vector3(4, 0, 2),
            new Vector3(9, 0, 5)
        ]
        
        for (let i = 0; i < flowerBoxBoards.length; i++) {
            const board = flowerBoxBoards[i]
            const position = flowerBoxPositions[i]
            const puzzle = new FlowerBoxPuzzle({
                board,
                solvedEvent: () => {
                    this.isSolved()
                }
            }, this.scene)
            puzzle.model.setParent(this.parent)
            puzzle.position = position
            this.puzzles.push(puzzle)
        }

        this.solved = false
    }
}
