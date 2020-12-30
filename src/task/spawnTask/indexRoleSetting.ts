import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { roleSettingList } from "task/taskClass/RoleSetting";
import { createOHarvestSourceTask } from "./outwardsSource/oHarvestSource";
import { createSourceScoutTask } from "./outwardsSource/sourceScout";
import { createHarvestSourceTask } from "./roomMaintenanceTask/harvestSource";
import { templateSpawnTaskList } from "./utils/templateTask";

function defaultGetSpawnTaskInf(
    room: Room,
    taskName: string,
    taskKindName: string,
    num: number,
    priority: number
): SpawnTaskInf[] {
    return templateSpawnTaskList(room.name, taskName, taskKindName, num, priority);
}

export function getRoleList(room: Room): roleSettingList {
    const level = room.controller?.level as number;
    const roleListX: roleSettingList = {
        roomMaintenance: () => {
            return {
                harvestSource: {
                    numberSetting: 2,
                    priority: 10,
                    getSpawnTaskInf: createHarvestSourceTask
                },
                buildAndRepair: {
                    numberSetting: level >= 5 ? 2 : 1,
                    priority: 9,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                carrySource: {
                    numberSetting: 2,
                    priority: 12,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                upgradeController: {
                    numberSetting: 0,
                    priority: 8,
                    getSpawnTaskInf: defaultGetSpawnTaskInf
                },
                carryResource: {
                    numberSetting: 1,
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
        outwardsSource: taskKindMemory => {
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
                    numberSetting: taskKindMemory?.oHarvestSource.memory.numberSetting
                        ? taskKindMemory.oHarvestSource.memory.numberSetting * 4
                        : 0,
                    priority: 4,
                    getSpawnTaskInf: createSourceScoutTask
                },
                oClaim: {
                    numberSetting: taskKindMemory?.oHarvestSource.memory.numberSetting && level > 2 ? 1 : 0,
                    priority: 4,
                    getSpawnTaskInf: createSourceScoutTask
                }
            };
        }
    };
    return roleListX;
}
