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
    selectedMesh: BABYLON.Mesh|null
    inventoryTransform: BABYLON.TransformNode
    meshes: BABYLON.Mesh[] = []
    // jars: Jar[] = []
    parent: BABYLON.TransformNode
    colors: Record<string,string> = {
        "R": "#ff0000",
        "G": "#00aa00",
        "B": "#0000ff",
        "Y": "#ffff00",
        "Br": "#6E260E" // Brown, patch of dirt
    }
    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        // Parent position
        this.parent = new TransformNode('Castle', this.scene)
        this.inventoryTransform = new TransformNode('Holding', this.scene)
        this.inventoryTransform.setParent(scene.activeCamera)
        this.inventoryTransform.position = new Vector3(-.5, 0, 2)
        this.selectedMesh = null
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

    cellAt(x: number, y: number, newValue?: string) {
        try {
            const value = this.board[y][x]
            if (newValue) this.board[y][x] = newValue
            return value
        } catch {
            return null
        }
    }

    isSolved() {
        if (this.solved) return true
        let rulesBroken = false

        // RULE - No flowers in hand
        if (this.selectedMesh && this.selectedMesh.metadata.color !== "Br"){
            console.log("Rule 1 broken")
            rulesBroken = true
        }

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
                    console.log("Rule 2 broken")
            
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

    swapMesh(pickedMesh: BABYLON.Mesh) {
        const pickedMeshMetadata = pickedMesh.metadata || {}
        const { x, y } = pickedMeshMetadata
        const selectedMeshColor = this.selectedMesh ? this.selectedMesh.metadata.color : ""
        // Move the selected mesh to the picked mesh's position
        this.cellAt(x, y, selectedMeshColor)
        if (this.selectedMesh) {
            // Update the metadata
            this.selectedMesh.metadata = {
                ...this.selectedMesh.metadata,
                picked: false,
                x,
                y
            }
            // Update the mesh
            this.placeFlower(this.selectedMesh)
            this.selectedMesh = null
        }
        // Assign the picked mesh to selectedMesh
        pickedMesh.metadata = {
            ...pickedMesh.metadata,
            picked: true
        }
        this.selectedMesh = pickedMesh
        this.placeFlower(this.selectedMesh)
        this.isSolved()
    }

    createFlower(color: string, x: number, y: number) {
        const mesh = new BABYLON.Mesh("flower", this.scene) as InteractiveMesh
        mesh.metadata = {
            color,
            x,
            y
        }
        mesh.onPointerPick = () => {
            if (this.solved) return
            this.swapMesh(mesh)
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
    createEmpty(x: number, y: number) {
        const mesh = new BABYLON.Mesh("empty", this.scene) as InteractiveMesh
        mesh.onPointerPick = () => {
            if (this.solved) return
            this.swapMesh(mesh)
        }
        mesh.metadata = {
            color: "Br",
            x,
            y
        }

        // Head
        const head = BABYLON.MeshBuilder.CreateBox("head", {
            height: 0.2,
            width: 0.4,
            depth: 0.4
        }, this.scene)
        head.position = new Vector3(0, 0.1, 0)
        head.material = ColorMaterial(this.colors["Br"], this.scene)
        head.setParent(mesh)
        return mesh
    }

    placeFlower(mesh: BABYLON.Mesh) {
        if (mesh.metadata.picked) {
            mesh.setParent(this.inventoryTransform)
            mesh.position = Vector3.Zero()
            mesh.rotation = Vector3.Zero()
            mesh.scaling = new Vector3(0.25, 0.25, 0.25)
            mesh.renderingGroupId = 1
            mesh.isPickable = false
            // "Br" cells are invisible in inventory
            mesh.setEnabled(mesh.metadata.color !== "Br")
            return
        }
        const { x, y } = mesh.metadata
        mesh.setParent(this.parent)
        mesh.position = new Vector3(x - 0.5, 0, y - 0.5)
        mesh.rotation = Vector3.Zero()
        mesh.scaling = Vector3.One()
        mesh.isPickable = true
        mesh.setEnabled(true)
        mesh.renderingGroupId = 0
    }

    reset() {
        // Grid-based ground
        // Border around all flowers
        // Create models for all pieces
        this.meshes.forEach(mesh => {
            mesh.dispose()
        })
        this.selectedMesh = null

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
                    itemMesh = this.createFlower(column, x, y)
                    itemMesh.name = `cell${x}-${y}`
                    this.placeFlower(itemMesh)
                    // itemMesh.setParent(this.parent)
                    // itemMesh.position = new Vector3(x - 0.5, 0, y - 0.5)
                    break
                case "Br":
                    itemMesh = this.createEmpty(x, y)
                    itemMesh.name = `cell${x}-${y}`
                    this.placeFlower(itemMesh)
                default:
                    break
                }
            })
        })

        // Inventory spot
        this.selectedMesh = this.createEmpty(-1, -1)
        this.selectedMesh.metadata = {
            ...this.selectedMesh.metadata,
            picked: true
        }
        this.placeFlower(this.selectedMesh)

        this.solved = false
    }
}
