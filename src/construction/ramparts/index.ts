import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { getMinCut } from "construction/utils/minCut";
import { putConstructionSites } from "construction/utils/putConstructionSites";

export function putRampartConstructionSites(room: Room) {
    //初始化memory
    initConstructionScheduleMemory(room,"rampart");
    initConstructionMemory(room,"rampart",STRUCTURE_RAMPART);
    //求放置位置
    let ramparts = getMinCut(room.name)
    //放置工地
    putConstructionSites(room,ramparts,"rampart",STRUCTURE_RAMPART);
}
