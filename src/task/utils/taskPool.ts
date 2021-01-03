import PriorityQueue from "../../../utils/PriorityQueue";

/**
 * 任务池，由多个任务队列组成。
 *
 * @interface TaskPool
 */
export interface taskPool<T extends PriorityQueue.node> {
    [name: string]: T[];
}

export class TaskPool<T extends PriorityQueue.node> {
    /**
     * 将Memory中保存的队列转换为c++队列对象.
     *
     * @param {TaskQueue} taskPoolMemory 存储路径
     * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
     * @returns {(PriorityQueue | undefined)} c++队列对象
     */
    public getQueueFromArray(taskPoolMemory: T[], towards = false): PriorityQueue<T> {
        const taskQueue = this.newQueue(towards);
        if (taskPoolMemory && taskPoolMemory.length > 0) {
            for (const task of taskPoolMemory) {
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
    public getQueueFromObject(
        wantedTaskQueueName: string,
        taskPoolMemory: taskPool<T>,
        towards = false
    ): PriorityQueue<T> | undefined {
        for (const taskQueueName in taskPoolMemory) {
            if (taskQueueName === wantedTaskQueueName) {
                const taskQueue = new PriorityQueue<T>(towards);
                if (taskPoolMemory[taskQueueName] && taskPoolMemory[taskQueueName].length > 0) {
                    for (const task of taskPoolMemory[taskQueueName]) {
                        taskQueue.push(task);
                    }
                }
                return taskQueue;
            }
        }
        global.log("[error] " + "任务池中没有任务列表：" + wantedTaskQueueName);
        return undefined;
    }

    /**
     * 将c++队列对象保存到Memory.
     *
     * @param {PriorityQueue<BaseTaskInf>} queue 要保存的队列
     * @param {TaskQueue} taskPoolMemory 存储路径
     * @param {string} TaskQueueName 队列名称
     */
    public setQueue(queue: PriorityQueue<T>, TaskQueueName: string, taskPoolMemory: taskPool<T>): T[] {
        taskPoolMemory[TaskQueueName].splice(0); // 清空数组，不能直接赋空数组(=[]),因为这里的函数参数是引用,重新赋值会覆盖引用.
        for (let i = 0, j = queue.size(); i < j; i++) {
            taskPoolMemory[TaskQueueName].push(queue.pop() as T);
        }
        return taskPoolMemory[TaskQueueName];
    }

    /**
     * 从taskQueue初始化PriorityQueue.
     *
     * @param {PriorityQueue<T>} queue 要保存的队列
     * @param {TaskQueue} taskQueueMemory 队列存储路径
     * @returns {TaskQueue} 队列存储路径
     */
    public setQueueFromTaskQueue(queue: PriorityQueue<T>, taskQueueMemory: T[]): T[] {
        taskQueueMemory.splice(0); // 清空数组，不能直接赋空数组(=[]),因为这里的函数参数是引用,重新赋值会覆盖引用.
        for (let i = 0, j = queue.size(); i < j; i++) {
            taskQueueMemory.push(queue.pop() as T);
        }
        return taskQueueMemory;
    }

    /**
     * 新声明一个优先队列。
     *
     * @param {boolean} [towards=false] 队列的pop方向。默认优先弹出最高优先级的。
     * true则pop()时得到优先级最小的，否则pop()出最大的。
     * @returns {PriorityQueue<T>} 一个空的PriorityQueue对象
     */
    public newQueue(towards = false): PriorityQueue<T> {
        return new PriorityQueue<T>(towards);
    }

    /**
     * 初始化一个队列，如果在taskPoolMemory中有该队列则返回该队列，否则返回一个新队列。
     *
     * @param {string} wantedTaskQueueName 队列名称
     * @param {TaskQueue} taskPoolMemory 存储路径
     * @param {boolean} [towards=false] pop的方向，默认优先弹出最大
     * @returns {PriorityQueue<BaseTaskInf>}
     */
    public initQueue(wantedTaskQueueName: string, taskPoolMemory: taskPool<T>, towards = false): PriorityQueue<T> {
        let queue = this.newQueue(towards);
        if (
            (queue = this.getQueueFromObject(wantedTaskQueueName, taskPoolMemory, towards) as PriorityQueue<T>) !==
            undefined
        ) {
            return queue;
        } else {
            global.log("[init]  创建新任务队列: " + wantedTaskQueueName);
            taskPoolMemory[wantedTaskQueueName] = [];
            return this.newQueue(towards);
        }
    }

    /**
     * 从给定的memory中的队列初始化该队列
     *
     * @param {TaskQueue} taskQueueMemory
     * @param {boolean} [towards=false]
     * @returns {PriorityQueue<T>}
     */
    public initQueueFromTaskQueue(taskQueueMemory: T[], towards = false): PriorityQueue<T> {
        return this.getQueueFromArray(taskQueueMemory, towards);
    }

    /**
     * 从queueFrom取出元素并交给queueTo
     *
     * @param {PriorityQueue<T>} queueFrom
     * @param {PriorityQueue<T>} queueTo
     * @returns {boolean} 成功返回true,失败返回false.
     */
    public transTask(queueFrom: PriorityQueue<T>, queueTo: PriorityQueue<T>): boolean {
        if (queueFrom.isEmpty()) {
            queueTo.push(queueFrom.pop() as T);
            return true;
        } else {
            return false;
        }
    }
}
