import { BaseTask } from "../BaseTask";

export class SpawnTask extends BaseTask {
    public task: SpawnTaskInf;
    public constructor(SpawnTaskInf: SpawnTaskInf) {
        super(SpawnTaskInf.priority, SpawnTaskInf.isRunning);
        this.task = SpawnTaskInf;
    }

    public addTaskInf(taskInf: Record<string, unknown>): void {
        const PropertyDescriptorMap: PropertyDescriptorMap = {};
        for (const name in taskInf) {
            Object.defineProperty(this.task.taskInf, name, {
                value: taskInf[name],
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }
}
