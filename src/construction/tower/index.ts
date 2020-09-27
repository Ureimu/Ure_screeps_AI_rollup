import { lookForStructureByPos } from "AllUtils/findEx";
import { initConstructionMemory, initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";

export function putTowerConstructionSites(roomName: string) {
    let room = Game.rooms[roomName];
    initConstructionScheduleMemory(room,"tower");
    initConstructionMemory(room,"tower",STRUCTURE_TOWER);
    if(room.memory.construction["roadToSource"].constructionSitesCompleted == true){
        let road = room.memory.construction["roadToSource"].pos;
        for(let roadPos of road){
            let pos = new RoomPosition(roadPos.x,roadPos.y,roadPos.roomName);
            let square = pos.getSquare();
            for(let exPos of square){
                let x = lookForStructureByPos(exPos,STRUCTURE_ROAD);
                if(typeof x === "undefined"){
                    let returnCode = room.createConstructionSite(exPos,STRUCTURE_TOWER);
                    if(returnCode == ERR_RCL_NOT_ENOUGH){
                        return;
                    }
                }
            }
        }
    }
}
