import taskPool from "task/utils/taskPool";
import { RoomTask } from "./utils/RoomTask";
import { PriorityQueue } from "./utils/PriorityQueue";
import { harvestSource } from "./spawnTask/harvestSource";
import { carrySource } from "./spawnTask/carrySource";
import { buildAndRepair } from "./spawnTask/buildAndRepair";
import { upgradeController } from "./spawnTask/upgradeController";

/**
 * 分配给定的room的spawnTask中的任务到相应房间内的spawn中，平均分配。
 *
 * @param {object} roomListToAllocate 给定的room对象
 */
function allocatingSpawnTask(roomListToAllocate: object): void {
    if (Object.keys(roomListToAllocate).length == 0) return;
    let ifAllOK = false;
    let roomlist: any = {};
    let roomSpawnQueuelist: any = {};
    let spawnQueuelist: any = {};
    let spawnlist: any = {};
    for (let roomName in roomListToAllocate) {//添加相关room和spawn到表中
        for (let spawnName in Memory.spawns) {
            if (Game.spawns[spawnName].room.name == roomName) {
                spawnlist[spawnName] = spawnName;
            }
        }
    }
    if (Object.keys(spawnlist).length == 0) return;
    for (let spawnName in spawnlist) {//初始化队列
        roomlist[Game.spawns[spawnName].room.name] = false;
        roomSpawnQueuelist[Game.spawns[spawnName].room.name] = taskPool.initQueue(
            "spawnQueue",
            Game.spawns[spawnName].room.memory.taskPool
        );
        spawnQueuelist[spawnName] = taskPool.initQueue("spawnQueue", Memory.spawns[spawnName].taskPool);
    }
    while (!ifAllOK) {//进行队列间的任务交换
        for (let spawnName in spawnlist) {
            if (roomlist[Game.spawns[spawnName].room.name] == true) continue;
            if (!taskPool.transTask(roomSpawnQueuelist[Game.spawns[spawnName].room.name], spawnQueuelist[spawnName])) {
                roomlist[Game.spawns[spawnName].room.name] = true;
            }
        }
        ifAllOK = true;
        for (let roomName in roomlist) {
            if (roomlist[roomName] == true) continue;
            else ifAllOK = false;
        }
    }
    for (let spawnName in spawnlist) {//保存队列
        taskPool.setQueue(
            roomSpawnQueuelist[Game.spawns[spawnName].room.name],
            "spawnQueue",
            Game.spawns[spawnName].room.memory.taskPool
        );
        taskPool.setQueue(spawnQueuelist[spawnName], "spawnQueue", Memory.spawns[spawnName].taskPool);
    }
}

function autoPush(roomTask:RoomTask,spawnTaskObjList:PriorityQueue): {[roomName:string] :number} {
    let roomListToAllocate:{[roomName:string]:number} = {};
    if(typeof spawnTaskObjList != 'undefined'){
        for (let i = 0, j = spawnTaskObjList.size(); i < j; i++) {
            roomTask.pushTask(<Task>spawnTaskObjList.pop());
        }
    }
    if(roomTask.run()==0){
        roomListToAllocate[roomTask.roomName] = 1;
    }
    return roomListToAllocate;
}

export function manageTask(): void {
    let startTime = Game.cpu.getUsed();
    let cpuInf: {[roomName:string] :number} = {};
    let roomListToAllocate: {[roomName:string] :number} = {}; //需要分配生成creep任务的房间名请放入这里。
    let runTaskList: {[taskName:string] :(roomName: string) => Task[]|undefined}={
        'harvestSource':harvestSource,
        'carrySource':carrySource,
        'upgradeController':upgradeController,
        'buildAndRepair':buildAndRepair,
    }

    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            cpuInf[roomName] = 0;
            cpuInf[roomName] -= Game.cpu.getUsed();

            for(let taskName in runTaskList){
                let taskList = new PriorityQueue(false);
                let rTaskList: Task[] = [];
                let gTask = runTaskList[taskName](roomName);
                if(typeof gTask !== 'undefined'){
                    rTaskList.push(...gTask);
                }
                for(let xTask of rTaskList){
                    taskList.push(xTask);
                }
                roomListToAllocate=Object.assign(roomListToAllocate,autoPush(new RoomTask(roomName,taskName),taskList));
            }

            cpuInf[roomName] += Game.cpu.getUsed();
        }
    }

    allocatingSpawnTask(roomListToAllocate);
    let endTime = Game.cpu.getUsed();
    console.log(`manager CPU cost:${(endTime-startTime).toFixed(3)}`);
    let head = `roomName\tCPU\n`;
    let text = head;
    for(let roomName in cpuInf){
        const inf = [roomName,cpuInf[roomName].toFixed(3)].join('\t\t');
        text = text.concat(inf,'\n');
    }
    console.log(text);
}
