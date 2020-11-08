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
            default:
                break;
        }
    }
    towerR(room.name);
}
