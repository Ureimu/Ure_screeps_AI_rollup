type Sponsor = Id<StructureSpawn | Creep | Source>;

/**
 * 任务的基本类，包含优先级属性。不建议直接使用，而应使用继承对应功能的类。
 *
 * @interface BaseTask
 */
export interface BaseTaskInf {
    /**
     * 任务的优先级，是一个实数
     *
     * @type {number}
     * @memberof BaseTask
     */
    priority: number;

    /**
     * 任务的发起者的id
     *
     * @type {Sponsor}可以是任何建筑或creep,source
     * @memberof BaseTask
     */
    sponsor?: Sponsor;
    /**
     * 标识该任务是否在执行状态。
     *
     * @type {boolean}
     * @memberof BaseTask
     */
    isRunning: boolean;

    taskName: string;

    taskGroupName: string;
}
export class BaseTask {
    public task: BaseTaskInf;
    public constructor(priority = 10, isRunning = false) {
        this.task = {
            priority,
            isRunning,
            taskName: "",
            taskGroupName: ""
        };
    }

    public sponsor(sponsorObject: StructureSpawn | Creep | Source): Id<StructureSpawn | Creep | Source> | undefined {
        this.task.sponsor = sponsorObject ? sponsorObject.id : undefined;
        return this.task.sponsor;
    }

    public taskName(taskName: string): void {
        this.task.taskName = taskName;
    }

    public taskGroupName(taskGroupName: string): void {
        this.task.taskGroupName = taskGroupName;
    }
}
