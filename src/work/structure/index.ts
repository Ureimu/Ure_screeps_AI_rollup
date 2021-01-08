import { centerLink } from "./link/centerLink";
import { controllerLink } from "./link/controllerLink";
import { linkRunTask } from "./link/linkRunTask";
import { sourceLink } from "./link/sourceLink";
import { runStorage } from "./storage/storage";
import { towerR } from "./tower/towerRoom";
import { runTower } from "./tower/tower";
import { errorStackVisualize } from "visual/roomVisual/GUIsetting";

export function runStructure(room: Room): void {
    const myStructures = room.find(FIND_MY_STRUCTURES);
    for (const myStructure of myStructures) {
        try {
            switch (myStructure.structureType) {
                case "tower":
                    runTower(myStructure);
                    break;
                case "storage":
                    runStorage(myStructure);
                    break;
                case "link":
                    switch (myStructure.buildingName()) {
                        case "centerLink":
                            centerLink(myStructure);
                            break;
                        case "controllerLink":
                            controllerLink(myStructure);
                            break;
                        case "sourceLink":
                            sourceLink(myStructure);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        } catch (err) {
            errorStackVisualize((err as { stack: string }).stack);
        }
    }
    towerR(room.name);
    linkRunTask(room);
}
