import { getPosFromStr, setPosToStr } from "construction/utils/strToRoomPosition";
import { initConstructionMemory } from "construction/utils/initConstructionMemory";
import findEx from "utils/findEx";
import { formedLayout } from "construction";

export function runLayout(room: Room, layoutName: string, layoutFunc: (room: Room) => void): void {
    if (!room.memory.constructionSchedule[layoutName]?.layout) {
        layoutFunc(room);
    }

    let totalSitesNum = room.find(FIND_CONSTRUCTION_SITES).length;

    for (const constructionName in room.memory.constructionSchedule[layoutName].layout as formedLayout) {
        const construction = (room.memory.constructionSchedule[layoutName].layout as formedLayout)[
            constructionName as BuildableStructureConstant
        ];
        for (const buildingMemName in construction) {
            let levelToBuild = 0;
            if (typeof construction[buildingMemName].levelToBuild !== "undefined") {
                levelToBuild = construction[buildingMemName].levelToBuild as number;
            }
            const buildNumberLimit =
                levelToBuild <= (room.controller as StructureController).level
                    ? CONTROLLER_STRUCTURES[constructionName as BuildableStructureConstant][
                          (room.controller as StructureController).level
                      ]
                    : 0;
            const posStrList = construction[buildingMemName].posStrList;
            totalSitesNum += putConstructionSites(
                room,
                posStrList,
                buildingMemName,
                constructionName as BuildableStructureConstant,
                buildNumberLimit,
                totalSitesNum
            );
            if (totalSitesNum >= 100) {
                break;
            }
        }
    }
}

function putConstructionSites(
    room: Room,
    posStrList: string[],
    name: string,
    structureType: BuildableStructureConstant,
    buildNumberLimit: number,
    totalSitesNum: number
): number {
    if (room.memory.construction[name]?.constructionSitesCompleted === true) return 0;
    if (buildNumberLimit === 0) return 0;
    const listC = [];
    const posList: RoomPosition[] = [];
    posStrList.forEach(posStr => {
        posList.push(getPosFromStr(posStr));
    });
    initConstructionMemory(room, name, structureType);
    for (let i = 0; i < posList.length; i++) {
        const countX = [0, 0];
        let structures: {
            structureType: string;
            pos: RoomPosition;
            destroy?: () => number;
            remove?: () => number;
        }[] = room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType === structureType;
            }
        });
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
            filter: constructionSite => {
                return constructionSite.structureType === structureType;
            }
        });
        structures = structures.concat(constructionSites);
        for (const structure of structures) {
            if (findEx.isPosEqual(structure.pos, posList[i])) {
                for (const x of room.memory.construction[name].pos) {
                    const pos = getPosFromStr(x);
                    if (pos.isEqualTo(posList[i])) {
                        countX[1] = 1;
                        break;
                    }
                }
                if (countX[1] === 1) {
                    break;
                }
                room.memory.construction[name].pos.push(setPosToStr(posList[i]));
                countX[0] = 1;
                break;
            }
        }
        if (countX[0] === 0) {
            listC[i] = room.createConstructionSite(posList[i], structureType);
            if (listC[i] === OK) {
                totalSitesNum++;
                room.memory.construction[name].pos.push(setPosToStr(posList[i]));
                if (totalSitesNum >= 100) {
                    return totalSitesNum;
                }
            }
        }
    }
    if (
        room.memory.construction[name].pos.length === posList.length ||
        room.memory.construction[name].pos.length === buildNumberLimit
    ) {
        room.memory.construction[name].constructionSitesCompleted = true;
    }
    return totalSitesNum;
}
