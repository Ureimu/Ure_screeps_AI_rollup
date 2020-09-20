import { putContainerConstruction } from "./utils";

export function putInnerContainerConstructionSites(room: Room) {
    let sourceTargets = room.find(FIND_SOURCES);
    let posList = [];
    for(let i=0 ; i<2; i++){
        let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:sourceTargets[i].pos,range: 1},{maxOps: 5000});
        if(path.path.length>0){
            let lastpoint = <RoomPosition>path.path.pop();
            posList.push(lastpoint);
        }
    }
    putContainerConstruction(room,posList,"innerSourceContainer");
}
