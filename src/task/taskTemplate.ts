//@ts-nocheck

import * as makeTask from "./utils/makeTask";
import { RoomTask } from "./utils/RoomTask";
import { PriorityQueue } from "./utils/PriorityQueue";

function taskTemplate(roomName:string,taskList:PriorityQueue,roomListToAllocate: {[roomName:string] :number} = {}):void{
    {
        let templateRoomTask = new RoomTask(roomName,'template');
        taskList.clear();
        if(!templateRoomTask.hasPushed){
            templateRoomTask.hasPushed=true;
            let chooseBodyParts = function (): bpgGene[] {
                return [{ move: 3, carry: 3 }];
            };
            {
                //推送任务条件判断代码
            }
            if(/** 推送任务条件代码 */1){
                for (let i = 0, j = 1/** 推送任务数量 */; i < j; i++) {
                    let obj2 = makeTask.maketemplateTaskObject();
                    let obj: any = makeTask.makeSpawnTaskObject(
                        chooseBodyParts,
                        `${roomName}-C-${i + 1}`,
                        obj2,
                        undefined,
                        12
                    );
                    taskList.push(obj);
                }
            }
        }
        roomListToAllocate=Object.assign(roomListToAllocate,autoPush(templateRoomTask,taskList));
    }
}
