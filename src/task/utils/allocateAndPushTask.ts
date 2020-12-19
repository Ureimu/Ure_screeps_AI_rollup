import PriorityQueue from "../../../utils/PriorityQueue";
import { TaskSetting } from "../taskClass/TaskSetting";
import taskPool from "./taskPool";

/**
 * 分配给定的room的spawnTask中的任务到相应房间内的spawn中，平均分配。
 *
 * @param {object} roomListToAllocate 给定的room对象
 */
export function allocatingSpawnTask(QueueName: string): void {
    const roomListToAllocate: { [roomName: string]: number } = {};
    for (const roomName in Memory.rooms) {
        if (Memory.rooms[roomName]?.taskPool?.[QueueName].length > 0) {
            roomListToAllocate[roomName] = 1;
        }
    }
    if (Object.keys(roomListToAllocate).length === 0) return;
    let ifAllOK = false;
    const roomlist: { [name: string]: boolean } = {};
    const roomSpawnQueuelist: { [name: string]: PriorityQueue } = {};
    const spawnQueuelist: { [name: string]: PriorityQueue } = {};
    const spawnlist: { [name: string]: string } = {};
    for (const roomName in roomListToAllocate) {
        // 添加相关room和spawn到表中
        for (const spawnName in Memory.spawns) {
            if (Game.spawns[spawnName].room.name === roomName) {
                spawnlist[spawnName] = spawnName;
            }
        }
    }
    if (Object.keys(spawnlist).length === 0) return;
    for (const spawnName in spawnlist) {
        // 初始化队列
        roomlist[Game.spawns[spawnName].room.name] = false;
        roomSpawnQueuelist[Game.spawns[spawnName].room.name] = taskPool.initQueue(
            QueueName,
            Game.spawns[spawnName].room.memory.taskPool
        );
        spawnQueuelist[spawnName] = taskPool.initQueue(QueueName, Memory.spawns[spawnName].taskPool);
    }
    while (!ifAllOK) {
        // 进行队列间的任务交换
        for (const spawnName in spawnlist) {
            if (roomlist[Game.spawns[spawnName].room.name] === true) continue;
            if (!taskPool.transTask(roomSpawnQueuelist[Game.spawns[spawnName].room.name], spawnQueuelist[spawnName])) {
                roomlist[Game.spawns[spawnName].room.name] = true;
            }
        }
        ifAllOK = true;
        for (const roomName in roomlist) {
            if (roomlist[roomName] === true) continue;
            else ifAllOK = false;
        }
    }
    for (const spawnName in spawnlist) {
        // 保存队列
        taskPool.setQueue(
            roomSpawnQueuelist[Game.spawns[spawnName].room.name],
            QueueName,
            Game.spawns[spawnName].room.memory.taskPool
        );
        taskPool.setQueue(spawnQueuelist[spawnName], QueueName, Memory.spawns[spawnName].taskPool);
    }
}

export function autoPush(roomTask: TaskSetting, spawnTaskObjList: PriorityQueue): void {
    if (typeof spawnTaskObjList != "undefined") {
        for (let i = 0, j = spawnTaskObjList.size(); i < j; i++) {
            roomTask.pushTask(spawnTaskObjList.pop() as SpawnTaskInf);
        }
    }
    roomTask.run();
}
