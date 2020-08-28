/*
提供能量流信息。

作者：Ureium

使用方法：
module:main

mountCreepEnergyMonitor();

所有信息都放在了Memory.energyMonitor里。
日志：
v0.0.1:基本完成了能量流信息的记录,除了几个每次使用/运输能量值不确定的creep方法以外。
*/

import { getBpNum } from "./bodypartsGenerator";

const assignPrototype = function (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes("Getter")) {
            Object.defineProperty(obj1.prototype, key.split("Getter")[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            });
        } else obj1.prototype[key] = obj2.prototype[key];
    });
};

export function mountCreepEnergyMonitor(): void {
    if (!global.CreepEnergyMonitorprototypeMounted) {
        console.log("[mount] 重新挂载拓展");
        global.CreepEnergyMonitorprototypeMounted = true;

        if (!Creep.prototype.e_build) Creep.prototype.e_build = Creep.prototype.build;
        if (!Creep.prototype.e_dismantle) Creep.prototype.e_dismantle = Creep.prototype.dismantle;
        if (!Creep.prototype.e_drop) Creep.prototype.e_drop = Creep.prototype.drop;
        if (!Creep.prototype.e_harvest) Creep.prototype.e_harvest = Creep.prototype.harvest;
        if (!Creep.prototype.e_pickup) Creep.prototype.e_pickup = Creep.prototype.pickup;
        if (!Creep.prototype.e_repair) Creep.prototype.e_repair = Creep.prototype.repair;
        if (!Creep.prototype.e_suicide) Creep.prototype.e_suicide = Creep.prototype.suicide;
        if (!Creep.prototype.e_transfer) Creep.prototype.e_transfer = Creep.prototype.transfer;
        if (!Creep.prototype.e_upgradeController) Creep.prototype.e_upgradeController = Creep.prototype.upgradeController;
        if (!Creep.prototype.e_withdraw) Creep.prototype.e_withdraw = Creep.prototype.withdraw;
        const plugins = [CreepEnergyMonitor];
        const prototypes = [Creep];

        for (let i = 0, j = plugins.length; i < j; i++) {
            assignPrototype(prototypes[i], plugins[i]);
        }
    }
    if(!Memory.energyMonitor){
        Memory.energyMonitor={}
    }
    for(let creep in Memory.creeps){
        if(!Memory.energyMonitor[creep]){
            Memory.energyMonitor[creep]={};
        }
    }
}

export function initEnergyMonitor(): void {}


function monitoring(//dismantle
    creep: Creep,
    x: CreepActionReturnCode,
    k: number,
    name: AnyMonitoringCreepAction
): CreepActionReturnCode;
function monitoring(//repair
    creep: Creep,
    x:  CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES,
    k: number,
    name: AnyMonitoringCreepAction
):  CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES;
function monitoring(//build
    creep: Creep,
    x: CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH,
    k: number,
    name: AnyMonitoringCreepAction
): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH;
function monitoring(//harvest
    creep: Creep,
    x:  CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES,
    k: number,
    name: AnyMonitoringCreepAction
):  CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES;
function monitoring(//pickup
    creep: Creep,
    x:  CreepActionReturnCode | ERR_FULL,
    k: number,
    name: AnyMonitoringCreepAction,
    bodypartsName: BodyPartConstant,
):  CreepActionReturnCode | ERR_FULL;
function monitoring(//upgradeController
    creep: Creep,
    x:  ScreepsReturnCode,
    k: number,
    name: AnyMonitoringCreepAction
):  ScreepsReturnCode;
function monitoring(creep: Creep, x: any, k: number, name: AnyMonitoringCreepAction, bodypartsName: BodyPartConstant = "work"): any {
    if (x == OK) {
        if (typeof Memory.energyMonitor[creep.name][name] === 'undefined')
        {
            Memory.energyMonitor[creep.name][name] = 0;
        }
        else{
            Memory.energyMonitor[creep.name][name]=<number>Memory.energyMonitor[creep.name][name]+k * getBpNum(creep.memory.bodyparts, bodypartsName);
        }
    }
    return x;
}

class CreepEnergyMonitor extends Creep {
    build(target: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH {
        return monitoring(this, this.e_build(target), 5, "build");
    };

    dismantle(target: Structure): CreepActionReturnCode {
        return monitoring(this, this.e_dismantle(target), 25, "dismantle");
    };

    drop(resourceType: ResourceConstant, amount?: number): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES {
        return this.e_drop(resourceType, amount);//TODO 还需要改进,现在版本不记录。
    };

    harvest(target: Source | Mineral | Deposit): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES {
        return monitoring(this, this.e_harvest(target), 2, "harvest");
    };

    pickup(target: Resource): CreepActionReturnCode | ERR_FULL {
        return monitoring(this, this.e_pickup(target), 50, "pickup", "carry");
    };

    repair(target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES{
        return monitoring(this, this.e_repair(target), 1, "repair");
    };

    suicide(): OK | ERR_NOT_OWNER | ERR_BUSY{
        return this.e_suicide();//TODO 还需要改进
    };

    transfer(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode{
        return this.e_transfer(target,resourceType,amount);//TODO 还需要改进
    };

    upgradeController(target: StructureController): ScreepsReturnCode{
        return monitoring(this, this.e_upgradeController(target),1,"upgradeController");
    };

    withdraw(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode{
        return this.e_withdraw(target,resourceType,amount);//TODO 还需要改进
    };
}
