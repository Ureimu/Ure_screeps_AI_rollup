import { CarryTask, CarryTaskInf } from "task/taskClass/extends/CarryTask";

export function runStorage(storage: StructureStorage): void {
    if (storage.store.energy < 50000 && !storage.room.memory.construction.storage.memory[storage.id].hasPushed) {
        const taskInf: CarryTaskInf = {
            priority: 4,
            isRunning: false,
            taskInf: {
                resourceType: RESOURCE_ENERGY,
                structureCarryFrom: "sourceContainer",
                structureCarryTo: "storage",
                resourceNumber: 50000,
                state: []
            },
            taskName: "",
            taskGroupName: ""
        };
        const task = new CarryTask(taskInf);
        task.pushTask(storage.room);
        storage.room.memory.construction.storage.memory[storage.id].hasPushed = true;
    }

    if (storage.store.energy > 50000 && storage.room.memory.construction.storage.memory[storage.id].hasPushed) {
        storage.room.memory.construction.storage.memory[storage.id].hasPushed = false;
    }
}
