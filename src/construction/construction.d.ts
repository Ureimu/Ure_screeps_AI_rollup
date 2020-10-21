interface RoomMemory{
    constructionStartTime: number,
    roomControlLevel: number,//用来与上一次建造时做比较，在每次升级时会重新建造一次
    construction: {
        [name:string]: constructionSitesInf
    };
    constructionSchedule: {
        [name:string]: {
            constructionCompleted: boolean,
        }

    }
}

interface constructionSitesInf{
    constructionSitesCompleted: boolean,
    pos: RoomPosition[],
    structureType: StructureConstant,
    memory: {
        [name:string]: any
    }
}
