//已经占领的房间的资源采集任务发布文件。

function examineTask() {
    for(let sourceName in Memory.sources){
        let source = Game.getObjectById(Memory.sources[sourceName].id)

    }
}


export default {
    examineTask: examineTask,
}
