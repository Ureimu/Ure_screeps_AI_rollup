import { RoleCreepMemory } from "work/creep/creepMemory";
import { stateCut } from "work/creep/utils/utils";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"oCarrier"> {
    return target.task.taskName === "oCarrier";
}

export function oCarrier(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const scoutRoomName = creep.memory.task.taskInf?.scoutRoomName as string;
        const scoutRoom = Game.rooms[scoutRoomName];
        const spawnRoomName = creep.memory.task.spawnInf.roomName;
        const spawnRoom = Game.rooms[spawnRoomName];
        if (spawnRoomName === creep.room.name) {
            creep.getGlobalMemory();
        }
        const ifHarvesting = stateCut(
            creep,
            [() => Number(creep.store[RESOURCE_ENERGY] === 0), () => Number(creep.store.getFreeCapacity() !== 0)],
            0
        );

        if (ifHarvesting) {
            if (scoutRoomName === creep.room.name) {
                creep.getEnergy();
            } else {
                creep.moveTo(new RoomPosition(25, 20, scoutRoomName), {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
            }
        } else {
            if (creep.room.name === spawnRoomName) {
                const gList = [
                    { centerLink: { isStorable: true, upperLimit: 800 } },
                    { storage: { isStorable: true, upperLimit: 1000000 } },
                    { controllerContainer: { isStorable: true, upperLimit: 2000 } }
                    // { spawnSourceContainer: { isStorable: true, upperLimit: 1500 } },
                    // { tower: { isStorable: true, upperLimit: 400 } }
                ];
                creep.transportEnergy(gList);
            } else {
                creep.moveTo(spawnRoom.controller as StructureController);
            }
        }
    }
}
