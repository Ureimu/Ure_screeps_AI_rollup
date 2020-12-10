import { BaseTask } from "task/taskClass/BaseTask";

export function carryResourceTo(roomName: string, taskName: string, num: number, priority?: number): BaseTask {
    const t: BaseTask = new BaseTask(priority);
    t.taskType(taskName);
    return t;
}
