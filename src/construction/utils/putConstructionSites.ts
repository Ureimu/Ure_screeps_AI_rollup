import { isPosEqual } from "utils/findEx";
import { initConstructionMemory } from "construction/utils/initConstructionMemory";

export function putConstructionSites(room: Room, posList: RoomPosition[], name: string, structureType:StructureConstant, bundledPos?: RoomPositionStr) {
    let listC = [];
    initConstructionMemory(room, name, structureType);
    for (let i = 0; i < posList.length; i++) {
        let countx = [0,0];
        let structures = room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == structureType;
            }
        })
        for(let structure of structures){
            if(isPosEqual(structure.pos,posList[i])){
                for(let x of room.memory.construction[name].pos){
                    let y = new RoomPosition(x.x,x.y,x.roomName);
                    if(y.isEqualTo(posList[i])){
                        countx[1]=1;
                        break;
                    }
                }
                if(countx[1]==1){
                    break;
                }
                room.memory.construction[name].pos.push(posList[i]);
                if(bundledPos)room.memory.construction[name].memory.bundledPos.push(bundledPos)
                countx[0]=1;
                break;
            }
        }
        if(countx[0]==0){
            listC[i] = room.createConstructionSite(posList[i], structureType);
            if (listC[i] == OK) {
                room.memory.construction[name].pos.push(posList[i]);
                if(bundledPos)room.memory.construction[name].memory.bundledPos.push(bundledPos)
            }
        }
    }
    if (room.memory.construction[name].pos.length == posList.length) {
        room.memory.construction[name].constructionSitesCompleted = true;
    }
}
