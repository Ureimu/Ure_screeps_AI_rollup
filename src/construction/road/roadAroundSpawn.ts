import { putConstructionSites } from "construction/utils/putConstructionSites";

export function roadAroundSpawn(room: Room) {
    let spawnAround = room.find(FIND_MY_SPAWNS)[0].pos.getSquare();
    putConstructionSites(room,spawnAround,"roadAroundSpawn",STRUCTURE_ROAD);
}
