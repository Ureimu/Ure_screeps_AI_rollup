function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"sourceScout"> {
    return target.task.taskName === "sourceScout";
}

export function sourceScout(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName;
        if (scoutRoomName) {
            creep.moveTo(new RoomPosition(25, 25, scoutRoomName));
        }
    }
}
