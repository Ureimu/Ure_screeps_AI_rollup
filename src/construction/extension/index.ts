import { initConstructionMemory, initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites, RoomPositionMemListToRoomPositionList } from "construction/utils/putConstructionSites";
import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function putExtensionConstructionSites(roomName: string) {//TODO 改进放置位置
    let room = Game.rooms[roomName];
    initConstructionScheduleMemory(room,"extension");
    initConstructionMemory(room,"extension",STRUCTURE_EXTENSION);
    if(room.memory.construction["roadAroundExtension"].constructionSitesCompleted == true){
        let extensionPos: RoomPosition[] = [];
        room.memory.construction["extension"].memory.calculatedPosList?.forEach((posStr)=>{extensionPos.push(getPosfromStr(posStr))})
        putConstructionSites(room, extensionPos, "extension", STRUCTURE_EXTENSION);
    }
}
