import { InteractiveMesh } from '@/Types'
import { AnimationFactory } from '@/core/Animation'
import { debug } from '@/core/Utils'
import { ColorMaterial, GridMaterial } from '@/core/textures'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'
import { zzfx } from 'zzfx'

const { TransformNode, Vector3 } = BABYLON

export class FlowerBoxPuzzle {
    // Puzzle Settings
    scene: BABYLON.Scene
    board: string[][]
    boardHeight: number
    boardWidth: number
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
        "W": "#ffffff",
        "Br": "#6E260E" // Brown, patch of dirt
    }
    // Meta
    solved = false

    constructor(board: string[][], scene: BABYLON.Scene) {        
        this.scene = scene
        this.board = board
        
        this.boardHeight = this.board.length
        this.boardWidth = this.board[0].length

        // Parent position
        this.parent = new TransformNode('FlowerBoxPuzzle', this.scene)
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

    boardPos(x: number, y: number) {
        const xPos = 1.0 * x + 0.5
        const yPos = -1 * y - 0.5
        return new Vector3(xPos, 0, yPos)
    }

    groupedCellCount(startX: number, startY: number) {
        const queue = [`${startX},${startY}`]
        const match = this.cellAt(startX, startY)
        let result = 0
        for (let i = 0; i < queue.length; i++) {
            const [xString, yString] = queue[i].split(',')
            const x = parseInt(xString)
            const y = parseInt(yString)
            if (this.cellAt(x, y) === match) {
                result += 1
                const adjCells = [
                    `${x+1},${y}`,
                    `${x-1},${y}`,
                    `${x},${y+1}`,
                    `${x},${y-1}`
                ]
                queue.push(...adjCells.filter((coord) => !queue.includes(coord)))
            }
        }
        return result
    }

    isSolved() {
        if (this.solved) return true
        let rulesBroken = false

        // RULE - No flowers in hand
        if (this.selectedMesh && this.selectedMesh.metadata.color !== "Br"){
            if (debug) console.log("Rule 1 broken")
            rulesBroken = true
        }

        this.board.forEach((row, y) => {
            row.forEach((cell, x) => {
                // RULE - Red cannot be next to Yellow
                if (cell === "R") {
                    const adjCells = [
                        this.cellAt(x+1, y),
                        this.cellAt(x-1, y),
                        this.cellAt(x, y+1),
                        this.cellAt(x, y-1)
                    ]
                    if (adjCells.includes("Y")) {
                        if (debug) console.log("Rule 2 broken")
                        rulesBroken = true
                    }
                }

                if (cell === "W") {
                    // Check each adjacent tile for another white
                    // For each found one, check that for adj
                    if (this.groupedCellCount(x, y) !== 3) {
                        if (debug) console.log("Rule 3 broken")
                        rulesBroken = true
                    }
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
        stem.setParent(mesh)
        stem.position = new Vector3(0, 0.2, 0)
        stem.material = ColorMaterial("#00ff00", this.scene)
        // Leaf
        const leaf = BABYLON.MeshBuilder.CreateCylinder("leaf", {
            diameter: 0.3,
            height: 0.1
        }, this.scene)
        leaf.setParent(mesh)
        leaf.position = new Vector3(.15, 0.15, 0)
        leaf.material = ColorMaterial("#00ff00", this.scene)
        // Head
        const head = BABYLON.MeshBuilder.CreateBox("head", {
            size: 0.4
        }, this.scene)
        head.setParent(mesh)
        head.position = new Vector3(0, 0.6, 0)
        head.material = ColorMaterial(this.colors[color], this.scene)
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
        head.setParent(mesh)
        head.position = new Vector3(0, 0.1, 0)
        // head.material = ColorTextureMaterial(this.colors["G"], this.scene)
        head.material = TexturedMeshNME({
            color1: "#00aa00",
            color2: "#006600",
            scale: 100
        })
        
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
        head.setParent(mesh)
        head.position = new Vector3(0, 0.1, 0)
        head.material = ColorMaterial(this.colors["Br"], this.scene)
        return mesh
    }

    placeFlower(mesh: BABYLON.Mesh) {
        if (mesh.metadata.picked) {
            mesh.setParent(this.inventoryTransform)
            AnimationFactory.Instance.animateTransform({
                mesh, end: {
                    position: Vector3.Zero(),
                    rotation: Vector3.Zero(),
                    scaling: new Vector3(0.25, 0.25, 0.25)
                }, 
                duration: 200
            })
            mesh.renderingGroupId = 1
            mesh.isPickable = false
            // "Br" cells are invisible in inventory
            mesh.setEnabled(mesh.metadata.color !== "Br")
            return
        }
        const { x, y } = mesh.metadata
        mesh.setParent(this.parent)
        AnimationFactory.Instance.animateTransform({
            mesh, 
            end: {
                position: this.boardPos(x, y),
                rotation: Vector3.Zero(),
                scaling: Vector3.One()
            }, duration: 200
        })
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

        // Board
        const ground = BABYLON.MeshBuilder.CreateGround("flower-puzzle-ground", {
            width: this.boardWidth,
            height: this.boardHeight
        })
        ground.material = GridMaterial("#00aa00", "#006600", this.boardWidth, this.boardHeight, this.scene)
        ground.setParent(this.parent)
        ground.position = new Vector3(0.5 * this.boardWidth, 0.02, -0.5 * this.boardHeight)
        // ground.position = Vector3.Zero()

        // Border it with 
        for (let y = -1; y < this.boardHeight + 1; y++) {
            for (let x = -1; x < this.boardWidth + 1; x++) {
                if (y >= 0 && y < this.boardHeight &&
                    x >= 0 && x < this.boardWidth) continue
                const bush = this.createBush()
                bush.setParent(this.parent)
                bush.name = `bush${x},${y}`
                bush.position = this.boardPos(x, y)
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
                case "W":
                    itemMesh = this.createFlower(column, x, y)
                    itemMesh.name = `cell${x}-${y}`
                    this.placeFlower(itemMesh)
                    break
                case "Br":
                    itemMesh = this.createEmpty(x, y)
                    itemMesh.name = `cell${x}-${y}`
                    this.placeFlower(itemMesh)
                    break
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
