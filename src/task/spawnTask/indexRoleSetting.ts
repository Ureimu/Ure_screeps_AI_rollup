import { createHarvestSourceTask } from "./roomMaintenanceTask/harvestSource";
import { templateSpawnTaskList } from "./utils/templateTask";

function defaultGetSpawnTaskInf(room: Room, taskName: string, num: number, priority: number): SpawnTaskInf[] {
    return templateSpawnTaskList(room.name, taskName, num, priority);
}

export function getRoleList(room: Room): roleSettingList {
    const level = room.controller?.level as number;
    const roleListX: roleSettingList = {
        roomMaintenance: {
            harvestSource: {
                numberSetting: 2,
                priority: 10,
                getSpawnTaskInf: createHarvestSourceTask
            },
            buildAndRepair: {
                numberSetting: level >= 5 ? 2 : 3,
                priority: 9,
                getSpawnTaskInf: defaultGetSpawnTaskInf
            },
            carrySource: {
                numberSetting: 1,
                priority: 12,
                getSpawnTaskInf: defaultGetSpawnTaskInf
            },
            upgradeController: {
                numberSetting: 1,
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
        },
        war: {
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
        }
    };
    return roleListX;
}
