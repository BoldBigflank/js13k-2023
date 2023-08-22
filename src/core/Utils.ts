export const sample = (group: any[]): any => {
    return group[Math.floor(Math.random() * group.length)]
}

export const shuffle = (group: any[]): any[] => {
    // TODO: Fisher yates shuffle
    for (let i = group.length - 1; i > 1; i--) {
        let j = Math.floor(Math.random() * i)
        const temp = group[i]
        group[i] = group[j]
        group[j] = temp
    }
    return group
}

// https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs
// eslint-disable-next-line max-len
export const heiroglyphics = ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇', '𓀈', '𓀉', '𓀊', '𓀋', '𓀌', '𓀍', '𓀎', '𓀏', '𓃒', '𓃓', '𓃔', '𓃕', '𓃖', '𓃗', '𓃘', '𓃙', '𓃚', '𓃛', '𓃜', '𓃝', '𓃞', '𓃟', '𓃠', '𓃡', '𓃢', '𓃣', '𓃤', '𓃥', '𓃦', '𓃧', '𓃨', '𓃩', '𓃪', '𓃫', '𓃬', '𓃭', '𓃮', '𓃯', '𓃰', '𓃱', '𓃲', '𓃳', '𓃴', '𓃵', '𓃶', '𓃷', '𓃸', '𓃹', '𓃺', '𓃻', '𓃼', '𓃽', '𓆓', '𓍢', '𓍣', '𓍤', '𓍥', '𓍦', '𓍧', '𓍨', '𓍩', '𓍪', '𓐑', '𓐒', '𓐓', '𓐔', '𓐕', '𓋴', '𓆦', '𓆄', '𓆃', '𓆙', '𓅓']

export const jarHeads = ['𓃻', '𓁢', '𓁵', '𓁛']

export const loremIpsum = (length: number) => {
    let result = ''
    for(let i = 0; i < length; i++) {
        result += heiroglyphics[Math.floor(Math.random() * heiroglyphics.length)]
    }
    return result
}

export const initCanvas = (size = 512): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    return [canvas, ctx]
}
