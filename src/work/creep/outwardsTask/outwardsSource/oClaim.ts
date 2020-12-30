import { RoleCreepMemory } from "work/creep/creepMemory";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oClaim"> {
    return target.task.taskName === "oClaim";
}

export function oClaim(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName as string;
        const roomToClaim = Game.rooms[scoutRoomName];
        if (creep.room.name !== scoutRoomName) {
            creep.moveTo(new RoomPosition(25, 20, scoutRoomName));
        } else if (roomToClaim.controller) {
            if (creep.reserveController(roomToClaim.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(roomToClaim.controller);
            }
        }
    }
}
