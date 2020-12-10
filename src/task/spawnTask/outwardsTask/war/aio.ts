import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function aio(roomName: string): SpawnTaskInf[] {
    const taskName = "aio";
    const taskList: SpawnTaskInf[] = [];
    for (let i = 0; i < 1; i++) {
        const t = templateSpawnTask(roomName, taskName, i, 5);
        taskList.push(t.task);
    }
    return taskList;
}
