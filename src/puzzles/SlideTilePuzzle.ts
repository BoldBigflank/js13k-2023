import { sample, heiroglyphics } from '@/core/Utils'
import type { Tile, InteractiveMesh } from '@/Types'
import { zzfx } from 'zzfx'
import { CursorMaterial } from '@/core/textures'

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
        if (this.solved) return
        if (!this.isValidSwap(tile.slot, this.openSlot)) return
        const tempSlot = this.openSlot
        this.openSlot = tile.slot
        tile.slot = tempSlot
        zzfx(...[,,76,.02,.02,.01,1,.44,,,,,,.5,,,,,.01,.57]); // Blip 60
        this.isSolved()
    }

    isSolved() {
        if (this.solved) return true
        this.solved = this.tiles.every((tile, index) => tile.slot === tile.face)
        // Solved sfx
        if (this.solved) zzfx(...[2.07,0,130.81,.01,.26,.47,3,1.15,,.1,,,.05,,,,.14,.26,.15,.02]); // Music 112 - Mutation 2
        return this.solved
    }

    reset() {
        this.solved = false
        this.tiles = []
        this.openSlot = this.width * this.height - 1

        // First, a simple coffin box
        const coffin = MeshBuilder.CreateBox('coffin', {
            width: 2.33,
            height: 1,
            depth: 0.8
        }, this.scene)
        coffin.position = new Vector3(0, 0.5, 0)
        coffin.checkCollisions = true
        coffin.setParent(this.parent)
        coffin.material = CursorMaterial(this.scene)

        // Put a mummy decal on it
        const mummyCanvas = document.createElement('canvas')
        mummyCanvas.width = 320
        mummyCanvas.height = 320
        const mummyCtx = mummyCanvas.getContext('2d')
        if (!mummyCtx) throw new Error('ctx missing')
        mummyCtx.font = '260px emoji'
        mummyCtx.fillStyle = 'black'
        mummyCtx.textBaseline = 'top'
        const mummyTextWidth = mummyCtx.measureText('𓀾').width
        mummyCtx.fillText('𓀾', 0.5 * (320 - mummyTextWidth), 60)
        const decalMaterial = new StandardMaterial(`mummyMat`, this.scene)
        decalMaterial.diffuseTexture = BABYLON.Texture.LoadFromDataString(`mummyTexture`, mummyCanvas.toDataURL(), this.scene)
        decalMaterial.diffuseTexture.hasAlpha = true
        decalMaterial.zOffset = -2

        const decal = MeshBuilder.CreateDecal('decal', coffin, {
            position: new Vector3(0, 1, 0),
            normal: Vector3.Up(),
            size: new Vector3(-2.92, 2.92, 0.2)
        })
        decal.material = decalMaterial
        decal.setParent(coffin)
        decal.isPickable = false

        // The drawing to put on the image
        const canvas = document.createElement('canvas')
        canvas.width = 320
        canvas.height = 320
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('ctx missing')
        ctx.fillStyle = '#009e69'
        ctx.arc(160, 160, 140, 0, 2 * Math.PI)
        ctx.fill()
        ctx.font = '320px emoji'
        ctx.fillStyle = 'black'
        ctx.textBaseline = 'top'
        const textWidth = ctx.measureText('𓆣').width
        ctx.fillText('𓆣', 0.5 * (320 - textWidth), 0)

        // Create something to hold the tiles in position
        const puzzleTransform = new TransformNode('SlideTilePuzzle', this.scene)
        puzzleTransform.setParent(this.parent)
        // Create the tiles
        for (let i = 0; i < 8; i++) {
            const tile: Tile = {
                face: i,
                slot: i,
                mesh: MeshBuilder.CreateBox(`Tile${i}`, {size: 0.96, depth: 0.2}, this.scene) as InteractiveMesh
            }
            const xPos = i % this.width - 0.5 * this.width + 0.5
            const yPos = -1 * Math.floor(tile.slot / this.width) + 0.5 * this.height - 0.5
            tile.mesh.checkCollisions = true
            tile.mesh.onPointerPick = () => {
                this.attemptMove(tile)
            }

            const decalMaterial = new StandardMaterial(`decalMat${i}`, this.scene)
            decalMaterial.diffuseTexture = BABYLON.Texture.LoadFromDataString(`canvasTexture${i}`, canvas.toDataURL(), this.scene)
            decalMaterial.diffuseTexture.hasAlpha = true
            decalMaterial.zOffset = -2
            
            const decal = MeshBuilder.CreateDecal('decal', tile.mesh, {
                position: new Vector3(-1 * xPos, -1 * yPos, 0),
                normal: Vector3.Backward(),
                size: new Vector3(-2.92, 2.92, 0.2)
            })
            decal.material = decalMaterial
            decal.setParent(tile.mesh)
            decal.isPickable = false

            tile.mesh.setParent(puzzleTransform)
            tile.mesh.registerBeforeRender((m) => {
                tile.mesh.position.x = tile.slot % this.width - 0.5 * this.width + 0.5
                tile.mesh.position.y = -1 * Math.floor(tile.slot / this.width) + 0.5 * this.height - 0.5
            })
            this.tiles.push(tile)
        }

        // Orient the tiles over the coffin
        // puzzleTransform.rotate(Vector3.Right(), Math.PI / 2) // Face up
        // puzzleTransform.rotate(Vector3.Up(), Math.PI / 2) // Head left
        puzzleTransform.rotation = new Vector3(Math.PI / 2, Math.PI * 3 / 2, 0)
        puzzleTransform.position = new Vector3(0, 1, 0)
        puzzleTransform.scaling = new Vector3(0.25, 0.25, 0.25)

        // Shuffle all the tiles
        for (let i = 0; i < 100; i++) {
            this.shuffle()
        }
    }
}
