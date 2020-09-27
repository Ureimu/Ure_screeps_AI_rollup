export function roadToSource(room: Room) {
    let sourceTargets = room.find(FIND_SOURCES)
    let path_s: RoomPosition[] = [];
    for(let i=0 ; i<2; i++){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:sourceTargets[i].pos,range: 1},{maxOps: 5000})
        for(let roadPos of path.path){
            room.createConstructionSite(roadPos,STRUCTURE_ROAD);
        }
        path_s.push(...path.path);
    }
    room.memory.construction["roadToSource"] = {
        constructionSitesCompleted: true,
        pos: path_s,
        structureType:STRUCTURE_ROAD,
        memory: {}
    };
}
