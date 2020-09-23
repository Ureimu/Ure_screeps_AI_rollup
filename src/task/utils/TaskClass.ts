export class BaseTask {
    public task: BaseTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        this.task = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {}
        };
    }

    sponsor(sponsorObject: any) {
        this.task["sponsor"] = sponsorObject ? sponsorObject.id : undefined;
        return this.task["sponsor"];
    }

    taskType(taskType: string) {
        this.task.taskInf["taskType"] = taskType;
    }
}

export class SpawnTask extends BaseTask {
    public spawnTask: SpawnTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        super(priority, isRunning);
        this.spawnTask = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {},
            spawnInf: {
                bodyparts: [],
                creepName: ""
            }
        };
    }

    getSpawnTask(bodyparts: bpgGene[], creepName: string) {
        this.spawnTask.spawnInf = {
            bodyparts: bodyparts,
            creepName: creepName
        };
    }
}

export class CreepTask extends BaseTask{
    public creepTask: CreepTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        super(priority, isRunning);
        this.creepTask = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {},
            missionInf: {},
        };
    }
}
