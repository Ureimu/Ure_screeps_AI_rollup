import { getBpByRole } from "task/spawnTask/utils/bodypartsSetting";
import { RoomTask } from "task/utils/RoomTask";
import { bpg, getBpEnergy } from "utils/bodypartsGenerator";
import taskPool from "../task/utils/taskPool";
// 自定义的 Spawn 的拓展
export class SpawnExtension extends StructureSpawn {
    public runSpawnTask(): boolean {
        if (!this.memory.lastFinishSpawnTime) {
            this.memory.lastFinishSpawnTime = Game.time;
        }
        if (typeof this.spawning?.name === "string") {
            if (!this.memory.isSpawning) {
                this.memory.isSpawning = true;
            }
            return false;
        } else {
            if (this.memory.isSpawning) {
                this.memory.lastFinishSpawnTime = Game.time;
                this.memory.isSpawning = false;
            }
            this.memory.recorder =
                (Game.time - this.memory.lastFinishSpawnTime) *
                    Math.max(Math.log1p(this.memory.taskPool.spawnQueue.length + 1), 1) -
                global.workRate.spawn *
                    Math.floor((this.room.energyCapacityAvailable - this.room.energyAvailable) / 200 + 1);
            if (
                (this.memory.recorder > 0 && this.room.energyAvailable >= 300) ||
                (this.room.energyAvailable === this.room.energyCapacityAvailable && this.room.energyAvailable >= 300)
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    public spawnTask(): void {
        if (!this.runSpawnTask()) {
            return;
        }
        const spawnQueue = taskPool.initQueue("spawnQueue", this.memory.taskPool);
        const taskList: SpawnTaskInf[] = [];
        let ifOK = 1;
        const errorList: number[] = [];
        do {
            if (spawnQueue.isEmpty()) {
                const task = spawnQueue.pop() as SpawnTaskInf;
                const inf = task.spawnInf;
                if (typeof inf === "undefined") {
                    console.log("未定义spawn任务");
                } else {
                    inf.bodyparts = getBpByRole(task.taskType, task.spawnInf.roomName);
                    ifOK = this.spawnCreep(bpg(inf.bodyparts), inf.creepName, {
                        memory: { task, taskPool: {}, bodyparts: inf.bodyparts }
                    });
                    if (ifOK !== OK) {
                        taskList.push(task);
                        errorList.push(ifOK);
                    } else {
                        const roomTask = new RoomTask(task.spawnInf.roomName, task.taskType);
                        roomTask.hasPushedToSpawn = false;
                        // 确认已经在生成creep时执行的任务
                        // global.creepMemory[inf.creepName]={};
                        if (Game.getObjectById(task.sponsor as Sponsor)) {
                            // Game.getObjectById(<Sponsor>task.sponsor)!.memory!.taskPool['spawnQueue'].pop()
                        }
                    }
                }
            } else {
                ifOK = OK;
            }
        } while (ifOK !== OK);
        for (const task of taskList) {
            spawnQueue.push(task);
        }
        for (let i = 0, j = taskList.length; i < j; i++) {
            // 返回任务错误信息
            const task = taskList[i];
            const errorNum = errorList[i];
            let errorText = "";
            switch (errorNum) {
                case -1:
                    errorText = "你不是该母巢 (spawn) 的所有者。";
                    break;
                case -3:
                    errorText = `已经有一个叫这个名字的 creep 了。名称：${task.spawnInf.creepName}`;
                    break;
                case -4:
                    errorText = "这个母巢 (spawn) 已经在孵化另一个 creep 了。";
                    break;
                case -6:
                    errorText = `这个母巢 (spawn) 和他的扩展包含的能量不足以孵化具有给定 body 的 creep。预期能量消耗：${getBpEnergy(
                        task.spawnInf.bodyparts
                    )}`;
                    break;
                case -10:
                    errorText = "Body 没有被恰当地描述。";
                    break;
                case -14:
                    errorText = "您的房间控制器级别不足以使用此 spawn。";
                    break;
                default:
                    break;
            }
            console.log(
                `<span style='color:#FFCCCC'>[spawn] ${this.name}执行spawn任务失败,返回错误：${errorText}</span>`
            );
        }
        if (taskList.length > 18) {
            console.log(
                `<span style='color:#FF6666'>目前任务冗余过多(${taskList.length}个任务在该spawn"${this.name}"任务队列中)，请及时检测清理任务！</span>`
            );
        }
        taskPool.setQueue(spawnQueue, "spawnQueue", this.memory.taskPool);
    }
    // 其他更多自定义拓展
}
