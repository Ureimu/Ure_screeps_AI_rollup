/**
* 生成身体部件列表的简化输入类型，属性名代表部件名，属性值代表生成部件数量。
*/
type bpgGene = {
    [bodypartsName in BodyPartConstant]?: number;
};

declare namespace NodeJS {
    interface Global {
        log: any,
        detail: ()=>void,
        bpg: (arg0: Array<bpgGene>)=>BodyPartConstant[],
        GenedGetBodyparts: Array<bpgGene>,
        GenedBodypartsList: BodyPartConstant[],
        prototypeMounted: boolean,
        getNewSource():void,
    }
}

/**
 * 任务的类，包含优先级属性和任务信息。
 *
 * @interface Task
 */
interface Task {
    /**
     * 任务的优先级，是一个实数
     *
     * @type {number}
     * @memberof Task
     */
    priority: number,

    /**
     * 该对象存放了任务信息
     *
     * @type {{
     *         [name: string]: string,
     *     }}
     * @memberof Task
     */
    taskInf: {
        [name: string]: any,
    }
}

/**
 * 任务队列，是任务对象组成的数组。
 *
 * @type TaskQueue
 */
type TaskQueue = Array<Task>;

/**
 * 任务池，由多个任务队列组成。
 *
 * @interface TaskPool
 */
interface TaskPool {
    [name: string]: TaskQueue,
}

interface CreepMemory {
    task: Task
}

interface SourceMemory {
    id: Id<Source>,
    blankSpace: number,
    taskPool: TaskPool
}

interface Source {
    /**
     * 返回周围正方形区域的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace(): number,

    /**
     * source的名称.
     *
     * @type {string}
     * @memberof Source
     */
    sourceName: string,

    /**
     * 初始化source的memory.
     *
     * @memberof Source
     */
    initsMemory(): void,

    /**
     * source的一个访问对应memory的捷径。
     *
     * @type {{[name: string]: SourceMemory}}
     * @memberof Source
     */
    memory: SourceMemory,
}

interface RoomPosition {
    getSquare(): RoomPosition[],

}

interface StructureSpawn {
    spawnTask():void,
}

interface Memory {
    sources: {[name: string]: SourceMemory},
    changebool: {
        newSource: boolean
    }
    taskPools: TaskPool,
}

interface RoomMemory{
    taskPool: TaskPool,
}

interface SpawnMemory {
    taskPool: TaskPool,
}
