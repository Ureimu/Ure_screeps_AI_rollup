import { lookForStructureName } from "./findEx";
import profiler from "./profiler";

let fun = {
    getEnergyAction,
}
profiler.registerObject(fun,"actionMonitor");

export default fun

function getEnergyAction(){
    if(!global.test.logger)global.test.logger="event\t\ttargetFrom\t\t\t\ttargetTo\t\t\t\tamount\tresourceType\n";
    for(let roomName in Game.rooms){
        let logger = ""
        let eventLog = Game.rooms[roomName].getEventLog();
        for(let event of eventLog){
            if(event.event==EVENT_TRANSFER){
                let targetFrom = <AnyStructure|Creep>Game.getObjectById(event.data.targetId)
                let targetTo = <AnyStructure|Creep>Game.getObjectById(event.objectId)
                let targetFromName = getName(targetFrom,roomName)
                let targetToName = getName(targetTo,roomName)
                let log = `Transfer\t${targetFromName}\t\t${targetToName}\t\t${event.data.amount}\t${event.data.resourceType}\t${Game.time}\n`
                logger=logger.concat(log);
            }
        }
        global.test.logger=global.test.logger.concat(logger);
    }
}

function isCreep(target:AnyStructure|Creep):target is Creep {
    return typeof (<Creep>target).name !== "undefined"
}

function getName(target:AnyStructure|Creep,roomName:string):string{
    let name = ""
    if(isCreep(target)){
        name = target.name;
    }else{
        if((name = lookForStructureName(target)) == ""){
            name = roomName+"-"+target.structureType
        }else{
            name = roomName+"-"+name
        }
    }
    return name
}
