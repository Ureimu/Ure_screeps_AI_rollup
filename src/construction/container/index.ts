import { initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";
import { putcontrollerSourceContainerConstructionSites } from "./controllerSourceContainer";
import { putInnerContainerConstructionSites } from "./innerSourceContainer";

export function putContainerConstructionSites(roomName: string) {
    let room = Game.rooms[roomName];
    let indexList = [putInnerContainerConstructionSites, putcontrollerSourceContainerConstructionSites];
    initConstructionScheduleMemory(room,"baseContainer");
    for (let func of indexList) {
        func(room);
    }
}
