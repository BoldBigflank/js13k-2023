import { sample } from '@/core/Utils'
import type { Tile, InteractiveMesh } from '@/Types'

const { TransformNode, Engine, Scene, MeshBuilder, HemisphericLight, FreeCamera, Vector3, PointerEventTypes, PointerInfo, StandardMaterial } = BABYLON

export class SlideTilePuzzle {
    // Puzzle Settings
    width = 3
    height =  3
    tileCount = 8
    openSlot = 8
    scene: BABYLON.Scene
    tiles: Tile[] = []
    parent: BABYLON.TransformNode

    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        // Parent position
        this.parent = new TransformNode('SlideTilePuzzle', this.scene)
        this.reset()
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    shuffle() {
        // Find valid neighboring slots
        const openSlot = this.openSlot
        if (openSlot === undefined) return
        // If not given a slot, shuffle

        const validSlots = [
            openSlot - this.width,
            openSlot + this.width,
            openSlot - 1,
            openSlot + 1
        ].filter((slot) => {
            return this.isValidSwap(openSlot, slot)
        })

        // Choose one, swap it
        const chosenSlot = sample(validSlots)
        const chosenTile = this.tiles.find((t) => t.slot === chosenSlot)
        if (!chosenTile) return
        this.openSlot = chosenTile.slot
        chosenTile.slot = openSlot
    }

    isValidSwap(slotA: number, slotB: number) {
        // Validate the slots themselves
        if (slotA < 0) return false
        if (slotA >= this.width * this.height) return false
        if (slotB < 0) return false
        if (slotB >= this.width * this.height) return false

        // either off by 1 or off by width
        const offset = 
        Math.abs(Math.floor(slotB / this.width) - Math.floor(slotA / this.width)) + // rows
        Math.abs(slotB - slotA) % this.width // cols
        if (offset === 1) return true
        return false
    }

    attemptMove(tile: Tile) {
        if (!this.isValidSwap(tile.slot, this.openSlot)) return
        const tempSlot = this.openSlot
        this.openSlot = tile.slot
        tile.slot = tempSlot
    }

    isSolved() {
        if (this.solved) return true
        this.solved = this.tiles.every((tile, index) => tile.slot === tile.face)
        return this.solved
    }

    reset() {
        this.solved = false
        this.tiles = []
        this.openSlot = this.width * this.height - 1

        // Create the tiles
        for (let i = 0; i < 8; i++) {
            const tile: Tile = {
                face: i,
                slot: i,
                mesh: MeshBuilder.CreateBox(`Tile${i}`, {size: 0.96, depth: 0.2}, this.scene) as InteractiveMesh
            }
            tile.mesh.checkCollisions = true
            tile.mesh.onPointerPick = (pointerInfo: BABYLON.PointerInfo) => {
                this.attemptMove(tile)
            }

            const canvas = document.createElement('canvas')
            canvas.width = 320
            canvas.height = 320
            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('ctx missing')
            // ctx.fillStyle = 'red'
            // ctx.fillRect(0, 0, 320, 320)
            ctx.font = '160px Arial'
            ctx.fillStyle = 'black'
            ctx.fillText(`${i}`, 80, 240)
            
            const decalMaterial = new StandardMaterial(`decalMat${i}`, this.scene)
            decalMaterial.diffuseTexture = BABYLON.Texture.LoadFromDataString(`canvasTexture${i}`, canvas.toDataURL(), this.scene)
            decalMaterial.diffuseTexture.hasAlpha = true
            decalMaterial.zOffset = -2
            
            const decal = MeshBuilder.CreateDecal('decal', tile.mesh, {
                position: tile.mesh.position,
                normal: Vector3.Backward(),
                size: Vector3.One().multiplyByFloats(0.9, 0.9, 0.2)
            })
            decal.material = decalMaterial
            decal.setParent(tile.mesh)

            tile.mesh.setParent(this.parent)
            tile.mesh.registerBeforeRender((m) => {
                tile.mesh.position.x = tile.slot % this.width - 0.5 * this.width + 0.5
                tile.mesh.position.y = -1 * Math.floor(tile.slot / this.width) + 0.5 * this.height - 0.5
            })
            this.tiles.push(tile)
        }
        // Shuffle all the tiles
        for (let i = 0; i < 100; i++) {
            this.shuffle()
        }
    }
}
