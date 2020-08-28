interface Creep{
    e_build(target: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH;
    e_dismantle(target: Structure): CreepActionReturnCode;
    e_drop(resourceType: ResourceConstant, amount?: number): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES;
    e_harvest(target: Source | Mineral | Deposit): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES;
    e_pickup(target: Resource): CreepActionReturnCode | ERR_FULL;
    e_repair(target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES;
    e_suicide(): OK | ERR_NOT_OWNER | ERR_BUSY;
    e_transfer(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
    e_upgradeController(target: StructureController): ScreepsReturnCode;
    e_withdraw(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
}

interface Memory{
    energyMonitor: {
        [name:string]:MonitoringCreepAction
    }
}
type AnyMonitoringCreepAction='build'|'dismantle'|'drop'|'harvest'|'pickup'|'repair'|'suicide'|'transfer'|'upgradeController'|'withdraw'

type MonitoringCreepAction = {
    [MonitoringCreepActionName in AnyMonitoringCreepAction]?:number
}
