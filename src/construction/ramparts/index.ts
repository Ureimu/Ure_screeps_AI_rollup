import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { getMinCut } from "construction/utils/minCut";
import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putRampartConstructionSites(room: Room) {
    initConstructionScheduleMemory(room,"rampart");
    initConstructionMemory(room,"rampart",STRUCTURE_RAMPART);
    let spawnAround = getMinCut(room.name)
    putConstructionSites(room,spawnAround,"rampart",STRUCTURE_RAMPART);
}
