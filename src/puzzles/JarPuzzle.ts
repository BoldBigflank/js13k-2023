import { sample, heiroglyphics } from '@/core/Utils'
import type { Jar, InteractiveMesh } from '@/Types'

const { TransformNode, Engine, Scene, MeshBuilder, HemisphericLight, FreeCamera, Vector3, PointerEventTypes, PointerInfo, StandardMaterial } = BABYLON
// https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs
// 𓃻 Baboon North
// 𓁢 Jackal East
// 𓁵 Human South
// 𓁛 Falcon West

export class JarPuzzle {
    // Puzzle Settings
    scene: BABYLON.Scene
    jars: Jar[] = []
    parent: BABYLON.TransformNode

    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        // Parent position
        this.parent = new TransformNode('JarPuzzle', this.scene)
        this.reset()
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    attemptMove(jar: Jar) {
        jar.orientation = (jar.orientation + 1) % 4
    }

    isSolved() {
        if (this.solved) return true
        this.solved = this.jars.every((jar, index) => jar.orientation === index)
        return this.solved
    }

    reset() {
        this.solved = false
        this.jars = []

        const symbols = ['𓃻', '𓁢', '𓁵', '𓁛']
        symbols.forEach((symbol, i) => {
            
            const xPos = -2 + 1 * i
            
            const jar: Jar = {
                orientation: (i + Math.floor(Math.random() * 3) + 1) % 4, // Only 4 orientations
                mesh: MeshBuilder.CreateCapsule(`Jar${i}`, {}, this.scene) as InteractiveMesh
            }

            // Create a texture for it            
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
            ctx.fillText(symbols[i], 0.5 * (canvas.width - ctx.measureText(symbols[i]).width), -10)
            const decalMaterial = new StandardMaterial(`jarDecalMat${i}`, this.scene)
            decalMaterial.diffuseTexture = BABYLON.Texture.LoadFromDataString(`jarCanvasTexture${i}`, canvas.toDataURL(), this.scene)
            decalMaterial.diffuseTexture.hasAlpha = true
            decalMaterial.zOffset = -2
            
            const decal = MeshBuilder.CreateDecal(`jardecal${i}`, jar.mesh, {
                position: new Vector3(0, 0, 0),
                normal: Vector3.Backward(),
                size: new Vector3(0.5, 0.5, 0.5)
            })
            decal.material = decalMaterial
            decal.setParent(jar.mesh)
            decal.isPickable = false

            jar.mesh.position.x = xPos
            jar.mesh.setParent(this.parent)
            jar.mesh.checkCollisions = true
            jar.mesh.onPointerPick = (pointerInfo: BABYLON.PointerInfo) => {
                this.attemptMove(jar)
            }
            jar.mesh.registerBeforeRender((m) => {
                jar.mesh.rotation.y = Math.PI / 2 * jar.orientation
            })
            this.jars.push(jar)
        })
    }
}
