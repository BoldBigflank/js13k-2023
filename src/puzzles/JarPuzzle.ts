import { jarboxMaterial } from '@/core/textures'
import { sample, jarHeads } from '@/core/Utils'
import type { Jar, InteractiveMesh } from '@/Types'
import { zzfx } from 'zzfx'

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
        if (this.solved) return true
        jar.orientation = (jar.orientation + 1) % 4
        zzfx(...[,,651,.01,.02,0,1,2.52,,38,-34,.03,,,-31]); // Blip 77
        this.isSolved()
    }

    isSolved() {
        if (this.solved) return true
        this.solved = this.jars.every((jar, index) => {
            return jar.orientation === index
        })
        // Solved sfx
        if (this.solved) zzfx(...[2.07,0,130.81,.01,.26,.47,3,1.15,,.1,,,.05,,,,.14,.26,.15,.02]); // Music 112 - Mutation 2
        return this.solved
    }

    reset() {
        this.solved = false
        this.jars = []

        const box = MeshBuilder.CreateBox('jar', {
            size: 0.6
        }, this.scene)
        box.position = new Vector3(0, 0.3, 0)
        box.checkCollisions = true
        box.setParent(this.parent)
        box.material = jarboxMaterial(this.scene)

        jarHeads.forEach((symbol, i) => {
            
            const xPos = -0.15 + 0.3 * (i % 2)
            const zPos = 0.15 - 0.3 * (Math.floor(i / 2))
            
            const jar: Jar = {
                orientation: (i + Math.floor(Math.random() * 3) + 1) % 4, // Only 4 orientations
                mesh: MeshBuilder.CreateCapsule(`Jar${i}`, {
                    radius: 0.125,
                    height: 0.5
                }, this.scene) as InteractiveMesh
            }

            // Create a texture for it            
            const canvas = document.createElement('canvas')
            canvas.width = 512
            canvas.height = 512
            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('ctx missing')
            // ctx.fillStyle = 'red'
            // ctx.fillRect(0, 0, 320, 320)
            ctx.font = '320px Arial'
            ctx.fillStyle = 'black'
            ctx.textBaseline = 'top' 
            ctx.fillText(symbol, 0.5 * (canvas.width - ctx.measureText(symbol).width), 80)
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

            jar.mesh.position = new Vector3(xPos, 0.6, zPos)
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
