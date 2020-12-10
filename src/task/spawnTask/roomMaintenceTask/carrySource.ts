import { templateSpawnTask } from "../utils/templateTask";

export function carrySource(roomName: string): SpawnTaskInf[] {
    const taskName = "carrySource";
    const t = templateSpawnTask(roomName, taskName, 0, 12);
    return [t.task];
}
