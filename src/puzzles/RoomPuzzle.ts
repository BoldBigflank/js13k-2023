import { sample, heiroglyphics } from '@/core/Utils'
import type { Tile, InteractiveMesh } from '@/Types'

const { TransformNode, Engine, Scene, MeshBuilder, HemisphericLight, FreeCamera, Vector3, PointerEventTypes, PointerInfo, StandardMaterial } = BABYLON
// https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs
// 𓃻 Baboon North
// 𓁢 Jackal East
// 𓁵 Human South
// 𓁛 Falcon West

export class RoomPuzzle {
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
        this.parent = new TransformNode('RoomPuzzle', this.scene)
        this.reset()
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
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

        // The drawing to put on the image
        const canvas = document.createElement('canvas')
        canvas.width = 320
        canvas.height = 320
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('ctx missing')
        // ctx.fillStyle = 'red'
        // ctx.fillRect(0, 0, 320, 320)
        ctx.font = '400px Arial'
        ctx.fillStyle = 'black'
        ctx.textBaseline = 'top' 
        ctx.fillText('𓂀', 10, -50)

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
            tile.mesh.onPointerPick = (pointerInfo: BABYLON.PointerInfo) => {
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
