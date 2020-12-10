import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function sledge(roomName: string): SpawnTaskInf[] {
    const taskName = "sledge";
    const taskList: SpawnTaskInf[] = [];
    for (let i = 0; i < 1; i++) {
        const t = templateSpawnTask(roomName, taskName, i, 5);
        taskList.push(t.task);
    }
    return taskList;
}
