import { SpawnTask, SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { getBpByRole } from "./getBpByRole";

export function templateSpawnTaskList(
    roomName: string,
    taskName: string,
    taskGroupName: string,
    num: number,
    priority?: number,
    needTaskInf = true
): SpawnTaskInf[] {
    const t: SpawnTaskInf[] = [];
    for (let i = 0; i < num; i++) {
        const chooseBodyParts = getBpByRole(taskName, taskGroupName, roomName);
        t.push(
            new SpawnTask({
                priority: priority ? priority : 10,
                spawnInf: {
                    bodyparts: chooseBodyParts,
                    creepName: `${roomName}-${taskName}-${Game.time}-${i}`,
                    roomName,
                    isRunning: false
                },
                isRunning: false,
                taskName,
                taskGroupName,
                taskInf: needTaskInf ? { state: [] } : undefined
            }).task
        );
    }
    return t;
}
