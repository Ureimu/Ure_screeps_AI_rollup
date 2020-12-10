import { templateSpawnTask } from "../utils/templateTask";

export function carryResource(roomName: string): SpawnTaskInf[] {
    const taskName = "carryResource";
    const t = templateSpawnTask(roomName, taskName, 0, 6, false);
    return [t.task];
}
