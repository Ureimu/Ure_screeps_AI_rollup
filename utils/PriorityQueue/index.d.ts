// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/* ~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/* ~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/* ~ If this module is a UMD module that exposes a global variable 'myClassLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */

/* ~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */

/* ~ Write your module's methods and properties in this class */

declare class PriorityQueue {
    /**
     *Creates an instance of PriorityQueue.
     * @param {boolean} isMinRoot 优先级方向，true则pop()时得到数字最小的，否则pop()出最大的。
     * @memberof PriorityQueue
     */
    public constructor(isMinRoot: boolean);

    /**
     * 把节点插入队列
     *
     * @param {PriorityQueue.node} node 待插入对象，至少含有priority属性
     * @returns {PriorityQueue.node}
     * @memberof PriorityQueue
     */
    public push(node: PriorityQueueElement.node): PriorityQueueElement.node;
    /**
     * 查看顶端节点，空队列返回undefined
     *
     * @returns {(PriorityQueue.node | undefined)}
     * @memberof PriorityQueue
     */
    public top(): PriorityQueueElement.node | undefined;
    /**
     * 取出顶端节点，空队列返回undefined
     *
     * @returns {(PriorityQueue.node | undefined)}
     * @memberof PriorityQueue
     */
    public pop(): PriorityQueueElement.node | undefined;
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
     * 队列是否为空,空返回false,不空返回true
     *
     * @returns {boolean} 空返回false,不空返回true
     * @memberof PriorityQueue
     */
    public isEmpty(): boolean;
}

/* ~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 */
declare namespace PriorityQueueElement {
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
