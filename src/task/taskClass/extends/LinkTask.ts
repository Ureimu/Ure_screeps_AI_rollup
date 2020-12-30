import { TaskPool } from "task/utils/taskPool";
import { BaseTask, BaseTaskInf } from "../BaseTask";

export interface LinkTaskInf extends BaseTaskInf {
    taskInf: {
        resourceType: RESOURCE_ENERGY;
        linkTransferFrom: Id<StructureLink>;
        linkTransferTo: Id<StructureLink>;
        resourceNumber: number;
        state: [];
    };
}
export class LinkTask extends BaseTask {
    public task: LinkTaskInf;
    public constructor(taskInf: LinkTaskInf) {
        super(taskInf.priority, taskInf.isRunning);
        this.task = taskInf;
    }

    public pushTask(room: Room): void {
        const taskPool = new TaskPool<LinkTaskInf>();
        const m = taskPool.initQueue("linkTask", room.memory.taskPool);
        m.push(this.task);
        taskPool.setQueue(m, "linkTask", room.memory.taskPool);
    }
}
