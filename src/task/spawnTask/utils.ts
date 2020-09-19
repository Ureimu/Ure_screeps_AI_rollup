import { TaskG } from "task/utils/makeTaskX";
import { getBpByRole } from "utils/bodypartsGenerator";

export function templateSpawnTask(roomName: string, taskName: string, num: number, priority?: number) {
    let chooseBodyParts = getBpByRole(taskName,roomName);
    let t: TaskG = new TaskG(priority);

    t.spawnTask(chooseBodyParts,`${roomName}-${taskName[0]+taskName[1]}-${Game.time}-${num}`);
    t.taskType(taskName);
    return t;
}
