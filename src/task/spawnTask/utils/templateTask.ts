import { SpawnTask } from "task/utils/TaskClass";
import { getBpByRole } from "./bodypartsSetting";

export function templateSpawnTask(roomName: string, taskName: string, num: number, priority?: number) {
    let chooseBodyParts = getBpByRole(taskName,roomName);
    let t: SpawnTask = new SpawnTask(priority);

    t.getSpawnTask(chooseBodyParts,`${roomName}-${taskName}-${Game.time}-${num}`);
    t.taskType(taskName);
    return t;
}
