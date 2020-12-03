import { templateSpawnTask } from "../utils/templateTask";

export function centerCarry(roomName:string) {
    let taskName = "centerCarry";
    let t = templateSpawnTask(roomName,taskName,0,12);
    return [t.task]
}
