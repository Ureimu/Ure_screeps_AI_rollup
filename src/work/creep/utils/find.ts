import { Position } from "source-map";

export function findSpawnOrExtensionNotFull(creep: Creep) {
    return creep.room.find(FIND_STRUCTURES, {
        //标明房间内未装满的扩展和出生点
        filter: structure => {
            return (
                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
}

export function findContainerResourceLessThan(creep: Creep ,amount: number) {
    return creep.room.find(FIND_STRUCTURES, {
        //标明房间内未装满的扩展和出生点
        filter: structure => {
            return (
                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
}

export function lookForContainer(pos: RoomPosition|undefined):StructureContainer|undefined{
    if(typeof pos === 'undefined') return;
    for(let i of pos.lookFor(LOOK_STRUCTURES)){
        if(i.structureType == STRUCTURE_CONTAINER){
            return <StructureContainer>Game.getObjectById(i.id);
        }
    }
    return;
}

export function lookForStructurePos(creep:Creep,structureName:string):RoomPosition|undefined{
    if (
        !!Game.rooms[creep.room.name].memory.construction[structureName] &&
        !!Game.rooms[creep.room.name].memory.construction[structureName].pos[0]
    ) {
        let Pos = new RoomPosition(
            Game.rooms[creep.room.name].memory.construction[structureName].pos[0].x,
            Game.rooms[creep.room.name].memory.construction[structureName].pos[0].y,
            Game.rooms[creep.room.name].memory.construction[structureName].pos[0].roomName
        );
        return Pos
    } else {
        return;
    }
}
