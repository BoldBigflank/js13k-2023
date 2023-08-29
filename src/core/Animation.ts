type AnimationTransform = {
    position?: BABYLON.Vector3
    rotation?: BABYLON.Vector3
    scaling?: BABYLON.Vector3
}

type Animating = {
    mesh: BABYLON.Mesh
    start: AnimationTransform
    end: AnimationTransform
    t: number
    duration: number
}

export class AnimationFactory {
    private static _instance: AnimationFactory
    private animations: Animating[]
    private scene: BABYLON.Scene|null

    private constructor() { 
        this.animations = []
        this.scene = null
    }
    
    public static get Instance(): AnimationFactory {
        if (!AnimationFactory._instance) {
            AnimationFactory._instance = new AnimationFactory()
        }
        return AnimationFactory._instance
    }

    public initScene(scene: BABYLON.Scene) {
        if (this.scene) return
        this.scene = scene
        this.scene.registerBeforeRender(() => {
            this.animations = this.animations.filter((animation) => {
                const t = animation.t + (this.scene?.deltaTime || 0)
                if (t >= animation.duration) {
                    if (animation.end.position) animation.mesh.position = animation.end.position
                    if (animation.end.rotation) animation.mesh.rotation = animation.end.rotation
                    if (animation.end.scaling) animation.mesh.scaling = animation.end.scaling
                } else {
                    if (animation.end.position) animation.mesh.position = BABYLON.Vector3.Lerp(
                        animation.start.position!,
                        animation.end.position, 
                        t / animation.duration
                    )
                    if (animation.end.rotation) animation.mesh.rotation = BABYLON.Vector3.Lerp(
                        animation.start.rotation!,
                        animation.end.rotation, 
                        t / animation.duration
                    )
                    if (animation.end.scaling) animation.mesh.scaling = BABYLON.Vector3.Lerp(
                        animation.start.scaling!,
                        animation.end.scaling, 
                        t / animation.duration
                    )
                }
                animation.t = t
                return {
                    ...animation,
                    t
                }
            })
            this.animations.filter((animation) => animation.t < animation.duration)
        })
    }

    public animateTransform(mesh: BABYLON.Mesh, end: AnimationTransform, duration: number) {
        this.animations.push({
            mesh, start: {
                position: mesh.position,
                rotation: mesh.rotation,
                scaling: mesh.scaling
            }, end, duration, t: 0
        })
    }
}
