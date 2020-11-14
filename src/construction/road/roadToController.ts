import { putConstructionSites } from "construction/utils/putConstructionSites";

export function roadToController(room: Room) {
    if(room.controller){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:room.controller.pos,range: 3},{maxOps: 20000});
        putConstructionSites(room,path.path,"roadToController",STRUCTURE_ROAD,room.controller.pos);
    }
}
