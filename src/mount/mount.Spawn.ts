import taskPool from "../taskPool"
// 将拓展签入 Spawn 原型
export function mountSpawnEx() {
    _.assign(StructureSpawn.prototype, spawnExtension);
}

// 自定义的 Spawn 的拓展
class spawnExtension extends StructureSpawn{
    spawnTask() {
        let taskQueue = taskPool.initQueue('taskQueue',this.memory.taskPool);
        if(taskQueue.isEmpty()){
            let task = <Task>taskQueue.pop();
            let inf = task.taskInf;
            let ifOK:number = this.spawnCreep(inf.bodyparts, inf.creepName);
            if(ifOK!=OK){
                taskQueue.push(task);
            };
        };
        taskPool.setQueue(taskQueue,this.memory.taskPool,'taskQueue');
    }
    // 其他更多自定义拓展
}
