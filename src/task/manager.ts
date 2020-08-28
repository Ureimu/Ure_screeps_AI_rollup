import taskPool from "task/taskPool";
import * as makeTask from "./makeTask";
import { RoomTask } from "./RoomTask";
import { getBpNum } from "utils/bodypartsGenerator";
import { PriorityQueue } from "./PriorityQueue";

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
    let taskList = new PriorityQueue(false);

    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            cpuInf[roomName] = 0;
            cpuInf[roomName] -= Game.cpu.getUsed();
            //采集能量任务
            for (let sourceName in Memory.sources) {
                let harvestSourceRoomTask = new RoomTask(roomName,'harvestSource'+sourceName)
                taskList.clear();
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
                            for (let i = 0, j = Memory.sources[sourceName].blankSpace.length; i < j; i++) {
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
                            roomListToAllocate[source.room.name] = 1;
                        }
                        harvestSourceRoomTask.interval=checking.pushTaskData.interval;
                    }
                    if (checking.changeStatus) {
                    }
                }
                roomListToAllocate=Object.assign(roomListToAllocate,autoPush(harvestSourceRoomTask,taskList));
            }

            //运输能量任务
            {
                let carrySourceRoomTask = new RoomTask(roomName,'carrySource');
                taskList.clear();
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
            }

            //升级控制器任务
            {
                let upgradeControllerRoomTask = new RoomTask(roomName,'upgradeController');
                taskList.clear();
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

            //建造任务
            {
                let buildingRoomTask = new RoomTask(roomName,'building');
                taskList.clear();
                if(!buildingRoomTask.hasPushed){
                    buildingRoomTask.hasPushed=true;
                    let chooseBodyParts = function (): bpgGene[] {
                        return [{ move: 2, carry: 2, work: 1 }];
                    };
                    if(/** 推送任务条件代码 */1){
                        for (let i = 0, j = 2/** 推送任务数量 */; i < j; i++) {
                            let obj2 = makeTask.makeBuildingTaskObject();
                            let obj: any = makeTask.makeSpawnTaskObject(
                                chooseBodyParts,
                                `${roomName}-B-${i + 1}`,
                                obj2,
                                undefined,
                                9
                            );
                            taskList.push(obj);
                        }
                    }
                }
                roomListToAllocate=Object.assign(roomListToAllocate,autoPush(buildingRoomTask,taskList));
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
