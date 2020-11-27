import { initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";
import { roadAroundExtension } from "./roadAroundExtension";
import { roadAroundSpawn } from "./roadAroundSpawn";
import { roadToController } from "./roadToController";
import { roadToOutSource } from "./roadToOutSource";
import { roadToSource } from "./roadToSource";

export function putRoadConstructionSites(roomName: string, outRoomName: string[]) {
    let room = Game.rooms[roomName];
    let indexList = [roadAroundExtension,roadToSource,roadToController,roadAroundSpawn];
    initConstructionScheduleMemory(room,"baseRoad");
    for(let func of indexList){
        func(room);
    }

    let indexListH = [roadToOutSource];
    for(let i = 0,j = outRoomName.length;i<j;i++){
        if(!!Game.rooms[outRoomName[i]]){
            let outRoom = Game.rooms[outRoomName[i]]
            initConstructionScheduleMemory(room,"outRoad"+outRoomName);
            for(let func of indexListH){
                func(room, outRoom);
            }
        }
    }
}
