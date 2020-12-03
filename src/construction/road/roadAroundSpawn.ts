import { putConstructionSites } from "construction/utils/putConstructionSites";

export function roadAroundSpawn(room: Room) {
    let spawnAround = Game.spawns[room.memory.firstSpawnName].pos.getDiagSquare()
    putConstructionSites(room,spawnAround,"roadAroundSpawn",STRUCTURE_ROAD,[Game.spawns[room.memory.firstSpawnName].pos]);
}
