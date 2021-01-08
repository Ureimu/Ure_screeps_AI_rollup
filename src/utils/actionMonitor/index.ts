import findEx from "utils/findEx";
import * as profiler from "../../../utils/profiler";

const fun = {
    getEnergyAction
};
profiler.registerObject(fun, "actionMonitor");

export default fun;

function getEnergyAction(): void {
    if (!global.testX.logger) global.testX.logger = "event\t\ttargetFrom\t\t\t\ttargetTo\t\t\t\tamount\tresourceType\n";
    for (const roomName in Game.rooms) {
        let logger = "";
        const eventLog = Game.rooms[roomName].getEventLog();
        for (const event of eventLog) {
            if (event.event === EVENT_TRANSFER) {
                const targetFrom = Game.getObjectById<AnyStructure | Creep>(event.data.targetId) as
                    | AnyStructure
                    | Creep;
                const targetTo = Game.getObjectById<AnyStructure | Creep>(event.objectId) as AnyStructure | Creep;
                const targetFromName = getName(targetFrom, roomName);
                const targetToName = getName(targetTo, roomName);
                const log = `Transfer\t${targetFromName}\t\t${targetToName}\t\t${event.data.amount}\t${event.data.resourceType}\t${Game.time}\n`;
                logger = logger.concat(log);
            }
        }
        global.testX.logger = global.testX.logger.concat(logger);
    }
}

function isCreep(target: AnyStructure | Creep): target is Creep {
    return typeof (target as Creep)?.name !== "undefined";
}

function getName(target: AnyStructure | Creep, roomName: string): string {
    if (!target) return "";
    let name = "";
    if (isCreep(target)) {
        name = target.name;
    } else {
        if ((name = target.buildingName()) === "") {
            name = roomName + "-" + target?.structureType; // 可能上一个tick对象还存在，这个tick对象就不存在了，考虑缓存上一个tick的对象。
        } else {
            name = roomName + "-" + name;
        }
    }
    return name;
}
