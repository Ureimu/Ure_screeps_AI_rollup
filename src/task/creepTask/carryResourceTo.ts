import { BaseTask } from "task/utils/TaskClass";


export function carryResourceTo(roomName: string, taskName: string, num: number, priority?: number) {
    let t: BaseTask = new BaseTask(priority);
    t.taskType(taskName);
    return t;
}
