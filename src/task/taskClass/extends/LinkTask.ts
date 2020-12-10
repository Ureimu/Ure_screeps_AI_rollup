import { BaseTask } from "../BaseTask";
import taskPool from "task/utils/taskPool";

export class LinkTask extends BaseTask {
    public task: LinkTaskInf;
    public constructor(taskInf: LinkTaskInf) {
        super(taskInf.priority, taskInf.isRunning);
        this.task = taskInf;
    }

    public pushTask(room: Room): void {
        const m = taskPool.initQueue("linkTask", room.memory.taskPool);
        m.push(this.task);
        taskPool.setQueue(m, "linkTask", room.memory.taskPool);
    }
}
