declare namespace NodeJS {
    interface Global {
        GUI:GUIclass,//需要在global上自己挂一下
    }
}

interface map {
    type: string, //组件类型
    layout: elementsLayout, //组件的布局和属性
    child?: map[], //子组件数组
}

interface standardReturn<T> {
    (visual: RoomVisual, box: box<T>): {
        componentName: string,
        allowChild?: boolean,
    },
}

interface GUIclass {
    draw: (visual: RoomVisual, map: map[]) => void,
    drawMap: (visual: RoomVisual, map: map[], x: number, y: number) => void,
    [name: string]: standardReturnelementsLayout|((visual: RoomVisual, map: map[], x: number, y: number) => void)|((visual: RoomVisual, map: map[]) => void),
    Div: standardReturn<Div>,
    Text: standardReturn<Text>,
    Progress: standardReturn<Progress>,
    SwitchBar: standardReturn<SwitchBar>,
    LockTarget: standardReturn<LockTarget>,
}

type elementsLayout = Div | Text | Progress | SwitchBar | LockTarget;
type elementsLayoutGeneral = Div & Text & Progress & SwitchBar & LockTarget;
type standardReturnelementsLayout = standardReturn<Div> | standardReturn<Text> | standardReturn<Progress>

interface BoxConstructor<T extends elementsLayout> {
    x: number,
    y: number,
    layout: T,
}

interface box<T> {
    x: number,
    y: number,
    layout: T,
}

interface baseElementLayout {
    visibility?: boolean,
    x: number,
    y: number,
}
//下面是每个组件的Layout接口定义

interface Div extends baseElementLayout {
    width: number,
    height: number,
    background?: string,
    opacity?: number,
    stroke?: string,
    fill?: string,
}

interface Text extends baseElementLayout {
    background: string,
    font: number,
    align: "left" | "center" | "right" | undefined,
    stroke: string,
    content: string,
    backgroundPadding: number,
}

interface Progress extends baseElementLayout {
    borderColor: string,
    progressColor: string,
    height: number,
    width: number,
    value: number,
}

interface SwitchBar extends baseElementLayout {}

interface LockTarget extends baseElementLayout {}

