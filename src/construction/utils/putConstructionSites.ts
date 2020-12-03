import { isPosEqual } from "utils/findEx";
import { initConstructionMemory } from "construction/utils/initConstructionMemory";
import { getPosfromStr, setPosToStr } from "./strToRoomPosition";

export function putConstructionSites(room: Room, posList: RoomPosition[], name: string, structureType:StructureConstant, bundledPos?: RoomPosition[]) {
    let listC = [];
    let posStrList:string[] = [];
    posList.forEach((pos)=>{posStrList.push(setPosToStr(pos))})
    let posListSet = new Set(posStrList);
    posList = [];
    posListSet.forEach((pos)=>{posList.push(getPosfromStr(pos))})
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
                    let pos = getPosfromStr(x)
                    let y = new RoomPosition(pos.x,pos.y,pos.roomName);
                    if(y.isEqualTo(posList[i])){
                        countx[1]=1;
                        break;
                    }
                }
                if(countx[1]==1){
                    break;
                }
                room.memory.construction[name].pos.push(setPosToStr(posList[i]));
                let posStrList:string[] = [];
                if(bundledPos){
                    bundledPos.forEach((pos)=>{posStrList.push(setPosToStr(pos))})
                    let bundledPosSet = new Set(posStrList);
                    room.memory.construction[name].memory.bundledPos.forEach((posStr)=>{bundledPosSet.add(posStr)})
                    posStrList = [];
                    bundledPosSet.forEach((posStr)=>{posStrList.push(posStr)})
                    room.memory.construction[name].memory.bundledPos = posStrList;
                }
                countx[0]=1;
                break;
            }
        }
        if(countx[0]==0){
            listC[i] = room.createConstructionSite(posList[i], structureType);
            if (listC[i] == OK) {
                room.memory.construction[name].pos.push(setPosToStr(posList[i]));
                let posStrList:string[] = [];
                if(bundledPos){
                    bundledPos.forEach((pos)=>{posStrList.push(setPosToStr(pos))})
                    let bundledPosSet = new Set(posStrList);
                    room.memory.construction[name].memory.bundledPos.forEach((posStr)=>{bundledPosSet.add(posStr)})
                    posStrList = [];
                    bundledPosSet.forEach((posStr)=>{posStrList.push(posStr)})
                    room.memory.construction[name].memory.bundledPos = posStrList;
                }
            }
        }
    }
    if (room.memory.construction[name].pos.length == posList.length) {
        room.memory.construction[name].constructionSitesCompleted = true;
    }
}

export function RoomPositionMemListToRoomPositionList(posStrList:RoomPositionMem[]):RoomPosition[]{
    let posList = [];
    for(let posStr of posStrList){
        posList.push(new RoomPosition(posStr.x,posStr.y,posStr.roomName));
    }
    return posList;
}
