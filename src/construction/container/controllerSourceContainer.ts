import { putContainerConstruction } from "./utils";

export function putcontrollerSourceContainerConstructionSites(room: Room) {
    if(room.controller){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:room.controller.pos,range: 3})
        if(path.path.length>0){
            let lastpoint = <RoomPosition>path.path.pop();
            putContainerConstruction(room,[lastpoint],"controllerSourceContainer");
        }
    }
}
