import { putContainerConstruction } from "./utils";

export function putSpawnSourceContainerConstructionSites(room: Room) {
    if(room.controller){
        let spawnAround = room.find(FIND_MY_SPAWNS)[0].pos.getSquare();
        let lastpoint = <RoomPosition>spawnAround.pop();
        putContainerConstruction(room,[lastpoint],"spawnSourceContainer");
    }
}
