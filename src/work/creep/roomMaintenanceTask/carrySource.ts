import { stateCut,getEnergy } from "work/creep/utils"

export function carrySource(creep: Creep): void {
    let ifHarvesting = stateCut(creep, creep.store[RESOURCE_ENERGY] < 50, creep.store.getFreeCapacity() == 0);

    if (ifHarvesting) {
        getEnergy(creep);
    } else {
        let targets = creep.room.find(FIND_STRUCTURES, {
            //标明房间内未装满的扩展和出生点
            filter: structure => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            }
        });
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}
