import { getGridLayout, ifEnoughSpace } from "construction/composition/gridLayout";
import { runLayout } from "construction/composition/runLayOut";
import { log } from "utils/consoleLog/log";
import * as profiler from "../../utils/profiler";

export function globalFunctionRegister(): void {
    // 在global上写入全局函数对象
    global.getNum = function (num: number): number {
        let x = 1;
        let u = 0;
        for (let i = 0; i < 100; i++) {
            u += x * num;
            x *= 0.95;
        }
        return u;
    };

    global.log = log;

    global.memoryReset = function (): void {
        RawMemory.set("");
    };

    global.clearError = function (): void {
        Memory.errors.errorCount = [];
        Memory.errors.errorIntervals = [];
        Memory.errors.errorList = [];
    };

    global.deleteTask = function (creepName: string): void {
        delete Memory.creeps[creepName];
        Game.creeps[creepName].suicide();
    };

    global.war = {};

    global.help = function (): string {
        return `profilerHelp
        Game.profiler.profile(ticks, [functionFilter]);
        Game.profiler.stream(ticks, [functionFilter]);
        Game.profiler.email(ticks, [functionFilter]);
        Game.profiler.background([functionFilter]);

        // Output current profile data.
        Game.profiler.output([lineCount]);
        Game.profiler.callgrind();

        // Reset the profiler, disabling any profiling in the process.
        Game.profiler.reset();

        Game.profiler.restart();`;
    };

    // 测试时会使用的全局变量
    // main循环会一直调用的函数
    global.stateLoop = {};

    global.state = {};

    global.testX = {
        logger: ""
    };

    global.testError = () => {
        throw new Error("TestError");
    };

    global.getLayout = ifEnoughSpace;

    global.runLayout = (roomName: string) => {
        getGridLayout(Game.rooms[roomName]);
    };

    profiler.registerObject(global.stateLoop, "stateLoop");
}
// test.runGridLayout(Game.rooms["W8N3"])
