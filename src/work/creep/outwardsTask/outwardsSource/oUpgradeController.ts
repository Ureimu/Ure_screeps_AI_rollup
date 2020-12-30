import { RoleCreepMemory } from "work/creep/creepMemory";
import { stateCut } from "work/creep/utils/utils";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oUpgradeController"> {
    return target.task.taskName === "oUpgradeController";
}

export function oUpgradeController(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
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
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: resource => {
                        return resource.resourceType === RESOURCE_ENERGY && resource.amount >= 50;
                    }
                });
                if (target) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    });
                    creep.pickup(target);
                }
            } else {
                creep.moveTo(new RoomPosition(25, 20, scoutRoomName), {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        } else {
            if (
                !creep.pos.isEqualTo(
                    global.creepMemory[creep.name]?.bundledUpgradePos || (spawnRoom.controller as StructureController)
                )
            ) {
                creep.moveTo(
                    global.creepMemory[creep.name]?.bundledUpgradePos || (spawnRoom.controller as StructureController),
                    {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    }
                );
            }
            creep.upgradeController(spawnRoom.controller as StructureController);
        }
    }
}
