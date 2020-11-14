import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putSpawnSourceContainerConstructionSites(room: Room) {
    if(room.controller){
        let spawnAround = room.find(FIND_MY_SPAWNS)[0].pos.getSquare();
        let lastpoint = <RoomPosition>spawnAround.pop();
        putConstructionSites(room,[lastpoint],"spawnSourceContainer",STRUCTURE_CONTAINER,room.find(FIND_MY_SPAWNS)[0].pos);
    }
}
