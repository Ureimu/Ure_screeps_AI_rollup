import { stateCut } from "../utils/utils";

function isRoledCreepMemory(target: CreepMemory): target is RoledCreepMemory<"buildAndRepair"> {
    return target.task.taskType === "buildAndRepair";
}

export function buildAndRepair(creep: Creep): void {
    const ifHarvesting = stateCut(
        creep,
        [() => Number(creep.store[RESOURCE_ENERGY] === 0), () => Number(creep.store.getFreeCapacity() !== 0)],
        0
    );

    if (ifHarvesting) {
        creep.getEnergy([{ sourceContainer: 900 }]);
    } else {
        let whatToDo = "";
        const targetsToFix = creep.room.find(FIND_STRUCTURES, {
            filter: object => {
                return (
                    object.structureType !== STRUCTURE_WALL &&
                    object.structureType !== STRUCTURE_RAMPART &&
                    object.hits < object.hitsMax * 0.25
                );
            }
        });
        const wallsToFix = creep.room.find(FIND_STRUCTURES, {
            filter: object => {
                return (
                    (object.structureType === STRUCTURE_WALL || object.structureType === STRUCTURE_RAMPART) &&
                    object.hits < 20000
                );
            }
        });
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targetsToFix.length > 0) {
            whatToDo = "repair";
        } else if (targets.length > 0) {
            whatToDo = "build";
        } else if (wallsToFix.length > 0) {
            whatToDo = "repairWall";
        } else {
            whatToDo = "upgrade";
        }
        creep.say(whatToDo);
        switch (whatToDo) {
            case "repair":
                repair(creep, targetsToFix);
                break;

            case "build":
                {
                    const cloestTarget = creep.pos.findClosestByRange(targets);
                    if (cloestTarget) {
                        if (creep.pos.isEqualTo(cloestTarget.pos)) {
                            // 避免卡住constructionSites
                            creep.move(_.random(1, 8) as DirectionConstant); // 随机移动
                        }
                        if (creep.build(cloestTarget) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(cloestTarget, {
                                visualizePathStyle: {
                                    stroke: "#ffffff"
                                }
                            });
                        }
                    }
                }
                break;

            case "repairWall":
                repair(creep, wallsToFix);
                break;

            case "upgrade":
                if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller as StructureController, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
}

function repair(creep: Creep, targetsToFix: AnyStructure[]) {
    if (isRoledCreepMemory(creep.memory)) {
        if (!creep.memory.task.taskInf) return;
        if (!creep.memory.task.taskInf.lastRenovate) {
            const targets = targetsToFix;
            targets.sort((a, b) => a.hits - b.hits);
            if (targets.length > 0) {
                creep.memory.task.taskInf.lastRenovate = targets[0].id;
                creep.memory.task.taskInf.lastRenovateHit = targets[0].hits;
                if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                }
            } else if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller as StructureController, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        } else if (creep.memory.task.taskInf.lastRenovate) {
            const targetX = Game.getObjectById<AnyStructure>(creep.memory.task.taskInf.lastRenovate);
            if (!targetX) {
                creep.memory.task.taskInf.lastRenovate = null;
            } else {
                if (
                    targetX.hits >= creep.memory.task.taskInf.lastRenovateHit + 100000 ||
                    targetX.hits === targetX.hitsMax
                ) {
                    creep.memory.task.taskInf.lastRenovate = null;
                } else if (creep.repair(targetX) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetX, {
                        visualizePathStyle: {
                            stroke: "#ffaa00"
                        }
                    });
                }
            }
        } else {
            creep.say("error");
        }
    }
}
