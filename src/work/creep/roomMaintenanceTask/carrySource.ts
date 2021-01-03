import { findSpawnOrExtensionNotFull } from "../utils/find";
import { stateCut } from "work/creep/utils/utils";

export function carrySource(creep: Creep): void {
    const ifHarvesting = stateCut(
        creep,
        [() => Number(creep.store[RESOURCE_ENERGY] < 50), () => Number(creep.store.getFreeCapacity() !== 0)],
        0
    );

    const getWork = stateCut(
        creep,
        [
            () => {
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    return 0;
                } else {
                    return 1;
                }
            },
            () => {
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    return 0;
                } else {
                    return 1;
                }
            }
        ],
        1
    );

    if (ifHarvesting) {
        if (getWork) {
            creep.getEnergy([
                { centerLink: { num: 0 } },
                { sourceContainer: { num: (creep.room.controller as StructureController)?.level > 1 ? 0 : 400 } }
            ]);
        } else {
            creep.getEnergy([
                { centerLink: { num: 0 } },
                { storage: { num: 0 } },
                { sourceContainer: { num: (creep.room.controller as StructureController)?.level > 1 ? 0 : 400 } }
            ]);
        }
    } else {
        if (!getWork) {
            const targets = findSpawnOrExtensionNotFull(creep);
            if (targets.length > 0) {
                let go = true;
                while (go) {
                    if (
                        !creep.transportResource(creep.pos.findClosestByRange(targets) as AnyStructure, RESOURCE_ENERGY)
                    ) {
                        targets.pop();
                    } else {
                        go = false;
                    }
                }
            }
        } else {
            const gList = [
                { centerLink: { isStorable: true, upperLimit: 800 } },
                { storage: { isStorable: true, upperLimit: 35000 } },
                { controllerContainer: { isStorable: true, upperLimit: 1500 } }
                // { spawnSourceContainer: { isStorable: true, upperLimit: 1500 } },
                // { tower: { isStorable: true, upperLimit: 400 } }
            ];
            creep.transportEnergy(gList);
        }
    }
}
