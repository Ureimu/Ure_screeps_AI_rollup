import taskPool from "../taskPool";
import { PriorityQueue } from "PriorityQueue";

// 自定义的 Spawn 的拓展
export class SpawnExtension extends StructureSpawn {
    spawnTask(bodyparts?: bpgGene[]) {
        if (typeof bodyparts != "undefined") {
        } else {
            let spawnQueue = taskPool.initQueue("spawnQueue", this.memory.taskPool);
            let taskList: TaskQueue = [];
            let ifOK: number = 1;
            do {
                if (spawnQueue.isEmpty()) {
                    let task = <Task>spawnQueue.pop();
                    let inf = task.taskInf;
                    ifOK = this.spawnCreep(global.bpg(inf.bodyparts), inf.creepName, {
                        memory: { task: task.taskInf.task, spawnName: this.name, role: "worker", taskPool: {} }
                    });
                    if (ifOK != OK) {
                        taskList.push(task);
                    } else {
                        if (!!Game.getObjectById(<Sponsor>task.sponsor)) {
                            //Game.getObjectById(<Sponsor>task.sponsor)!.memory!.taskPool['spawnQueue'].pop()
                        }
                    }
                } else {
                    ifOK = OK;
                }
            } while (ifOK != OK);
            for (let task of taskList) {
                spawnQueue.push(task);
            }
            taskPool.setQueue(spawnQueue, "spawnQueue", this.memory.taskPool);
        }
    }
    // 其他更多自定义拓展
}
