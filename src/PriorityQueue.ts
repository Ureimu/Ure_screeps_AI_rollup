//@ts-nocheck
/**
 *  wasm 优先队列
 *  帮你加速涉及优先级的调度算法
 *
 *  author: Scorpior
 *  version: v1.1.0
 *
 *  usage:
 *  1. add .js and .wasm modules
 *  2. require .js module and use
 *
 */

// @ts-ignore
const binary = require('priority_queue');   // 读取二进制文件
const wasmModule = new WebAssembly.Module(binary);  // 初始化为wasm类

/**
 *
 * @typedef {Object} node
 * @property {number} priority 优先级实数（可负）
 *
 * @typedef {{
 *      memory:{
 *          buffer: ArrayBuffer
 *      },
 *      init(is_min:number):void,
 *      push(priorty:number, id:number):void,
 *      pop():void,
 *      top():number,
 *      get_identifier(pointer:number):number,
 *      size():number,
 *      clear():void,
 *      is_empty():boolean
 *  }} cppQueue
 */

class BaseQueue {
    /**
     * 队列元素个数
     * @returns {number}
     */
    size() {
        // @ts-ignore
        return this.instance.size();
    }
    /**
     * 清空整个队列
     */
    clear() {
        // @ts-ignore
        this.instance.clear();
    }
    /**
     * 队列是否为空
     * @returns {boolean} 实际返回值是0或1
     */
    isEmpty() {
        // @ts-ignore
        return this.instance.is_empty();
    }
}

/**
 *  c++优先队列
 *  最大容量 131072 个元素（2的17次方）
 *  每个元素是带有priority属性的任意对象
 *  连续pop 100k个元素时比js队列快 80% 以上，元素个数少时比js快 5~10 倍
 */
class PriorityQueue extends BaseQueue {
    /**
     * @param {boolean} isMinRoot 优先级方向，true则pop()时得到数字最小的，否则pop()出最大的
     */
    constructor(isMinRoot: boolean) {
        super();
        /**@type {cppQueue} */
        let instance: { init: (arg0: number) => void; push: (arg0: number, arg1: number) => void; size: () => number; memory: { buffer: { byteLength: number; }; }; top: () => any; get_identifier: (arg0: any) => string | number; pop: () => void; };
        /**@type {node[]} */
        let cache: Task[] = [];

        const imports = {   // 把wasm类实例化需要的接口函数
            env: {
                emscripten_notify_memory_growth() {
                }
            },
            wasi_snapshot_preview1: {
                proc_exit: () => { }
            }
        };
        // @ts-ignore
        instance = new WebAssembly.Instance(wasmModule, imports).exports;   // 实例化
        instance.init(+!!isMinRoot);  // !!转化为boolean, +转为数字

        /**
         * @param {node} node
         */
        this.push = (node) => {
            try {
                instance.push(+node.priority, cache.length);
                cache.push(node);
            } catch (e) {
                if (e instanceof TypeError) {
                    throw e;
                } else {
                    throw Error(`priorityQueue is full.\n\t Current size is ${instance.size()}, buffer length is ${instance.memory.buffer.byteLength * 2 / 1024}KB.`);
                }
            }
        }
        /**
         *  @returns {node|undefined}
         */
        this.pop = () => {
            if (instance.size() > 0) {
                let pointer = instance.top();
                let id = instance.get_identifier(pointer);
                let node = cache[id];
                instance.pop();
                // @ts-ignore
                cache[id] = undefined;
                return node;
            } else {
                return undefined;
            }
        }
        /**
         *  @returns {node|undefined}
         */
        this.top = () => {
            if (instance.size() > 0) {
                let pointer = instance.top();
                return cache[instance.get_identifier(pointer)];
            } else {
                return undefined;
            }
        }

        Object.defineProperty(this, 'instance', {   // 不想被枚举到
            value: instance
        })
    }
    /**
     *  把节点插入队列
     * @param {node} node 待插入对象，至少含有priority属性
     */
    push(node: Task) { }
    /**
     *  查看顶端节点，空队列返回undefined
     *  @returns {node|undefined}
     */
    top(): Task|undefined { return }
    /**
     *  取出顶端节点，空队列返回undefined
     *  @returns {node|undefined}
     */
    pop(): Task|undefined { return }
}

export {PriorityQueue};
