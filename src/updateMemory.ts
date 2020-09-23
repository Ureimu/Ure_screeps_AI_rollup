//每次占领新房间时会执行的模块。


/**
 * 查找属于自己房间的source名称并初始化没有memory记录的source的memory。
 *
 */
function getNewSource(): void {
    Memory.sources = {};
    for (let room in Game.rooms) {
        if (Game.rooms[room].controller !== undefined) {
            let controller = <StructureController>Game.rooms[room].controller
            if(controller.my){
                let sources = Game.rooms[room].find(FIND_SOURCES);
                for (let source of sources) {
                    if (Memory.sources[source.name] === undefined){
                        source.initsMemory();
                    }
                }
            }
        }
    }
}

function initRoomMemory(): void {
    for (let room in Game.rooms) {
        if (Game.rooms[room].controller !== undefined) {
            let controller = <StructureController>Game.rooms[room].controller
            if(controller.my){
                if (Game.rooms[room].memory.taskPool === undefined) {
                    Game.rooms[room].memory = {
                        taskPool: {
                            spawnQueue: [],
                        },
                        pushTaskSet: {},
                        construction: {},
                        constructionSchedule: {},
                        constructionStartTime: Game.time,
                    }
                }
            }
        }
    }
}

function initSpawnMemory(): void {
    for (let room in Game.rooms) {
        if (Game.rooms[room].controller !== undefined) {
            let controller = <StructureController>Game.rooms[room].controller;
            if(controller.my){
                for (let spawn of Game.rooms[room].find(FIND_MY_SPAWNS)) {
                    if (spawn.memory.taskPool === undefined) {
                        spawn.memory = {
                            taskPool: {
                                spawnQueue: [],
                            },
                        }
                    }
                }
            }
        }
    }
}

export function initNewRoomSetting(): void {
    getNewSource();
    initRoomMemory();
    initSpawnMemory();
}
