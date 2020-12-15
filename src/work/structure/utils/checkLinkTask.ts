import { LinkTask } from "task/taskClass/extends/LinkTask";
import { checkStructureTask } from "./checkStructureTask";

/**
 * 检查是否要推送任务到任务池。
 *
 * @export
 * @param {StructureLink} link
 * @param {LinkTaskInf} LinkTaskInf
 */
export function checkLinkTask(LinkTaskInf: LinkTaskInf): void {
    const linkTransferFrom = Game.getObjectById<StructureLink>(LinkTaskInf.taskInf.linkTransferFrom) as StructureLink;
    const linkTransferTo = Game.getObjectById<StructureLink>(LinkTaskInf.taskInf.linkTransferTo) as StructureLink;
    checkStructureTask(
        linkTransferFrom,
        [
            () => linkTransferFrom.store.energy > 700 && linkTransferTo.store.energy < 100,
            () => linkTransferFrom.store.energy < 100 && linkTransferTo.store.energy > 700
        ],
        () => {
            const taskInf: LinkTaskInf = LinkTaskInf;
            const task = new LinkTask(taskInf);
            task.pushTask(linkTransferFrom.room);
        }
    );
}
