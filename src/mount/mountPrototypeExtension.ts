import { RoomPositionExtension } from "./mount.RoomPosition";
import { CreepExtension } from "./mount.Creep";
import { SourceExtension } from "./mount.Source";
import { SpawnExtension } from "./mount.Spawn";
import { RoomExtension } from "./mount.Room";

// 挂载所有的额外属性和方法
const assignPrototype = function (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes("Getter")) {
            Object.defineProperty(obj1.prototype, key.split("Getter")[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            });
        } else obj1.prototype[key] = obj2.prototype[key];
    });
};

export function mountPrototypeExtension(): void {
    if (!global.prototypeMounted) {
        console.log("[mount] 重新挂载PrototypeExtension拓展");
        global.prototypeMounted = true;

        const plugins = [RoomPositionExtension, CreepExtension, SourceExtension, SpawnExtension, RoomExtension];
        const prototypes = [RoomPosition, Creep, Source, StructureSpawn, Room];

        for (let i = 0, j = plugins.length; i < j; i++) {
            assignPrototype(prototypes[i], plugins[i]);
        }
    }
}
