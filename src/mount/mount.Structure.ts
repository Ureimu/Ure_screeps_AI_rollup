import { constructionSitesInf } from "construction";
import { getPosFromStr } from "construction/utils/strToRoomPosition";

// 自定义的 Room 的拓展
export class StructureWithExtension extends Structure {
    public buildingName(): string {
        if (!global.constructionMemory[this.id]) {
            for (const con in Memory.rooms[this.room.name].construction) {
                const m: { [name: string]: constructionSitesInf<AnyStructure> } =
                    Memory.rooms[this.room.name].construction;
                if (m[con].structureType === this.structureType) {
                    for (const nStr of m[con].pos) {
                        const n = getPosFromStr(nStr);
                        if (this.pos.isEqualTo(n)) {
                            if (
                                m[con].id.findIndex(value => value === ((this.id as unknown) as Id<AnyStructure>)) ===
                                -1
                            ) {
                                Memory.rooms[this.room.name].construction[con].id.push(
                                    (this.id as unknown) as Id<AnyStructure>
                                );
                            }
                            global.constructionMemory[this.id] = {
                                name: con
                            };
                            return con;
                        }
                    }
                }
            }
            global.constructionMemory[this.id] = {
                name: ""
            };
            return "";
        } else {
            return global.constructionMemory[this.id].name;
        }
    }
}
