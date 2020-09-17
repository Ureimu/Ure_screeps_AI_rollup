import { TaskG } from "task/utils/makeTaskX";
import { RoomTask } from "task/utils/RoomTask";
import { getBpByRole } from "utils/bodypartsGenerator";

export function templateSpawnTask(roomName: string, taskName: string, priority?: number) {
    let AnyRoomTask = new RoomTask(roomName,taskName);
    if(!AnyRoomTask.hasPushed){
        AnyRoomTask.hasPushed=true;
        let chooseBodyParts = getBpByRole(taskName,roomName);
        let t: TaskG = new TaskG(priority);
        t.spawnTask(chooseBodyParts,`${roomName}-${taskName[0]+taskName[1]}-${Game.time}`);
        t.taskType(taskName);
        return t;
    }
    return;
}
