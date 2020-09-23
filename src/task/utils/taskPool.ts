import { PriorityQueue } from './PriorityQueue'

/**
 * 将Memory中保存的队列转换为c++队列对象.
 *
 * @param {string} wantedTaskQueueName 队列名称
 * @param {TaskQueue} taskPoolMemory 存储路径
 * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
 * @returns {(PriorityQueue | undefined)} c++队列对象
 */
function getQueueFromArray(taskPoolMemory: BaseTaskInf[], towards: boolean = false): PriorityQueue {
    let taskQueue = newQueue(towards);
    if(taskPoolMemory && taskPoolMemory.length>0){
        for (let task of <BaseTaskInf[]>taskPoolMemory) {
            taskQueue.push(task);
        }
    }
    return taskQueue;
}

/**
 * 将Memory中保存的队列转换为c++队列对象.
 *
 * @param {string} wantedTaskQueueName 队列名称
 * @param {TaskQueue} taskPoolMemory 存储路径
 * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
 * @returns {(PriorityQueue | undefined)} c++队列对象
 */
function getQueueFromObject(wantedTaskQueueName: string,taskPoolMemory: TaskPool, towards: boolean = false): PriorityQueue | undefined {
    for (let taskQueueName in taskPoolMemory) {
        if (taskQueueName == wantedTaskQueueName) {
            let taskQueue = new PriorityQueue(towards);
            if(taskPoolMemory[taskQueueName] && taskPoolMemory[taskQueueName].length>0){
                for (let task of <BaseTaskInf[]>taskPoolMemory[taskQueueName]) {
                    taskQueue.push(task);
                }
            }
            return taskQueue;
        }
    }
    console.log('[error]'+'任务池中没有任务列表：' + wantedTaskQueueName);
    return undefined;
}

/**
 * 将c++队列对象保存到Memory.
 *
 * @param {PriorityQueue} queue 要保存的队列
 * @param {TaskQueue} taskPoolMemory 存储路径
 * @param {string} TaskQueueName 队列名称
 */
function setQueue(queue: PriorityQueue,TaskQueueName: string,taskPoolMemory: TaskPool): BaseTaskInf[] {
    taskPoolMemory[TaskQueueName].splice(0);//清空数组，不能直接赋空数组(=[]),因为这里的函数参数是引用,重新赋值会覆盖引用.
    for (let i = 0, j = queue.size(); i < j; i++) {
        taskPoolMemory[TaskQueueName].push(<BaseTaskInf>queue.pop());
    }
    return taskPoolMemory[TaskQueueName];
}

/**
 * 从taskQueue初始化PriorityQueue.
 *
 * @param {PriorityQueue} queue 要保存的队列
 * @param {TaskQueue} taskQueueMemory 队列存储路径
 * @returns {TaskQueue} 队列存储路径
 */
function setQueueFromTaskQueue(queue: PriorityQueue,taskQueueMemory: BaseTaskInf[]): BaseTaskInf[] {
    taskQueueMemory.splice(0);//清空数组，不能直接赋空数组(=[]),因为这里的函数参数是引用,重新赋值会覆盖引用.
    for (let i = 0, j = queue.size(); i < j; i++) {
        taskQueueMemory.push(<BaseTaskInf>queue.pop());
    }
    return taskQueueMemory;
}

/**
 * 新声明一个优先队列。
 *
 * @param {boolean} [towards=false] 队列的pop方向。默认优先弹出最高优先级的。
 * true则pop()时得到优先级最小的，否则pop()出最大的。
 * @returns {PriorityQueue} 一个空的PriorityQueue对象
 */
function newQueue(towards: boolean = false): PriorityQueue {
    return new PriorityQueue(towards);
}

/**
 * 初始化一个队列，如果在taskPoolMemory中有该队列则返回该队列，否则返回一个新队列。
 *
 * @param {string} wantedTaskQueueName 队列名称
 * @param {TaskQueue} taskPoolMemory 存储路径
 * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
 * @returns {PriorityQueue}
 */
function initQueue(wantedTaskQueueName: string,taskPoolMemory: TaskPool, towards: boolean = false): PriorityQueue {
    let queue = newQueue(towards);
    if((queue = <PriorityQueue>getQueueFromObject(wantedTaskQueueName,taskPoolMemory,towards))!==undefined){
        return queue;
    }
    else{
        console.log('[init] 创建新任务队列: '+wantedTaskQueueName);
        taskPoolMemory[wantedTaskQueueName]=[];
        return newQueue(towards);
    }
}

/**
 * 从给定的memory中的队列初始化该队列
 *
 * @param {TaskQueue} taskQueueMemory
 * @param {boolean} [towards=false]
 * @returns {PriorityQueue}
 */
function initQueueFromTaskQueue(taskQueueMemory: BaseTaskInf[], towards: boolean = false): PriorityQueue {
    return <PriorityQueue>getQueueFromArray(taskQueueMemory,towards);
}

/**
 * 从queueFrom取出元素并交给queueTo
 *
 * @param {PriorityQueue} queueFrom
 * @param {PriorityQueue} queueTo
 * @returns {boolean} 成功返回true,失败返回false.
 */
function transTask(queueFrom: PriorityQueue, queueTo: PriorityQueue):boolean{
    if(queueFrom.isEmpty()){
        queueTo.push(<BaseTaskInf>queueFrom.pop());
        return true;
    }else{
        return false;
    }
}

export default {
    /**
     * 将Memory中保存的队列转换为c++队列对象.
     *
     * @param {string} wantedTaskQueueName 队列名称
     * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
     * @returns {(PriorityQueue | undefined)} c++队列对象
     */
    getQueueFromArray: getQueueFromArray,

    getQueueFromObject:getQueueFromObject,

    /**
     * 将c++队列对象保存到Memory.
     *
     * @param {PriorityQueue} queue 要保存的队列
     * @param {string} TaskQueueName 队列名称
     */
    setQueue: setQueue,

    setQueueFromTaskQueue:setQueueFromTaskQueue,

    /**
     * 新声明一个优先队列。
     *
     * @param {boolean} [towards=false] 队列的pop方向。
     * @returns {PriorityQueue} 一个空的PriorityQueue对象
     */
    newQueue: newQueue,

    /**
     * 初始化一个队列，如果在taskPoolMemory中有该队列则返回该队列，否则返回一个新队列。
     *
     * @param {string} wantedTaskQueueName
     * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
     * @returns {PriorityQueue}
     */
    initQueue: initQueue,

    initQueueFromTaskQueue:initQueueFromTaskQueue,

    /**
     * 从queueFrom取出元素并交给queueTo
     *
     * @param {PriorityQueue} queueFrom
     * @param {PriorityQueue} queueTo
     * @returns {boolean} 成功返回true,失败返回false.
     */
    transTask: transTask,
}
