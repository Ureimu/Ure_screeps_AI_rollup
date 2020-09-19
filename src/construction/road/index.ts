import { roadAroundSpawn } from "./roadAroundSpawn";
import { roadToController } from "./roadToController";
import { roadToSource } from "./roadToSource";

export function putRoadConstructionSites(roomName: string) {
    let room = Game.rooms[roomName];
    let indexList = [roadToSource,roadToController,roadAroundSpawn];

    for(let func of indexList){
        func(room);
    }
}
