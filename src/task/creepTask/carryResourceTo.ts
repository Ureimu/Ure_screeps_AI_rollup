import { CarryTask} from "task/utils/TaskClass";

export function carryResourceTo(roomName: string, taskName: string, num: number, priority?: number) {
    let t: CarryTask = new CarryTask(priority);
    t.taskType(taskName);
    return t;
}
