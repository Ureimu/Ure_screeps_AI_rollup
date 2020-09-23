import { BaseTask, CreepTask } from "task/utils/TaskClass";

export function carryResourceTo(roomName: string, taskName: string, num: number, priority?: number) {
    let t: CreepTask = new CreepTask(priority);
    t.taskType(taskName);
    return t;
}
