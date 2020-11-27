import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putSpawnSourceContainerConstructionSites(room: Room) {
    if(room.controller){
        let spawnAround = Game.spawns[room.memory.firstSpawnName].pos.getSquare();
        let lastpoint = <RoomPosition>spawnAround.pop();
        putConstructionSites(room,[lastpoint],"spawnSourceContainer",STRUCTURE_CONTAINER,Game.spawns[room.memory.firstSpawnName].pos);
    }
}
