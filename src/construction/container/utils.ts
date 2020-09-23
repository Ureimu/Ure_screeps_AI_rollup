import { initConstructionMemory } from "construction/utils/initConstructionMemory";

export function putContainerConstruction(room: Room,posList: RoomPosition[], name: string) {
    let listC = [];
    initConstructionMemory(room,name,STRUCTURE_CONTAINER);
    for(let i = 0;i<posList.length;i++){
        listC[i] = room.createConstructionSite(posList[i],STRUCTURE_CONTAINER);
        if(listC[i]==OK){
            room.memory.construction[name].pos.push(posList[i]);
        }
    }
    if(room.memory.construction[name].pos.length == posList.length){
        room.memory.construction[name].constructionSitesCompleted = true;
    }
}
