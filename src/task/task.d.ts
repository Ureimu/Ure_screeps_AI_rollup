
/**
 * 任务的类，包含优先级属性和任务信息。
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
    priority: number,

    /**
     * 任务的发起者的id
     *
     * @type {Sponsor}可以是任何建筑或creep,source
     * @memberof BaseTask
     */
    sponsor?: Sponsor,
    /**
     * 标识该任务是否在执行状态。
     *
     * @type {boolean}
     * @memberof BaseTask
     */
    isRunning: boolean,
    /**
     * 该对象存放了任务信息
     *
     * @type {{
     *         [name: string]: string,
     *     }}
     * @memberof BaseTask
     */
    taskInf: {
        [name: string]: any,
    }
}

interface SpawnTaskInf extends BaseTaskInf{
    spawnInf: {
        bodyparts: bpgGene[],
        creepName: string,
    },
}

interface CreepTaskInf extends BaseTaskInf{
    missionInf: {
        [name: string]: any,
    }
}

interface CarryCreepTaskInf extends CreepTaskInf{

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
    [name: string]: BaseTaskInf[],
}

interface RoomTaskInte{
    isMyRoom: boolean,
    runNow: boolean,
    ifPushNewSpawnTask: boolean,
    NewSpawnTaskQueue: SpawnTaskInf[],
    ifAllocateNewSpawnTaskToSpawn: boolean,
    hasPushed: boolean,
    hasPushedToSpawn: boolean,
}
