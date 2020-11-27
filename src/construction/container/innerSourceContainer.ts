import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putInnerContainerConstructionSites(room: Room) {
    let sourceTargets = room.find(FIND_SOURCES);
    for(let i=0 ; i<2; i++){
        let path = PathFinder.search(Game.spawns[room.memory.firstSpawnName].pos,{pos:sourceTargets[i].pos,range: 1},{maxOps: 5000});
        if(path.path.length>0){
            let lastpoint = <RoomPosition>path.path.pop();
            putConstructionSites(room,[lastpoint],"innerSourceContainer",STRUCTURE_CONTAINER,sourceTargets[i].pos);
        }
    }
}
