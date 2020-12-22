interface RoomMemory {
    startTime: number;
    roomControlStatus: number[]; // 用来与上一次建造时做比较，在每次升级时会重新建造一次
    construction: {
        [name: string]: constructionSitesInf;
    };
    constructionSchedule: {
        [name: string]: {
            constructionCompleted: boolean;
            layout?: formedLayout;
            [name: string]: any;
            centerPos?: any;
            creepWorkPos?: {
                [name: string]: string[] | undefined;
                harvestSource?: string[];
                upgradeController?: string[];
                centerPos?: string[];
            };
        };
    };
    firstSpawnName: string;
}

type formedLayout = {
    [structureName in BuildableStructureConstant]?: {
        [name: string]: { posStrList: string[]; levelToBuild?: number };
    };
};
/**
 * 这个是为了和RoomPosition区分开的接口。只需要有x,y,roomName三个属性。
 *
 * @interface RoomPositionMem
 */
interface RoomPositionMem {
    x: number;
    y: number;
    roomName: string;
}

/**
 * RoomPosition字符串，格式为x0y0rE0S0
 */
type RoomPositionStr = string;

interface constructionSitesInf {
    constructionSitesCompleted: boolean;
    pos: RoomPositionStr[];
    structureType: StructureConstant;
    memory: {
        [name: string]: {
            hasPushed?: boolean;
            bundledPos?: RoomPositionStr[];
            calculatedPosList?: RoomPositionStr[];
        };
    };
}

declare namespace NodeJS {
    interface Global {
        minCut: any;
    }
}
