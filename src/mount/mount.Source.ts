import { RoomPositionToStr } from "construction/utils/strToRoomPosition";

// 自定义的 Source 的拓展
export class SourceExtension extends Source {
    /**
     * 返回周围正方形的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    public checkBlankSpace(): RoomPosition[] {
        const square: RoomPosition[] = this.pos.getSquare();
        const BlankSpace: RoomPosition[] = [];
        for (const squared of square) {
            const look = squared.look();
            look.forEach(function (lookObject) {
                if (lookObject.type === "terrain" && lookObject.terrain !== "wall") {
                    BlankSpace.push(squared);
                }
            });
        }
        return BlankSpace;
    }

    /**
     * 初始化source的memory.
     *
     */
    public initsMemory(): void {
        const rts = new RoomPositionToStr();
        this.room.memory.sources[this.getName()] = {
            id: this.id,
            pos: rts.setPosToStr(this.pos)
        };
    }

    public getName(): string {
        return `${this.room.name}Source[${this.pos.x},${this.pos.y}]`;
    }
}
