import { lookForStructure } from "AllUtils/findEx";
import { initConstructionMemory, initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";

export function putExtensionConstructionSites(roomName: string) {
    let room = Game.rooms[roomName];
    initConstructionScheduleMemory(room,"extension");
    initConstructionMemory(room,"extension",STRUCTURE_EXTENSION);
    if(room.memory.construction["roadToSource"].constructionSitesCompleted == true){
        let road = room.memory.construction["roadToSource"].pos;
        for(let roadPos of road){
            let pos = new RoomPosition(roadPos.x,roadPos.y,roadPos.roomName);
            let square = pos.getSquare();
            for(let exPos of square){
                let x = lookForStructure(exPos,STRUCTURE_ROAD);
                if(typeof x === "undefined"){
                    let returnCode = room.createConstructionSite(exPos,STRUCTURE_EXTENSION);
                    if(returnCode == ERR_RCL_NOT_ENOUGH){
                        return;
                    }
                }
            }
        }
    }
}
