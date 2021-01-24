import { constructionScheduleElement } from "construction";
import { RoomPositionToStr } from "construction/utils/strToRoomPosition";
import { TaskGroupSetting } from "task/taskClass/TaskGroupSetting";
import * as profiler from "../../utils/profiler";

declare global {
    interface RoomMemory {
        LayoutPostData?: LayoutPostData;
    }
}

interface LayoutPostData {
    roomName: string;
    roomObjects: {
        source: {
            x: number;
            y: number;
        }[];
        controller: {
            x: number;
            y: number;
        }[];
        mineral: {
            mineralType: string;
            x: number;
            y: number;
        }[];
    };
}

const manageNewClaimedRoom = function (room: Room): void {
    if (!room.memory.firstSpawnName && room.controller?.my) {
        if (!room.memory.startTime) {
            room.memory.startTime = Game.time;
            RawMemory.setActiveSegments([0]);
            const sources = room.find(FIND_SOURCES);
            const mineral = room.find(FIND_MINERALS);
            room.memory.LayoutPostData = {
                roomName: room.name,
                roomObjects: {
                    source: [],
                    controller: [
                        {
                            x: room.controller.pos.x,
                            y: room.controller.pos.y
                        }
                    ],
                    mineral: [
                        {
                            mineralType: mineral[0].mineralType,
                            x: mineral[0].pos.x,
                            y: mineral[0].pos.y
                        }
                    ]
                }
            };
            for (const source of sources) {
                room.memory.LayoutPostData.roomObjects.source.push({ x: source.pos.x, y: source.pos.y });
            }
        }
        if (room.memory.startTime) {
            if (Game.time - room.memory.startTime === 1) {
                RawMemory.segments[0] = JSON.stringify(room.memory.LayoutPostData);
            }
            switch ((Game.time - room.memory.startTime) % 50) {
                case 45:
                    RawMemory.setActiveSegments([1]);
                    break;
                case 46: {
                    if (RawMemory.segments[1]) {
                        const rts = new RoomPositionToStr(room.name);
                        const layout = JSON.parse(RawMemory.segments[1]) as constructionScheduleElement;
                        room.memory.constructionSchedule.gridLayout = layout;
                        room.createConstructionSite(rts.getPosFromStr(layout.firstSpawnPos as string), STRUCTURE_SPAWN);
                    }
                }
            }
        }
    }
};

export default profiler.registerFN(manageNewClaimedRoom, "manageNewClaimedRoom");
