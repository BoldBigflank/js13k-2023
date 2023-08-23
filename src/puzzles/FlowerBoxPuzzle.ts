import { InteractiveMesh } from '@/Types'
import { ColorMaterial, GridMaterial } from '@/core/textures'
import { zzfx } from 'zzfx'

const { TransformNode, Vector3 } = BABYLON

export class FlowerBoxPuzzle {
    // Puzzle Settings
    scene: BABYLON.Scene
    board: string[][] = [
        ["R", "Y"],
        ["B", "B"]
    ]
    selected = ""
    meshes: BABYLON.Mesh[] = []
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    colors: Record<string,string> = {
        "R": "#ff0000",
        "G": "#00aa00",
        "B": "#0000ff",
        "Y": "#ffff00"
    }
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

    cellAt(x: number, y: number) {
        try {
            return this.board[y][x]
        } catch {
            return null
        }
    }

    isSolved() {
        if (this.solved) return true
        let rulesBroken = false

        // RULE - Red cannot be next to Yellow
        this.board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== "R") return

                const adjCells = [
                    this.cellAt(x+1, y),
                    this.cellAt(x-1, y),
                    this.cellAt(x, y+1),
                    this.cellAt(x, y-1)
                ]
                if (adjCells.includes("Y")) {
                    rulesBroken = true
                }
            })
        })

        if (!rulesBroken) this.solved = true

        // Solved sfx
        if (this.solved) zzfx(...[2.07,0,130.81,.01,.26,.47,3,1.15,,.1,,,.05,,,,.14,.26,.15,.02]) // Music 112 - Mutation 2
        return this.solved
    }

    updateRender() {
        // 
    }

    createFlower(color: string) {
        const mesh = new BABYLON.Mesh("flower", this.scene) as InteractiveMesh
        mesh.onPointerPick = () => {
            console.log("CLICKED!")
        }
        // Stem
        const stem = BABYLON.MeshBuilder.CreateCylinder("stem", {
            height: 0.4,
            diameter: 0.1
        }, this.scene)
        stem.position = new Vector3(0, 0.2, 0)
        stem.setParent(mesh)
        stem.material = ColorMaterial("#00ff00", this.scene)
        // Leaf
        const leaf = BABYLON.MeshBuilder.CreateCylinder("leaf", {
            diameter: 0.3,
            height: 0.1
        }, this.scene)
        leaf.position = new Vector3(0.15, 0.15, 0)
        leaf.material = ColorMaterial("#00ff00", this.scene)
        leaf.setParent(mesh)
        // Head
        const head = BABYLON.MeshBuilder.CreateBox("head", {
            size: 0.4
        }, this.scene)
        head.position = new Vector3(0, 0.6, 0)
        head.material = ColorMaterial(this.colors[color], this.scene)
        head.setParent(mesh)
        return mesh
    }

    createBush() {
        const mesh = new BABYLON.Mesh("bush", this.scene) as InteractiveMesh
        // Head
        const head = BABYLON.MeshBuilder.CreateBox("head", {
            height: 0.2,
            width: 0.9,
            depth: 0.9
        }, this.scene)
        head.position = new Vector3(0, 0.1, 0)
        head.material = ColorMaterial(this.colors["G"], this.scene)
        head.setParent(mesh)
        return mesh
    }

    reset() {
        // Grid-based ground
        // Border around all flowers
        // Create models for all pieces
        this.meshes.forEach(mesh => {
            mesh.dispose()
        })
        this.selected = ""

        const boardHeight = this.board.length + 2
        const boardWidth = this.board[0].length + 2

        // Board
        const ground = BABYLON.MeshBuilder.CreateGround("flower-puzzle-ground", {
            width: boardWidth,
            height: boardHeight
        })
        ground.material = GridMaterial("#00aa00", "#006600", boardWidth, boardHeight, this.scene)
        ground.setParent(this.parent)
        // ground.position = new Vector3(-0.5 * boardWidth, 0.01, -0.5 * boardHeight)
        ground.position = Vector3.Zero()

        // Border it with 
        for (let y = 0; y < boardHeight; y++) {
            for (let x = 0; x < boardWidth; x++) {
                if (y > 0 && y < boardHeight - 1 &&
                    x > 0 && x < boardWidth - 1) continue
                const bush = this.createBush() 
                bush.position = new BABYLON.Vector3(x - 1.5, 0, y - 0.5)
            }
        }

        // Items
        this.board.forEach((row, y) => {
            row.forEach((column, x) => {
                let itemMesh
                switch (column) {
                case "": 
                    return
                case "R": // Flowers
                case "Y":
                case "B":
                    itemMesh = this.createFlower(column)
                    itemMesh.name = `cell${x}-${y}`
                    itemMesh.setParent(this.parent)
                    itemMesh.position = new Vector3(x - 0.5, 0, y - 0.5)
                    break
                default:
                    break
                }
            })
        })

        this.solved = false
    }
}
