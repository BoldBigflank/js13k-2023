export interface Tile {
    face: number
    slot: number
    mesh: InteractiveMesh
}

export interface InteractiveMesh extends BABYLON.Mesh {
    onPointerPick?: (pointerInfo: BABYLON.PointerInfo) => void
}