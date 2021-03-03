import { RoleCreepMemory } from "work/creep/creepMemory";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"sourceScout"> {
    return target.task.taskName === "sourceScout";
}

export function sourceScout(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName;
        const spawnRoomName = creep.memory.task.spawnInf.roomName;
        if (scoutRoomName) {
            if (creep.room.name !== scoutRoomName) {
                creep.moveTo(new RoomPosition(25, 25, scoutRoomName));
            } else {
                if (!global.creepMemory[creep.name]?.bundledPos) {
                    global.creepMemory[creep.name] = {};
                    global.creepMemory[creep.name].bundledPos = creep.pos.findClosestPlain();
                }
                creep.moveTo(global.creepMemory[creep.name].bundledPos || new RoomPosition(25, 25, scoutRoomName));

                const sourceTaskName = `outwardsSource-${scoutRoomName}`;
                const taskSetting = Memory.rooms[spawnRoomName].taskSetting[sourceTaskName];
                if (taskSetting) {
                    if (!taskSetting?.oHarvestSource.memory.numberSetting)
                        taskSetting.oHarvestSource.memory.numberSetting = creep.room.find(FIND_SOURCES).length;
                    if (Game.time % 10 === 0) {
                        const invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                            filter: object => {
                                return object.structureType === STRUCTURE_INVADER_CORE;
                            }
                        })?.[0];
                        if (invaderCore && !taskSetting.oInvaderCoreAttacker.memory.numberSetting)
                            taskSetting.oInvaderCoreAttacker.memory.numberSetting = 1;

                        if (!invaderCore && taskSetting.oInvaderCoreAttacker.memory.numberSetting)
                            taskSetting.oInvaderCoreAttacker.memory.numberSetting = 0;

                        const invader = creep.room.find(FIND_HOSTILE_CREEPS)?.[0];
                        if (invader && !taskSetting.oInvaderAttacker.memory.numberSetting)
                            taskSetting.oInvaderAttacker.memory.numberSetting = 1;

                        if (!invader && taskSetting.oInvaderAttacker.memory.numberSetting)
                            taskSetting.oInvaderAttacker.memory.numberSetting = 0;
                    }
                }
            }
        }
    }
}
