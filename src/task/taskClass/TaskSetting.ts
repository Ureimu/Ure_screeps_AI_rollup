import { TaskPool } from "task/utils/taskPool";
import { SpawnTaskInf } from "./extends/SpawnTask";

interface RoomTaskInfo {
    isMyRoom: boolean;
    runNow: boolean;
    ifPushNewSpawnTask: boolean;
    NewSpawnTaskQueue: SpawnTaskInf[];
    ifAllocateNewSpawnTaskToSpawn: boolean;
    hasPushed: boolean;
    hasPushedToSpawn: boolean;
    runningNumber: number;
    memory: Record<string, unknown>;
}

declare global {
    interface RoomMemory {
        taskSetting: { [taskKindName: string]: { [taskName: string]: RoomTaskInfo } };
    }
}

/**
 * 房间任务对象。
 * 主要功能：
 * 1.简化对memory的操作。
 * 2.提供更容易操作的任务api。
 * 3.将任务创建逻辑和任务推送逻辑分离，该模块只负责任务储存和推送。
 *
 * @export
 * @class TaskSetting
 */
export class TaskSetting {
    public roomName: string;
    public roomTaskName: string;
    public roomTaskKindName: string;

    public constructor(roomName: string, taskKindName: string, roomTaskName: string, pushAtBeginning = false) {
        this.roomName = roomName;
        this.roomTaskName = roomTaskName;
        this.roomTaskKindName = taskKindName;
        if (typeof Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName] == "undefined") {
            Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName] = {};
        }
        if (typeof Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName] == "undefined") {
            this.inits(pushAtBeginning);
        }
    }

    /**
     *
     * 初始化一个房间任务对象。
     * @param {boolean} isMyRoom 是否判断该房间为已经拥有的房间，如果判断为没有拥有的房间，则到时间也不会执行任务
     * @param {boolean} runNow 是否立即执行，nextPushTimePoint的值会因此立即重置。
     * @param {boolean} ifPushNewSpawnTask 传入值被用来判断是否在interval到了的时候进行新的生成creep任务推送。
     * @param {TaskQueue} NewSpawnTaskQueue 新的spawn任务对象。会被用来推送。
     * @param {boolean} ifAllocateNewSpawnTaskToSpawn 是否在到时间后分配任务到spawn,如果现在不分配，会在下一次一起分配。
     * @param {boolean} hasPushed 是否已经完成推送任务到NewSpawnTaskQueue。
     *
     * @memberof TaskSetting
     */
    public inits(pushAtBeginning = false): void {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName] = {
            isMyRoom: false,
            runNow: true,
            ifPushNewSpawnTask: true,
            NewSpawnTaskQueue: [],
            ifAllocateNewSpawnTaskToSpawn: true,
            hasPushed: !pushAtBeginning,
            hasPushedToSpawn: false,
            runningNumber: 0,
            memory: {}
        };
    }

    public delete(): void {
        delete Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName];
    }

    /**
     * 运行函数来自动分配任务。
     *
     * @returns
     * -1：没有到指定时间或者this.runNow为false。
     * 0：执行成功。
     * 1：this.ifPushNewSpawnTask为false.
     * -2:该房间不属于你.
     * -3:dryRun执行成功。
     * @memberof TaskSetting
     */
    public run(dryRun = false): number {
        if (this.runNow !== true) {
            return -1;
        }

        if (!this.isMyRoom) {
            if (Game.rooms[this.roomName]?.controller?.my) {
                this.isMyRoom = true;
            } else {
                return -2;
            }
        }

        // this.runNow=false;
        if (this.ifPushNewSpawnTask && !dryRun) {
            const num = this.NewSpawnTaskQueue.length;
            const taskPool = new TaskPool<SpawnTaskInf>();
            const roomSpawnQueue = taskPool.initQueue("spawnQueue", Memory.rooms[this.roomName].taskPool);
            const NewSpawnTaskQueue = taskPool.initQueueFromTaskQueue(this.NewSpawnTaskQueue);
            while (taskPool.transTask(NewSpawnTaskQueue, roomSpawnQueue));
            taskPool.setQueue(roomSpawnQueue, "spawnQueue", Memory.rooms[this.roomName].taskPool);
            taskPool.setQueueFromTaskQueue(NewSpawnTaskQueue, this.NewSpawnTaskQueue);
            this.hasPushed = true;
            this.hasPushedToSpawn = true;
            this.runningNumber += num;
            return 0;
        }
        if (dryRun) {
            return -3;
        }
        return 1;
    }

    public pushTask(task: SpawnTaskInf): void {
        this.NewSpawnTaskQueue.push(task);
    }

    public pushTaskToSpawn(task: SpawnTaskInf): void {
        this.pushTask(task);
        this.hasPushedToSpawn = false;
        this.run();
    }

    public deleteTask(): void {
        // global.log(`[task]  前任务数量${this.runningNumber}`);
        this.runningNumber = this.runningNumber - 1;
        // global.log(`[task]  后任务数量${this.runningNumber}`);
    }

    public get isMyRoom(): boolean {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].isMyRoom;
    }
    public set isMyRoom(bool: boolean) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].isMyRoom = bool;
    }

    public get runNow(): boolean {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].runNow;
    }
    public set runNow(bool: boolean) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].runNow = bool;
    }

    public get ifPushNewSpawnTask(): boolean {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].ifPushNewSpawnTask;
    }
    public set ifPushNewSpawnTask(bool: boolean) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].ifPushNewSpawnTask = bool;
    }

    public get NewSpawnTaskQueue(): SpawnTaskInf[] {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].NewSpawnTaskQueue;
    }
    public set NewSpawnTaskQueue(Queue: SpawnTaskInf[]) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].NewSpawnTaskQueue = Queue;
    }

    public get ifAllocateNewSpawnTaskToSpawn(): boolean {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName]
            .ifAllocateNewSpawnTaskToSpawn;
    }
    public set ifAllocateNewSpawnTaskToSpawn(bool: boolean) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][
            this.roomTaskName
        ].ifAllocateNewSpawnTaskToSpawn = bool;
    }

    public get hasPushed(): boolean {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].hasPushed;
    }
    public set hasPushed(bool: boolean) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].hasPushed = bool;
    }

    public get hasPushedToSpawn(): boolean {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].hasPushedToSpawn;
    }
    public set hasPushedToSpawn(bool: boolean) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].hasPushedToSpawn = bool;
    }

    public get runningNumber(): number {
        return Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].runningNumber;
    }
    public set runningNumber(runningNumber: number) {
        Memory.rooms[this.roomName].taskSetting[this.roomTaskKindName][this.roomTaskName].runningNumber = runningNumber;
    }
}
