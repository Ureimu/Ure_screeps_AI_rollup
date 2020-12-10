import { SpawnTask } from "task/taskClass/extends/SpawnTask";
import { getBpByRole } from "./bodypartsSetting";

export function templateSpawnTask(
    roomName: string,
    taskName: string,
    num: number,
    priority?: number,
    needTaskInf = true
): SpawnTask {
    const chooseBodyParts = getBpByRole(taskName, roomName);
    const t: SpawnTask = new SpawnTask({
        priority: priority ? priority : 10,
        spawnInf: {
            bodyparts: chooseBodyParts,
            creepName: `${roomName}-${taskName}-${Game.time}-${num}`,
            roomName
        },
        isRunning: false,
        taskType: "",
        taskInf: needTaskInf ? { state: [] } : undefined
    });
    t.taskType(taskName);
    return t;
}
