import { AnimationTransform, AnimateTransformOpts } from "@/Types"
import { Clamp } from "./Utils"

type Animating = {
    mesh: BABYLON.Mesh|BABYLON.TransformNode
    start: AnimationTransform
    end: AnimationTransform
    easeFunc: BABYLON.EasingFunction
    startTime: number
    endTime: number
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
            const now = Date.now()
            this.animations = this.animations.filter((animation) => {
                const msElapsed = now - animation.startTime
                const duration = animation.endTime - animation.startTime
                const lerpAmount = Clamp(msElapsed / duration, 0, 1)
                // It's over
                if (now >= animation.endTime) {
                    if (animation.end.position) animation.mesh.position = animation.end.position
                    if (animation.end.rotation) animation.mesh.rotation = animation.end.rotation
                    if (animation.end.scaling) animation.mesh.scaling = animation.end.scaling
                    return false
                }

                if (animation.end.position) animation.mesh.position = BABYLON.Vector3.Lerp(
                    animation.start.position!,
                    animation.end.position, 
                    animation.easeFunc.ease(lerpAmount)
                )
                if (animation.end.rotation) animation.mesh.rotation = BABYLON.Vector3.Lerp(
                    animation.start.rotation!,
                    animation.end.rotation, 
                    animation.easeFunc.ease(lerpAmount)
                )
                if (animation.end.scaling) animation.mesh.scaling = BABYLON.Vector3.Lerp(
                    animation.start.scaling!,
                    animation.end.scaling, 
                    animation.easeFunc.ease(lerpAmount)
                )
                return true
            })
        })
    }

    public animateTransform(opts: AnimateTransformOpts) {
        const { mesh, end } = opts
        const duration = opts.duration || 1000
        const delay = opts.delay || 0
        const ease = opts.ease || new BABYLON.QuadraticEase()
        const now = Date.now()

        this.animations.push({
            mesh, 
            start: {
                position: mesh.position,
                rotation: mesh.rotation,
                scaling: mesh.scaling
            },
            end,
            easeFunc: ease,
            startTime: now + delay,
            endTime: now + delay + duration
        })
    }
}
