import { centerLink } from "./link/centerLink";
import { controllerLink } from "./link/controllerLink";
import { linkRunTask } from "./link/linkRunTask";
import { lookForStructureName } from "utils/findEx";
import { sourceLink } from "./link/sourceLink";
import { runStorage } from "./storage/storage";
import { towerR } from "./tower/towerRoom";
import { runTower } from "./tower/tower";

export function runStructure(room: Room): void {
    const myStructures = room.find(FIND_MY_STRUCTURES);
    for (const myStructure of myStructures) {
        switch (myStructure.structureType) {
            case "tower":
                runTower(myStructure);
                break;
            case "storage":
                runStorage(myStructure);
                break;
            case "link":
                switch (lookForStructureName(myStructure)) {
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
    }
    towerR(room.name);
    linkRunTask(room);
}
