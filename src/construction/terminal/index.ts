import { getCenterConstruction } from "construction/utils/centerConstruction";
import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites } from "construction/utils/putConstructionSites";
import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function putTerminalConstructionSites(room: Room) {
    //初始化memory
    initConstructionScheduleMemory(room,"terminal");
    initConstructionMemory(room,"terminal",STRUCTURE_TERMINAL);
    //求放置位置
    let Center = getCenterConstruction(room)
    //放置工地
    putConstructionSites(room,[getPosfromStr(Center[3])],"terminal",STRUCTURE_TERMINAL);
}
