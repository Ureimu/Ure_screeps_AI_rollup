import { RoleCreepMemory } from "../creepMemory";
import { stateCut } from "../utils/utils";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"buildAndRepair"> {
    return target.task.taskName === "buildAndRepair";
}

export function buildAndRepair(creep: Creep): void {
    creep.getGlobalMemory();
    const ifHarvesting = stateCut(
        creep,
        [() => Number(creep.store[RESOURCE_ENERGY] === 0), () => Number(creep.store.getFreeCapacity() !== 0)],
        0
    );

    if (ifHarvesting) {
        creep.getEnergy([
            { sourceContainer: { num: (creep.room.controller as StructureController)?.level > 1 ? 900 : 0 } }
        ]);
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
        if ((creep.room.controller as StructureController).level === 1) whatToDo = "upgrade";
        creep.say(whatToDo);
        switch (whatToDo) {
            case "repair":
                repair(creep, targetsToFix);
                break;

            case "build":
                {
                    const closestTarget = creep.pos.findClosestByRange(targets);
                    if (closestTarget) {
                        if (creep.pos.isEqualTo(closestTarget.pos)) {
                            // 避免卡住constructionSites
                            creep.move(_.random(1, 8) as DirectionConstant); // 随机移动
                        }
                        if (Game.time % 40 === 0)
                            global.log(`${closestTarget.progressTotal}:${closestTarget.progress}`);
                        if (creep.build(closestTarget) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestTarget, {
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
                if (
                    !creep.pos.isEqualTo(
                        global.creepMemory[creep.name].bundledUpgradePos ||
                            (creep.room.controller as StructureController)
                    )
                ) {
                    creep.moveTo(
                        global.creepMemory[creep.name].bundledUpgradePos ||
                            (creep.room.controller as StructureController),
                        {
                            visualizePathStyle: {
                                stroke: "#ffffff"
                            }
                        }
                    );
                }
                creep.upgradeController(creep.room.controller as StructureController);
                break;
            default:
                break;
        }
    }
}

function repair(creep: Creep, targetsToFix: AnyStructure[]) {
    if (isRoleCreepMemory(creep.memory)) {
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
