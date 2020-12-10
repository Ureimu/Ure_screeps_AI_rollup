import PriorityQueue from "../../utils/PriorityQueue";
import { RoomTask } from "./utils/RoomTask";
import { autoPush } from "./utils/allocateAndPushTask";

export function manageTask(room: Room): void {
    // let startTime = Game.cpu.getUsed();
    // let cpuInf: {[roomName:string] :number} = {};

    // cpuInf[roomName] = 0;
    // cpuInf[roomName] -= Game.cpu.getUsed();
    if (Game.time % 25 !== 0) return;
    const roomName = room.name;
    for (const taskKindName in global.spawnTaskList) {
        let ifPush = false;
        if (taskKindName !== "roomMaintance") ifPush = true;
        for (const taskName in global.spawnTaskList[taskKindName]) {
            let iftaskPush = false;
            if (taskName === "centerCarry") iftaskPush = true;
            const taskList = new PriorityQueue(false);
            const rTaskList: BaseTaskInf[] = [];
            const AnyRoomTask = new RoomTask(roomName, taskName, iftaskPush || ifPush);
            if (!AnyRoomTask.hasPushed) {
                AnyRoomTask.hasPushed = true;
                const gTask = global.spawnTaskList[taskKindName][taskName](roomName);
                if (typeof gTask !== "undefined") {
                    rTaskList.push(...gTask);
                }
                for (const xTask of rTaskList) {
                    taskList.push(xTask);
                }
                autoPush(AnyRoomTask, taskList);
            }
        }
    }

    // cpuInf[roomName] += Game.cpu.getUsed();
    // let endTime = Game.cpu.getUsed();
    // //console.log(`manager CPU cost:${(endTime-startTime).toFixed(3)}`);
    // let head = `roomName\tCPU\n`;
    // let text = head;
    // for(let roomName in cpuInf){
    //     const inf = [roomName,cpuInf[roomName].toFixed(3)].join('\t\t');
    //     text = text.concat(inf,'\n');
    // }
    // console.log(text);
}
