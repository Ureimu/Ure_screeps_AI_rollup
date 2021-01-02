import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import PriorityQueue from "../../../utils/PriorityQueue";
import { TaskSetting } from "../taskClass/TaskSetting";
import { TaskPool } from "./taskPool";

/**
 * 分配给定的room的spawnTask中的任务到相应房间内的spawn中，平均分配。
 *
 * @param {object} roomListToAllocate 给定的room对象
 */
export function allocatingSpawnTask(QueueName: string): void {
    const taskPool = new TaskPool<SpawnTaskInf>();
    const roomListToAllocate: { [roomName: string]: number } = {};
    for (const roomName in Memory.rooms) {
        if (Memory.rooms[roomName]?.taskPool?.[QueueName].length > 0) {
            roomListToAllocate[roomName] = 1;
        }
    }
    if (Object.keys(roomListToAllocate).length === 0) return;
    let ifAllOK = false;
    const roomList: { [name: string]: { finished: boolean; minLength: number } } = {};
    const roomSpawnQueueList: { [name: string]: { PriorityQueue: PriorityQueue<SpawnTaskInf>; length: number } } = {};
    const spawnQueueList: { [name: string]: { PriorityQueue: PriorityQueue<SpawnTaskInf>; length: number } } = {};
    const spawnList: { [name: string]: string } = {};
    for (const roomName in roomListToAllocate) {
        // 添加相关room和spawn到表中
        for (const spawnName in Memory.spawns) {
            if (Game.spawns[spawnName].room.name === roomName) {
                spawnList[spawnName] = spawnName;
            }
        }
        // 初始化房间队列
        roomList[roomName] = {
            finished: false,
            minLength: Infinity
        };
        roomSpawnQueueList[roomName] = {
            PriorityQueue: taskPool.initQueue(QueueName, Game.rooms[roomName].memory.taskPool),
            length: 0
        };
        roomSpawnQueueList[roomName].length = roomSpawnQueueList[roomName].PriorityQueue.size();
    }
    if (Object.keys(spawnList).length === 0) return;
    for (const spawnName in spawnList) {
        // 初始化spawn队列
        spawnQueueList[spawnName] = {
            PriorityQueue: taskPool.initQueue(QueueName, Memory.spawns[spawnName].taskPool),
            length: 0
        };
        spawnQueueList[spawnName].length = spawnQueueList[spawnName].PriorityQueue.size();
    }
    while (!ifAllOK) {
        // 进行队列间的任务交换
        for (const spawnName in spawnList) {
            if (roomList[Game.spawns[spawnName].room.name].finished === true) continue;
            if (spawnQueueList[spawnName].length < roomList[Game.spawns[spawnName].room.name].minLength)
                roomList[Game.spawns[spawnName].room.name].minLength = spawnQueueList[spawnName].length;
        }
        for (const spawnName in spawnList) {
            if (roomList[Game.spawns[spawnName].room.name].finished === true) continue;
            if (!(roomList[Game.spawns[spawnName].room.name].minLength === spawnQueueList[spawnName].length)) continue;
            if (
                !taskPool.transTask(
                    roomSpawnQueueList[Game.spawns[spawnName].room.name].PriorityQueue,
                    spawnQueueList[spawnName].PriorityQueue
                )
            ) {
                roomList[Game.spawns[spawnName].room.name].finished = true;
            }
        }
        ifAllOK = true;
        for (const roomName in roomList) {
            if (roomList[roomName].finished === true) continue;
            else ifAllOK = false;
        }
    }
    for (const spawnName in spawnList) {
        // 保存队列
        taskPool.setQueue(
            roomSpawnQueueList[Game.spawns[spawnName].room.name].PriorityQueue,
            QueueName,
            Game.spawns[spawnName].room.memory.taskPool
        );
        taskPool.setQueue(spawnQueueList[spawnName].PriorityQueue, QueueName, Memory.spawns[spawnName].taskPool);
    }
}

export function autoPush(roomTask: TaskSetting, spawnTaskObjList: PriorityQueue<SpawnTaskInf>): void {
    if (typeof spawnTaskObjList != "undefined") {
        for (let i = 0, j = spawnTaskObjList.size(); i < j; i++) {
            roomTask.pushTask(spawnTaskObjList.pop() as SpawnTaskInf);
        }
    }
    roomTask.run();
}
