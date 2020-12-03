import { isPosEqual } from "utils/findEx";
import { initConstructionMemory } from "construction/utils/initConstructionMemory";
import { getPosfromStr, setPosToStr } from "construction/utils/strToRoomPosition";

export function runLayout(room:Room,layoutName:string,layoutFunc:(room:Room)=>void){
    if(!room.memory.constructionSchedule[layoutName]?.layout){
        layoutFunc(room)
    }

    let totalSitesNum = room.find(FIND_CONSTRUCTION_SITES).length;

    for(let constructionName in <formedLayout>room.memory.constructionSchedule[layoutName].layout){
        let construction = (<formedLayout>room.memory.constructionSchedule[layoutName].layout)[constructionName as BuildableStructureConstant];
        let buildNumberLimit = CONTROLLER_STRUCTURES[constructionName as BuildableStructureConstant][(<StructureController>room.controller).level];
        for(let buildingMemName in construction){
            let posStrList = construction[buildingMemName];
            totalSitesNum+=putConstructionSites(room,posStrList,buildingMemName,constructionName as BuildableStructureConstant,buildNumberLimit,totalSitesNum);
            if(totalSitesNum>=100){
                break;
            }
        }
    }
}

function putConstructionSites(room: Room, posStrList: string[], name: string, structureType:BuildableStructureConstant,buildNumberLimit:number,totalSitesNum:number):number {
    if(room.memory.construction[name]?.constructionSitesCompleted == true)return 0;
    let listC = [];
    let posList:RoomPosition[] = [];
    posStrList.forEach((posStr)=>{posList.push(getPosfromStr(posStr))});
    initConstructionMemory(room, name, structureType);
    for (let i = 0; i < posList.length; i++) {
        let countx = [0,0];
        let structures:{structureType:string,pos:RoomPosition,destory?:()=>number,remove?:()=>number}[] = room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == structureType;
            }
        })
        let constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
            filter: constructionSite => {
                return constructionSite.structureType == structureType;
            }
        })
        structures=structures.concat(constructionSites);
        for(let structure of structures){
            if(isPosEqual(structure.pos,posList[i])){
                for(let x of room.memory.construction[name].pos){
                    let pos = getPosfromStr(x)
                    if(pos.isEqualTo(posList[i])){
                        countx[1]=1;
                        break;
                    }
                }
                if(countx[1]==1){
                    break;
                }
                room.memory.construction[name].pos.push(setPosToStr(posList[i]));
                countx[0]=1;
                break;
            }
        }
        if(countx[0]==0){
            listC[i] = room.createConstructionSite(posList[i], structureType);
            if (listC[i] == OK) {
                totalSitesNum++;
                room.memory.construction[name].pos.push(setPosToStr(posList[i]));
                if(totalSitesNum>=100){
                    return totalSitesNum;
                }
            }
        }
    }
    if (room.memory.construction[name].pos.length == posList.length || room.memory.construction[name].pos.length == buildNumberLimit) {
        room.memory.construction[name].constructionSitesCompleted = true;
    }
    return totalSitesNum
}
