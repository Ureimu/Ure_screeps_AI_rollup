import { getStructureFromArray, lookForStructureName } from "utils/findEx";
import { getBpNum } from "utils/bodypartsGenerator";

// 自定义的 Creep 的拓展
export class CreepExtension extends Creep {
    // 其他更多自定义拓展
    public getEnergy(lowerLimit: { [name: string]: number }[] = [{}]): string {
        if (!this.memory.task.taskInf) return "";
        const structureList: { [name: string]: AnyStoreStructure[] }[] = getStructureFromArray(this.room, lowerLimit);
        const containersL = [];
        for (let i = 0, j = structureList.length; i < j; i++) {
            const st1 = structureList[i];
            for (const st2 in st1) {
                const containers = _.filter(
                    st1[st2],
                    (k: { store: { [x: string]: number } }) =>
                        k.store[RESOURCE_ENERGY] > 50 * getBpNum(this.memory.bodyparts, "carry") + lowerLimit[i][st2]
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
        const containersName = lookForStructureName(containersEnergy);
        // console.log(this.name+" "+containersEnergy?.structureType+containersName);

        const target = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (
                    resource.resourceType === RESOURCE_ENERGY &&
                    resource.amount > 50 * getBpNum(this.memory.bodyparts, "carry")
                );
            }
        });
        const target2 = this.pos.findClosestByRange(FIND_RUINS, {
            filter: resource => {
                return resource.store.energy > 50 * getBpNum(this.memory.bodyparts, "carry");
            }
        });

        if (containersEnergy) {
            if (this.withdraw(containersEnergy, "energy") === ERR_NOT_IN_RANGE) {
                this.moveTo(containersEnergy, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
            this.memory.task.taskInf.lastSource = containersName;
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
        if (this.memory.task.taskInf.lastSource === lookForStructureName(target)) return false;
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
}
