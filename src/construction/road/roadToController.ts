export function roadToController(room: Room) {
    let path_s: RoomPosition[] = [];
    if(room.controller){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:room.controller.pos,range: 3},{maxOps: 5000})
        for(let roadPos of path.path){
            room.createConstructionSite(roadPos,STRUCTURE_ROAD);
        }
        path_s=path.path;
    }
    room.memory.construction["roadToController"] = {
        constructionSitesCompleted: true,
        pos: path_s,
        structureType:STRUCTURE_ROAD
    };
}
