import { InteractiveMesh } from '@/Types'
import { AnimationFactory } from '@/core/Animation'
import { BLUE, BROWN, DARK_GREEN, GREEN, RED, WHITE, YELLOW } from '@/core/Colors'
import { PickupSFX, SolvedSFX } from '@/core/Sounds'
import { debug } from '@/core/Utils'
import { ColorMaterial, GridMaterial } from '@/core/textures'
import { InfoBillboard } from '@/meshes/InfoBillboard'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, Vector3 } = BABYLON

let pc = 0

const rules = {
    color: ["Red cannot be next to", "another Red"],
    count: ["Number of flowers must be one", "more or less than neighbor"],
    shape: ["Square must be placed", "in a square shape"]
}

type FlowerBoxOpts = {
    board: string[][],
    solvedEvent?: () => void
}

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
    messageBoard: InfoBillboard
    solvedEvent?: () => void
    colors: Record<string,string> = {
        "R": RED,
        "G": GREEN,
        "B": BLUE,
        "Y": YELLOW,
        "W": WHITE,
        "D": BROWN // Dirt, brown patch
    }
    // Meta
    solved = false

    constructor(opts: FlowerBoxOpts, scene: BABYLON.Scene) {        
        this.scene = scene
        this.board = opts.board
        this.solvedEvent = opts.solvedEvent
        
        this.boardHeight = this.board.length
        this.boardWidth = this.board[0].length

        // Parent position
        this.parent = new TransformNode('FlowerBoxPuzzle', this.scene)
        this.inventoryTransform = new TransformNode('Holding', this.scene)
        // this.inventoryTransform.setParent(scene.activeCamera)
        // this.inventoryTransform.position = new Vector3(-.5, 0, 2)
        const inventoryParent = scene.getNodeByName('inventory-parent')
        this.inventoryTransform.setParent(inventoryParent)
        this.inventoryTransform.position = Vector3.Zero()
        this.inventoryTransform.rotation = Vector3.Zero()
        this.selectedMesh = null

        // Message board
        this.messageBoard = new InfoBillboard(this.scene)
        this.messageBoard.setLines([])
        this.messageBoard.model.setParent(this.parent)
        this.messageBoard.model.position = new Vector3(0.5 * this.boardWidth, 0, 0.5)

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
        if (this.selectedMesh && this.selectedMesh.metadata.color !== "D"){
            this.messageBoard.setLines([]) // Not ready to share
            rulesBroken = true
        }
        if (rulesBroken) return

        let cubeCount = 0
        const cubePositions: { x: number, y: number }[] = []
        let cubeXMin = Number.MAX_SAFE_INTEGER
        let cubeXMax = -1
        let cubeYMin = Number.MAX_SAFE_INTEGER
        let cubeYMax = -1
        this.board.forEach((row, y) => {
            if (rulesBroken) return
            row.forEach((cell, x) => {
                if (rulesBroken) return
                const [count, color, shape] = cell.split("")
                // RULE Color - Red cannot be next to Yellow
                const adjCells = [
                    this.cellAt(x+1, y),
                    this.cellAt(x-1, y),
                    this.cellAt(x, y+1),
                    this.cellAt(x, y-1)
                ]
                if (color === "R") {
                    if (adjCells.some((cell) => cell?.split("")[1] === "R")) {
                        this.messageBoard.setLines(rules.color)
                        rulesBroken = true
                    }
                }

                if (rulesBroken) return

                if (parseInt(count) > 0) {
                    if (!adjCells.every((cell) => {
                        if (!cell) return true
                        const [adjCount, adjColor, adjShape] = cell?.split("")
                        if (parseInt(adjCount) === 0) return true
                        return (
                            parseInt(count) === parseInt(adjCount) - 1 
                            || parseInt(count) === parseInt(adjCount) + 1
                        )
                    })) {
                        this.messageBoard.setLines(rules.count)
                        rulesBroken = true
                    }
                }

                // RULE Cube flowers must be in a square pattern
                if (shape === "C") {
                    cubeCount += 1
                    cubeXMin = Math.min(cubeXMin, x)
                    cubeXMax = Math.max(cubeXMax, x)
                    cubeYMin = Math.min(cubeYMin, y)
                    cubeYMax = Math.max(cubeYMax, y)
                    cubePositions.push({x, y})
                }
            })
        })

        if (cubeCount > 0 && cubeCount < 4) {
            rulesBroken = true
        }
        if (!cubePositions.every((pos, i) => {
            return (pos.x === cubeXMin || pos.x === cubeXMax)
            && (pos.y === cubeYMin || pos.y === cubeYMax)
        })) {
            this.messageBoard.setLines(rules.shape)
            rulesBroken = true
        }

        if (!rulesBroken) this.solved = true

        // Solved sfx
        if (this.solved) {
            SolvedSFX()
            this.messageBoard.setLines(["COMPLETE"])
            if (this.solvedEvent) this.solvedEvent()
        }
        return this.solved
    }

    swapMesh(pickedMesh: BABYLON.Mesh) {
        const pickedMeshMetadata = pickedMesh.metadata || {}
        const { x, y } = pickedMeshMetadata
        const selectedMeshInfo = this.selectedMesh ? 
            `${this.selectedMesh.metadata.count}${this.selectedMesh.metadata.color}${this.selectedMesh.metadata.shape}`
            : ""
        // Move the selected mesh to the picked mesh's position
        this.cellAt(x, y, selectedMeshInfo)
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

    createFlower(count: number, color: string, shape: string, x: number, y: number) {
        const mesh = new BABYLON.Mesh("flower", this.scene) as InteractiveMesh
        mesh.metadata = {
            count,
            color,
            shape,
            x,
            y
        }
        mesh.onPointerPick = () => {
            PickupSFX()
            if (this.solved) return
            this.swapMesh(mesh)
        }
        
        for(let i = 0; i < count; i++) {
            // Stem
            const stem = BABYLON.MeshBuilder.CreateCylinder(`stem${++pc}`, {
                height: 0.4,
                diameter: 0.1
            }, this.scene)
            stem.setParent(mesh)
            stem.position.y = 0.2
            
            // Head
            let head: BABYLON.Mesh
            if (shape === "T") head = BABYLON.MeshBuilder.CreateCylinder(`head${++pc}`, {
                diameterBottom: 0,
                diameterTop: 0.4,
                height: 0.4,
                tessellation: 3
            }, this.scene)
            else if (shape === "S") head = BABYLON.MeshBuilder.CreateSphere(`head${++pc}`, {
                diameter: 0.3
            }, this.scene)
            else head = BABYLON.MeshBuilder.CreateBox(`head${++pc}`, {
                size: 0.25
            }, this.scene)

            head.setParent(stem) 
            head.position = new Vector3(0, 0.3, 0)
            head.material = ColorMaterial(this.colors[color], this.scene)

            stem.position = new Vector3(0, 0.2, 0)
            if (count > 1) stem.rotateAround(Vector3.Zero(), Vector3.Right(), Math.PI / 8) // Lean
            stem.rotateAround(Vector3.Zero(), Vector3.Up(), i * 2 * Math.PI / count) // Spin
            stem.material = ColorMaterial(GREEN, this.scene)
        }
        
        // Leaf
        const leaf = BABYLON.MeshBuilder.CreateCylinder("leaf", {
            diameter: 0.3,
            height: 0.1
        }, this.scene)
        leaf.setParent(mesh)
        leaf.position = new Vector3(.15, 0.15, 0)
        leaf.material = ColorMaterial(GREEN, this.scene)
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
            color1: GREEN,
            color2: DARK_GREEN,
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
            count: 1,
            color: "D",
            shape: "",
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
        head.material = ColorMaterial(this.colors["D"], this.scene)
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
            // "D" cells are invisible in inventory
            mesh.setEnabled(mesh.metadata.color !== "D")
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

        ground.material = GridMaterial(GREEN, DARK_GREEN, this.boardWidth, this.boardHeight, this.scene)
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
                const [count, color, shape] = column.split("")
                switch (color) {
                case "": 
                    return
                case "R": // Flowers
                case "Y":
                case "B":
                case "W":
                    itemMesh = this.createFlower(parseInt(count), color, shape, x, y)
                    itemMesh.name = `cell${x}-${y}`
                    this.placeFlower(itemMesh)
                    break
                case "E":
                    break // Do nothing
                    // itemMesh = this.createEmpty(x, y)
                    // itemMesh.name = `cell${x}-${y}`
                    // this.placeFlower(itemMesh)
                    // break
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
