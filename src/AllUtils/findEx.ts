export function lookForStructure(pos: RoomPosition|undefined,structureType: StructureConstant):AnyStructure|undefined{
    if(typeof pos === 'undefined') return;
    for(let i of pos.lookFor(LOOK_STRUCTURES)){
        if(i.structureType == structureType){
            return <AnyStructure>Game.getObjectById(i.id);
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
