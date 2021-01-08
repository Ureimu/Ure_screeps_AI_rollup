import { RoleCreepMemory } from "work/creep/creepMemory";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oInvaderCoreAttacker"> {
    return target.task.taskName === "oInvaderCoreAttacker";
}

export function oInvaderCoreAttacker(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName as string;
        if (creep.room.name !== scoutRoomName) {
            creep.moveTo(new RoomPosition(25, 20, scoutRoomName));
        } else {
            const invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: object => {
                    return object.structureType === STRUCTURE_INVADER_CORE;
                }
            })?.[0];
            if (invaderCore) {
                if (creep.attack(invaderCore) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(invaderCore);
                }
            }
        }
    }
}
