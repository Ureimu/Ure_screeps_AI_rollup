import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { templateSpawnTask } from "../utils/templateSingleTask";

export function createOHarvestSourceTask(
    room: Room,
    taskName: string,
    taskKindName: string,
    i: number,
    priority: number
): SpawnTaskInf[] {
    let k = 0;
    const taskList: SpawnTaskInf[] = [];
    const targetRoomName = taskKindName.split("-")?.[1];
    for (const sourceName in Memory.rooms[targetRoomName].sources) {
        k += 10;
        const t = templateSpawnTask(room.name, taskName, taskKindName, i + k, priority, targetRoomName);
        const source = Game.getObjectById<Source>(Memory.rooms[targetRoomName].sources[sourceName].id) as Source;
        t.sponsor(source);
        t.addTaskInf({
            scoutRoomName: targetRoomName
        });
        taskList.push(t.task);
    }
    return taskList;
}
