import { castleMaterial } from '@/core/textures'
import { sample, jarHeads } from '@/core/Utils'
import { waterNME } from '@/shaders/waterNME'
import type { Jar, InteractiveMesh } from '@/Types'
import { zzfx } from 'zzfx'

const { TransformNode, Engine, Scene, MeshBuilder, HemisphericLight, FreeCamera, Vector3, PointerEventTypes, PointerInfo, StandardMaterial } = BABYLON

export class Castle {
    // Puzzle Settings
    scene: BABYLON.Scene
    // jars: Jar[] = []
    parent: BABYLON.TransformNode

    // Meta
    solved = false

    constructor(scene: BABYLON.Scene) {        
        this.scene = scene
        // Parent position
        this.parent = new TransformNode('Castle', this.scene)
        this.reset()
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    isSolved() {
        // if (this.solved) return true
        // this.solved = this.jars.every((jar, index) => {
        //     return jar.orientation === index
        // })
        // // Solved sfx
        // if (this.solved) zzfx(...[2.07,0,130.81,.01,.26,.47,3,1.15,,.1,,,.05,,,,.14,.26,.15,.02]) // Music 112 - Mutation 2
        return this.solved
    }

    reset() {
        // this.solved = false
        // this.jars = []

        // w, h, d, x, y, z
        const boxes = [
            [5,6,6,-11.5,3,5],
            [7,10,4,-5.5,5,4],
            [4,10,6,0,5,3],
            [9,6,6,1.5,3,-3],
            [9,5,4,10.5,2.5,-4],
            [3,2,8,13.5,1,2],
            [4,4,3,14,2,7.5],
            [5,3,3,18.5,1.5,7.5],
            [3,3,4,22.5,1.5,8],
            [2,2,3,25,1,7.5],
            [3,2,9,22.5,1,1.5],
            [9,2,3,19.5,1,-4.5],
            [8,4,2,-5,12,4], // Long top of the L
            [2, 4, 6, 0, 12, 3], // Short top of the L
            [12,6,4,6,3,7] // Back building NE of L

        ]

        boxes.forEach((boxData) => {
            const [width, height, depth, x, y, z] = boxData
            const wall = BABYLON.MeshBuilder.CreateBox("wall", {
                width,
                height,
                depth,
                wrap: true
            }, this.scene)
            wall.position = new Vector3(x, y , z)
            wall.material = castleMaterial(this.scene)
            wall.setParent(this.parent)
        })
    
        // x, y, z, diameter, height, coneHeight, 
        const turrets = [
            [-14,3.5,10, 4,7,5], // NW Big one
            [-14, 6, 2, 1, 2, 2], // SW Corner
            [-13.5, 6.5, 6, .5, 1.5, 0], // 3 stubby on the west block
            [-13.5, 6.5, 4, .5, 1.5, 0], // ^
            [-11.5, 6.5, 2.5, .5, 1.5, 0], // ^
            [-9,10,2  , 2,3,4   ], // 3 West side of the big L
            [-9,14,4  , 1,2,1   ],
            [-9,10,6  , 2,3,4   ],
            [-6.5, 11.5, 2.5, 1, 3, 3],
            [-3,5,2    , 4,10,0  ], // Main entrance cylinder
            [-2,12,3  , 2,3,1   ],
            [-2,10,0  , 2,3,4   ], // 3 South side of the big L
            [0, 14, 0  , 1, 2, 1 ], // ^
            [2,10,0  , 2,3,4   ],  // ^
            [-3, 6, -6, 1, 2, 1 ], // SW Garden corner
            [-2.5, 7, -3, .5, 2, 0], // 3 stubbies on SW Garden
            [0, 7, -5.5, .5, 2, 0],
            [3, 7, -5.5, .5, 2, 0],
            [6,3,-6, 4,6,4], // Big garden pillar
            [15,5,-6, 1, 2, 2], // Garden SE
            [21, 3, 10, 1, 2, 2], // NE building, NW corner
            [24, 1.5, 10, 2, 3, 3] // NE Corner
        ]


        turrets.forEach((turretData, i) => {
            const [x, y, z, diameter, height, coneHeight] = turretData
            const turret = BABYLON.MeshBuilder.CreateCylinder(`turret${i}`, {
                height,
                diameter
            }, this.scene)
            turret.position = new Vector3(x, y, z)
            turret.material = castleMaterial(this.scene)
            turret.setParent(this.parent)
            if (coneHeight) {
                const cone = BABYLON.MeshBuilder.CreateCylinder(`turret${i}`, {
                    height: coneHeight,
                    diameterBottom: diameter * 1.1,
                    diameterTop: 0
                }, this.scene)
                cone.position = new Vector3(x, y + 0.5 * (height + coneHeight), z)
                cone.setParent(this.parent)
            }
        })

        // Slanted roofs

        // Chimneys

    }
}