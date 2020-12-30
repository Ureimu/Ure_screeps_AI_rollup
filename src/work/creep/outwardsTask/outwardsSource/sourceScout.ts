import { RoleCreepMemory } from "work/creep/creepMemory";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"sourceScout"> {
    return target.task.taskName === "sourceScout";
}

export function sourceScout(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName;
        if (scoutRoomName) {
            if (creep.room.name !== scoutRoomName) {
                creep.moveTo(new RoomPosition(25, 25, scoutRoomName));
            } else {
                if (!global.creepMemory[creep.name]?.bundledPos) {
                    global.creepMemory[creep.name] = {};
                    global.creepMemory[creep.name].bundledPos = creep.pos.findClosestPlain();
                }
                creep.moveTo(global.creepMemory[creep.name].bundledPos || new RoomPosition(25, 25, scoutRoomName));

                if (
                    !Memory.rooms[creep.memory.task.spawnInf.roomName].taskSetting[`outwardsSource-${scoutRoomName}`]
                        .oHarvestSource.memory.numberSetting
                )
                    Memory.rooms[creep.memory.task.spawnInf.roomName].taskSetting[
                        `outwardsSource-${scoutRoomName}`
                    ].oHarvestSource.memory.numberSetting = creep.room.find(FIND_SOURCES).length;
            }
        }
    }
}
