import { LinkTaskInf } from "task/taskClass/extends/LinkTask";
import { checkLinkTask } from "../utils/checkLinkTask";

export function sourceLink(link: StructureLink): void {
    if (typeof Object.keys(link.room.memory.construction.centerLink.memory)[0] === "undefined") return;
    const centerLinkId = Object.keys(link.room.memory.construction.centerLink.memory)[0] as Id<StructureLink>;
    const taskInf: LinkTaskInf = {
        priority: 4,
        isRunning: false,
        taskInf: {
            resourceType: RESOURCE_ENERGY,
            linkTransferFrom: link.id,
            linkTransferTo: centerLinkId,
            resourceNumber: 50000,
            state: []
        },
        taskName: "",
        taskKindName: ""
    };
    checkLinkTask(taskInf);
}
