import taskPool from "task/utils/taskPool";

export function linkRunTask(room: Room): void {
    if (Game.time % 5 !== 0) {
        return;
    }
    const linkTaskQueue = taskPool.initQueue("linkTask", room.memory.taskPool);
    const taskList: LinkTaskInf[] = [];
    let ifOK = 2;
    const errorList: number[] = [];
    do {
        if (linkTaskQueue.isEmpty()) {
            const task = linkTaskQueue.pop() as LinkTaskInf;
            const inf = task.taskInf;
            if (typeof inf === "undefined") {
                console.log("未定义link任务");
            } else {
                const linkTransferFrom = Game.getObjectById<StructureLink>(inf.linkTransferFrom);
                const linkTransferTo = Game.getObjectById<StructureLink>(inf.linkTransferTo);
                if (linkTransferFrom && linkTransferTo) {
                    if (linkTransferFrom.store.energy >= 700) {
                        ifOK = linkTransferFrom.transferEnergy(linkTransferTo);
                    } else {
                        ifOK = 1;
                    }
                    console.log(`${inf.linkTransferFrom}-->${inf.linkTransferTo}`);
                }
                if (ifOK !== OK) {
                    taskList.push(task);
                    errorList.push(ifOK);
                    task.isRunning = true;
                }
            }
        } else {
            ifOK = OK;
        }
    } while (ifOK !== OK);
    for (const task of taskList) {
        linkTaskQueue.push(task);
    }
    for (let i = 0, j = taskList.length; i < j; i++) {
        // 返回任务错误信息
        const task = taskList[i];
        const errorNum = errorList[i];
        let errorText = "";
        switch (errorNum) {
            case 2:
                errorText = "发起或目标不是一个有效的 StructureLink 对象。";
                break;
            case 1:
                errorText = "能量未满，等待中";
                break;
            case 0:
                errorText = "执行成功，返回检查";
                break;
            case -1:
                errorText = "你不是该 link 的所有者。";
                break;
            case -6:
                errorText = `这个建筑内的资源少于给定的数量。数量：${task.taskInf.resourceNumber}`;
                break;
            case -7:
                errorText = "目标不是一个有效的 StructureLink 对象。";
                break;
            case -8:
                errorText = "目标无法接受更多能量。";
                break;
            case -9:
                errorText = "目标太远了。";
                break;
            case -10:
                errorText = "资源数量不正确。";
                break;
            case -11:
                errorText = "该 link 仍在冷却中。";
                break;
            case -14:
                errorText = "房间控制器等级不足以使用该 link。";
                break;
            default:
                break;
        }
        console.log(`<span style='color:#FFCCCC'>[link]  ${room.name}执行link任务失败,返回错误：${errorText}</span>`);
    }
    if (linkTaskQueue.size() > 18) {
        console.log(
            `<span style='color:#FF6666'>[link]  目前任务冗余过多(${linkTaskQueue.size()}个任务在该"${
                room.name
            }"的link任务队列中)，请及时检测清理任务！</span>`
        );
    }
    taskPool.setQueue(linkTaskQueue, "linkTask", room.memory.taskPool);
}
