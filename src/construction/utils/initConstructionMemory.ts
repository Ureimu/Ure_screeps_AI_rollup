export function initConstructionMemory(room: Room, name: string, structureType: StructureConstant): void {
    if (!room.memory.construction[name]) {
        room.memory.construction[name] = {
            constructionSitesCompleted: false,
            pos: [],
            structureType,
            memory: {},
            id: []
        };
    }
}

export function initConstructionScheduleMemory(room: Room, name: string): void {
    if (!room.memory.constructionSchedule[name]) {
        room.memory.constructionSchedule[name] = {
            constructionCompleted: false
        };
    }
}
