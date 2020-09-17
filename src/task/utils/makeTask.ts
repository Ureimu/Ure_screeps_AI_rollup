//@ts-nocheck
//该模块已弃用。
import { TaskG } from "./makeTaskX";

export function mergeTask(...args: object[]) {
    let newObj = {};
    for (let oldObj of args) {
        newObj = Object.assign(newObj, oldObj);
    }
    return newObj;
} //合并任务只能做浅层合并，复杂对象只会被覆盖。

function makeTask(name: string, ...args: object[]): object {
    if (name == "spawn") {
        let spawnTaskObject = {};
        return spawnTaskObject;
    }
    return {};
}

/**
 * 生成一个spawnTask模板任务对象
 *
 * @param {()=>bpgGene[]} manage_bodyParts
 * @param {*} sponsorObject
 * @param {string} creepName
 * @returns
 */
export function makeSpawnTaskObject(
    manage_bodyParts: () => bpgGene[],
    creepName: string,
    task: Task,
    sponsorObject?: any,
    priority: number = 10,
    isRunning: boolean = false
) {
    let s = new TaskG(priority,isRunning);
    s.spawnTask(manage_bodyParts(),creepName,task);
    s.sponsor(sponsorObject)
    return s.task;
}

export function makeHarvestSourceTaskObject(sponsorObject: any, priority: number = 10, isRunning: boolean = false) {
    let harvestSourceTask = {
        sponsor: sponsorObject.id,
        priority: priority,
        isRunning: isRunning,
        taskInf: {
            taskType: "harvestSource"
        }
    };
    return harvestSourceTask;
}

export function makeCarrySourceTaskObject(priority: number = 12, isRunning: boolean = false, sponsorObject?: any) {
    let carrySourceTask = {
        sponsor: sponsorObject ? sponsorObject.id : undefined,
        priority: priority,
        isRunning: isRunning,
        taskInf: {
            taskType: "carrySource"
        }
    };
    return carrySourceTask;
}

export function makeUpgradeControllerTaskObject(priority: number = 8, isRunning: boolean = false, sponsorObject?: any) {
    let upgradeControllerTask = {
        sponsor: sponsorObject ? sponsorObject.id : undefined,
        priority: priority,
        isRunning: isRunning,
        taskInf: {
            taskType: "upgradeController"
        }
    };
    return upgradeControllerTask;
}

export function makeBuildingTaskObject(priority: number = 9, isRunning: boolean = false) {
    let buildingTask = {
        priority: priority,
        isRunning: isRunning,
        taskInf: {
            taskType: "buildAndRepair"
        }
    };
    return buildingTask;
}

