import {mountRoomPositionEx} from './mount.RoomPoition'
import {mountCreepEx} from './mount.Creep'
import {mountSourceEx} from './mount.Source'
import {mountSpawnEx} from './mount.Spawn'

// 挂载所有的额外属性和方法
export function mountPrototypeExtension():void {
    if (!global.prototypeMounted) {
        console.log('[mount] 重新挂载拓展')
        global.prototypeMounted = true;

        mountRoomPositionEx();
        mountCreepEx();
        mountSourceEx();
        mountSpawnEx();
    }
}
