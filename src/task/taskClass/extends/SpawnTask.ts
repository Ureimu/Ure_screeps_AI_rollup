import { BaseTask } from "../BaseTask";

export class SpawnTask extends BaseTask {
    public task: SpawnTaskInf;
    public constructor(SpawnTaskInf: SpawnTaskInf) {
        super(SpawnTaskInf.priority, SpawnTaskInf.isRunning);
        this.task = SpawnTaskInf;
    }
}
