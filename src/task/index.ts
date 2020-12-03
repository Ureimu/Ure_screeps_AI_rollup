import { RoomTask } from "./utils/RoomTask";
import { PriorityQueue } from "./utils/PriorityQueue";
import { autoPush } from "./utils/allocateAndPushTask";

export function manageTask(room:Room): void {
    // let startTime = Game.cpu.getUsed();
    // let cpuInf: {[roomName:string] :number} = {};

    // cpuInf[roomName] = 0;
    // cpuInf[roomName] -= Game.cpu.getUsed();
    if(Game.time%25 != 0) return;
    let roomName = room.name;
    for(let taskKindName in global.spawnTaskList){
        let ifPush = false;
        if(taskKindName != "roomMaintance") ifPush= true;
        for(let taskName in global.spawnTaskList[taskKindName]){
            let taskList = new PriorityQueue(false);
            let rTaskList: BaseTaskInf[] = [];
            let AnyRoomTask = new RoomTask(roomName,taskName,ifPush);
            if(!AnyRoomTask.hasPushed){
                AnyRoomTask.hasPushed=true;
                let gTask = global.spawnTaskList[taskKindName][taskName](roomName);
                if(typeof gTask !== 'undefined'){
                    rTaskList.push(...gTask);
                }
                for(let xTask of rTaskList){
                    taskList.push(xTask);
                }
                autoPush(AnyRoomTask,taskList);
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
    //console.log(text);
}
