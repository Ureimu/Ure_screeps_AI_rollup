import { TaskPool } from "task/utils/taskPool";
import { BaseTask, BaseTaskInf } from "../BaseTask";

export interface CarryTaskInf extends BaseTaskInf {
    taskInf: {
        resourceType: ResourceConstant;
        structureCarryFrom: string;
        structureCarryTo: string;
        resourceNumber: number;
        state: [];
    };
}
export class CarryTask extends BaseTask {
    public task: CarryTaskInf;
    public constructor(taskInf: CarryTaskInf) {
        super(taskInf.priority, taskInf.isRunning);
        this.task = taskInf;
    }

    public pushTask(room: Room): void {
        const taskPool = new TaskPool<CarryTaskInf>();
        const m = taskPool.initQueue("carryTask", room.memory.taskPool);
        m.push(this.task);
        taskPool.setQueue(m, "carryTask", room.memory.taskPool);
    }
}
