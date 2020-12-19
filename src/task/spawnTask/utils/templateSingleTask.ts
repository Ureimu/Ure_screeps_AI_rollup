import { SpawnTask } from "task/taskClass/extends/SpawnTask";
import { getBpByRole } from "./getBpByRole";

export function templateSpawnTask(
    roomName: string,
    taskName: string,
    taskKindName: string,
    num: number,
    priority: number,
    needTaskInf = true
): SpawnTask {
    const chooseBodyParts = getBpByRole(taskName, taskKindName, roomName);
    const t: SpawnTask = new SpawnTask({
        priority,
        spawnInf: {
            bodyparts: chooseBodyParts,
            creepName: `${roomName}-${taskName}-${Game.time}-${num}`,
            roomName
        },
        isRunning: false,
        taskName,
        taskKindName,
        taskInf: needTaskInf ? { state: [] } : undefined
    });
    return t;
}
