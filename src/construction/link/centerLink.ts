import { getCenterConstruction } from "construction/utils/centerConstruction";
import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites } from "construction/utils/putConstructionSites";
import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function putCenterLinkConstructionSites(room: Room) {
    //初始化memory
    initConstructionScheduleMemory(room,"centerLink");
    initConstructionMemory(room,"centerLink",STRUCTURE_LINK);
    //求放置位置
    let Center = getCenterConstruction(room)
    //放置工地
    putConstructionSites(room,[getPosfromStr(Center[1])],"centerLink",STRUCTURE_LINK);
}
