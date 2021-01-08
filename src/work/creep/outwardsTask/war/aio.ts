import { stateCut } from "work/creep/utils/utils";

export function aio(creep: Creep): void {
    const state = stateCut(creep, [() => Number(creep.room.name === "E23S43"), () => 1], 0);

    switch (state) {
        case 0: {
            const x = new RoomPosition(43, 34, "E23S43");
            const hostileCreeps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostileCreeps) {
                creep.rangedAttack(hostileCreeps);
                creep.heal(creep);
            }
            creep.moveTo(x);
            break;
        }
        case 1:
            {
                {
                    if (creep.room.controller?.safeMode) {
                        const wall1 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: i => {
                                return i.structureType === STRUCTURE_WALL;
                            }
                        });
                        if (wall1) {
                            creep.moveTo(wall1);
                        }
                        break;
                    }
                }
                creep.heal(creep);
                const hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                const wall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: i => {
                        return i.structureType === STRUCTURE_WALL;
                    }
                });
                if (hostileCreeps?.[0]) {
                    if (creep.rangedAttack(hostileCreeps[0]) === ERR_NOT_IN_RANGE) {
                        if (wall) {
                            if (creep.moveTo(hostileCreeps[0]) === ERR_NO_PATH) {
                                creep.moveTo(wall);
                            }
                        }
                    }
                }
            }
            break;
        default:
            break;
    }
}
