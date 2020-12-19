export class BaseTask {
    public task: BaseTaskInf;
    public constructor(priority = 10, isRunning = false) {
        this.task = {
            priority,
            isRunning,
            taskName: "",
            taskKindName: ""
        };
    }

    public sponsor(sponsorObject: StructureSpawn | Creep | Source): Id<StructureSpawn | Creep | Source> | undefined {
        this.task.sponsor = sponsorObject ? sponsorObject.id : undefined;
        return this.task.sponsor;
    }

    public taskName(taskName: string): void {
        this.task.taskName = taskName;
    }

    public taskKindName(taskKindName: string): void {
        this.task.taskKindName = taskKindName;
    }
}
