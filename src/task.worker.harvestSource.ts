import taskPool from"./taskPool";
import { PriorityQueue } from "./PriorityQueue";

export function getWorkerTask():void{
    for(let sourceName in Memory.sources){
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let workerTask = taskPool.initQueue('workerTask', source.memory.taskPool);
        let task: Task = <Task>workerTask.pop();
    }
}

export function newSourceTask(): void{
    for(let sourceName in Memory.sources){
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let workerTask: PriorityQueue = taskPool.initQueue('sourceTaskQueue', source.memory.taskPool);
        for(let i=0;i<source.memory.blankSpace;i++){
            workerTask.push({
                priority: 10,
                taskInf: {
                    source: source.memory,
                    isRunning: false,
                }
            });
        }
        taskPool.setQueue(workerTask,source.memory.taskPool,'sourceTaskQueue');
    }
}

export function newSpawnTask():void{
    for(let sourceName in Memory.sources){
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        let spawnTaskQueue: PriorityQueue = taskPool.initQueue('spawnTaskQueue', source.room.memory.taskPool);
        for(let i=0;i<source.memory.blankSpace;i++){
            spawnTaskQueue.push({
                priority: 10,
                taskInf: {
                    source: source.memory,
                    isRunning: false,
                }
            });
        }
        taskPool.setQueue(spawnTaskQueue,source.room.memory.taskPool,'sourceTaskQueue');
    }
}
