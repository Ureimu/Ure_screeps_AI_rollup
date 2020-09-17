
/**
* 生成身体部件列表的简化输入类型，属性名代表部件名，属性值代表生成部件数量。repeat属性指定重复次数。
*/
type bpgGene = {
    [bodypartsName in BodyPartConstant|'repeat']?: number;
};

declare namespace NodeJS {
    interface Global {
        log: any,
        detail: ()=>void,
        bpg: (arg0: Array<bpgGene>)=>BodyPartConstant[],
        GenedGetBodyparts: Array<bpgGene>,
        GenedGetBodypartsNum: Array<bpgGene>,
        GenedBodypartsList: BodyPartConstant[],
        GenedBodypartsNum: number,
        GenedgetBpEnergyBodyparts:Array<bpgGene>,
        GenedgetBpEnergyBodypartsCost:number
        prototypeMounted: boolean,
        getNewSource():void,
        getNum(arg0: number):number,
        CreepEnergyMonitorprototypeMounted:boolean,
    }
}

type Sponsor = Id<StructureSpawn|Creep|Source>;

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
     * 任务的发起者的id
     *
     * @type {Sponsor}可以是任何建筑或creep,source
     * @memberof Task
     */
    sponsor?: Sponsor,
    /**
     * 标识该任务是否在执行状态。
     *
     * @type {boolean}
     * @memberof Task
     */
    isRunning: boolean,
    /**
     * 该对象存放了任务信息
     *
     * @type {{
     *         [name: string]: string,
     *     }}
     * @memberof Task
     */
    spawnInf?: {
        bodyparts: bpgGene[],
        creepName: string,
    },
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
    task: Task,
    taskPool?: TaskPool,
    bodyparts: bpgGene[],
    dontPullMe?: boolean,
}

interface SourceMemory {
    id: Id<Source>,
    blankSpace: RoomPosition[],
    taskPool: TaskPool,
}

interface Source {
    /**
     * 返回周围正方形区域的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace(): RoomPosition[],

    /**
     * source的名称.
     *
     * @type {string}
     * @memberof Source
     */
    name: string,

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

    /**
     * 任务管理函数。用来检测是否需要推送任务。
     *
     * @param {()=>bpgGene[]} manage_bodyParts 一个函数，返回bpgGene对象。
     * @memberof Source
     */
    check():CheckStatus,
}

type CheckStatus = {
    update: boolean,//更新参数
    updateData: {[name: string]: any},
    pushTask: boolean,//推送任务
    pushTaskData: {[name: string]: any},
    changeStatus: boolean,//改变任务状态
    changeStatusData: {[name: string]: any},
}

interface ControllerMemory {
    id: Id<StructureController>,
    taskPool: TaskPool
}

interface StructureController {
    memory: ControllerMemory,
}

interface ExtensionMemory {
    id: Id<StructureExtension>,
    taskPool: TaskPool
}

interface StructureExtension {
    memory: ExtensionMemory,
}

interface ExtractorMemory {
    id: Id<StructureExtractor>,
    taskPool: TaskPool
}

interface StructureExtractor {
    memory: ExtractorMemory,
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
    testvalue1 : boolean,
    testvalue2 : boolean,
    testvalue : boolean,
}

interface RoomTaskInte{
        isMyRoom: boolean,
        //interval: number,
        runNow: boolean,
        ifPushNewSpawnTask: boolean,
        NewSpawnTaskQueue: TaskQueue,
        ifAllocateNewSpawnTaskToSpawn: boolean,
        //nextPushTimePoint : number,
        hasPushed: boolean,
}

interface RoomMemory{
    taskPool: TaskPool,
    pushTaskSet: {[name:string]: RoomTaskInte};
}

interface SpawnMemory {
    taskPool: TaskPool,
}
