import taskPool from "../taskPool"
// 将拓展签入 Room 原型
export function mountRoomEx() {
    _.assign(Room.prototype, RoomExtension);
}

// 自定义的 Creep 的拓展
class RoomExtension extends Room{
    allocatingTask(){
        let spawnTaskQueue = taskPool.initQueue('spawnTaskQueue',this.memory.taskPool);

    }
}
