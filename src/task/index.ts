import taskPool from "task/utils/taskPool";
import { RoomTask } from "./utils/RoomTask";
import { PriorityQueue } from "./utils/PriorityQueue";
import { spawnTaskList } from "./spawnTask";
import { allocatingSpawnTask, autoPush } from "./utils/allocateAndPushTask";


export function manageTask(): void {
    let startTime = Game.cpu.getUsed();
    let cpuInf: {[roomName:string] :number} = {};
    let runTaskList: {[taskName:string] :(roomName: string) => BaseTaskInf[]|undefined}=spawnTaskList();

    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            cpuInf[roomName] = 0;
            cpuInf[roomName] -= Game.cpu.getUsed();

            for(let taskName in runTaskList){
                let taskList = new PriorityQueue(false);
                let rTaskList: BaseTaskInf[] = [];
                let AnyRoomTask = new RoomTask(roomName,taskName);
                if(!AnyRoomTask.hasPushed){
                    AnyRoomTask.hasPushed=true;
                    let gTask = runTaskList[taskName](roomName);
                    if(typeof gTask !== 'undefined'){
                        rTaskList.push(...gTask);
                    }
                    for(let xTask of rTaskList){
                        taskList.push(xTask);
                    }
                    autoPush(AnyRoomTask,taskList);
                }
            }

            cpuInf[roomName] += Game.cpu.getUsed();
        }
    }

    allocatingSpawnTask("spawnQueue");

    let endTime = Game.cpu.getUsed();
    //console.log(`manager CPU cost:${(endTime-startTime).toFixed(3)}`);
    let head = `roomName\tCPU\n`;
    let text = head;
    for(let roomName in cpuInf){
        const inf = [roomName,cpuInf[roomName].toFixed(3)].join('\t\t');
        text = text.concat(inf,'\n');
    }
    //console.log(text);
}
