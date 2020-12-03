import { getCenterConstruction } from "construction/utils/centerConstruction";
import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites } from "construction/utils/putConstructionSites";
import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function putStorageConstructionSites(room: Room) {
    //初始化memory
    initConstructionScheduleMemory(room,"storage");
    initConstructionMemory(room,"storage",STRUCTURE_STORAGE);
    //求放置位置
    let Center = getCenterConstruction(room)
    //放置工地
    putConstructionSites(room,[getPosfromStr(Center[0])],"storage",STRUCTURE_STORAGE);
}
