import taskPool from "taskPool";
import { object } from "lodash";


/**
 * 生成一个spawnTask模板任务对象
 *
 * @param {()=>bpgGene[]} manage_bodyParts
 * @param {*} sponsorObject
 * @param {string} creepName
 * @returns
 */

function makeSpawnTaskObject(
    manage_bodyParts: () => bpgGene[],
    sponsorObject: any,
    creepName: string,
    priority: number = 10,
    isRunning: boolean = false
) {
    let spawnTaskObject = {
        sponsor: sponsorObject.id,
        priority: priority,
        isRunning: isRunning,
        taskInf: {
            bodyparts: manage_bodyParts(),
            creepName: creepName
        }
    };
    return spawnTaskObject;
}

/**
 * 分配给定的room的spawnTask中的任务到相应房间内的spawn中，平均分配。
 *
 * @param {object} roomListToAllocate 给定的room对象
 */
function allocatingSpawnTask(roomListToAllocate: object):void{
    if(Object.keys(roomListToAllocate).length==0) return
    let ifAllOK= false;
    let roomlist:any={};
    let roomSpawnQueuelist:any={};
    let spawnQueuelist:any={};
    let spawnlist:any = {};
    for(let roomName in roomListToAllocate){
        for(let spawnName in Memory.spawns){
            if(Game.spawns[spawnName].room.name==roomName){
                spawnlist[spawnName]=spawnName;
            }
        }
    }
    if(Object.keys(spawnlist).length==0) return
    for(let spawnName in spawnlist){
        roomlist[Game.spawns[spawnName].room.name]=false;
        roomSpawnQueuelist[Game.spawns[spawnName].room.name]=taskPool.initQueue("spawnQueue",Game.spawns[spawnName].room.memory.taskPool);
        spawnQueuelist[spawnName]=taskPool.initQueue("spawnQueue",Memory.spawns[spawnName].taskPool);
    }
    while(!ifAllOK){
        for(let spawnName in spawnlist){
            if(roomlist[Game.spawns[spawnName].room.name]==true) continue;
            if(!taskPool.transTask(roomSpawnQueuelist[Game.spawns[spawnName].room.name],spawnQueuelist[spawnName])){
                roomlist[Game.spawns[spawnName].room.name] = true;
            }
        }
        ifAllOK= true;
        for(let roomName in roomlist){
            if(roomlist[roomName] == true) continue;
            else ifAllOK = false;
        }
    }
    for(let spawnName in spawnlist){
        taskPool.setQueue(roomSpawnQueuelist[Game.spawns[spawnName].room.name],"spawnQueue",Game.spawns[spawnName].room.memory.taskPool);
        taskPool.setQueue(spawnQueuelist[spawnName],"spawnQueue",Memory.spawns[spawnName].taskPool);
    }
}

export function manageTask(): void {
    let roomListToAllocate:any = {}//需要分配生成creep任务的房间名请放入这里。

    for (let sourceName in Memory.sources) {
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let chooseBodyParts = function (): bpgGene[] {
            return [{ move: 1, work: 2 }];
        };
        let checking: CheckStatus = source.check();
        if (checking.update) {
        }
        if (checking.pushTask) {
            let roomSpawnQueue = taskPool.initQueue("spawnQueue", Memory.rooms[source.room.name].taskPool);
            if (checking.pushTaskData.pushSpawnTask) {
                for (let i = 0, j = Memory.sources[sourceName].blankSpace; i < j; i++) {
                    let obj =makeSpawnTaskObject(chooseBodyParts, source, `${source.name}-H-${i + 1}`)
                    roomSpawnQueue.push(obj);
                    Memory.sources[source.name].taskPool.spawnQueue.push(obj);
                };
            }
            taskPool.setQueue(roomSpawnQueue,'spawnQueue',Memory.rooms[source.room.name].taskPool);
            roomListToAllocate[source.room.name]=1;
        }
        if (checking.changeStatus) {
        }
    };

    allocatingSpawnTask(roomListToAllocate);
}
