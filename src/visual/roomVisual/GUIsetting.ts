import { getBpSum } from "./roominf/creeps";
import { printMulText } from "./utils";

export function roomVisualize(room: Room): void {
    global.GUI.draw(new RoomVisual(room.name), [
        {
            type: "Div",
            layout: {
                x: 0,
                y: 0,
                width: 20,
                height: 3,
                background: "#000000",
                opacity: 0.5
            },
            child: printMulText({
                content: `现在的游戏时间是${Game.time}tick\n该房间spawn在维持的creep的部件总数为${getBpSum(
                    room.name
                )}\n\n工地数：${room.find(FIND_CONSTRUCTION_SITES).length}`,
                x: 0,
                y: 0,
                align: "left"
            }).concat([
                {
                    type: "Progress",
                    layout: {
                        width: 10,
                        value: (room.energyAvailable / room.energyCapacityAvailable) * 100,
                        x: 0,
                        y: 2.215
                    }
                },
                {
                    type: "Text",
                    layout: {
                        content: `${room.energyAvailable}/${room.energyCapacityAvailable}`,
                        x: 5,
                        y: 2,
                        align: "center",
                        stroke: "#000000"
                    }
                }
            ])
        }
    ]);
}

export function errorStackVisualize(err: string): void {
    const errIndex = Memory.errors.errorList.indexOf(err);
    let lastErrStr = err;
    if (Memory.errors.errorList.length > 50) {
        console.log("[error]错误数已经超过临界值，请及时检查错误。Memory占用过高。");
    }
    if (errIndex === -1) {
        Memory.errors.errorCount.push(1);
        lastErrStr += `
        这是第${Memory.errors.errorList.length + 1}个错误，重复了${1}次`;
        Memory.errors.errorList.push(err);
        Memory.errors.errorIntervals.push([Game.time]);
    } else {
        Memory.errors.errorIntervals[errIndex].push(Game.time - _.sum(Memory.errors.errorIntervals[errIndex]));
        Memory.errors.errorCount[errIndex] += 1;
        lastErrStr += `
        这是第${errIndex + 1}个错误，重复了${Memory.errors.errorCount[errIndex]}次，
        平均时间间隔为${
            (_.sum(Memory.errors.errorIntervals[errIndex]) - Memory.errors.errorIntervals[errIndex][0]) /
            (Memory.errors.errorCount[errIndex] - 1)
        }`;
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
                opacity: 0.5
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
