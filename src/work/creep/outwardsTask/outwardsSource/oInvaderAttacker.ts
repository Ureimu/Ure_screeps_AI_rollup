import { RoleCreepMemory } from "work/creep/creepMemory";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oInvaderAttacker"> {
    return target.task.taskName === "oInvaderAttacker";
}

export function oInvaderAttacker(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName as string;
        if (creep.room.name !== scoutRoomName) {
            creep.moveTo(new RoomPosition(25, 20, scoutRoomName));
        } else {
            const invader = creep.room.find(FIND_HOSTILE_CREEPS)?.[0];
            if (invader) {
                if (creep.attack(invader) === ERR_NOT_IN_RANGE || creep.rangedAttack(invader) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(invader);
                }
            } else {
                const damagedCreep = creep.room.find(FIND_MY_CREEPS, {
                    filter: aCreep => {
                        return aCreep.hits < aCreep.hitsMax;
                    }
                })?.[0];
                if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedCreep);
                }
            }
        }
    }
}
