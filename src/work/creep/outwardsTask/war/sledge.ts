import { stateCut } from "work/creep/utils/utils";

export function sledge(creep: Creep): void {
    const state = stateCut(creep, [() => Number(creep.room.name === "E23S43"), () => 1], 0);

    switch (state) {
        case 0: {
            const x = new RoomPosition(43, 34, "E23S43");
            creep.moveTo(x);
            const walls = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: i => {
                    return i.structureType === STRUCTURE_WALL;
                }
            });
            if (walls) {
                creep.moveTo(walls);
            }
            break;
        }
        case 1:
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
                const hostileSpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
                const wall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: i => {
                        return i.structureType === STRUCTURE_WALL;
                    }
                });
                if (!!hostileSpawns && !!hostileSpawns[0]) {
                    if (creep.dismantle(hostileSpawns[0]) === ERR_NOT_IN_RANGE) {
                        if (!!wall && creep.dismantle(wall) === ERR_NOT_IN_RANGE) {
                            if (creep.moveTo(hostileSpawns[0]) === ERR_NO_PATH) {
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
