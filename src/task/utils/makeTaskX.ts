export class TaskG {
    public task: Task
    constructor(priority:number = 10, isRunning: boolean = false){
        this.task={
            priority: priority,
            isRunning: isRunning,
            taskInf: {}
        }
    };

    sponsor(sponsorObject: any){
        this.task["sponsor"] = sponsorObject ? sponsorObject.id : undefined
        return this.task["sponsor"]
    }

    spawnTask(bodyparts:bpgGene[],creepName:string){
        this.task.spawnInf = {
            bodyparts: bodyparts,
            creepName: creepName,
        }
    }

    taskType(taskType:string){
        this.task.taskInf["taskType"] = taskType;
    }
}
