import { getBpEnergy, getBpNum } from "utils/bodypartsGenerator";
import { roleListx } from "../indexBodySetting";

export function getBpByRole(roleName: string, roomName: string): bpgGene[] {
    const roleList = roleListx(Game.rooms[roomName]);

    for (const key in roleList) {
        if (key === roleName) {
            const roleBodySetting = roleList[key].bodysetting;
            // 只对第一个部件对象进行repeat操作。
            const i = Math.max(
                _.floor(
                    (Game.rooms[roomName].energyAvailable -
                        getBpEnergy(roleBodySetting) +
                        getBpEnergy([roleBodySetting[0]])) /
                        getBpEnergy([roleBodySetting[0]])
                ),
                1
            );
            roleBodySetting[0].repeat = i;
            if (getBpNum(roleBodySetting) <= roleList[key].maxBodyParts) {
                return roleBodySetting;
            } else {
                roleBodySetting[0].repeat = 1;
                const num = getBpNum(roleBodySetting);
                const num0 = getBpNum([roleBodySetting[0]]);
                const notFix = (roleList[key].maxBodyParts - num + num0) / num0;
                const repeatnum = _.floor(notFix);
                const j = repeatnum >= 1 ? repeatnum : 1;
                // console.log(`(${roleList[key].maxBodyParts} - ${num} +${num0}) /${num0} = ${notFix} = ${i} = ${repeatnum}`)
                roleBodySetting[0].repeat = j;
                return roleBodySetting;
            }
        }
    }

    console.log("没有该任务名称，身体部件生成失败:" + roomName + roleName);
    return [{}];
}
