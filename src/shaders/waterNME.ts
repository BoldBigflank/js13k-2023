// Taken from https://nme.babylonjs.com/#9YQCNE#3
import { MeshOpts } from "@/Types"
const waterNME = function(opts: MeshOpts) {
    const baseColorValue = opts.baseColor ? BABYLON.Color4.FromHexString(`${opts.baseColor}FF`) : BABYLON.Color4.FromHexString("#243DA6FF")
    const rippleColorValue = opts.rippleColor ? BABYLON.Color4.FromHexString(`${opts.rippleColor}FF`) : BABYLON.Color4.FromHexString("#0AD6E0FF")
    const frozen = opts.frozen || false

    const nodeMaterial = new BABYLON.NodeMaterial('node')

    // InputBlock
    const position = new BABYLON.InputBlock('position')
    position.visibleInInspector = false
    position.visibleOnFrame = false
    position.target = 1
    position.setAsAttribute('position')

    // TransformBlock
    const WorldPos = new BABYLON.TransformBlock('WorldPos')
    WorldPos.visibleInInspector = false
    WorldPos.visibleOnFrame = false
    WorldPos.target = 1
    WorldPos.complementZ = 0
    WorldPos.complementW = 1

    // InputBlock
    const World = new BABYLON.InputBlock('World')
    World.visibleInInspector = false
    World.visibleOnFrame = false
    World.target = 1
    World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World)

    // TransformBlock
    const WorldPosViewProjectionTransform = new BABYLON.TransformBlock('WorldPos * ViewProjectionTransform')
    WorldPosViewProjectionTransform.visibleInInspector = false
    WorldPosViewProjectionTransform.visibleOnFrame = false
    WorldPosViewProjectionTransform.target = 1
    WorldPosViewProjectionTransform.complementZ = 0
    WorldPosViewProjectionTransform.complementW = 1

    // InputBlock
    const ViewProjection = new BABYLON.InputBlock('ViewProjection')
    ViewProjection.visibleInInspector = false
    ViewProjection.visibleOnFrame = false
    ViewProjection.target = 1
    ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection)

    // VertexOutputBlock
    const VertexOutput = new BABYLON.VertexOutputBlock('VertexOutput')
    VertexOutput.visibleInInspector = false
    VertexOutput.visibleOnFrame = false
    VertexOutput.target = 1

    // InputBlock
    const TwirlCenter = new BABYLON.InputBlock('TwirlCenter')
    TwirlCenter.visibleInInspector = false
    TwirlCenter.visibleOnFrame = false
    TwirlCenter.target = 1
    TwirlCenter.value = new BABYLON.Vector2(0.5, 0.5)
    TwirlCenter.isConstant = false

    // VectorSplitterBlock
    const VectorSplitter = new BABYLON.VectorSplitterBlock('VectorSplitter')
    VectorSplitter.visibleInInspector = false
    VectorSplitter.visibleOnFrame = false
    VectorSplitter.target = 4

    // AddBlock
    const Add = new BABYLON.AddBlock('Add')
    Add.visibleInInspector = false
    Add.visibleOnFrame = false
    Add.target = 1

    // VectorMergerBlock
    const VectorMerger = new BABYLON.VectorMergerBlock('VectorMerger')
    VectorMerger.visibleInInspector = false
    VectorMerger.visibleOnFrame = false
    VectorMerger.target = 1
    VectorMerger.xSwizzle = 'x'
    VectorMerger.ySwizzle = 'y'
    VectorMerger.zSwizzle = 'z'
    VectorMerger.wSwizzle = 'w'

    // SubtractBlock
    const Subtractx = new BABYLON.SubtractBlock('Subtract (x)')
    Subtractx.visibleInInspector = false
    Subtractx.visibleOnFrame = false
    Subtractx.target = 1

    // MultiplyBlock
    const Multiply = new BABYLON.MultiplyBlock('Multiply')
    Multiply.visibleInInspector = false
    Multiply.visibleOnFrame = false
    Multiply.target = 1

    // TrigonometryBlock
    const Cos = new BABYLON.TrigonometryBlock('Cos')
    Cos.visibleInInspector = false
    Cos.visibleOnFrame = false
    Cos.target = 4
    Cos.operation = BABYLON.TrigonometryBlockOperations.Cos

    // MultiplyBlock
    const StrengthxDeltaLergth = new BABYLON.MultiplyBlock('Strength x Delta Lergth')
    StrengthxDeltaLergth.visibleInInspector = false
    StrengthxDeltaLergth.visibleOnFrame = false
    StrengthxDeltaLergth.target = 1

    // InputBlock
    const TwirlStrength = new BABYLON.InputBlock('TwirlStrength')
    TwirlStrength.visibleInInspector = false
    TwirlStrength.visibleOnFrame = false
    TwirlStrength.target = 1
    TwirlStrength.value = 2
    TwirlStrength.min = 0
    TwirlStrength.max = 0
    TwirlStrength.isBoolean = false
    TwirlStrength.matrixMode = 0
    TwirlStrength.animationType = BABYLON.AnimatedInputBlockTypes.None
    TwirlStrength.isConstant = false

    // LengthBlock
    const DeltaLength = new BABYLON.LengthBlock('Delta (Length)')
    DeltaLength.visibleInInspector = false
    DeltaLength.visibleOnFrame = false
    DeltaLength.target = 1

    // SubtractBlock
    const DeltaSubtract = new BABYLON.SubtractBlock('Delta (Subtract)')
    DeltaSubtract.visibleInInspector = false
    DeltaSubtract.visibleOnFrame = false
    DeltaSubtract.target = 1

    // InputBlock
    const uv = new BABYLON.InputBlock('uv')
    uv.visibleInInspector = false
    uv.visibleOnFrame = false
    uv.target = 1
    uv.setAsAttribute('uv')

    // VectorSplitterBlock
    const VectorSplitter1 = new BABYLON.VectorSplitterBlock('VectorSplitter')
    VectorSplitter1.visibleInInspector = false
    VectorSplitter1.visibleOnFrame = false
    VectorSplitter1.target = 1

    // MultiplyBlock
    const Multiply1 = new BABYLON.MultiplyBlock('Multiply')
    Multiply1.visibleInInspector = false
    Multiply1.visibleOnFrame = false
    Multiply1.target = 1

    // TrigonometryBlock
    const Sin = new BABYLON.TrigonometryBlock('Sin')
    Sin.visibleInInspector = false
    Sin.visibleOnFrame = false
    Sin.target = 1
    Sin.operation = BABYLON.TrigonometryBlockOperations.Sin

    // AddBlock
    const Addy = new BABYLON.AddBlock('Add (y)')
    Addy.visibleInInspector = false
    Addy.visibleOnFrame = false
    Addy.target = 1

    // MultiplyBlock
    const Multiply2 = new BABYLON.MultiplyBlock('Multiply')
    Multiply2.visibleInInspector = false
    Multiply2.visibleOnFrame = false
    Multiply2.target = 1

    // TrigonometryBlock
    const Cos1 = new BABYLON.TrigonometryBlock('Cos')
    Cos1.visibleInInspector = false
    Cos1.visibleOnFrame = false
    Cos1.target = 1
    Cos1.operation = BABYLON.TrigonometryBlockOperations.Cos

    // MultiplyBlock
    const Multiply3 = new BABYLON.MultiplyBlock('Multiply')
    Multiply3.visibleInInspector = false
    Multiply3.visibleOnFrame = false
    Multiply3.target = 1

    // TrigonometryBlock
    const Sin1 = new BABYLON.TrigonometryBlock('Sin')
    Sin1.visibleInInspector = false
    Sin1.visibleOnFrame = false
    Sin1.target = 4
    Sin1.operation = BABYLON.TrigonometryBlockOperations.Sin

    // VoronoiNoiseBlock
    const VoronoiNoise = new BABYLON.VoronoiNoiseBlock('VoronoiNoise')
    VoronoiNoise.visibleInInspector = false
    VoronoiNoise.visibleOnFrame = false
    VoronoiNoise.target = 4

    // AddBlock
    const Add1 = new BABYLON.AddBlock('Add')
    Add1.visibleInInspector = false
    Add1.visibleOnFrame = false
    Add1.target = 4

    // InputBlock
    const Time = new BABYLON.InputBlock('Time')
    Time.visibleInInspector = false
    Time.visibleOnFrame = false
    Time.target = 1
    Time.value = 0
    Time.min = 0
    Time.max = 0
    Time.isBoolean = false
    Time.matrixMode = 0
    Time.animationType = (!frozen) ? BABYLON.AnimatedInputBlockTypes.Time : BABYLON.AnimatedInputBlockTypes.None
    Time.isConstant = frozen

    // InputBlock
    const Offset = new BABYLON.InputBlock('Offset')
    Offset.visibleInInspector = false
    Offset.visibleOnFrame = false
    Offset.target = 1
    Offset.value = 666
    Offset.min = 0
    Offset.max = 0
    Offset.isBoolean = false
    Offset.matrixMode = 0
    Offset.animationType = BABYLON.AnimatedInputBlockTypes.None
    Offset.isConstant = true

    // InputBlock
    const Scale = new BABYLON.InputBlock('Scale')
    Scale.visibleInInspector = false
    Scale.visibleOnFrame = false
    Scale.target = 1
    Scale.value = 12
    Scale.min = 0
    Scale.max = 0
    Scale.isBoolean = false
    Scale.matrixMode = 0
    Scale.animationType = BABYLON.AnimatedInputBlockTypes.None
    Scale.isConstant = false

    // ColorMergerBlock
    const ColorMerger = new BABYLON.ColorMergerBlock('ColorMerger')
    ColorMerger.visibleInInspector = false
    ColorMerger.visibleOnFrame = false
    ColorMerger.target = 4
    ColorMerger.rSwizzle = 'r'
    ColorMerger.gSwizzle = 'g'
    ColorMerger.bSwizzle = 'b'
    ColorMerger.aSwizzle = 'a'

    // InputBlock
    const ColorAlpha = new BABYLON.InputBlock('ColorAlpha')
    ColorAlpha.visibleInInspector = false
    ColorAlpha.visibleOnFrame = false
    ColorAlpha.target = 1
    ColorAlpha.value = 1
    ColorAlpha.min = 0
    ColorAlpha.max = 0
    ColorAlpha.isBoolean = false
    ColorAlpha.matrixMode = 0
    ColorAlpha.animationType = BABYLON.AnimatedInputBlockTypes.None
    ColorAlpha.isConstant = true

    // MultiplyBlock
    const Multiply4 = new BABYLON.MultiplyBlock('Multiply')
    Multiply4.visibleInInspector = false
    Multiply4.visibleOnFrame = false
    Multiply4.target = 4

    // InputBlock
    const RippleColor = new BABYLON.InputBlock('RippleColor')
    RippleColor.visibleInInspector = false
    RippleColor.visibleOnFrame = false
    RippleColor.target = 1
    RippleColor.value = rippleColorValue
    RippleColor.isConstant = false

    // MaxBlock
    const Max = new BABYLON.MaxBlock('Max')
    Max.visibleInInspector = false
    Max.visibleOnFrame = false
    Max.target = 4

    // InputBlock
    const BaseColor = new BABYLON.InputBlock('BaseColor')
    BaseColor.visibleInInspector = false
    BaseColor.visibleOnFrame = false
    BaseColor.target = 1
    BaseColor.value = baseColorValue
    BaseColor.isConstant = false

    // FragmentOutputBlock
    const FragmentOutput = new BABYLON.FragmentOutputBlock('FragmentOutput')
    FragmentOutput.visibleInInspector = false
    FragmentOutput.visibleOnFrame = false
    FragmentOutput.target = 2
    FragmentOutput.convertToGammaSpace = false
    FragmentOutput.convertToLinearSpace = false
    FragmentOutput.useLogarithmicDepth = false

    // InputBlock
    const Opacity = new BABYLON.InputBlock('Opacity')
    Opacity.visibleInInspector = false
    Opacity.visibleOnFrame = false
    Opacity.target = 1
    Opacity.value = 1
    Opacity.min = 0
    Opacity.max = 0
    Opacity.isBoolean = false
    Opacity.matrixMode = 0
    Opacity.animationType = BABYLON.AnimatedInputBlockTypes.None
    Opacity.isConstant = false

    // Connections
    position.output.connectTo(WorldPos.vector)
    World.output.connectTo(WorldPos.transform)
    WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector)
    ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform)
    WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector)
    TwirlCenter.output.connectTo(VectorSplitter.xyIn)
    VectorSplitter.xyOut.connectTo(Add.left)
    TwirlStrength.output.connectTo(StrengthxDeltaLergth.left)
    uv.output.connectTo(DeltaSubtract.left)
    VectorSplitter.xyOut.connectTo(DeltaSubtract.right)
    DeltaSubtract.output.connectTo(DeltaLength.value)
    DeltaLength.output.connectTo(StrengthxDeltaLergth.right)
    StrengthxDeltaLergth.output.connectTo(Cos.input)
    Cos.output.connectTo(Multiply.left)
    DeltaSubtract.output.connectTo(VectorSplitter1.xyIn)
    VectorSplitter1.x.connectTo(Multiply.right)
    Multiply.output.connectTo(Subtractx.left)
    StrengthxDeltaLergth.output.connectTo(Sin1.input)
    Sin1.output.connectTo(Multiply3.left)
    VectorSplitter1.y.connectTo(Multiply3.right)
    Multiply3.output.connectTo(Subtractx.right)
    Subtractx.output.connectTo(VectorMerger.x)
    VectorSplitter1.x.connectTo(Multiply1.left)
    StrengthxDeltaLergth.output.connectTo(Sin.input)
    Sin.output.connectTo(Multiply1.right)
    Multiply1.output.connectTo(Addy.left)
    StrengthxDeltaLergth.output.connectTo(Cos1.input)
    Cos1.output.connectTo(Multiply2.left)
    VectorSplitter1.y.connectTo(Multiply2.right)
    Multiply2.output.connectTo(Addy.right)
    Addy.output.connectTo(VectorMerger.y)
    VectorMerger.xy.connectTo(Add.right)
    Add.output.connectTo(VoronoiNoise.seed)
    Time.output.connectTo(Add1.left)
    Offset.output.connectTo(Add1.right)
    Add1.output.connectTo(VoronoiNoise.offset)
    Scale.output.connectTo(VoronoiNoise.density)
    VoronoiNoise.output.connectTo(ColorMerger.r)
    VoronoiNoise.output.connectTo(ColorMerger.g)
    VoronoiNoise.output.connectTo(ColorMerger.b)
    ColorAlpha.output.connectTo(ColorMerger.a)
    ColorMerger.rgba.connectTo(Multiply4.left)
    RippleColor.output.connectTo(Multiply4.right)
    Multiply4.output.connectTo(Max.left)
    BaseColor.output.connectTo(Max.right)
    Max.output.connectTo(FragmentOutput.rgba)
    Opacity.output.connectTo(FragmentOutput.a)

    // Output nodes
    nodeMaterial.addOutputNode(VertexOutput)
    nodeMaterial.addOutputNode(FragmentOutput)
    nodeMaterial.build()
    return nodeMaterial
}

export { waterNME }
