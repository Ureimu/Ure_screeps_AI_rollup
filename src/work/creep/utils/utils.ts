/**
 * 一个多态状态机。
 *
 * @export
 * @param {Creep} creep
 * @param {Array<()=>number>} condiction
 * @param {number} stateIndex
 * @param {string[]} [say=["🔄 harvest", "🚧 working"]]
 * @returns {number}
 */
export function stateCut(
    creep: Creep,
    condiction: Array<() => number>,
    stateIndex: number,
    say: string[] = ["🚧 working", "🔄 harvest"]
): number {
    if (typeof creep.memory.task.taskInf.state[stateIndex] === "undefined") {
        let numList = [];
        for (let i = 0, j = stateIndex + 1; i < j; i++) {
            numList.push(0);
        }
        creep.memory.task.taskInf.state.push(...numList);
    }
    let stateNum = condiction[creep.memory.task.taskInf.state[stateIndex]]();
    if (creep.memory.task.taskInf.state[stateIndex] != stateNum) {
        creep.memory.task.taskInf.state[stateIndex] = stateNum;
        creep.say(say[stateNum]);
    }
    return creep.memory.task.taskInf.state[stateIndex];
}

export function test(creep: Creep, target: AnyStructure) {
    if (!creep.memory.task.taskInf.lastObj) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax - 2200
        });
        targets.sort((a, b) => a.hits - b.hits);
        if (targets.length > 0) {
            creep.memory.task.taskInf.lastObj = targets[0].id;
            creep.memory.task.taskInf.lastObjHit = targets[0].hits;
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {
                    visualizePathStyle: {
                        stroke: "#ffaa00"
                    }
                });
            }
        }
    } else if (creep.memory.task.taskInf.lastObj) {
        let target_x = <AnyStructure>Game.getObjectById(creep.memory.task.taskInf.lastObj);
        if (target_x.hits >= creep.memory.task.taskInf.lastObjHit + 120000 || target_x.hits == target_x.hitsMax) {
            creep.memory.task.taskInf.lastObj = null;
        } else if (creep.repair(target_x) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target_x, {
                visualizePathStyle: {
                    stroke: "#ffaa00"
                }
            });
        }
    } else {
        creep.say("error");
    }
}
