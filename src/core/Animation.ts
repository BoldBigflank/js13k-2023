type AnimationType = "position"|"scaling"|"rotation"

type Animating = {
    mesh: BABYLON.Mesh
    type: AnimationType
    start: BABYLON.Vector3
    end: BABYLON.Vector3
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
                    animation.mesh.position = animation.end
                } else {
                    animation.mesh.position = BABYLON.Vector3.Lerp(
                        animation.start,
                        animation.end, 
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

    public animatePosition(mesh: BABYLON.Mesh, type: AnimationType, end: BABYLON.Vector3, duration: number) {
        this.animations.push({
            mesh, type, start: mesh.position.clone(), end: end, duration, t: 0
        })
    }
}
