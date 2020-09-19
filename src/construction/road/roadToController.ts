export function roadToController(room: Room) {
    if(room.controller){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:room.controller.pos,range: 3})
        for(let roadPos of path.path){
            room.createConstructionSite(roadPos,STRUCTURE_ROAD);
        }
    }
    room.memory.construction["roadToController"] = {
        constructionSitesCompleted: true,
        pos: []
    };
}
