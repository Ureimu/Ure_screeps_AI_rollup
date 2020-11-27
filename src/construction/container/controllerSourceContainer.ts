import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putControllerSourceContainerConstructionSites(room: Room) {
    if(room.controller){
        let path = PathFinder.search(Game.spawns[room.memory.firstSpawnName].pos,{pos:room.controller.pos,range: 3},{maxOps: 5000})
        if(path.path.length>0){
            let lastpoint = <RoomPosition>path.path.pop();
            putConstructionSites(room,[lastpoint],"controllerSourceContainer",STRUCTURE_CONTAINER,room.controller.pos);
        }
    }
}
