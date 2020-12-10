import { BaseTask } from "../BaseTask";
import taskPool from "task/utils/taskPool";

export class CarryTask extends BaseTask {
    public task: CarryTaskInf;
    public constructor(taskInf: CarryTaskInf) {
        super(taskInf.priority, taskInf.isRunning);
        this.task = taskInf;
    }

    public pushTask(room: Room): void {
        const m = taskPool.initQueue("carryTask", room.memory.taskPool);
        m.push(this.task);
        taskPool.setQueue(m, "carryTask", room.memory.taskPool);
    }
}
