import { initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";
import { putControllerSourceContainerConstructionSites } from "./controllerSourceContainer";
import { putInnerContainerConstructionSites } from "./sourceContainer";
import { putSpawnSourceContainerConstructionSites } from "./spawnSourceContainer";

export function putContainerConstructionSites(roomName: string) {
    let room = Game.rooms[roomName];
    let indexList = [putInnerContainerConstructionSites, putControllerSourceContainerConstructionSites
    ,putSpawnSourceContainerConstructionSites];
    initConstructionScheduleMemory(room,"baseContainer");
    for (let func of indexList) {
        func(room);
    }
}
