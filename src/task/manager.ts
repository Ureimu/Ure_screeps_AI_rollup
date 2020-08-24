import taskPool from "task/taskPool";
import * as makeTask from "./makeTask";
import { RoomTask } from "./RoomTask";

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

function autoPush(roomName:string,roomTaskName:string,roomListToAllocate:{[roomName:string] :number},spawnTaskObjList:Task[]): {[roomName:string] :number} {
    let task = new RoomTask(roomName,roomTaskName);
    if(typeof Memory.rooms[roomName].pushTaskSet[task.roomTaskName] == 'undefined'){
        task.inits();
    }
    if(task.run(true)==-3){
        for (let i = 0, j = spawnTaskObjList.length; i < j; i++) {
            task.pushTask(spawnTaskObjList[i]);
        }
    }
    if(task.run()==0){
        roomListToAllocate[roomName] = 1;
    }
    return roomListToAllocate;
}

export function manageTask(): void {
    let roomListToAllocate: {[roomName:string] :number} = {}; //需要分配生成creep任务的房间名请放入这里。

    for (let sourceName in Memory.sources) {
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let chooseBodyParts = function (): bpgGene[] {
            return [{ move: 1, work: 2, carry: 1 }];
        };
        let checking: CheckStatus = source.check();
        if (checking.update) {
        }
        if (checking.pushTask) {
            let roomSpawnQueue = taskPool.initQueue("spawnQueue", Memory.rooms[source.room.name].taskPool);
            if (checking.pushTaskData.pushSpawnTask) {
                for (let i = 0, j = Memory.sources[sourceName].blankSpace; i < j; i++) {
                    let obj2 = makeTask.makeHarvestSourceTaskObject(source);
                    let obj: any = makeTask.makeSpawnTaskObject(
                        chooseBodyParts,
                        `${source.name}-H-${i + 1}`,
                        obj2,
                        source
                    );
                    roomSpawnQueue.push(obj);
                    Memory.sources[source.name].taskPool.spawnQueue.push(obj);
                }
            }
            taskPool.setQueue(roomSpawnQueue, "spawnQueue", Memory.rooms[source.room.name].taskPool);
            roomListToAllocate[source.room.name] = 1;
        }
        if (checking.changeStatus) {
        }
    }

    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            if (Game.time % 1500 == 0 || Memory.testvalue1 == true) {
                let chooseBodyParts = function (): bpgGene[] {
                    return [{ move: 3, carry: 3 }];
                };
                Memory.testvalue1 = false;
                let screeps_x = _.filter(Game.creeps, creep => creep.name.indexOf(roomName + "-C-") != -1);
                let bodypartsCount = 0;
                for (let i = 0; i < screeps_x.length; i++) {
                    for (let body of screeps_x[i].body) {
                        if (body.type == "carry") {
                            bodypartsCount++;
                        }
                    }
                }
                if (bodypartsCount < 5 || screeps_x.length < 1) {
                    let roomSpawnQueue = taskPool.initQueue("spawnQueue", Memory.rooms[roomName].taskPool);
                    for (let i = 0, j = 1; i < j; i++) {
                        let obj2 = makeTask.makeCarrySourceTaskObject();
                        let obj: any = makeTask.makeSpawnTaskObject(
                            chooseBodyParts,
                            `${roomName}-C-${i + 1}`,
                            obj2,
                            undefined,
                            12
                        );
                        roomSpawnQueue.push(obj);
                    }
                    taskPool.setQueue(roomSpawnQueue, "spawnQueue", Memory.rooms[roomName].taskPool);
                    roomListToAllocate[roomName] = 1;
                }
            }

            if (Game.time % 1500 == 0 || Memory.testvalue2 == true) {
                let chooseBodyParts = function (): bpgGene[] {
                    return [{ move: 1, work: 2, carry: 1 }];
                };
                Memory.testvalue2 = false;
                let screeps_x = _.filter(Game.creeps, creep => creep.name.indexOf(roomName + "-U-") != -1);
                let bodypartsCount = 0;
                for (let i = 0; i < screeps_x.length; i++) {
                    for (let body of screeps_x[i].body) {
                        if (body.type == "work") {
                            bodypartsCount++;
                        }
                    }
                }
                if (bodypartsCount < 10 || screeps_x.length < 5) {
                    let roomSpawnQueue = taskPool.initQueue("spawnQueue", Memory.rooms[roomName].taskPool);
                    for (let i = 0, j = 5; i < j; i++) {
                        let obj2 = makeTask.makeUpgradeControllerTaskObject();
                        let obj: any = makeTask.makeSpawnTaskObject(
                            chooseBodyParts,
                            `${roomName}-U-${i + 1}`,
                            obj2,
                            undefined,
                            8
                        );
                        roomSpawnQueue.push(obj);
                    }
                    taskPool.setQueue(roomSpawnQueue, "spawnQueue", Memory.rooms[roomName].taskPool);
                    roomListToAllocate[roomName] = 1;
                }
            }

            let Task = new RoomTask(roomName,'upgradeController');
            if(typeof Memory.rooms[roomName].pushTaskSet[Task.roomTaskName] == 'undefined'){
                Task.inits();
            }
            if(Task.run(true)==-3){

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
                    Task.pushTask(obj);
                }
            }
            if(Task.run()==0){
                roomListToAllocate[roomName] = 1;
            }

        }
    }

    allocatingSpawnTask(roomListToAllocate);
}
