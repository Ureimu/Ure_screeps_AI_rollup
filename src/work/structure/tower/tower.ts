import { pushCarryTask } from "task/utils/pushCreepTask";
import { CarryTask } from "task/utils/TaskClass";

export function tower(tower: StructureTower) {
    if(tower.store["energy"]<600 && !tower.room.memory.construction["tower"].memory["hasPushed"]){
        let taskInf:CarryTaskInf = {
            priority:6,
            isRunning:false,
            taskInf:
            {
                resourceType:RESOURCE_ENERGY,
                structureCarryFrom:"innerSourceContainer",
                structureCarryTo:"tower",
                resourceNumber:600,
                state:[]
            },
            taskType:""
        }
        let task = new CarryTask(taskInf)
        pushCarryTask(tower.room.name,task.task);
        tower.room.memory.construction["tower"].memory["hasPushed"] = true;
    }

    if(tower.store["energy"]>600 && tower.room.memory.construction["tower"].memory["hasPushed"]){
        tower.room.memory.construction["tower"].memory["hasPushed"] = false;
    }
}
