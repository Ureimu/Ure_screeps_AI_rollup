import taskPool from "task/taskPool";
import * as makeTask from "./makeTask";
import { RoomTask } from "./RoomTask";
import { getBpNum } from "utils/bodypartsGenerator";

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

function autoPush(roomTask:RoomTask,spawnTaskObjList:Task[]=[]): {[roomName:string] :number} {
    let roomListToAllocate:{[roomName:string]:number} = {};
    if(typeof spawnTaskObjList != 'undefined'){
        for (let i = 0, j = spawnTaskObjList.length; i < j; i++) {
            roomTask.pushTask(spawnTaskObjList[i]);
        }
    }
    if(roomTask.run()==0){
        roomListToAllocate[roomTask.roomName] = 1;
    }
    return roomListToAllocate;
}

export function manageTask(): void {
    let roomListToAllocate: {[roomName:string] :number} = {}; //需要分配生成creep任务的房间名请放入这里。

    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            let taskList = [];

            for (let sourceName in Memory.sources) {
                let harvestSourceRoomTask = new RoomTask(roomName,'harvestSource'+sourceName)
                taskList = [];
                if(!harvestSourceRoomTask.hasPushed){
                    harvestSourceRoomTask.hasPushed=true;
                    let chooseBodyParts = function (): bpgGene[] {
                        return [{ move: 1, work: 2, carry: 1 }];
                    };
                    let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
                    let checking: CheckStatus = source.check();
                    if (checking.update) {
                    }
                    if (checking.pushTask) {
                        if (checking.pushTaskData.pushSpawnTask) {
                            for (let i = 0, j = Memory.sources[sourceName].blankSpace; i < j; i++) {
                                let obj2 = makeTask.makeHarvestSourceTaskObject(source);
                                let obj: any = makeTask.makeSpawnTaskObject(
                                    chooseBodyParts,
                                    `${source.name}-H-${i + 1}`,
                                    obj2,
                                    source
                                );
                                taskList.push(obj);
                                Memory.sources[source.name].taskPool.spawnQueue.push(obj);
                            }
                        }
                        roomListToAllocate[source.room.name] = 1;
                    }
                    if (checking.changeStatus) {
                    }
                }
                roomListToAllocate=Object.assign(roomListToAllocate,autoPush(harvestSourceRoomTask,taskList));
            }

            let carrySourceRoomTask = new RoomTask(roomName,'carrySource');
            taskList = [];
            if(!carrySourceRoomTask.hasPushed){
                carrySourceRoomTask.hasPushed=true;
                let chooseBodyParts = function (): bpgGene[] {
                    return [{ move: 3, carry: 3 }];
                };
                let screeps_x = _.filter(Game.creeps, creep => creep.name.indexOf(roomName + "-C-") != -1);
                let carryPartsCount = 0;
                screeps_x.forEach(x => {
                    carryPartsCount += getBpNum(x.memory.bodyparts,'carry');
                });
                if(carryPartsCount<5){
                    for (let i = 0, j = 1; i < j; i++) {
                        let obj2 = makeTask.makeCarrySourceTaskObject();
                        let obj: any = makeTask.makeSpawnTaskObject(
                            chooseBodyParts,
                            `${roomName}-C-${i + 1}`,
                            obj2,
                            undefined,
                            12
                        );
                        taskList.push(obj);
                    }
                }
            }
            roomListToAllocate=Object.assign(roomListToAllocate,autoPush(carrySourceRoomTask,taskList));

            let upgradeControllerRoomTask = new RoomTask(roomName,'upgradeController');
            taskList = [];
            if(!upgradeControllerRoomTask.hasPushed){
                upgradeControllerRoomTask.hasPushed=true;
                let chooseBodyParts = function (): bpgGene[] {
                    return [{ move: 1, work: 2, carry: 1 }];
                };
                for (let i = 0, j = 5; i < j; i++) {
                    let obj2 = makeTask.makeUpgradeControllerTaskObject();
                    let obj: any = makeTask.makeSpawnTaskObject(
                        chooseBodyParts,
                        `${roomName}-U-${i + 1}`,
                        obj2,
                        undefined,
                        8
                    );
                    taskList.push(obj);
                }
            }
            roomListToAllocate=Object.assign(roomListToAllocate,autoPush(upgradeControllerRoomTask,taskList));
        }
    }

    allocatingSpawnTask(roomListToAllocate);
}
