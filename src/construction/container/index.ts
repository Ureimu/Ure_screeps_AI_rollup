import { putcontrollerSourceContainerConstructionSites } from "./controllerSourceContainer";
import { putInnerContainerConstructionSites } from "./innerSourceContainer";

export function putContainerConstructionSites(roomName: string) {
    let room = Game.rooms[roomName];
    let indexList = [putInnerContainerConstructionSites, putcontrollerSourceContainerConstructionSites];

    for (let func of indexList) {
        func(room);
    }
}
