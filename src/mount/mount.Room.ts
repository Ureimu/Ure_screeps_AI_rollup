import taskPool from "../taskPool"

// 自定义的 Creep 的拓展
export class RoomExtension extends Room{
    allocatingTask(){
        let spawnTaskQueue = taskPool.initQueue('spawnTaskQueue',Memory.rooms[this.name].taskPool);

    }
}
