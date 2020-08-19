
export function run(creep: Creep) {
    let workFunctionList:any={
        'harvestSource':harvestSource,
        'carrySource':carrySource,
        'upgradeController':upgradeController,
    };

    for(let taskType in workFunctionList){
        compareTaskType(creep,workFunctionList[taskType],taskType);
    }
}

function compareTaskType(creep:Creep,workFunction:(creep:Creep)=>void,taskType:string){
    if(creep.memory.task.taskInf.taskType == taskType){
        workFunction(creep);
    }
}

function harvestSource(creep:Creep):void {
    let source = <Source>Game.getObjectById(creep.memory.task.sponsor);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE){
        creep.moveTo(source, {
            visualizePathStyle: {
                stroke: '#ffaa00'
            }
        });
    }
}

function carrySource(creep:Creep):void{
    if (!creep.memory.task.taskInf.harvesting && creep.store[RESOURCE_ENERGY] < 50) {
        creep.memory.task.taskInf.harvesting = true;
        creep.say('🔄 harvest');
    }
    if (creep.memory.task.taskInf.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.task.taskInf.harvesting = false;
        creep.say('🚧 transfer');
    }
    if (creep.memory.task.taskInf.harvesting) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (target) {
            creep.moveTo(target,{
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
            creep.pickup(target);
        }
    }
    else{
        let targets = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的扩展和出生点
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }
    }
}

export function upgradeController(creep:Creep) :void{
    if (!creep.memory.task.taskInf.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.task.taskInf.harvesting = true;
        creep.say('🔄 harvest');
    }
    if (creep.memory.task.taskInf.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.task.taskInf.harvesting = false;
        creep.say('🚧 upgrade');
    }
    if (creep.memory.task.taskInf.harvesting) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (target) {
            creep.moveTo(target,{
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
            creep.pickup(target);
        }
    }
    else{
        if (creep.upgradeController(<StructureController>creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(<StructureController>creep.room.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }
    }
}
