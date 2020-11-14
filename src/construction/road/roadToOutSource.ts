import { putConstructionSites } from "construction/utils/putConstructionSites";

export function roadToOutSource(room: Room, outRoom:Room) {
    let sourceTargets = outRoom.find(FIND_SOURCES)
    let path_s: RoomPosition[] = [];
    for(let i=0 ; i<sourceTargets.length; i++){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:sourceTargets[i].pos,range: 1},{maxOps: 100000})
        putConstructionSites(room,path.path,"roadToOutSource",STRUCTURE_ROAD,sourceTargets[i].pos);
    }
}
