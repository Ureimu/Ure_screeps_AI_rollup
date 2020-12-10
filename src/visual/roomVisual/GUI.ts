/**
 * Screeps-GUI-VisualEngine 视图渲染工具 ts版本
 * https://gitee.com/mingzey/Screeps-GUI-VisualEngine js原版
 * visualGUI.d.ts文件注明了该文件使用的变量类型。
 *
 * 使用方法：
 */

class Box<T extends elementsLayout> implements BoxConstructor<T> {
    public x: number;
    public y: number;
    public layout: T;
    public constructor(layout: T) {
        this.x = 0;
        this.y = 0;

        this.layout = layout;

        if (layout.x !== undefined) {
            this.x = layout.x;
        }

        if (layout.y !== undefined) {
            this.y = layout.y;
        }
    }
}

export function GUIfun(): GUIclass {
    return {
        draw<T extends elementsConstant>(visual: RoomVisual, map: map<T>[]) {
            this.drawMap(visual, map, -0.5, -0.5);
            return visual;
        },

        drawMap(this: GUIclass, visual: RoomVisual, map, x, y) {
            // 迭代循环布局结构
            for (const item of map) {
                // 获取每一个子项

                // 获取布局和子布局
                const layout = item.layout;
                if (layout === undefined) {
                    console.log("[GUI]警告:未定义的组件布局," + item.type);
                }
                const child = item.child;

                // 新建盒子模型
                const box = new Box<elementsLayout>(layout);

                // 检查内容可视属性：默认可视(true)，不可视(false)
                if (layout.visibility !== undefined && layout.visibility === false) {
                    continue;
                }

                // 修改相对坐标
                box.x += x;
                box.y += y;

                // 再根据标签类型进行组件特有绘制
                const component = this[item.type] as standardReturnElementsLayout;
                let componentData;
                if (component === undefined) {
                    console.log("[GUI]警告:未定义的组件名称," + item.type);
                    continue;
                } else {
                    componentData = component(visual, box as box<elementsLayoutGeneral>);
                }

                if (componentData === undefined || componentData.componentName !== item.type) {
                    console.log("[GUI]警告，组件" + item.type + "没有正确的返回组件信息，这可能会造成无法预料的错误");
                    componentData = {};
                }

                // 检查componentData数据
                // 包含检查，有些类型的组件不允许绘制内部组件
                if (componentData.allowChild === false) {
                    console.log(
                        "[GUI]警告，检测到在不允许绘制内部组件的组件" +
                            item.type +
                            "进行了子组件绘制，这可能会造成无法预料的错误"
                    );
                    continue;
                }

                // 检查是否含有子组件，若有，传入父级起点
                if (child !== undefined) {
                    this.drawMap(visual, child, box.x, box.y);
                }
            }
            return visual;
        },

        /**
         * 在下方定义组件的绘制过程，您可以仿造示例来创建自己的自定义组件
         *
         * 提示：自定义组件会被渲染引擎调用，被调用时会传入两个参数，分别是visula和box
         * visual 是标准的Screeps Room Visual 对象，可以使用这个对象进行你的绘制
         * box 包含了这个组件的layout属性列表，您可以通过box.layout来进行访问
         * 此外，box还包含了当前的绘制坐标点，他们分别是
         * box.x 起始的x位置,这个数据受到这个控件的父级影响
         * box.y 起始的y位置，这个数据受到这个控件的父级影响
         *
         * 注意：自定义的组件必须要return一个对象，对象需要包含一些有效数据
         * 关于return对象的书写，请见GITHUB说明文档
         *
         */

        /**
         * 容器组件，用于内置其他组件
         */
        Div(visual: RoomVisual, box: box<Div>) {
            const layout = box.layout;

            // 一些Div的默认属性
            // 关于Box转Div的配置
            // 配置style
            const style = {
                fill: "#00000000",
                opacity: 1,
                stroke: "#00000000"
            };

            // 从layout配置
            if (layout !== undefined) {
                if (layout.background !== undefined) {
                    style.fill = layout.background;
                }
                if (layout.opacity !== undefined) {
                    style.opacity = layout.opacity;
                }
                if (layout.stroke !== undefined) {
                    style.stroke = layout.stroke;
                }
            }

            visual.rect(box.x, box.y, box.layout.width, box.layout.height, style);

            // 需要正确的返回组件信息
            return {
                componentName: "Div"
            };
        },

        /**
         * 文本组件，显示文本
         */
        Text(visual: RoomVisual, box: box<Text>) {
            const layout = box.layout;

            // Box转Text
            // 配置style
            const style = {
                align: "left" as "left" | "center" | "right" | undefined,
                font: 0.5 as number | string,
                backgroundColor: "#00000000",
                stroke: "",
                backgroundPadding: 0.3,
                content: "",
                color: "#ffffff"
            };

            // 从layout中导出style
            if (layout !== undefined) {
                if (layout.background !== undefined) {
                    style.backgroundColor = layout.background;
                    style.backgroundPadding = 0;
                }
                if (layout.font !== undefined) {
                    style.font = layout.font;
                }
                if (layout.align !== undefined) {
                    style.align = layout.align;
                }
                if (layout.stroke !== undefined) {
                    style.stroke = layout.stroke;
                }
                if (layout.content !== undefined) {
                    style.content = layout.content;
                }
                if (layout.color !== undefined) {
                    style.color = layout.color;
                }
                box.y += 0.5;
            }

            // console.log(JSON.stringify(style));
            // console.log(JSON.stringify(box));
            visual.text(style.content, box.x, box.y, style);

            // 需要正确的返回组件信息
            return {
                componentName: "Text"
            };
        },

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
         */
        Progress(visual: RoomVisual, box: box<Progress>) {
            const layout = box.layout;

            let borderColor = "#9e9e9e";
            if (layout.borderColor !== undefined) {
                borderColor = layout.borderColor;
            }

            let progressColor = "#9e9e9e";
            if (layout.progressColor !== undefined) {
                progressColor = layout.progressColor;
            }

            let height = 0.5;
            if (layout.height !== undefined) {
                height = layout.height;
            }

            let width = 3;
            if (layout.width !== undefined) {
                width = layout.width;
            }

            let value = 70;
            if (layout.value !== undefined) {
                value = layout.value;
            }

            // 计算进度宽度
            const pwidth = width * (value / 100);

            const map = [
                {
                    type: "Div",
                    layout: {
                        width,
                        height,
                        stroke: borderColor
                    } as elementsLayoutGeneral,
                    child: [
                        {
                            type: "Div",
                            layout: {
                                height,
                                width: pwidth,
                                background: progressColor
                            } as elementsLayoutGeneral
                        }
                    ]
                } as map<"Div">
            ];

            GUIfun().drawMap(visual, map, box.x, box.y);

            // 需要正确的返回组件信息
            return {
                componentName: "Progress"
            };
        },

        /**
         * 开关条组件，展示项目是否开启
         * 可用属性：
         * state:开关状态(true/false)
         * height:开关高度
         * width:开关宽度
         */
        SwitchBar(visual: RoomVisual, box: box<SwitchBar>) {
            // const layout = box.layout;

            // 需要正确的返回组件信息
            return {
                componentName: "SwitchBar"
            };
        },

        LockTarget(visual: RoomVisual, box: box<LockTarget>) {
            return {
                componentName: "LockTarget"
            };
        }
    };
}
