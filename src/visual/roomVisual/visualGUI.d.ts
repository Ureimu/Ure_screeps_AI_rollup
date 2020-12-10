type elementsConstant = "Div" | "Text" | "Progress" | "SwitchBar" | "LockTarget";
type elementsLayout = Div | Text | Progress | SwitchBar | LockTarget;
type elementsLayoutGeneral = Div & Text & Progress & SwitchBar & LockTarget;
type standardReturnElementsLayout = standardReturn<Div> | standardReturn<Text> | standardReturn<Progress>;
type getType<T> = T extends "Div"
    ? Div
    : T extends "Text"
    ? Text
    : T extends "Progress"
    ? Progress
    : T extends "SwitchBar"
    ? SwitchBar
    : T extends "LockTarget"
    ? LockTarget
    : null;

type setType<T> = T extends Div
    ? "Div"
    : T extends Text
    ? "Text"
    : T extends Progress
    ? "Progress"
    : T extends SwitchBar
    ? "SwitchBar"
    : T extends LockTarget
    ? "LockTarget"
    : null;

interface baseLayout {
    /**
     * 组件是否可见。
     *
     * @type {boolean}
     * @memberof baseLayout
     */
    visibility?: boolean;

    /**
     * 组件的横轴坐标。
     *
     * @type {number}
     * @memberof baseLayout
     */
    x: number;

    /**
     * 组件的纵轴坐标。
     *
     * @type {number}
     * @memberof baseLayout
     */
    y: number;
}

interface map<T extends elementsConstant> {
    /**
     * 组件类型名称。
     *```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     * @type {T extends elementsConstant}
     * @memberof map
     */
    type: T; // 组件类型

    /**
     * 组件的布局和属性。
     *
     * @type {elementsLayout}
     * @memberof map
     */
    layout: getType<T>;

    /**
     * 子组件数组。
     *
     * @type {map<elementsConstant>[]}
     * @memberof map
     */
    child?: this[]; // 子组件数组
}

interface standardReturn<T> {
    (visual: RoomVisual, box: box<T>): {
        /**
         * 组件类型名称。
         *
         * @type {string}
         */
        componentName: string;

        /**
         * 是否允许挂载子组件。
         *
         * @type {boolean}
         */
        allowChild?: boolean;
    };
}

interface GUIclass {
    /**
     * 基本GUI渲染函数，供用户调用。
     *
     * @memberof GUIclass
     */
    draw: <T extends elementsConstant>(visual: RoomVisual, map: map<T>[]) => RoomVisual;

    /**
     * 迭代循环布局结构。
     *
     * @memberof GUIclass
     */
    drawMap: <T extends elementsConstant>(visual: RoomVisual, map: map<T>[], x: number, y: number) => RoomVisual;

    [name: string]:
        | standardReturnElementsLayout
        | ((visual: RoomVisual, map: map<elementsConstant>[], x: number, y: number) => void)
        | ((visual: RoomVisual, map: map<elementsConstant>[]) => void);

    /**
     * 在下方定义组件的layout接口，您可以仿造示例来创建自己的自定义组件。
     */

    /**
     * 容器组件，用于内置其他组件。
     *
     * @type {standardReturn<Div>}
     * @memberof GUIclass
     */
    Div: standardReturn<Div>;

    /**
     * 文本组件，显示文本。
     *
     * @type {standardReturn<Text>}
     * @memberof GUIclass
     */
    Text: standardReturn<Text>;

    /**
     * 进度条，显示进度
     * 可用属性：
     * width：进度条宽度
     * height:进度条高度
     * value:进度值0~100
     * background:进度条背景颜色
     * progressColor:进度条颜色
     * borderColor:进度条边框颜色
     * visibility:是否可见
     *
     * @type {standardReturn<Progress>}
     * @memberof GUIclass
     */
    Progress: standardReturn<Progress>;

    /**
     * 开关条组件，展示项目是否开启
     * 可用属性：
     * state:开关状态(true/false)
     * height:开关高度
     * width:开关宽度
     *
     * @type {standardReturn<Progress>}
     * @memberof GUIclass
     */
    SwitchBar: standardReturn<SwitchBar>;

    /**
     *
     *
     * @type {standardReturn<LockTarget>}
     * @memberof GUIclass
     */
    LockTarget: standardReturn<LockTarget>;
}

interface BoxConstructor<T extends elementsLayout> {
    x: number;
    y: number;
    layout: T;
}

interface box<T> {
    x: number;
    y: number;
    layout: T;
}

// 下面是每个组件的Layout接口定义

/**
 * 容器组件，用于内置其他组件
 *
 * @interface Div
 * @extends {layout}
 */
interface Div extends baseLayout {
    /**
     * 容器宽度
     *
     * @type {number}
     * @memberof Div
     */
    width: number;

    /**
     * 容器高度
     *
     * @type {number}
     * @memberof Div
     */
    height: number;

    /**
     * 背景颜色
     *
     * @type {string}
     * @memberof Div
     */
    background?: string;

    /**
     * 透明度，0.0~1.0,1.0为不透明
     *
     * @type {number}
     * @memberof Div
     */
    opacity?: number;

    /**
     * 边框颜色，十六进制颜色代码#AARRGGBB
     *
     * @type {string}
     * @memberof Div
     */
    stroke?: string;

    /**
     * 填充颜色，十六进制颜色代码#AARRGGBB
     *
     * @type {string}
     * @memberof Div
     */
    fill?: string;
}

/**
 * 文本组件，显示文本
 *
 * @interface Text
 * @extends {layout}
 */
interface Text extends baseLayout {
    /**
     * 背景颜色，允许使用任何 web 格式颜色，默认未定义（没有背景）。
     * 当启用背景时，文本的竖直对齐模式将设置为 middle（默认为 baseline）。
     *
     * @type {string}
     * @memberof Text
     */
    background?: string;

    /**
     * 数字或者字符串，应使用下列形式：
     * * 0.7 - 基于游戏坐标的相对大小
     * * 20px - 基于像素的绝对大小
     * * 0.7 serif
     * * bold italic 1.5 Times New Roman
     *
     * @type {(number|string)}
     * @memberof Text
     */
    font?: number | string;

    /**
     * 文本对齐模式，center，left 或者 right 之一。默认值为left。
     *
     * @type {("left" | "center" | "right")}
     * @memberof Text
     */
    align?: "left" | "center" | "right";

    /**
     * 轮廓颜色，允许使用任何 web 格式颜色，默认未定义（没有轮廓）。
     *
     * @type {string}
     * @memberof Text
     */
    stroke?: string;

    /**
     * 要显示的文本字符串。
     *
     * @type {string}
     * @memberof Text
     */
    content: string;

    /**
     * 背景矩形的填充值，现在没有启用。
     *
     * @type {number}
     * @memberof Text
     */
    backgroundPadding?: number;

    /**
     * 字体颜色。
     *
     * @type {string}
     * @memberof Text
     */
    color?: string;
}

/**
 * 进度条，显示进度
 * 可用属性：
 * width：进度条宽度
 * height:进度条高度
 * value:进度值0~100
 * background:进度条背景颜色
 * progressColor:进度条颜色
 * borderColor:进度条边框颜色
 * visibility:是否可见
 *
 * @interface Progress
 * @extends {layout}
 */
interface Progress extends baseLayout {
    /**
     * 进度条边框颜色。
     *
     * @type {string}
     * @memberof Progress
     */
    borderColor: string;

    /**
     * 进度条颜色。
     *
     * @type {string}
     * @memberof Progress
     */
    progressColor: string;

    /**
     * 进度条高度。
     *
     * @type {number}
     * @memberof Progress
     */
    height: number;

    /**
     * 进度条宽度。
     *
     * @type {number}
     * @memberof Progress
     */
    width: number;

    /**
     * 进度值,取值在0~100之间，支持浮点数。
     *
     * @type {number}
     * @memberof Progress
     */
    value: number;
}

type SwitchBar = baseLayout;

type LockTarget = baseLayout;
