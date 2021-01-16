import { CarryTask, CarryTaskInf } from "task/taskClass/extends/CarryTask";

export function runTower(tower: StructureTower): void {
    if (tower.store.energy < 600 && !tower.room.memory.construction.tower.memory[tower.id].hasPushed) {
        const taskInf: CarryTaskInf = {
            priority: 6,
            isRunning: false,
            taskInf: {
                resourceType: RESOURCE_ENERGY,
                structureCarryFrom: "sourceContainer",
                structureCarryTo: "tower",
                resourceNumber: 600,
                state: []
            },
            taskName: "",
            taskGroupName: ""
        };
        const task = new CarryTask(taskInf);
        task.pushTask(tower.room);
        tower.room.memory.construction.tower.memory[tower.id].hasPushed = true;
    }

    if (tower.store.energy > 600 && tower.room.memory.construction.tower.memory[tower.id].hasPushed) {
        tower.room.memory.construction.tower.memory[tower.id].hasPushed = false;
    }
}
