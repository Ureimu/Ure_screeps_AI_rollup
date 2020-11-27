import { lookForStructureByPos } from "utils/findEx";
import { initConstructionMemory, initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";
import { getPosfromStr, setPosToStr } from "construction/utils/strToRoomPosition";

export function putTowerConstructionSites(roomName: string) {//TODO 改进放置位置
    let room = Game.rooms[roomName];
    initConstructionScheduleMemory(room,"tower");
    initConstructionMemory(room,"tower",STRUCTURE_TOWER);
    if(room.memory.construction["roadToSource"].constructionSitesCompleted == true){
        let road = room.memory.construction["roadToSource"].pos;
        road.pop();
        road.pop();
        road.shift();
        road.shift();
        for(let roadPosStr of road){
            let roadPos = getPosfromStr(roadPosStr);
            let pos = new RoomPosition(roadPos.x,roadPos.y,roadPos.roomName);
            let square = pos.getSquare();
            for(let exPos of square){
                let x = lookForStructureByPos(exPos,STRUCTURE_ROAD);
                if(typeof x === "undefined"){
                    let returnCode = room.createConstructionSite(exPos,STRUCTURE_TOWER);
                    if(returnCode == ERR_RCL_NOT_ENOUGH){
                        return;
                    } else if(returnCode == OK){
                        room.memory.construction["tower"].pos.push(setPosToStr(exPos));
                    }
                }
            }
        }
    }
}
