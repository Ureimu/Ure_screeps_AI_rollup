import { CarryTask } from "task/utils/TaskClass";

export function tower(tower: StructureTower) {
    if(!tower.room.memory.construction["tower"].memory[tower.id])tower.room.memory.construction["tower"].memory[tower.id]={
        hasPushed:false,
    }
    if(tower.store["energy"]<600 && !tower.room.memory.construction["tower"].memory[tower.id].hasPushed){
        let taskInf:CarryTaskInf = {
            priority:6,
            isRunning:false,
            taskInf:
            {
                resourceType:RESOURCE_ENERGY,
                structureCarryFrom:"sourceContainer",
                structureCarryTo:"tower",
                resourceNumber:600,
                state:[]
            },
            taskType:""
        }
        let task = new CarryTask(taskInf)
        task.pushTask(tower.room)
        tower.room.memory.construction["tower"].memory[tower.id].hasPushed = true;
    }

    if(tower.store["energy"]>600 && tower.room.memory.construction["tower"].memory[tower.id].hasPushed){
        tower.room.memory.construction["tower"].memory[tower.id].hasPushed = false;
    }
}
