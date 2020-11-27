interface RoomMemory{
    constructionStartTime: number,
    roomControlStatus: number[],//用来与上一次建造时做比较，在每次升级时会重新建造一次
    construction: {
        [name:string]: constructionSitesInf
    },
    constructionSchedule: {
        [name:string]: {
            constructionCompleted: boolean,
            centerPos?:RoomPositionMem[]
        }
    },
    firstSpawnName:string,
}
/**
 * 这个是为了和RoomPosition区分开的接口。只需要有x,y,roomName三个属性。
 *
 * @interface RoomPositionMem
 */
interface RoomPositionMem {
    x: number,
    y: number,
    roomName: string
}

/**
 * RoomPosition字符串，格式为x0y0rE0S0
*/
type RoomPositionStr = string

interface constructionSitesInf{
    constructionSitesCompleted: boolean,
    pos: RoomPositionStr[],
    structureType: StructureConstant,
    memory: {
        [name:string]: any,
        bundledPos:RoomPositionStr[]
        calculatedPosList?:RoomPositionStr[]
    }
}

declare namespace NodeJS {
    interface Global {
        minCut:any;
    }
}
