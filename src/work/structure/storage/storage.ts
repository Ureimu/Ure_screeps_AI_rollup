import { pushCarryTask } from "task/utils/pushCreepTask";
import { CarryTask } from "task/utils/TaskClass";

export function storage(storage: StructureStorage) {
    if(storage.store["energy"]<50000 && !storage.room.memory.construction["storage"].memory["hasPushed"]){
        let taskInf:CarryTaskInf = {
            priority:4,
            isRunning:false,
            taskInf:
            {
                resourceType:RESOURCE_ENERGY,
                structureCarryFrom:"innerSourceContainer",
                structureCarryTo:"storage",
                resourceNumber:50000,
                state:[]
            },
            taskType:""
        }
        let task = new CarryTask(taskInf)
        pushCarryTask(storage.room.name,task.task);
        storage.room.memory.construction["storage"].memory["hasPushed"] = true;
    }

    if(storage.store["energy"]>50000 && storage.room.memory.construction["storage"].memory["hasPushed"]){
        storage.room.memory.construction["storage"].memory["hasPushed"] = false;
    }
}
