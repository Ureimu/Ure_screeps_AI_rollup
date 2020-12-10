/**
 * 任务的基本类，包含优先级属性。不建议直接使用，而应使用继承对应功能的类。
 *
 * @interface BaseTask
 */
interface BaseTaskInf {
    /**
     * 任务的优先级，是一个实数
     *
     * @type {number}
     * @memberof BaseTask
     */
    priority: number;

    /**
     * 任务的发起者的id
     *
     * @type {Sponsor}可以是任何建筑或creep,source
     * @memberof BaseTask
     */
    sponsor?: Sponsor;
    /**
     * 标识该任务是否在执行状态。
     *
     * @type {boolean}
     * @memberof BaseTask
     */
    isRunning: boolean;

    taskType: string;
}

interface SpawnTaskInf extends BaseTaskInf {
    spawnInf: {
        bodyparts: bpgGene[];
        creepName: string;
        roomName: string;
    };
    taskInf?: {
        state: number[];
    };
}

interface CreepTaskInf extends BaseTaskInf {
    taskInf: Record<string, unknown>;
}

interface CarryTaskInf extends BaseTaskInf {
    taskInf: {
        resourceType: ResourceConstant;
        structureCarryFrom: string;
        structureCarryTo: string;
        resourceNumber: number;
        state: [];
    };
}

interface LinkTaskInf extends BaseTaskInf {
    taskInf: {
        resourceType: RESOURCE_ENERGY;
        linkTransferFrom: Id<StructureLink>;
        linkTransferTo: Id<StructureLink>;
        resourceNumber: number;
        state: [];
    };
}

/**
 * 任务队列，是任务对象组成的数组。
 *
 * @type TaskQueue
 */

/**
 * 任务池，由多个任务队列组成。
 *
 * @interface TaskPool
 */
interface TaskPool {
    [name: string]: BaseTaskInf[];
}

interface RoomTaskInte {
    isMyRoom: boolean;
    runNow: boolean;
    ifPushNewSpawnTask: boolean;
    NewSpawnTaskQueue: SpawnTaskInf[];
    ifAllocateNewSpawnTaskToSpawn: boolean;
    hasPushed: boolean;
    hasPushedToSpawn: boolean;
}
