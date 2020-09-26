import { carryResourceTo } from "task/creepTask/carryResourceTo";
import { pushCreepCarryTask } from "task/utils/pushCreepTask";

export function tower(tower: StructureTower) {
    if(tower.store["energy"]<500 && !tower.room.memory.construction["tower"].memory["hasPushed"]){
        let task = carryResourceTo(tower.room.name, "fillTower", 500);
        task.getCarryTask(RESOURCE_ENERGY,"innerSourceContainer",STRUCTURE_CONTAINER,"tower",STRUCTURE_TOWER,500);
        pushCreepCarryTask(tower.room.name,task.task);
        tower.room.memory.construction["tower"].memory["hasPushed"] = true;
    }

    if(tower.store["energy"]>500 && tower.room.memory.construction["tower"].memory["hasPushed"]){
        tower.room.memory.construction["tower"].memory["hasPushed"] = false;
    }
}
