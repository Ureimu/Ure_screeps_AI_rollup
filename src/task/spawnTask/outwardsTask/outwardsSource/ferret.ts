import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function ferret(roomName: string): SpawnTaskInf[] {
    const taskName = "ferret";
    const t = templateSpawnTask(roomName, taskName, 0, 4);
    return [t.task];
}
