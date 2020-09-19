export function roadToSource(room: Room) {
    let sourceTargets = room.find(FIND_SOURCES)
    for(let i=0 ; i<2; i++){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:sourceTargets[i].pos,range: 1})
        for(let roadPos of path.path){
            room.createConstructionSite(roadPos,STRUCTURE_ROAD);
        }
    }
    room.memory.construction["roadToSource"] = {
        constructionSitesCompleted: true,
        pos: []
    };
}
