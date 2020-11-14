import {stateCut } from "../utils/utils";

export function upgradeController(creep: Creep): void {
    let ifHarvesting = stateCut(
        creep,
        [() => ~~(creep.store[RESOURCE_ENERGY] == 0), () => ~~(creep.store.getFreeCapacity() != 0)],
        0
    );

    //控制器签名
    if (<string>creep.room.controller?.sign?.username != creep.room.controller?.owner?.username) {
        if (creep.signController(<StructureController>creep.room.controller, "testing")) {
            creep.moveTo(<StructureController>creep.room.controller, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }

    if (ifHarvesting) {
        creep.getEnergy([{"controllerSourceContainer":0},{"innerSourceContainer":900}]);
    } else {
        if (creep.upgradeController(<StructureController>creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(<StructureController>creep.room.controller, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}
