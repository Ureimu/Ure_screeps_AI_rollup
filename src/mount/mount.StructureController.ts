import { RoomPositionStr } from "construction";
import { getPosStrInRange, setPosToStr, getPosFromStr } from "construction/utils/strToRoomPosition";

// 自定义的 StructureController 的拓展
export class StructureControllerExtension extends StructureController {
    /**
     * 返回周围正方形的不是wall的地形数量
     * #12
     *
     * @returns {number} 非wall的空格个数
     */
    public checkBlankSpace(): RoomPositionStr[] {
        const buildingExpand = getPosStrInRange(setPosToStr(this.pos), 3);
        for (const buildingExpandPosStr of buildingExpand) {
            const buildingExpandPos = getPosFromStr(buildingExpandPosStr);
            const terrain: Terrain[] = buildingExpandPos.lookFor(LOOK_TERRAIN);
            if (terrain[0] === "wall") {
                // 不考虑在墙上的位置。
                buildingExpand.delete(setPosToStr(buildingExpandPos));
            }
        }
        return Array.from(buildingExpand);
    }

    /**
     * 初始化StructureController的memory.
     *
     */
    public initsGlobalMemory(): void {
        global.rooms[this.room.name].controller = {
            blankSpace: this.checkBlankSpace()
        };
    }
}
