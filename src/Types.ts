export interface Jar {
    orientation: number
    mesh: InteractiveMesh
}

export interface Tile {
    face: number
    slot: number
    mesh: InteractiveMesh
}

export interface InteractiveMesh extends BABYLON.Mesh {
    onPointerPick?: () => void
}

export interface MeshOpts {
    baseColor?: BABYLON.Color4
    rippleColor?: BABYLON.Color4
    frozen?: boolean
}

export interface TexturedMeshOpts {
    color1?: string
    color2?: string
    scale?: number
}

export type AnimationTransform = {
    position?: BABYLON.Vector3
    rotation?: BABYLON.Vector3
    scaling?: BABYLON.Vector3
}

export interface AnimateTransformOpts {
    mesh: BABYLON.Mesh|BABYLON.TransformNode
    end: AnimationTransform
    duration: number
    delay?: number
}