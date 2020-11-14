import { isPosEqual } from "utils/findEx";
import { initConstructionMemory } from "construction/utils/initConstructionMemory";

export function putContainerConstruction(room: Room, posList: RoomPosition[], name: string, bundledPos: RoomPositionStr) {
    let listC = [];
    initConstructionMemory(room, name, STRUCTURE_CONTAINER);
    for (let i = 0; i < posList.length; i++) {
        let countx = [0];
        let containers = room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        })
        for(let container of containers){
            if(isPosEqual(container.pos,posList[i])){
                room.memory.construction[name].pos.push(posList[i]);
                room.memory.construction[name].memory.bundledPos.push(bundledPos)
                countx[0]=1;
                break;
            }
        }
        if(countx[0]==0){
            listC[i] = room.createConstructionSite(posList[i], STRUCTURE_CONTAINER);
            if (listC[i] == OK) {
                room.memory.construction[name].pos.push(posList[i]);
                room.memory.construction[name].memory.bundledPos.push(bundledPos)
            }
        }
    }
    if (room.memory.construction[name].pos.length >= posList.length) {
        room.memory.construction[name].constructionSitesCompleted = true;
    }
}
