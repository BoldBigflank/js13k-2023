import { sample } from '@/core/Utils'
import type { Tile, InteractiveMesh } from '@/Types'

export class SlideTilePuzzle {
    // Puzzle Settings
    width = 3
    height =  3
    tileCount = 8
    openSlot: number = 8
    scene: BABYLON.Scene
    tiles: Tile[] = []
    parent: BABYLON.TransformNode

    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        // Parent position
        this.parent = new BABYLON.TransformNode('SlideTilePuzzle', this.scene)
        this.reset()
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
        if (0 > slotA) return false
        if (slotA >= this.width * this.height) return false
        if (0 > slotB) return false
        if (slotB >= this.width * this.height) return false

        // either off by 1 or off by width
        if (Math.abs(slotB - slotA) === 1) return true
        if (Math.abs(slotB - slotA) === this.width) return true
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
                mesh: BABYLON.MeshBuilder.CreateBox(`Tile${i}`, {size: 0.96, depth: 0.2}, this.scene) as InteractiveMesh
            }
            tile.mesh.onPointerPick = (pointerInfo: BABYLON.PointerInfo) => {
                this.attemptMove(tile)
            }
            tile.mesh.setParent(this.parent)
            tile.mesh.registerBeforeRender((m) => {
                tile.mesh.position.x = tile.slot % this.width - 0.5 * this.width
                tile.mesh.position.y = -1 * Math.floor(tile.slot / this.width) + 0.5 * this.height
            })
            this.tiles.push(tile)
        }
        // Shuffle all the tiles
        for (let i = 0; i < 100; i++) {
            this.shuffle()
        }
    }
}
