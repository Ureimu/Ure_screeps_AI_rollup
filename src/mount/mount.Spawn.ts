import taskPool from "../taskPool"


// 自定义的 Spawn 的拓展
export class SpawnExtension extends StructureSpawn{
    spawnTask(bodyparts?: bpgGene[]) {
        if(typeof bodyparts != 'undefined'){

        }else{
            let spawnQueue = taskPool.initQueue('spawnQueue',this.memory.taskPool);
            if(spawnQueue.isEmpty()){
                let task = <Task>spawnQueue.pop();
                let inf = task.taskInf;
                let ifOK:number = this.spawnCreep(global.bpg(inf.bodyparts), inf.creepName);
                if(ifOK!=OK){
                    spawnQueue.push(task);
                }
                else{
                    if(!!Game.getObjectById(<Sponsor>task.sponsor)){
                        Game.getObjectById(<Sponsor>task.sponsor)!.memory!.taskPool['spawnQueue'].pop()
                    }
                }
            };
            taskPool.setQueue(spawnQueue,'spawnQueue',this.memory.taskPool);
        }
    }
    // 其他更多自定义拓展
}
