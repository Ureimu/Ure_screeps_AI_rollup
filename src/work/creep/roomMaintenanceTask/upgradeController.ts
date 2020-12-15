import { stateCut } from "../utils/utils";

export function upgradeController(creep: Creep): void {
    const ifHarvesting = stateCut(
        creep,
        [() => Number(creep.store[RESOURCE_ENERGY] === 0), () => Number(creep.store.getFreeCapacity() !== 0)],
        0
    );

    // 控制器签名
    if ((creep.room.controller?.sign?.username as string) !== creep.room.controller?.owner?.username) {
        if (creep.signController(creep.room.controller as StructureController, "testing")) {
            creep.moveTo(creep.room.controller as StructureController, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }

    if (ifHarvesting) {
        creep.getEnergy([
            { controllerLink: { num: 0, takeAll: true } },
            { controllerContainer: { num: 0 } },
            { sourceContainer: { num: 900 } }
        ]);
    } else {
        if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller as StructureController, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
    }
}
