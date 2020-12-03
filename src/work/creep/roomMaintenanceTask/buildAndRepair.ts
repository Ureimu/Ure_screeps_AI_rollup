import { stateCut } from "../utils/utils";

export function buildAndRepair(creep: Creep): void {
    let ifHarvesting = stateCut(
        creep,
        [() => ~~(creep.store[RESOURCE_ENERGY] == 0), () => ~~(creep.store.getFreeCapacity() != 0)],
        0
    );

    if (ifHarvesting) {
        creep.getEnergy([{ sourceContainer: 900 }]);
    } else {
        let whatToDo = "";
        let targetsToFix = creep.room.find(FIND_STRUCTURES, {
            filter: object => {
                return( object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART)&&object.hits < object.hitsMax * 0.25;
            }
        });
        let wallsToFix = creep.room.find(FIND_STRUCTURES, {
            filter: object => {
                return( object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART)&&object.hits < 20000
            }
        });
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targetsToFix.length > 0) {
            whatToDo = "repair";
        } else if (targets.length > 0) {
            whatToDo = "build";
        } else if (wallsToFix.length>0){
            whatToDo = "repairWall";
        } else {
            whatToDo = "upgrade"
        }
        creep.say(whatToDo)
        switch (whatToDo) {
            case "repair":
                repair(creep,targetsToFix);
                break;

            case "build":
                let cloestTarget = creep.pos.findClosestByRange(targets);
                if (cloestTarget) {
                    if(creep.pos.isEqualTo(cloestTarget.pos)){//避免卡住constructionSites
                        creep.move(<DirectionConstant>_.random(1,8))//随机移动
                    }
                    if (creep.build(cloestTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(cloestTarget, {
                            visualizePathStyle: {
                                stroke: "#ffffff"
                            }
                        });
                    }
                }
                break;

            case "repairWall":
                repair(creep,wallsToFix);
                break;

            case "upgrade":
                if (creep.upgradeController(<StructureController>creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(<StructureController>creep.room.controller, {
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

function repair (creep:Creep,targetsToFix:AnyStructure[]) {
    if (!creep.memory.task.taskInf.lastRenovate) {
        let targets = targetsToFix
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
        } else if (
            creep.upgradeController(<StructureController>creep.room.controller) == ERR_NOT_IN_RANGE
        ) {
            creep.moveTo(<StructureController>creep.room.controller, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    } else if (creep.memory.task.taskInf.lastRenovate) {
        let target_x = <AnyStructure | undefined>Game.getObjectById(creep.memory.task.taskInf.lastRenovate);
        if (!target_x) {
            creep.memory.task.taskInf.lastRenovate = null;
        } else {
            if (
                target_x.hits >= creep.memory.task.taskInf.lastRenovateHit + 100000 ||
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
        }
    } else {
        creep.say("error");
    }
}
