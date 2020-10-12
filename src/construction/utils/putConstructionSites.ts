import { isPosEqual } from "AllUtils/findEx";
import { initConstructionMemory } from "construction/utils/initConstructionMemory";

export function putConstructionSites(room: Room, posList: RoomPosition[], name: string, structureType:StructureConstant) {
    let listC = [];
    initConstructionMemory(room, name, structureType);
    for (let i = 0; i < posList.length; i++) {
        let countx = [0];
        let structures = room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == structureType;
            }
        })
        for(let structure of structures){
            if(isPosEqual(structure.pos,posList[i])){
                room.memory.construction[name].pos.push(posList[i]);
                countx[0]=1;
                break;
            }
        }
        if(countx[0]==0){
            listC[i] = room.createConstructionSite(posList[i], structureType);
            if (listC[i] == OK) {
                room.memory.construction[name].pos.push(posList[i]);
            }
        }
    }
    if (room.memory.construction[name].pos.length == posList.length) {
        room.memory.construction[name].constructionSitesCompleted = true;
    }
}
