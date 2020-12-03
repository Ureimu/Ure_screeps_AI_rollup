import { LinkTask } from "task/utils/TaskClass";

export function controllerLink(controllerLink: StructureLink) {
    if(!controllerLink.room.memory.construction["controllerLink"].memory.id)controllerLink.room.memory.construction["controllerLink"].memory.id=controllerLink.id
    if(controllerLink.store["energy"]<100 && !controllerLink.room.memory.construction["controllerLink"].memory.hasPushed){
        let taskInf:LinkTaskInf = {
            priority:4,
            isRunning:false,
            taskInf:
            {
                resourceType:RESOURCE_ENERGY,
                linkTransferFrom:controllerLink.room.memory.construction["centerLink"].memory.id,
                linkTransferTo:controllerLink.id,
                resourceNumber:50000,
                state:[]
            },
            taskType:""
        }
        let task = new LinkTask(taskInf)
        task.pushTask(controllerLink.room)
        controllerLink.room.memory.construction["controllerLink"].memory.hasPushed = true;
    }

    if(controllerLink.store["energy"]>700 && controllerLink.room.memory.construction["controllerLink"].memory.hasPushed){
        controllerLink.room.memory.construction["controllerLink"].memory.hasPushed = false;
    }
}
