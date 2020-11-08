import taskPool from "task/utils/taskPool";
import { PriorityQueue } from "task/utils/PriorityQueue";

// 自定义的 Source 的拓展
export class SourceExtension extends Source {

    /**
     * 返回周围正方形的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace():RoomPosition[] {
        let square:RoomPosition[] = this.pos.getSquare();
        let BlankSpace: RoomPosition[] = [];
        for (const squared of square) {
            const look = squared.look();
            look.forEach(function(lookObject) {
                if(lookObject.type == 'terrain' &&
                lookObject.terrain != 'wall') {
                    BlankSpace.push(squared);
                }
            });
        }
        return BlankSpace;
    };

    /**
     * 初始化source的memory.
     *
     */
    initsMemory(): void {
        Memory.sources[this.room.name+'Source'+'['+this.pos.x+','+this.pos.y+']']={
            id : this.id,
            blankSpace : this.checkBlankSpace(),
            taskPool : {
                spawnQueue: [],
                taskQueue: [],
            },
        };
    };
}
