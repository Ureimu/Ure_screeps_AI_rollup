// 每次占领新房间时会执行的模块。

import { runSpawnTask } from "task";
import { BaseTaskInf } from "task/taskClass/BaseTask";
import { CarryTaskInf } from "task/taskClass/extends/CarryTask";
import { LinkTaskInf } from "task/taskClass/extends/LinkTask";
import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { taskPool } from "task/utils/taskPool";

declare global {
    interface Memory {
        sources: { [name: string]: SourceMemory };
        taskPools: taskPool<BaseTaskInf>;
        errors: {
            errorList: string[];
            errorCount: number[];
            errorIntervals: number[][];
        };
        time: number;
    }

    interface RoomMemory {
        taskPool: taskPool<BaseTaskInf & LinkTaskInf & CarryTaskInf & SpawnTaskInf>;
        initialize?: boolean;
        taskKindList: string[];
    }

    interface SpawnMemory {
        recorder?: number;
        taskPool: taskPool<SpawnTaskInf>;
        lastFinishSpawnTime?: number;
        isSpawning: boolean;
    }
}

interface SourceMemory {
    id: Id<Source>;
    pos: string;
}

/**
 * 查找属于自己房间的source名称并初始化没有memory记录的source的memory。
 *
 */
function getNewSource(room: Room): void {
    if (!Memory.sources) {
        Memory.sources = {};
    }
    const sources = room.find(FIND_SOURCES);
    for (const source of sources) {
        const name = `${source.room.name}Source[${source.pos.x},${source.pos.y}]`;
        if (Memory.sources[name] === undefined) {
            source.initsMemory();
        }
    }
}

function initRoomMemory(room: Room): void {
    const controller = room.controller as StructureController;
    if (controller.my) {
        if (room.memory.taskPool === undefined) {
            room.memory = {
                taskPool: {
                    spawnQueue: [],
                    carryQueue: []
                },
                taskSetting: {},
                construction: {},
                constructionSchedule: {},
                startTime: Game.time,
                roomControlStatus: [1],
                firstSpawnName: room.find(FIND_MY_SPAWNS)[0].name,
                taskKindList: ["roomMaintenance"],
                stats: {
                    upgradeSpeed: "",
                    creepBodySize: 0,
                    creepNum: 0,
                    ticksToUpgrade: ""
                }
            };
        }
    }
}

export function initNewRoomSetting(room: Room, ifFarming: boolean): void {
    if (ifFarming) {
        getNewSource(room);
        return;
    }
    getNewSource(room);
    initRoomMemory(room);
    runSpawnTask(room);
}
