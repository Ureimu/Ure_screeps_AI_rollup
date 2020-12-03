import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites } from "construction/utils/putConstructionSites";
import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function putSourceLinkConstructionSites(room: Room) {
    //初始化memory
    initConstructionScheduleMemory(room,"sourceLink");
    initConstructionMemory(room,"sourceLink",STRUCTURE_LINK);
    //求放置位置
    let ContainerPosList:RoomPosition[] = [];
    let posList:RoomPosition[] = [];
    let bundledPosList:RoomPosition[] = [];
    room.memory.construction["sourceContainer"].memory.bundledPos.forEach((posStr)=>{bundledPosList.push(getPosfromStr(posStr))})
    room.memory.construction["sourceContainer"].pos.forEach((posStr)=>{ContainerPosList.push(getPosfromStr(posStr))})
    for(let containerPos of ContainerPosList){
        for(let pos of containerPos.getSquare()){
            let x = pos.lookFor(LOOK_STRUCTURES);
            let terrain: Terrain[] = pos.lookFor(LOOK_TERRAIN);
            if (x.length == 0 && terrain[0] != "wall") {
                posList.push(pos);
                break;
            }
        }
    }
    //放置工地
    console.log("[build] 放置sourceLink")
    putConstructionSites(room,posList,"sourceLink",STRUCTURE_LINK,bundledPosList);
}
