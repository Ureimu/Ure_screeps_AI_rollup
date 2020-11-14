import { putConstructionSites } from "construction/utils/putConstructionSites";

export function roadToSource(room: Room) {
    let sourceTargets = room.find(FIND_SOURCES)
    for(let i=0 ; i<2; i++){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:sourceTargets[i].pos,range: 1},{maxOps: 20000})
        putConstructionSites(room,path.path,"roadToSource",STRUCTURE_ROAD,sourceTargets[i].pos);
    }
}
