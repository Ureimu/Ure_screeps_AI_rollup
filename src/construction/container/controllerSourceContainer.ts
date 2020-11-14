import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putControllerSourceContainerConstructionSites(room: Room) {
    if(room.controller){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:room.controller.pos,range: 3},{maxOps: 5000})
        if(path.path.length>0){
            let lastpoint = <RoomPosition>path.path.pop();
            putConstructionSites(room,[lastpoint],"controllerSourceContainer",STRUCTURE_CONTAINER,room.controller.pos);
        }
    }
}
