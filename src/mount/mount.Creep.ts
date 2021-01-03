import findEx from "utils/findEx";
import { getPosFromStr } from "construction/utils/strToRoomPosition";
import bodypartsGenerator from "utils/bodypartsGenerator";

declare global {
    // Types defined in a global block are available globally

    namespace NodeJS {
        interface Global {
            creepMemory: {
                [name: string]: {
                    bundledPos?: RoomPosition;
                    bundledUpgradePos?: RoomPosition;
                    bundledStoragePos?: RoomPosition;
                    bundledLinkPos?: RoomPosition;
                };
            };
        }
    }
}

// 自定义的 Creep 的拓展
export class CreepExtension extends Creep {
    // 其他更多自定义拓展
    public getEnergy(lowerLimit: { [name: string]: { num: number; takeAll?: boolean } }[] = [{}]): string {
        if (!this.memory.task.taskInf) return "";
        let anyStoreStructureWithEnergy: AnyStoreStructure | null = null;
        let anyStoreStructureWithEnergyName = "";
        if (!this.room.memory.roomControlStatus) {
            const containerList = [];
            for (const sourceName in Memory.sources) {
                const roomName = sourceName.slice(0, sourceName.indexOf("Source"));
                if (roomName === this.room.name) {
                    if (Memory.sources[sourceName].container) {
                        const container = Game.getObjectById(
                            Memory.sources[sourceName].container as Id<StructureContainer>
                        ) as StructureContainer;
                        if (
                            container.store[RESOURCE_ENERGY] >=
                            50 * bodypartsGenerator.getBpNum(this.memory.task.spawnInf.bodyparts, "carry")
                        ) {
                            containerList.push(container);
                        }
                    }
                }
            }

            const containersEnergy = this.pos.findClosestByRange(containerList);
            const containersName = findEx.lookForStructureName(containersEnergy);
            anyStoreStructureWithEnergy = containersEnergy;
            anyStoreStructureWithEnergyName = containersName;
        } else {
            const structureList: { [name: string]: AnyStoreStructure[] }[] = findEx.getStructureFromArray(
                this.room,
                lowerLimit
            );
            const containersL = [];
            for (let i = 0, j = structureList.length; i < j; i++) {
                const st1 = structureList[i];
                for (const st2 in st1) {
                    const containers = _.filter(
                        st1[st2],
                        (k: { store: { [x: string]: number } }) =>
                            k.store[RESOURCE_ENERGY] >=
                            (lowerLimit[i][st2].takeAll
                                ? 1
                                : 50 * bodypartsGenerator.getBpNum(this.memory.task.spawnInf.bodyparts, "carry") +
                                  lowerLimit[i][st2].num)
                    );
                    // global.log(this.name+" "+st2+" "+containers.length+" "+lowerLimit[i][st2]+" "+String(50 * getBpNum(this.memory.bodyparts, "carry") + lowerLimit[i][st2]));
                    if (containers.length > 0) {
                        containersL.push(...containers);
                        // global.log(""+lowerLimit[i][st2]);
                    }
                }
                if (containersL.length !== 0) {
                    break;
                }
            }

            const containersEnergy = this.pos.findClosestByRange(containersL);
            const containersName = findEx.lookForStructureName(containersEnergy);
            anyStoreStructureWithEnergy = containersEnergy;
            anyStoreStructureWithEnergyName = containersName;
        }
        // global.log(this.name+" "+containersEnergy?.structureType+containersName);

        const target = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return resource.resourceType === RESOURCE_ENERGY && resource.amount >= 50;
            }
        });
        const targetC = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (
                    resource.resourceType === RESOURCE_ENERGY &&
                    resource.amount > 100 &&
                    resource.pos.getRangeTo(this) < 3
                );
            }
        });
        const target2 = this.pos.findClosestByRange(FIND_RUINS, {
            filter: resource => {
                return (
                    resource.store.energy >=
                    50 * bodypartsGenerator.getBpNum(this.memory.task.spawnInf.bodyparts, "carry")
                );
            }
        });

        if (anyStoreStructureWithEnergy) {
            if (targetC) {
                if (this.pickup(targetC) === ERR_NOT_IN_RANGE) {
                    this.moveTo(anyStoreStructureWithEnergy, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    });
                }
            } else {
                if (this.withdraw(anyStoreStructureWithEnergy, "energy") === ERR_NOT_IN_RANGE) {
                    this.moveTo(anyStoreStructureWithEnergy, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    });
                }
                this.memory.task.taskInf.lastSource = anyStoreStructureWithEnergyName;
            }
            return anyStoreStructureWithEnergyName;
        } else if (target2) {
            this.moveTo(target2, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
            this.withdraw(target2, "energy");
            this.memory.task.taskInf.lastSource = "ruins";
            return "ruins";
        } else if (target) {
            this.moveTo(target, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
            this.pickup(target);
            this.memory.task.taskInf.lastSource = "droppedEnergy";
            return "droppedEnergy";
        } else {
            return "null";
        }
    }

    public transportEnergy(
        gList: {
            [name: string]:
                | {
                      isStorable: boolean;
                      upperLimit: number;
                  }
                | undefined;
        }[]
    ): void {
        // global.log(JSON.stringify(gList))
        const sList = findEx.getStructureFromArray(this.room, gList);
        // global.log(JSON.stringify(gList[0]["controllerSourceContainer"]?.upperLimit))
        let getStructure = false;
        for (let i = 0, j = sList.length; i < j; i++) {
            const structuresL = sList[i];
            for (const structuresName in structuresL) {
                const structures = structuresL[structuresName];
                let go = true;
                while (go) {
                    // global.log(`${structuresName}+${structures[0]?.structureType}+${gList[i][structuresName]?.upperLimit}`)
                    if (
                        structures?.[0]?.store["energy"] < (gList[i][structuresName]?.upperLimit as number) ||
                        typeof structures?.[0]?.store["energy"] == "undefined"
                    ) {
                        if (!this.transportResource(structures[0], RESOURCE_ENERGY)) {
                            // global.log(`${structuresName}+${structures[0]?.structureType} same as last one gotten energy, not transferring!!`)
                            structures.shift();
                        } else {
                            getStructure = true;
                            // global.log(`${structuresName}+${structures[0]?.structureType} transferring!!`)
                            go = false;
                        }
                    } else {
                        // global.log(`${structuresName}+${structures[0]?.structureType} full of energy!! ${structures?.[0]?.store["energy"]}>${gList[i][structuresName]?.upperLimit}`)
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

    public transportResource(target: AnyStructure, resourceType: ResourceConstant, resourceNumber?: number): boolean {
        if (!this.memory.task.taskInf) return false;
        if (this.memory.task.taskInf.lastSource === findEx.lookForStructureName(target)) return false;
        if (!target) return false;
        if (this.transfer(target, resourceType, resourceNumber) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
        return true;
    }

    public getResourceFromStructure(
        structure: AnyStoreStructure,
        resourceType: ResourceConstant,
        resourceNumber?: number
    ): void {
        if (structure) {
            if (this.withdraw(structure, resourceType, resourceNumber) === ERR_NOT_IN_RANGE) {
                this.moveTo(structure, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        }
    }

    public getGlobalMemory(): void {
        if (!global.creepMemory[this.name]) {
            global.creepMemory[this.name] = {};
            this.setBundledPos();
        }
    }

    private setBundledPos() {
        switch (this.memory.task.taskName) {
            case "oHarvestSource":
            case "harvestSource": {
                const source = Game.getObjectById<Source>(this.memory.task.sponsor as Id<Source>);
                if (source) {
                    global.creepMemory[this.name].bundledPos = source.pos
                        .findInRange(FIND_STRUCTURES, 1, {
                            filter: structure => {
                                return structure.structureType === STRUCTURE_CONTAINER;
                            }
                        })
                        .pop()?.pos;
                    global.creepMemory[this.name].bundledLinkPos = source.pos
                        .findInRange(FIND_STRUCTURES, 2, {
                            filter: structure => {
                                return structure.structureType === STRUCTURE_LINK;
                            }
                        })
                        .pop()?.pos;
                }
                break;
            }
            case "upgradeController":
            case "buildAndRepair":
            case "oUpgradeController": {
                if ((global.rooms[this.room.name].controller?.blankSpace.length as number) > 0) {
                    global.creepMemory[this.name].bundledUpgradePos = getPosFromStr(
                        (global.rooms[this.room.name].controller?.blankSpace as string[]).pop() as string
                    );
                }
                break;
            }
        }
    }
}
