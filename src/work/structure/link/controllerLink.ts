import { checkLinkTask } from "../utils/checkLinkTask";

export function controllerLink(link: StructureLink): void {
    if (typeof Object.keys(link.room.memory.construction.centerLink.memory)[0] === "undefined") return;
    const centerLinkId = Object.keys(link.room.memory.construction.centerLink.memory)[0] as Id<StructureLink>;
    const taskInf: LinkTaskInf = {
        priority: 4,
        isRunning: false,
        taskInf: {
            resourceType: RESOURCE_ENERGY,
            linkTransferFrom: centerLinkId,
            linkTransferTo: link.id,
            resourceNumber: 50000,
            state: []
        },
        taskType: ""
    };
    checkLinkTask(taskInf);
}
