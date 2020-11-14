import { getBpNum } from "utils/bodypartsGenerator";
import { getStructureFromArray, lookForStructureName } from "utils/findEx";

// 自定义的 Creep 的拓展
export class CreepExtension extends Creep {
    // 自定义敌人检测
    checkEnemy() {
        // 代码实现...
    };
    // 填充所有 spawn 和 extension
    fillSpawnEngry() {
        // 代码实现...
    };
    // 填充所有 tower
    fillTower() {
        // 代码实现...
    };
    harvestEnergy() {

    }
    pushBackTask() {
    }
    // 其他更多自定义拓展
    getEnergy(lowerLimit: Array<{[name:string]: number}> = [{}]): string {

        let structureList: Array<{ [name: string]: AnyStoreStructure[]; }> = getStructureFromArray(this.room, lowerLimit);
        structureList.reverse();
        let containersL = [];
        for(let i = 0, j=structureList.length;i<j;i++){
            let st1 = structureList[i];
            for(let st2 in st1){
                const containers = _.filter(
                    st1[st2],
                    (k: { store: { [x: string]: number } }) =>
                        k.store[RESOURCE_ENERGY] > 50 * getBpNum(this.memory.bodyparts, "carry") + lowerLimit[i][st2]
                );
                //console.log(this.name+" "+st2+" "+containers.length+" "+lowerLimit[i][st2]+" "+String(50 * getBpNum(this.memory.bodyparts, "carry") + lowerLimit[i][st2]));
                if(containers.length>0){
                    containersL.push(...containers);
                    //console.log(""+lowerLimit[i][st2]);
                }
            }
            if(containersL.length!=0){
                break;
            }
        }

        let containersEnergy = this.pos.findClosestByRange(containersL);
        let containersName = lookForStructureName(containersEnergy);
        //console.log(this.name+" "+containersEnergy?.structureType+containersName);

        const target = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (
                    resource.resourceType == RESOURCE_ENERGY &&
                    resource.amount > 50 * getBpNum(this.memory.bodyparts, "carry")
                );
            }
        });
        const target2 = this.pos.findClosestByRange(FIND_RUINS, {
            filter: resource => {
                return (
                    resource.store["energy"] > 50 * getBpNum(this.memory.bodyparts, "carry")
                );
            }
        });

        if (containersEnergy) {
            if (this.withdraw(containersEnergy, "energy") == ERR_NOT_IN_RANGE) {
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
            this.withdraw(target2,"energy");
            this.memory.task.taskInf.lastSource = "ruins";
            return "ruins";
        } else if (target) {
            this.moveTo(target, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
            this.pickup(target);
            this.memory.task.taskInf.lastSource = "droppedEnergy"
            return "droppedEnergy";
        } else {
            return "null";
        }
    }

    transportResource(target: AnyStructure, resourceType: ResourceConstant) {
        if(this.memory.task.taskInf.lastSource == lookForStructureName(target)) return false;
        if (this.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {
                visualizePathStyle: {
                    stroke: "#ffffff"
                }
            });
        }
        return true;
    }

    getResourceFromStructure(structure: AnyStoreStructure, resourceType: ResourceConstant) {
        if (structure) {
            if (this.withdraw(structure, resourceType) == ERR_NOT_IN_RANGE) {
                this.moveTo(structure, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        }
    }
}
