import { InteractiveMesh } from "@/Types"
import { AnimationFactory } from "@/core/Animation"
import { ColorMaterial, DialMaterial } from "@/core/textures"
import { zzfx } from 'zzfx'


type DialPuzzleOpts = {
    alphabet?: string
    code?: string
}

const { TransformNode, Vector3 } = BABYLON

export class DialPuzzle {
    scene: BABYLON.Scene
    alphabet: string[]
    code: string[]
    guess: string[]
    dials: BABYLON.Mesh[]

    parent: BABYLON.TransformNode
    solved = false

    constructor(opts: DialPuzzleOpts, scene: BABYLON.Scene) {
        this.scene = scene
        
        this.alphabet = opts.alphabet?.split("") || Array.from("0123456789")
        this.code = opts.code?.split("") || Array.from("123")
        this.guess = Array.from(this.alphabet[0].repeat(this.code.length))
        
        this.parent = new TransformNode('DialPuzzle', this.scene)
        this.parent.position = Vector3.Zero()
        this.dials = []
        this.reset()
    }
    
    get model() {
        return this.parent
    }

    set scale(s: BABYLON.Vector3) {
        this.parent.scaling = s
    }

    updateDials = () => {
        this.dials.forEach((dial) => {
            const guessIndex = parseInt(dial.metadata.alphabetIndex, 10)

            const letterDelta = 2 * Math.PI / this.alphabet.length
            const yRot = 0.5 * Math.PI // Quarter turn
            + 0.5 * letterDelta // Rotate to the middle
            + guessIndex * letterDelta // Show the correct index
            AnimationFactory.Instance.animateTransform({
                mesh: dial,
                end: {
                    rotation: new Vector3(0, yRot, 0)
                },
                duration: 60
            })
        })
    }

    isSolved() {
        if (this.solved) return true

        this.solved = this.code.every((char, index) => this.guess[index] === char )

        if (this.solved) {
            // Success SFX

        }
        if (this.solved) zzfx(...[2.07,0,130.81,.01,.26,.47,3,1.15,,.1,,,.05,,,,.14,.26,.15,.02]) // Music 112 - Mutation 2
        return this.solved
    }

    reset() {
        this.solved = false
        this.dials = []
        const codeLength = this.code.length
        for (let i = 0; i < codeLength; i++) {
            
            const faceUV = []
            faceUV[0] =	new BABYLON.Vector4(0, 0, 0, 0)
            faceUV[1] =	new BABYLON.Vector4(1, 0, 0, 1) // x, z swapped to flip image
            faceUV[2] = new BABYLON.Vector4(0, 0, 0, 0)
            
            const dial = BABYLON.MeshBuilder.CreateCylinder(`dial-${i}`, {
                height: 0.25,
                diameter: 1,
                faceUV,
                tessellation: this.alphabet.length
            }, this.scene) as InteractiveMesh
            dial.onPointerPick = () => {
                if (this.solved) return
                const { index, alphabetIndex } = dial.metadata
                const newAlphabetIndex = alphabetIndex + 1
                dial.metadata = {
                    index: i,
                    alphabetIndex: newAlphabetIndex
                }
                this.guess[index] = this.alphabet[newAlphabetIndex % this.alphabet.length]
                this.updateDials()
                this.isSolved()
            }
            dial.setParent(this.parent)
            dial.position = new Vector3(0, (codeLength - i - 1) * 0.30 + 0.15, 0)
            dial.material = DialMaterial(this.alphabet, this.scene)
            dial.metadata = { index: i, alphabetIndex: 0 }
            this.dials.push(dial)
        }

        const dialAlign = BABYLON.MeshBuilder.CreateBox('dial-align', {
            height: 0.3 * (codeLength + 1),
            width: 0.2,
            depth: 0.2
        })
        dialAlign.setParent(this.parent)
        dialAlign.position = new Vector3(0, codeLength * 0.15, -0.36)
        dialAlign.material = ColorMaterial("#ffff00", this.scene)
        
        this.updateDials()
    }
}