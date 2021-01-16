import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { roleSettingList } from "task/taskClass/RoleSetting";
import { createOHarvestSourceTask } from "./outwardsSource/oHarvestSource";
import { createSourceScoutTask } from "./outwardsSource/sourceScout";
import { createHarvestSourceTask } from "./roomMaintenanceTask/harvestSource";
import { templateSpawnTaskList } from "./utils/templateTask";

function defaultGetSpawnTaskInf(
    room: Room,
    taskName: string,
    taskGroupName: string,
    num: number,
    priority: number
): SpawnTaskInf[] {
    return templateSpawnTaskList(room.name, taskName, taskGroupName, num, priority);
}

export function getRoleList(room: Room): roleSettingList {
    const level = room.controller?.level as number;
    const roomConstruction = room.memory.construction;
    const existStructure = (structureName: string) =>
        roomConstruction[structureName]?.memory
            ? Object.keys(roomConstruction[structureName]?.memory).length > 0
            : false;
    const existContainer = (roomName: string) => {
        return Object.values(Memory.rooms[roomName].sources).some(memory => typeof memory.container !== "undefined");
    };
    const roleListX: roleSettingList = {
        roomMaintenance: () => {
            return {
                harvestSource: {
                    numberSetting: 2,
                    priority: 10,
                    getSpawnTaskInf: createHarvestSourceTask
                },
                buildAndRepair: {
                    numberSetting: existStructure("sourceContainer") ? 2 : 0,
                    priority: 9,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                carrySource: {
                    numberSetting: existStructure("sourceContainer") ? 2 : 0,
                    priority: level > 1 ? 12 : 9.5,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                upgradeController: {
                    numberSetting: level >= 4 && level <= 7 && existStructure(STRUCTURE_STORAGE) ? 3 : 0,
                    priority: 8,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                carryResource: {
                    numberSetting: 0, // carryResource模块有不少bug
                    priority: 6,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                centerCarry: {
                    numberSetting: level >= 6 ? 1 : 0,
                    priority: 9.5,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                }
            };
        },
        war: () => {
            return {
                sledge: {
                    numberSetting: 2,
                    priority: 5,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                aio: {
                    numberSetting: 2,
                    priority: 5,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                }
            };
        },
        outwardsSource: (taskKindMemory, taskGroupName) => {
            return {
                sourceScout: {
                    numberSetting: 1,
                    priority: 5.5,
                    getSpawnTaskInf: createSourceScoutTask
                },
                oHarvestSource: {
                    numberSetting: taskKindMemory?.oHarvestSource.memory.numberSetting
                        ? taskKindMemory.oHarvestSource.memory.numberSetting
                        : 0,
                    priority: 5,
                    getSpawnTaskInf: createOHarvestSourceTask
                },
                oUpgradeController: {
                    numberSetting:
                        taskKindMemory?.oHarvestSource.memory.numberSetting &&
                        existContainer(taskGroupName.split("-")[1]) &&
                        level > 1 &&
                        level <= 4 &&
                        !existStructure(STRUCTURE_STORAGE)
                            ? taskKindMemory.oHarvestSource.memory.numberSetting * 6
                            : 0,
                    priority: 4,
                    getSpawnTaskInf: createOHarvestSourceTask
                },
                oClaim: {
                    numberSetting: taskKindMemory?.oHarvestSource.memory.numberSetting && level > 2 ? 1 : 0,
                    priority: 4.1,
                    getSpawnTaskInf: createSourceScoutTask
                },
                oCarrier: {
                    numberSetting:
                        taskKindMemory?.oHarvestSource.memory.numberSetting &&
                        level >= 4 &&
                        existStructure(STRUCTURE_STORAGE)
                            ? taskKindMemory.oHarvestSource.memory.numberSetting * 2
                            : 0,
                    priority: 4.5,
                    getSpawnTaskInf: createSourceScoutTask
                },
                oInvaderCoreAttacker: {
                    numberSetting: taskKindMemory?.oInvaderCoreAttacker.memory.numberSetting
                        ? taskKindMemory.oInvaderCoreAttacker.memory.numberSetting
                        : 0,
                    priority: 6,
                    getSpawnTaskInf: createSourceScoutTask
                },
                oInvaderAttacker: {
                    numberSetting: taskKindMemory?.oInvaderAttacker.memory.numberSetting
                        ? taskKindMemory.oInvaderAttacker.memory.numberSetting
                        : 0,
                    priority: 6.5,
                    getSpawnTaskInf: createSourceScoutTask
                }
            };
        }
    };
    return roleListX;
}
