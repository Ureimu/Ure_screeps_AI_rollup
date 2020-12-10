export class BaseTask {
    public task: BaseTaskInf;
    public constructor(priority = 10, isRunning = false) {
        this.task = {
            priority,
            isRunning,
            taskType: ""
        };
    }

    public sponsor(sponsorObject: StructureSpawn | Creep | Source): Id<StructureSpawn | Creep | Source> | undefined {
        this.task.sponsor = sponsorObject ? sponsorObject.id : undefined;
        return this.task.sponsor;
    }

    public taskType(taskType: string): void {
        this.task.taskType = taskType;
    }
}
