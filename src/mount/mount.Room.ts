import { autoConstruction } from "construction";
import { initNewRoomSetting } from "updateMemory";
import { manageTask } from "task";
import { roomVisualize } from "visual/roomVisual/GUIsetting";
import { runStructure } from "work/structure";

// 自定义的 Room 的拓展
export class RoomExtension extends Room {
    public autoSafeMode(): void {
        const eventLog = this.getEventLog();
        const attackEvents = _.filter(eventLog, { event: EVENT_ATTACK });
        attackEvents.forEach(event => {
            if (event.event === EVENT_ATTACK || EVENT_ATTACK_CONTROLLER) {
                if (this?.controller?.my) {
                    this.controller.activateSafeMode();
                }
            }
        });
    }

    public initMemory(ifFarming: boolean): void {
        initNewRoomSetting(this, ifFarming);
    }

    public autoPlanConstruction(): void {
        autoConstruction(this);
    }

    public roomVisualize(): void {
        roomVisualize(this);
    }

    public runStructure(): void {
        runStructure(this);
    }

    public manageTask(): void {
        manageTask(this);
    }
}
