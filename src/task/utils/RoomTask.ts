import taskPool from "./taskPool";

/**
 * 房间任务对象。
 * 主要功能：
 * 1.简化对memory的操作。
 * 2.提供更容易操作的任务api。
 * 3.将任务创建逻辑和任务推送逻辑分离，该模块只负责任务储存和推送。
 *
 * @export
 * @class RoomTask
 */
export class RoomTask {
    public roomName: string;
    public roomTaskName: string;

    public constructor(roomName: string, roomTaskName: string, pushAtBeginning = false) {
        this.roomName = roomName;
        this.roomTaskName = roomTaskName;
        if (typeof Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName] == "undefined") {
            Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName] = {
                isMyRoom: false,
                // interval: 1500,
                runNow: true,
                ifPushNewSpawnTask: true,
                NewSpawnTaskQueue: [],
                ifAllocateNewSpawnTaskToSpawn: true,
                // nextPushTimePoint: Game.time + 1500,
                hasPushed: pushAtBeginning,
                hasPushedToSpawn: false
            };
        }
    }

    /**
     *
     * 初始化一个房间任务对象。
     * @param {boolean} ismyRoom 是否判断该房间为已经拥有的房间，如果判断为没有拥有的房间，则到时间也不会执行任务
     * @param {boolean} runNow 是否立即执行，nextPushTimePoint的值会因此立即重置。
     * @param {boolean} ifPushNewSpawnTask 传入值被用来判断是否在interval到了的时候进行新的生成creep任务推送。
     * @param {TaskQueue} NewSpawnTaskQueue 新的spawn任务对象。会被用来推送。
     * @param {boolean} ifAllocateNewSpawnTaskToSpawn 是否在到时间后分配任务到spawn,如果现在不分配，会在下一次一起分配。
     * @param {boolean} hasPushed 是否已经完成推送任务到NewSpawnTaskQueue。
     *
     * @memberof RoomTask
     */
    public inits(): void {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName] = {
            isMyRoom: false,
            // interval: 1500,
            runNow: true,
            ifPushNewSpawnTask: true,
            NewSpawnTaskQueue: [],
            ifAllocateNewSpawnTaskToSpawn: true,
            // nextPushTimePoint: Game.time + 1500,
            hasPushed: false,
            hasPushedToSpawn: false
        };
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
     * @memberof RoomTask
     */
    public run(dryRun = false): number {
        if (/* Game.time!=this.nextPushTimePoint &&*/ this.runNow !== true) {
            return -1;
        }

        if (this.isMyRoom) {
            if (
                !!Game.rooms[this.roomName] &&
                Game.rooms[this.roomName].controller &&
                Game.rooms[this.roomName].controller?.my
            ) {
                return -2;
            }
        }

        // this.runNow=false;
        if (this.ifPushNewSpawnTask && !dryRun) {
            const roomSpawnQueue = taskPool.initQueue("spawnQueue", Memory.rooms[this.roomName].taskPool);
            const NewSpawnTaskQueue = taskPool.initQueueFromTaskQueue(this.NewSpawnTaskQueue);
            while (taskPool.transTask(NewSpawnTaskQueue, roomSpawnQueue));
            taskPool.setQueue(roomSpawnQueue, "spawnQueue", Memory.rooms[this.roomName].taskPool);
            taskPool.setQueueFromTaskQueue(NewSpawnTaskQueue, this.NewSpawnTaskQueue);
            this.hasPushed = true;
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
    /*
    get interval() {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].interval;
    }
    set interval(number: number) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].interval = number;
    }
*/

    public pushTaskToSpawn(task: SpawnTaskInf): void {
        this.pushTask(task);
        this.hasPushedToSpawn = false;
        this.run();
    }

    public get isMyRoom(): boolean {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].isMyRoom;
    }
    public set isMyRoom(bool: boolean) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].isMyRoom = bool;
    }

    public get runNow(): boolean {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].runNow;
    }
    public set runNow(bool: boolean) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].runNow = bool;
    }

    public get ifPushNewSpawnTask(): boolean {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].ifPushNewSpawnTask;
    }
    public set ifPushNewSpawnTask(bool: boolean) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].ifPushNewSpawnTask = bool;
    }

    public get NewSpawnTaskQueue(): SpawnTaskInf[] {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].NewSpawnTaskQueue;
    }
    public set NewSpawnTaskQueue(Queue: SpawnTaskInf[]) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].NewSpawnTaskQueue = Queue;
    }

    public get ifAllocateNewSpawnTaskToSpawn(): boolean {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].ifAllocateNewSpawnTaskToSpawn;
    }
    public set ifAllocateNewSpawnTaskToSpawn(bool: boolean) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].ifAllocateNewSpawnTaskToSpawn = bool;
    }

    /*
    get nextPushTimePoint() {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].nextPushTimePoint;
    }
    set nextPushTimePoint(number: number) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].nextPushTimePoint = number;
    }
*/

    public get hasPushed(): boolean {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].hasPushed;
    }
    public set hasPushed(bool: boolean) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].hasPushed = bool;
    }

    public get hasPushedToSpawn(): boolean {
        return Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].hasPushedToSpawn;
    }
    public set hasPushedToSpawn(bool: boolean) {
        Memory.rooms[this.roomName].innerRoomTaskSet[this.roomTaskName].hasPushedToSpawn = bool;
    }
}
