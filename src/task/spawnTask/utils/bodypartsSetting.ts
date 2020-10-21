import { getBpEnergy, getBpNum } from "utils/bodypartsGenerator";
import { roleListx } from "../indexBodySetting";

export function getBpByRole(roleName: string, roomName: string) {

    let roleList: { [name: string]: bpgGene[] } = roleListx();

    for (let key in roleList) {
        if (key == roleName) {
            //只对第一个部件对象进行repeat操作。
            let i = _.floor(
                (Game.rooms[roomName].energyAvailable -
                    getBpEnergy(roleList[key]) +
                    getBpEnergy([roleList[key][0]])) /
                    getBpEnergy([roleList[key][0]])
            );
            i=i>0?i:1;
            roleList[key][0].repeat = i;
            if(getBpNum(roleList[key])<=50){
                return roleList[key];
            } else {
                let i = _.floor(
                    (50 -
                        getBpNum(roleList[key]) +
                        getBpNum([roleList[key][0]])) /
                        getBpNum([roleList[key][0]])
                );
                roleList[key][0].repeat = i;
                return roleList[key];
            }
        }
    }

    console.log("没有该任务名称，身体部件生成失败:"+roomName+roleName);
    return [{}];
}
