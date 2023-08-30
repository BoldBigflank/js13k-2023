// Taken from https://nme.babylonjs.com/#Z5R20X
import { TexturedMeshOpts } from "@/Types"
const TexturedMeshNME = function(opts: TexturedMeshOpts) {
    const color1 = BABYLON.Color3.FromHexString(opts.color1 || "#ff0000")
    const color2 = BABYLON.Color3.FromHexString(opts.color2 || "#0000ff")
    const scaleValue = opts.scale || 1
    const nodeMaterial = new BABYLON.NodeMaterial("node")
    nodeMaterial.mode = BABYLON.NodeMaterialModes.Material

    // InputBlock
    const position = new BABYLON.InputBlock("position")
    position.visibleInInspector = false
    position.visibleOnFrame = false
    position.target = 1
    position.setAsAttribute("position")

    // TransformBlock
    const WorldPos = new BABYLON.TransformBlock("WorldPos")
    WorldPos.visibleInInspector = false
    WorldPos.visibleOnFrame = false
    WorldPos.target = 1
    WorldPos.complementZ = 0
    WorldPos.complementW = 1

    // InputBlock
    const World = new BABYLON.InputBlock("World")
    World.visibleInInspector = false
    World.visibleOnFrame = false
    World.target = 1
    World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World)

    // TransformBlock
    const Worldnormal = new BABYLON.TransformBlock("World normal")
    Worldnormal.visibleInInspector = false
    Worldnormal.visibleOnFrame = false
    Worldnormal.target = 1
    Worldnormal.complementZ = 0
    Worldnormal.complementW = 0

    // InputBlock
    const normal = new BABYLON.InputBlock("normal")
    normal.visibleInInspector = false
    normal.visibleOnFrame = false
    normal.target = 1
    normal.setAsAttribute("normal")

    // LightBlock
    const Lights = new BABYLON.LightBlock("Lights")
    Lights.visibleInInspector = false
    Lights.visibleOnFrame = false
    Lights.target = 3

    // InputBlock
    const cameraPosition = new BABYLON.InputBlock("cameraPosition")
    cameraPosition.visibleInInspector = false
    cameraPosition.visibleOnFrame = false
    cameraPosition.target = 1
    cameraPosition.setAsSystemValue(BABYLON.NodeMaterialSystemValues.CameraPosition)

    // MultiplyBlock
    const Multiply = new BABYLON.MultiplyBlock("Multiply")
    Multiply.visibleInInspector = false
    Multiply.visibleOnFrame = false
    Multiply.target = 4

    // GradientBlock
    const Gradient = new BABYLON.GradientBlock("Gradient")
    Gradient.visibleInInspector = false
    Gradient.visibleOnFrame = false
    Gradient.target = 4
    Gradient.colorSteps = []
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0, color1))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(1, color2))

    // SimplexPerlin3DBlock
    const SimplexPerlinD = new BABYLON.SimplexPerlin3DBlock("SimplexPerlin3D")
    SimplexPerlinD.visibleInInspector = false
    SimplexPerlinD.visibleOnFrame = false
    SimplexPerlinD.target = 4

    // ScaleBlock
    const Scale = new BABYLON.ScaleBlock("Scale")
    Scale.visibleInInspector = false
    Scale.visibleOnFrame = false
    Scale.target = 4

    // InputBlock
    const Scale1 = new BABYLON.InputBlock("Scale")
    Scale1.visibleInInspector = false
    Scale1.visibleOnFrame = false
    Scale1.target = 1
    Scale1.value = scaleValue
    Scale1.min = 0
    Scale1.max = 0
    Scale1.isBoolean = false
    Scale1.matrixMode = 0
    Scale1.animationType = BABYLON.AnimatedInputBlockTypes.None
    Scale1.isConstant = true

    // FragmentOutputBlock
    const FragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput")
    FragmentOutput.visibleInInspector = false
    FragmentOutput.visibleOnFrame = false
    FragmentOutput.target = 2
    FragmentOutput.convertToGammaSpace = false
    FragmentOutput.convertToLinearSpace = false
    FragmentOutput.useLogarithmicDepth = false

    // TransformBlock
    const WorldPosViewProjectionTransform = new BABYLON.TransformBlock("WorldPos * ViewProjectionTransform")
    WorldPosViewProjectionTransform.visibleInInspector = false
    WorldPosViewProjectionTransform.visibleOnFrame = false
    WorldPosViewProjectionTransform.target = 1
    WorldPosViewProjectionTransform.complementZ = 0
    WorldPosViewProjectionTransform.complementW = 1

    // InputBlock
    const ViewProjection = new BABYLON.InputBlock("ViewProjection")
    ViewProjection.visibleInInspector = false
    ViewProjection.visibleOnFrame = false
    ViewProjection.target = 1
    ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection)

    // VertexOutputBlock
    const VertexOutput = new BABYLON.VertexOutputBlock("VertexOutput")
    VertexOutput.visibleInInspector = false
    VertexOutput.visibleOnFrame = false
    VertexOutput.target = 1

    // Connections
    position.output.connectTo(WorldPos.vector)
    World.output.connectTo(WorldPos.transform)
    WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector)
    ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform)
    WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector)
    WorldPos.output.connectTo(Lights.worldPosition)
    normal.output.connectTo(Worldnormal.vector)
    World.output.connectTo(Worldnormal.transform)
    Worldnormal.output.connectTo(Lights.worldNormal)
    cameraPosition.output.connectTo(Lights.cameraPosition)
    Lights.diffuseOutput.connectTo(Multiply.left)
    WorldPos.xyz.connectTo(Scale.input)
    Scale1.output.connectTo(Scale.factor)
    Scale.output.connectTo(SimplexPerlinD.seed)
    SimplexPerlinD.output.connectTo(Gradient.gradient)
    Gradient.output.connectTo(Multiply.right)
    Multiply.output.connectTo(FragmentOutput.rgb)

    // Output nodes
    nodeMaterial.addOutputNode(VertexOutput)
    nodeMaterial.addOutputNode(FragmentOutput)
    nodeMaterial.build()
    return nodeMaterial
}

export { TexturedMeshNME }