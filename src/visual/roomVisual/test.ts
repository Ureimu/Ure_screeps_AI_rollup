import actionCounter from "AllUtils/actionCounter";

export function roomVisualize() {
    for(let roomName in Memory.rooms){
        let visual = Game.rooms[roomName].visual;
        let text = `现在的游戏时间是${Game.time}tick`;
        visual.text(text,0,3,{align:"left"});
        visual.text(actionCounter.ratio(),0,4,{align:"left"});
    }
}
