import { templateSpawnTask } from "../utils/templateTask";

export function upgradeController(roomName: string): SpawnTaskInf[] {
    const taskName = "upgradeController";
    const t = templateSpawnTask(roomName, taskName, 0, 8);
    return [t.task];
}
