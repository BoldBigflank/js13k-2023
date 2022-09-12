const { MeshBuilder } = BABYLON

export const sample = (group: any[]): any => {
    return group[Math.floor(Math.random() * group.length)]
}

// https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs
export const heiroglyphics = ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇', '𓀈', '𓀉', '𓀊', '𓀋', '𓀌', '𓀍', '𓀎', '𓀏']
