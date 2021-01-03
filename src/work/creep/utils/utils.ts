/**
 * 一个多态状态机。
 *
 * @export
 * @param {Creep} creep
 * @param {Array<()=>number>} condition
 * @param {number} stateIndex
 * @param {string[]} [say=["🔄 harvest", "🚧 working"]]
 * @returns {number}
 */
export function stateCut(
    creep: Creep,
    condition: (() => number)[],
    stateIndex: number,
    say: string[] = ["🚧 working", "🔄 harvest"]
): number {
    if (!creep.memory.task.taskInf) return -1;
    // global.log(creep.memory.task.taskInf.state.length);
    // global.log(stateIndex + 1);
    while (creep.memory.task.taskInf.state.length <= stateIndex) {
        creep.memory.task.taskInf.state.push(0);
    }
    // global.log(creep.memory.task.taskInf.state.toString());
    const stateNum = condition[Number(creep.memory.task.taskInf.state[stateIndex])]();
    if (creep.memory.task.taskInf.state[stateIndex] !== stateNum) {
        creep.memory.task.taskInf.state[stateIndex] = stateNum;
        creep.say(say[stateNum]);
    }
    return creep.memory.task.taskInf.state[stateIndex];
}
