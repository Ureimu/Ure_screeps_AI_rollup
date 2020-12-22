/**
 * 生成身体部件列表的简化输入类型，属性名代表部件名，属性值代表生成部件数量。repeat属性指定重复次数。
 */
type bpgGene = {
    [bodypartsName in BodyPartConstant | "repeat"]?: number;
};

type Sponsor = Id<StructureSpawn | Creep | Source>;

interface SourceMemory {
    id: Id<Source>;
    pos: string;
}

interface CheckStatus {
    update: boolean; // 更新参数
    updateData: { [name: string]: any };
    pushTask: boolean; // 推送任务
    pushTaskData: { [name: string]: any };
    changeStatus: boolean; // 改变任务状态
    changeStatusData: { [name: string]: any };
}

interface Memory {
    sources: { [name: string]: SourceMemory };
    taskPools: TaskPool;
    errors: {
        errorList: string[];
        errorCount: number[];
        errorIntervals: number[][];
    };
    time: number;
}

interface RoomMemory {
    taskPool: TaskPool;
    taskSetting: { [taskKindName: string]: { [taskName: string]: RoomTaskInte } };
    initialize?: boolean;
    taskKindList: string[];
}

interface taskKindMemory {
    [taskName: string]: RoomTaskInte;
}
interface SpawnMemory {
    recorder?: number;
    taskPool: TaskPool;
    lastFinishSpawnTime?: number;
    isSpawning: boolean;
}
