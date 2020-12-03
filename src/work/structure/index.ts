import { lookForStructureName } from "utils/findEx";
import { centerLink } from "./link/centerLink";
import { controllerLink } from "./link/controllerLink";
import { linkRunTask } from "./link/linkRunTask";
import { sourceLink } from "./link/sourceLink";
import { storage } from "./storage/storage";
import { tower } from "./tower/tower";
import { towerR } from "./tower/towerRoom";

export function runStructure(room:Room) {
    let myStructures= room.find(FIND_MY_STRUCTURES);
    let structures= room.find(FIND_STRUCTURES);
    for(let myStructure of myStructures){
        switch (myStructure.structureType) {
            case 'tower':
                tower(myStructure);
                break;
            case "storage":
                storage(myStructure);
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
            default:
                break;
        }
    }
    towerR(room.name);
    linkRunTask(room);
}
