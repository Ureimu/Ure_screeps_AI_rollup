import { bpgGene } from "utils/bodypartsGenerator";
import { BaseTask, BaseTaskInf } from "../BaseTask";

export interface SpawnTaskInf extends BaseTaskInf {
    spawnInf: {
        bodyparts: bpgGene[];
        creepName: string;
        roomName: string;
        isRunning: boolean;
    };
    taskInf?: {
        [name: string]: any;
        state: number[];
    };
}
export class SpawnTask extends BaseTask {
    public task: SpawnTaskInf;
    public constructor(SpawnTaskInf: SpawnTaskInf) {
        super(SpawnTaskInf.priority, SpawnTaskInf.isRunning);
        this.task = SpawnTaskInf;
    }

    public addTaskInf(taskInf: Record<string, unknown>): void {
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
