import { SpawnTask } from "task/taskClass/extends/SpawnTask";
import { getBpByRole } from "./getBpByRole";

export function templateSpawnTask(
    roomName: string,
    taskName: string,
    num: number,
    priority: number,
    needTaskInf = true
): SpawnTask {
    const chooseBodyParts = getBpByRole(taskName, roomName);
    const t: SpawnTask = new SpawnTask({
        priority,
        spawnInf: {
            bodyparts: chooseBodyParts,
            creepName: `${roomName}-${taskName}-${Game.time}-${num}`,
            roomName
        },
        isRunning: false,
        taskType: taskName,
        taskInf: needTaskInf ? { state: [] } : undefined
    });
    return t;
}
