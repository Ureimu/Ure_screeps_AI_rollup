import * as profiler from "../../utils/profiler";
import { globalConstantRegister } from "./mountGlobalConstant";
import { globalFunctionRegister } from "./mountGlobalFunction";
import { mountPrototypeExtension } from "./mountPrototypeExtension";

export function mountGlobal(): void {
    if (!global.time) global.time = 0;
    global.time++;
    if (global.time === 1) {
        profiler.enable();
        mountPrototypeExtension();
        // mountCreepEnergyMonitor();
        globalConstantRegister();
        globalFunctionRegister();
        if (!Memory.errors) {
            Memory.errors = {
                errorCount: [],
                errorList: [],
                errorIntervals: []
            };
        }
    }
}
