// Type definitions for PriorityQueue v1.1.0 by Scorpior
// Project: PriorityQueue
// Definitions by: Ureimu <https://github.com/Ureimu>

declare class PriorityQueue<T extends PriorityQueue.node> {
    /**
     * 创建一个PriorityQueue实例.
     * @param {boolean} isMinRoot 优先级方向，true则pop()时得到数字最小的，否则pop()出最大的。
     * @memberof PriorityQueue
     */
    public constructor(isMinRoot: boolean);

    /**
     * 把节点插入队列
     *
     * @param T node 待插入对象，至少含有priority属性
     * @returns T
     * @memberof PriorityQueue
     */
    public push(node: T): T;
    /**
     * 查看顶端节点，空队列返回undefined
     *
     * @returns {(T | undefined)}
     * @memberof PriorityQueue
     */
    public top(): T | undefined;
    /**
     * 取出顶端节点，空队列返回undefined
     *
     * @returns {(T | undefined)}
     * @memberof PriorityQueue
     */
    public pop(): T | undefined;
    /**
     * 队列元素个数
     *
     * @returns {number}
     * @memberof PriorityQueue
     */
    public size(): number;
    /**
     * 清空整个队列
     *
     * @memberof PriorityQueue
     */
    public clear(): void;
    /**
     * 队列是否为空。
     *
     * @returns {boolean} 空返回false,不空返回true
     * @memberof PriorityQueue
     */
    public isEmpty(): boolean;
}
declare namespace PriorityQueue {
    /**
     * 对象，至少含有priority属性
     *
     * @export
     * @interface node
     */
    interface node {
        [name: string]: any;
        priority: number;
    }
}

export = PriorityQueue;
