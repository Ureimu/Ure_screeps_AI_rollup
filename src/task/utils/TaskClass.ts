export class BaseTask {
    public task: BaseTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        this.task = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {
                state: []
            }
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
    public task: SpawnTaskInf
    constructor(priority: number = 10, isRunning: boolean = false) {
        super(priority, isRunning);
        this.task = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {
                state: []
            },
            spawnInf: {
                bodyparts: [],
                creepName: "",
                roomName: "",
            }
        };
    }

    getSpawnTask(bodyparts: bpgGene[], creepName: string, roomName: string) {
        this.task.spawnInf = {
            bodyparts: bodyparts,
            creepName: creepName,
            roomName: roomName,
        };
    }
}

export class CreepTask extends BaseTask{
    public task: CreepTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        super(priority, isRunning);
        this.task = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {
                state: []
            },
            missionInf: {},
        };
    }
}

export class CarryTask extends CreepTask{
    public task: CarryCreepTaskInf;
    constructor(priority: number = 10, isRunning: boolean = false) {
        super(priority, isRunning);
        this.task = {
            priority: priority,
            isRunning: isRunning,
            taskInf: {
                state: []
            },
            missionInf: {},
        };
    }

    getCarryTask(resourceType:ResourceConstant,carryFrom:string,carryFromStructureType:StructureConstant,carryTo:string,carryToStructureType:StructureConstant,amount:number) {
        this.task.missionInf['resourceType']=resourceType;
        this.task.missionInf["carryFrom"]=carryFrom;
        this.task.missionInf["carryFromStructureType"]=carryFromStructureType;
        this.task.missionInf["carryTo"]=carryTo;
        this.task.missionInf["carryToStructureType"]=carryToStructureType;
        this.task.missionInf["amount"]=amount;
    }
}
