// 每次占领新房间时会执行的模块。

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
                innerRoomTaskSet: {},
                construction: {},
                constructionSchedule: {},
                constructionStartTime: Game.time,
                roomControlStatus: [1],
                firstSpawnName: room.find(FIND_MY_SPAWNS)[0].name
            };
        }
    }
}

function initSpawnMemory(room: Room): void {
    const controller = room.controller as StructureController;
    if (controller.my) {
        for (const spawn of room.find(FIND_MY_SPAWNS)) {
            if (spawn.memory.taskPool === undefined) {
                spawn.memory = {
                    taskPool: {
                        spawnQueue: []
                    },
                    lastFinishSpawnTime: 0,
                    isSpawning: false
                };
            }
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
    initSpawnMemory(room);
}
