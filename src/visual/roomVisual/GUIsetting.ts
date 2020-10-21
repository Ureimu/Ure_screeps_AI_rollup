import { getBpSum } from "./roominf/creeps";
import { printMulText } from "./utils";

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
            child: [
                {
                    type: "Text",
                    layout: {
                        content: `现在的游戏时间是${Game.time}tick`,
                        x: 0,
                        y: 0,
                        align: "left"
                    }
                },
                {
                    type: "Text",
                    layout: {
                        content: `该房间spawn在维持的creep的部件总数为${getBpSum("W8N3")}`,
                        x: 0,
                        y: 1,
                        align: "left"
                    }
                },
                {
                    type: "Progress",
                    layout: {
                        x: 4,
                        y: 2
                    }
                }
            ]
        }
    ]);
}

export function errorStackVisualize(err: string) {
    let errIndex = Memory.errors.errorList.indexOf(err);
    let lastErrStr = err;
    if (Memory.errors.errorList.length > 50) {
        console.log("[error]错误数已经超过临界值，请及时检查错误。Memory占用过高。");
    }
    if (errIndex == -1) {
        Memory.errors.errorCount.push(1);
        lastErrStr += `
        这是第${Memory.errors.errorList.length + 1}个错误，重复了${1}次
        `;
        Memory.errors.errorList.push(err);
        Memory.errors.errorIntervals.push([Game.time]);
    } else {
        Memory.errors.errorIntervals[errIndex].push(Game.time - _.sum(Memory.errors.errorIntervals[errIndex]));
        Memory.errors.errorCount[errIndex] += 1;
        lastErrStr += `
        这是第${errIndex+1}个错误，重复了${Memory.errors.errorCount[errIndex]}次，
        平均时间间隔为${
            (_.sum(Memory.errors.errorIntervals[errIndex]) - Memory.errors.errorIntervals[errIndex][0]) /
            (Memory.errors.errorCount[errIndex]-1)
        }
        `;
        Memory.errors.errorList[errIndex] = err;
    }
    printErrorList(lastErrStr);
}

function printErrorList(err: string) {
    global.GUI.draw(new RoomVisual(), [
        {
            type: "Div",
            layout: {
                x: 30,
                y: 0,
                width: 20,
                height: 20,
                background: "#000000",
                opacity: 0.3
            },
            child: printMulText({
                content: err,
                x: 0,
                y: 0,
                align: "left"
            })
        }
    ]);
}
