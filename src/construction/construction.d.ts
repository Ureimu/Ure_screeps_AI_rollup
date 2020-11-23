interface RoomMemory{
    constructionStartTime: number,
    roomControlStatus: number[],//用来与上一次建造时做比较，在每次升级时会重新建造一次
    construction: {
        [name:string]: constructionSitesInf
    };
    constructionSchedule: {
        [name:string]: {
            constructionCompleted: boolean,
            centerPos?:RoomPositionStr[]
        }
    }
}
/**
 * 这个是为了和RoomPosition区分开的接口。
 *
 * @interface RoomPositionStr
 */
interface RoomPositionStr {
    x: number,
    y: number,
    roomName: string
}

interface constructionSitesInf{
    constructionSitesCompleted: boolean,
    pos: RoomPositionStr[],
    structureType: StructureConstant,
    memory: {
        [name:string]: any,
        bundledPos:RoomPositionStr[]
    }
}

declare namespace NodeJS {
    interface Global {
        minCut:any;
    }
}
