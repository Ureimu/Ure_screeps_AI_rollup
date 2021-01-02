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
                // console.log(this.name+" "+st2+" "+containers.length+" "+lowerLimit[i][st2]+" "+String(50 * getBpNum(this.memory.bodyparts, "carry") + lowerLimit[i][st2]));
                if (containers.length > 0) {
                    containersL.push(...containers);
                    // console.log(""+lowerLimit[i][st2]);
                }
            }
            if (containersL.length !== 0) {
                break;
            }
        }

        const containersEnergy = this.pos.findClosestByRange(containersL);
        const containersName = findEx.lookForStructureName(containersEnergy);
        // console.log(this.name+" "+containersEnergy?.structureType+containersName);

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

        if (containersEnergy) {
            if (targetC) {
                if (this.pickup(targetC) === ERR_NOT_IN_RANGE) {
                    this.moveTo(containersEnergy, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    });
                }
            } else {
                if (this.withdraw(containersEnergy, "energy") === ERR_NOT_IN_RANGE) {
                    this.moveTo(containersEnergy, {
                        visualizePathStyle: {
                            stroke: "#ffffff"
                        }
                    });
                }
                this.memory.task.taskInf.lastSource = containersName;
            }
            return containersName;
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
            case "harvestSource": {
                const source = Game.getObjectById<Source>(this.memory.task.sponsor as Id<Source>) as Source;
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
                break;
            }
            case "upgradeController": {
                if ((global.rooms[this.room.name].controller?.blankSpace.length as number) > 0) {
                    global.creepMemory[this.name].bundledUpgradePos = getPosFromStr(
                        (global.rooms[this.room.name].controller?.blankSpace as string[]).pop() as string
                    );
                }
                break;
            }
            case "buildAndRepair": {
                if ((global.rooms[this.room.name].controller?.blankSpace.length as number) > 0) {
                    global.creepMemory[this.name].bundledUpgradePos = getPosFromStr(
                        (global.rooms[this.room.name].controller?.blankSpace as string[]).pop() as string
                    );
                }
                break;
            }
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
