interface RoomMemory{
    constructionStartTime: number,
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
}
