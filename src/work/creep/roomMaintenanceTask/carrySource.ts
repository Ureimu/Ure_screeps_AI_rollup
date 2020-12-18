import { findSpawnOrExtensionNotFull } from "../utils/find";
import { getStructureFromArray } from "utils/findEx";
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
            creep.getEnergy([{ centerLink: { num: 0 } }, { sourceContainer: { num: 0 } }]);
        } else {
            creep.getEnergy([{ centerLink: { num: 0 } }, { storage: { num: 0 } }, { sourceContainer: { num: 0 } }]);
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
            doStuff(creep, gList);
            /*
            let controllerContainer = <AnyStoreStructure[]>(
                lookForStructure(creep.room, "controllerSourceContainer", true)
            );
            let spawnContainer = <AnyStoreStructure[]>lookForStructure(creep.room, "spawnSourceContainer", true);
            let tower = <AnyStoreStructure[]>lookForStructure(creep.room, "tower");
            if (spawnContainer && spawnContainer[0] && spawnContainer[0].store["energy"] < 1500) {
                transportResource(creep, spawnContainer[0], RESOURCE_ENERGY);
            } else if (controllerContainer && controllerContainer[0] && controllerContainer[0].store["energy"] < 1500) {
                transportResource(creep, controllerContainer[0], RESOURCE_ENERGY);
            } else if (tower && tower[0] && tower[0].store["energy"] < 400) {
                transportResource(creep, tower[0], RESOURCE_ENERGY);
            }
            */
        }
    }
}
function doStuff(
    creep: Creep,
    gList: {
        [name: string]:
            | {
                  isStorable: boolean;
                  upperLimit: number;
              }
            | undefined;
    }[]
) {
    // console.log(JSON.stringify(gList))
    const sList = getStructureFromArray(creep.room, gList);
    // console.log(JSON.stringify(gList[0]["controllerSourceContainer"]?.upperLimit))
    let getStructure = false;
    for (let i = 0, j = sList.length; i < j; i++) {
        const structuresL = sList[i];
        for (const structuresName in structuresL) {
            const structures = structuresL[structuresName];
            let go = true;
            while (go) {
                // console.log(`${structuresName}+${structures[0]?.structureType}+${gList[i][structuresName]?.upperLimit}`)
                if (
                    structures?.[0]?.store["energy"] < (gList[i][structuresName]?.upperLimit as number) ||
                    typeof structures?.[0]?.store["energy"] == "undefined"
                ) {
                    if (!creep.transportResource(structures[0], RESOURCE_ENERGY)) {
                        // console.log(`${structuresName}+${structures[0]?.structureType} same as last one gotten energy, not transferring!!`)
                        structures.shift();
                    } else {
                        getStructure = true;
                        // console.log(`${structuresName}+${structures[0]?.structureType} transferring!!`)
                        go = false;
                    }
                } else {
                    // console.log(`${structuresName}+${structures[0]?.structureType} full of energy!! ${structures?.[0]?.store["energy"]}>${gList[i][structuresName]?.upperLimit}`)
                    structures.shift();
                }
                if (structures.length === 0) {
                    go = false;
                }
            }
            if (getStructure === true) {
                break;
            }
        }
        if (getStructure === true) {
            break;
        }
    }
}
