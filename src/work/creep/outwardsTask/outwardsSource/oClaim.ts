import { isGoodRoom } from "construction/chooseNewRoom";
import { RoleCreepMemory } from "work/creep/creepMemory";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oClaim"> {
    return target.task.taskName === "oClaim";
}

export function oClaim(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName as string;
        const roomToClaim = Game.rooms[scoutRoomName];
        if (creep.room.name !== scoutRoomName) {
            const code = creep.moveTo(new RoomPosition(25, 20, scoutRoomName));
            if (code !== OK) global.log(`${code} , moveToScoutRoom`);
        } else if (roomToClaim.controller) {
            if (isGoodRoom(creep.room) === "GoodForHarvest" || isGoodRoom(creep.room) === "NG") {
                const code0 = creep.reserveController(roomToClaim.controller);
                if (code0 === ERR_NOT_IN_RANGE) {
                    const code = creep.moveTo(roomToClaim.controller);
                    if (code !== OK) global.log(`${code} , moveToController`);
                } else {
                    if (code0 !== OK) global.log(`${creep.name} ${code0} , reserveController`);
                }
            } else {
                const code0 = creep.claimController(roomToClaim.controller);
                if (code0 === ERR_NOT_IN_RANGE) {
                    const code = creep.moveTo(roomToClaim.controller);
                    if (code !== OK) global.log(`${code} , moveToController`);
                } else {
                    if (code0 !== OK) global.log(`${creep.name} ${code0} , claimController`);
                }
            }
        }
    }
}
