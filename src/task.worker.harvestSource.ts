import taskPool from"./taskPool";
import { PriorityQueue } from "./PriorityQueue";

export function getWorkerTask():void{
    for(let sourceName in Memory.sources){
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let workerTask = taskPool.initQueue('workerTask', Memory.sources[source.name].taskPool);
        let task: Task = <Task>workerTask.pop();
    }
}

export function newSourceTask(): void{
    for(let sourceName in Memory.sources){
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let workerTask: PriorityQueue = taskPool.initQueue('taskQueue', Memory.sources[source.name].taskPool);
        for(let i=0;i<Memory.sources[source.name].blankSpace;i++){
            workerTask.push({
                sponsor: source.id,
                priority: 10,
                isRunning: false,
                taskInf: {
                    source: Memory.sources[source.name],
                }
            });
        }
        taskPool.setQueue(workerTask,'taskQueue',Memory.sources[source.name].taskPool);
    }
}

export function newSpawnTask():void{
    for(let sourceName in Memory.sources){
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let spawnTaskQueue: PriorityQueue = taskPool.initQueue('taskQueue', source.room.memory.taskPool);
        for(let i=0;i<Memory.sources[source.name].blankSpace;i++){
            spawnTaskQueue.push({
                sponsor: source.id,
                priority: 10,
                isRunning: false,
                taskInf: {
                    source: Memory.sources[source.name],
                }
            });
        }
        taskPool.setQueue(spawnTaskQueue,'taskQueue',source.room.memory.taskPool);
    }
}
