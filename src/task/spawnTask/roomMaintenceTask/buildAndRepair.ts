import { templateSpawnTask } from "../utils/templateTask";

export function buildAndRepair(roomName: string): SpawnTaskInf[] {
    const taskName = "buildAndRepair";
    const taskList: SpawnTaskInf[] = [];
    for (let i = 0; i < 3; i++) {
        const t = templateSpawnTask(roomName, taskName, i, 9);
        taskList.push(t.task);
    }
    return taskList;
}
