import { BLACK } from '@/core/Colors'
import { CastleMaterial, ColorTextureMaterial, GravelMaterial } from '@/core/textures'
import { TexturedMeshNME } from '@/shaders/TexturedMeshNME'

const { TransformNode, Vector3 } = BABYLON

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

    get model() {
        return this.parent
    }

    set position(pos: BABYLON.Vector3) {
        this.parent.position = pos
    }

    set scale(s: BABYLON.Vector3) {
        this.parent.scaling = s
    }

    isSolved() {
        return this.solved
    }

    reset() {
        // this.solved = false
        // this.jars = []

        // x, y, z, w, h, d
        const boxes = [
            [-11.5,3,5      ,5, 6, 6],
            [-5.5,5,4       ,7, 10,4],
            [0,5,3          ,4, 10,6],
            [1.5,3,-3       ,9, 6, 6],
            [10.5,2.5,-4    ,9, 5, 4],
            [13.5,1,2       ,3, 2, 8],
            [14,2,7.5       ,4, 4, 3],
            [18.5,1.5,7.5   ,5, 3, 3],
            [22.5,1.5,8     ,3, 3, 4],
            [25,1,7.5       ,2, 2, 3],
            [22.5,1,1.5     ,3, 2, 9],
            [19.5,1,-4.5    ,9, 2, 3],
            [-5,12,4        ,8, 4, 2], // Long top of the L
            [0, 12, 3       ,2, 4, 6], // Short top of the L
            [6,3,7          ,12,6, 4] // Back building NE of L

        ]

        boxes.forEach((boxData, index) => {
            const [x, y, z, width, height, depth] = boxData
            const wall = BABYLON.MeshBuilder.CreateTiledBox(`castle-wall${index}`, {
                width,
                height,
                depth,
                 tileSize: 2,
                // wrap: true
            }, this.scene)
            wall.position = new Vector3(x, y , z)
            wall.material = CastleMaterial(true, 0.5, this.scene)
            wall.checkCollisions = true
            wall.setParent(this.parent)

            // Roof tile
            const roof = BABYLON.MeshBuilder.CreateTiledBox(`castle-roof${index}`, {
                width: width - 0.01,
                height: 0.3,
                depth: depth - 0.01,
                 tileSize: 2
                // wrap: true
            }, this.scene)
            roof.setParent(this.parent)
            roof.position = new Vector3(x, 0.5 * height + y + 0.15, z)
            roof.material = GravelMaterial(this.scene)
            // roof.checkCollisions = true

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
            turret.material = CastleMaterial(false, height / 4, this.scene)
            turret.checkCollisions = true
            turret.setParent(this.parent)
            if (coneHeight) {
                const cone = BABYLON.MeshBuilder.CreateCylinder(`turret${i}`, {
                    height: coneHeight,
                    diameterBottom: diameter * 1.1,
                    diameterTop: 0
                }, this.scene)
                cone.material = TexturedMeshNME({
                    color1: "#043132",
                    color2: BLACK,
                    scale: 40
                })
                cone.position = new Vector3(x, y + 0.5 * (height + coneHeight), z)
                cone.setParent(this.parent)
            }
        })

        // Slanted roofs

        // Chimneys

    }
}
