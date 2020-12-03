import { LinkTask } from "task/utils/TaskClass";

export function sourceLink(sourceLink: StructureLink) {
    if(!sourceLink.room.memory.construction["sourceLink"].memory[sourceLink.id])sourceLink.room.memory.construction["sourceLink"].memory[sourceLink.id]={
        hasPushed:false,
    }
    if(sourceLink.store["energy"]>700 && !sourceLink.room.memory.construction["sourceLink"].memory[sourceLink.id].hasPushed){
        let taskInf:LinkTaskInf = {
            priority:4,
            isRunning:false,
            taskInf:
            {
                resourceType:RESOURCE_ENERGY,
                linkTransferFrom:sourceLink.id,
                linkTransferTo:sourceLink.room.memory.construction["centerLink"].memory.id,
                resourceNumber:50000,
                state:[]
            },
            taskType:""
        }
        let task = new LinkTask(taskInf)
        task.pushTask(sourceLink.room)
        sourceLink.room.memory.construction["sourceLink"].memory[sourceLink.id].hasPushed = true;
    }

    if(sourceLink.store["energy"]<100 && sourceLink.room.memory.construction["sourceLink"].memory[sourceLink.id].hasPushed){
        sourceLink.room.memory.construction["sourceLink"].memory[sourceLink.id].hasPushed = false;
    }
}
