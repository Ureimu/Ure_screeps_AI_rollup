import { RoleCreepMemory } from "work/creep/creepMemory";
import { stateCut } from "work/creep/utils/utils";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oUpgradeController"> {
    return target.task.taskName === "oUpgradeController";
}

export function oUpgradeController(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const sourceId: Id<Source> = creep.memory.task.sponsor as Id<Source>;
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName as string;
        const scoutRoom = Game.rooms[scoutRoomName];
        const spawnRoomName = creep.memory.task.spawnInf.roomName;
        const spawnRoom = Game.rooms[spawnRoomName];
        if (spawnRoomName === creep.room.name) {
            creep.getGlobalMemory();
        }
        const ifHarvesting = stateCut(
            creep,
            [() => Number(creep.store[RESOURCE_ENERGY] === 0), () => Number(creep.store.getFreeCapacity() !== 0)],
            0
        );

        // 控制器签名
        if ((scoutRoom?.controller?.sign?.username as string) !== scoutRoom?.controller?.owner?.username) {
            if (creep.signController(scoutRoom.controller as StructureController, "testing")) {
                creep.moveTo(scoutRoom.controller as StructureController, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        }

        if (ifHarvesting) {
            if (scoutRoomName === creep.room.name) {
                creep.getEnergy(undefined, sourceId);
            } else if (scoutRoomName) {
                creep.moveTo(new RoomPosition(25, 20, scoutRoomName), {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        } else {
            if (spawnRoomName === creep.room.name) {
                const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length > 0) {
                    {
                        const closestTarget = creep.pos.findClosestByRange(targets);
                        if (closestTarget) {
                            if (creep.pos.isEqualTo(closestTarget.pos)) {
                                // 避免卡住constructionSites
                                creep.move(_.random(1, 8) as DirectionConstant); // 随机移动
                            }
                            if (creep.build(closestTarget) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(closestTarget, {
                                    visualizePathStyle: {
                                        stroke: "#ffffff"
                                    }
                                });
                            }
                        }
                    }
                } else {
                    if (
                        !creep.pos.isEqualTo(
                            global.creepMemory[creep.name]?.bundledUpgradePos ||
                                (spawnRoom.controller as StructureController)
                        )
                    ) {
                        creep.moveTo(
                            global.creepMemory[creep.name]?.bundledUpgradePos ||
                                (spawnRoom.controller as StructureController),
                            {
                                visualizePathStyle: {
                                    stroke: "#ffffff"
                                }
                            }
                        );
                    }
                    creep.upgradeController(spawnRoom.controller as StructureController);
                }
            } else {
                creep.moveTo(spawnRoom.controller as StructureController);
            }
        }
    }
}
