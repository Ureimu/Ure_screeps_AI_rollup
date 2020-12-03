import { getBpEnergy, getBpNum } from "utils/bodypartsGenerator";
import { roleListx } from "../indexBodySetting";

export function getBpByRole(roleName: string, roomName: string) {

    let roleList = roleListx(Game.rooms[roomName]);

    for (let key in roleList) {
        if (key == roleName) {
            let roleBodySetting = roleList[key].bodysetting
            //只对第一个部件对象进行repeat操作。
            let i = Math.max(_.floor(
                (Game.rooms[roomName].energyAvailable -
                    getBpEnergy(roleBodySetting) +
                    getBpEnergy([roleBodySetting[0]])) /
                    getBpEnergy([roleBodySetting[0]])
            ),1);
            roleBodySetting[0].repeat = i;
            if(getBpNum(roleBodySetting)<=roleList[key].maxBodyParts){
                return roleBodySetting;
            } else {
                roleBodySetting[0].repeat = 1;
                let num = getBpNum(roleBodySetting)
                let num0 = getBpNum([roleBodySetting[0]])
                let notFix = (roleList[key].maxBodyParts-num+num0)/num0
                let repeatnum = _.floor(notFix)
                let i = (repeatnum>=1?repeatnum:1);
                //console.log(`(${roleList[key].maxBodyParts} - ${num} +${num0}) /${num0} = ${notFix} = ${i} = ${repeatnum}`)
                roleBodySetting[0].repeat = i;
                return roleBodySetting;
            }
        }
    }

    console.log("没有该任务名称，身体部件生成失败:"+roomName+roleName);
    return [{}];
}
