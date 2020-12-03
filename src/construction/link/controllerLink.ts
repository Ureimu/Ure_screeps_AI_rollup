import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites } from "construction/utils/putConstructionSites";
import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function putControllerLinkConstructionSites(room: Room) {
    //初始化memory
    initConstructionScheduleMemory(room,"controllerLink");
    initConstructionMemory(room,"controllerLink",STRUCTURE_LINK);
    //求放置位置
    let ContainerPosList:RoomPosition[] = [];
    let posList:RoomPosition[] = [];
    room.memory.construction["controllerSourceContainer"].pos.forEach((posStr)=>{ContainerPosList.push(getPosfromStr(posStr))})
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
    console.log("[build] 放置controllerLink")
    putConstructionSites(room,posList,"controllerLink",STRUCTURE_LINK,[(<StructureController>room.controller).pos]);
}
