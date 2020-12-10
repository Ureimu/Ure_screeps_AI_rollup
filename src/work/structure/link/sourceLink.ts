import { LinkTask } from "task/taskClass/extends/LinkTask";

export function sourceLink(link: StructureLink): void {
    if (!link.room.memory.construction.sourceLink.memory[link.id])
        link.room.memory.construction.sourceLink.memory[link.id] = {
            hasPushed: false
        };
    if (link.store.energy > 700 && !link.room.memory.construction.sourceLink.memory[link.id].hasPushed) {
        const taskInf: LinkTaskInf = {
            priority: 4,
            isRunning: false,
            taskInf: {
                resourceType: RESOURCE_ENERGY,
                linkTransferFrom: link.id,
                linkTransferTo: Object.keys(link.room.memory.construction.centerLink.memory)[0] as Id<StructureLink>,
                resourceNumber: 50000,
                state: []
            },
            taskType: ""
        };
        const task = new LinkTask(taskInf);
        task.pushTask(link.room);
        link.room.memory.construction.sourceLink.memory[link.id].hasPushed = true;
    }

    if (link.store.energy < 100 && link.room.memory.construction.sourceLink.memory[link.id].hasPushed) {
        link.room.memory.construction.sourceLink.memory[link.id].hasPushed = false;
    }
}
