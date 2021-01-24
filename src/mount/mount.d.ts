interface RoomPosition {
    getSquare(): RoomPosition[];
    getDiagSquare(): RoomPosition[];
    getQuadSquare(): RoomPosition[];
    findClosestPlain(): RoomPosition | undefined;
}

interface Room {
    autoSafeMode(): void;
    initMemory(ifFarming: boolean): void;
    autoPlanConstruction(): void;
    roomVisualize(): void;
    runStructure(): void;
    manageTask(): void;
    updateConstruction(): void;
    manageOutwardsSource(): void;
}

interface StructureSpawn {
    runSpawnTask(): boolean;
    spawnTask(): void;
}

interface StructureController {
    checkBlankSpace(): string[];
    initsGlobalMemory(): void;
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
    getName(): string;

    /**
     * 初始化source的memory.
     *
     * @memberof Source
     */
    initsMemory(): void;
}

interface Structure {
    // buildingName()(): string;
    buildingName(): string;
}

interface Creep {
    getEnergy(lowerLimit?: { [name: string]: { num: number; takeAll?: boolean } }[], id?: string): string;
    transportResource(target: AnyStructure, resourceType: ResourceConstant): boolean;
    getResourceFromStructure(structure: AnyStoreStructure, resourceType: ResourceConstant): void;
    getGlobalMemory(): void;
    transportEnergy(
        gList: {
            [name: string]:
                | {
                      isStorable: boolean;
                      upperLimit: number;
                  }
                | undefined;
        }[]
    ): void;
}

declare namespace NodeJS {
    interface Global {
        getLayout: any;
        runLayout: (roomName: string) => void;
        time: number;
        testMode: boolean;
        workRate: { [name: string]: number | string; manageTask: number; construction: number; spawn: number };
        clearError(): void;
        detail: () => void;
        rooms: {
            [name: string]: {
                controller?: { blankSpace: string[] };
            };
        };
        prototypeMounted: boolean;
        getNewSource(): void;
        repushTask(): void;
        getNum(arg0: number): number;
        CreepEnergyMonitorprototypeMounted: boolean;
        memoryReset(): void;
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
            [roomName: string]: {
                upgradeSpeed: number[];
                level: number;
            };
        };
        testError: () => Error;
        creepWorkFunctionList: {
            [name: string]: (creep: Creep) => void;
        };
        constructionMemory: { [id: string]: { name: string } };
    }
}
