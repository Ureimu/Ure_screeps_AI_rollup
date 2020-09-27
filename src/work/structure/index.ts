import { tower } from "./tower/tower";
import { towerR } from "./tower/towerRoom";

export function runStructure() {
    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            let myStructures= Game.rooms[roomName].find(FIND_MY_STRUCTURES);
            let structures= Game.rooms[roomName].find(FIND_STRUCTURES);
            for(let myStructure of myStructures){
                if(myStructure.structureType == 'tower'){
                    tower(myStructure);
                }
            }
            towerR(roomName);
        }
    }
}