import taskPool from "./taskPool";

export class BaseTask {
    public task: BaseTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        this.task = {
            priority: priority,
            isRunning: isRunning,
            taskType: ""
        };
    }

    sponsor(sponsorObject: any) {
        this.task["sponsor"] = sponsorObject ? sponsorObject.id : null;
        return this.task["sponsor"];
    }

    taskType(taskType: string) {
        this.task.taskType = taskType;
    }
}

export class SpawnTask extends BaseTask {
    public task: SpawnTaskInf
    constructor(SpawnTaskInf:SpawnTaskInf) {
        super(SpawnTaskInf.priority, SpawnTaskInf.isRunning);
        this.task = SpawnTaskInf;
    }
}

export class CarryTask extends BaseTask {
    public task: CarryTaskInf
    constructor(taskInf:CarryTaskInf) {
        super(taskInf.priority, taskInf.isRunning);
        this.task = taskInf
    }

    pushTask(room:Room){
        let m = taskPool.initQueue("carryTask",room.memory.taskPool);
        m.push(this.task);
        taskPool.setQueue(m,"carryTask",room.memory.taskPool);
    }
}

export class LinkTask extends BaseTask {
    public task: LinkTaskInf
    constructor(taskInf:LinkTaskInf) {
        super(taskInf.priority, taskInf.isRunning);
        this.task = taskInf
    }

    pushTask(room:Room){
        let m = taskPool.initQueue("linkTask",room.memory.taskPool);
        m.push(this.task);
        taskPool.setQueue(m,"linkTask",room.memory.taskPool);
    }
}
