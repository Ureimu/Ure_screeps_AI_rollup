import { SpawnTask } from "task/utils/TaskClass";
import { getBpByRole } from "./bodypartsSetting";

export function templateSpawnTask(roomName: string, taskName: string, num: number, priority?: number, needTaskInf:boolean=true) {
    let chooseBodyParts = getBpByRole(taskName,roomName);
    let t: SpawnTask = new SpawnTask({
        priority:priority?priority:10,
        spawnInf:{
            bodyparts:chooseBodyParts,
            creepName:`${roomName}-${taskName}-${Game.time}-${num}`,
            roomName
        },
        isRunning:false,
        taskType:"",
        taskInf:needTaskInf?{state:[]}:undefined
    });
    t.taskType(taskName);
    return t;
}
