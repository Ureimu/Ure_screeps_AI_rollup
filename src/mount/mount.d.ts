interface RoomPosition {
    getSquare(): RoomPosition[];
    getDiagSquare(): RoomPosition[];
    getQuadSquare(): RoomPosition[];
}

interface Room {
    autoSafeMode(): void;
    initMemory(ifFarming: boolean): void;
    autoPlanConstruction(): void;
    roomVisualize(): void;
    runStructure(): void;
    manageTask(): void;
}

interface StructureSpawn {
    runSpawnTask(): boolean;
    spawnTask(): void;
}

interface SpawnMemory {
    stack?: [string, unknown, (...args: unknown[]) => unknown][];
}

interface RoomMemory {
    stack?: [string, unknown, (...args: unknown[]) => unknown][];
}

interface PowerCreepMemory {
    stack?: [string, unknown, (...args: unknown[]) => unknown][];
}

interface FlagMemory {
    stack?: [string, unknown, (...args: unknown[]) => unknown][];
}

interface Source {
    /**
     * 返回周围正方形区域的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace(): RoomPosition[];

    /**
     * source的名称.
     *
     * @type {string}
     * @memberof Source
     */
    name: string;

    /**
     * 初始化source的memory.
     *
     * @memberof Source
     */
    initsMemory(): void;

    /**
     * 任务管理函数。用来检测是否需要推送任务。
     *
     * @param {()=>bpgGene[]} manage_bodyParts 一个函数，返回bpgGene对象。
     * @memberof Source
     */
    check(): CheckStatus;
}

interface Creep {
    getEnergy(lowerLimit: { [name: string]: { num: number; takeAll?: boolean } }[]): string;
    transportResource(target: AnyStructure, resourceType: ResourceConstant): boolean;
    getResourceFromStructure(structure: AnyStoreStructure, resourceType: ResourceConstant): void;
}

interface CreepMemory {
    stack?: [string, unknown, (...args: unknown[]) => unknown][];
}

declare namespace NodeJS {
    interface Global {
        time: number;
        testMode: boolean;
        workRate: { [name: string]: number | string; manageTask: number; construction: number; spawn: number };
        log: any;
        detail: () => void;
        bpg: (arg0: bpgGene[]) => BodyPartConstant[];
        GenedGetBodyparts: bpgGene[];
        GenedGetBodypartsNum: bpgGene[];
        GenedBodypartsList: BodyPartConstant[];
        GenedBodypartsNum: number;
        GenedgetBpEnergyBodyparts: bpgGene[];
        GenedgetBpEnergyBodypartsCost: number;
        prototypeMounted: boolean;
        getNewSource(): void;
        repushTask(): void;
        getNum(arg0: number): number;
        CreepEnergyMonitorprototypeMounted: boolean;
        memoryReset(): void;
        spawnTaskList: { [name: string]: { [name: string]: (roomName: string) => BaseTaskInf[] } };
        newTask(roomName: string, taskName: string): void;
        deleteTask(creepName: string): void;
        war: any;
        help(): string;
        stateLoop: { [name: string]: () => void };
        state: { [name: string]: boolean | number };
        GUI: GUIclass;
        testX: {
            logger: string;
            gridLayout?: string;
            gridLayoutRoom?: string;
        };
        monitor: {
            upgradeSpeed: number[];
        };
        testError: () => Error;
    }
}
