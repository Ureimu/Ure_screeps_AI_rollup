import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function oClaimer(roomName: string): SpawnTaskInf[] {
    const taskName = "oClaimer";
    const t = templateSpawnTask(roomName, taskName, 0, 4);
    return [t.task];
}
