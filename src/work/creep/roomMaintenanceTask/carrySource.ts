import { getStructureFromArray, lookForStructure } from "utils/findEx";
import { getEnergy, stateCut, transportResource } from "work/creep/utils/utils";
import { findSpawnOrExtensionNotFull } from "../utils/find";

export function carrySource(creep: Creep): void {
    let ifHarvesting = stateCut(
        creep,
        [() => ~~(creep.store[RESOURCE_ENERGY] < 50), () => ~~(creep.store.getFreeCapacity() != 0)],
        0
    );

    if (ifHarvesting) {
        getEnergy(creep, [{ innerSourceContainer: 0 }, { spawnSourceContainer: 0 }]);
    } else {
        let targets = findSpawnOrExtensionNotFull(creep);
        if (targets.length > 0) {
            transportResource(creep, <AnyStructure>creep.pos.findClosestByRange(targets), RESOURCE_ENERGY);
        } else {
            let gList = [
                { controllerSourceContainer: { isStorable: true, upperLimit: 1500 } },
                { spawnSourceContainer: { isStorable: true, upperLimit: 1500 } },
                { tower: { isStorable: true, upperLimit: 400 } }
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
        [name: string]: {
            isStorable: boolean;
            upperLimit: number;
        }|undefined;
    }[]
) {
    let sList = getStructureFromArray(creep.room, gList);
    for(let i = 0, j=sList.length;i<j;i++){
        let structuresL=sList[i];
        for (let structuresName in structuresL) {
            let structures = structuresL[structuresName];
            if (structures?.[0]?.store["energy"] < <number>gList[i][structuresName]?.upperLimit) {
                console.log(structuresName);
                if (transportResource(creep, structures[0], RESOURCE_ENERGY)) {
                    return;
                }
            }
        }
    };
}
