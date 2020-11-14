export function initConstructionMemory(room: Room,name: string,structureType: StructureConstant) {
    if(!room.memory.construction[name]){
        room.memory.construction[name] = {
            constructionSitesCompleted: false,
            pos: [],
            structureType: structureType,
            memory: {
                bundledPos: []
            },
        };
    }
}

export function initConstructionScheduleMemory(room: Room,name: string){
    if(!room.memory.constructionSchedule[name]){
        room.memory.constructionSchedule[name] = {
            constructionCompleted : false,
        }
    }
}
