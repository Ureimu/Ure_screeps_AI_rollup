import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function oCarrySource(roomName: string): SpawnTaskInf[] {
    const taskName = "oCarrySource";
    const t = templateSpawnTask(roomName, taskName, 0, 4);
    return [t.task];
}
