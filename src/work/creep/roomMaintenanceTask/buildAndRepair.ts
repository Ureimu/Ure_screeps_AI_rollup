import { getEnergy, stateCut } from "../utils/utils";

export function buildAndRepair(creep: Creep): void {
    let ifHarvesting = stateCut(
        creep,
        [() => ~~(creep.store[RESOURCE_ENERGY] == 0), () => ~~(creep.store.getFreeCapacity() != 0)],
        0
    );

    if (ifHarvesting) {
        getEnergy(creep,["innerSourceContainer"]);
    } else {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        let cloestTarget = creep.pos.findClosestByRange(targets);
        if (cloestTarget) {
            if (creep.build(cloestTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(cloestTarget, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        } else {
            if (!creep.memory.task.taskInf.lastRenovate) {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax - 2200
                });
                targets.sort((a, b) => a.hits - b.hits);
                if (targets.length > 0) {
                    creep.memory.task.taskInf.lastRenovate = targets[0].id;
                    creep.memory.task.taskInf.lastRenovateHit = targets[0].hits;
                    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {
                            visualizePathStyle: {
                                stroke: "#ffaa00"
                            }
                        });
                    }
                }
            } else if (creep.memory.task.taskInf.lastRenovate) {
                let target_x = <AnyStructure>Game.getObjectById(creep.memory.task.taskInf.lastRenovate);
                if (
                    target_x.hits >= creep.memory.task.taskInf.lastRenovateHit + 120000 ||
                    target_x.hits == target_x.hitsMax
                ) {
                    creep.memory.task.taskInf.lastRenovate = null;
                } else if (creep.repair(target_x) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target_x, {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                }
            } else {
                creep.say("error");
            }
        }
    }
}
