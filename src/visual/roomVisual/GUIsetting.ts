import actionCounter from "AllUtils/actionCounter";

export function roomVisualize() {
    global.GUI.draw(new RoomVisual(), [
            {
                type: "Div",
                layout: {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 2,
                    background: "#000000",
                    opacity: 0.3
                },
                child:[
                    {
                        type: "Text",
                        layout: {
                            content: `现在的游戏时间是${Game.time}tick`,
                            x: 0,
                            y: 0,
                            align:"left",
                        }
                    },
                    {
                        type: "Text",
                        layout: {
                            content: actionCounter.ratio(),
                            x: 0,
                            y: 1,
                            align:"left",
                        }
                    }
                ]
            }
        ]
    );
}
