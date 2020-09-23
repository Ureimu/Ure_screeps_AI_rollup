import { SpawnTask } from "task/utils/TaskClass";
import { getBpByRole } from "AllUtils/bodypartsGenerator";

export function templateSpawnTask(roomName: string, taskName: string, num: number, priority?: number) {
    let chooseBodyParts = getBpByRole(taskName,roomName);
    let t: SpawnTask = new SpawnTask(priority);

    t.getSpawnTask(chooseBodyParts,`${roomName}-${taskName[0]+taskName[1]}-${Game.time}-${num}`);
    t.taskType(taskName);
    return t;
}
