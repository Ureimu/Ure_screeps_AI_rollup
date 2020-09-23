export function roadAroundSpawn(room: Room) {
    let spawnAround = room.find(FIND_MY_SPAWNS)[0].pos.getSquare();
    for(let roadPos of spawnAround){
        room.createConstructionSite(roadPos,STRUCTURE_ROAD);
    }
    room.memory.construction["roadAroundSpawn"] = {
        constructionSitesCompleted: true,
        pos: [],
        structureType:STRUCTURE_ROAD
    };
}
