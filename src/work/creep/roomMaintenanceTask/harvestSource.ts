import { isPosEqual } from "utils/findEx";

export function harvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    if(!global.creepMemory[creep.name]){
        global.creepMemory[creep.name]={};
        let source = <Source>Game.getObjectById(<Id<Source>>creep.memory.task.sponsor);
        let posList = creep.room.memory.construction?.["innerSourceContainer"].memory.bundledPos;
        let conPosList = creep.room.memory.construction?.["innerSourceContainer"].pos;
        let countx = undefined;
        for(let i =0,j=posList.length;i<j;i++){
            console.log(JSON.stringify(posList[i])+JSON.stringify(source.pos));
            if(isPosEqual(posList[i],source.pos)){
                countx = i;
            }
        }
        if(typeof countx != "undefined"){
            global.creepMemory[creep.name].bundledPos=new RoomPosition(conPosList[countx].x,conPosList[countx].y,conPosList[countx].roomName);
        }
    }
    let source = <Source>Game.getObjectById(<Id<Source>>creep.memory.task.sponsor);
    creep.room.memory.construction?.["innerSourceContainer"].memory.bundledPos
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(global.creepMemory[creep.name].bundledPos?global.creepMemory[creep.name].bundledPos:source, {
            visualizePathStyle: {
                stroke: "#ffaa00"
            }
        });
    }
}
