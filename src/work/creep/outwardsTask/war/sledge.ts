import { stateCut } from "work/creep/utils/utils";

export function sledge(creep:Creep) {
    let state = stateCut(
        creep,
        [() => ~~(creep.room.name=="E23S43"),() => 1],
        0
    );

    switch (state) {
        case 0:
            let x = new RoomPosition(43,34,"E23S43");
            creep.moveTo(x);
            let walls = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: i => {
                    return (
                        i.structureType == STRUCTURE_WALL
                    );
                }
            });
            if(!!walls){
                creep.moveTo(walls);
            }
            break;
        case 1:
            if(creep.room.controller?.safeMode){
                let wall = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                    filter: i => {
                        return (
                            i.structureType == STRUCTURE_WALL
                        );
                    }
                });
                if(!!wall){
                    creep.moveTo(wall);
                }
                break;
            }
            let hostileSpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
            let wall = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: i => {
                    return (
                        i.structureType == STRUCTURE_WALL
                    );
                }
            });
            if(!!hostileSpawns && !!hostileSpawns[0]){
                if (creep.dismantle(hostileSpawns[0]) == ERR_NOT_IN_RANGE) {
                    if(!!wall&&creep.dismantle(wall) == ERR_NOT_IN_RANGE){
                        if(creep.moveTo(hostileSpawns[0])==ERR_NO_PATH){
                            creep.moveTo(wall);
                        }
                    }
                }
            }
            break;
        default:
            break;
    }
}
