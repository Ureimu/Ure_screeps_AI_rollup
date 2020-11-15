import { autoConstruction } from "construction";
import { manageTask } from "task";
import { initNewRoomSetting } from "updateMemory";
import { roomVisualize } from "visual/roomVisual/GUIsetting";
import { runStructure } from "work/structure";

// 自定义的 Room 的拓展
export class RoomExtension extends Room{
    autoSafeMode(){
        let eventLog = this.getEventLog();
        let attackEvents = _.filter(eventLog, { event: EVENT_ATTACK });
        attackEvents.forEach(event => {
            if (event.event == EVENT_ATTACK || EVENT_ATTACK_CONTROLLER) {
                if (this?.controller?.my) {
                    this.controller.activateSafeMode();
                }
            }
        });
    }

    initMemory(ifFarming:boolean){
        initNewRoomSetting(this,ifFarming);
    }

    autoPlanConstruction(){
        autoConstruction(this);
    }

    roomVisualize(){
        roomVisualize(this);
    }

    runStructure(){
        runStructure(this);
    }

    manageTask(){
        manageTask(this);
    }
}
