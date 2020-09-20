interface RoomMemory{
    constructionStartTime: number,
    construction: {
        [name:string]: constructionSitesInf
    };
}

interface constructionSitesInf{
    constructionSitesCompleted: boolean,
    pos: RoomPosition[],
}
