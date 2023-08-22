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