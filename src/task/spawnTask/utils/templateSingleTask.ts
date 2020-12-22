import { SpawnTask } from "task/taskClass/extends/SpawnTask";
import { getBpByRole } from "./getBpByRole";

export function templateSpawnTask(
    roomName: string,
    taskName: string,
    taskKindName: string,
    num: number,
    priority: number,
    targetRoomName?: string,
    needTaskInf = true
): SpawnTask {
    const chooseBodyParts = getBpByRole(taskName, taskKindName, roomName);
    const t: SpawnTask = new SpawnTask({
        priority,
        spawnInf: {
            bodyparts: chooseBodyParts,
            creepName: targetRoomName
                ? `${roomName}-${taskName}-${targetRoomName}-${Game.time}-${num}`
                : `${roomName}-${taskName}-${Game.time}-${num}`,
            roomName,
            isRunning: false
        },
        isRunning: false,
        taskName,
        taskKindName,
        taskInf: needTaskInf ? { state: [] } : undefined
    });
    return t;
}
