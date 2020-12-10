import { templateSpawnTask } from "../utils/templateTask";

export function centerCarry(roomName: string): SpawnTaskInf[] {
    const taskName = "centerCarry";
    const t = templateSpawnTask(roomName, taskName, 0, 12);
    return [t.task];
}
