/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
//@ts-nocheck
{
    let stateScanner = {
        run: function () {
            // 每 20 tick 运行一次
            if (Game.time % 20) return
            let inf = require('inf');
            if (!Memory.stats) Memory.stats = {}
            if (!Memory.stats.rcl) Memory.stats.rcl = {}
            if (!Memory.stats.rclLevel) Memory.stats.rclLevel = {}
            if (!Memory.stats.containerEnergyNum) Memory.stats.containerEnergyNum = {}
            if (!Memory.stats.storageEnergyNum) Memory.stats.storageEnergyNum = {}
            if (!Memory.stats.missionRunning) Memory.stats.missionRunning = {}
            // 统计 GCL / GPL 的升级百分比和等级
            Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
            Memory.stats.gclLevel = Game.gcl.level
            Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
            Memory.stats.gplLevel = Game.gpl.level
            // CPU 的当前使用量
            Memory.stats.cpu = Game.cpu.getUsed()
            // bucket 当前剩余量
            Memory.stats.lastBucket = Memory.stats.bucket
            Memory.stats.bucket = Game.cpu.bucket
            Memory.stats.cpuAverageUsed = Memory.stats.hasGeneratePixel ? (Game.cpu.limit - (Memory.stats.bucket - Memory.stats.lastBucket + 5000) / 20) : (Game.cpu.limit - (Memory.stats.bucket - Memory.stats.lastBucket) / 20);
            //使用bucket来计算CPU在20tick中的平均使用量。
            Memory.stats.pixels = Game.resources['pixel']
            for (let name of Object.keys(Memory.creepWorkSetting)) {
                Memory.stats.missionRunning[name] = [];
                for (let i = 0, j = Memory.creepWorkSetting[name].length; i < j; i++) {
                    let rx = Memory.creepWorkSetting[name][i];
                    Memory.stats.missionRunning[name][i] = {};
                    Memory.stats.missionRunning[name][i].ifRun = rx.ifRun;
                    Memory.stats.missionRunning[name][i].logString = rx.logString;
                }
            }
            for (let name in Game.rooms) {
                if (Game.rooms[name] && Game.rooms[name].controller && Game.rooms[name].controller.my) {
                    Memory.stats.rcl[name] = (Game.rooms[name].controller.progress / Game.rooms[name].controller.progressTotal) * 100;
                    Memory.stats.rclLevel[name] = Game.rooms[name].controller.level;
                }
                if (Game.rooms[name]) {
                    Memory.stats.containerEnergyNum[name] = inf.containerEnergyNum(name);
                    Memory.stats.storageEnergyNum[name] = inf.storageEnergyNum(name);
                }
            }
            if (Game.cpu.bucket > 9000) {
                Game.cpu.generatePixel();
                Memory.stats.hasGeneratePixel = true;
            } else {
                Memory.stats.hasGeneratePixel = false;
            }
        },
    };

    module.exports = stateScanner;
}